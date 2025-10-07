const Model = require( "./model" );

const Flag = class Flag extends Model {
  static typifyInstanceResponse( response ) {
    return super.typifyInstanceResponse( response, Flag );
  }
};

module.exports = Flag;
