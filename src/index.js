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
import RecommendationsFromUsersPage from './components/Recommendations/RecommendationsFromUsersPage';
import RecommendationsFromYouPage from './components/Recommendations/RecommendationsFromYouPage';
import FollowersPage from './components/Friends/FollowersPage';
import PeopleFollowingPage from './components/Friends/PeopleFollowingPage';
import FriendsPage from './components/Friends/FriendsPage';
import ErrorPage from './components/Error/ErrorPage';
import ErrorBoundary from './ErrorBoundary';
import { TailSpin } from 'react-loader-spinner';
import { usePromiseTracker } from 'react-promise-tracker';
import 'react-loader-spinner/dist/loader/css/react-spinner-loader.css';

const store = createStore(reducer.userReducer);

const Stats = () => {
	const query = new URLSearchParams(useLocation().search);

	return query.get('just_this_edition') === 'yep' ? (
		<BookStatsForEditionPage bookId={query.get('id')} />
	) : (
		<BookAllStatsPage bookId={query.get('id')} />
	);
};

const LoadingIndicator = (_props) => {
	const { promiseInProgress } = usePromiseTracker();

	return (
		promiseInProgress && (
			<div className="tailspin-loader-container">
				<TailSpin color="#382110" height={100} width={100} />
			</div>
		)
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
						render={(routerProps) => (
							<ErrorBoundary>
								<App {...routerProps}></App>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/user/forgot_password"
						render={(routerProps) => (
							<ErrorBoundary>
								<ForgotPasswordPage {...routerProps}></ForgotPasswordPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/user/sign_out"
						render={(routerProps) => (
							<ErrorBoundary>
								<SignOutPage {...routerProps}></SignOutPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/user/sign_up"
						render={(routerProps) => (
							<ErrorBoundary>
								<SignUpPage {...routerProps}></SignUpPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/user/sign_in"
						render={(routerProps) => (
							<ErrorBoundary>
								<SignInPage {...routerProps}></SignInPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/book/show/:bookPageId"
						render={(routerProps) => (
							<ErrorBoundary>
								<BookPage {...routerProps}></BookPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/book/stats"
						render={(routerProps) => (
							<ErrorBoundary>
								<Stats {...routerProps}></Stats>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/book/new"
						render={(routerProps) => (
							<ErrorBoundary>
								<AddNewBookPage {...routerProps}></AddNewBookPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/work/shelves/:bookId"
						render={(routerProps) => (
							<ErrorBoundary>
								<BookTopShelvesPage {...routerProps}></BookTopShelvesPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/book/similar/:similarBooksPageId"
						render={(routerProps) => (
							<ErrorBoundary>
								<SimilarBooksPage {...routerProps}></SimilarBooksPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/work/editions/:bookEditionsPageId"
						render={(routerProps) => (
							<ErrorBoundary>
								<BookEditionsPage {...routerProps}></BookEditionsPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/book/photo/:bookCoverPageId"
						render={(routerProps) => (
							<ErrorBoundary>
								<BookCoverPage {...routerProps}></BookCoverPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/photo/work/:bookPhotoPageId"
						render={(routerProps) => (
							<ErrorBoundary>
								<BookPhotoPage {...routerProps}></BookPhotoPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/shelf/users/:bookGenreShelfPageId"
						render={(routerProps) => (
							<ErrorBoundary>
								<BookGenreShelfPage {...routerProps}></BookGenreShelfPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/trivia/work/:bookTriviaPageId"
						render={(routerProps) => (
							<ErrorBoundary>
								<BookTriviaPage {...routerProps}></BookTriviaPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/work/quotes/:bookQuotesPageId"
						render={(routerProps) => (
							<ErrorBoundary>
								<BookQuotesPage {...routerProps}></BookQuotesPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/list/book/:bookId"
						render={(routerProps) => (
							<ErrorBoundary>
								<BookListsPage {...routerProps}></BookListsPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/author/show/:authorPageId"
						render={(routerProps) => (
							<ErrorBoundary>
								<AuthorPage {...routerProps}></AuthorPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/favorite_authors"
						render={(routerProps) => (
							<ErrorBoundary>
								<FavoriteAuthorsPage {...routerProps}></FavoriteAuthorsPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/user/:userId/favorite_authors"
						render={(routerProps) => (
							<ErrorBoundary>
								<FavoriteAuthorsForUserPage
									{...routerProps}
								></FavoriteAuthorsForUserPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/notifications"
						render={(routerProps) => (
							<ErrorBoundary>
								<NotificationsPage {...routerProps}></NotificationsPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/user/edit"
						render={(routerProps) => (
							<ErrorBoundary>
								<AccountSettingsPage {...routerProps}></AccountSettingsPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/user/change_password"
						render={(routerProps) => (
							<ErrorBoundary>
								<ChangePassswordPage {...routerProps}></ChangePassswordPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/user/destroy"
						render={(routerProps) => (
							<ErrorBoundary>
								<DeleteAccountPage {...routerProps}></DeleteAccountPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/photo/user/:userPhotoPageId"
						render={(routerProps) => (
							<ErrorBoundary>
								<UserPhotoPage {...routerProps}></UserPhotoPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/user/edit_fav_genres"
						render={(routerProps) => (
							<ErrorBoundary>
								<EditFavoriteGenresPage
									{...routerProps}
								></EditFavoriteGenresPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/genres/:genre"
						render={(routerProps) => (
							<ErrorBoundary>
								<GenrePage {...routerProps}></GenrePage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/news"
						render={(routerProps) => (
							<ErrorBoundary>
								<NewsPage {...routerProps}></NewsPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/blog/show/:articlePageId"
						render={(routerProps) => (
							<ErrorBoundary>
								<ArticlePage {...routerProps}></ArticlePage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/rating/voters/:articleId"
						render={(routerProps) => (
							<ErrorBoundary>
								<ArticleLikedByPage {...routerProps}></ArticleLikedByPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/user/show/:userPageId"
						render={(routerProps) => (
							<ErrorBoundary>
								<UserPage {...routerProps}></UserPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/user/year_in_books/:year/:pageId"
						render={(routerProps) => (
							<ErrorBoundary>
								<UserYearInBooksPage {...routerProps}></UserYearInBooksPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/user/compare/:userId"
						render={(routerProps) => (
							<ErrorBoundary>
								<UserCompareBooksPage {...routerProps}></UserCompareBooksPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/book/compatibility_results"
						render={(routerProps) => (
							<ErrorBoundary>
								<BookCompatibilityTestPage
									{...routerProps}
								></BookCompatibilityTestPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/book/compatibility_test"
						render={(routerProps) => (
							<ErrorBoundary>
								<EditCompatibilityTestAnswersPage
									{...routerProps}
								></EditCompatibilityTestAnswersPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/friend/add_as_friend/:newFriendId"
						render={(routerProps) => (
							<ErrorBoundary>
								<UserAddAsFriendPage {...routerProps}></UserAddAsFriendPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/review/list/:pageId"
						render={(routerProps) => (
							<ErrorBoundary>
								<UserBookshelfPage {...routerProps}></UserBookshelfPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/recommendations/to_me"
						render={(routerProps) => (
							<ErrorBoundary>
								<RecommendationsFromUsersPage
									{...routerProps}
								></RecommendationsFromUsersPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/recommendations/from_me"
						render={(routerProps) => (
							<ErrorBoundary>
								<RecommendationsFromYouPage
									{...routerProps}
								></RecommendationsFromYouPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/user/:pageId/followers"
						render={(routerProps) => (
							<ErrorBoundary>
								<FollowersPage {...routerProps}></FollowersPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/user/:pageId/following"
						render={(routerProps) => (
							<ErrorBoundary>
								<PeopleFollowingPage {...routerProps}></PeopleFollowingPage>
							</ErrorBoundary>
						)}
					/>
					<Route
						path="/friend/user/:pageId"
						render={(routerProps) => (
							<ErrorBoundary>
								<FriendsPage {...routerProps}></FriendsPage>
							</ErrorBoundary>
						)}
					/>
					<Route component={ErrorPage} />
				</Switch>
				<LoadingIndicator />
			</BrowserRouter>
		</React.StrictMode>
	</Provider>,
	document.getElementById('root')
);
