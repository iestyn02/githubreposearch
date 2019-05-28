import React, { Component } from 'react';
import axios from 'axios';
// import { DebounceInput } from 'react-debounce-input';
import { token, page_limit } from '../../vars';

import './commit-list.scss';

const default_page_limit = page_limit || 10;

const fetchCommits = (owner, repo, queryString = `page=1&per_page=${default_page_limit}`) => {
  return axios.get(`https://api.github.com/repos/${owner}/${repo}/commits?${queryString}`, {
    contentType: 'application/json',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${token}`
    }
  }).then((res) => { return res.data });
}

const getRequestObj = (pageNumber, order, limit, searchString) => {

  let queryString = [];

  // q=comitter-name only works with search commits api
  // if (searchString) {
  //   queryString.push(`q=committer-name:${searchString}`);
  // }

  if (pageNumber) {
    queryString.push(`page=${pageNumber}`);
  }

  if (limit) {
    queryString.push(`per_page=${limit}`);
  }

  return queryString.join('&');
}

class CommitList extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: [],
      searchString: '',

      //pagination state vars
      hold: false,
      pageNumber: 1,
      numberLoaded: 0,
      sortColumn: '',
      sortReverse: false,
      limit: default_page_limit,
      lastPageCount: null
    }

    this.init = this.init.bind(this);
    this.searchList = this.searchList.bind(this);
    this.goToFirstPage = this.goToFirstPage.bind(this);
    this.getNextPage = this.getNextPage.bind(this);
    this.getPreviousPage = this.getPreviousPage.bind(this);
  }

  componentDidMount() {
    this.init();
  }

  searchList(e) {
    this.setState({ searchString: e.target.value }, () => this.init());
  }

  goToFirstPage() {
    this.setState({ pageNumber: 1, hold: false }, () => this.init());
  }

  getPreviousPage(hold) {
    if (this.state.pageNumber > 1) {
      this.setState({ pageNumber: this.state.pageNumber - 1, hold: false }, () => this.init());
    }
  }

  getNextPage() {
    if (!this.state.hold) {
      this.setState({ pageNumber: this.state.pageNumber + 1 }, () => this.init());
    }
  }

  init(hold) {
    const _this = this;
    _this.setState({ loading: true })
    fetchCommits(this.props.owner, this.props.repo, getRequestObj(this.state.pageNumber, this.state.sortColumn, this.state.limit, this.state.searchString)).then((data) => {

      if (data.length && (data.length < _this.state.limit)) {
        _this.setState({ loading: false, hold: true, lastPageCount: data.length, data })
      } else if (data.length) {
        _this.setState({ loading: false, hold: false, data })
      } else {
        _this.setState({ loading: false, hold: true })
      }

      if (hold) {
        _this.setState({ loading: false, hold: true, lastPageCount: (this.state.limit * (this.state.pageNumber - 2)) })
      }
    }).catch(err => {
      console.error(err);
      _this.setState({ loading: false, hold: true, lastPageCount: 0, data: [] })
    });
  }

  render() {
    return (
      <div className="commit__list">
        <div className={`loading__overlay ${this.state.loading ? 'loading__overlay--show' : ''}`}>
          <div className="spinner-center">
            <div className="loader">Loading...</div>
          </div>
        </div>
        <div className="commit__list__table">
          {/* <div className="list__controls">
            <DebounceInput
              minLength={2}
              debounceTimeout={360}
              onChange={e => this.searchList(e)} />

            {this.state.searchString}

          </div> */}
          <table>
            <thead>
              <tr>
                <th></th>
                <th>User</th>
                <th>Message</th>
                <th>Commit SHA</th>
              </tr>
            </thead>
            <tbody>
              {this.state.data.map(o => {
                return (
                  <tr key={o.sha}>
                    <td>
                      <span className="avatar" style={{ backgroundImage: `url(${o.committer ? o.committer.avatar_url : ''}` }}></span>
                      {}
                    </td>
                    <td>
                      {o.commit.committer.name}
                    </td>
                    <td>
                      {o.commit.message}
                    </td>
                    <td>
                      {o.sha}
                    </td>
                  </tr>
                );
              })}
              <tr className={`${this.state.data.length ? 'hidden' : 'no__data'}`}>
                <td colSpan="3">no results!</td>
              </tr>
            </tbody>
          </table>

        </div>
        <div className="pagination__controls">
          <button className="pagination__controls__btn" onClick={this.goToFirstPage}><i className="fi flaticon-left-arrow"></i><i className="fi flaticon-left-arrow"></i></button>
          <button className="pagination__controls__btn" onClick={this.getPreviousPage}><i className="fi flaticon-left-arrow"></i></button>
          <span>{`Page ${this.state.pageNumber}, Showing ${(this.state.pageNumber - 1) * this.state.limit + 1}-${this.state.hold ? ((this.state.pageNumber - 1) * this.state.limit) + this.state.lastPageCount : this.state.pageNumber * this.state.limit}`}</span>
          <button className="pagination__controls__btn" onClick={this.getNextPage}><i className="fi flaticon-right-arrow"></i></button>
        </div>
      </div>
    )
  }

}

export default CommitList;
