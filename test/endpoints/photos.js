const { expect } = require( "chai" );
const nock = require( "nock" );
const photos = require( "../../lib/endpoints/photos" );

describe( "Photos", ( ) => {
  describe( "update", ( ) => {
    it( "puts to /photos", done => {
      nock( "http://localhost:3000" )
        .put( "/photos/1" )
        .reply( 200, { id: 1, license: "cc0" } );
      photos.update( { id: 1, photo: { id: 1, license: "cc0" } } )
        .then( r => {
          expect( r.license ).to.eq( "cc0" );
          done( );
        } )
        .catch( e => {
          expect( e ).to.be.undefined;
          done( );
        } );
    } );
  } );
} );
