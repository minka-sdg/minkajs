const MinkaAPI = require( "../minka_api" );
const Announcement = require( "../models/announcement" );

const announcements = class announcements {
  static search( params, options ) {
    return MinkaAPI.get( "announcements", params, { ...options, useAuth: true } )
      .then( Announcement.typifyInstanceResponse );
  }

  static dismiss( params, options ) {
    return MinkaAPI.put( "announcements/:id/dismiss", params, options );
  }
};

module.exports = announcements;
