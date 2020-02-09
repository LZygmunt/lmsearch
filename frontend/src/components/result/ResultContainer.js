import React, { Component } from 'react';
import { connect } from "react-redux";
import Buttons from "../miscs/Buttons";
import PageList from "../miscs/PageList";
import ResultList from "./ResultList";
import ResultItem from "./ResultItem";
import { setCurrentPage, searchArticles } from "../../store/actions/actions";

import SadTux from "../../assets/images/sad_tux_400x343.png";
import "./scss/resultcontainer.scss";

const mapStateToProps = state => ({
  currentPage: state.currentPage,
  countArticles: state.countArticles,
  articles: state.allArticles,
  foundArticles: state.foundArticles,
  flag: state.flag
});

const mapDispatchToProps = dispatch => ({
  searchArticles: search => dispatch( searchArticles( search )),
  setPage: page => dispatch( setCurrentPage( page ))
});

class ResultContainer extends Component {
  state = {
    countPages: 1,
    pages: []
  };

  ref = React.createRef();

  componentDidMount () {
    let { currentPage } = this.props;
    this.setState({
      pages: this.setPages( currentPage, 1 )
    });
  }

  componentDidUpdate ( prevProps, prevState, snapshot ) {
    let { countArticles, currentPage } = this.props;
    if ( prevProps.countArticles !== countArticles ) {
      let countPages = Math.ceil( countArticles / 9 );
      this.setState({
        countPages,
        pages: this.setPages( currentPage, countPages )
      });
    }
  }

  setPages = ( cur, count ) => {
    let arr = [];
    let start = count < 9 ? 1 : cur + 1;
    count = count >= 9 ? count : count + 1;

    for ( let i = start; i < count; i++ ) {
      arr.push({ id: i, value: i });
    }

    return arr;
  };

  handleSearch = evt => {
    let tgt = evt.target;
    if ( tgt.dataset.tag ) {
      this.props.searchArticles( tgt.dataset.tag );
    }
  };

  handleClick = evt => {
    const tgt = evt.target;
    let { countPages } = this.state;
    let { currentPage, setPage } = this.props;
    let nextPage;

    if ( tgt.dataset.icon === "chevron-up" || tgt.parentElement.dataset.icon === "chevron-up" )
      nextPage =  currentPage - 1 > 1 ? currentPage - 1 : 1;
    else if ( tgt.dataset.icon === "chevron-down" || tgt.parentElement.dataset.icon === "chevron-down" )
      nextPage = currentPage  + 1 > countPages ? countPages : currentPage + 1;
    else nextPage = parseInt( evt.target.dataset.key );

    setPage( nextPage );
    this.ref.current.ref.current.scrollTop = 36 * nextPage - ( 36 * 5);
  };

  render () {
    let { currentPage, countArticles, articles, flag, foundArticles } = this.props;
    let { countPages, pages } = this.state;
    const arr = [];
    let limit = 9, presArr;
    let start = ( currentPage - 1 ) * limit;

    if ( flag === "Got" || flag === "Is Actual" ){
      presArr = articles;
    } else if ( flag === "Found" ) {
      presArr = foundArticles;
    } else if ( flag === '' || flag === 'Pending' ){
      presArr = [
        { number_text: " - ", keyword: [""], header: "", description: "", link: "", id_desc: 0, img_url: "" },
        { number_text: " - ", keyword: [""], header: "", description: "", link: "", id_desc: 1, img_url: "" },
        { number_text: " - ", keyword: [""], header: "", description: "", link: "", id_desc: 2, img_url: "" },
        { number_text: " - ", keyword: [""], header: "", description: "", link: "", id_desc: 3, img_url: "" },
        { number_text: " - ", keyword: [""], header: "", description: "", link: "", id_desc: 4, img_url: "" },
        { number_text: " - ", keyword: [""], header: "", description: "", link: "", id_desc: 5, img_url: "" },
        { number_text: " - ", keyword: [""], header: "", description: "", link: "", id_desc: 6, img_url: "" },
        { number_text: " - ", keyword: [""], header: "", description: "", link: "", id_desc: 7, img_url: "" },
        { number_text: " - ", keyword: [""], header: "", description: "", link: "", id_desc: 8, img_url: "" }
      ];
    }

    for ( let i = start; i < limit * currentPage; i++ ) {
      if ( typeof presArr[ i ] == "undefined" ) break;
      arr.push({ ...presArr[ i ] });
    }

    const resultList = arr.map( result => <ResultItem
      key={ result.id_desc }
      result={ result }
      handleSearch={ this.handleSearch }
      flag={ flag }
    /> );

    return flag === "Found" && countArticles === 0
      ? (<div id="result-container">
        <div id="not-found">
          <img
            src={ SadTux }
            alt="Sad Tux"
            width=""
          />
          <h1 className="color-aqua">Podana fraza nie została znaleziona.</h1>
        </div>
      </div>)
      : (<div id="result-container">
        <div className="column">
          <PageList
            refProps={ this.ref }
            pages={ pages }
            currentPage={ currentPage }
            countPages={ countPages }
            handleClick={ this.handleClick }
          />
        </div>
        <div className="column">
          <Buttons
            iconName="chevron-up"
            onClick={ this.handleClick }
            showIcon={ !( countPages > 1 && currentPage > 1 )}
          />
          <ResultList>
            { resultList }
          </ResultList>
          <Buttons
            iconName="chevron-down"
            onClick={ this.handleClick }
            showIcon={ !( countPages > 1 && currentPage < countPages )}
          />
        </div>
      </div>);
  }
}

export default connect( mapStateToProps, mapDispatchToProps )( ResultContainer );
