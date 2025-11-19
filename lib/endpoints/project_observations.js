const MinkaAPI = require( "../minka_api" );
const ProjectObservation = require( "../models/project_observation" );

const projectObservations = class projectObservations {
  static create( params, options ) {
    return MinkaAPI.post( "project_observations", params, options )
      .then( ProjectObservation.typifyInstanceResponse );
  }

  static update( params, options ) {
    return MinkaAPI.put( "project_observations/:id", params, options )
      .then( ProjectObservation.typifyInstanceResponse );
  }

  static delete( params, options ) {
    return MinkaAPI.delete( "project_observations/:id", params, options );
  }
};

module.exports = projectObservations;
