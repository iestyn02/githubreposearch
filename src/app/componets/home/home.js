/**
 *  Sole purpose of this component is to redirect to a default route of choice.
 *  In this case it'll be /iestyn02/githubsearch. This could have easily been done
 *  using the Switch component in app.js
 * */
import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import './home.scss';

class Home extends Component {

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.history.push(`/facebook/react`);
  }

  render() {
    return (
      <div className="row">
        <div className="col-md-12">
          Redirecting..
        </div>
      </div>
    )
  }
}

export default withRouter(Home);
