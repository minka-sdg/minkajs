const MinkaAPI = require( "../lib/minka_api" );

beforeEach( ( ) => {
  MinkaAPI.setConfig( {
    apiURL: "http://localhost:4000/v1",
    writeApiURL: "http://localhost:3000"
  } );
} );
