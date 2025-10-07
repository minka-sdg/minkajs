const iNaturalistAPI = require( "../lib/inaturalist_api" );

beforeEach( ( ) => {
  iNaturalistAPI.setConfig( {
    apiURL: "http://localhost:4000/v1",
    writeApiURL: "http://localhost:3000"
  } );
} );
