const MinkaAPI = require( "../minka_api" );
const Project = require( "../models/project" );

const projects = class projects {
  static fetch( ids, params ) {
    return MinkaAPI.fetch( "projects", ids, params )
      .then( Project.typifyResultsResponse );
  }

  static search( params, options ) {
    return MinkaAPI.get( "projects", params, options )
      .then( Project.typifyResultsResponse );
  }

  static autocomplete( params ) {
    return MinkaAPI.get( "projects/autocomplete", params )
      .then( Project.typifyResultsResponse );
  }

  static create( params, options ) {
    return MinkaAPI.upload( "projects", params, options )
      .then( Project.typifyInstanceResponse );
  }

  static update( params, options ) {
    return MinkaAPI
      .upload( "projects/:id", params, { ...options, method: "put" } )
      .then( Project.typifyInstanceResponse );
  }

  static delete( params, options ) {
    return MinkaAPI.delete( "projects/:id", params, options );
  }

  static join( params, options ) {
    return MinkaAPI.post( "projects/:id/join", params, options );
  }

  static leave( params, options ) {
    return MinkaAPI.delete( "projects/:id/leave", params, options );
  }

  static add( params, options ) {
    return MinkaAPI.post( "projects/:id/add", params, options );
  }

  static remove( params, options ) {
    return MinkaAPI.delete( "projects/:id/remove", params, options );
  }

  static posts( params, options ) {
    return MinkaAPI.get( "projects/:id/posts", params, options );
  }

  static subscribe( params, options ) {
    return MinkaAPI.post( "subscriptions/Project/:id/subscribe", params, options );
  }

  static subscriptions( params, options ) {
    return MinkaAPI.get(
      "projects/:id/subscriptions",
      params,
      MinkaAPI.optionsUseAuth( options )
    );
  }

  static followers( params, options ) {
    return MinkaAPI.get( "projects/:id/followers", params, options );
  }

  static members( params, options ) {
    return MinkaAPI.get( "projects/:id/members", params, options );
  }

  static membership( params, options ) {
    return MinkaAPI.get(
      "projects/:id/membership",
      params,
      MinkaAPI.optionsUseAuth( options )
    );
  }

  static feature( params, options ) {
    return MinkaAPI.put( "projects/:id/feature", params, options );
  }

  static unfeature( params, options ) {
    return MinkaAPI.put( "projects/:id/unfeature", params, options );
  }
};

module.exports = projects;
