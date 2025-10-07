const Model = require( "./model" );

const ProjectObservation = class ProjectObservation extends Model {
  static typifyInstanceResponse( response ) {
    return super.typifyInstanceResponse( response, ProjectObservation );
  }
};

module.exports = ProjectObservation;
