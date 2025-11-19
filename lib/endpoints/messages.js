const MinkaAPI = require( "../minka_api" );
const Message = require( "../models/message" );

const messages = class messages {
  static create( params, options ) {
    return MinkaAPI.post( "messages", params, options )
      .then( Message.typifyInstanceResponse );
  }

  static search( params, options = {} ) {
    const opts = {
      ...options,
      useWriteApi: true,
      useAuth: true
    };
    return MinkaAPI.get( "messages", params, opts )
      .then( Message.typifyResultsResponse );
  }

  static fetch( params, options = {} ) {
    const opts = {
      ...options,
      useWriteApi: true,
      useAuth: true
    };
    return MinkaAPI.get( "messages/:id", params, opts )
      .then( Message.typifyResultsResponse );
  }

  static delete( params, options ) {
    return MinkaAPI.delete( "messages/:id", params, options );
  }

  static unread( params, options = {} ) {
    const opts = {
      ...options,
      useWriteApi: true,
      useAuth: true
    };
    return MinkaAPI.get( "messages/count", params, opts );
  }
};

module.exports = messages;
