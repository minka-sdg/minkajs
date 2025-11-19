const MinkaAPI = require( "../minka_api" );
const Place = require( "../models/place" );

const places = class places {
  static fetch( ids, params, opts = { } ) {
    return MinkaAPI.fetch( "places", ids, params, opts )
      .then( Place.typifyResultsResponse );
  }

  static autocomplete( params, opts = { } ) {
    return MinkaAPI.get( "places/autocomplete", params, opts )
      .then( Place.typifyResultsResponse );
  }

  static containing( params, opts = { } ) {
    return MinkaAPI.get( "places/containing", params, opts )
      .then( Place.typifyResultsResponse );
  }
};

module.exports = places;
