const mysql = require( 'mysql' );
const { table } = require( './dbscript' );

/**
 * @property {Object} config - Konfiguracja połączenia z bazą danych.
 * @see [mysql]{@link https://github.com/mysqljs/mysql}
 */
const config = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'search'
};

/**
 * Funkcja tworząca zapytanie asynchroniczne do bazy danych.
 * @param {string} query - Zapytanie SQL do bazy danych.
 * @param {Array} [params=[]] - Tablica parametrów zapytania.
 * @property {Connection} connection - Połączenie z bazą danych.
 * @property {Object} result - Wynik zapytania SQL.
 * @returns {Promise} - Obietnica posiadająca wynik zapytania SQL.
 */
const queryDB = async ( query, params = [] ) => {
  const connection = mysql.createConnection( config );
  let result = {};

  return new Promise(( resolve, reject ) => {
    /**
     * Wysłanie zapytania do bazy danych oraz przypisanie wyników.
     */
    connection.query( query, params, ( err, rows, fields ) => {
      if ( err ) reject( err );

      result = rows
    });

    /**
     * Zakończenie połączenia z bazą dancyh.
     * @returns [result]{@link result} - Zwrócenie wyniku z bazy danych.
     */
    connection.end( err => {
      if ( err ) reject( err );

      resolve( result );
    });
  });
};

/**
 * Funkcja asynchroniczna tworząca strukturę bazy danych.
 * @property {Connection} connection - Połączenie z bazą danych.
 * @see config.
 * @property {string} query - Zapytanie SQL.
 * @returns {Promise} - Obietnica kończąca połączenie z bazą danych.
 */
const initializeDB = async () => {
  const connection = mysql.createConnection( {
    host: config.host,
    user: config.user,
    password: config.password
  });

  return new Promise(( resolve, reject ) => {
    /**
     * Seria zapytań SQL tworzących strukturę bazy danych.
     */
    connection.query( table.dbCreate, err => {
      if ( err ) reject( err );
    });

    connection.query( table.useSearch, err => {
      if ( err ) reject( err );
    });

    connection.query( table.createLinks, err => {
      if ( err ) reject( err );
    });

    connection.query( table.createDescs, err => {
      if ( err ) reject( err );
    });

    connection.query( table.createContents, err => {
      if ( err ) reject( err );
    });

    connection.query( table.createKeywords, err => {
      if ( err ) reject( err );
    });

    connection.query( table.createTags, err => {
      if ( err ) reject( err );
    });

    /**
     * Zakończenie połączenia z bazą danych.
     */
    connection.end( err => {
      if ( err ) reject( err );
      resolve();
    });
  });
};

/**
 * Usunięcie całkowite bazy danych.
 * @property {string} query - Zapytanie niszczące bazę.
 * @returns {Promise<void>} - Obietnica posiadająca wynik zapytania.
 */
const destroyDB = async () => {
  // language=MariaDB
  const query = "DROP DATABASE search;";
  await queryDB( query );
};

module.exports = {
  initializeDB,
  queryDB,
  destroyDB
};
