const { errorLog } = require( '../logs' );
const {
  searcher,
  crawler,
  allArticles,
  getInstances
} = require( '../engine' );

const getArticles = async ( req, res ) => {
  try {
    let articles = await allArticles();
    res.status( 200 ).json({
      status: "success",
      results: articles.length,
      data: {
        articles
      }
    });
  } catch ( error ) {
    errorLog( error );
    res.status( 500 ).json({
      status: "failed",
      data: {
        flag: "Try Sync"
      }
    });
  }
};

const updateArticles = async ( req, res ) => {
  try {
    let crawlerData = await crawler();
    if ( crawlerData === 0 ) {
      res.status( 200 ).json({
        status: "success",
        results: crawlerData,
        data: {
          flag: "Is Actual"
        }
      });
    } else {
      res.status( 200 ).json({
        status: "success",
        results: crawlerData.length,
        data: {
          foundArticles: crawlerData
        }
      });
    }
  } catch ( error ) {
    errorLog( error );
    res.sendStatus( 500 );
  }
};

const searchArticles = async ( req, res ) => {
  try {
    let foundArticles = await searcher( req.query.q );
    res.status( 200 ).json({
      status: "success",
      results: {
        foundArticles: foundArticles.articlesFound.length,
        individuals: foundArticles.individuals.length
      },
      data: {
        foundArticles: foundArticles.articlesFound,
        individuals: foundArticles.individuals,
        searchValue: foundArticles.searchValue
      }
    })
  } catch ( error ) {
    errorLog( error );
    res.sendStatus( 500 );
  }
};

const getAllInstances = async ( req, res ) => {
  let fetchData = await getInstances();
  res.status( 200 ).json({
    status: "success",
    results: fetchData.length,
    data: {
      instances: fetchData
    }
  })
};

module.exports = {
  updateArticles,
  searchArticles,
  getArticles,
  getAllInstances
};
