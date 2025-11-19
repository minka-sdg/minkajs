const MinkaAPI = require( "../minka_api" );
const Relationship = require( "../models/relationship" );

const relationships = class relationships {
  static create( params, options ) {
    return MinkaAPI.post( "relationships", params, options )
      .then( Relationship.typifyInstanceResponse );
  }

  static search( params, options ) {
    let useWriteApi = false;
    if ( MinkaAPI.writeApiURL && MinkaAPI.writeApiURL.match( /\/v\d/ ) ) {
      useWriteApi = true;
    }
    const opts = {
      ...options,
      useWriteApi,
      useAuth: true
    };
    return MinkaAPI.get( "relationships", params, opts )
      .then( Relationship.typifyResultsResponse );
  }

  static update( params, options ) {
    return MinkaAPI.put( "relationships/:id", params, options );
  }

  static delete( params, options ) {
    return MinkaAPI.delete( "relationships/:id", params, options );
  }
};

module.exports = relationships;
