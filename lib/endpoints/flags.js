const iNaturalistAPI = require( "../inaturalist_api" );
const Flag = require( "../models/flag" );

const flags = class flags {
  static create( params, options ) {
    return iNaturalistAPI.post( "flags", params, options )
      .then( Flag.typifyInstanceResponse );
  }

  static update( params, options ) {
    return iNaturalistAPI.put( "flags/:id", params, options )
      .then( Flag.typifyInstanceResponse );
  }

  static delete( params, options ) {
    return iNaturalistAPI.delete( "flags/:id", params, options );
  }
};

module.exports = flags;
