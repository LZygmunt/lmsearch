import * as React from 'react';
import Buttons from "../miscs/Buttons";
import TagList from "../miscs/TagList";
import flags from "../../utils/flags";

import "./scss/header.scss";

const Header = (
  {
    handleClick,
    title,
    found,
    flag,
    showTags,
    individuals,
    handleSearch
  }
) => (
    <div id="header">
      <div id="db-segment">
        <Buttons
          passClasses="bars"
          iconName="bars"
          onClick={ handleClick }
        />
        <Buttons
          passClasses={ `sync ${ flag === flags.isActual ? "color-green" : "" } ${ flag === flags.pending ? "spin" : "" }` }
          iconName="sync"
          onClick={ handleClick }
        />
        <div className={ `dropdown bg-dark-blue${ showTags ? " show" : "" }` }>
          <TagList
            tagList={ individuals }
            tagKey="tagList"
            handleSearch={ handleSearch }
            scrollAxis="y"
          />
          <span id="close" onClick={ handleClick }>X</span>
        </div>
      </div>
      <p
        id="title"
        className="color-aqua non-selected"
        onClick={ handleClick }
      >{ title }</p>
      <div id="result-number">
        <p>
          <i id="found">Znaleziono </i>
          <span>{ found }</span> wynik{ found === 0 || found > 4 ? "ów" : ( found !== 1 && "i" )}</p>
      </div>
    </div>
  );

export default Header;
