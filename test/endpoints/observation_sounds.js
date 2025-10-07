const { expect } = require( "chai" );
const nock = require( "nock" );
const observationSounds = require( "../../lib/endpoints/observation_sounds" );

describe( "ObservationSounds", ( ) => {
  describe( "create", ( ) => {
    it( "posts to /observation_sounds", done => {
      nock( "http://localhost:3000" )
        .post( "/observation_sounds" )
        .reply( 200, { id: 1 } );
      observationSounds.create( { body: "testbody" } ).then( ( ) => {
        done( );
      } );
    } );
  } );

  describe( "update", ( ) => {
    it( "puts to /observation_sounds/:id", done => {
      nock( "http://localhost:3000" )
        .put( "/observation_sounds/1" )
        .reply( 200, { id: 1 } );
      observationSounds.update( { id: 1 } ).then( ( ) => {
        done( );
      } );
    } );
  } );

  describe( "delete", ( ) => {
    it( "deletes to /observation_sounds/:id", done => {
      nock( "http://localhost:3000" )
        .delete( "/observation_sounds/1" )
        .reply( 200, { id: 1 } );
      observationSounds.delete( { id: 1 } ).then( ( ) => {
        done( );
      } );
    } );

    it( "throws errors", done => {
      observationSounds.delete( { any: "thing" } ).catch( e => {
        expect( e.message ).to.eq( "id required" );
        done( );
      } );
    } );
  } );
} );
