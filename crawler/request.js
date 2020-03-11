const request = require( 'request' );

/**
 * Funkcja asynchroniczna tworząca żądanie.
 * @param {string} url - Adres, z którym ma się nawiązać połączenie.
 * @property {Object} options - Opcje połączenia takie jak adres url czy nagłówek
 * @see [request]{@link https://github.com/request/request}
 * @returns {Promise} - Obietnica posiadająca dane żądania.
 */
const get = async ( url ) => {
  const options = {
    url: url,
    headers: {
      'User-Agent': 'crawler'
    }
  };

  return new Promise(( resolve, reject ) => {
    request( options, ( error, response, body ) => {
      if ( error ) return reject( error );

      return resolve( { body, response });
    })
  });
};

module.exports = { get };
