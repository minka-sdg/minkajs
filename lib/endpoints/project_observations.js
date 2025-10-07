const iNaturalistAPI = require( "../inaturalist_api" );
const ProjectObservation = require( "../models/project_observation" );

const projectObservations = class projectObservations {
  static create( params, options ) {
    return iNaturalistAPI.post( "project_observations", params, options )
      .then( ProjectObservation.typifyInstanceResponse );
  }

  static update( params, options ) {
    return iNaturalistAPI.put( "project_observations/:id", params, options )
      .then( ProjectObservation.typifyInstanceResponse );
  }

  static delete( params, options ) {
    return iNaturalistAPI.delete( "project_observations/:id", params, options );
  }
};

module.exports = projectObservations;
