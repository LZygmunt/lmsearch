import React, { Component } from "react";
import { connect } from "react-redux";
import ResultContainer from "./components/result/ResultContainer";
import HeaderContainer from "./components/searchbar/HeaderContainer";
import { pageNotFound } from "./store/actions/actions";
import flags from "./utils/flags";

import "./app.scss";
import "./assets/scss/backgound.scss";
import "./assets/scss/font.scss";
import "./assets/scss/animation.scss"
import SadTux from "./assets/images/sad_tux_400x343.png";
import Info from "./components/info/Info";
import Buttons from "./components/miscs/Buttons";

const mapStateToProps = state => ({
  flag: state.flag
});

const mapDispatchToProps = dispatch => ({
  pageNotFound: page => dispatch( pageNotFound( page ))
});

class App extends Component {
  state = {
    notFound: false,
    error: false,
    info: false
  };

  componentDidMount () {
    let { pathname } = document.location;
    let { pageNotFound, flag } = this.props;
    let { notFound, error } = this.state;

    if ( pathname === "/info" ) {
      this.setState({ info: true });
    } else if ( pathname !== "/" || flag === flags.notFound || notFound ) {
      pageNotFound( pathname );
      this.setState({ notFound: true });

      setTimeout(() => {
        document.location.pathname = "/";
      }, 3000 );
    } else if ( flag === flags.error || error ) {
      this.setState({ error: true });
    }
  }

  componentDidUpdate ( prevProps, prevState, snapshot ) {
    if ( this.props.flag === flags.error && !prevState.error ) {
      this.setState({ error: true });
    }
    if ( this.props.flag === flags.notFound && !prevState.notFound ) {
      this.setState({ notFound: true });
    }
  }

  handleClick = evt => {
    document.location.pathname = "/info";
  };

  render () {
    let h1, h4;
    if ( this.state.notFound ) {
      h1 = "Strona nie została znaleziona.";
      h4 = "Za chwilę nastąpi przekierowanie.";
    } else if ( this.state.error ) {
      h1 = "Błąd wewnętrzny serwera.";
      h4 = "Przepraszam. Proszę spróbować później.";
    }

    return this.state.info
      ? (
        <div className="app bg-greyish-blue color-white">
          <Info/>
        </div>
      ) : (
      <div className="app bg-greyish-blue color-white">
        <Buttons
          passClasses="question-mark"
          iconName="question-circle"
          onClick={ this.handleClick }
        />
        <HeaderContainer/>
        { this.state.notFound || this.state.error
          ? <div id="not-found">
            <img src={ SadTux } alt="Sad Tux" />
            <h1 className="color-aqua">{ h1 }</h1>
            <h4 className="color-aqua">{ h4 }</h4>
          </div>
          : <ResultContainer/>
        }
      </div>
    );
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( App );
