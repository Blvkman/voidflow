import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './pages';
import SigninPage from './pages/signin';
import DashboardPage from './pages/dashboard';


export default class App extends Component {

  constructor(){
    super();

    this.state = {
      loggedInStatus: "NOT_LOGGED_IN",
      user: {}
    }
  }

  render(){
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home}/>

          <Route path="/signin" component={SigninPage} exact />

          <Route path="/dashboard"
          exact
          render={props => (
            <DashboardPage 
            {...props} 
            loggedInStatus={this.state.loggedInStatus}/>
          )}
          />
        </Switch>
      </Router>
    );
  }
}