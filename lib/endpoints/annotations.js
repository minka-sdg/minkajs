const MinkaAPI = require( "../minka_api" );
const Annotation = require( "../models/annotation" );

const annotations = class annotations {
  static create( params, options ) {
    return MinkaAPI.post( "annotations", params, options )
      .then( Annotation.typifyInstanceResponse );
  }

  static delete( params, options ) {
    return MinkaAPI.delete( "annotations/:id", params, options );
  }

  static vote( params, options ) {
    return MinkaAPI.post( "votes/vote/annotation/:id", params, options )
      .then( Annotation.typifyInstanceResponse );
  }

  static unvote( params, options ) {
    return MinkaAPI.delete( "votes/unvote/annotation/:id", params, options );
  }
};

module.exports = annotations;
