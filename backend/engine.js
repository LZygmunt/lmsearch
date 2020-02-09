const { sendRequest } = require( './crawler' );
const { initializeDB, queryDB, destroyDB } = require( './db' );
const { table } = require( './db/dbscript' );
const { matchResults, getKB } = require( './kb' );
const { errorLog } = require( './logs' );

const allArticles = async () => {
  let articlesResponse;
  let articles = [];

  try {
    articlesResponse = await queryDB( table.getArticles );
  } catch ( err ) {
    errorLog( err );
  }

  for ( const article of articlesResponse ) {
    let index = articles.findIndex( el => el.id_desc === article.id_desc );
    if ( index >= 0 ){
      articles[ index ].keyword.push( article.keyword );
    } else {
      articles.push({ ...article, keyword: [ article.keyword ]});
    }
  }

  return articles;
};

/**
 * Bot pełzający po portalu linux-magazine.pl sczytujący spisy treści danych wydań.
 * @property {Array} result - Tablica zawierająca pobrane spisy treści wydań.
 * @property {string} query - Zapytanie SQL do tabeli descs.
 * @property {string} queryLinks - Zapytanie SQL do tabeli links.
 * @property {string} queryContents - Zapytanie SQL do tabeli contents.
 * @property {number} idLink - Numer indeksu ostatniego dodanego linku wydania.
 * @property {number} idDesc - Numer indeksu ostatniego dodanego opisu artukułu.
 * @property {Array} number - Tablica linków do wydań.
 * @returns {Promise<number>}
 */
const crawler = async () => {
  let result, query, queryLinks, queryContents, idLink, idDesc, number;

  /**
   * Stworzenie bazy danych w przypadku gdy takowa nie istnieje. Wypisze błąd gdy się pojawi.
   */
  try {
    await initializeDB();

    /**
     * Wypełnienie tabeli keywords.
     */
    let count = await queryDB( table.checkIfEmpty );
    count = count[ 0 ].count;
    count === 0 && queryDB( table.fillKeywords );

    // language=MariaDB
    queryLinks = "SELECT number FROM links;";
    number = ( await queryDB( queryLinks )).map( item => item.number );
  } catch ( err ) {
    errorLog( err );
  }

  /**
   * Pobranie treści wydań. W przypadku gdy baza jest aktualna zostaje przerwany porces pełzania po portalu.
   * Wypisze błąd gdy się pojawi.
   */
  try {
    result = await sendRequest( number );
    if ( result === 0 ) return process.exitCode = 0;
  } catch ( err ) {
    errorLog( err );
  }

  /**
   * Pobranie ostatniego indeksu z tabeli links. Wypisze błąd gdy się pojawi.
   */
  try {
    // language=MariaDB
    queryLinks = "SELECT id_link FROM links ORDER BY id_link DESC LIMIT 1;";
    idLink = await queryDB( queryLinks );
  } catch ( err ) {
    errorLog( err );
  }

  /**
   * Pobranie ostatniego indeksu z tabeli descs. Wypisze błąd gdy się pojawi.
   */
  try {
    // language=MariaDB
    query = "SELECT id_desc FROM descs ORDER BY id_desc DESC LIMIT 1;";
    idDesc = await queryDB( query );
  } catch ( err ) {
    errorLog( err );
  }

  /**
   * W przypadku gdy baza jest pusta wstawi pod obydwie zmienne 1, w przeciwnym razie zwiększy je o 1.
   */
  idLink = idLink.length === 0 ? 1 : idLink[ 0 ].id_link + 1;
  idDesc = idDesc.length === 0 ? 1 : idDesc[ 0 ].id_desc + 1;

  /**
   * Sporządzenie zapytań uzupełniających bazę danych.
   */
  // language=MariaDB
  query = "INSERT INTO descs VALUES ";
  // language=MariaDB
  queryLinks = "INSERT INTO links VALUES ";
  // language=MariaDB
  queryContents = "INSERT INTO contents( id_link, id_desc ) VALUES ";

  for ( let elem of result ) {
    for ( let desc of elem.headers_array ) {
      // language=MariaDB
      query += `(${ idDesc }, ${ JSON.stringify( desc.header )}, ${ JSON.stringify( desc.desc ) }),`;
      // language=MariaDB
      queryContents += `(${ idLink }, ${ idDesc }),`;
      idDesc++;
    }

    number = elem.number.split( /\s/ );
    // language=MariaDB
    queryLinks += `( ${ idLink }, ${ JSON.stringify( elem.link )}, ${ JSON.stringify( elem.number )}, ${ number[ number.length - 1 ]}, ${ JSON.stringify( elem.imgUrl )}),`;
    idLink++
  }
  query = query.slice( 0, -1 ) + ";";
  queryContents = queryContents.slice( 0, -1 ) + ";";
  queryLinks = queryLinks.slice( 0, -1 ) + ";";

  try {
    await queryDB( query );
    await queryDB( queryLinks );
    await queryDB( queryContents );
  } catch ( err ) {
    errorLog( err );
  }

  return result;
};

const searcher = async str => {
  let result = matchResults( str );
  let mapArr = result.map( res => res.id.toLowerCase());

  let articles;
  let articlesFound = [];

  try {
    articles = await allArticles();
  } catch ( e ) {
    errorLog( e );
  }

  for ( const article of articles ) {
    if ( article.keyword.some( tag => mapArr.includes( tag.toLowerCase()))) {
      articlesFound.push( article );
    }
  }

  mapArr = result.map( res => res.id);

  return { searchValue: str, individuals: mapArr, articlesFound };
};

const getInstances = async () => {
  try {
    return await getKB();
  } catch ( e ) {
    errorLog( e );
  }
};

module.exports = {
  searcher,
  crawler,
  allArticles,
  getInstances
};
