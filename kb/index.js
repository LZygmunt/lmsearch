const fs = require('fs');

const kb = JSON.parse( fs.readFileSync( `${ __dirname }/baza_wiedzy.owl` ).toString( 'utf-8' ));

let kbData = kb.slice( 1 );
kbData = kbData.map( node => {
  let keys = Object.keys( node );
  let newKeys = keys.map( key => key.split( /#|@/ )[ 1 ] );

  for ( let i = 0; i < keys.length; i++ ) {
    if ( typeof node[ keys[ i ]] == "string" ) {
      node[ newKeys[ i ]] = node[ keys[ i ]].split( /#/ )[ 1 ];
    } else {
      node[ newKeys[ i ]] = node[ keys[ i ]];
      for ( let j = 0; j < node[ newKeys[ i ]].length; j++ ) {
        if ( typeof node[ newKeys[ i ]][ j ] == "string" ) {
          node[ newKeys[ i ]][ j ] = node[ newKeys[ i ]][ j ].split( /#/ )[ 1 ];
        } else {
          node[ newKeys[ i ]] = node[ newKeys[ i ]][ j ][ keys[ 0 ]].split( /#/ )[ 1 ];
        }
      }
    }
    delete node[ keys[ i ]];
  }

  return node;
});

for ( const kbDatum of kbData ) {
  let types = kbDatum[ "type" ];
  kbDatum[ "type" ] = types[ 0 ];
  if ( types.length > 1 ) {
    kbDatum[ "individualOf" ] = types.slice( 1 );
  }
}

let allClasses = kbData.filter( data => data.type === "Class" );
let allIndividuals = kbData.filter( data => data.type === "NamedIndividual" );

const searchAllSubClass = ( index, str, arr, keys) => {
  if ( index < allClasses.length ) {
    if ( allClasses[ index ].subClassOf && allClasses[ index ].subClassOf.toLowerCase().includes( str.toLowerCase())) {
      arr.push( allClasses[ index ]);
      keys.push( allClasses[ index ].id );
    }
    searchAllSubClass( index+1, str, arr, keys );
  }
};

const searchClasses = value => {
  let result = [];
  let keys = [ value ];
  let i = 0;

  for ( let el of allClasses ) {
    if( el.id.toLowerCase().includes( value.toLowerCase())) {
      result.push( el );
      keys.push( el.id );
    }
  }

  do {
    searchAllSubClass( 0, keys[ i ], result, keys );
    i++;
  } while ( keys[ i ]);

  return Array.from( new Set( result ));
};

const searchIndividuals = ( arr, value ) => {
  let mapArr = arr.map( el => el.id );

  for ( const el of mapArr ) {
    arr.push(
      ...allIndividuals.filter( individual => individual.individualOf.some( ind => ind.includes( el )))
    )
  }

  for ( const el of allIndividuals ) {
    if ( el.id.toLowerCase().includes( value.toLowerCase())) {
      arr.push( el );
    }
  }

  return Array.from( new Set( arr ))
};

const matchResults = value => {
  let result = searchClasses( value );

  result = searchIndividuals( result, value );

  return result;
};

const getKB = () => kbData.map( data => data.id );

module.exports = {
  matchResults,
  getKB
};
