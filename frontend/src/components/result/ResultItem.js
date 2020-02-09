import React from 'react';
import TagList from "../miscs/TagList";
import Loader from "../miscs/Loader";
import flags from "../../utils/flags";

import './scss/resultitem.scss';

const ResultItem = ({ result, handleSearch, flag }) => {
  let {
    number_text,
    keyword,
    header,
    description,
    link,
    id_desc,
    img_url
  } = result;
  let number;

  if ( typeof result !== "undefined" ){
    number = number_text.split( " " )[ 4 ];
    number_text = number_text.split( " - " );
  }

  return ( <div className="result-item bg-terminal-grey">
    { !( flag === flags.pending || flag === "")
      ? <a href={ `https://linux-magazine.pl/${ link }` } target="_blank" rel="noopener noreferrer">
        <div className="r-image">
          <p>{ number_text[ 0 ] }</p>
          <p>{ number_text[ 1 ] }</p>
          <img
            src={ img_url === "" ? img_url : `https://linux-magazine.pl${ img_url }` }
            alt={ `${ number_text[ 0 ]} - ${ number_text[ 1 ]}` }
          />
        </div>
        <div className="description">
          <h4>{ header }</h4>
          <p>{ description }</p>
        </div>
        <div className="number-info">
          <p>{ number_text[ 0 ] }-{ number_text[ 1 ] }</p>
        </div>
      </a>
      : <Loader/>
    }
      <TagList
        tagList={ keyword }
        tagKey={ `${ id_desc }-${ number }` }
        key={ `${ id_desc }-${ number }` }
        handleSearch={ handleSearch }
        scrollAxis="x"
      />
    </div> );
};

export default ResultItem;
