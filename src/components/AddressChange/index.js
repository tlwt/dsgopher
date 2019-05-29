import React, { Component } from 'react';
import Geosuggest from 'react-geosuggest';

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

  onSuggestSelect = suggest => {
    this.setState({ address: suggest })
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
      <div>
        <p>Current Address: {authUser.address}</p>
        <form onSubmit={this.onSubmit}>
          <Geosuggest
            name="newAddress"
            value={newAddress}
            ref={el=>this._geoSuggest=el}
            placeholder="Enter new address"
            onSuggestSelect={this.onSuggestSelect}
          />
          <button disabled={isInvalid} type="submit">
            Reset My Address
          </button>

          {error && <p>{error.message}</p>}
        </form>
      </div>
    );
  }
}

export default withFirebase(AddressChangeForm);