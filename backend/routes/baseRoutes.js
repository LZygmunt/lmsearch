const express = require( 'express' );
const { baseControllers } = require( '../controllers' );

const router = express.Router();

router
  .route( '/' )
  .get( baseControllers.getArticles )
  .patch( baseControllers.updateArticles );

router
  .route( '/search?' )
  .get( baseControllers.searchArticles );

router
  .route( '/instances' )
  .get( baseControllers.getAllInstances );

module.exports = router;
