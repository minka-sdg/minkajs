const Model = require( "./model" );

const ObservationFieldValue = class ObservationFieldValue extends Model {
  static typifyInstanceResponse( response ) {
    return super.typifyInstanceResponse( response, ObservationFieldValue );
  }
};

module.exports = ObservationFieldValue;
