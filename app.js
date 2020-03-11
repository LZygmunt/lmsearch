const express = require( 'express' );
const cors = require( 'cors' );
const Routes = require( './routes' );
const bodyParser = require( 'body-parser' );

let app = express();

app.use( bodyParser.json());
app.use( bodyParser.urlencoded({ extended: true }));
app.use( '/api/base', Routes.baseRoutes );

// app.use( '*', Routes.invalidRoutes );
//
// app.options( '*', cors());

if ( process.env.NODE_ENV === 'production' ) {
  app.use(express.static( 'frontend/build' ));

  app.get( '*', ( req, res ) => {
    res.sendFile( path.join( __dirname, 'frontend', 'build', 'index.html' ));
  });
}

module.exports = {
  app
};
