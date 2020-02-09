import React from "react";
import { connect } from "react-redux";
import Header from "./Header";
import SearchBar from "./SearchBar";
import {
  fetchArticles,
  updateArticles,
  setIndividuals,
  setSearchValue,
  searchArticles,
  getAllInstances
} from "../../store/actions/actions";

import "./scss/headercontainer.scss";

const mapStateToProps = state => ({
  allArticles: state.allArticles,
  found: state.countArticles,
  flag: state.flag,
  individuals: state.individuals,
  searchValue: state.searchValue,
  instances: state.instances
});

const mapDispatchToProps = dispatch => ({
  fetchArticles: () => dispatch( fetchArticles()),
  updateArticles: () => dispatch( updateArticles()),
  setIndividuals: () => dispatch( setIndividuals([])),
  setSearchValue: () => dispatch( setSearchValue( "" )),
  searchArticles: search => dispatch( searchArticles( search )),
  getAllInstances: () => dispatch( getAllInstances())
});

class HeaderContainer extends React.Component {
  state = {
    showTags: false
  };

  componentDidMount () {
    this.props.fetchArticles();
    this.props.getAllInstances();
    document.addEventListener(
      "keyup",
      this.handleClick,
      false
    );
  }

  handleSearch = evt => {
    let tgt = evt.target;
    if ( tgt.dataset.tag ) {
      this.props.searchArticles( tgt.dataset.tag );
    }
  };

  handleClick = evt => {
    let { key } = evt;
    let tgt = evt.target;

    if ( tgt.dataset.icon === "sync" || tgt.parentElement.dataset.icon === "sync" ) {
      this.props.updateArticles();
      this.setState({ showTags: false });
    } else if ( tgt.id === "title" ) {
      this.props.setIndividuals();
      this.props.fetchArticles();
      this.props.setSearchValue();
      this.setState({ showTags: false });
    } else if ( tgt.dataset.icon === "bars" || tgt.parentElement.dataset.icon === "bars" ) {
      if ( this.props.searchValue && this.props.searchValue !== ""  ) {
        this.setState(prevState => ({ showTags: !prevState.showTags }));
      }
    } else if ( key === "Escape" || tgt.id === "close" ) {
      this.setState({ showTags: false });
    }
  };

  render () {
    let {
      found,
      flag,
      individuals,
      searchValue,
      instances,
      searchArticles
    } = this.props;
    individuals = searchValue !== "" ? Array.from( new Set( individuals )) : [];

    return (
      <div id="header-container">
        <Header
          title="LMSearch"
          handleClick={ this.handleClick }
          found={ found }
          flag={ flag }
          showTags={ this.state.showTags }
          individuals={ individuals }
          handleSearch={ this.handleSearch }
        />
        <SearchBar
          instances={ instances }
          searchValue={ searchValue }
          searchArticles={ searchArticles }
        />
      </div>
    );
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( HeaderContainer );
