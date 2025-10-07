const Model = require( "./model" );
const User = require( "./user" );

const Relationship = class Relationship extends Model {
  static typifyInstanceResponse( response ) {
    const r = super.typifyInstanceResponse( response, Relationship );
    r.friendUser = User.typifyInstanceResponse( r.friend_user, User );
    delete r.friend_user;
    return r;
  }

  static typifyResultsResponse( response ) {
    if ( response.results ) {
      response.results = response.results.map( r => Relationship.typifyInstanceResponse( r ) );
    }
    return response;
  }
};

module.exports = Relationship;
