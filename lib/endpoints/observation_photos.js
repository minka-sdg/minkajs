const MinkaAPI = require( "../minka_api" );

const observationPhotos = class observationPhotos {
  static create( params, options ) {
    return MinkaAPI.upload( "observation_photos", params, options );
  }

  static update( params, opts = {} ) {
    const options = { ...opts, method: "PUT" };
    return MinkaAPI.upload( "observation_photos/:id", params, options );
  }

  static delete( params, options ) {
    return MinkaAPI.delete( "observation_photos/:id", params, options );
  }
};

module.exports = observationPhotos;
