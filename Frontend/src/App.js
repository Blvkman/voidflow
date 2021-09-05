import React, { Component } from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'
import Home from './pages';
import SigninPage from './pages/signin';
import RegisterPage from './pages/register';
import DashboardPage from './pages/dashboard';


export default class App extends Component {

  constructor(){
    super();

    this.state = {
      loggedInStatus: "NOT_LOGGED_IN",
      user: {}
    }

    this.successfulLogin = this.successfulLogin.bind(this);

  }
  
  successfulLogin(data) {
    window.localStorage.setItem("voidFlowAccessToken", data.token.accessToken);
    window.localStorage.setItem("voidFlowRefreshToken", data.token.refreshToken);
    this.setState({ 
      loggedInStatus: "LOGGED_IN_SUCCESSFULLY"
    })
  }

  render(){
    return (
      <Router>
        <Switch>
          <Route exact path="/" component={Home}/>
          
          <Route path="/register"
          exact
          render={props => (
            <RegisterPage 
            {...props}/>
          )}
          />

          <Route path="/signin"
          exact
          render={props => (
            <SigninPage 
            {...props}
            loggedInStatus={this.state.loggedInStatus}
            successfulLogin={this.successfulLogin}/>
          )}
          />

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