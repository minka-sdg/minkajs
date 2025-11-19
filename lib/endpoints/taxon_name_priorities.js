const MinkaAPI = require( "../minka_api" );
const TaxonNamePriority = require( "../models/taxon_name_priority" );

const taxonNamePriorities = class taxonNamePriorities {
  static create( params, options ) {
    return MinkaAPI.post( "taxon_name_priorities", params, options )
      .then( TaxonNamePriority.typifyInstanceResponse );
  }

  static update( params, options ) {
    return MinkaAPI.put( "taxon_name_priorities/:id", params, options )
      .then( TaxonNamePriority.typifyInstanceResponse );
  }

  static delete( params, options ) {
    return MinkaAPI.delete( "taxon_name_priorities/:id", params, options );
  }
};

module.exports = taxonNamePriorities;
