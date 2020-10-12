import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import App from './App';
import SignInPage from './components/SignInPage';

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<Switch>
				<Route path="/user/sign_in" component={SignInPage} />
				<Route path="/" component={App} />
			</Switch>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById('root')
);
