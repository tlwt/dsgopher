import React, { Component } from 'react';

import { FirebaseContext, withFirebase } from '../Firebase';
import { withAuthorization } from '../Session';

const INITIAL_STATE = {
  newAddress: '',
  error: null,
  authUser: {},
};

class AddressChangeForm extends Component {
  constructor(props) {
    super(props);

    this.state = { ...INITIAL_STATE };
  }

  onSubmit = event => {
    const { newAddress } = this.state;

    this.props.firebase.user(this.state.authUser.uid).update({"address": newAddress});

    event.preventDefault();
  };

  onChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  }

  componentDidMount() {
    this.listener = this.props.firebase.onAuthUserListener(
      authUser => {
        this.setState({ authUser });
      },
      () => {
        this.setState({ authUser: null });
      },
    );
  };

  render() {
    const { authUser, newAddress, error } = this.state;

    const isInvalid =
      newAddress === '';

    return (
      //<AuthUserContext.Consumer>
        //{authUser => (
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
        //)}
      //</AuthUserContext.Consumer>   
    );
  }
}

export default withFirebase(AddressChangeForm);