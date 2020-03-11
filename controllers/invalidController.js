const { errorLog } = require( '../logs' );

const notFound = async (req, res ) => {
  errorLog( `Incorrect url: ${ req.originalUrl }` );
  res.sendStatus( 404 );
};

module.exports = {
  notFound
};
