const MinkaAPI = require( "../minka_api" );
const Photo = require( "../models/photo" );

const photos = class photos {
  static create( params, options ) {
    return MinkaAPI.upload( "photos", params, options );
  }

  static update( params, options ) {
    return MinkaAPI.put( "photos/:id", params, options )
      .then( Photo.typifyInstanceResponse );
  }
};

module.exports = photos;
