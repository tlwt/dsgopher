import React from 'react';

import { PasswordForgetForm } from '../PasswordForget';
import PasswordChangeForm from '../PasswordChange';
import AddressChangeForm from '../AddressChange';
import { AuthUserContext, withAuthorization } from '../Session';
import { withFirebase } from '../Firebase';

const AccountPage = () => (
	<AuthUserContext.Consumer>
    	{authUser => (
		  <div>
		    <h1>Account: {authUser.email}</h1>
		    <PasswordForgetForm />
		    <PasswordChangeForm />
		    <AddressChangeForm />
		  </div>
		)}
  	</AuthUserContext.Consumer>
);

const condition = authUser => !!authUser;

export default withAuthorization(condition)(AccountPage);