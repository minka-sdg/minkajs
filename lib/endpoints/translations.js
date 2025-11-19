const MinkaAPI = require( "../minka_api" );

const translations = class translations {
  static locales( params = { }, options = { } ) {
    return MinkaAPI.get( "translations/locales", params, options );
  }
};

module.exports = translations;
