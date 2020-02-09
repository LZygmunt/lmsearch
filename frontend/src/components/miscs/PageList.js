import React from 'react';
import Buttons from "./Buttons";
import DragScroll from "./DragScroll";

import "./scss/pagelist.scss";

const PageList = ({ pages, currentPage, countPages, handleClick, refProps }) => {
    pages = pages.map( page =>
      <p
        className={ page.id === currentPage ? "current-page": "" }
        key={ page.id }
        data-key={ page.id }
        onClick={ handleClick }
      >{ page.value }</p>
    );

    return (
      <div id="page-list" className="non-selected">
        { countPages > 8 && <div id="first">
          <p
            className={ currentPage === 1 ? "current-page": ""  }
            key={ 1 }
            data-key={ 1 }
            onClick={ handleClick }>1</p>
        </div> }
        { countPages > 8 && <Buttons
          iconName="chevron-up"
          onClick={ handleClick }
        /> }
        <DragScroll
          ref={ refProps }
          rootId="page"
          rootClass={ countPages < 9 ? "flex" : "" }
          scrollAxis="y"
        >{ pages }</DragScroll>
        { countPages > 8 && <Buttons
          iconName="chevron-down"
          data-key={ currentPage + 1 }
          onClick={ handleClick }
        /> }
        { countPages > 8 && <div id="last">
          <p
            className={ currentPage === countPages ? "current-page": ""  }
            key={ countPages }
            data-key={ countPages }
            onClick={ handleClick }>{ countPages }</p>
        </div> }
      </div>
    );
};

export default PageList;
