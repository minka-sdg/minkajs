const { expect } = require( "chai" );
const Model = require( "../../lib/models/model" );

describe( "Model", ( ) => {
  describe( "constructor", ( ) => {
    it( "populates model attributes", ( ) => {
      const o = new Model( { name: "modelname" } );
      expect( o.constructor.name ).to.eq( "Model" );
      expect( o.name ).to.eq( "modelname" );
    } );
  } );

  describe( "typifyResultsResponse", ( ) => {
    it( "turns response results into types", ( ) => {
      const r = { results: [{ name: "modelname" }] };
      expect( r.results[0].constructor.name ).to.eq( "Object" );
      Model.typifyResultsResponse( r, Model );
      expect( r.results[0].constructor.name ).to.eq( "Model" );
      expect( r.results[0].name ).to.eq( "modelname" );
    } );

    it( "does nothing if there are no results", ( ) => {
      const r = { count: 156 };
      Model.typifyResultsResponse( r, Model );
      expect( r ).to.deep.eq( { count: 156 } );
    } );
  } );
} );
