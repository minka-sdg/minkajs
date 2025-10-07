const { expect } = require( "chai" );
const ConservationStatus = require( "../../lib/models/conservation_status" );

describe( "ConservationStatus", ( ) => {
  describe( "iucnStatus", ( ) => {
    it( "returns IUCN equivalent status for not evaluated", ( ) => {
      const cs = new ConservationStatus( { iucn: 0 } );
      expect( cs.iucnStatus( ) ).to.eq( "not evaluated" );
    } );
  } );

  describe( "iucnStatusCode", ( ) => {
    it( "returns CR for critically endangered", ( ) => {
      const cs = new ConservationStatus( { iucn: 50 } );
      expect( cs.iucnStatusCode( ) ).to.eq( "CR" );
    } );
  } );

  describe( "statusText", ( ) => {
    it( "returns critically endangered for IUCN CR", ( ) => {
      const cs = new ConservationStatus( { iucn: 50, authority: "IUCN Red List" } );
      expect( cs.statusText( ) ).to.eq( "critically endangered" );
    } );
    it( "returns imperiled for NatureServe G2G3", ( ) => {
      const cs = new ConservationStatus( { status: "G2G3", authority: "NatureServe" } );
      expect( cs.statusText( ) ).to.eq( "imperiled" );
    } );
    it( "returns amenazada for Norma A", ( ) => {
      const cs = new ConservationStatus( { status: "A", authority: "Norma Oficial 059" } );
      expect( cs.statusText( ) ).to.eq( "amenazada" );
    } );
    it( "returns endangered for e", ( ) => {
      const cs = new ConservationStatus( { status: "E" } );
      expect( cs.statusText( ) ).to.eq( "endangered" );
    } );
    it( "returns threatened for t", ( ) => {
      const cs = new ConservationStatus( { status: "T" } );
      expect( cs.statusText( ) ).to.eq( "threatened" );
    } );
    it( "defaults to description (code)", ( ) => {
      const cs = new ConservationStatus( { status: "foo", description: "bar" } );
      expect( cs.statusText( ) ).to.eq( "bar (foo)" );
    } );
  } );
} );
