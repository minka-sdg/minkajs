const util = class util {
  static isBrowser( ) {
    return (
      typeof document !== "undefined"
      && typeof document.querySelector !== "undefined"
    );
  }

  static isNode( ) {
    return (
      typeof process !== "undefined"
      && typeof process.env !== "undefined"
    );
  }

  static browserMetaTagContent( metaTagName ) {
    if ( util.isBrowser( ) ) {
      const element = document.querySelector( `meta[name="${metaTagName}"]` );
      return ( element && element.getAttribute( "content" ) );
    }
    return null;
  }

  static nodeENV( envVariableName ) {
    return util.isNode( ) ? process.env[envVariableName] : null;
  }
};

module.exports = util;
