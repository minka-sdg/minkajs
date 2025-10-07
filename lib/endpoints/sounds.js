const iNaturalistAPI = require( "../inaturalist_api" );

const sounds = class sounds {
  static create( params, options ) {
    return iNaturalistAPI.upload( "sounds", params, options );
  }
};

module.exports = sounds;
