const MinkaAPI = require( "../minka_api" );
const Comment = require( "../models/comment" );

const comments = class comments {
  static create( params, options ) {
    return MinkaAPI.post( "comments", params, options )
      .then( Comment.typifyInstanceResponse );
  }

  static update( params, options ) {
    return MinkaAPI.put( "comments/:id", params, options )
      .then( Comment.typifyInstanceResponse );
  }

  static delete( params, options ) {
    return MinkaAPI.delete( "comments/:id", params, options );
  }
};

module.exports = comments;
