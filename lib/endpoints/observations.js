const MinkaAPI = require( "../minka_api" );
const ControlledTerm = require( "../models/controlled_term" );
const Observation = require( "../models/observation" );
const Project = require( "../models/project" );
const Taxon = require( "../models/taxon" );
const User = require( "../models/user" );

const observations = class observations {
  static create( params, options ) {
    return MinkaAPI.post( "observations", params, options )
      .then( Observation.typifyInstanceResponse );
  }

  static update( params, options ) {
    return MinkaAPI.put( "observations/:id", params, options )
      .then( Observation.typifyInstanceResponse );
  }

  static delete( params, options ) {
    return MinkaAPI.delete( "observations/:id", params, options );
  }

  static fave( params, options ) {
    return observations.vote( params, options );
  }

  static unfave( params, options ) {
    return observations.unvote( params, options );
  }

  static vote( params, options ) {
    return MinkaAPI.post( "votes/vote/observation/:id", params, options )
      .then( Observation.typifyInstanceResponse );
  }

  static unvote( params, options ) {
    return MinkaAPI.delete( "votes/unvote/observation/:id", params, options );
  }

  static subscribe( params, options ) {
    return MinkaAPI.post( "subscriptions/Observation/:id/subscribe", params, options );
  }

  static review( params, options ) {
    const p = { ...params, reviewed: "true" };
    return MinkaAPI.post( "observations/:id/review", p, options );
  }

  static unreview( params, options ) {
    const p = { ...params };
    return MinkaAPI.delete( "observations/:id/review", p, options );
  }

  static qualityMetrics( params, options ) {
    return MinkaAPI.get( "observations/:id/quality_metrics", params, options );
  }

  static setQualityMetric( params, options ) {
    return MinkaAPI.post( "observations/:id/quality/:metric", params, options );
  }

  static deleteQualityMetric( params, options ) {
    return MinkaAPI.delete( "observations/:id/quality/:metric", params, options );
  }

  static fetch( ids, params, opts = { } ) {
    return MinkaAPI.fetch( "observations", ids, params, opts )
      .then( Observation.typifyResultsResponse );
  }

  static search( params, opts = { } ) {
    return MinkaAPI.get( "observations", params, { ...opts, useAuth: true } )
      .then( Observation.typifyResultsResponse );
  }

  static identifiers( params, opts = { } ) {
    return MinkaAPI.get( "observations/identifiers", params, opts )
      .then( response => {
        if ( response.results ) {
          response.results = response.results.map( r => (
            { ...r, user: new User( r.user ) }
          ) );
        }
        return response;
      } );
  }

  static observers( params, opts = { } ) {
    return MinkaAPI.get( "observations/observers", params, opts )
      .then( response => {
        if ( response.results ) {
          response.results = response.results.map( r => (
            { ...r, user: new User( r.user ) }
          ) );
        }
        return response;
      } );
  }

  static speciesCounts( params, opts = { } ) {
    return MinkaAPI.get( "observations/species_counts", params, { ...opts, useAuth: true } )
      .then( response => {
        if ( response.results ) {
          response.results = response.results.map( r => (
            { ...r, taxon: new Taxon( r.taxon ) }
          ) );
        }
        return response;
      } );
  }

  static iconicTaxaCounts( params, opts = { } ) {
    return MinkaAPI.get( "observations/iconic_taxa_counts", params, { ...opts, useAuth: true } )
      .then( response => {
        if ( response.results ) {
          response.results = response.results.map( r => (
            { ...r, taxon: new Taxon( r.taxon ) }
          ) );
        }
        return response;
      } );
  }

  static iconicTaxaSpeciesCounts( params, opts = { } ) {
    return MinkaAPI.get( "observations/iconic_taxa_species_counts", params, { ...opts, useAuth: true } )
      .then( response => {
        if ( response.results ) {
          response.results = response.results.map( r => (
            { ...r, taxon: new Taxon( r.taxon ) }
          ) );
        }
        return response;
      } );
  }

  static popularFieldValues( params, opts = { } ) {
    return MinkaAPI.get( "observations/popular_field_values", params, opts )
      .then( response => {
        if ( response.results ) {
          response.results = response.results.map( res => {
            const r = { ...res };
            r.controlled_attribute = new ControlledTerm( r.controlled_attribute );
            r.controlled_value = new ControlledTerm( r.controlled_value );
            return r;
          } );
        }
        return response;
      } );
  }

  static umbrellaProjectStats( params, opts = { } ) {
    return MinkaAPI.get( "observations/umbrella_project_stats", params, opts )
      .then( response => {
        if ( response.results ) {
          response.results = response.results.map( r => (
            { ...r, project: new Project( r.project ) }
          ) );
        }
        return response;
      } );
  }

  static histogram( params, opts = { } ) {
    return MinkaAPI.get( "observations/histogram", params, opts );
  }

  static qualityGrades( params, opts = { } ) {
    return MinkaAPI.get( "observations/quality_grades", params, opts );
  }

  static subscriptions( params, options = { } ) {
    return MinkaAPI.get(
      "observations/:id/subscriptions",
      params,
      MinkaAPI.optionsUseAuth( options )
    );
  }

  static taxonSummary( params, options = { } ) {
    return MinkaAPI.get( "observations/:id/taxon_summary", params, options );
  }

  static updates( params, options = { } ) {
    return MinkaAPI.get(
      "observations/updates",
      params,
      MinkaAPI.optionsUseAuth( options )
    );
  }

  static viewedUpdates( params, options = { } ) {
    return MinkaAPI.put(
      "observations/:id/viewed_updates",
      params,
      MinkaAPI.optionsUseAuth( options )
    );
  }

  static identificationCategories( params, opts = { } ) {
    return MinkaAPI.get( "observations/identification_categories", params, opts );
  }

  static taxonomy( params, opts = { } ) {
    return MinkaAPI.get( "observations/taxonomy", params, opts )
      .then( Taxon.typifyResultsResponse );
  }

  static similarSpecies( params, opts = { } ) {
    const options = { ...opts || { } };
    options.useAuth = true;
    return MinkaAPI.get( "observations/similar_species", params, options )
      .then( response => {
        if ( response.results ) {
          response.results = response.results.map( r => (
            { ...r, taxon: new Taxon( r.taxon ) }
          ) );
        }
        return response;
      } );
  }

  static taxa( params = { }, opts = { } ) {
    return MinkaAPI.get( "observations/taxa", params, opts );
  }

  static deleted( params, options = { } ) {
    return MinkaAPI.get(
      "observations/deleted",
      params,
      MinkaAPI.optionsUseAuth( options )
    );
  }
};

module.exports = observations;
