const MinkaAPI = require( "../minka_api" );

const sounds = class sounds {
  static create( params, options ) {
    return MinkaAPI.upload( "sounds", params, options );
  }
};

module.exports = sounds;
