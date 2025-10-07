const { expect } = require( "chai" );
const nock = require( "nock" );
const search = require( "../../lib/endpoints/search" );
const testHelper = require( "../../lib/test_helper" );

describe( "Search", ( ) => {
  describe( "fetch", ( ) => {
    it( "gets from /search", done => {
      nock( "http://localhost:4000" )
        .get( "/v1/search" )
        .reply( 200, testHelper.mockResponse );
      search( ).then( r => {
        expect( r.test_uri ).to.eq( "/v1/search" );
        expect( r.total_results ).to.eq( 1 );
        done( );
      } );
    } );
  } );
} );
