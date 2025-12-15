// cross-fetch wraps https://github.com/github/fetch, which doesn't seem to work
// quite right in React Native (see https://github.com/github/fetch/issues/601
// and https://github.com/lquixada/cross-fetch/issues/2). Conditional requires
// like this seem to work, though they do result in unnecessarily large files
// for React native

// Use native FormData in Node.js 18+ (works better with fetch)
// Fall back to form-data package for older Node.js or browser environments
let FormData;
let useNativeFormData = false;
if ( typeof process !== "undefined" && process.versions && process.versions.node ) {
  // In Node.js 18+, native FormData is available globally and works better with fetch
  // Check if native FormData is available (Node.js 18+)
  // Native FormData in Node.js is a class, not the form-data package
  if ( typeof globalThis.FormData !== "undefined" ) {
    // Check if it's the native one by checking if it doesn't have getHeaders method
    // (form-data package's FormData has getHeaders, native doesn't)
    try {
      const testFD = new globalThis.FormData();
      if ( typeof testFD.getHeaders !== "function" ) {
        FormData = globalThis.FormData;
        useNativeFormData = true;
      } else {
        FormData = require( "form-data" );
      }
    } catch ( e ) {
      FormData = require( "form-data" );
    }
  } else {
    // Fall back to form-data package for older Node.js versions
    FormData = require( "form-data" );
  }
} else {
  // In browser or other environments, use form-data package
  FormData = require( "form-data" );
}

let localFetch;
if ( typeof ( fetch ) !== "undefined" ) {
  localFetch = fetch;
} else {
  localFetch = require( "cross-fetch" ); // eslint-disable-line global-require
}

const querystring = require( "querystring" );
const rison = require( "rison-node" );
const util = require( "./util" );
const MinkaAPIResponse = require( "./models/minka_api_response" );

// Helper to convert ReadStream to Blob for native FormData
const streamToBlob = ( stream, options = {} ) => {
  return new Promise( ( resolve, reject ) => {
    const chunks = [];
    stream.on( "data", chunk => chunks.push( chunk ) );
    stream.on( "end", () => {
      const buffer = Buffer.concat( chunks );
      // Use global Blob (available in Node.js 18+)
      const BlobConstructor = typeof globalThis.Blob !== "undefined"
        ? globalThis.Blob
        : require( "buffer" ).Blob;
      const blob = new BlobConstructor( [buffer], { type: options.type || "application/octet-stream" } );
      resolve( blob );
    } );
    stream.on( "error", reject );
  } );
};

