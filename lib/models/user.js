const Model = require( "./model" );

const User = class User extends Model {
  static typifyResultsResponse( response ) {
    return super.typifyResultsResponse( response, User );
  }

  static typifyInstanceResponse( response ) {
    return super.typifyInstanceResponse( response, User );
  }
};

module.exports = User;
