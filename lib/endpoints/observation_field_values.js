const MinkaAPI = require( "../minka_api" );
const ObservationFieldValue = require( "../models/observation_field_value" );

const observationFieldValues = class observationFieldValues {
  static create( params, options ) {
    return MinkaAPI.post( "observation_field_values", params, options )
      .then( ObservationFieldValue.typifyInstanceResponse );
  }

  static update( params, options ) {
    return MinkaAPI.put( "observation_field_values/:id", params, options )
      .then( ObservationFieldValue.typifyInstanceResponse );
  }

  static delete( params, options ) {
    return MinkaAPI.delete( "observation_field_values/:id", params, options );
  }
};

module.exports = observationFieldValues;
