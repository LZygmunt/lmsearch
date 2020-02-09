import React, { Component } from 'react';

import "./scss/dragscroll.scss";

class DragScroll extends Component {
  state = {
    isPressed: false,
    scrollLeft: 0,
    scrollTop: 0,
    xValue: 0,
    yValue: 0
  };

  ref = React.createRef();

  handleMouseDown = evt => {
    let { pageX, pageY } = evt;
    let { offsetLeft, scrollLeft, offsetTop, scrollTop } = this.ref.current;
    let { scrollAxis } = this.props;

    if ( scrollAxis === "x" || typeof scrollAxis == "undefined" ){
      this.setState({
        isPressed: true,
        xValue: pageX - offsetLeft,
        scrollLeft
      });
    } else if ( scrollAxis === "y" ){
      this.setState({
        isPressed: true,
        yValue: pageY - offsetTop,
        scrollTop
      });
    }
  };

  handleMouseMove = evt => {
    if (!this.state.isPressed) return;

    let { scrollAxis } = this.props;
    let { xValue, yValue, scrollTop, scrollLeft } = this.state;
    let { pageY, pageX } = evt;
    let { offsetLeft, offsetTop } = this.ref.current;

    if ( scrollAxis === "x" || typeof scrollAxis == "undefined" ) {
      let x =  pageX - offsetLeft;
      let scroll = ( x - xValue ) * 2;
      this.ref.current.scrollLeft = scrollLeft - scroll;
    } else if ( scrollAxis === "y" ) {
      let y =  pageY - offsetTop;
      let scroll = ( y - yValue ) * 2;
      this.ref.current.scrollTop = scrollTop - scroll;
    }
  };

  handleEnd = evt => {
    this.setState({
      isPressed: false
    });
  };

  handleWheel = evt => {
    let { deltaY } = evt;
    let { scrollAxis } = this.props;

    if ( scrollAxis === "x" || typeof scrollAxis == "undefined" ) {
      if ( deltaY > 0 ) this.ref.current.scrollLeft += 25;
      else if ( deltaY < 0 ) this.ref.current.scrollLeft -= 25;
    } else if ( scrollAxis === "y" ) {
      if ( deltaY > 0 ) this.ref.current.scrollTop += 25;
      else if ( deltaY < 0 ) this.ref.current.scrollTop -= 25;
    }
  };

  handleTouchStart = evt => {
    this.handleMouseDown( evt.touches[ 0 ]);
  };

  handleTouchMove = evt => {
    this.handleMouseMove( evt.touches[ 0 ]);
  };

  handleTouchEnd = evt => {
    this.setState({
      isPressed: false
    });
  };

  render() {
    const { rootId, rootClass, children } = this.props;
    let { isPressed } = this.state;

    return (
      <div
        ref={this.ref}
        onMouseDown={ this.handleMouseDown }
        onMouseUp={ this.handleEnd }
        onMouseMove={ this.handleMouseMove }
        onMouseLeave={ this.handleEnd }
        onWheel={ this.handleWheel }
        onTouchStart={ this.handleTouchStart }
        onTouchEnd={ this.handleTouchEnd }
        onTouchMove={ this.handleTouchMove }
        onTouchCancel={ this.handleTouchEnd }
        className={ `${ rootClass ? rootClass : "" }draggable${ isPressed ? " active" : "" }` }
        id={ rootId }
      >
        { children }
      </div>
    );
  }
}

export default DragScroll;
