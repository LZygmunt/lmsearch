import React from 'react';

const TagComponent = props => {
  let { tagName, tagId, handleSearch } = props;

  return (
    <p
      className="tag bg-greyish-blue"
      key={ tagId }
      onClick={ handleSearch }
      data-tag={ tagName }
    >
      { tagName }
    </p>
  );
};

export default TagComponent;
