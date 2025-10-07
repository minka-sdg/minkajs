const iNaturalistAPI = require( "../inaturalist_api" );
const Photo = require( "../models/photo" );

const photos = class photos {
  static create( params, options ) {
    return iNaturalistAPI.upload( "photos", params, options );
  }

  static update( params, options ) {
    return iNaturalistAPI.put( "photos/:id", params, options )
      .then( Photo.typifyInstanceResponse );
  }
};

module.exports = photos;
