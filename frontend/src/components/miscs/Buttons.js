import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "./scss/buttons.scss";

const Buttons = props => {
  return (
    <div
      className={ `btn ${ props.passClasses ? props.passClasses : "" }` }
      onClick={ props.onClick }
      data-icon={ props.iconName }
    >
      { !props.showIcon && <FontAwesomeIcon icon={ props.iconName } rotation={ props.rotation }/> }
      { props.children }
    </div>
  );
};

export default Buttons;
