import * as React from 'react';
import Buttons from "../miscs/Buttons";
import TagList from "../miscs/TagList";

import "./scss/searchbar.scss";

class SearchBar extends React.Component {
  state = {
    search: "",
    show: false
  };

  componentDidMount () {
    document.addEventListener(
      "keydown",
      evt => evt.key === "Enter" && this.props.searchArticles( this.state.search ),
      false);
    document.addEventListener(
      "mouseup",
      this.handleSearch,
      false);
  }

  componentDidUpdate ( prevProps, prevState, snapshot ) {
    if ( prevProps.searchValue !== this.props.searchValue ) {
      this.setState({
        search: this.props.searchValue
      })
    }
  }

  handleChange = evt => {
    this.setState({
      [ evt.target.name ]: evt.target.value
    })
  };

  handleSearch = evt => {
    let tgt = evt.target;

    if ( tgt.dataset && ( tgt.dataset.tag && evt.type === "mouseup" )) {
      this.props.searchArticles( tgt.dataset.tag );
      this.setState({ show: false })
    } else if ( tgt.id && ( tgt.id === "search" || tgt.parentElement.id === "search-bar")) {
      this.setState({ show: true });
    } else {
      this.setState({ show: false });
    }
  };

  render () {
    let { search, show } = this.state;
    let { instances } = this.props;
    let listedTags = [];

    listedTags.push( ...instances );
    listedTags = search === "" ? [] : listedTags.filter( tag => tag.toLowerCase().includes( search.toLowerCase()));

    return (
      <div id="search-bar">
        <div className="bg-terminal-grey">
          <Buttons iconName="terminal" onClick={() => this.props.searchArticles( search )} />
          <input
            id="search"
            type="text"
            name="search"
            placeholder="Wyszukaj..."
            value={ search }
            onChange={ this.handleChange }
            onFocus={ this.handleSearch }
          />
        </div>
        { show && <TagList
          tagList={ listedTags }
          tagKey="tagListHint"
          handleSearch={ this.handleSearch }
          scrollAxis="x"
        />}
      </div>
    );
  }
}

export default SearchBar;
