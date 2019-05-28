import React, { Component } from 'react';
import axios from 'axios';
import { token } from '../../vars';

import './repo.scss';

import CommitList from '../commit-list/commit-list';

const fetchProject = (owner, repo) => {
  return axios.get(`https://api.github.com/repos/${owner}/${repo}`, {
    contentType: 'application/json',
    headers: {
      Accept: 'application/vnd.github.v3+json',
      Authorization: `token ${token}`
    }
  });
}

class Repo extends Component {

  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      data: {}
    }
  }

  componentWillReceiveProps(newProps) {
    if (this.props.repo !== newProps.repo) {
      this.setState({ loading: true })
      fetchProject(newProps.owner, newProps.repo).then(({ data }) => {
        this.setState({ loading: false, data })
      });
    }
  }

  componentWillMount() {
    this.setState({ loading: true })
    fetchProject(this.props.owner, this.props.repo).then(({ data }) => {
      this.setState({ loading: false, data })
    })
  }

  render() {
    return (
      !this.state.loading && <div className="container">
        <div className="row">
          <div className="col-md-12">
            <div className="repo">
              {/* <img src={this.state.data.owner ? this.state.data.owner.avatar_url : ''} /> */}
              <div className="repo__header">
                <span className="avatar_url" style={{ backgroundImage: `url(${this.state.data.owner ? this.state.data.owner.avatar_url : ''})` }}></span>
                <span className="repo__owner-repo">{`${this.state.data.owner ? this.state.data.owner.login : ''}/${this.state.data.name}`}</span>
              </div>
              <div className="repo__info">
                <div className="row">
                  <div className="col-md-6">
                    <span className="repo__info__label">Owner</span>
                    <div className="repo__info__stat">{this.state.data.owner ? this.state.data.owner.login : ''}</div>
                  </div>
                  <div className="col-md-3">
                    <span className="repo__info__label">Forks</span>
                    <div className="repo__info__stat">{this.state.data.forks_count}</div>
                  </div>
                  <div className="col-md-3">
                    <span className="repo__info__label">Open Issues</span>
                    <div className="repo__info__stat">{this.state.data.open_issues_count}</div>
                  </div>
                </div>
                <div className="row margin-top-20">
                  <div className="col-md-12">
                    <span className="repo__info__label">Repo URL</span>
                    <div className="repo__info__stat"><a href={this.state.data.html_url}>{this.state.data.html_url}</a></div>
                  </div>
                </div>
              </div>
              <CommitList owner={this.props.owner} repo={this.props.repo} />
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Repo;
