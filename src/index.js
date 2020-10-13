import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import App from './App';
import SignInPage from './components/SignInPage';
import SignUpPage from './components/SignUpPage';
import SignOutPage from './components/SignOutPage';
import ForgotPasswordPage from './components/ForgotPasswordPage';

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<Switch>
				<Route path="/user/forgot_password" component={ForgotPasswordPage} />
				<Route path="/user/sign_out" component={SignOutPage} />
				<Route path="/user/sign_up" component={SignUpPage} />
				<Route path="/user/sign_in" component={SignInPage} />
				<Route path="/" component={App} />
			</Switch>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById('root')
);
