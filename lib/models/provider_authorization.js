const Model = require( "./model" );

const ProviderAuthorization = class ProviderAuthorization extends Model {
  static typifyInstanceResponse( response ) {
    return super.typifyInstanceResponse( response, ProviderAuthorization );
  }
};

module.exports = ProviderAuthorization;
