const Model = require( "./model" );

const Place = class Place extends Model {
  static typifyResultsResponse( response ) {
    return super.typifyResultsResponse( response, Place );
  }
};

module.exports = Place;
