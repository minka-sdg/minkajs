const MinkaAPI = require( "../minka_api" );
const Post = require( "../models/post" );

const posts = class posts {
  static search( params, options ) {
    return MinkaAPI.get( "posts", params, options )
      .then( Post.typifyArrayResponse );
  }

  static for_user( params, options ) { // eslint-disable-line camelcase
    return MinkaAPI.get( "posts/for_user", params, { ...options, useAuth: true } )
      .then( Post.typifyArrayResponse );
  }

  static create( params, options ) {
    return MinkaAPI.post( "posts", params, options )
      .then( Post.typifyInstanceResponse );
  }

  static update( params, options ) {
    return MinkaAPI.put( "posts/:id", params, options )
      .then( Post.typifyInstanceResponse );
  }

  static delete( params, options ) {
    return MinkaAPI.delete( "posts/:id", params, options );
  }
};

module.exports = posts;
