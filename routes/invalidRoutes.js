const express = require( 'express' );
const { invalidController } = require( '../controllers' );

const router = express.Router();

router
  .route( '*' )
  .get( invalidController.notFound )
  .delete( invalidController.notFound )
  .post( invalidController.notFound )
  .put( invalidController.notFound )
  .patch( invalidController.notFound );


module.exports = router;
