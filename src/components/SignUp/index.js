import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { FirebaseContext } from '../Firebase';
import { withFirebase } from '../Firebase';
import { compose } from 'recompose';
import Geosuggest from 'react-geosuggest';

import * as ROUTES from '../../constants/routes';
import * as ROLES from '../../constants/roles';

const SignUpPage = () => (
  <div>
    <h1>SignUp</h1>
    <SignUpForm />
  </div>
);

const INITIAL_STATE = {
  username: '',
  email: '',
  passwordOne: '',
  passwordTwo: '',
  realName: '',
  address: '',
  isAdmin: false,
  error: null,
};

class SignUpFormBase extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { username, email, passwordOne, address, realName, isAdmin } = this.state;

    const roles = {};

    if (isAdmin) {
      roles[ROLES.ADMIN] = ROLES.ADMIN;
    }

    this.props.firebase
      .doCreateUserWithEmailAndPassword(email, passwordOne)
      .then(authUser => {
        // Create a user in your Firebase realtime database
        return this.props.firebase
        .user(authUser.user.uid)
        .set({
          username,
          email,
          realName,
          address,
          roles,
        });
      })
     .then(authUser => {
        this.setState({ ...INITIAL_STATE });
        this.props.history.push(ROUTES.HOME);
      })
      .catch(error => {
        this.setState({ error });
      });

    event.preventDefault();
  }

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  onChangeCheckbox = event => {
    this.setState({ [event.target.name]: event.target.checked });
  };

  render() {
  	const {
      username,
      email,
      passwordOne,
      passwordTwo,
      address,
      realName,
      isAdmin,
      error,
    } = this.state;
    
    const isInvalid =
      passwordOne !== passwordTwo ||
      passwordOne === '' ||
      email === '' ||
      username === '' ||
      address === '' ||
      realName === '';

    return (
      <form onSubmit={this.onSubmit}>
		    <input
          name="username"
          value={username}
          onChange={this.onChange}
          type="text"
          placeholder="Username"
        />
        <input
          name="email"
          value={email}
          onChange={this.onChange}
          type="email"
          placeholder="Email Address"
        />
        <input
          name="passwordOne"
          value={passwordOne}
          onChange={this.onChange}
          type="password"
          placeholder="Password"
        />
        <input
          name="passwordTwo"
          value={passwordTwo}
          onChange={this.onChange}
          type="password"
          placeholder="Confirm Password"
        />
        <input
          name="realName"
          value={realName}
          onChange={this.onChange}
          type="text"
          placeholder="Real Name"
        />
        <Geosuggest
          name="address"
          value={address}
          ref={el=>this._geoSuggest=el}
          placeholder="Address"
          onSuggestSelect={this.onChange}
        />
        <label>
          Admin:
          <input
          name="isAdmin"
          type="checkbox"
          checked={isAdmin}
          onChange={this.onChangeCheckbox}
          />
        </label>
        <button disabled={isInvalid} type="submit" onClick={()=>this._geoSuggest.selectSuggest()}>Sign Up</button>

        {error && <p>{error.message}</p>}
      </form>
    );
  }
}

const SignUpLink = () => (
  <p>
    Don't have an account? <Link to={ROUTES.SIGN_UP}>Sign Up</Link>
  </p>
);

const SignUpForm = compose(
  withRouter,
  withFirebase,
)(SignUpFormBase);

export default SignUpPage;

export { SignUpForm, SignUpLink };