import React from 'react';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { loginWithGithub } from "../../actions/"

class LoginPage extends React.Component {
    render() {
        return (
            <div className="container">
                <h1>Login</h1>
                <div className="row">
                    <div className="col s12">
                        <div className="row">
                            <div className="input-field col s12">
                                <i className="material-icons prefix" style={{color:"#ee6e73"}}>email</i>
                                <input id="email" type="email" className="validate" ref={email => this.email = email} />
                                <label htmlFor="email">Email</label>
                            </div>
                        </div>
                        <div className="row">
                            <div className="input-field col s12">
                                <i className="material-icons prefix" style={{color:"#ee6e73"}}>vpn_key</i>
                                <input id="password" style={{color:"#ee6e73"}} type="password" className="validate" ref={password => this.password = password} />
                                <label htmlFor="password">Password</label>
                            </div>
                        </div>
                        <div className="row">
                            <button className="btn navcolors" style={{backgroundColor:"#ee6e73"}} name="action"
                                onClick={() => {
                                    firebase.auth().signInWithEmailAndPassword(this.email.value, this.password.value)
                                        .catch((e) => {
                                            alert(e.message);
                                        })
                                }}
                            >Login
            <i className="material-icons right">send</i>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}
export default connect(null, { loginWithGithub })(LoginPage);