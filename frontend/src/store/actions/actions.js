import actionTypes from "../../utils/actionTypes";
import flags from "../../utils/flags";

const api = "/api/base";

const setCountArticles = countArticles => ({
  type: actionTypes.SET_COUNT_ARTICLES,
  countArticles: countArticles
});

const setArticles = articles => ({
  type: actionTypes.SET_ARTICLES,
  articles
});

const setFoundArticles = foundArticles => ({
  type: actionTypes.SET_FOUND_ARTICLES,
  foundArticles
});

const setFlag = flag => ({
  type: actionTypes.SET_FLAG,
  flag
});

export const setIndividuals = individuals => ({
  type: actionTypes.SET_INDIVIDUALS,
  individuals
});

export const setSearchValue = searchValue => ({
  type: actionTypes.SET_SEARCH_VALUE,
  searchValue
});

const setPage = page => ({
  type: actionTypes.SET_PAGE,
  page
});

const setInstances = instances => ({
  type: actionTypes.SET_INSTANCES,
  instances
});

/**
 * Funkcja uzupełniająca statusy odpowiedzi z serwera
 * @param {boolean} withIf - Flaga wprowadzająca instrukcję if else
 * @param arg - Lista argumentów funkcji, gdzie:
 *   arg[ 0 ] - Parametr przyjmuje odpowiedź z serwera
 *   arg[ 1 ] - Parametr przyjmuję referencję do funkcji dispatch
 *   arg[ 2 ] - Parametr przyjmuję tablicę złożoną z warunku i ciała do instrukcji if
 *              jeśli withIf jest true, w przeciwnym wypadku przyjmuje tablice referencji do funkcji
 *              i ich argumentów bez instrukcji warunkowej
 *   arg[ 3 ] - Parametr przyjmuję tablicę złożoną z referencji do funkcji i ich argumentów
 */
const checkStatus = async ( withIf, ...arg ) => {
  switch ( arg[ 0 ].status ) {
    case 200:
    //fetchData = await fetchData.json();
      arg[ 0 ] = await arg[ 0 ].json();
      // true/false
      if ( withIf ) {
        // ( fetchData.data.flag && fetchData.data.flag === flags.trySync )
        if ( arg[ 0 ].data.flag && arg[ 0 ].data.flag === arg[ 2 ][ 0 ]) {
        //dispatch(       funkcja( parametr ));
          arg[ 1 ]( arg[ 2 ][ 1 ]( arg[ 2 ][ 0 ]));
        } else {
          for (let i = 0; i < arg[ 3 ].length; i++ ) {
            if ( arg[ 3 ][ i ][ 1 ] === "articles" ) {
            //dispatch(        setArticles( fetchData.data.articles ));
              arg[ 1 ]( arg[ 3 ][ i ][ 0 ]( arg[ 0 ].data.articles ));
            } else if ( arg[ 3 ][ i ][ 1 ] === "results" ) {
            //dispatch(   setCountArticles( fetchData.results ));
              arg[ 1 ]( arg[ 3 ][ i ][ 0 ]( arg[ 0 ].results ));
            } else {
            //dispatch(            funkcja( parametr ));
              arg[ 1 ]( arg[ 3 ][ i ][ 0 ]( arg[ 3 ][ i ][ 1 ]));
            }
          }
        }
      } else {
        let tab = [ "foundArticles", "individuals", "searchValue", "instances" ]; // tablica obiektów zawierających się w data
        for ( let i = 0; i < arg[ 2 ].length; i++ ) {
          if ( tab.includes( arg[ 2 ][ i ][ 1 ]) ) {
          //dispatch(   setFoundArticles( fetchData.data.foundArticles ));
            arg[ 1 ]( arg[ 2 ][ i ][ 0 ]( arg[ 0 ].data[ arg[ 2 ][ i ][ 1 ]]));
          } else if ( arg[ 2 ][ i ][ 1 ] === "results") {
          //dispatch(   setCountArticles( fetchData.results.foundArticles ));
            arg[ 1 ]( arg[ 2 ][ i ][ 0 ]( arg[ 0 ].results.foundArticles ));
          } else {
          //dispatch(            funkcja( parametr ));
            arg[ 1 ]( arg[ 2 ][ i ][ 0 ]( arg[ 2 ][ i ][ 1 ]));
          }
        }
      }
      break;
    case 404:
      arg[ 1 ]( setFlag( flags.notFound ));
      break;
    case 500:
      arg[ 1 ]( setFlag( flags.error ));
      break;
    default:
      arg[ 1 ]( setFlag( flags.unknown ));
      break;
  }
};

export const fetchArticles = () => async ( dispatch, getState ) => {
  dispatch( setFlag( flags.pending ));
  let fetchData = await fetch( api, { method: 'GET', mode: 'cors'});
  let ifTab = [ flags.trySync, setFlag ];
  let elseTab = [
    [ setArticles, "articles" ],
    [ setCountArticles, "results" ],
    [ setFlag, flags.got ]
  ];
  await checkStatus( true, fetchData, dispatch, ifTab, elseTab );
};

export const updateArticles = () => async ( dispatch, getState ) => {
  dispatch( setFlag( flags.pending ));
  let fetchData = await fetch( api, { method: 'PATCH', mode: 'cors'});
  let ifTable = [ flags.isActual, setFlag ];
  let elseTable = [[ setFlag, flags.updated ]];
  await checkStatus( true, fetchData, dispatch, ifTable, elseTable );
};

export const searchArticles = searchStr => searchStr === ""
  ? fetchArticles()
  : async ( dispatch, getState ) => {
    dispatch( setFlag( flags.pending ));

    let fetchData = await fetch( `${ api }/search?q=${ searchStr }`, { method: 'GET', mode: 'cors' });
    let funcTable = [
      [ setPage, 1 ],
      [ setFoundArticles, "foundArticles" ],
      [ setIndividuals, "individuals" ],
      [ setSearchValue, "searchValue" ],
      [ setCountArticles, "results" ],
      [ setFlag, flags.found ]
    ];
    await checkStatus( false, fetchData, dispatch, funcTable );
  };

export const setCurrentPage = page => ( dispatch, getState ) => {
  dispatch( setPage( page ));
};

export const pageNotFound = pathname => async ( dispatch, getState ) => {
  let fetchData = await fetch( pathname, { method: 'GET', mod: 'cors' });

  if ( fetchData.status === 404 ) {
    dispatch( setFlag( flags.notFound ));
  } else if ( fetchData.status === 500 ) {
    dispatch( setFlag( flags.error ));
  }
};

export const getAllInstances = () => async ( dispatch, getState ) => {
  let fetchData = await fetch( `${ api }/instances`, { method: 'GET', mode: 'cors' });

  let funcTable = [[ setInstances, "instances" ]];
  await checkStatus( false, fetchData, dispatch, funcTable );
};
