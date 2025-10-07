const Model = require( "./model" );

const Annotation = class Annotation extends Model {
  static typifyInstanceResponse( response ) {
    return super.typifyInstanceResponse( response, Annotation );
  }
};

module.exports = Annotation;
