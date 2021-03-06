import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route, useLocation } from 'react-router-dom';
import { createStore } from 'redux';
import { Provider } from 'react-redux';
import reducer from './reducers/reducer';
import App from './App';
import SignInPage from './components/Authentication/SignInPage';
import SignUpPage from './components/Authentication/SignUpPage';
import SignOutPage from './components/Authentication/SignOutPage';
import BookPage from './components/Books/BookPage';
import ForgotPasswordPage from './components/Authentication/ForgotPasswordPage';
import BookStatsForEditionPage from './components/Books/BookStatsForEditionPage';
import BookAllStatsPage from './components/Books/BookAllStatsPage';
import SimilarBooksPage from './components/Books/SimilarBooksPage';
import BookEditionsPage from './components/Books/BookEditionsPage';
import BookCoverPage from './components/Books/BookCoverPage';
import BookPhotoPage from './components/Books/BookPhotoPage';
import AddNewBookPage from './components/Books/AddNewBookPage';
import BookTopShelvesPage from './components/Books/BookTopShelvesPage';

const store = createStore(reducer.userReducer);

const Stats = () => {
	const query = new URLSearchParams(useLocation().search);

	return query.get('just_this_edition') === 'yep' ? (
		<BookStatsForEditionPage bookId={query.get('id')} />
	) : (
		<BookAllStatsPage bookId={query.get('id')} />
	);
};

ReactDOM.render(
	<Provider store={store}>
		<React.StrictMode>
			<BrowserRouter>
				<Switch>
					<Route path="/user/forgot_password" component={ForgotPasswordPage} />
					<Route path="/user/sign_out" component={SignOutPage} />
					<Route path="/user/sign_up" component={SignUpPage} />
					<Route path="/user/sign_in" component={SignInPage} />
					<Route path="/book/show/:bookPageId" component={BookPage} />
					<Route path="/book/stats" component={Stats} />
					<Route path="/book/new" component={AddNewBookPage} />
					<Route path="/work/shelves/:bookId" component={BookTopShelvesPage} />
					<Route
						path="/book/similar/:similarBooksPageId"
						component={SimilarBooksPage}
					/>
					<Route
						path="/work/editions/:bookEditionsPageId"
						component={BookEditionsPage}
					/>
					<Route
						path="/book/photo/:bookCoverPageId"
						component={BookCoverPage}
					/>
					<Route
						path="/photo/work/:bookPhotoPageId"
						component={BookPhotoPage}
					/>
					<Route path="/" component={App} />
				</Switch>
			</BrowserRouter>
		</React.StrictMode>
	</Provider>,
	document.getElementById('root')
);
