const { expect } = require( "chai" );
const nock = require( "nock" );
const relationships = require( "../../lib/endpoints/relationships" );

describe( "Relationships", ( ) => {
  describe( "search", ( ) => {
    const stub = {
      id: 1,
      login: "foo",
      created_at: "2019-01-24T12:12:36.398-08:00",
      updated_at: "2019-01-24T13:02:16.771-08:00",
      following: true,
      trust: true,
      friend_user: {
        id: 2,
        login: "bar"
      }
    };
    it( "should return expected response", done => {
      const nockScope = nock( "http://localhost:4000" )
        .get( "/v1/relationships" )
        .reply( 200, {
          results: [stub]
        } );
      relationships.search( )
        .then( r => {
          nockScope.done( );
          expect( r.results[0].friendUser.id ).to.eq( stub.friend_user.id );
          expect( r.results[0].friendUser.login ).to.eq( stub.friend_user.login );
          expect( r.results[0].created_at ).to.eq( stub.created_at );
          expect( r.results[0].following ).to.eq( stub.following );
          expect( r.results[0].trust ).to.eq( stub.trust );
          done( );
        } )
        .catch( done );
    } );
  } );
} );
