const express = require( 'express' );
const cors = require( 'cors' );
const Routes = require( './routes' );

let app = express();

app.use( express.json());
app.use( '/api/base', Routes.baseRoutes );

app.use( '*', Routes.invalidRoutes );

app.options( '*', cors());

module.exports = {
  app
};
