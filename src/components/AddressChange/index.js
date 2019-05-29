import React, { Component } from 'react';

import { FirebaseContext, withFirebase } from '../Firebase';
import { AuthUserContext, withAuthorization } from '../Session';

const INITIAL_STATE = {
  newAddress: '',
  error: null,
  user: {},
};

class AddressChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { newAddress } = this.state;

    this.props.firebase.user("xSgfmZByxeYfSLO4c89iTlz5xqq1").update({"address": "Test"});

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  componentDidMount() {
/*
    this.props.firebase.user(currentUser.uid).once('value', snapshot => {
      const userObject = snapshot.val();
      
      return userObject.address
    });*/
  };

  render() {
    const { user, newAddress, error } = this.state;

    const isInvalid =
      newAddress === '';

    return (
      <AuthUserContext.Consumer>
        {authUser => (
          <div>
            <h1>{authUser.address}</h1>
            <form onSubmit={this.onSubmit}>
              <input
                name="newAddress"
                value={newAddress}
                onChange={this.onChange}
                type="text"
                placeholder="Enter New Address"
              />
              <button disabled={isInvalid} type="submit">
                Reset My Address
              </button>

              {error && <p>{error.message}</p>}
            </form>
          </div>
        )}
      </AuthUserContext.Consumer>   
    );
  }
}

export default withFirebase(AddressChangeForm);