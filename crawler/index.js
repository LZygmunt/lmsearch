const cheerio = require( 'cheerio' );
const { get } = require( './request' );
const { errorLog } = require( '../logs');

const year = 'All'; //URL do strony z wszystkimi wydaniami, początkowy URL.
const prefixUrl = 'https://linux-magazine.pl/archive/main/archiveList/year/'; //Przedrostek URL do listy wydań.
let links; //Tablica zawierająca linki względne do wydań.
let numbersContent; //Tablica zawierająca sczytane spisy treści wydań.
/** @example
 * [
 *   {"/archiwum/wydanie/361": [
 *      {"Nagłówek1-361" : "Opis nagłówka1 dla numeru 361"},
 *      {"Nagłówek2-361" : "Opis nagłówka2 dla numeru 361"},
 *      {"Nagłówek3-361" : "Opis nagłówka3 dla numeru 361"}
 *   ]},
 *   {"/archiwum/wydanie/375": [
 *      {"Nagłówek1-375" : "Opis nagłówka1 dla numeru 375"},
 *      {"Nagłówek2-375" : "Opis nagłówka2 dla numeru 375"},
 *      {"Nagłówek3-375" : "Opis nagłówka3 dla numeru 375"}
 *   ]}
 * ]
 */

/**
 * Funkcja sprawdzająca status odpowiedzi.
 * @param {Object} response - Odpowiedź z żądania.
 * @param {number} response.statusCode - Kod statusu odpowiedzi.
 * @param {string} response.statusMessage - Wiadomość statusu odpowiedzi.
 * @returns {Function} - Wiadomość o błędzie.
 */
const error = response => {
  if ( response.statusCode !== 200 ) {
    return () => {
      errorLog( `[Status]: ${ response.statusCode }` );
      errorLog( `[Message]: ${ response.statusMessage }` );
    };
  }
};

/**
 * Pobranie zawartości spisu treści z wydania.
 * @param {String} link - Adres wydania.
 * @property {Object} response - Odpowiedź z żądania.
 * @property {Object} body - Ciało pobranej strony.
 * @property {Function} $ - Sparsowane ciało pobranej strony.
 * @property {boolean} isNotP - Czy spis treści złożony jest z zniaczników <p>.
 * @property {Array} headers - Tablica nagłówków artykułu.
 * @property {Array} categories - Tablica kategorii artykułów.
 * @property {Array} newsList - Lista nowości.
 * @property {String} headerText - Tekst nagłówka artykułu.
 * @property {String} desc - Opis artykułu.
 * @property {Object} hwd - Nagłówek z opisem artykułu.
 * @property {Array} headerWithDesc - Tablica artykułów.
 * @property {String} number - Tytuł wydania.
 * @property {Object} numberDesc - Zbiór wszystkich artykułów spisu treści.
 * @property {String} imgUrl - Adres url okładki.
 * @returns {Promise} - Obietnica posiadająca tablicę z danymi konkretnego wydania.
 */
