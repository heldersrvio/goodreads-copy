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
import NewsPage from './components/News/NewsPage';
import ArticlePage from './components/News/ArticlePage';
import ArticleLikedByPage from './components/News/ArticleLikedByPage';
import UserPage from './components/User/UserPage';
import UserCompareBooksPage from './components/User/UserCompareBooksPage';
import BookCompatibilityTestPage from './components/User/BookCompatibilityTestPage';
import EditCompatibilityTestAnswersPage from './components/User/EditCompatibilityTestAnswersPage';
import UserAddAsFriendPage from './components/User/UserAddAsFriendPage';
import UserBookshelfPage from './components/User/UserBookshelfPage';
import UserPhotoPage from './components/User/UserPhotoPage';
import UserYearInBooksPage from './components/User/UserYearInBooksPage';
import ErrorPage from './components/Error/ErrorPage';
import ErrorBoundary from './ErrorBoundary';

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
					<Route
						path="/"
						exact
						render={() => (
							<ErrorBoundary>
								<App></App>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/user/forgot_password"
						render={() => (
							<ErrorBoundary>
								<ForgotPasswordPage></ForgotPasswordPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/user/sign_out"
						render={() => (
							<ErrorBoundary>
								<SignOutPage></SignOutPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/user/sign_up"
						render={() => (
							<ErrorBoundary>
								<SignUpPage></SignUpPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/user/sign_in"
						render={() => (
							<ErrorBoundary>
								<SignInPage></SignInPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/book/show/:bookPageId"
						render={() => (
							<ErrorBoundary>
								<BookPage></BookPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/book/stats"
						render={() => (
							<ErrorBoundary>
								<Stats></Stats>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/book/new"
						render={() => (
							<ErrorBoundary>
								<AddNewBookPage></AddNewBookPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/work/shelves/:bookId"
						render={() => (
							<ErrorBoundary>
								<BookTopShelvesPage></BookTopShelvesPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/book/similar/:similarBooksPageId"
						render={() => (
							<ErrorBoundary>
								<SimilarBooksPage></SimilarBooksPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/work/editions/:bookEditionsPageId"
						render={() => (
							<ErrorBoundary>
								<BookEditionsPage></BookEditionsPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/book/photo/:bookCoverPageId"
						render={() => (
							<ErrorBoundary>
								<BookCoverPage></BookCoverPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/photo/work/:bookPhotoPageId"
						render={() => (
							<ErrorBoundary>
								<BookPhotoPage></BookPhotoPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/shelf/users/:bookGenreShelfPageId"
						render={() => (
							<ErrorBoundary>
								<BookGenreShelfPage></BookGenreShelfPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/trivia/work/:bookTriviaPageId"
						render={() => (
							<ErrorBoundary>
								<BookTriviaPage></BookTriviaPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/work/quotes/:bookQuotesPageId"
						render={() => (
							<ErrorBoundary>
								<BookQuotesPage></BookQuotesPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/list/book/:bookId"
						render={() => (
							<ErrorBoundary>
								<BookListsPage></BookListsPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/author/show/:authorPageId"
						render={() => (
							<ErrorBoundary>
								<AuthorPage></AuthorPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/favorite_authors"
						render={() => (
							<ErrorBoundary>
								<FavoriteAuthorsPage></FavoriteAuthorsPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/user/:userId/favorite_authors"
						render={() => (
							<ErrorBoundary>
								<FavoriteAuthorsForUserPage></FavoriteAuthorsForUserPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/notifications"
						render={() => (
							<ErrorBoundary>
								<NotificationsPage></NotificationsPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/user/edit"
						render={() => (
							<ErrorBoundary>
								<AccountSettingsPage></AccountSettingsPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/user/change_password"
						render={() => (
							<ErrorBoundary>
								<ChangePassswordPage></ChangePassswordPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/user/destroy"
						render={() => (
							<ErrorBoundary>
								<DeleteAccountPage></DeleteAccountPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/photo/user/:userPhotoPageId"
						render={() => (
							<ErrorBoundary>
								<UserPhotoPage></UserPhotoPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/user/edit_fav_genres"
						render={() => (
							<ErrorBoundary>
								<EditFavoriteGenresPage></EditFavoriteGenresPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/genres/:genre"
						render={() => (
							<ErrorBoundary>
								<GenrePage></GenrePage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/news"
						render={() => (
							<ErrorBoundary>
								<NewsPage></NewsPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/blog/show/:articlePageId"
						render={() => (
							<ErrorBoundary>
								<ArticlePage></ArticlePage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/rating/voters/:articleId"
						render={() => (
							<ErrorBoundary>
								<ArticleLikedByPage></ArticleLikedByPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/user/show/:userPageId"
						render={() => (
							<ErrorBoundary>
								<UserPage></UserPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/user/year_in_books/:year/:userId"
						render={() => (
							<ErrorBoundary>
								<UserYearInBooksPage></UserYearInBooksPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/user/compare/:userId"
						render={() => (
							<ErrorBoundary>
								<UserCompareBooksPage></UserCompareBooksPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/book/compatibility_results"
						render={() => (
							<ErrorBoundary>
								<BookCompatibilityTestPage></BookCompatibilityTestPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/book/compatibility_test"
						render={() => (
							<ErrorBoundary>
								<EditCompatibilityTestAnswersPage></EditCompatibilityTestAnswersPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/friend/add_as_friend/:newFriendId"
						render={() => (
							<ErrorBoundary>
								<UserAddAsFriendPage></UserAddAsFriendPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/review/list/:pageId"
						render={() => (
							<ErrorBoundary>
								<UserBookshelfPage></UserBookshelfPage>
							</ErrorBoundary>
						)}
					/>
					<Route component={ErrorPage} />
				</Switch>
			</BrowserRouter>
		</React.StrictMode>
	</Provider>,
	document.getElementById('root')
);
