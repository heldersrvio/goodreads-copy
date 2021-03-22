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
import BookGenreShelfPage from './components/Books/BookGenreShelfPage';
import BookTriviaPage from './components/Books/BookTriviaPage';
import BookQuotesPage from './components/Books/BookQuotesPage';
import BookListsPage from './components/Books/BookListsPage';
import AuthorPage from './components/Authors/AuthorPage';
import FavoriteAuthorsPage from './components/Authors/FavoriteAuthorsPage';
import FavoriteAuthorsForUserPage from './components/Authors/FavoriteAuthorsForUserPage';
import NotificationsPage from './components/Dashboard/NotificationsPage';
import AccountSettingsPage from './components/Dashboard/AccountSettingsPage';
import ChangePassswordPage from './components/Dashboard/ChangePasswordPage';
import DeleteAccountPage from './components/Dashboard/DeleteAccountPage';
import EditFavoriteGenresPage from './components/Dashboard/EditFavoriteGenresPage';
import GenrePage from './components/Dashboard/GenrePage';

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
					<Route
						path="/shelf/users/:bookGenreShelfPageId"
						component={BookGenreShelfPage}
					/>
					<Route
						path="/trivia/work/:bookTriviaPageId"
						component={BookTriviaPage}
					/>
					<Route
						path="/work/quotes/:bookQuotesPageId"
						component={BookQuotesPage}
					/>
					<Route path="/list/book/:bookId" component={BookListsPage} />
					<Route path="/author/show/:authorPageId" component={AuthorPage} />
					<Route path="/favorite_authors" component={FavoriteAuthorsPage} />
					<Route
						path="/user/:userId/favorite_authors"
						component={FavoriteAuthorsForUserPage}
					/>
					<Route path="/notifications" component={NotificationsPage} />
					<Route path="/user/edit" component={AccountSettingsPage} />
					<Route path="/user/change_password" component={ChangePassswordPage} />
					<Route path="/user/destroy" component={DeleteAccountPage} />
					<Route
						path="/user/edit_fav_genres"
						component={EditFavoriteGenresPage}
					/>
					<Route path="/genres/:genre" component={GenrePage} />
					<Route path="/" component={App} />
				</Switch>
			</BrowserRouter>
		</React.StrictMode>
	</Provider>,
	document.getElementById('root')
);