const getContent = async link => {
  let { response, body } = await get( `https://linux-magazine.pl/${ link }/spistresci` );
  let $, isNotP, headers, categories, newsList, headerText, desc, hwd, headerWithDesc, number, numberDesc, imgUrl;

  error( response );

  $ = cheerio.load( body );
  isNotP = true;

  imgUrl = $( '.numberImage > img' ).attr( 'src' );

  //Pobranie nagłówków, kategorii oraz listy nowości. W portalu są trzy wersje spisu treści, dlatego też są 3 sposoby
  //sczytania spisu teści.
  headers = $( '.archive-number-toc-container h4' ).toArray(); // nagłówki artykułów
  categories = $( '.archive-number-toc-container h3' ).toArray(); // kategorie artykułów
  newsList = $( '.archive-number-toc-type1-container li' ).toArray(); // lista nowości
  if ( headers.length === 0 ) {
    headers = $( '.archive-number-container h4' ).toArray(); // nagłówki artykułów
    categories = $( '.archive-number-container h3' ).toArray(); // kategorie artykułów
    newsList = $( '.archive-number-content li' ).toArray(); // lista nowości
  }
  if ( headers.length === 0 ) {
    headers = $( '.archive-number-content p' ).toArray(); // nagłówki artykułów
    isNotP = false;
  }

  headerWithDesc = [];

  //Dodanie listy nowości do tablicy artykułów.
  for ( let news of newsList ) {
    headerWithDesc.push({ "header": $( news ).text(), "desc": "nowości" });
  }

  //Dodanie listy kategorii do tablicy artykułów.
  for ( let cat of categories ) {
    headerWithDesc.push({ "header": $( cat ).text(), "desc": "kategorie" });
  }

  //Połączenie nagłówków z opisami oraz dodanie ich do tablicy artykułów.
  for ( let header of headers ) {
    headerText = $( header ).text();
    if ( headerText === "" && !isNotP ) continue;

    if ( isNotP ) {
      headerText = headerText === "" ? "nagłówek" : headerText;

      desc = $( header.nextSibling ).text();
      desc = desc.replace( /\n|\s\s/g, "" ); //Usunięcie pustych linijek oraz podwójnych spacji

      hwd = { "header": headerText, "desc": desc };
      headerWithDesc.push( hwd );

    } else {
      hwd = { "header": headerText, "desc": "" };
      headerWithDesc.push( hwd );
    }
  }

  number = $( '.numberTitle' ).text(); //Numer wydania.

  //Połączenie danych dotychczasowo sczytanych i połączenie je w jeden obiekt oraz dodanie do tablicy wydań.
  numberDesc = { "link": link, "headers_array": headerWithDesc, "number": number, "imgUrl": imgUrl };
  numbersContent.push( numberDesc );

  return new Promise( ( resolve, reject ) => {
    try {
      resolve( numbersContent );
    } catch ( error ) {
      reject( error );
    }
  } );
};

/**
 * Pobranie wydań ze strony.
 * @param {Array<number>} numberArray - Tablica numerów wydań.
 * @param {string} [numbersSiteUrl={@see year}] - Konkretny rok wydania bądź wszystkie wydania.
 * @property {string} url - Adres URL stworzony z przedrostka {@see prefixUrl} oraz roku wydania {@see numbersSiteUrl}.
 * @property {Object} request - Żądanie pobrania danych wydań.
 * @property {Object} request.response - Odpowiedź z żądania.
 * @property {Object} request.body - Ciało pobranej strony.
 * @property {Function} $ - Sparsowane ciało pobranej strony.
 * @property {Object} magazines - Sparsowana lista wydań.
 * @property {number} number - Numer wydania.
 * @returns {Promise} - Obietnica posiadająca tablice wydań.
 */
const sendRequest = async ( numberArray, numbersSiteUrl = year ) => {
  let url = prefixUrl + numbersSiteUrl;
  let request, $, magazines, number;
  links = [];
  numbersContent = [];

  try {
    request = await get( url );
  } catch ( error ) {
    errorLog( error )
  }

  let { response, body } = request;

  error( response );

  $ = cheerio.load( body );

  //Pobranie linków do wydań oraz przypiasnie ich do konkretnej listy artykułów.
  magazines = $( '.archive-items-container' ).children();
  magazines.each(( i, el ) => {
    number = $( magazines[ i ]).find( '.main-title p' ).text().split( /\s/ );
    number = parseInt( number[ number.length - 1 ]);

    if ( !numberArray.includes( number )) {
      links.push( $( el ).find( '.main-title a' ).attr( 'href' ));
    }
  });

  //W przypadku braku nowych wydań porces bota jest zamykany.
  if ( links.length === 0 ) {
    return process.exitCode = 0;
  }

  const promises = links.map( link => getContent( link ) ); // Pobranie dla znalezionych wydań ich zawartości.

  try {
    await Promise.all( promises ); // Poczekanie na zakończenie wszystkich obietnic pobierających artykuły.
  } catch ( error ) {
    errorLog( error );
  }

  return new Promise(( resolve, reject ) => {
    try {
      resolve( numbersContent );
    } catch ( error ) {
      reject( error );
    }
  });
};

module.exports = { sendRequest };
