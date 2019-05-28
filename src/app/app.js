import React, { Component } from 'react';
import {
  Route,
  Switch
} from 'react-router-dom';

import './app.scss';

import Search from './componets/search/search';
import Home from './componets/home/home';
import Repo from './componets/repo/repo';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      searchBoxOpen: false
    };
  }

  toggleSearchBox = () => {
    this.setState(state => ({ searchBoxOpen: !state.searchBoxOpen }));
  };

  render() {
    return (
      <div>
        <main className="main-wrap">
          <header className="header__container">
            <div className="container">
              <div className="header__container__left">
                <i className="fi flaticon-github-logo"></i>
              </div>
              <div className="header__container__right">
                <button className="search__btn" onClick={this.toggleSearchBox}>Search Repos</button>
              </div>
            </div>
          </header>
          <div className="main__content">
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/:owner/:repo' render={({ match }) => <Repo owner={match.params.owner} repo={match.params.repo} />} />
            </Switch>
          </div>
        </main>
        <Search isOpen={this.state.searchBoxOpen} toggleSearch={this.toggleSearchBox}></Search>
      </div>
    );
  }
}

export default App;
