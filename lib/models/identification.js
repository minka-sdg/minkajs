const Model = require( "./model" );
const Taxon = require( "./taxon" );

const Identification = class Identification extends Model {
  constructor( attrs ) {
    super( attrs );
    if ( this.taxon && this.taxon !== undefined ) {
      this.taxon = new Taxon( this.taxon );
    }
  }

  static typifyInstanceResponse( response ) {
    return super.typifyInstanceResponse( response, Identification );
  }
};

module.exports = Identification;
