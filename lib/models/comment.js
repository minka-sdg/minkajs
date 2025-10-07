const Model = require( "./model" );

const Comment = class Comment extends Model {
  static typifyInstanceResponse( response ) {
    return super.typifyInstanceResponse( response, Comment );
  }
};

module.exports = Comment;
