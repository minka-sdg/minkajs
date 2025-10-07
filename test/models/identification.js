const { expect } = require( "chai" );
const Identification = require( "../../lib/models/identification" );

describe( "Identification", ( ) => {
  describe( "constructor", ( ) => {
    it( "creates a taxon", ( ) => {
      const i = new Identification( { id: 11, taxon: { id: 22, name: "testtaxon" } } );
      expect( i.taxon.constructor.name ).to.eq( "Taxon" );
      expect( i.taxon.id ).to.eq( 22 );
      expect( i.taxon.name ).to.eq( "testtaxon" );
    } );
  } );
} );
