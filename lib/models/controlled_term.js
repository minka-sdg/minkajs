const Model = require( "./model" );

const ControlledTerm = class ControlledTerm extends Model {
  constructor( attrs ) {
    super( attrs );
    if ( this.values ) {
      this.values = this.values.map( v => new ControlledTerm( v ) );
    }
  }

  static typifyResultsResponse( response ) {
    return super.typifyResultsResponse( response, ControlledTerm );
  }

  static typifyInstanceResponse( response ) {
    return super.typifyInstanceResponse( response, ControlledTerm );
  }
};

module.exports = ControlledTerm;
