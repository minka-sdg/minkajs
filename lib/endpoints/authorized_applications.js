const MinkaAPI = require( "../minka_api" );
const AuthorizedApplication = require( "../models/authorized_application" );

const authorizedApplications = class authorizedApplications {
  static search( params, opts = { } ) {
    return MinkaAPI.get( "authorized_applications", params, { ...opts, useAuth: true } )
      .then( AuthorizedApplication.typifyResultsResponse );
  }

  static delete( params, options ) {
    let endpoint = "oauth/authorized_applications/:id";
    if ( MinkaAPI.writeApiURL && MinkaAPI.writeApiURL.match( /\/v\d/ ) ) {
      endpoint = "authorized_applications/:id";
    }
    return MinkaAPI.delete( endpoint, params, options );
  }
};

module.exports = authorizedApplications;
