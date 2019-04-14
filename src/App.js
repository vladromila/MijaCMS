import React, { Component } from 'react';
import { Provider } from 'react-redux'
import { BrowserRouter, Switch, Link } from 'react-router-dom';
import { createStore, applyMiddleware } from 'redux';
import reducers from './reducers';
import reduxThunk from 'redux-thunk';
import PrivateRoute from './config/PrivateRoute';
import firebase from 'firebase';
import DashBoard from './components/DashBoard/DashBoard';
import LoginPage from './components/Authentication/LoginPage';

class App extends Component {
  constructor() {
    super();
    this.state = {
      user: 'notVerified',
      albums: []
    }
  }

  componentWillMount() {
    firebase.initializeApp(
      {
        apiKey: "AIzaSyC3wHrgXYf6yPjpA_H8u-3mXjwBe6hnOeQ",
        authDomain: "mija-db.firebaseapp.com",
        databaseURL: "https://mija-db.firebaseio.com/",
        projectId: "mija-db",
        storageBucket: "",
        messagingSenderId: "855481637220"
      }
    )
  }
  render() {
    return (
      <Provider store={createStore(reducers, {}, applyMiddleware(reduxThunk))}>
        <BrowserRouter>
          <React.Fragment>
            <React.Fragment>
              <nav>
                <div className="nav-wrapper">
                  <Link className="brand-logo left" to="/" style={{left:'5%'}}>Ѧ</Link>
                  <ul className="right">
                    {this.state.user === 'notVerified' ? null : this.state.user ?
                      <React.Fragment>
                        <li><a
                          onClick={() => {
                            firebase.auth().signOut();
                          }}
                        >Logout</a></li>
                        <li><a href="https://alexmedve.github.io">Go to Blog</a></li>
                      </React.Fragment>
                      : null}
                  </ul>
                </div>
              </nav>
            </React.Fragment>
            <Switch>
              <PrivateRoute
                path="/login"
                user={this.state.user}
                component={LoginPage}
                albums={this.state.albums}
                type="auth"
              />
              <PrivateRoute
                path="/"
                user={this.state.user}
                component={DashBoard}
                albums={this.state.albums}
                type="dashboard"
              />
            </Switch>
          </React.Fragment>
        </BrowserRouter>
      </Provider >
    );
  }
}

export default App;
