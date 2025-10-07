const { expect } = require( "chai" );
const nock = require( "nock" );
const controlledTerms = require( "../../lib/endpoints/controlled_terms" );

describe( "ControlledTerms", ( ) => {
  describe( "search", ( ) => {
    it( "returns ControlledTerm records", done => {
      nock( "http://localhost:4000" )
        .get( "/v1/controlled_terms" )
        .reply( 200, {
          total_results: 1,
          page: 1,
          per_page: 1,
          results: [
            {
              id: 6,
              ontology_uri: "",
              uri: "",
              valid_within_clade: 12,
              is_value: false,
              multivalued: true,
              values: [
                {
                  id: 7,
                  ontology_uri: "",
                  uri: "",
                  valid_within_clade: 19,
                  label: "Flowering"
                },
                {
                  id: 8,
                  ontology_uri: "",
                  uri: "",
                  valid_within_clade: 19,
                  label: "Fruiting"
                }
              ],
              label: "Plant Phenology"
            }
          ]
        } );
      controlledTerms.search( ).then( r => {
        expect( r.results[0].constructor.name ).to.eq( "ControlledTerm" );
        done( );
      } );
    } );
  } );
} );
