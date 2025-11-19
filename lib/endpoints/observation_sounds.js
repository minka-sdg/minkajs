const MinkaAPI = require( "../minka_api" );

const observationSounds = class observationSounds {
  static create( params, options ) {
    return MinkaAPI.upload( "observation_sounds", params, options );
  }

  static update( params, opts = {} ) {
    const options = { ...opts, method: "PUT" };

    return MinkaAPI.upload( "observation_sounds/:id", params, options );
  }

  static delete( params, options ) {
    return MinkaAPI.delete( "observation_sounds/:id", params, options );
  }
};

module.exports = observationSounds;
