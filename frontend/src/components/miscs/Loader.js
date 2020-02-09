import React from 'react';

import './scss/loader.scss';
import sittingTux from '../../assets/images/tux_120x120.png';

const Loader = (props) => {
  return (
    <div className="loader">
      <img
        src={ sittingTux }
        alt="Sitting tux"
      />
    </div>
  );
};

export default Loader;
