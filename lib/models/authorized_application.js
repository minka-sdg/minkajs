const Model = require( "./model" );

const AuthorizedApplication = class AuthorizedApplication extends Model {
  static typifyInstanceResponse( response ) {
    return super.typifyInstanceResponse( response, AuthorizedApplication );
  }
};

module.exports = AuthorizedApplication;
