const { expect } = require( "chai" );
const Observation = require( "../../lib/models/observation" );
const Taxon = require( "../../lib/models/taxon" );

describe( "Observation", ( ) => {
  describe( "constructor", ( ) => {
    it( "should assign latitude and longitude attributes", ( ) => {
      const lat = "38";
      const lon = "-123";
      const o = new Observation( {
        geojson: {
          coordinates: [
            lon,
            lat
          ],
          type: "Point"
        }
      } );
      expect( o.latitude ).to.eq( lat );
      expect( o.longitude ).to.eq( lon );
    } );

    it( "creates a identifications", ( ) => {
      const o = new Observation( { identifications: [{ id: 22, body: "testbody" }] } );
      expect( o.identifications[0].constructor.name ).to.eq( "Identification" );
      expect( o.identifications[0].id ).to.eq( 22 );
      expect( o.identifications[0].body ).to.eq( "testbody" );
    } );
  } );

  describe( "typifyResultsResponse", ( ) => {
    it( "turns response results into Observations", ( ) => {
      const r = { results: [{ name: "modelname" }] };
      expect( r.results[0].constructor.name ).to.eq( "Object" );
      Observation.typifyResultsResponse( r );
      expect( r.results[0].constructor.name ).to.eq( "Observation" );
      expect( r.results[0].name ).to.eq( "modelname" );
    } );
    it( "should typify the taxon", ( ) => {
      const r = {
        results: [
          {
            taxon: {
              name: "Taxon name"
            }
          }
        ]
      };
      expect( r.results[0].taxon ).to.be.an.instanceOf( Object );
      Observation.typifyResultsResponse( r );
      expect( r.results[0].taxon ).to.be.an.instanceOf( Taxon );
    } );
    it( "should typify the community taxon", ( ) => {
      const r = {
        results: [
          {
            community_taxon: {
              name: "Taxon name"
            }
          }
        ]
      };
      expect( r.results[0].community_taxon ).to.be.an.instanceOf( Object );
      Observation.typifyResultsResponse( r );
      expect( r.results[0].communityTaxon ).to.be.an.instanceOf( Taxon );
    } );
  } );

  describe( "photo", ( ) => {
    it( "is null by default", ( ) => {
      const o = new Observation( );
      expect( o.photo( ) ).to.eq( undefined );
    } );

    it( "is the first photo if present", ( ) => {
      const url1 = "http://localhost:3000/attachments/local_photos/files/519/square.jpg";
      const url2 = "http://localhost:3000/attachments/local_photos/files/520/square/pic2.jpg";
      const o = new Observation( {
        photos: [
          {
            attribution: "no rights reserved",
            id: 519,
            license_code: "cc0",
            url: url1
          },
          {
            attribution: "no rights reserved",
            id: 520,
            license_code: "cc0",
            url: url2
          }
        ]
      } );
      expect( o.photo( ) ).to.eq( url1 );
      expect( o.photo( ) ).to.not.eq( url2 );
    } );

    it( "takes optional sizes", ( ) => {
      const o = new Observation( {
        photos: [
          {
            attribution: "no rights reserved",
            id: 519,
            license_code: "cc0",
            url: "http://localhost:3000/attachments/local_photos/files/519/square/pic1.jpg"
          }
        ]
      } );
      expect( o.photo( "medium" ) ).to.match( /medium/ );
      expect( o.photo( "large" ) ).to.match( /large/ );
      expect( o.photo( ) ).to.match( /square/ );
    } );

    it( "returns if the photo has no url", ( ) => {
      const o = new Observation( { photos: [{ url: null }] } );
      expect( o.photo( ) ).to.not.exist;
    } );
  } );

  describe( "hasPhotos", ( ) => {
    it( "returns true if there are photos", ( ) => {
      const w = new Observation( { photos: [{ url: "photoURL" }] } );
      expect( w.hasPhotos( ) ).to.be.true;
      const wo = new Observation( { photos: [] } );
      expect( wo.hasPhotos( ) ).to.be.false;
    } );

    it( "returns false if there are no photos with URLs", ( ) => {
      const w = new Observation( { photos: [{ url: null }] } );
      expect( w.hasPhotos( ) ).to.be.false;
    } );
  } );

  describe( "hasSounds", ( ) => {
    it( "returns true if there are sounds", ( ) => {
      const w = new Observation( { sounds: [true] } );
      expect( w.hasSounds( ) ).to.be.true;
      const wo = new Observation( { sounds: [] } );
      expect( wo.hasSounds( ) ).to.be.false;
    } );
  } );

  describe( "hasMedia", ( ) => {
    it( "returns true if there are photos or sounds", ( ) => {
      let w = new Observation( { photos: [{ url: "photoURL" }] } );
      expect( w.hasMedia( ) ).to.be.true;
      w = new Observation( { sounds: [true] } );
      expect( w.hasMedia( ) ).to.be.true;
      const wo = new Observation( { photos: [], sounds: [] } );
      expect( wo.hasMedia( ) ).to.be.false;
    } );
  } );
} );
