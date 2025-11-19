const MinkaAPI = require( "../minka_api" );
const Identification = require( "../models/identification" );
const Taxon = require( "../models/taxon" );
const User = require( "../models/user" );
const Observation = require( "../models/observation" );

const identifications = class identifications {
  static create( params, options ) {
    return MinkaAPI.post( "identifications", params, options )
      .then( Identification.typifyInstanceResponse );
  }

  static update( params, options ) {
    return MinkaAPI.put( "identifications/:id", params, options )
      .then( Identification.typifyInstanceResponse );
  }

  static delete( params, options ) {
    return MinkaAPI.delete( "identifications/:id", params, options );
  }

  static similar_species( params, opts = {} ) { // eslint-disable-line camelcase
    const options = {
      ...opts,
      useAuth: true
    };
    return MinkaAPI.get( "identifications/similar_species", params, options )
      .then( response => {
        if ( response.results ) {
          response.results = response.results.map( ( { taxon, ...otherTaxonAttributes } ) => (
            {
              ...otherTaxonAttributes,
              taxon: new Taxon( taxon )
            } ) );
        }
        return response;
      } );
  }

  static recent_taxa( params, opts ) { // eslint-disable-line camelcase
    const options = { ...( opts || {} ) };
    options.useAuth = true;
    return MinkaAPI.get( "identifications/recent_taxa", params, options )
      .then( response => {
        if ( response.results ) {
          response.results = response.results.map( res => {
            const { taxon, identification, ...otherAttributes } = res;
            const r = {
              ...otherAttributes,
              taxon: new Taxon( taxon ),
              identification: new Identification( identification )
            };
            if ( r.identification?.observation?.identifications ) {
              delete r.identification.observation.identifications;
            }
            r.identification.observation = new Observation( r.identification.observation );
            return r;
          } );
        }
        return response;
      } );
  }

  static recent_taxa_revisited( params, opts ) { // eslint-disable-line camelcase
    const options = { ...( opts || {} ) };
    options.useAuth = true;
    return MinkaAPI.get( "identifications/recent_taxa_revisited", params, options )
      .then( response => {
        if ( response.results ) {
          response.results = response.results.map( res => {
            const { taxon, identification, ...otherAttributes } = res;
            const r = {
              ...otherAttributes,
              taxon: new Taxon( taxon ),
              identification: new Identification( identification )
            };
            if ( r.identification?.observation?.identifications ) {
              delete r.identification.observation.identifications;
            }
            r.identification.observation = new Observation( r.identification.observation );
            return r;
          } );
        }
        return response;
      } );
  }

  static identifiers( params, options ) {
    return MinkaAPI.get( "identifications/identifiers", params, options )
      .then( response => {
        if ( response.results ) {
          response.results = response.results.map( r => {
            const { user, ...otherAttributes } = r;
            return {
              ...otherAttributes,
              user: new User( user )
            };
          } );
        }
        return response;
      } );
  }

  static categories( params, opts = { } ) {
    return MinkaAPI.get( "identifications/categories", params, opts );
  }
};

module.exports = identifications;
