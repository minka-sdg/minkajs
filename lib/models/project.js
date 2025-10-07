const Model = require( "./model" );

const Project = class Project extends Model {
  static typifyResultsResponse( response ) {
    return super.typifyResultsResponse( response, Project );
  }

  static typifyInstanceResponse( response ) {
    return super.typifyInstanceResponse( response, Project );
  }
};

module.exports = Project;
