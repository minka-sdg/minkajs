const { expect } = require( "chai" );
const nock = require( "nock" );
const flags = require( "../../lib/endpoints/flags" );

describe( "Flags", ( ) => {
  describe( "create", ( ) => {
    it( "posts to /flags", done => {
      nock( "http://localhost:3000" )
        .post( "/flags", { body: "testbody" } )
        .reply( 200, { id: 1 } );
      flags.create( { body: "testbody" } ).then( ( ) => {
        done( );
      } );
    } );

    it( "adds an authorization header for the api_token", done => {
      nock( "http://localhost:3000", { reqheaders: { Authorization: "key" } } )
        .post( "/flags", { body: "testbody" } )
        .reply( 200, { id: 1 } );
      flags.create( { body: "testbody" }, { api_token: "key" } ).then( ( ) => {
        done( );
      } );
    } );
  } );

  describe( "delete", ( ) => {
    it( "deletes to /flags", done => {
      nock( "http://localhost:3000" )
        .delete( "/flags/1" )
        .reply( 200, { id: 1 } );
      flags.delete( { id: 1 } ).then( ( ) => {
        done( );
      } );
    } );

    it( "throws errors", done => {
      flags.delete( { any: "thing" } ).catch( e => {
        expect( e.message ).to.eq( "id required" );
        done( );
      } );
    } );
  } );
} );
