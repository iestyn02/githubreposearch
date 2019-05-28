import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { UpdateHistoryStore, GetHistoryStore } from '../../services/search-history/search-history';
import { token } from '../../vars';

import axios from 'axios';

import './search.scss';

const makeAndHandleRequest = query => {
  return axios.get(`https://api.github.com/search/repositories?q=user:${query}`, {
    contentType: 'application/json',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${token}`
    }
  });
}

class Search extends Component {

  constructor(props) {
    super(props);

    this.state = {
      historySearch: GetHistoryStore(),
      allowNew: false,
      isLoading: false,
      multiple: false,
      options: [],
    }

    this.escFunction = this.escFunction.bind(this);
  }

  componentDidMount() {
    document.addEventListener("keydown", this.escFunction, false);
  }
  componentWillUnmount() {
    document.removeEventListener("keydown", this.escFunction, false);
  }

  componentWillReceiveProps(nextProps) {
    if ((this.props.isOpen !== nextProps.isOpen) && nextProps.isOpen) {
      this.typeahead.getInstance().focus()
    }
  }

  escFunction(event) {
    if (event.keyCode === 27) {
      this.props.toggleSearch();
    }
  }

  _handleRedirect({ owner, name, id }) {
    this.props.history.push(`/${owner.login}/${name}`);
    this.props.toggleSearch();
    UpdateHistoryStore(owner, name, id).then(newHistory => {
      this.setState({ historySearch: newHistory });
      this.typeahead.getInstance().clear()
    })
  }

  _handleSearch = (query) => {
    this.setState({ isLoading: true });
    makeAndHandleRequest(query).then(({ data }) => {
      this.setState({
        isLoading: false,
        options: data.items
      });
    }).catch(() => {
      this.setState({
        isLoading: false,
        options: []
      });
    });
  }

  render() {
    return (
      <div className={`search ${this.props.isOpen ? 'search--open' : ''}`}>
        <button id="btn-search-close" onClick={this.props.toggleSearch} className="btn btn--search-close" aria-label="Close search form" >&times;</button>
        <div className="search__inner search__inner--up">
          <div className="search__form" action="">
            <AsyncTypeahead
              {...this.state}
              ref={(typeahead) => this.typeahead = typeahead}
              labelKey="full_name"
              minLength={3}
              onSearch={this._handleSearch}
              placeholder="Search for a Github user..."
              renderMenuItemChildren={(option) => {
                // this.typeahead.getInstance().clear()
                return (
                  <div className="typeahead__row-item" key={option.id} onClick={this._handleRedirect.bind(this, option)} >
                    <span><span className="item__owner">{`${option.owner.login}/`}</span>{option.name}</span>
                  </div>
                );
              }}
              useCache={false}
            />
            {/* <input className="search__input" name="search" type="search" placeholder="Search" autoComplete="off" autoCorrect="off" autoCapitalize="off" spellCheck="false" /> */}
            <span className="search__info">Start typing and click on one of the results or ESC to close</span>
          </div>
        </div >
        <div className="search__inner search__inner--down">
          <div className="search__history">
            <span className="search__history__header">Search History</span>
            <ul className={`search__history__list ${this.state.historySearch.length ? '' : 'hidden'}`}>
              {this.state.historySearch.map(o => {
                return (
                  <li key={o.repo_id}>
                    <Link to={`/${o.username}/${o.repo_name}`} onClick={this._handleRedirect.bind(this, { owner: o.username, name: o.repo_name, id: o.repo_id })}>
                      <span className="search__history__item"><img src={o.avatar_url} alt="avatar" />{`${o.username}/${o.repo_name}`}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <span className={`${this.state.historySearch.length ? 'hidden' : 'search__history__info'}`}>No searches yet...</span>
          </div>
        </div>
      </div>
    );
  }

}

export default withRouter(Search);