const MinkaAPI = class MinkaAPI {
  static fetch( route, ids, p, options ) {
    let fetchIDs = ids;
    const params = p ? { ...p } : { };
    if ( !Array.isArray( fetchIDs ) ) { fetchIDs = [fetchIDs]; }
    const apiToken = MinkaAPI.apiToken( options );
    const headers = apiToken ? { Authorization: apiToken } : { };
    headers["Content-Type"] = "application/json";
    let fieldsObject;
    if ( params && params.fields && typeof ( params.fields ) === "object" ) {
      fieldsObject = params.fields;
      params.fields = rison.encode( params.fields );
    }
    const query = typeof ( params ) === "object" && Object.keys( params ).length > 0
      ? `?${querystring.stringify( params )}`
      : "";
    const baseURL = `${MinkaAPI.apiURL}/${route}/${fetchIDs.join( "," )}`;
    const urlWithQueryParams = `${baseURL}${query}`;
    let fetch;
    if ( urlWithQueryParams.length > 2000 && fieldsObject ) {
      headers.Accept = "application/json";
      headers["X-HTTP-Method-Override"] = "GET";
      fetch = localFetch( baseURL, {
        method: "post",
        headers,
        body: JSON.stringify( { ...params, fields: fieldsObject } )
      } );
    } else {
      fetch = localFetch( urlWithQueryParams, { headers } );
    }
    return fetch
      .then( MinkaAPI.thenText )
      .then( MinkaAPI.thenJson )
      .then( MinkaAPI.thenWrap );
  }

  // Note, this generally assumes that all GET requests go to the Node API. If
  // you want to GET something from the Rails API, call this with
  // useWriteApi: true
  static get( route, params, opts ) {
    const options = { ...(opts || { }) };
    const interpolated = MinkaAPI.interpolateRouteParams( route, params );
    if ( interpolated.err ) { return interpolated.err; }
    const thisRoute = interpolated.route;
    const apiToken = options.useAuth ? MinkaAPI.apiToken( options ) : null;
    const headers = {
      ...(options.headers || { }),
      Accept: "application/json",
      // DO NOT OMIT! Without this, fetch in React Native on Android will not
      // even execute the request
      "Content-Type": "application/json",
      "X-Via": "minkajs"
    };
    if ( apiToken ) {
      headers.Authorization = apiToken;
    }
    const host = options.useWriteApi ? MinkaAPI.writeApiURL : MinkaAPI.apiURL;
    const baseURL = `${host}/${thisRoute}`;
    const { remainingParams } = interpolated;
    let fieldsObject;
    if ( remainingParams && remainingParams.fields && typeof ( remainingParams.fields ) === "object" ) {
      fieldsObject = remainingParams.fields;
      remainingParams.fields = rison.encode( remainingParams.fields );
    }
    const query = (
      remainingParams
      && Object.keys( remainingParams ).length > 0
    ) ? `?${querystring.stringify( remainingParams )}` : "";
    const urlWithQueryParams = `${baseURL}${query}`;
    let fetch;
    if ( urlWithQueryParams.length > 2000 && fieldsObject ) {
      headers.Accept = "application/json";
      headers["X-HTTP-Method-Override"] = "GET";
      headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS, PUT, DELETE, HEAD";
      fetch = localFetch( baseURL, {
        method: "post",
        headers,
        body: JSON.stringify( { ...(remainingParams || {}), fields: fieldsObject } )
      } );
    } else {
      fetch = localFetch( urlWithQueryParams, { headers } );
    }
    return fetch
      .then( MinkaAPI.thenText )
      .then( MinkaAPI.thenJson )
      .then( MinkaAPI.thenWrap );
  }

  static async post( route, p, opts ) {
    const options = { ...( opts || { } ) };
    let params = { ...( p || { } ) };
    // interpolate path params, e.g. /:id => /1
    const interpolated = MinkaAPI.interpolateRouteParams( route, params );
    if ( interpolated.err ) { return interpolated.err; }
    const thisRoute = interpolated.route;
    // set up request headers
    const headers = {
      ...(options.headers || {}),
      Accept: "application/json",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS, PUT, DELETE, HEAD",
      "X-Via": "minkajs"
    };
    if ( options.user_agent ) {
      headers["user-agent"] = options.user_agent;
    }
    if ( options.remote_ip ) {
      headers["x-forwarded-for"] = options.remote_ip;
    }
    // set up authentication
    const csrf = MinkaAPI.csrf( );
    const apiToken = MinkaAPI.apiToken( options );
    if ( apiToken ) {
      headers.Authorization = apiToken;
    } else if ( csrf ) {
      params[csrf.param] = csrf.token;
    }
    // get the right host to send requests
    const host = MinkaAPI.methodHostPrefix( options );
    // make the request
    let body;
    if ( options.upload ) {
      body = new FormData( );
      // Before params get "flattened" extract the fields and encode them as a
      // single JSON string, which the server can handle
      const { fields } = interpolated.remainingParams;
      if ( fields ) {
        delete interpolated.remainingParams.fields;
        body.append( "fields", JSON.stringify( fields ) );
      }
      // multipart requests reference all nested parameter names as strings
      // so flatten arrays into "arr[0]" and objects into "obj[prop]"
      params = MinkaAPI.flattenMultipartParams( interpolated.remainingParams );

      // For native FormData, we need to convert streams to Blobs
      // For form-data package, we can use streams directly
      const appendPromises = [];
      Object.keys( params ).forEach( k => {
        // FormData params can include options like file upload sizes
        if ( params[k] && params[k].type === "custom" && params[k].value ) {
          if ( useNativeFormData && params[k].value.readable ) {
            // Native FormData needs Blob, not ReadStream
            // Convert stream to Blob asynchronously
            const appendPromise = streamToBlob( params[k].value, params[k].options )
              .then( blob => {
                const filename = params[k].options && params[k].options.filename
                  ? params[k].options.filename
                  : "file";
                body.append( k, blob, filename );
              } );
            appendPromises.push( appendPromise );
          } else {
            // form-data package can handle streams directly
            body.append( k, params[k].value, params[k].options );
          }
        } else {
          body.append( k, ( typeof params[k] === "boolean" ) ? params[k].toString( ) : params[k] );
        }
      } );

      // Wait for all stream-to-blob conversions if using native FormData
      if ( appendPromises.length > 0 ) {
        await Promise.all( appendPromises );
      }
      // Handle headers differently for native FormData vs form-data package
      if ( useNativeFormData ) {
        // Native FormData in Node.js 18+ - don't set Content-Type, fetch will handle it
        // Remove any existing Content-Type header to let fetch set it automatically
        delete headers["Content-Type"];
        delete headers["content-type"];
      } else {
        // form-data package requires headers from getHeaders() to include boundary
        // Merge form-data headers with existing headers
        const formDataHeaders = body.getHeaders( );
        // Remove any existing Content-Type header to let form-data set it with boundary
        delete headers["Content-Type"];
        delete headers["content-type"];
        Object.assign( headers, formDataHeaders );
      }
    } else {
      headers["Content-Type"] = "application/json";
      body = JSON.stringify( interpolated.remainingParams );
    }
    const fetchOpts = {
      method: ( options.method || "post" ),
      credentials: ( options.same_origin ? "same-origin" : undefined ),
      headers
    };
    if ( options.method !== "head" ) {
      // Ensure body is set - form-data package's FormData is a readable stream
      // that fetch in Node.js 18+ should handle correctly
      fetchOpts.body = body;
    }
    let query = "";
    // Rails, at least, can read params from DELETE request URLs, but
    // cannot read post data. So append any params to the URL
    if ( options.method === "delete" && Object.keys( interpolated.remainingParams ).length > 0 ) {
      query = `?${querystring.stringify( interpolated.remainingParams )}`;
    }
    const url = `${host}/${thisRoute}${query}`;

    // Debug: Log fetch options to verify body is set
    if ( options.upload ) {
      console.debug( "Fetch options for upload:", {
        method: fetchOpts.method,
        url,
        hasBody: !!fetchOpts.body,
        bodyType: fetchOpts.body ? fetchOpts.body.constructor.name : "none",
        headers: fetchOpts.headers
      } );
    }

    return localFetch( url, fetchOpts )
      .then( MinkaAPI.thenText )
      .then( MinkaAPI.thenJson );
  }

  // a variant of post using the http PUT method
  static head( route, params, opts = { } ) {
    const options = { ...(opts || {}), method: "head" };
    return MinkaAPI.post( route, params, options );
  }

  // a variant of post using the http PUT method
  static put( route, params, opts = { } ) {
    const options = { ...(opts || {}), method: "put" };
    return MinkaAPI.post( route, params, options );
  }

  // a variant of post using the http DELETE method
  static delete( route, params, opts = { } ) {
    const options = { ...(opts || {}), method: "delete" };
    return MinkaAPI.post( route, params, options );
  }

  static upload( route, params, opts = { } ) {
    // uploads can be POST or PUT
    const method = (opts || {}).method || "post";
    const options = { ...( opts || { } ), method, upload: true };
    return MinkaAPI.post( route, params, options );
  }

  static methodHostPrefix( opts ) {
    if ( opts.same_origin ) { return ""; }
    if ( opts.apiURL ) { return opts.apiURL; }
    return `${MinkaAPI.writeApiURL}`;
  }

  static csrf( ) {
    const param = util.browserMetaTagContent( "csrf-param" );
    const token = util.browserMetaTagContent( "csrf-token" );
    return ( param && token ) ? { param, token } : null;
  }

  static apiToken( opts = { } ) {
    const token = util.browserMetaTagContent( "minka-api-token" );
    if ( token ) { return token; }
    return opts.api_token;
  }

  static thenText( response ) {
    // return non-successes before parsing text, so the client can parse it
    if ( response.status < 200 || response.status >= 300 ) {
      const error = new Error( response.statusText );
      error.response = response;
      throw error;
    }
    // not using response.json( ) as there may be no JSON
    return response.text( ).then( text => (
      ( response.status >= 200 && response.status < 300 ) ? text : null
    ) );
  }

  static thenJson( text ) {
    if ( text ) { return JSON.parse( text ); }
    return text;
  }

  static thenWrap( response ) {
    if ( Array.isArray( response ) ) { return response; }
    return new MinkaAPIResponse( response );
  }

  // flatten nested objects like arrays into "arr[0]" and objects into "obj[prop]"
  static flattenMultipartParams( params, keyPrefix ) {
    if ( params === null ) { return params; }
    if ( typeof params === "object" ) {
      if ( !params.constructor || params.constructor.name === "Object" ) {
        if ( params.type === "custom" ) { return { [keyPrefix]: params }; }
        const flattenedParams = { };
        Object.keys( params ).forEach( k => {
          const newPrefix = keyPrefix ? `${keyPrefix}[${k}]` : k;
          Object.assign(
            flattenedParams,
            MinkaAPI.flattenMultipartParams( params[k], newPrefix )
          );
        } );
        return flattenedParams;
      }
      if ( params.constructor.name === "Array" ) {
        const flattenedParams = { };
        params.forEach( ( value, index ) => {
          const newPrefix = `${keyPrefix}[${index}]`;
          Object.assign(
            flattenedParams,
            MinkaAPI.flattenMultipartParams( params[index], newPrefix )
          );
        } );
        return flattenedParams;
      }
    }
    return { [keyPrefix]: params };
  }

  static setConfig( config = { } ) {
    const legacyEnv = MinkaAPI.legacyEnvConfig( config );
    const envURLConfig = legacyEnv.apiURL
      || util.browserMetaTagContent( "config:minka_api_url" )
      || util.nodeENV( "API_URL" );
    const envWriteURLConfig = legacyEnv.writeApiURL
      || util.browserMetaTagContent( "config:minka_write_api_url" )
      || util.nodeENV( "WRITE_API_URL" );
    MinkaAPI.apiURL = config.apiURL
      || envURLConfig
      || "https://api.minka-sdg.org/v1";
    MinkaAPI.writeApiURL = config.writeApiURL
      || envWriteURLConfig
      || envURLConfig
      || config.apiURL
      || "https://minka-sdg.org";
  }

  static legacyEnvConfig( config ) {
    const oldVariables = {
      envHostConfig: config.apiHost
        || util.browserMetaTagContent( "config:minka_api_host" )
        || util.nodeENV( "API_HOST" ),
      envWriteHostConfig: config.writeApiHost
        || util.browserMetaTagContent( "config:minka_write_api_host" )
        || util.nodeENV( "WRITE_API_HOST" ),
      envApiHostSSL: config.apiHostSSL || ( (
        util.browserMetaTagContent( "config:minka_api_host_ssl" )
        || util.nodeENV( "API_HOST_SSL" )
      ) === "true" ),
      envWriteHostSSL: config.writeApiHostSSL || ( (
        util.browserMetaTagContent( "config:minka_write_host_ssl" )
        || util.nodeENV( "WRITE_HOST_SSL" )
      ) === "true" )
    };
    const updatedVariables = { };
    if ( oldVariables.envHostConfig ) {
      updatedVariables.apiURL = ( oldVariables.envApiHostSSL ? "https://" : "http://" )
        + oldVariables.envHostConfig;
    }
    if ( oldVariables.envWriteHostConfig ) {
      updatedVariables.writeApiURL = ( oldVariables.envWriteHostSSL ? "https://" : "http://" )
        + oldVariables.envWriteHostConfig;
    }
    return updatedVariables;
  }

  static interpolateRouteParams( route, params ) {
    let err;
    let interpolatedRoute = route;
    const remainingParams = { ...(params || { }) };
    const interpolatedParams = {};
    const matches = route.match( /(:[a-z]+)(?=\/|$)/g );
    if ( matches ) {
      matches.forEach( sym => {
        if ( err ) { return; }
        const v = sym.substring( 1 );
        if ( remainingParams[v] ) {
          interpolatedRoute = interpolatedRoute.replace( sym, encodeURI( remainingParams[v] ) );
          interpolatedParams[sym] = encodeURI( remainingParams[v] );
          delete remainingParams[v];
        } else if ( sym === ":id" && remainingParams.uuid ) {
          // If a UUID was provided but not an ID, sub that in instead
          interpolatedRoute = interpolatedRoute.replace( sym, encodeURI( remainingParams.uuid ) );
          interpolatedParams[sym] = encodeURI( remainingParams.uuid );
          delete remainingParams.uuid;
        } else {
          err = new Promise( ( res, rej ) => {
            rej( new Error( `${v} required` ) );
          } );
        }
      } );
    }
    return {
      route: interpolatedRoute,
      interpolatedParams,
      remainingParams,
      err
    };
  }

  static optionsUseAuth( options ) {
    return { ...(options || {}), useAuth: true };
  }
};

MinkaAPI.setConfig( );

module.exports = MinkaAPI;
