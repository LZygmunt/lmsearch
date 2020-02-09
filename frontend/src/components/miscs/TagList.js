import React from 'react';
import TagComponent from "./TagComponent";
import DragScroll from "./DragScroll";

import "./scss/taglist.scss";

const TagList = ({ tagList, tagKey, handleSearch, scrollAxis, rootClass }) => {
  let tagArr = tagList.map(( tag, index ) => <TagComponent
    tagName={ tag }
    key={ `${ tagKey }-${ index }-${ tag }` }
    handleSearch={ handleSearch }
  /> );
  return (
    <DragScroll
      rootClass={ `tag-list non-selected ${ rootClass ? rootClass : "" }` }
      scrollAxis={ scrollAxis }
    >
      { tagArr }
    </DragScroll>
  );
};

export default TagList;
