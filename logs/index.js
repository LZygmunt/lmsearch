const fs = require( 'fs' );

const errorLog = error => {
  let now = new Date();
  let errorData = `[SERVER_ERROR][${ now.toLocaleString()}] ${ error }\n`;
  fs.appendFile( __dirname + '/../logs/errors.txt', errorData, err => {
    if ( err ) throw err;
    console.log( `Error was added to [${__dirname }/../logs/errors.txt].` );
  });
};

module.exports = {
  errorLog
};
