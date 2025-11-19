const MinkaAPI = require( "../minka_api" );
const Flag = require( "../models/flag" );

const flags = class flags {
  static create( params, options ) {
    return MinkaAPI.post( "flags", params, options )
      .then( Flag.typifyInstanceResponse );
  }

  static update( params, options ) {
    return MinkaAPI.put( "flags/:id", params, options )
      .then( Flag.typifyInstanceResponse );
  }

  static delete( params, options ) {
    return MinkaAPI.delete( "flags/:id", params, options );
  }
};

module.exports = flags;
