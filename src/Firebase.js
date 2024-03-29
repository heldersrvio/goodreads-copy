import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { differenceInDays, endOfYear, startOfYear } from 'date-fns';

const Firebase = (() => {
	const firebaseConfig = {
		apiKey: 'AIzaSyCgUVtCN8iWCzV7N3_zptMhvSdw-Z2gJ7c',
		authDomain: 'goodreads-copy.firebaseapp.com',
		databaseURL: 'https://goodreads-copy.firebaseio.com',
		projectId: 'goodreads-copy',
		storageBucket: 'goodreads-copy.appspot.com',
		messagingSenderId: '76297927706',
		appId: '1:76297927706:web:fba0aae0bdb5c9bf21e5a3',
	};

	firebase.initializeApp(firebaseConfig);

	const database = firebase.firestore();

	const pageGenerator = (() => {
		const generateHomePage = () => {
			return '/' + process.env.REACT_APP_BASE_URL + '/';
		};

		const generateSignInPage = () => {
			return '/' + process.env.REACT_APP_BASE_URL + '/user/sign_in';
		};

		const generateSignOutPage = () => {
			return '/' + process.env.REACT_APP_BASE_URL + '/user/sign_out';
		};

		const generateSignUpPage = () => {
			return '/' + process.env.REACT_APP_BASE_URL + '/user/sign_up';
		};

		const generateForgotPasswordPage = () => {
			return '/' + process.env.REACT_APP_BASE_URL + '/user/forgot_password';
		};

		const generateExplorePage = () => {
			return '/' + process.env.REACT_APP_BASE_URL + '/explore';
		};

		const generateSearchPage = (q, searchType, searchField) => {
			return (
				'/' +
				process.env.REACT_APP_BASE_URL +
				'/search?q=' +
				q +
				'&search_type=' +
				searchType +
				'&search_field=' +
				searchField
			);
		};

		const generateBookPage = (bookId, title) => {
			return (
				'/' +
				process.env.REACT_APP_BASE_URL +
				'/book/show/' +
				bookId +
				'.' +
				title.replace(/ /g, '_')
			);
		};

		const generateAddBookPage = () => {
			return '/' + process.env.REACT_APP_BASE_URL + '/book/new';
		};

		const generateBookCoverPage = (bookId, title) => {
			return (
				'/' +
				process.env.REACT_APP_BASE_URL +
				'/book/photo/' +
				bookId +
				'.' +
				title.replace(/ /g, '_')
			);
		};

		const generateBookPhotoPage = (bookId, title, photoId) => {
			return (
				'/' +
				process.env.REACT_APP_BASE_URL +
				'/photo/work/' +
				bookId +
				'.' +
				title.replace(/ /g, '_') +
				'?photo=' +
				photoId
			);
		};

		const generateBookEditionsPage = (originalBookId, originalBookTitle) => {
			return (
				'/' +
				process.env.REACT_APP_BASE_URL +
				'/work/editions/' +
				originalBookId +
				'.' +
				originalBookTitle.replace(/ /g, '_')
			);
		};

		const generateBookListsPage = (bookId) => {
			return '/' + process.env.REACT_APP_BASE_URL + '/list/book' + bookId;
		};

		const generateSeriesPage = (seriesId, name) => {
			return `/series/${seriesId}-${name.toLowerCase().replace(/ /g, '-')}`;
		};

		const generateAuthorPage = (authorId, name) => {
			return (
				'/' +
				process.env.REACT_APP_BASE_URL +
				'/author/show/' +
				authorId +
				'.' +
				name.replace(/ /g, '_')
			);
		};

		const generateListopiaPage = () => {
			return '/' + process.env.REACT_APP_BASE_URL + '/list';
		};

		const generateCreateListPage = () => {
			return '/' + process.env.REACT_APP_BASE_URL + '/list/new';
		};

		const generateListsCreatedByUserPage = (userId, firstName) => {
			return (
				'/' +
				process.env.REACT_APP_BASE_URL +
				'/list/created/' +
				userId +
				'-' +
				firstName.toLowerCase()
			);
		};

		const generateListsVotedByUserPage = (userId, firstName) => {
			return (
				'/' +
				process.env.REACT_APP_BASE_URL +
				'/list/user_votes/' +
				userId +
				'-' +
				firstName.toLowerCase()
			);
		};

		const generateListsLikedByUserPage = (userId, firstName) => {
			return (
				'/' +
				process.env.REACT_APP_BASE_URL +
				'/list/liked/' +
				userId +
				'-' +
				firstName.toLowerCase()
			);
		};

		const generateListPage = (listId, title) => {
			return (
				'/' +
				process.env.REACT_APP_BASE_URL +
				'/list/show/' +
				listId +
				'.' +
				title.replace(/ /g, '_')
			);
		};

		const generateUserPage = (userId, firstName) => {
			return (
				'/' +
				process.env.REACT_APP_BASE_URL +
				'/user/show/' +
				userId +
				'-' +
				firstName.toLowerCase()
			);
		};

		const generateUserPhotoPage = (userId) => {
			return '/' + process.env.REACT_APP_BASE_URL + '/photo/user/' + userId;
		};

		const generateUserBooksPage = (userId) => {
			return '/' + process.env.REACT_APP_BASE_URL + '/review/list/' + userId;
		};

		const generateUserRatingsPage = (userId) => {
			return (
				'/' +
				process.env.REACT_APP_BASE_URL +
				'/review/list/' +
				userId +
				'?sort=rating&view=reviews'
			);
		};

		const generateUserReviewsPage = (userId) => {
			return (
				'/' +
				process.env.REACT_APP_BASE_URL +
				'/review/list/' +
				userId +
				'?sort=review&view=reviews'
			);
		};

		const generateUserShelfPage = (
			userId,
			firstName,
			shelves = ['all'],
			searchTerm = '',
			view = 'table',
			perPageValue = '20',
			page = '1'
		) => {
			const viewValue = view === undefined ? 'table' : view;
			const shelvesValue = shelves.length === 0 ? ['all'] : shelves;
			return (
				'/' +
				process.env.REACT_APP_BASE_URL +
				'/review/list/' +
				userId +
				'-' +
				firstName.toLowerCase() +
				'?shelf=' +
				shelvesValue.join(',') +
				'&view=' +
				viewValue +
				'&search_query=' +
				searchTerm +
				'&per_page=' +
				perPageValue +
				'&page=' +
				page
			);
		};

		const generateBookGenreShelfPage = (bookId, title, genre) => {
			return (
				'/' +
				process.env.REACT_APP_BASE_URL +
				'/shelf/users/' +
				bookId +
				'.' +
				title.replace(/ /g, '_') +
				'?shelf=' +
				genre.toLowerCase().replace(/ /g, '-')
			);
		};

		const generateBookTopShelvesPage = (bookId) => {
			return '/' + process.env.REACT_APP_BASE_URL + '/work/shelves/' + bookId;
		};

		const generateBookStatsPage = (bookId) => {
			return '/' + process.env.REACT_APP_BASE_URL + '/book/stats?id=' + bookId;
		};
		const generateBookStatsPageForEdition = (bookId) => {
			return (
				'/' +
				process.env.REACT_APP_BASE_URL +
				'/book/stats?id=' +
				bookId +
				'&just_this_edition=yep'
			);
		};

		const generateReviewPage = (reviewId) => {
			return '/' + process.env.REACT_APP_BASE_URL + '/review/show/' + reviewId;
		};

		const generateReviewLikesPage = (reviewId) => {
			return (
				'/' +
				process.env.REACT_APP_BASE_URL +
				'/rating/voters/' +
				reviewId +
				'?resource_type=Review'
			);
		};

		const generateSimilarBooksPage = (bookId, title) => {
			return (
				'/' +
				process.env.REACT_APP_BASE_URL +
				'/book/similar/' +
				bookId +
				'.' +
				title.replace(/ /g, '_')
			);
		};

		const generateGenrePage = (genre) => {
			return (
				'/' +
				process.env.REACT_APP_BASE_URL +
				'/genres/' +
				genre.toLowerCase().replace(/ /g, '-')
			);
		};

		const generateBooksByAuthorPage = (authorId, name) => {
			return (
				'/' +
				process.env.REACT_APP_BASE_URL +
				'/author/list/' +
				authorId +
				'.' +
				name.replace(/ /g, '_')
			);
		};

		const generateArticlePage = (articleId, title) => {
			return (
				'/' +
				process.env.REACT_APP_BASE_URL +
				'/blog/show/' +
				articleId +
				'-' +
				title.toLowerCase().replace(/ /g, '-')
			);
		};

		const generateBookTriviaPage = (bookId, title) => {
			return (
				'/' +
				process.env.REACT_APP_BASE_URL +
				'/trivia/work/' +
				bookId +
				'.' +
				title.replace(/ /g, '_')
			);
		};

		const generateQuizzesPage = () => {
			return '/' + process.env.REACT_APP_BASE_URL + '/quizzes';
		};

		const generateQuizPage = (quizId, title) => {
			return (
				'/' +
				process.env.REACT_APP_BASE_URL +
				'/quizzes/' +
				quizId +
				'-' +
				title.toLowerCase().replace(/ /g, '-')
			);
		};

		const generateCreateQuizPage = () => {
			return '/' + process.env.REACT_APP_BASE_URL + '/quizzes/new';
		};

		const generateQuotesPage = () => {
			return '/' + process.env.REACT_APP_BASE_URL + '/quotes';
		};

		const generateBookQuotesPage = (bookId, title) => {
			return (
				'/' +
				process.env.REACT_APP_BASE_URL +
				'/work/quotes/' +
				bookId +
				'-' +
				title.toLowerCase().replace(/ /g, '-')
			);
		};

		const generateQuotePage = (quoteId, text) => {
			return (
				'/' +
				process.env.REACT_APP_BASE_URL +
				'/quotes/' +
				quoteId +
				'-' +
				text.slice(0, 50).toLowerCase().replace(/ /g, '-')
			);
		};

		const generateAddQuotePage = () => {
			return '/' + process.env.REACT_APP_BASE_URL + '/quotes/new';
		};

		const generateQuotesTagPage = (tag) => {
			return '/' + process.env.REACT_APP_BASE_URL + '/quotes/tag/' + tag;
		};

		const generateQuotesSearchPage = (queryTerm) => {
			return (
				'/' + process.env.REACT_APP_BASE_URL + '/quotes/search?q=' + queryTerm
			);
		};

		const generateWriteReviewPageForBook = (bookId) => {
			return '/' + process.env.REACT_APP_BASE_URL + '/review/edit' + bookId;
		};

		const generateUserCompareBooksPage = (userId) => {
			return '/' + process.env.REACT_APP_BASE_URL + '/user/compare/' + userId;
		};

		const generateFavoriteAuthorsPage = () => {
			return '/' + process.env.REACT_APP_BASE_URL + '/favorite_authors';
		};

		const generateUserFavoriteAuthorsPage = (userId) => {
			return (
				'/' +
				process.env.REACT_APP_BASE_URL +
				'/user/' +
				userId +
				'/' +
				process.env.REACT_APP_BASE_URL +
				'/favorite_authors'
			);
		};

		const generateUserYearInBooksPage = (year, userId, name) => {
			return (
				'/' +
				process.env.REACT_APP_BASE_URL +
				'/user/year_in_books/' +
				year +
				'/' +
				userId +
				'-' +
				name.toLowerCase().replace(/ /g, '-')
			);
		};

		const generateUserFriendsPage = (userId, name) => {
			return (
				'/' +
				process.env.REACT_APP_BASE_URL +
				'/friend/user/' +
				userId +
				'-' +
				name.toLowerCase().replace(/ /g, '-')
			);
		};

		const generateInviteFriendsPage = () => {
			return '/' + process.env.REACT_APP_BASE_URL + '/friend/invite';
		};

		const generateAccountSettingsPage = () => {
			return '/' + process.env.REACT_APP_BASE_URL + '/user/edit';
		};

		const generateChangePasswordPage = () => {
			return '/' + process.env.REACT_APP_BASE_URL + '/user/change_password';
		};

		const generateDeleteAccountPage = () => {
			return '/' + process.env.REACT_APP_BASE_URL + '/user/destroy';
		};

		const generateEditFavoriteGenresPage = () => {
			return '/' + process.env.REACT_APP_BASE_URL + '/user/edit_fav_genres';
		};

		const generateNewsPage = () => {
			return '/' + process.env.REACT_APP_BASE_URL + '/news';
		};

		const generateAllStoriesNewsPage = () => {
			return '/' + process.env.REACT_APP_BASE_URL + '/news?content_type=all';
		};

		const generateArticlesNewsPage = () => {
			return (
				'/' + process.env.REACT_APP_BASE_URL + '/news?content_type=articles'
			);
		};

		const generateInterviewsNewsPage = () => {
			return (
				'/' + process.env.REACT_APP_BASE_URL + '/news?content_type=interviews'
			);
		};

		const generateArticleLikesPage = (articleId) => {
			return (
				'/' +
				process.env.REACT_APP_BASE_URL +
				'/rating/voters/' +
				articleId +
				'?resource_type=Article'
			);
		};

		const generateAddAsFriendPage = (userId) => {
			return (
				'/' + process.env.REACT_APP_BASE_URL + '/friend/add_as_friend/' + userId
			);
		};

		const generateRecommendationsPage = (isReceiver = true) => {
			return `/recommendations/${isReceiver ? 'to_me' : 'from_me'}`;
		};

		const generateGiveRecommendationPage = () => {
			return '/' + process.env.REACT_APP_BASE_URL + '/recommendations/new';
		};

		const generateGiveRecommendationToUserPage = (userId) => {
			return (
				'/' +
				process.env.REACT_APP_BASE_URL +
				'/recommendation/new?recommendation%5Bto_user_id%5D=' +
				userId
			);
		};

		const generateBookCompatibilityTestPage = (userId, name) => {
			return (
				'/' +
				process.env.REACT_APP_BASE_URL +
				'/book/compatibility_results?id=' +
				userId +
				'-' +
				name.toLowerCase().replace(/ /g, '-')
			);
		};

		const generateBookEditCompatibilityTestAnswersPage = (userId) => {
			return (
				'/' +
				process.env.REACT_APP_BASE_URL +
				'/book/compatibility_test?id=' +
				userId
			);
		};

		return {
			generateHomePage,
			generateSignInPage,
			generateSignOutPage,
			generateSignUpPage,
			generateForgotPasswordPage,
			generateExplorePage,
			generateSearchPage,
			generateBookPage,
			generateAddBookPage,
			generateBookCoverPage,
			generateBookPhotoPage,
			generateBookEditionsPage,
			generateBookListsPage,
			generateSeriesPage,
			generateAuthorPage,
			generateListopiaPage,
			generateCreateListPage,
			generateListsCreatedByUserPage,
			generateListsVotedByUserPage,
			generateListsLikedByUserPage,
			generateListPage,
			generateUserPage,
			generateUserPhotoPage,
			generateUserBooksPage,
			generateUserRatingsPage,
			generateUserReviewsPage,
			generateUserShelfPage,
			generateReviewPage,
			generateReviewLikesPage,
			generateBookGenreShelfPage,
			generateBookTopShelvesPage,
			generateBookStatsPage,
			generateBookStatsPageForEdition,
			generateSimilarBooksPage,
			generateGenrePage,
			generateBooksByAuthorPage,
			generateArticlePage,
			generateBookTriviaPage,
			generateQuizzesPage,
			generateQuizPage,
			generateCreateQuizPage,
			generateQuotesPage,
			generateBookQuotesPage,
			generateQuotePage,
			generateAddQuotePage,
			generateQuotesTagPage,
			generateQuotesSearchPage,
			generateWriteReviewPageForBook,
			generateUserCompareBooksPage,
			generateFavoriteAuthorsPage,
			generateUserFavoriteAuthorsPage,
			generateUserYearInBooksPage,
			generateUserFriendsPage,
			generateInviteFriendsPage,
			generateAccountSettingsPage,
			generateChangePasswordPage,
			generateDeleteAccountPage,
			generateEditFavoriteGenresPage,
			generateNewsPage,
			generateAllStoriesNewsPage,
			generateArticlesNewsPage,
			generateInterviewsNewsPage,
			generateArticleLikesPage,
			generateAddAsFriendPage,
			generateRecommendationsPage,
			generateGiveRecommendationPage,
			generateGiveRecommendationToUserPage,
			generateBookCompatibilityTestPage,
			generateBookEditCompatibilityTestAnswersPage,
		};
	})();

	const getSeriesDetailsForBook = async (rootBook, bookTitle) => {
		const rootBookQuery = await database
			.collection('rootBooks')
			.doc(rootBook)
			.get();
		const seriesInfo = {};
		if (rootBookQuery.data().series !== undefined) {
			seriesInfo.seriesInstance = rootBookQuery.data().seriesInstance;
			const seriesQuery = await database
				.collection('series')
				.doc(rootBookQuery.data().series)
				.get();
			seriesInfo.series = { name: seriesQuery.data().name };
			seriesInfo.series.page = pageGenerator.generateSeriesPage(
				seriesQuery.id,
				seriesInfo.series.name
			);
			const booksInSeriesQuery = await database
				.collection('books')
				.where('series', '==', seriesInfo.series.name)
				.where('title', '!=', bookTitle)
				.get();
			seriesInfo.series.otherBooksIds = booksInSeriesQuery.docs.map(
				(document) => document.id
			);
			seriesInfo.series.otherBooksCovers = booksInSeriesQuery.docs.map(
				(document) => document.data().cover
			);
		}
		return seriesInfo;
	};

	const getMainAuthorDetailsForBook = async (rootBook, userUID) => {
		const rootBookQuery = await database
			.collection('rootBooks')
			.doc(rootBook)
			.get();
		const mainAuthorQuery = await database
			.collection('authors')
			.doc(rootBookQuery.data().authorId)
			.get();
		const authorDetails = {};
		authorDetails.mainAuthorId = rootBookQuery.data().authorId;
		authorDetails.authorNames = [];
		authorDetails.authorPages = [];
		authorDetails.authorNames.push(mainAuthorQuery.data().name);
		authorDetails.authorPages.push(
			pageGenerator.generateAuthorPage(
				rootBookQuery.data().authorId,
				mainAuthorQuery.data().name
			)
		);
		authorDetails.authorIsMember = mainAuthorQuery.data().GRMember;
		authorDetails.authorFollowerCount =
			mainAuthorQuery.data().followersIds !== undefined
				? mainAuthorQuery.data().followersIds.length
				: 0;
		authorDetails.userIsFollowingAuthor =
			mainAuthorQuery.data().followersIds !== undefined
				? mainAuthorQuery.data().followersIds.includes(userUID)
				: false;
		authorDetails.booksByAuthorPage = pageGenerator.generateBooksByAuthorPage(
			rootBookQuery.data().authorId,
			mainAuthorQuery.data().name
		);
		if (mainAuthorQuery.data().about !== undefined) {
			authorDetails.mainAuthorAbout = mainAuthorQuery.data().about;
		}
		if (mainAuthorQuery.data().picture !== undefined) {
			authorDetails.mainAuthorPicture = mainAuthorQuery.data().picture;
		}
		return authorDetails;
	};

	const getOtherAuthorsDetailsForBook = async (
		otherAuthors,
		authorNames,
		authorPages,
		authorFunctions
	) => {
		const otherAuthorsQuery =
			otherAuthors !== undefined
				? await Promise.all(
						otherAuthors.map(
							async (author) =>
								await database.collection('authors').doc(author.id).get()
						)
				  )
				: null;
		const otherAuthorsQueryData =
			otherAuthorsQuery !== null
				? otherAuthorsQuery.map((document) => document.data())
				: null;
		if (otherAuthorsQueryData !== null) {
			for (let i = 0; i < otherAuthorsQueryData.length; i++) {
				authorNames.push(otherAuthorsQueryData[i].name);
				authorPages.push(
					pageGenerator.generateAuthorPage(
						otherAuthors[i].id,
						otherAuthorsQueryData[i].name
					)
				);
				authorFunctions.push(otherAuthors[i].role);
			}
		}
	};

	const getUserDetailsForBook = async (userUID, bookId) => {
		const userDetails = {};
		if (userUID !== null && userUID !== undefined) {
			const bookInstanceQuery = await database
				.collection('userBooksInstances')
				.where('userId', '==', userUID)
				.where('bookId', '==', bookId)
				.get();
			const bookInstanceQueryResults = bookInstanceQuery.docs.map((document) =>
				document.data()
			);
			if (bookInstanceQueryResults.length > 0) {
				userDetails.userStatus = bookInstanceQueryResults[0].status;
				if (bookInstanceQueryResults[0].progress !== undefined) {
					userDetails.userProgress = bookInstanceQueryResults[0].progress;
				}
				if (bookInstanceQueryResults[0].rating !== undefined) {
					userDetails.userRating = bookInstanceQueryResults[0].rating;
				}
				if (bookInstanceQueryResults[0].position !== undefined) {
					userDetails.toReadBookPosition = bookInstanceQueryResults[0].position;
				}
			}
		}
		const allBookInstancesQuery = await database
			.collection('userBooksInstances')
			.get();
		userDetails.thisEditionRatings = 0;
		userDetails.thisEditionRating = 0;
		userDetails.thisEditionAddedBy = 0;
		userDetails.fiveRatings = 0;
		userDetails.fourRatings = 0;
		userDetails.threeRatings = 0;
		userDetails.twoRatings = 0;
		userDetails.oneRatings = 0;
		userDetails.addedBy = 0;
		userDetails.toReads = 0;
		const bookQuery = await database.collection('books').doc(bookId).get();
		const rootBook = bookQuery.data().rootBook;
		const allEditionsQuery = await database
			.collection('books')
			.where('rootBook', '==', rootBook)
			.get();
		const otherEditionsIds = allEditionsQuery.docs
			.filter((document) => document.id !== bookId)
			.map((document) => document.id);
		userDetails.otherEditionsTitles = allEditionsQuery.docs
			.filter((document) => document.id !== bookId)
			.map((document) => document.data().title);
		userDetails.otherEditionsISBNs = allEditionsQuery.docs
			.filter((document) => document.id !== bookId)
			.map((document) => document.data().ISBN);
		userDetails.otherEditionsCovers = allEditionsQuery.docs
			.filter((document) => document.id !== bookId)
			.map((document) => document.data().cover);
		userDetails.otherEditionsPages = allEditionsQuery.docs
			.filter((document) => document.id !== bookId)
			.map((document) =>
				pageGenerator.generateBookPage(document.id, document.data().title)
			);
		userDetails.otherEditionsAddedBy = allEditionsQuery.docs
			.filter((document) => document.id !== bookId)
			.map((_document) => 0);
		const allEditionsQueryBooks = allEditionsQuery.docs.map(
			(document) => document.id
		);
		allBookInstancesQuery.docs.forEach((document) => {
			if (allEditionsQueryBooks.includes(document.data().bookId)) {
				if (
					document.data().bookId === bookId &&
					document.data().rating !== undefined
				) {
					userDetails.thisEditionRatings++;
					userDetails.thisEditionRating += document.data().rating;
					userDetails.thisEditionAddedBy++;
				} else if (document.data().bookId === bookId) {
					userDetails.thisEditionAddedBy++;
				} else {
					userDetails.otherEditionsAddedBy[
						otherEditionsIds.indexOf(document.data().bookId)
					]++;
				}
				userDetails.addedBy++;
				if (document.data().status === 'to-read') {
					userDetails.toReads++;
				}
				switch (document.data().rating) {
					case 5:
						userDetails.fiveRatings++;
						break;
					case 4:
						userDetails.fourRatings++;
						break;
					case 3:
						userDetails.threeRatings++;
						break;
					case 2:
						userDetails.twoRatings++;
						break;
					case 1:
						userDetails.oneRatings++;
						break;
					default:
						break;
				}
			}
		});
		userDetails.thisEditionRating =
			userDetails.thisEditionRatings !== 0
				? userDetails.thisEditionRating / userDetails.thisEditionRatings
				: 0;
		return userDetails;
	};

	const getReviewDetailsForBook = async (bookId, title, userUID) => {
		const bookQuery = await database.collection('books').doc(bookId).get();
		const rootBook = bookQuery.data().rootBook;
		const reviewQuery = await database.collection('reviews').get();
		const bookReviews = [];
		await Promise.all(
			reviewQuery.docs.map(async (document) => {
				const bookQuery = await database
					.collection('books')
					.doc(document.data().bookEdition)
					.get();
				if (bookQuery.data().rootBook === rootBook) {
					bookReviews.push(document);
				}
			})
		);
		const reviewDetails = {};
		reviewDetails.reviews = await Promise.all(
			bookReviews.map(async (document) => {
				const review = {};
				review.user = document.data().user;
				const userBooksInstancesQuery = await database
					.collection('userBooksInstances')
					.where('bookId', '==', bookId)
					.where('userId', '==', review.user)
					.get();
				if (userBooksInstancesQuery.docs[0].data().rating !== undefined) {
					review.rating = userBooksInstancesQuery.docs[0].data().rating;
				} else {
					review.rating = 0;
				}
				const userQuery = await database
					.collection('users')
					.doc(review.user)
					.get();
				review.userName = userQuery.data().firstName;
				if (userQuery.data().lastName !== undefined) {
					review.userName = review.userName + ' ' + userQuery.data().lastName;
				}
				if (userQuery.data().profileImage !== undefined) {
					review.profileImage = userQuery.data().profileImage;
				}
				if (userQuery.data().shelves !== undefined) {
					review.shelves = document.data().shelves;
				}
				review.id = document.id;
				review.date = document.data().date.toDate();
				review.edition = document.data().bookEdition;
				review.editionLink = pageGenerator.generateBookPage(
					review.edition,
					title
				);
				review.text = document.data().text;
				review.numberOfLikes = document.data().usersWhoLiked.length;
				review.likedByUser = document.data().usersWhoLiked.includes(userUID);
				if (document.data().recommendsItFor !== undefined) {
					review.recommendsItFor = document.data().recommendsItFor;
				}
				return review;
			})
		);
		return reviewDetails;
	};

	const getMiscDetailsForBook = (bookDocumentData) => {
		const miscDetails = {};
		if (bookDocumentData.preSynopsis !== undefined) {
			miscDetails.preSynopsis = bookDocumentData.preSynopsis;
		}
		if (bookDocumentData.synopsis !== undefined) {
			miscDetails.synopsis = bookDocumentData.synopsis;
		}
		if (bookDocumentData.amazonLink !== undefined) {
			miscDetails.amazonLink = bookDocumentData.amazonLink;
		}
		if (bookDocumentData.type !== undefined) {
			miscDetails.type = bookDocumentData.type;
		}
		if (bookDocumentData.publisher !== undefined) {
			miscDetails.publisher = bookDocumentData.publisher;
		}
		if (bookDocumentData.pageCount !== undefined) {
			miscDetails.pageCount = bookDocumentData.pageCount;
		}
		if (bookDocumentData.publishedDate !== undefined) {
			miscDetails.editionPublishedDate = bookDocumentData.publishedDate.toDate();
		}
		if (bookDocumentData.ISBN !== undefined) {
			miscDetails.ISBN = bookDocumentData.ISBN;
		}
		if (bookDocumentData.language !== undefined) {
			miscDetails.language = bookDocumentData.language;
		}
		return miscDetails;
	};

	const getFirstEditionInfoForBook = async (rootBook) => {
		const firstEditionInfo = {};
		const firstEditionQuery = await database
			.collection('books')
			.where('rootBook', '==', rootBook)
			.orderBy('publishedDate')
			.limit(1)
			.get();
		firstEditionInfo.firstEditionPublishedYear = firstEditionQuery.docs[0]
			.data()
			.publishedDate.toDate()
			.getFullYear();
		firstEditionInfo.originalId = firstEditionQuery.docs[0].id;
		firstEditionInfo.originalTitle = firstEditionQuery.docs[0].data().title;
		return firstEditionInfo;
	};

	const getListsForBook = async (bookId) => {
		const listsQuery = await database
			.collection('lists')
			.where('books', 'array-contains', bookId)
			.get();
		const lists = await Promise.all(
			listsQuery.docs.map(async (document) => {
				const list = {};
				list.id = document.id;
				list.title = document.data().title;
				list.bookIds = document.data().books;
				list.voterCount = document.data().userVotes.length;
				list.bookTitles = [];
				list.bookCovers = [];
				await Promise.all(
					list.bookIds.map(async (id) => {
						const bookQuery = await database.collection('books').doc(id).get();
						list.bookTitles.push(bookQuery.data().title);
						list.bookCovers.push(bookQuery.data().cover);
					})
				);
				return list;
			})
		);
		return lists;
	};

	const getGenresForBook = async (rootBook) => {
		const shelfQuery = await database
			.collection('shelves')
			.where('rootBooks', 'array-contains', rootBook)
			.where('genre', '!=', null)
			.get();
		const genreDictionary = {};
		await Promise.all(
			shelfQuery.docs.map(async (document) => {
				const genreQuery = await database
					.collection('genres')
					.doc(document.data().genre)
					.get();
				if (genreDictionary[genreQuery.data().name] === undefined) {
					genreDictionary[genreQuery.data().name] = 1;
				} else {
					genreDictionary[genreQuery.data().name] += 1;
				}
			})
		);
		const genres = Object.keys(genreDictionary).map((key, index) => {
			return {
				genre: key,
				userCount: genreDictionary[key],
			};
		});
		return genres;
	};

	const getPublishedBooksByAuthor = async (rootBook) => {
		const rootBookQuery = await database
			.collection('rootBooks')
			.doc(rootBook)
			.get();
		const authorId = rootBookQuery.data().authorId;
		const rootBooksByAuthorQuery = await database
			.collection('rootBooks')
			.where('authorId', '==', authorId)
			.get();
		return await Promise.all(
			rootBooksByAuthorQuery.docs
				.filter((document) => document.id !== rootBook)
				.map(async (document) => {
					const bookQuery = await database
						.collection('books')
						.where('rootBook', '==', document.id)
						.where('mainEdition', '==', true)
						.get();
					return {
						id: bookQuery.docs[0].id,
						cover: bookQuery.docs[0].data().cover,
						page: Firebase.pageGenerator.generateBookPage(
							bookQuery.docs[0].id,
							bookQuery.docs[0].data().title
						),
					};
				})
		);
	};

	const getAlsoEnjoyedBooksForBook = async (rootBook) => {
		const rootBookQuery = await database
			.collection('rootBooks')
			.doc(rootBook)
			.get();
		if (rootBookQuery.data().alsoEnjoyed === undefined) {
			return [];
		}
		return await Promise.all(
			rootBookQuery.data().alsoEnjoyed.map(async (book) => {
				const bookQuery = await database
					.collection('books')
					.where('rootBook', '==', book)
					.where('mainEdition', '==', true)
					.get();
				return {
					id: bookQuery.docs[0].id,
					title: bookQuery.docs[0].data().title,
					cover: bookQuery.docs[0].data().cover,
				};
			})
		);
	};

	const getAlsoEnjoyedBooksDetails = async (userUID, bookId, isMainBook) => {
		let mainEditionId = bookId;
		if (!isMainBook) {
			const mainEditionQuery = await database
				.collection('books')
				.where('rootBook', '==', bookId)
				.where('mainEdition', '==', true)
				.get();
			mainEditionId = mainEditionQuery.docs[0].id;
		}
		const bookObj = {
			id: mainEditionId,
		};
		const bookQuery = await database
			.collection('books')
			.doc(mainEditionId)
			.get();
		bookObj.title = bookQuery.data().title;
		bookObj.cover = bookQuery.data().cover;
		bookObj.rootBook = bookQuery.data().rootBook;
		if (bookQuery.data().preSynopsis !== undefined) {
			bookObj.preSynopsis = bookQuery.data().preSynopsis;
		}
		if (bookQuery.data().synopsis !== undefined) {
			bookObj.synopsis = bookQuery.data().synopsis;
		}
		const rootBook = bookQuery.data().rootBook;
		const rootBookQuery = await database
			.collection('rootBooks')
			.doc(rootBook)
			.get();
		const authorQuery = await database
			.collection('authors')
			.doc(rootBookQuery.data().authorId)
			.get();
		bookObj.authorName = authorQuery.data().name;
		bookObj.authorId = rootBookQuery.data().authorId;
		bookObj.authorIsMember = authorQuery.data().GRMember;
		if (rootBookQuery.data().series !== undefined) {
			const seriesQuery = await database
				.collection('series')
				.doc(rootBookQuery.data().series)
				.get();
			bookObj.series = seriesQuery.data().name;
			bookObj.seriesInstance = rootBookQuery.data().seriesInstance;
		}
		const userDetails = await getUserDetailsForBook(userUID, mainEditionId);
		Object.assign(bookObj, userDetails);
		return bookObj;
	};

	const getAlsoEnjoyedBooksDetailsForBook = async (userUID, bookId) => {
		const alsoEnjoyedObject = {};
		alsoEnjoyedObject.mainBook = await getAlsoEnjoyedBooksDetails(
			userUID,
			bookId,
			true
		);
		const bookQuery = await database.collection('books').doc(bookId).get();
		const rootBookQuery = await database
			.collection('rootBooks')
			.doc(bookQuery.data().rootBook)
			.get();
		if (rootBookQuery.data().alsoEnjoyed === undefined) {
			return alsoEnjoyedObject;
		}
		alsoEnjoyedObject.alsoEnjoyedBooks = [];
		if (rootBookQuery.data().alsoEnjoyed !== undefined) {
			await Promise.all(
				rootBookQuery.data().alsoEnjoyed.map(async (book) => {
					const detailsObject = await getAlsoEnjoyedBooksDetails(
						userUID,
						book,
						false
					);
					alsoEnjoyedObject.alsoEnjoyedBooks.push(detailsObject);
				})
			);
		}
		return alsoEnjoyedObject;
	};

	const getQuizQuestionsForBook = async (rootBook) => {
		const questions = [];
		const quizQuery = await database
			.collection('quizzes')
			.where('books', 'array-contains', rootBook)
			.get();
		quizQuery.docs.forEach((document) => {
			document.data().questions.forEach((question) => {
				const questionObject = {
					quizId: document.id,
					quizTitle: document.data().title,
					quizDescription: document.data().description,
					quizPage: pageGenerator.generateQuizPage(
						document.id,
						document.data().title
					),
				};
				questionObject.question = question.mainQuestion;
				questionObject.options = question.answers;
				questions.push(questionObject);
			});
		});
		return questions;
	};

	const getArticlesForBook = async (rootBook) => {
		const articleQuery = await database
			.collection('articles')
			.where('featuredBooks', 'array-contains', rootBook)
			.get();
		return articleQuery.docs.map((document) => {
			return {
				id: document.id,
				title: document.data().title,
				image: document.data().image,
				content: document.data().content,
				likeCount: document.data().usersWhoLiked.length,
				commentCount: document.data().comments.length,
			};
		});
	};

	const getQuotesPageForBook = async (rootBook) => {
		const mainEditionQuery = await database
			.collection('books')
			.where('rootBook', '==', rootBook)
			.where('mainEdition', '==', true)
			.get();
		return {
			quotesPage: pageGenerator.generateBookQuotesPage(
				mainEditionQuery.docs[0].id,
				mainEditionQuery.docs[0].data().title
			),
		};
	};

	const getQuotesForBook = async (rootBook) => {
		const quoteQuery = await database
			.collection('quotes')
			.where('rootBook', '==', rootBook)
			.limit(2)
			.get();
		return quoteQuery.docs.map((document) => {
			return {
				id: document.id,
				text: document.data().text,
				page: pageGenerator.generateQuotePage(
					document.id,
					document.data().text
				),
				likeCount: document.data().usersWhoLiked.length,
			};
		});
	};

	const queryBookById = async (userUID, bookId) => {
		try {
			const bookQueryDocument = await database
				.collection('books')
				.doc(bookId)
				.get();
			const bookObj = {};
			const data = bookQueryDocument.data();
			bookObj.id = bookQueryDocument.id;
			bookObj.title = data.title;
			bookObj.cover = data.cover;
			bookObj.rootBook = data.rootBook;
			Object.assign(bookObj, getMiscDetailsForBook(data));
			const seriesDetails = await getSeriesDetailsForBook(
				data.rootBook,
				bookObj.title
			);
			Object.assign(bookObj, seriesDetails);
			const mainAuthorDetails = await getMainAuthorDetailsForBook(
				data.rootBook
			);
			Object.assign(bookObj, mainAuthorDetails);
			bookObj.authorFunctions = [];
			await getOtherAuthorsDetailsForBook(
				data.otherAuthors,
				bookObj.authorNames,
				bookObj.authorPages,
				bookObj.authorFunctions
			);
			const userDetails = await getUserDetailsForBook(userUID, bookObj.id);
			Object.assign(bookObj, userDetails);
			const reviewDetails = await getReviewDetailsForBook(
				bookObj.id,
				bookObj.title,
				userUID
			);
			Object.assign(bookObj, reviewDetails);
			const firstEditionInfo = await getFirstEditionInfoForBook(data.rootBook);
			Object.assign(bookObj, firstEditionInfo);
			bookObj.lists = await getListsForBook(bookObj.id);
			bookObj.genres = await getGenresForBook(data.rootBook);
			bookObj.publishedBooksByAuthor = await getPublishedBooksByAuthor(
				data.rootBook
			);
			bookObj.alsoEnjoyedBooks = await getAlsoEnjoyedBooksForBook(
				data.rootBook
			);
			bookObj.articles = await getArticlesForBook(data.rootBook);
			bookObj.quizQuestions = await getQuizQuestionsForBook(data.rootBook);
			bookObj.quotesPage = await getQuotesPageForBook(data.rootBook);
			bookObj.quotes = await getQuotesForBook(data.rootBook);
			return bookObj;
		} catch (error) {
			console.log(error);
		}
	};

	const queryAllBooksForSearchBar = async () => {
		const bookQuery = await database.collection('books').get();
		return await Promise.all(
			bookQuery.docs.map(async (document) => {
				const bookObj = {};
				const data = document.data();
				bookObj.id = document.id;
				bookObj.title = data.title;
				bookObj.cover = data.cover;
				const seriesDetails = await getSeriesDetailsForBook(
					data.rootBook,
					bookObj.title
				);
				Object.assign(bookObj, seriesDetails);
				const mainAuthorDetails = await getMainAuthorDetailsForBook(
					data.rootBook
				);
				Object.assign(bookObj, mainAuthorDetails);
				return bookObj;
			})
		);
	};

	const getEditionDetailsForBook = async (userUID, rootBook) => {
		const booksQuery = await database
			.collection('books')
			.where('rootBook', '==', rootBook)
			.get();
		return await Promise.all(
			booksQuery.docs.map(async (edition) => {
				const editionObject = {
					title: edition.data().title,
					cover: edition.data().cover,
					id: edition.id,
					type: edition.data().type,
					publisher: edition.data().publisher,
					language: edition.data().language,
					pageCount: edition.data().pageCount,
					publishedDate: edition.data().publishedDate.toDate(),
					isMainEdition: edition.data().mainEdition,
				};
				const mainAuthorDetails = await getMainAuthorDetailsForBook(rootBook);
				Object.assign(editionObject, mainAuthorDetails);
				editionObject.authorFunctions = ['Writer'];
				await getOtherAuthorsDetailsForBook(
					edition.data().otherAuthors,
					editionObject.authorNames,
					editionObject.authorPages,
					editionObject.authorFunctions
				);
				const userDetailsForEdition = await getUserDetailsForBook(
					userUID,
					edition.id
				);
				Object.assign(editionObject, userDetailsForEdition);
				return editionObject;
			})
		);
	};

	const queryBooks = async (searchString) => {
		try {
			const allBooksQuery = await queryAllBooksForSearchBar();
			return allBooksQuery.filter(
				(book) =>
					book.title.toLowerCase().includes(searchString.toLowerCase()) ||
					book.authorNames[0].toLowerCase().includes(searchString.toLowerCase())
			);
		} catch (error) {
			console.log(error);
		}
	};

	const queryBooksForBookCreation = async (searchString) => {
		try {
			const allBooksQuery = await database.collection('books').get();
			return await Promise.all(
				allBooksQuery.docs
					.filter((doc) =>
						doc.data().title.toLowerCase().includes(searchString.toLowerCase())
					)
					.map(async (doc) => {
						const rootBookQuery = await database
							.collection('rootBooks')
							.doc(doc.data().rootBook)
							.get();
						if (rootBookQuery.data().series === undefined) {
							return {
								title: doc.data().title,
								link: pageGenerator.generateBookPage(doc.id, doc.data().title),
							};
						} else {
							const seriesQuery = await database
								.collection('series')
								.doc(rootBookQuery.data().series)
								.get();
							return {
								title: `${doc.data().title} (${seriesQuery.data().name} ${
									rootBookQuery.data().seriesInstance
								})`,
								link: pageGenerator.generateBookPage(doc.id, doc.data().title),
							};
						}
					})
			);
		} catch (error) {
			console.log(error);
		}
	};

	const getFriendsInfo = async (userUID, history) => {
		try {
			const friendsQuery = await database
				.collection('users')
				.doc(userUID)
				.get();
			if (friendsQuery.data().friends === undefined) {
				return [];
			}
			return await Promise.all(
				friendsQuery.data().friends.map(async (friend) => {
					const userQuery = await database
						.collection('users')
						.doc(friend)
						.get();
					return {
						id: friend,
						firstName: userQuery.data().firstName,
						profileImage: userQuery.data().profileImage,
					};
				})
			);
		} catch (error) {
			history.push({
				pathname: '/user/sign_in',
				state: { error: error.message },
			});
			return [];
		}
	};

	const queryBookRecommendedToFriendsStatus = async (
		userUID,
		bookId,
		friendIds,
		history
	) => {
		try {
			return await Promise.all(
				friendIds.map(async (id) => {
					const recommendationQuery = await database
						.collection('recommendations')
						.where('sender', '==', userUID)
						.where('bookId', '==', bookId)
						.where('receiver', '==', id)
						.get();
					return recommendationQuery.docs.length > 0;
				})
			);
		} catch (error) {
			history.push({
				pathname: '/user/sign_in',
				state: { error: error.message },
			});
		}
	};

	const queryStatusUpdatesForRootBook = async (bookId) => {
		const bookQuery = await database.collection('books').doc(bookId).get();
		const rootBook = bookQuery.data().rootBook;
		const allbooksQuery = await database
			.collection('books')
			.where('rootBook', '==', rootBook)
			.get();
		const allbooksIds = allbooksQuery.docs.map((document) => document.id);
		const updatesQuery = await database
			.collection('userBooksUpdates')
			.where('book', 'in', allbooksIds)
			.get();
		return updatesQuery.docs.map((document) => document.data());
	};

	const queryStatusUpdatesForBook = async (bookId) => {
		const updatesQuery = await database
			.collection('userBooksUpdates')
			.where('book', '==', bookId)
			.get();
		return updatesQuery.docs.map((document) => document.data());
	};

	const signOut = async (history) => {
		try {
			await firebase.auth().signOut();
			localStorage.userInfo = null;
			history.push({
				pathname: '/' + process.env.REACT_APP_BASE_URL + '/user/sign_out',
			});
		} catch (error) {
			console.log(error);
		}
	};

	const resetPassword = async (email) => {
		try {
			await firebase.auth().sendPasswordResetEmail(email);
		} catch (error) {
			console.log(error);
		}
	};

	const passwordSignIn = async (email, password, rememberMe, history) => {
		try {
			await firebase.auth().signInWithEmailAndPassword(email, password);
			if (rememberMe) {
				localStorage.user = email;
				localStorage.password = password;
			}
			history.push({
				pathname: '/' + process.env.REACT_APP_BASE_URL + '/',
			});
		} catch (error) {
			history.push({
				pathname: '/' + process.env.REACT_APP_BASE_URL + '/user/sign_in',
				state: { error: error.message },
			});
		}
	};

	const facebookSignIn = async () => {
		const provider = new firebase.auth.FacebookAuthProvider();
		try {
			const result = await firebase.auth().signInWithPopup(provider);

			const user = result.user;
			const userUID = user.uid;
			const firstName = user.displayName.split(' ')[0];
			const email = user.email;
			const profileImage = user.photoURL;

			if (!(await database.collection('users').doc(userUID).get()).exists) {
				await database
					.collection('users')
					.doc(userUID)
					.set({
						firstName,
						email,
						profileImage,
						membershipDate: firebase.firestore.Timestamp.fromDate(new Date()),
						favoriteAuthors: [],
						friends: [],
						newFriendsRequests: [],
						aboutMe: '',
						addAFriend: true,
						addANewStatusToBook: true,
						addAQuote: true,
						addBookToShelves: true,
						ageAndBirthdayPrivacy: 'age-members-birthday-friends',
						city: '',
						country: '',
						customGender: '',
						dateOfBirth: null,
						emailAddressVisibleTo: 'no-one',
						favoriteGenres: [],
						followAnAuthor: true,
						followers: [],
						friendChallengeAnswer: '',
						friendChallengeQuestion: '',
						gender: '',
						interests: '',
						locationViewableBy: 'everyone',
						middleName: '',
						notifications: [],
						pronouns: ['male', 'female'][Math.round(Math.random() * 1)],
						recommendABook: true,
						showGenderTo: 'everyone',
						showLastNameTo: 'anyone',
						stateProvinceCode: '',
						typeOfBooks: '',
						updateContent: 'book-only',
						updatesPeople: 'friends-following',
						voteForABookReview: true,
						website: '',
						whoCanViewMyProfile: 'anyone',
						zipCode: '',
					});
			}
		} catch (error) {
			console.log(error.code);
		}
	};

	const twitterSignIn = async () => {
		const provider = new firebase.auth.TwitterAuthProvider();
		try {
			const result = await firebase.auth().signInWithPopup(provider);

			const user = result.user;
			const userUID = user.uid;
			const firstName = user.displayName.split(' ')[0];
			const email = user.email;
			const profileImage = user.photoURL;

			if (!(await database.collection('users').doc(userUID).get()).exists) {
				await database
					.collection('users')
					.doc(userUID)
					.set({
						firstName,
						email,
						profileImage,
						membershipDate: firebase.firestore.Timestamp.fromDate(new Date()),
						favoriteAuthors: [],
						friends: [],
						newFriendsRequests: [],
						aboutMe: '',
						addAFriend: true,
						addANewStatusToBook: true,
						addAQuote: true,
						addBookToShelves: true,
						ageAndBirthdayPrivacy: 'age-members-birthday-friends',
						city: '',
						country: '',
						customGender: '',
						dateOfBirth: null,
						emailAddressVisibleTo: 'no-one',
						favoriteGenres: [],
						followAnAuthor: true,
						followers: [],
						friendChallengeAnswer: '',
						friendChallengeQuestion: '',
						gender: '',
						interests: '',
						locationViewableBy: 'everyone',
						middleName: '',
						notifications: [],
						pronouns: ['male', 'female'][Math.round(Math.random() * 1)],
						recommendABook: true,
						showGenderTo: 'everyone',
						showLastNameTo: 'anyone',
						stateProvinceCode: '',
						typeOfBooks: '',
						updateContent: 'book-only',
						updatesPeople: 'friends-following',
						voteForABookReview: true,
						website: '',
						whoCanViewMyProfile: 'anyone',
						zipCode: '',
					});
			}
		} catch (error) {
			console.log(error);
			console.log(error.code);
		}
	};

	const googleSignIn = async () => {
		const provider = new firebase.auth.GoogleAuthProvider();
		try {
			const result = await firebase.auth().signInWithPopup(provider);

			const user = result.user;
			const userUID = user.uid;
			const firstName = user.displayName.split(' ')[0];
			const email = user.email;
			const profileImage = user.photoURL;

			if (!(await database.collection('users').doc(userUID).get()).exists) {
				await database
					.collection('users')
					.doc(userUID)
					.set({
						firstName,
						email,
						profileImage,
						membershipDate: firebase.firestore.Timestamp.fromDate(new Date()),
						favoriteAuthors: [],
						friends: [],
						newFriendsRequests: [],
						aboutMe: '',
						addAFriend: true,
						addANewStatusToBook: true,
						addAQuote: true,
						addBookToShelves: true,
						ageAndBirthdayPrivacy: 'age-members-birthday-friends',
						city: '',
						country: '',
						customGender: '',
						dateOfBirth: null,
						emailAddressVisibleTo: 'no-one',
						favoriteGenres: [],
						followAnAuthor: true,
						followers: [],
						friendChallengeAnswer: '',
						friendChallengeQuestion: '',
						gender: '',
						interests: '',
						locationViewableBy: 'everyone',
						middleName: '',
						notifications: [],
						pronouns: ['male', 'female'][Math.round(Math.random() * 1)],
						recommendABook: true,
						showGenderTo: 'everyone',
						showLastNameTo: 'anyone',
						stateProvinceCode: '',
						typeOfBooks: '',
						updateContent: 'book-only',
						updatesPeople: 'friends-following',
						voteForABookReview: true,
						website: '',
						whoCanViewMyProfile: 'anyone',
						zipCode: '',
					});
			}
		} catch (error) {
			console.log(error.code);
		}
	};

	const queryBookInstanceDetails = async (bookInstanceData) => {
		let wantToReadBooks = [];
		let readingBooks = [];
		for (let i = 0; i < bookInstanceData.length; i++) {
			const bookObj = {};
			const bookQuery = await database
				.collection('books')
				.doc(bookInstanceData[i].bookId)
				.get();
			const bookQueryData = bookQuery.data();
			bookObj.title = bookQueryData.title;
			bookObj.cover = bookQueryData.cover;
			bookObj.page = pageGenerator.generateBookPage(
				bookInstanceData[i].bookId,
				bookQueryData.title
			);
			if (bookInstanceData[i].status === 'to-read') {
				wantToReadBooks.push(bookObj);
			} else {
				const rootBookQuery = await database
					.collection('rootBooks')
					.doc(bookQueryData.rootBook)
					.get();
				const authorQuery = await database
					.collection('authors')
					.doc(rootBookQuery.data().authorId)
					.get();
				const authorQueryData = authorQuery.data();
				bookObj.author = authorQueryData.name;
				bookObj.authorPage = pageGenerator.generateAuthorPage(
					rootBookQuery.data().authorId,
					authorQueryData.name
				);
				bookObj.authorHasBadge = authorQueryData.GRMember;
				readingBooks.push(bookObj);
			}
		}
		return [wantToReadBooks, readingBooks];
	};

	const signUp = async (email, password, name, history) => {
		try {
			if (name.length === 0) {
				throw new Error('name');
			}
			if (email.length === 0) {
				throw new Error('email-missing');
			}

			console.log(
				`Creating user with email ${email} and password ${password}...`
			);
			const result = await firebase
				.auth()
				.createUserWithEmailAndPassword(email, password);
			const userUID = result.user.uid;

			if (!(await database.collection('users').doc(userUID).get()).exists) {
				await database
					.collection('users')
					.doc(userUID)
					.set({
						firstName: name.split(' ')[0],
						lastName:
							name.split(' ').length > 1
								? name.split(' ').slice(1).join(' ')
								: '',
						email,
						membershipDate: firebase.firestore.Timestamp.fromDate(new Date()),
						favoriteAuthors: [],
						friends: [],
						newFriendsRequests: [],
						aboutMe: '',
						addAFriend: true,
						addANewStatusToBook: true,
						addAQuote: true,
						addBookToShelves: true,
						ageAndBirthdayPrivacy: 'age-members-birthday-friends',
						city: '',
						country: '',
						customGender: '',
						dateOfBirth: null,
						emailAddressVisibleTo: 'no-one',
						favoriteGenres: [],
						followAnAuthor: true,
						followers: [],
						friendChallengeAnswer: '',
						friendChallengeQuestion: '',
						gender: '',
						interests: '',
						locationViewableBy: 'everyone',
						middleName: '',
						notifications: [],
						pronouns: ['male', 'female'][Math.round(Math.random() * 1)],
						recommendABook: true,
						showGenderTo: 'everyone',
						showLastNameTo: 'anyone',
						stateProvinceCode: '',
						typeOfBooks: '',
						updateContent: 'book-only',
						updatesPeople: 'friends-following',
						voteForABookReview: true,
						website: '',
						whoCanViewMyProfile: 'anyone',
						zipCode: '',
					});
			}

			history.push({
				pathname: '/' + process.env.REACT_APP_BASE_URL + '/',
			});
		} catch (error) {
			history.push({
				pathname: '/' + process.env.REACT_APP_BASE_URL + '/user/sign_up',
				state: { error: error.message },
			});
			return error;
		}
	};

	const queryUserInfo = async (userUID) => {
		if (userUID === null) {
			return {};
		}
		let newUserInfo = {};
		try {
			const userQuery = await database.collection('users').doc(userUID).get();
			const userQueryData = userQuery.data();
			newUserInfo = { ...userQueryData };
			const bookInstancesQuery = await database
				.collection('userBooksInstances')
				.where('userId', '==', userUID)
				.get();
			const bookInstancesQueryData = bookInstancesQuery.docs.map((document) =>
				document.data()
			);
			newUserInfo.numberOfReadBooks = bookInstancesQueryData.filter(
				(instance) => instance.status === 'read'
			).length;
			const userBooks = await queryBookInstanceDetails(
				bookInstancesQueryData.filter((instance) => instance.status !== 'read')
			);
			newUserInfo.wantToReadBooks = userBooks[0];
			newUserInfo.readingBooks = userBooks[1];
			return newUserInfo;
		} catch (error) {
			console.log(error);
		}
	};

	const modifyUserInfo = async (userUID) => {
		const newUserInfo = await queryUserInfo(userUID);
		return newUserInfo;
	};

	const addBookToShelf = async (userUID, bookId, status, history) => {
		if (userUID === undefined || userUID === null) {
			history.push({
				pathname: '/' + process.env.REACT_APP_BASE_URL + '/user/sign_in',
				state: { error: 'User not logged in' },
			});
		} else {
			const userInstanceQuery = await database
				.collection('userBooksInstances')
				.where('userId', '==', userUID)
				.where('bookId', '==', bookId)
				.get();
			if (userInstanceQuery.docs.length > 0) {
				if (userInstanceQuery.docs[0].data().status === 'to-read') {
					await changeBookPosition(userUID, bookId, 10000);
				}
				if (status === 'to-read') {
					const lowestPositionQuery = await database
						.collection('userBooksInstances')
						.where('userId', '==', userUID)
						.orderBy('position', 'desc')
						.limit(1)
						.get();
					if (lowestPositionQuery.docs.length > 0) {
						await database
							.collection('userBooksInstances')
							.doc(userInstanceQuery.docs[0].id)
							.set(
								{
									status,
									position: lowestPositionQuery.docs[0].data().position + 1,
								},
								{ merge: true }
							);
					} else {
						await database
							.collection('userBooksInstances')
							.doc(userInstanceQuery.docs[0].id)
							.set({ status, position: 1 }, { merge: true });
					}
				} else {
					await database
						.collection('userBooksInstances')
						.doc(userInstanceQuery.docs[0].id)
						.set({ status }, { merge: true });
				}
			} else {
				if (status === 'to-read') {
					await database
						.collection('userBooksInstances')
						.add({ bookId, userId: userUID, status, position: 1 });
				} else {
					await database
						.collection('userBooksInstances')
						.add({ bookId, userId: userUID, status });
				}
			}
			await database.collection('userBooksUpdates').add({
				user: userUID,
				book: bookId,
				shelf: status,
				action: 'add-book',
				date: firebase.firestore.Timestamp.fromDate(new Date()),
			});
		}
	};

	const removeBookFromShelf = async (userUID, bookId) => {
		const userInstanceQuery = await database
			.collection('userBooksInstances')
			.where('userId', '==', userUID)
			.where('bookId', '==', bookId)
			.get();
		if (userInstanceQuery.docs.length > 0) {
			if (userInstanceQuery.docs[0].data().status === 'to-read') {
				await changeBookPosition(userUID, bookId, 10000);
			}
			await database
				.collection('userBooksInstances')
				.doc(userInstanceQuery.docs[0].id)
				.delete();
		}
		const reviewQuery = await database
			.collection('reviews')
			.where('user', '==', userUID)
			.where('bookEdition', '==', bookId)
			.get();
		if (reviewQuery.docs.length > 0) {
			await database.collection('reviews').doc(reviewQuery.docs[0].id).delete();
		}
	};

	const rateBook = async (userUID, bookId, rating, history) => {
		if (userUID === undefined || userUID === null) {
			history.push({
				pathname: '/' + process.env.REACT_APP_BASE_URL + '/user/sign_in',
				state: { error: 'User not logged in' },
			});
		} else {
			const userInstanceQuery = await database
				.collection('userBooksInstances')
				.where('userId', '==', userUID)
				.where('bookId', '==', bookId)
				.get();
			if (userInstanceQuery.docs.length > 0) {
				if (rating !== undefined) {
					await database
						.collection('userBooksInstances')
						.doc(userInstanceQuery.docs[0].id)
						.set({ rating }, { merge: true });
				} else {
					await database
						.collection('userBooksInstances')
						.doc(userInstanceQuery.docs[0].id)
						.update({ rating: firebase.firestore.FieldValue.delete() });
				}
			} else {
				await database
					.collection('userBooksInstances')
					.add({ bookId, userId: userUID, status: 'read', rating });
			}
			if (rating !== undefined) {
				await database.collection('userBooksUpdates').add({
					user: userUID,
					book: bookId,
					action: 'rate-book',
					date: firebase.firestore.Timestamp.fromDate(new Date()),
				});
			}
		}
	};

	const updateBookInShelf = async (userUID, bookId, progress) => {
		const userInstanceQuery = await database
			.collection('userBooksInstances')
			.where('userId', '==', userUID)
			.where('bookId', '==', bookId)
			.get();
		if (userInstanceQuery.docs.length > 0) {
			await database
				.collection('userBooksInstances')
				.doc(userInstanceQuery.docs[0].id)
				.set({ progress }, { merge: true });
		}
		await database.collection('userBooksUpdates').add({
			user: userUID,
			book: bookId,
			action: 'progress-book',
			progress,
			date: firebase.firestore.Timestamp.fromDate(new Date()),
		});
	};

	const changeBookPosition = async (userUID, bookId, newPosition) => {
		const userInstanceQuery = await database
			.collection('userBooksInstances')
			.where('userId', '==', userUID)
			.where('bookId', '==', bookId)
			.get();
		if (
			userInstanceQuery.docs.length > 0 &&
			userInstanceQuery.docs[0].data().status === 'to-read'
		) {
			const oldPosition = userInstanceQuery.docs[0].data().position;
			if (newPosition < oldPosition) {
				const higherPositionQuery = await database
					.collection('userBooksInstances')
					.where('userId', '==', userUID)
					.where('position', '>=', newPosition)
					.where('position', '<', oldPosition)
					.get();
				await Promise.all(
					higherPositionQuery.docs.map(async (document) => {
						await database
							.collection('userBooksInstances')
							.doc(document.id)
							.set({ position: document.data().position + 1 }, { merge: true });
					})
				);
			}
			if (newPosition > oldPosition) {
				const lowerPositionQuery = await database
					.collection('userBooksInstances')
					.where('userId', '==', userUID)
					.where('position', '<=', newPosition)
					.where('position', '>', oldPosition)
					.get();
				await Promise.all(
					lowerPositionQuery.docs.map(async (document) => {
						await database
							.collection('userBooksInstances')
							.doc(document.id)
							.set({ position: document.data().position - 1 }, { merge: true });
					})
				);
			}
			await database
				.collection('userBooksInstances')
				.doc(userInstanceQuery.docs[0].id)
				.set({ position: newPosition }, { merge: true });
		}
	};

	const addNewUserShelf = async (userUID, shelf, history) => {
		if (userUID === undefined || userUID === null) {
			history.push({
				pathname: '/' + process.env.REACT_APP_BASE_URL + '/user/sign_in',
				state: { error: 'User not logged in' },
			});
		} else {
			const genreQuery = await database.collection('genres').doc(shelf).get();
			const shelfQuery = !genreQuery.exists
				? await database
						.collection('shelves')
						.where('name', '==', shelf)
						.where('user', '==', userUID)
						.get()
				: await database
						.collection('shelves')
						.where('genre', '==', shelf)
						.where('user', '==', userUID)
						.get();
			if (shelfQuery.docs.length === 0) {
				if (!genreQuery.exists) {
					await database
						.collection('shelves')
						.add({ name: shelf, user: userUID, rootBooks: [], genre: null });
				} else {
					await database
						.collection('shelves')
						.add({ genre: shelf, user: userUID, rootBooks: [] });
				}
			}
		}
	};

	const addBookToUserShelf = async (
		userUID,
		rootBook,
		shelf,
		genre = null,
		history
	) => {
		if (userUID === undefined || userUID === null) {
			history.push({
				pathname: '/' + process.env.REACT_APP_BASE_URL + '/user/sign_in',
				state: { error: 'User not logged in' },
			});
		} else {
			const editionIds = (
				await database
					.collection('books')
					.where('rootBook', '==', rootBook)
					.get()
			).docs.map((doc) => doc.id);
			const mainEditionId = (
				await database
					.collection('books')
					.where('rootBook', '==', rootBook)
					.where('mainEdition', '==', true)
					.get()
			).docs[0].id;
			const statusQuery = await database
				.collection('userBooksInstances')
				.where('userId', '==', userUID)
				.where('bookId', 'in', editionIds)
				.get();
			if (statusQuery.docs.length === 0) {
				await addBookToShelf(userUID, mainEditionId, 'read', history);
			}
			const shelfQuery = await database
				.collection('shelves')
				.where('user', '==', userUID)
				.where('name', '==', shelf)
				.get();
			if (shelfQuery.docs.length === 0) {
				await database
					.collection('shelves')
					.add({ user: userUID, rootBooks: [rootBook], genre, name: shelf });
			} else {
				if (!shelfQuery.docs[0].data().rootBooks.includes(rootBook)) {
					await database
						.collection('shelves')
						.doc(shelfQuery.docs[0].id)
						.set(
							{
								rootBooks: shelfQuery.docs[0]
									.data()
									.rootBooks.concat([rootBook]),
							},
							{ merge: true }
						);
				}
			}
		}
	};

	const removeBookFromUserShelf = async (userUID, rootBook, shelf, history) => {
		if (userUID === undefined || userUID === null) {
			history.push({
				pathname: '/' + process.env.REACT_APP_BASE_URL + '/user/sign_in',
				state: { error: 'User not logged in' },
			});
		} else {
			const shelfQuery = await database
				.collection('shelves')
				.where('user', '==', userUID)
				.get();
			const correspondingShelves = shelfQuery.docs.filter(
				(doc) => doc.data().name === shelf || doc.data().genre === shelf
			);
			if (
				correspondingShelves.length > 0 &&
				correspondingShelves[0].data().rootBooks.includes(rootBook)
			) {
				const shelfDoc = database
					.collection('shelves')
					.doc(correspondingShelves[0].id);
				await shelfDoc.update({
					rootBooks: correspondingShelves[0]
						.data()
						.rootBooks.filter((rB) => rB !== rootBook),
				});
			}
		}
	};

	const likeUnlikeReview = async (userUID, reviewId, history) => {
		if (userUID === undefined || userUID === null) {
			history.push({
				pathname: '/' + process.env.REACT_APP_BASE_URL + '/user/sign_in',
				state: { error: 'User not logged in' },
			});
		} else {
			const reviewRef = database.collection('reviews').doc(reviewId);
			const reviewQuery = await reviewRef.get();
			if (!reviewQuery.data().usersWhoLiked.includes(userUID)) {
				await reviewRef.set(
					{ usersWhoLiked: reviewQuery.data().usersWhoLiked.concat([userUID]) },
					{ merge: true }
				);
			} else {
				await reviewRef.set(
					{
						usersWhoLiked: reviewQuery
							.data()
							.usersWhoLiked.filter((userId) => userId !== userUID),
					},
					{ merge: true }
				);
			}
		}
	};

	const followUnfollowAuthor = async (userUID, authorId, history) => {
		if (userUID === undefined || userUID === null) {
			history.push({
				pathname: '/' + process.env.REACT_APP_BASE_URL + '/user/sign_in',
				state: { error: 'User not logged in' },
			});
		} else {
			const authorRef = database.collection('authors').doc(authorId);
			const authorQuery = await authorRef.get();
			if (!authorQuery.data().followerIds.includes(userUID)) {
				await authorRef.set(
					{ followerIds: authorQuery.data().followerIds.concat([userUID]) },
					{ merge: true }
				);
			} else {
				await authorRef.set(
					{
						followerIds: authorQuery
							.data()
							.followerIds.filter((userId) => userId !== userUID),
					},
					{ merge: true }
				);
			}
		}
	};

	const recommendBook = async (sender, receiver, bookId, message) => {
		const newRec = await database.collection('recommendations').add({
			sender,
			receiver,
			bookId,
		});
		if (message.length > 0) {
			newRec.set({ message }, { merge: true });
		}
	};

	const switchBookEditionForUser = async (userUID, oldEdition, newEdition) => {
		const reviewQuery = await database
			.collection('reviews')
			.where('bookEdition', '==', oldEdition)
			.where('user', '==', userUID)
			.get();
		if (reviewQuery.docs.length > 0) {
			await database
				.collection('reviews')
				.doc(reviewQuery.docs[0].id)
				.set({ bookEdition: newEdition }, { merge: true });
		}
		const userInstanceQuery = await database
			.collection('userBooksInstances')
			.where('bookId', '==', oldEdition)
			.where('userId', '==', userUID)
			.get();
		if (userInstanceQuery.docs.length > 0) {
			await database
				.collection('userBooksInstances')
				.doc(userInstanceQuery.docs[0].id)
				.set({ bookId: newEdition }, { merge: true });
		}
	};

	const getBookPhotos = async (bookId) => {
		const bookQuery = await database.collection('books').doc(bookId).get();
		const rootBook = bookQuery.data().rootBook;
		const photoQuery = await database
			.collection('bookPhotos')
			.where('rootBook', '==', rootBook)
			.get();
		return {
			cover: bookQuery.data().cover,
			photos: photoQuery.docs.map((document) => {
				return {
					id: document.id,
					url: document.data().url,
					type: document.data().type,
				};
			}),
		};
	};

	const getPhotoDetails = async (userUID, photoId) => {
		const photoQuery = await database
			.collection('bookPhotos')
			.doc(photoId)
			.get();
		if (
			userUID !== null &&
			!photoQuery.data().usersWhoViewed.includes(userUID)
		) {
			await database
				.collection('bookPhotos')
				.doc(photoId)
				.set(
					{ usersWhoViewed: photoQuery.data().usersWhoViewed.concat(userUID) },
					{ merge: true }
				);
		}
		return photoQuery.data();
	};

	const getSynopsisAndPreSynopsisForBook = async (bookId) => {
		try {
			const bookQuery = await database.collection('books').doc(bookId).get();
			return {
				preSynopsis:
					bookQuery.data().preSynopsis !== undefined
						? bookQuery.data().preSynopsis
						: null,
				synopsis:
					bookQuery.data().synopsis !== undefined
						? bookQuery.data().synopsis
						: null,
			};
		} catch (error) {
			return {
				preSynopsis: null,
				synopsis: null,
			};
		}
	};

	const createNewBook = async ({
		title,
		authorNames,
		authorRoles,
		isbn,
		publisher,
		publishedYear,
		publishedMonth,
		publishedDay,
		numberOfPages,
		format,
		amazonLink,
		description,
		editionLanguage,
		originalTitle,
		originalPublicationYear,
		originalPublicationMonth,
		originalPublicationDay,
		coverImage,
		history,
	}) => {
		try {
			const newBookObject = {};
			const seriesMatches = title.match(/[(][\w\d\s]+,[ ]*#\d[)]/g);
			const seriesName =
				seriesMatches !== null
					? seriesMatches[0].split(',')[0].splice(1).join('')
					: '';
			const seriesInstance =
				seriesMatches !== null
					? parseInt(seriesMatches[0].split('#')[1].split(')')[0])
					: NaN;
			if (seriesMatches === null) {
				newBookObject.title = title;
			} else {
				newBookObject.title = title.split('(')[0];
			}
			if (editionLanguage.length > 0) {
				newBookObject.language = editionLanguage;
			}
			if (isbn.length > 0) {
				newBookObject.ISBN = isbn;
			}
			if (format.length > 0) {
				newBookObject.type = format;
			}
			if (amazonLink.length > 0 && amazonLink.includes('amazon.co')) {
				newBookObject.amazonLink = amazonLink;
			}
			if (numberOfPages.length > 0) {
				newBookObject.pageCount = numberOfPages;
			}
			if (publishedYear.length > 0) {
				const publishedDate = new Date(
					parseInt(publishedYear),
					publishedMonth.length > 0 ? parseInt(publishedMonth) : 0,
					publishedDay.length > 0 ? parseInt(publishedDay) : 1
				);
				newBookObject.publishedDate = firebase.firestore.Timestamp.fromDate(
					publishedDate
				);
			}
			if (publisher.length > 0) {
				newBookObject.publisher = publisher;
			}
			if (coverImage !== '') {
				newBookObject.cover = coverImage;
			}
			if (description.length > 0) {
				if (description.split('\n')[1] !== undefined) {
					newBookObject.preSynopsis = description.split('\n')[0];
					newBookObject.synopsis = description.split('\n').slice(1).join('');
				} else {
					newBookObject.synopsis = description;
				}
			}
			if (authorNames.length > 1) {
				newBookObject.otherAuthors = await Promise.all(
					authorNames.slice(1).map(async (name, index) => {
						const properName = name
							.split(' ')
							.map((n) =>
								n.length > 1
									? n[0].toUpperCase() + n.slice(1).toLowerCase()
									: n[0].toUpperCase()
							)
							.join(' ');
						const authorQuery = await database
							.collection('authors')
							.where('name', '==', properName)
							.get();
						if (authorQuery.docs.length > 0) {
							return {
								id: authorQuery.docs[0].id,
								role: authorRoles[index],
							};
						} else {
							const newAuthorRef = await database
								.collection('authors')
								.add({ name: properName, GRMember: false });
							return {
								id: newAuthorRef.id,
								role: authorRoles[index],
							};
						}
					})
				);
			}
			const properAuthorName = authorNames[0]
				.split(' ')
				.map((n) =>
					n.length > 1
						? n[0].toUpperCase() + n.slice(1).toLowerCase()
						: n[0].toUpperCase()
				)
				.join(' ');
			const mainAuthorQuery = await database
				.collection('authors')
				.where('name', '==', properAuthorName)
				.get();
			let mainAuthorId = '';
			if (mainAuthorQuery.docs.length === 0) {
				const newMainAuthorRef = await database
					.collection('authors')
					.add({ name: properAuthorName, GRMember: false });
				mainAuthorId = newMainAuthorRef.id;
				const newRootBookRef = await database
					.collection('rootBooks')
					.add({ authorId: mainAuthorId });
				newBookObject.rootBook = newRootBookRef.id;
				newBookObject.mainEdition = true;
				if (seriesName.length > 0 && !Number.isNaN(seriesInstance)) {
					const properSeriesName = seriesName
						.split(' ')
						.map((n) =>
							n.length > 1
								? n[0].toUpperCase() + n.slice(1).toLowerCase()
								: n[0].toUpperCase()
						)
						.join(' ');
					const newSeriesRef = await database
						.collection('series')
						.add({ name: properSeriesName });
					newRootBookRef.set(
						{ series: newSeriesRef.id, seriesInstance },
						{ merge: true }
					);
				}
			} else {
				mainAuthorId = mainAuthorQuery.docs[0].id;
				if (originalTitle.length > 0) {
					const originalPublicationDate =
						originalPublicationYear.length > 0
							? new Date(
									parseInt(originalPublicationYear),
									originalPublicationMonth.length > 0
										? parseInt(originalPublicationMonth)
										: 0,
									originalPublicationDay.length > 0
										? parseInt(originalPublicationDay)
										: 1
							  )
							: null;
					const originalBookQuery = await database
						.collection('books')
						.where('title', '==', originalTitle)
						.where('mainEdition', '==', true)
						.get();
					const originalBookCandidates = (
						await Promise.all(
							originalBookQuery.docs.map(async (book) => {
								const rootBookQuery = await database
									.collection('rootBooks')
									.doc(book.data().rootBook)
									.get();
								const authorQuery = await database
									.collection('authors')
									.doc(rootBookQuery.data().authorId)
									.get();
								const seriesQuery =
									rootBookQuery.data().series !== undefined
										? await database
												.collection('series')
												.doc(rootBookQuery.data().series)
												.get()
										: null;
								if (originalPublicationDate !== null) {
									const timestamp = firebase.firestore.Timestamp.fromDate(
										originalPublicationDate
									);
									if (
										mainAuthorQuery.docs[0].data().name ===
											authorQuery.data().name &&
										book.data().publishedDate === timestamp &&
										((seriesQuery === null && seriesName.length === 0) ||
											(seriesName.toLowerCase() ===
												seriesQuery.data().name.toLowerCase() &&
												seriesInstance === rootBookQuery.data().seriesInstance))
									) {
										return book;
									}
								} else {
									if (
										mainAuthorQuery.docs[0].data().name ===
											authorQuery.data().name &&
										((seriesQuery === null && seriesName.length === 0) ||
											(seriesName.toLowerCase() ===
												seriesQuery.data().name.toLowerCase() &&
												seriesInstance === rootBookQuery.data().seriesInstance))
									) {
										return book;
									}
								}
								return null;
							})
						)
					).filter((book) => book !== null);
					if (originalBookCandidates.length !== 0) {
						newBookObject.rootBook = originalBookCandidates[0].data().rootBook;
						newBookObject.mainEdition = false;
					} else {
						const newRootBookRef = await database
							.collection('rootBooks')
							.add({ authorId: mainAuthorId });
						newBookObject.rootBook = newRootBookRef.id;
						newBookObject.mainEdition = true;
					}
				} else {
					const originalBookQuery = await database
						.collection('books')
						.where('title', '==', title)
						.where('mainEdition', '==', true)
						.get();
					const originalBookCandidates = await Promise.all(
						originalBookQuery.docs.filter(async (book) => {
							const rootBookQuery = await database
								.collection('rootBooks')
								.doc(book.data().rootBook)
								.get();
							const authorQuery = await database
								.collection('authors')
								.doc(rootBookQuery.data().authorId)
								.get();
							const seriesQuery =
								rootBookQuery.data().series !== undefined
									? await database
											.collection('series')
											.doc(rootBookQuery.data().series)
											.get()
									: null;
							if (
								mainAuthorQuery.docs[0].data().name ===
									authorQuery.data().name &&
								((seriesQuery === null && seriesName.length === 0) ||
									(seriesName.toLowerCase() ===
										seriesQuery.data().name.toLowerCase() &&
										seriesInstance === rootBookQuery.data().seriesInstance))
							) {
								return book;
							}
							return null;
						})
					).filter((book) => book !== null);
					if (originalBookCandidates.length !== 0) {
						newBookObject.rootBook = originalBookCandidates[0].data().rootBook;
						newBookObject.mainEdition = false;
					} else {
						const newRootBookRef = await database
							.collection('rootBooks')
							.add({ authorId: mainAuthorId });
						newBookObject.rootBook = newRootBookRef.id;
						newBookObject.mainEdition = true;
						if (seriesName.length > 0 && !Number.isNaN(seriesInstance)) {
							const properSeriesName = seriesName
								.split(' ')
								.map((n) =>
									n.length > 1
										? n[0].toUpperCase() + n.slice(1).toLowerCase()
										: n[0].toUpperCase()
								)
								.join(' ');
							const newSeriesRef = await database
								.collection('series')
								.add({ name: properSeriesName });
							newRootBookRef.set(
								{ series: newSeriesRef.id, seriesInstance },
								{ merge: true }
							);
						}
					}
				}
			}
			const newBookRef = await database.collection('books').add(newBookObject);
			// 'Book was created. Please note that it will take up to 10 minutes for this book to be searchable by title/author.'
			history.push({
				pathname:
					'/' +
					process.env.REACT_APP_BASE_URL +
					`/review/new/${newBookRef.id}?newBook=yes`,
				state: { addedNewBook: true },
			});
		} catch (error) {
			console.log(error);
		}
	};

	const getBookInfoForTopShelvesPage = async (bookId) => {
		try {
			const bookQuery = await database.collection('books').doc(bookId).get();
			const genres = await getGenresForBook(bookQuery.data().rootBook);
			return {
				title: bookQuery.data().title,
				genres: genres.map((genre) => {
					return {
						name: genre.genre,
						userCount: genre.userCount,
					};
				}),
			};
		} catch (error) {
			console.log(error);
		}
	};

	const getBookInfoForGenreShelfPage = async (bookId, shelf) => {
		const bookQuery = await database.collection('books').doc(bookId).get();
		const rootBookQuery = await database
			.collection('rootBooks')
			.doc(bookQuery.data().rootBook)
			.get();
		const series =
			rootBookQuery.data().series === undefined
				? undefined
				: (
						await database
							.collection('series')
							.doc(rootBookQuery.data().series)
							.get()
				  ).data().name;
		const seriesInstance = rootBookQuery.data().seriesInstance;
		const shelfQuery = await database
			.collection('shelves')
			.where('name', '==', shelf)
			.where('rootBooks', 'array-contains', bookQuery.data().rootBook)
			.get();
		const users = await Promise.all(
			shelfQuery.docs.map(async (shelf) => {
				const id = shelf.data().user;
				const userQuery = await database.collection('users').doc(id).get();
				const firstName = userQuery.data().firstName;
				const picture = userQuery.data().profileImage;
				const numberOfFriends = userQuery.data().friends.length;
				const userBooksInstancesQuery = await database
					.collection('userBooksInstances')
					.where('userId', '==', id)
					.get();
				const numberOfBooks = userBooksInstancesQuery.docs.length;
				const numberOfBooksOnShelf = shelf.data().rootBooks.length;
				return {
					id,
					firstName,
					picture,
					numberOfBooks,
					numberOfFriends,
					numberOfBooksOnShelf,
				};
			})
		);
		const allOccurrencesOfRootBooksOnShelf = shelfQuery.docs
			.map((doc) => doc.data().rootBooks)
			.reduce((previous, current) => previous.concat(current), []);
		const numberOfOccurrencesOfRootBooks = allOccurrencesOfRootBooksOnShelf.reduce(
			(previous, current) => {
				if (previous[current] === undefined) {
					previous[current] = 1;
				} else {
					previous[current] = previous[current] + 1;
				}
				return previous;
			},
			{}
		);
		const rootBooksSortedByPopularity = Object.keys(
			numberOfOccurrencesOfRootBooks
		).sort(
			(a, b) =>
				numberOfOccurrencesOfRootBooks[b] - numberOfOccurrencesOfRootBooks[a]
		);
		rootBooksSortedByPopularity.length = Math.min(
			rootBooksSortedByPopularity.length,
			5
		);
		const popularBooksOnShelf = await Promise.all(
			rootBooksSortedByPopularity.map(async (rootBook) => {
				const bookQueryForRootBook = await database
					.collection('books')
					.where('rootBook', '==', rootBook)
					.where('mainEdition', '==', true)
					.get();
				return {
					id: bookQueryForRootBook.docs[0].id,
					title: bookQueryForRootBook.docs[0].data().title,
					cover: bookQueryForRootBook.docs[0].data().cover,
				};
			})
		);
		return {
			series,
			seriesInstance,
			users,
			popularBooksOnShelf,
		};
	};

	const getBookInfoForTriviaPage = async (bookId) => {
		const bookQuery = await database.collection('books').doc(bookId).get();
		const rootBookQuery = await database
			.collection('rootBooks')
			.doc(bookQuery.data().rootBook)
			.get();
		const series =
			rootBookQuery.data().series === undefined
				? undefined
				: (
						await database
							.collection('series')
							.doc(rootBookQuery.data().series)
							.get()
				  ).data().name;
		const seriesInstance = rootBookQuery.data().seriesInstance;
		const quizQuery = await database
			.collection('quizzes')
			.where('books', 'array-contains', bookQuery.data().rootBook)
			.get();
		const quizQuestions = await Promise.all(
			quizQuery.docs.map(async (quiz) => {
				const quizId = quiz.id;
				const quizName = quiz.data().title;
				const creatorId = quiz.data().creator;
				const quizCreatorQuery = await database
					.collection('users')
					.doc(creatorId)
					.get();
				const creatorFirstName = quizCreatorQuery.data().firstName;
				const question = quiz.data().questions[0].mainQuestion;
				const questionRootBook = quiz.data().questions[0].rootBook;
				const book =
					questionRootBook === undefined
						? undefined
						: (
								await database
									.collection('books')
									.where('rootBook', '==', questionRootBook)
									.where('mainEdition', '==', true)
									.get()
						  ).data().title;
				const numberOfUsersWhoTookQuiz = quiz.data().usersWhoTook.length;
				const numberOfQuestions = quiz.data().questions.length;
				const rating = quiz.data().rating;

				return {
					quizId,
					quizName,
					creatorId,
					creatorFirstName,
					question,
					book,
					numberOfUsersWhoTookQuiz,
					numberOfQuestions,
					rating,
				};
			})
		);
		return {
			series,
			seriesInstance,
			quizQuestions,
		};
	};

	const likeQuote = async (userUID, quoteId, history) => {
		if (userUID === null || userUID === undefined) {
			history.push({
				pathname: '/' + process.env.REACT_APP_BASE_URL + '/user/sign_in',
				state: { error: 'User not logged in' },
			});
		} else {
			const quoteQuery = await database.collection('quotes').doc(quoteId).get();
			if (!quoteQuery.data().usersWhoLiked.includes(userUID)) {
				await database
					.collection('quotes')
					.doc(quoteId)
					.set(
						{ usersWhoLiked: quoteQuery.data().usersWhoLiked.concat(userUID) },
						{ merge: true }
					);
			}
		}
	};

	const getBookInfoForQuotesPage = async (userUID, bookId) => {
		const bookQuery = await database.collection('books').doc(bookId).get();
		const pageCount = bookQuery.data().pageCount;
		const cover = bookQuery.data().cover;
		const rootBookQuery = await database
			.collection('rootBooks')
			.doc(bookQuery.data().rootBook)
			.get();
		const authorId = rootBookQuery.data().authorId;
		const authorQuery = await database
			.collection('authors')
			.doc(authorId)
			.get();
		const authorName = authorQuery.data().name;
		const ratingsQuery = await database
			.collection('userBooksInstances')
			.where('rating', '>', 0)
			.get();
		const numberOfRatings = ratingsQuery.docs.length;
		const ratings = ratingsQuery.docs.map((doc) => doc.data().rating);
		const averageRating =
			ratingsQuery.docs.lengh === 0
				? 0
				: ratings.reduce(
						(previous, current) => previous + current / numberOfRatings,
						0
				  );
		const editionsQuery = await database
			.collection('books')
			.where('rootBook', '==', bookQuery.data().rootBook)
			.get();
		const editions = editionsQuery.docs.map((doc) => doc.id);
		const reviewsQuery = await database
			.collection('reviews')
			.where('bookEdition', 'in', editions)
			.get();
		const numberOfReviews = reviewsQuery.docs.length;
		const thisUserInstanceQuery =
			userUID === null || userUID === undefined
				? null
				: await database
						.collection('userBooksInstances')
						.where('userId', '==', userUID)
						.where('bookId', '==', bookId)
						.get();
		const userStatus =
			thisUserInstanceQuery === null || thisUserInstanceQuery.docs.length === 0
				? undefined
				: thisUserInstanceQuery.docs[0].data().status;
		const userRating =
			thisUserInstanceQuery === null || thisUserInstanceQuery.docs.length === 0
				? undefined
				: thisUserInstanceQuery.docs[0].data().rating;
		const userProgress =
			thisUserInstanceQuery === null || thisUserInstanceQuery.docs.length === 0
				? undefined
				: thisUserInstanceQuery.docs[0].data().progress;
		const toReadBookPosition =
			thisUserInstanceQuery === null || thisUserInstanceQuery.docs.length === 0
				? undefined
				: thisUserInstanceQuery.docs[0].data().position;
		const quotes = (
			await database
				.collection('quotes')
				.where('rootBook', '==', bookQuery.data().rootBook)
				.get()
		).docs.map((doc) => {
			return {
				id: doc.id,
				content: doc.data().text,
				tags: doc.data().tags,
				usersWhoLiked: doc.data().usersWhoLiked,
			};
		});
		return {
			pageCount,
			cover,
			authorId,
			authorName,
			numberOfRatings,
			averageRating,
			numberOfReviews,
			userStatus,
			userRating,
			userProgress,
			toReadBookPosition,
			quotes,
		};
	};

	const getBookInfoForListsPage = async (bookId) => {
		const bookQuery = await database.collection('books').doc(bookId).get();
		const title = bookQuery.data().title;
		const cover = bookQuery.data().cover;
		const rootBookQuery = await database
			.collection('rootBooks')
			.doc(bookQuery.data().rootBook)
			.get();
		const seriesQuery = await database
			.collection('series')
			.doc(rootBookQuery.data().series)
			.get();
		const series = seriesQuery.data().name;
		const seriesInstance = rootBookQuery.data().seriesInstance;
		const authorId = rootBookQuery.data().authorId;
		const authorQuery = await database
			.collection('authors')
			.doc(authorId)
			.get();
		const authorName = authorQuery.data().name;
		const authorIsMember = authorQuery.data().GRMember;
		const listsQuery = await database
			.collection('lists')
			.where('books', 'array-contains', bookId)
			.get();
		const lists = await Promise.all(
			listsQuery.docs.map(async (doc) => {
				return {
					id: doc.id,
					name: doc.data().title,
					bookPosition: doc.data().books.indexOf(bookId) + 1,
					bookCovers: await Promise.all(
						doc.data().books.map(async (id) => {
							return (await database.collection('books').doc(id).get()).data()
								.cover;
						})
					),
					voterCount: doc.data().userVotes.length,
				};
			})
		);

		return {
			title,
			cover,
			series,
			seriesInstance,
			authorId,
			authorName,
			authorIsMember,
			lists,
		};
	};

	const addRemoveAuthorToFavorites = async (userUID, authorId, history) => {
		if (userUID === null || userUID === undefined) {
			history.push({
				pathname: '/' + process.env.REACT_APP_BASE_URL + '/user/sign_in',
				state: { error: 'User not logged in' },
			});
		} else {
			const userQuery = await database.collection('users').doc(userUID).get();
			if (
				userQuery.data().favoriteAuthors !== undefined &&
				userQuery.data().favoriteAuthors.includes(authorId)
			) {
				await database
					.collection('users')
					.doc(userUID)
					.set(
						{
							favoriteAuthors: userQuery
								.data()
								.favoriteAuthors.filter((author) => author !== authorId),
						},
						{ merge: true }
					);
			} else {
				await database
					.collection('users')
					.doc(userUID)
					.set(
						{
							favoriteAuthors: userQuery
								.data()
								.favoriteAuthors.concat(authorId),
						},
						{ merge: true }
					);
			}
		}
	};

	const getAuthorBestBook = async (authorId) => {
		const allBooksByAuthor = (
			await Promise.all(
				(
					await database
						.collection('rootBooks')
						.where('authorId', '==', authorId)
						.get()
				).docs.map(async (doc) => {
					return (
						await database
							.collection('books')
							.where('rootBook', '==', doc.id)
							.get()
					).docs.map((doc) => doc.id);
				})
			)
		).reduce((previous, current) => previous.concat(current), []);
		return (
			await Promise.all(
				allBooksByAuthor.map(async (bookId) => {
					const userInstanceQueryForBook = await database
						.collection('userBooksInstances')
						.where('bookId', '==', bookId)
						.get();
					return {
						id: bookId,
						totalInstances: userInstanceQueryForBook.docs.length,
					};
				})
			)
		).reduce(
			(previous, current) =>
				current.totalInstances >= previous.totalInstances ? current : previous,
			{
				id: '',
				totalInstances: 0,
			}
		).id;
	};

	const getAuthorInfoForAuthorPage = async (userUID, authorId) => {
		const authorQuery = await database
			.collection('authors')
			.doc(authorId)
			.get();
		const GRMember = authorQuery.data().GRMember;
		const placeOfBirth = authorQuery.data().placeOfBirth;
		const dateOfBirth =
			authorQuery.data().dateOfBirth !== null &&
			authorQuery.data().dateOfBirth !== undefined
				? authorQuery.data().dateOfBirth.toDate()
				: undefined;
		const influences =
			authorQuery.data().influences !== undefined
				? await Promise.all(
						authorQuery.data().influences.map(async (id) => {
							return {
								id,
								name: (
									await database.collection('authors').doc(id).get()
								).data().name,
							};
						})
				  )
				: undefined;
		const website = authorQuery.data().website;
		const twitter = authorQuery.data().twitter;
		const genre = authorQuery.data().genre;
		const userQuery =
			authorQuery.data().user !== undefined
				? await database.collection('users').doc(authorQuery.data().user).get()
				: undefined;
		const memberSince =
			userQuery !== undefined
				? userQuery.data().membershipDate.toDate()
				: undefined;
		const description =
			authorQuery.data().about !== undefined
				? authorQuery.data().about.replace(/\\n/g, '\n')
				: undefined;
		const profilePicture = authorQuery.data().picture;
		const authorInstanceQuery =
			userQuery !== undefined
				? await database
						.collection('userBooksInstances')
						.where('userId', '==', userQuery.id)
						.get()
				: undefined;
		const userInstanceRatingQuery =
			userQuery !== undefined
				? await database
						.collection('userBooksInstances')
						.where('userId', '==', userQuery.id)
						.where('rating', '>', 0)
						.get()
				: undefined;
		const numberOfRatings =
			userInstanceRatingQuery !== undefined
				? userInstanceRatingQuery.docs.length
				: undefined;
		const numberOfReviews =
			userQuery !== undefined
				? (
						await database
							.collection('reviews')
							.where('user', '==', userQuery.id)
							.get()
				  ).docs.length
				: undefined;
		const averageRating =
			userInstanceRatingQuery !== undefined
				? userInstanceRatingQuery.docs.reduce(
						(previous, current) =>
							previous + current / userInstanceRatingQuery.docs.length,
						0
				  )
				: undefined;
		const followers =
			authorQuery.data().followers !== undefined
				? await Promise.all(
						authorQuery.data().followers.map(async (followerId) => {
							return {
								id: followerId,
								name: (
									await database.collection('users').doc(followerId).get()
								).data().firstName,
								profilePicture: (
									await database.collection('users').doc(followerId).get()
								).data().profileImage,
							};
						})
				  )
				: [];
		const authorFollowerRankingQuery = (
			await database.collection('authors').get()
		).docs.sort((a, b) =>
			a.data().followers === undefined || b.data().followers === undefined
				? b
				: b.data().followers.length - a.data().followers.length
		);
		const mostFollowedPosition =
			authorFollowerRankingQuery.map((doc) => doc.id).indexOf(authorId) + 1;
		const reviewerRankingQuery = await Promise.all(
			(await database.collection('users').get()).docs
				.map(async (doc) => {
					return {
						id: doc.id,
						score: (
							await database
								.collection('reviews')
								.where('user', '==', doc.id)
								.where('rating', '>', 0)
								.get()
						).docs
							.map((doc) => doc.data().rating)
							.reduce((previous, current) => previous + current, 0),
					};
				})
				.sort((a, b) => b.score - a.score)
		);
		const reviewerPosition =
			reviewerRankingQuery.map((obj) => obj.id).indexOf(authorId) !== -1
				? reviewerRankingQuery.map((obj) => obj.id).indexOf(authorId) + 1
				: undefined;
		const usersWhoHaveAsFavorite = (
			await database
				.collection('users')
				.where('favoriteAuthors', 'array-contains', authorId)
				.get()
		).docs.map((doc) => doc.id);
		const numberOfReadBooks =
			authorInstanceQuery !== undefined
				? authorInstanceQuery.docs.filter((doc) => doc.data().status === 'read')
						.length
				: undefined;
		const numberOfToReadBooks =
			authorInstanceQuery !== undefined
				? authorInstanceQuery.docs.filter(
						(doc) => doc.data().status === 'to-read'
				  ).length
				: null;
		const numberOfReadingBooks =
			authorInstanceQuery !== undefined
				? authorInstanceQuery.docs.filter(
						(doc) => doc.data().status === 'reading'
				  ).length
				: null;
		const numberOfFavoriteBooks =
			authorInstanceQuery !== undefined
				? authorInstanceQuery.docs.filter((doc) => doc.data().favorite).length
				: null;
		const friends =
			userQuery !== undefined
				? await Promise.all(
						userQuery.data().friends.map(async (friendId) => {
							const friendUserQuery = await database
								.collection('users')
								.doc(friendId)
								.get();
							return {
								id: friendId,
								name:
									friendUserQuery.data().lastName !== undefined
										? friendUserQuery.data().firstName +
										  ' ' +
										  friendUserQuery.data().lastName
										: friendUserQuery.data().firstName,
								profilePicture: friendUserQuery.data().profileImage,
								numberOfBooks: (
									await database
										.collection('userBooksInstances')
										.where('userId', '==', friendId)
										.get()
								).docs.length,
								numberOfFriends: friendUserQuery.data().friends.length,
							};
						})
				  )
				: undefined;
		const rootBooksByAuthorQuery = await database
			.collection('rootBooks')
			.where('authorId', '==', authorId)
			.get();
		const booksByAuthor = await Promise.all(
			rootBooksByAuthorQuery.docs.map(async (rootBookDoc) => {
				const editionIds = (
					await database
						.collection('books')
						.where('rootBook', '==', rootBookDoc.id)
						.get()
				).docs.map((doc) => doc.id);
				const bookQuery = (
					await database
						.collection('books')
						.where('rootBook', '==', rootBookDoc.id)
						.where('mainEdition', '==', true)
						.get()
				).docs[0];
				const userInstanceQuery =
					userUID !== undefined && userUID !== null
						? (
								await database
									.collection('userBooksInstances')
									.where('userId', '==', userUID)
									.get()
						  ).docs.filter((doc) => editionIds.includes(doc.data().bookId))
						: undefined;
				const ratingsQuery = (
					await database
						.collection('userBooksInstances')
						.where('bookId', 'in', editionIds)
						.get()
				).docs.filter((doc) => doc.data().rating !== undefined);
				return {
					id: bookQuery.id,
					title: bookQuery.data().title,
					seriesId: rootBookDoc.data().series,
					series:
						rootBookDoc.data().series !== undefined
							? (
									await database
										.collection('series')
										.doc(rootBookDoc.data().series)
										.get()
							  ).data().name
							: undefined,
					seriesInstance: rootBookDoc.data().seriesInstance,
					cover: bookQuery.data().cover,
					userStatus:
						userInstanceQuery !== undefined && userInstanceQuery.length > 0
							? userInstanceQuery[0].data().status
							: undefined,
					userRating:
						userInstanceQuery !== undefined && userInstanceQuery.length > 0
							? userInstanceQuery[0].data().rating
							: undefined,
					averageRating: ratingsQuery
						.map((doc) => doc.data().rating)
						.reduce(
							(previous, current) =>
								ratingsQuery.length !== 0
									? previous + current / ratingsQuery.length
									: 0,
							0
						),
					ratings: ratingsQuery.length,
					publishedYear:
						bookQuery.data().publishedDate !== undefined
							? bookQuery.data().publishedDate.toDate().getFullYear()
							: undefined,
					editions: editionIds.length,
					numberOfReviews: (
						await database
							.collection('reviews')
							.where('bookEdition', 'in', editionIds)
							.get()
					).docs.length,
				};
			})
		);
		const seriesByAuthor = await Promise.all(
			(
				await database
					.collection('rootBooks')
					.where('authorId', '==', authorId)
					.get()
			).docs
				.filter((doc) => doc.data().series !== undefined)
				.map((doc) => doc.data().series)
				.reduce(
					(previous, current) =>
						previous.includes(current) ? previous : previous.concat(current),
					[]
				)
				.map(async (seriesId) => {
					const seriesQuery = await database
						.collection('series')
						.doc(seriesId)
						.get();
					const rootBookQuery = await database
						.collection('rootBooks')
						.where('series', '==', seriesId)
						.get();
					const ratingCount = booksByAuthor
						.filter((book) => book.seriesId === seriesId)
						.reduce((previous, current) => previous + current.ratings, 0);
					return {
						title: seriesQuery.data().name,
						books: await Promise.all(
							rootBookQuery.docs.map(async (rootBook) => {
								const bookQuery = await database
									.collection('books')
									.where('rootBook', '==', rootBook.id)
									.where('mainEdition', '==', true)
									.get();
								return {
									id: bookQuery.docs[0].id,
									title: bookQuery.docs[0].data().title,
									seriesInstance: rootBook.data().seriesInstance,
									cover: bookQuery.docs[0].data().cover,
								};
							})
						),
						averageRating: booksByAuthor
							.filter((book) => book.seriesId === seriesId)
							.reduce(
								(previous, current) =>
									ratingCount !== 0
										? previous +
										  (current.averageRating * current.ratings) / ratingCount
										: 0,
								0
							),
						numberOfRatings: ratingCount,
					};
				})
		);
		const relatedNews = (
			await database
				.collection('articles')
				.where(
					'featuredBooks',
					'array-contains-any',
					rootBooksByAuthorQuery.docs.map((rootBook) => rootBook.id)
				)
				.get()
		).docs.map((article) => {
			return {
				id: article.id,
				title: article.data().title,
				content: article.data().content,
				numberOfLikes: article.data().usersWhoLiked.length,
				numberOfComments: article.data().comments.length,
				image: article.data().image,
			};
		});
		const quotes = await Promise.all(
			(
				await database
					.collection('quotes')
					.where('authorId', '==', authorId)
					.get()
			).docs.map(async (quote) => {
				return {
					id: quote.id,
					content: quote.data().text,
					bookTitle: (
						await database
							.collection('books')
							.where('rootBook', '==', quote.data().rootBook)
							.where('mainEdition', '==', true)
							.get()
					).docs[0].data().title,
					tags: quote.data().tags,
					usersWhoLiked: quote.data().usersWhoLiked,
				};
			})
		);
		const favoriteAuthors =
			userQuery !== undefined
				? await Promise.all(
						userQuery.data().favoriteAuthors.map(async (author) => {
							const favoriteAuthorQuery = await database
								.collection('authors')
								.doc(author)
								.get();
							const bestBookId = await getAuthorBestBook(author);
							return {
								id: author,
								name: favoriteAuthorQuery.data().name,
								image: favoriteAuthorQuery.data().picture,
								bestBookId,
								bestBookTitle: (
									await database.collection('books').doc(bestBookId).get()
								).data().title,
							};
						})
				  )
				: undefined;

		return {
			GRMember,
			placeOfBirth,
			dateOfBirth,
			influences,
			website,
			twitter,
			genre,
			memberSince,
			description,
			profilePicture,
			numberOfRatings,
			numberOfReviews,
			averageRating,
			followers,
			mostFollowedPosition,
			reviewerPosition,
			usersWhoHaveAsFavorite,
			numberOfReadBooks,
			numberOfToReadBooks,
			numberOfReadingBooks,
			numberOfFavoriteBooks,
			friends,
			booksByAuthor,
			seriesByAuthor,
			relatedNews,
			quotes,
			favoriteAuthors,
		};
	};

	const changeFavoriteAuthors = async (userUID, newArray) => {
		if (userUID !== null && userUID !== undefined) {
			try {
				await database
					.collection('users')
					.doc(userUID)
					.set({ favoriteAuthors: newArray }, { merge: true });
			} catch (error) {
				console.log(error);
			}
		}
	};

	const fetchUserFavoriteAuthors = async (userUID, history) => {
		if (userUID === null || userUID === undefined) {
			history.push({
				pathname: '/' + process.env.REACT_APP_BASE_URL + '/user/sign_in',
				state: { error: 'User not logged in' },
			});
			return [];
		} else {
			return await Promise.all(
				(await database.collection('users').doc(userUID).get())
					.data()
					.favoriteAuthors.map(async (authorId) => {
						const authorQuery = await database
							.collection('authors')
							.doc(authorId)
							.get();
						const bestBookId = await getAuthorBestBook(authorId);
						const rootBooksByAuthor = (
							await database
								.collection('rootBooks')
								.where('authorId', '==', authorId)
								.get()
						).docs.map((doc) => doc.id);
						const editionsByAuthor = (
							await database
								.collection('books')
								.where('rootBook', 'in', rootBooksByAuthor)
								.get()
						).docs.map((doc) => doc.id);
						return {
							id: authorId,
							name: authorQuery.data().name,
							userId: authorQuery.data().user,
							bestBookId,
							bestBookTitle: (
								await database.collection('books').doc(bestBookId).get()
							).data().title,
							profilePicture: authorQuery.data().picture,
							numberOfBooks: editionsByAuthor.length,
							numberOfShelvedBooks:
								authorQuery.data().user === undefined
									? undefined
									: (
											await database
												.collection('userBooksInstances')
												.where('userId', '==', authorQuery.data().user)
												.get()
									  ).docs.length,
							numberOfMemberReviews: (
								await database
									.collection('reviews')
									.where('bookEdition', 'in', editionsByAuthor)
									.get()
							).docs.length,
							numberOfFriends:
								authorQuery.data().user === undefined
									? undefined
									: (
											await database
												.collection('users')
												.doc(authorQuery.data().user)
												.get()
									  ).data().friends.length,
							numberOfFollowers:
								authorQuery.data().followers === undefined
									? 0
									: authorQuery.data().followers.length,
						};
					})
			);
		}
	};

	const getUserInfoForFavoriteAuthorsForUserPage = async (userId) => {
		const userQuery = await database.collection('users').doc(userId).get();
		return {
			firstName: userQuery.data().firstName,
			authors: await fetchUserFavoriteAuthors(userId, null),
		};
	};

	const getNotificationsForUser = async (userUID, history) => {
		if (userUID === null || userUID === undefined) {
			history.push({
				pathname: '/' + process.env.REACT_APP_BASE_URL + '/user/sign_in',
				state: { error: 'User not logged in' },
			});
			return [];
		} else {
			const userQuery = await database.collection('users').doc(userUID).get();
			return userQuery.data().notifications.map((notification) => {
				return {
					anchorSrc: notification.anchorSrc,
					content: notification.content,
					image: notification.image,
					name: notification.name,
					nonAnchorContent: notification.nonAnchorContent,
					time: notification.time.toDate(),
				};
			});
		}
	};

	const saveUserSettings = async (userUID, settings) => {
		await database
			.collection('users')
			.doc(userUID)
			.set(settings, { merge: true });
	};

	const deleteProfilePicture = async (userUID) => {
		await database
			.collection('users')
			.doc(userUID)
			.update({ profileImage: firebase.firestore.FieldValue.delete() });
	};

	const getUserSettings = async (userUID, history) => {
		if (userUID === null || userUID === undefined) {
			history.push({
				pathname: '/' + process.env.REACT_APP_BASE_URL + '/user/sign_in',
				state: { error: 'User not logged in' },
			});
			return {};
		} else {
			const userQueryData = (
				await database.collection('users').doc(userUID).get()
			).data();
			const tidyUpUserSettingForProps = (setting) => {
				return setting !== undefined ? setting : '';
			};
			return {
				profile: {
					firstName: tidyUpUserSettingForProps(userQueryData.firstName),
					middleName: tidyUpUserSettingForProps(userQueryData.middleName),
					lastName: tidyUpUserSettingForProps(userQueryData.lastName),
					showLastNameTo: userQueryData.showLastNameTo,
					gender: tidyUpUserSettingForProps(userQueryData.gender),
					customGender: tidyUpUserSettingForProps(userQueryData.customGender),
					pronouns: userQueryData.pronouns,
					showGenderTo: userQueryData.showGenderTo,
					zipCode: tidyUpUserSettingForProps(userQueryData.zipCode),
					city: tidyUpUserSettingForProps(userQueryData.city),
					stateProvinceCode: tidyUpUserSettingForProps(
						userQueryData.stateProvinceCode
					),
					country: tidyUpUserSettingForProps(userQueryData.country),
					locationViewableBy: userQueryData.locationViewableBy,
					dateOfBirth:
						userQueryData.dateOfBirth === null
							? undefined
							: userQueryData.dateOfBirth.toDate(),
					ageAndBirthdayPrivacy: userQueryData.ageAndBirthdayPrivacy,
					profilePicture: userQueryData.profileImage,
					website: tidyUpUserSettingForProps(userQueryData.website),
					interests: tidyUpUserSettingForProps(userQueryData.interests),
					typeOfBooks: tidyUpUserSettingForProps(userQueryData.typeOfBooks),
					aboutMe: tidyUpUserSettingForProps(userQueryData.aboutMe),
				},
				account: {
					email: tidyUpUserSettingForProps(userQueryData.email),
					emailVerifiedDate: userQueryData.emailVerifiedDate,
					passwordLength: tidyUpUserSettingForProps(userQueryData.password)
						.length,
					whoCanViewMyProfile: userQueryData.whoCanViewMyProfile,
					emailAddressVisibleTo: userQueryData.emailAddressVisibleTo,
					friendChallengeQuestion: tidyUpUserSettingForProps(
						userQueryData.friendChallengeQuestion
					),
					friendChallengeAnswer: tidyUpUserSettingForProps(
						userQueryData.friendChallengeAnswer
					),
				},
				feed: {
					addBookToShelves: userQueryData.addBookToShelves,
					addAFriend: userQueryData.addAFriend,
					voteForABookReview: userQueryData.voteForABookReview,
					addAQuote: userQueryData.addAQuote,
					recommendABook: userQueryData.recommendABook,
					addANewStatusToBook: userQueryData.addANewStatusToBook,
					followAnAuthor: userQueryData.followAnAuthor,
				},
			};
		}
	};

	const checkIfPasswordsMatch = async (userUID, password) => {
		return (
			(await database.collection('users').doc(userUID).get()).data()
				.password === password
		);
	};

	const changePassword = async (userUID, newPassword, history) => {
		await database
			.collection('users')
			.doc(userUID)
			.set({ password: newPassword }, { merge: true });
		history.push({
			pathname: '/' + process.env.REACT_APP_BASE_URL + '/user/sign_in',
			state: { message: 'Your password has been updated.' },
		});
	};

	const deleteAccount = async (userUID, history) => {
		const userInstanceQuery = await database
			.collection('userBooksInstances')
			.where('userId', '==', userUID)
			.get();
		userInstanceQuery.docs.map(async (doc) => {
			await doc.delete();
		});
		const reviewQuery = await database
			.collection('reviews')
			.where('user', '==', userUID)
			.get();
		reviewQuery.docs.map(async (doc) => {
			await doc.delete();
		});
		await database.collection('users').doc(userUID).delete();
		history.push({
			pathname: '/' + process.env.REACT_APP_BASE_URL + '/',
			state: { message: 'Your account will be permanently deleted.' },
		});
	};

	const getFavoriteGenresForUser = async (userUID, history) => {
		if (userUID === null || userUID === undefined) {
			history.push({
				pathname: '/' + process.env.REACT_APP_BASE_URL + '/user/sign_in',
				state: { error: 'User not logged in' },
			});
			return [];
		} else {
			return (await database.collection('users').doc(userUID).get()).data()
				.favoriteGenres;
		}
	};

	const updateFavoriteGenresForUser = async (userUID, newGenres) => {
		await database
			.collection('users')
			.doc(userUID)
			.set({ favoriteGenres: newGenres }, { merge: true });
	};

	const getGenreInfo = async (userUID, genre) => {
		const userFavoriteGenres =
			userUID !== undefined && userUID !== null
				? (await database.collection('users').doc(userUID).get()).data()
						.favoriteGenres
				: undefined;
		const genreQuery = await database.collection('genres').doc(genre).get();
		const description = genreQuery.data().description;
		const relatedGenres = genreQuery.data().relatedGenres;
		const parentGenre = genreQuery.data().parentGenre;
		const shelfQuery = await database
			.collection('shelves')
			.where('genre', '==', genre)
			.get();
		const allRootBooksOfGenre = shelfQuery.docs.reduce((previous, current) => {
			const newArray = previous;
			current.data().rootBooks.forEach((rootBook) => {
				if (!newArray.includes(rootBook)) {
					newArray.push(rootBook);
				}
			});
			return newArray;
		}, []);
		const allBookDocsOfGenre = [].concat.apply(
			[],
			await Promise.all(
				allRootBooksOfGenre.map(async (rootBook) => {
					return (
						await database
							.collection('books')
							.where('rootBook', '==', rootBook)
							.get()
					).docs;
				})
			)
		);
		const newReleases = allBookDocsOfGenre
			.sort((a, b) =>
				a.data().publishedDate === undefined
					? b
					: b.data().publishedDate === undefined
					? a
					: b.data().publishedDate.toDate() - a.data().publishedDate.toDate()
			)
			.map((release) => {
				return {
					id: release.id,
					cover: release.data().cover,
					title: release.data().title,
				};
			});
		newReleases.length = Math.min(newReleases.length, 15);
		const userUpdatesQuery = await database
			.collection('userBooksUpdates')
			.get();
		const mostReadThisWeek = await Promise.all(
			Object.entries(
				userUpdatesQuery.docs
					.filter(
						(doc) =>
							differenceInDays(new Date(), doc.data().date.toDate()) <= 7 &&
							allBookDocsOfGenre
								.map((bookDoc) => bookDoc.id)
								.includes(doc.data().book) &&
							doc.data().action === 'add-book' &&
							(doc.data().shelf === 'read' || doc.data().shelf === 'reading')
					)
					.reduce((previous, current) => {
						if (previous[current.data().book] === undefined) {
							previous[current.data().book] = 1;
						} else {
							previous[current.data().book] += 1;
						}
						return previous;
					}, {})
			)
				.sort((a, b) => b[1] - a[1])
				.map(async (bookValuePair) => {
					const bookQuery = await database
						.collection('books')
						.doc(bookValuePair[0])
						.get();
					return {
						id: bookValuePair[0],
						cover: bookQuery.data().cover,
						title: bookQuery.data().cover,
					};
				})
		);
		mostReadThisWeek.length = Math.min(mostReadThisWeek.length, 15);
		const lists = await Promise.all(
			(
				await database
					.collection('lists')
					.where('tags', 'array-contains', genre)
					.get()
			).docs.map(async (doc) => {
				return {
					id: doc.id,
					title: doc.data().title,
					bookCovers: await Promise.all(
						doc
							.data()
							.books.filter((_b, index) => index < 5)
							.map(async (book) => {
								const cover = (
									await database.collection('books').doc(book).get()
								).data().cover;
								return cover !== undefined
									? cover
									: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png';
							})
					),
					numberOfBooks: doc.data().books.length,
					numberOfVoters: doc.data().userVotes.length,
				};
			})
		);
		const genreBooks = allBookDocsOfGenre
			.filter((_d, index) => index < 15)
			.map((doc) => {
				return {
					id: doc.id,
					cover: doc.data().cover,
					title: doc.data().title,
				};
			});
		const relatedNews = (await database.collection('articles').get()).docs
			.filter(
				(doc) =>
					doc.data().featuredBooks !== undefined &&
					doc
						.data()
						.featuredBooks.some((rootBook) =>
							allRootBooksOfGenre.includes(rootBook)
						)
			)
			.sort(
				(a, b) =>
					b.data().datePublished.toDate() - a.data().datePublished.toDate()
			)
			.map((doc) => {
				return {
					id: doc.id,
					image: doc.data().image,
					title: doc.data().title,
					content: doc.data().content,
				};
			});
		relatedNews.length = Math.min(relatedNews.length, 1);
		const quotesTagged = await Promise.all(
			(
				await database
					.collection('quotes')
					.where('tags', 'array-contains', genre)
					.get()
			).docs.map(async (doc) => {
				const authorQuery = await database
					.collection('authors')
					.doc(doc.data().authorId)
					.get();
				const bookQuery = await database
					.collection('books')
					.where('rootBook', '==', doc.data().rootBook)
					.where('mainEdition', '==', true)
					.get();
				return {
					id: doc.id,
					content: doc.data().text,
					numberOfLikes: doc.data().usersWhoLiked.length,
					authorId: doc.data().authorId,
					authorName: authorQuery.data().name,
					authorPicture: authorQuery.data().picture,
					bookTitle: bookQuery.docs[0].data().title,
				};
			})
		);

		return {
			userFavoriteGenres,
			description,
			relatedGenres,
			parentGenre,
			newReleases,
			mostReadThisWeek,
			lists,
			genreBooks,
			relatedNews,
			quotesTagged,
		};
	};

	const getNews = async () => {
		const newsQuery = await database
			.collection('articles')
			.orderBy('datePublished', 'desc')
			.get();
		return newsQuery.docs.map((doc) => {
			return {
				id: doc.id,
				image: doc.data().image,
				type: doc.data().type,
				title: doc.data().title,
				date: doc.data().datePublished.toDate(),
				numberOfLikes: doc.data().usersWhoLiked.length,
				content: doc.data().content,
				featured: doc.data().isFeatured,
			};
		});
	};

	const likeUnlikeArticle = async (userUID, articleId, history) => {
		if (userUID === null || userUID === undefined) {
			history.push({
				pathname: '/' + process.env.REACT_APP_BASE_URL + '/user/sign_in',
				state: { error: 'User not logged in' },
			});
		} else {
			const articleQuery = await database
				.collection('articles')
				.doc(articleId)
				.get();
			if (articleQuery.data().usersWhoLiked.includes(userUID)) {
				await database
					.collection('articles')
					.doc(articleId)
					.set(
						{
							usersWhoLiked: articleQuery
								.data()
								.usersWhoLiked.filter((user) => user !== userUID),
						},
						{ merge: true }
					);
			} else {
				await database
					.collection('articles')
					.doc(articleId)
					.set(
						{
							usersWhoLiked: articleQuery.data().usersWhoLiked.concat(userUID),
						},
						{ merge: true }
					);
			}
		}
	};

	const getInfoForArticle = async (articleId) => {
		const articleQuery = await database
			.collection('articles')
			.doc(articleId)
			.get();
		return {
			authorName: articleQuery.data().authorName,
			date: articleQuery.data().datePublished.toDate(),
			likes: articleQuery.data().usersWhoLiked,
			image: articleQuery.data().image,
			content: articleQuery.data().content,
		};
	};

	const getArticleTitle = async (articleId) => {
		return (await database.collection('articles').doc(articleId).get()).data()
			.title;
	};

	const getUsersWhoLikedArticle = async (articleId) => {
		const articleQuery = await database
			.collection('articles')
			.doc(articleId)
			.get();
		return await Promise.all(
			articleQuery.data().usersWhoLiked.map(async (user) => {
				const userQuery = await database.collection('users').doc(user).get();
				return {
					id: userQuery.id,
					name: userQuery.data().firstName,
					profilePicture: userQuery.data().profileImage,
					numberOfBooks: (
						await database
							.collection('userBooksInstances')
							.where('userId', '==', user)
							.get()
					).docs.length,
					numberOfFriends: userQuery.data().friends.length,
				};
			})
		);
	};

	const getUserInfoForUserPage = async (userUID, loggedInUserUID) => {
		const userQuery = await database.collection('users').doc(userUID).get();
		const userUpdatesQuery = await database
			.collection('userBooksUpdates')
			.where('user', '==', userUID)
			.get();
		const userInstanceQuery = await database
			.collection('userBooksInstances')
			.where('userId', '==', userUID)
			.get();
		const userReviewQuery = await database
			.collection('reviews')
			.where('user', '==', userUID)
			.get();
		return {
			whoCanViewUserProfile: userQuery.data().whoCanViewMyProfile,
			isFollowedByUser:
				userQuery.data().followers !== undefined &&
				userQuery.data().followers.includes(loggedInUserUID),
			isUserFriend: userQuery.data().friends.includes(loggedInUserUID),
			hasPendingFriendResquestFromUser:
				userQuery
					.data()
					.newFriendsRequests.filter(
						(request) => request.sender === loggedInUserUID
					).length > 0,
			lastName: userQuery.data().lastName,
			showLastNameTo: userQuery.data().showLastNameTo,
			showGenderTo: userQuery.data().showGenderTo,
			gender:
				userQuery.data().gender === 'm'
					? 'Male'
					: userQuery.data().gender === 'f'
					? 'Female'
					: userQuery.data().gender === 'c'
					? userQuery.data().customGender
					: '',
			locationViewableBy: userQuery.data().locationViewableBy,
			country: userQuery.data().country,
			stateProvinceCode: userQuery.data().stateProvinceCode,
			city: userQuery.data().city,
			ageAndBirthdayPrivacy: userQuery.data().ageAndBirthdayPrivacy,
			birthday:
				userQuery.data().dateOfBirth === null
					? undefined
					: userQuery.data().dateOfBirth.toDate(),
			website: userQuery.data().website,
			lastActiveDate:
				userUpdatesQuery.docs.length > 0
					? userUpdatesQuery.docs
							.sort(
								(a, b) => b.data().date.toDate() - a.data().date.toDate()
							)[0]
							.data()
							.date.toDate()
					: userQuery.data().membershipDate.toDate(),
			joinedDate: userQuery.data().membershipDate.toDate(),
			interests: userQuery.data().interests,
			favoriteBooks: userQuery.data().typeOfBooks,
			about: userQuery.data().aboutMe,
			profilePicture: userQuery.data().profileImage,
			numberOfRatings: userInstanceQuery.docs.filter(
				(doc) => doc.data().rating !== undefined && doc.data().rating !== 0
			).length,
			fiveRatings: userInstanceQuery.docs.filter(
				(doc) => doc.data().rating !== undefined && doc.data().rating === 5
			).length,
			fourRatings: userInstanceQuery.docs.filter(
				(doc) => doc.data().rating !== undefined && doc.data().rating === 4
			).length,
			threeRatings: userInstanceQuery.docs.filter(
				(doc) => doc.data().rating !== undefined && doc.data().rating === 3
			).length,
			twoRatings: userInstanceQuery.docs.filter(
				(doc) => doc.data().rating !== undefined && doc.data().rating === 2
			).length,
			oneRatings: userInstanceQuery.docs.filter(
				(doc) => doc.data().rating !== undefined && doc.data().rating === 1
			).length,
			averageRating: userInstanceQuery.docs
				.filter(
					(doc) => doc.data().rating !== undefined && doc.data().rating !== 0
				)
				.reduce(
					(previous, current) =>
						previous +
						current.data().rating /
							userInstanceQuery.docs.filter(
								(doc) =>
									doc.data().rating !== undefined && doc.data().rating !== 0
							).length,
					0
				),
			numberOfReviews: userReviewQuery.docs.length,
			bookshelves: (
				await database.collection('shelves').where('user', '==', userUID).get()
			).docs.map((doc) => {
				return {
					name:
						doc.data().name !== undefined ? doc.data().name : doc.data().genre,
					numberOfBooks: doc.data().rootBooks.length,
				};
			}),
			toReadBooks: await Promise.all(
				userInstanceQuery.docs
					.filter((doc) => doc.data().status === 'to-read')
					.map(async (doc) => {
						const bookQuery = await database
							.collection('books')
							.doc(doc.data().bookId)
							.get();
						return {
							id: doc.data().bookId,
							title: bookQuery.data().title,
							cover: bookQuery.data().cover,
						};
					})
			),
			currentlyReadingBooks: await Promise.all(
				userInstanceQuery.docs
					.filter(
						(doc) =>
							doc.data().status === 'reading' &&
							userUpdatesQuery.docs.some(
								(updateDoc) =>
									updateDoc.data().book === doc.data().bookId &&
									updateDoc.data().action === 'add-book'
							)
					)
					.map(async (doc) => {
						const bookQuery = await database
							.collection('books')
							.doc(doc.data().bookId)
							.get();
						const rootBookQuery = await database
							.collection('rootBooks')
							.doc(bookQuery.data().rootBook)
							.get();
						const authorQuery = await database
							.collection('authors')
							.doc(rootBookQuery.data().authorId)
							.get();
						const bookshelvesQuery = await database
							.collection('shelves')
							.where('user', '==', userUID)
							.where('rootBooks', 'array-contains', bookQuery.data().rootBook)
							.get();
						const loggedInUserQuery = await database
							.collection('userBooksInstances')
							.where('userId', '==', loggedInUserUID)
							.where('bookId', '==', doc.data().bookId)
							.get();
						return {
							id: doc.data().bookId,
							title: bookQuery.data().title,
							cover: bookQuery.data().cover,
							mainAuthorId: rootBookQuery.data().authorId,
							mainAuthorName: authorQuery.data().name,
							mainAuthorIsMember: authorQuery.data().GRMember,
							bookshelves: bookshelvesQuery.docs.map((doc) =>
								doc.data().name !== undefined
									? doc.data().name
									: doc.data().genre
							),
							updateDate: userUpdatesQuery.docs
								.filter(
									(updateDoc) => updateDoc.data().book === doc.data().bookId
								)
								.sort(
									(a, b) => b.data().date.toDate() - a.data().date.toDate()
								)[0]
								.data()
								.date.toDate(),
							userStatus:
								loggedInUserQuery.docs.length === 0
									? undefined
									: loggedInUserQuery.docs[0].data().status,
							userRating:
								loggedInUserQuery.docs.length === 0
									? undefined
									: loggedInUserQuery.docs[0].data().rating,
							userProgress:
								loggedInUserQuery.docs.length === 0
									? undefined
									: loggedInUserQuery.docs[0].data().progress,
							userToReadPosition:
								loggedInUserQuery.docs.length === 0
									? undefined
									: loggedInUserQuery.docs[0].data().position,
						};
					})
			),
			recentUpdates: await Promise.all(
				userUpdatesQuery.docs
					.filter(
						(doc) =>
							(userQuery.data().addBookToShelves &&
								doc.data().action === 'add-book' &&
								!['reading', 'to-read', 'read'].includes(doc.data().shelf)) ||
							(userQuery.data().addAFriend &&
								doc.data().action === 'add-friend') ||
							(userQuery.data().voteForABookReview &&
								doc.data().action === 'vote-for-book-review') ||
							(userQuery.data().addAQuote &&
								doc.data().action === 'add-quote') ||
							(userQuery.data().recommendABook &&
								doc.data().action === 'recommend-book') ||
							(userQuery.data().addANewStatusToBook &&
								((doc.data().action === 'add-book' &&
									['read', 'reading', 'to-read'].includes(doc.data().shelf)) ||
									doc.data().action === 'rate-book')) ||
							(userQuery.data().followAnAuthor &&
								doc.data().action === 'follow-author')
					)
					.sort((a, b) => b.data().date.toDate() - a.data().date.toDate())
					.filter((_doc, index) => index < 10)
					.map(async (doc) => {
						const reviewQuery =
							doc.data().action === 'vote-for-book-review'
								? await database
										.collection('reviews')
										.doc(doc.data().review)
										.get()
								: null;
						const bookQuery =
							doc.data().book !== undefined
								? await database.collection('books').doc(doc.data().book).get()
								: undefined;
						const loggedInUserQuery =
							doc.data().book !== undefined
								? await database
										.collection('userBooksInstances')
										.where('userId', '==', loggedInUserUID)
										.where('bookId', '==', doc.data().book)
										.get()
								: { docs: [] };
						const rootBookQuery =
							bookQuery !== undefined
								? await database
										.collection('rootBooks')
										.doc(bookQuery.data().rootBook)
										.get()
								: undefined;
						const authorId =
							doc.data().action === 'follow-author'
								? doc.data().author
								: doc.data().action === 'add-book' ||
								  doc.data().action === 'recommend-book' ||
								  doc.data().action === 'rate-book'
								? rootBookQuery.data().authorId
								: undefined;
						const authorQuery =
							authorId !== undefined
								? await database.collection('authors').doc(authorId).get()
								: undefined;
						const otherUserId =
							doc.data().action === 'add-friend'
								? doc.data().newFriendId
								: doc.data().action === 'vote-for-book-review'
								? reviewQuery.data().user
								: undefined;
						const otherUserQuery =
							otherUserId !== undefined
								? await database.collection('users').doc(otherUserId).get()
								: undefined;
						const bestBookId =
							authorId !== undefined
								? await getAuthorBestBook(authorId)
								: undefined;
						const bestBookQuery =
							bestBookId !== undefined
								? await database.collection('books').doc(bestBookId).get()
								: undefined;
						const bestBookRootBookQuery =
							bestBookQuery !== undefined
								? await database
										.collection('rootBooks')
										.doc(bestBookQuery.data().rootBook)
										.get()
								: undefined;
						return {
							id: doc.id,
							type:
								doc.data().action !== 'add-book'
									? doc.data().action
									: 'add-book-' + doc.data().shelf,
							date: doc.data().date.toDate(),
							rating: doc.data().rating === undefined ? 0 : doc.data().rating,
							newFriendId: doc.data().newFriendId,
							numberOfReviewVoters:
								reviewQuery !== null
									? reviewQuery.data().usersWhoLiked.length
									: undefined,
							reviewText:
								reviewQuery !== null ? reviewQuery.data().text : undefined,
							quoteId: doc.data().quote,
							quoteContent:
								doc.data().quote !== undefined
									? (
											await database
												.collection('quotes')
												.doc(doc.data().quote)
												.get()
									  ).data().text
									: undefined,
							userInfo:
								otherUserQuery !== undefined
									? {
											id: otherUserQuery.id,
											name: otherUserQuery.data().firstName,
											picture: otherUserQuery.data().profileImage,
									  }
									: undefined,
							authorInfo:
								authorQuery !== undefined
									? {
											id: authorId,
											name: authorQuery.data().name,
											isMember: authorQuery.data().GRMember,
											bestBookId: bestBookId,
											bestBookTitle: bestBookQuery.data().title,
											bestBookSeries: (
												await database
													.collection('series')
													.doc(bestBookRootBookQuery.data().series)
													.get()
											).name,
											bestBookSeriesInstance: bestBookRootBookQuery.data()
												.seriesInstance,
									  }
									: undefined,
							bookInfo:
								bookQuery !== undefined
									? {
											id: bookQuery.id,
											title: bookQuery.data().title,
											cover: bookQuery.data().cover,
											userStatus:
												loggedInUserQuery.docs.length === 0
													? undefined
													: loggedInUserQuery.docs[0].data().status,
											userRating:
												loggedInUserQuery.docs.length === 0
													? undefined
													: loggedInUserQuery.docs[0].data().rating,
											userProgress:
												loggedInUserQuery.docs.length === 0
													? undefined
													: loggedInUserQuery.docs[0].data().progress,
											userToReadPosition:
												loggedInUserQuery.docs.length === 0
													? undefined
													: loggedInUserQuery.docs[0].data().position,
									  }
									: undefined,
						};
					})
			),
			quotes: await Promise.all(
				(
					await database
						.collection('quotes')
						.where('usersWhoLiked', 'array-contains', userUID)
						.get()
				).docs.map(async (doc) => {
					const authorQuery = await database
						.collection('authors')
						.doc(doc.data().authorId)
						.get();
					const quoteBookDoc = (
						await database
							.collection('books')
							.where('rootBook', '==', doc.data().rootBook)
							.where('mainEdition', '==', true)
							.get()
					).docs[0];
					return {
						id: doc.id,
						content: doc.data().text,
						authorId: doc.data().authorId,
						authorName: authorQuery.data().name,
						authorProfilePicture: authorQuery.data().picture,
						bookId: quoteBookDoc.id,
						bookTitle: quoteBookDoc.data().title,
						numberOfLikes: doc.data().usersWhoLiked.length,
						likedByUser: doc.data().usersWhoLiked.includes(loggedInUserUID),
					};
				})
			),
			friends: await Promise.all(
				userQuery.data().friends.map(async (friend) => {
					const friendUserQuery = await database
						.collection('users')
						.doc(friend)
						.get();
					return {
						id: friend,
						name: friendUserQuery.data().firstName,
						picture: friendUserQuery.data().profileImage,
						numberOfBooks: (
							await database
								.collection('userBooksInstances')
								.where('userId', '==', friend)
								.get()
						).docs.length,
						numberOfFriends: friendUserQuery.data().friends.length,
					};
				})
			),
			following: (
				await database
					.collection('users')
					.where('followers', 'array-contains', userUID)
					.get()
			).docs.map((doc) => {
				return {
					id: doc.id,
					picture: doc.data().profileImage,
					name: doc.data().firstName,
				};
			}),
			numberOfFollowers:
				userQuery.data().followers === undefined
					? 0
					: userQuery.data().followers.length,
			favoriteAuthors: await Promise.all(
				userQuery.data().favoriteAuthors.map(async (author) => {
					const authorQuery = await database
						.collection('authors')
						.doc(author)
						.get();
					const bestBookId = await getAuthorBestBook(author);
					return {
						id: author,
						name: authorQuery.data().name,
						picture: authorQuery.data().picture,
						bestBookId,
						bestBookTitle: (
							await database.collection('books').doc(bestBookId).get()
						).data().title,
					};
				})
			),
			votedLists: await Promise.all(
				(await database.collection('lists').get()).docs
					.filter((doc) =>
						doc.data().userVotes.some((vote) => vote.user === userUID)
					)
					.map(async (doc) => {
						return {
							id: doc.id,
							title: doc.data().title,
							bookCovers: await Promise.all(
								doc
									.data()
									.userVotes.filter((vote) => vote.user === userUID)[0]
									.books.map(async (book) => {
										return (
											await database.collection('books').doc(book).get()
										).data().cover;
									})
							),
							numberOfBooks: doc.data().books.length,
							numberOfVoters: doc.data().userVotes.length,
						};
					})
			),
			favoriteGenres: userQuery.data().favoriteGenres,
		};
	};

	const followUser = async (userUID, userToFollowUID, history) => {
		if (userUID === null || userUID === undefined) {
			history.push({
				pathname: '/' + process.env.REACT_APP_BASE_URL + '/user/sign_in',
				state: { error: 'User not logged in' },
			});
		} else {
			const userToFollowQuery = await database
				.collection('users')
				.doc(userToFollowUID)
				.get();
			await database
				.collection('users')
				.doc(userToFollowUID)
				.set(
					{
						followers:
							userToFollowQuery.data().followers === undefined
								? [userUID]
								: userToFollowQuery.data().followers.concat(userUID),
					},
					{ merge: true }
				);
		}
	};

	const unfollowUser = async (userUID, userToFollowUID, history) => {
		if (userUID === null || userUID === undefined) {
			history.push({
				pathname: '/' + process.env.REACT_APP_BASE_URL + '/user/sign_in',
				state: { error: 'User not logged in' },
			});
		} else {
			const userToFollowQuery = await database
				.collection('users')
				.doc(userToFollowUID)
				.get();
			await database
				.collection('users')
				.doc(userToFollowUID)
				.set(
					{
						followers: userToFollowQuery
							.data()
							.followers.filter((follower) => follower !== userUID),
					},
					{ merge: true }
				);
		}
	};

	const unfriendUser = async (userUID, friendId, history) => {
		if (userUID === null || userUID === undefined) {
			history.push({
				pathname: '/' + process.env.REACT_APP_BASE_URL + '/user/sign_in',
				state: { error: 'User not logged in' },
			});
		} else {
			const userQuery = await database.collection('users').doc(userUID).get();
			const friendQuery = await database
				.collection('users')
				.doc(friendId)
				.get();
			await database
				.collection('users')
				.doc(userUID)
				.set(
					{
						friends: userQuery
							.data()
							.friends.filter((friend) => friend !== friendId),
					},
					{ merge: true }
				);
			await database
				.collection('users')
				.doc(friendId)
				.set(
					{
						friends: friendQuery
							.data()
							.friends.filter((friend) => friend !== userUID),
					},
					{ merge: true }
				);
		}
	};

	const deleteUpdate = async (updateId) => {
		await database.collection('userBooksUpdates').doc(updateId).delete();
	};

	const getInfoForCompareBooksPage = async (userUID, otherUserUID, history) => {
		const getUserInfoForCompareBooksPage = async (user) => {
			return await Promise.all(
				(
					await database
						.collection('userBooksInstances')
						.where('userId', '==', user)
						.get()
				).docs.map(async (bookInstanceDoc) => {
					const bookQuery = await database
						.collection('books')
						.doc(bookInstanceDoc.data().bookId)
						.get();
					const rootBookQuery = await database
						.collection('rootBooks')
						.doc(bookQuery.data().rootBook)
						.get();
					const bookEditionIds = (
						await database
							.collection('books')
							.where('rootBook', '==', rootBookQuery.id)
							.get()
					).docs.map((doc) => doc.id);
					const authorQuery = await database
						.collection('authors')
						.doc(rootBookQuery.data().authorId)
						.get();
					const allUserInstancesOfBook = await database
						.collection('userBooksInstances')
						.where('bookId', 'in', bookEditionIds)
						.get();
					const allUserInstancesOfBookWithRating = allUserInstancesOfBook.docs.filter(
						(doc) => doc.data().rating !== undefined && doc.data().rating !== 0
					);
					const shelvesQuery = await database
						.collection('shelves')
						.where('rootBooks', 'array-contains', rootBookQuery.id)
						.where('user', '==', user)
						.get();
					const reviewQuery = await database
						.collection('reviews')
						.where('bookEdition', '==', bookQuery.id)
						.where('user', '==', user)
						.get();
					return {
						id: bookInstanceDoc.data().bookId,
						rootId: bookQuery.data().rootBook,
						title: bookQuery.data().title,
						cover: bookQuery.data().cover,
						status: bookInstanceDoc.data().status,
						rating: bookInstanceDoc.data().rating,
						popularityScore:
							100 -
							(allUserInstancesOfBook.docs.length /
								(await database.collection('userBooksInstances').get()).docs
									.length) *
								100,
						averageRating: allUserInstancesOfBookWithRating.reduce(
							(previous, current) => {
								if (
									current.data().rating === undefined ||
									current.data().rating === 0
								) {
									return previous;
								}
								return (
									previous +
									current.data().rating /
										allUserInstancesOfBookWithRating.length
								);
							},
							0
						),
						authorId: rootBookQuery.data().authorId,
						authorName: authorQuery.data().name,
						bookshelves: shelvesQuery.docs.map((shelfDoc) =>
							shelfDoc.data().genre !== null &&
							shelfDoc.data().genre !== undefined
								? shelfDoc.data().genre
								: shelfDoc.data().name
						),
						review:
							reviewQuery.docs.length > 0
								? reviewQuery.docs[0].data().text
								: undefined,
					};
				})
			);
		};

		if (userUID === null || userUID === undefined) {
			history.push({
				pathname: '/' + process.env.REACT_APP_BASE_URL + '/user/sign_in',
				state: { error: 'User not logged in' },
			});
		} else {
			const otherUserQuery = await database
				.collection('users')
				.doc(otherUserUID)
				.get();

			return {
				otherUserFirstName: otherUserQuery.data().firstName,
				otherUserLastName:
					otherUserQuery.data().showLastNameTo === 'anyone' ||
					(otherUserQuery.data().showLastNameTo === 'friends' &&
						otherUserQuery.data().friends.includes(userUID))
						? otherUserQuery.data().lastName
						: undefined,
				otherUserPronouns:
					otherUserQuery.data().pronouns === 'male'
						? 'his'
						: otherUserQuery.data().pronouns === 'female'
						? 'her'
						: 'their',
				loggedInUserBooks: await getUserInfoForCompareBooksPage(userUID),
				otherUserBooks: await getUserInfoForCompareBooksPage(otherUserUID),
			};
		}
	};

	const getBooksInfoForBookCompatibilityTestPage = async (
		popularBooksRootIds,
		classicsBooksRootIds,
		popularFictionBooksRootIds,
		thrillersBooksRootIds,
		nonFictionBooksRootIds,
		fantasyBooksRootIds,
		romanceBooksRootIds,
		scienceFictionBooksRootIds,
		womensFictionBooksRootIds
	) => {
		const getBooksInfoForCategory = async (rootIds) => {
			return await Promise.all(
				rootIds.map(async (rootId) => {
					const rootBookQuery = await database
						.collection('rootBooks')
						.doc(rootId)
						.get();
					const authorQuery = await database
						.collection('authors')
						.doc(rootBookQuery.data().authorId)
						.get();
					const bookQuery = await database
						.collection('books')
						.where('rootBook', '==', rootId)
						.where('mainEdition', '==', true)
						.get();
					return {
						id: bookQuery.docs[0].id,
						title: bookQuery.docs[0].data().title,
						cover: bookQuery.docs[0].data().cover,
						authorId: rootBookQuery.data().authorId,
						authorName: authorQuery.data().name,
					};
				})
			);
		};

		return {
			popularBooks: await getBooksInfoForCategory(popularBooksRootIds),
			classicsBooks: await getBooksInfoForCategory(classicsBooksRootIds),
			popularFictionBooks: await getBooksInfoForCategory(
				popularFictionBooksRootIds
			),
			thrillersBooks: await getBooksInfoForCategory(thrillersBooksRootIds),
			nonFictionBooks: await getBooksInfoForCategory(nonFictionBooksRootIds),
			fantasyBooks: await getBooksInfoForCategory(fantasyBooksRootIds),
			romanceBooks: await getBooksInfoForCategory(romanceBooksRootIds),
			scienceFictionBooks: await getBooksInfoForCategory(
				scienceFictionBooksRootIds
			),
			womensFictionBooks: await getBooksInfoForCategory(
				womensFictionBooksRootIds
			),
		};
	};

	const getUsersInfoForCompatibilityTestPage = async (
		popularBooksRootIds,
		classicsBooksRootIds,
		popularFictionBooksRootIds,
		thrillersBooksRootIds,
		nonFictionBooksRootIds,
		fantasyBooksRootIds,
		romanceBooksRootIds,
		scienceFictionBooksRootIds,
		womensFictionBooksRootIds,
		userUID,
		otherUserUID,
		history
	) => {
		if (userUID === null || userUID === undefined) {
			history.push({
				pathname: '/' + process.env.REACT_APP_BASE_URL + '/user/sign_in',
				state: { error: 'User not logged in' },
			});
		} else {
			const getUserBooksInCategory = async (rootIdsArray, allUserBookDocs) => {
				return (
					await Promise.all(
						allUserBookDocs.map(async (doc) => {
							const bookQuery = await database
								.collection('books')
								.doc(doc.data().bookId)
								.get();
							return rootIdsArray.includes(bookQuery.data().rootBook)
								? {
										rootId: bookQuery.data().rootBook,
										status: doc.data().status,
										rating: doc.data().rating,
								  }
								: null;
						})
					)
				).filter((obj) => obj !== null);
			};

			const loggedInUserQuery = await database
				.collection('users')
				.doc(userUID)
				.get();
			const otherUserQuery = await database
				.collection('users')
				.doc(otherUserUID)
				.get();

			const loggedInUserAllBooks = (
				await database
					.collection('userBooksInstances')
					.where('userId', '==', userUID)
					.get()
			).docs;
			const otherUserAllBooks = (
				await database
					.collection('userBooksInstances')
					.where('userId', '==', otherUserUID)
					.get()
			).docs;

			return {
				loggedInUser: {
					profilePicture: loggedInUserQuery.data().profileImage,
					friends: await Promise.all(
						loggedInUserQuery.data().friends.map(async (friendId) => {
							return {
								id: friendId,
								name: (
									await database.collection('users').doc(friendId).get()
								).data().firstName,
							};
						})
					),
					popularBooks: await getUserBooksInCategory(
						popularBooksRootIds,
						loggedInUserAllBooks
					),
					classicsBooks: await getUserBooksInCategory(
						classicsBooksRootIds,
						loggedInUserAllBooks
					),
					popularFictionBooks: await getUserBooksInCategory(
						popularFictionBooksRootIds,
						loggedInUserAllBooks
					),
					thrillersBooks: await getUserBooksInCategory(
						thrillersBooksRootIds,
						loggedInUserAllBooks
					),
					nonFictionBooks: await getUserBooksInCategory(
						nonFictionBooksRootIds,
						loggedInUserAllBooks
					),
					fantasyBooks: await getUserBooksInCategory(
						fantasyBooksRootIds,
						loggedInUserAllBooks
					),
					romanceBooks: await getUserBooksInCategory(
						romanceBooksRootIds,
						loggedInUserAllBooks
					),
					scienceFictionBooks: await getUserBooksInCategory(
						scienceFictionBooksRootIds,
						loggedInUserAllBooks
					),
					womensFictionBooks: await getUserBooksInCategory(
						womensFictionBooksRootIds,
						loggedInUserAllBooks
					),
				},
				otherUser: {
					profilePicture: otherUserQuery.data().profileImage,
					popularBooks: await getUserBooksInCategory(
						popularBooksRootIds,
						otherUserAllBooks
					),
					classicsBooks: await getUserBooksInCategory(
						classicsBooksRootIds,
						otherUserAllBooks
					),
					popularFictionBooks: await getUserBooksInCategory(
						popularFictionBooksRootIds,
						otherUserAllBooks
					),
					thrillersBooks: await getUserBooksInCategory(
						thrillersBooksRootIds,
						otherUserAllBooks
					),
					nonFictionBooks: await getUserBooksInCategory(
						nonFictionBooksRootIds,
						otherUserAllBooks
					),
					fantasyBooks: await getUserBooksInCategory(
						fantasyBooksRootIds,
						otherUserAllBooks
					),
					romanceBooks: await getUserBooksInCategory(
						romanceBooksRootIds,
						otherUserAllBooks
					),
					scienceFictionBooks: await getUserBooksInCategory(
						scienceFictionBooksRootIds,
						otherUserAllBooks
					),
					womensFictionBooks: await getUserBooksInCategory(
						womensFictionBooksRootIds,
						otherUserAllBooks
					),
				},
			};
		}
	};

	const sendFriendRequest = async (senderId, receiverId, message) => {
		const receiverQuery = await database
			.collection('users')
			.doc(receiverId)
			.get();
		await database
			.collection('users')
			.doc(receiverId)
			.set(
				{
					newFriendsRequests: receiverQuery.data().newFriendsRequests.concat({
						id: senderId,
						message,
					}),
				},
				{ merge: true }
			);
	};

	const getUserInfoForAddAsFriendPage = async (
		userUID,
		newFriendId,
		history
	) => {
		const newFriendQuery = await database
			.collection('users')
			.doc(newFriendId)
			.get();
		if (
			newFriendQuery
				.data()
				.newFriendsRequests.some((request) => request.id === userUID)
		) {
			history.push({
				pathname: pageGenerator.generateUserPage(
					newFriendId,
					newFriendQuery.data().firstName
				),
				state: 'You have already sent a friend request to this person.',
			});
		} else {
			return {
				firstName: newFriendQuery.data().firstName,
				pronouns:
					newFriendQuery.data().pronouns === 'male'
						? 'his'
						: newFriendQuery.data().pronouns === 'female'
						? 'her'
						: 'their',
			};
		}

		return null;
	};

	const addNewBookshelf = async (userId, shelfName) => {
		const homonymousShelvesDocs = (
			await database
				.collection('shelves')
				.where('user', '==', userId)
				.where('name', '==', shelfName)
				.get()
		).docs;
		if (homonymousShelvesDocs.length === 0) {
			await database
				.collection('shelves')
				.add({ user: userId, name: shelfName, rootBooks: [] });
		}
	};

	const queryUserInfoForUserBookshelfPage = async (
		userUID,
		loggedInUserUID
	) => {
		const userQuery = await database.collection('users').doc(userUID).get();
		const shelvesQuery = await database
			.collection('shelves')
			.where('user', '==', userUID)
			.get();
		const allUserBooksInstances = await database
			.collection('userBooksInstances')
			.where('userId', '==', userUID)
			.get();
		const allUserRootBooks = await Promise.all(
			allUserBooksInstances.docs.map(
				async (doc) =>
					(
						await database.collection('books').doc(doc.data().bookId).get()
					).data().rootBook
			)
		);
		const wantToReadUserRootBooks = await Promise.all(
			allUserBooksInstances.docs
				.filter((doc) => doc.data().status === 'to-read')
				.map(
					async (doc) =>
						(
							await database.collection('books').doc(doc.data().bookId).get()
						).data().rootBook
				)
		);
		const readingUserRootBooks = await Promise.all(
			allUserBooksInstances.docs
				.filter((doc) => doc.data().status === 'reading')
				.map(
					async (doc) =>
						(
							await database.collection('books').doc(doc.data().bookId).get()
						).data().rootBook
				)
		);
		const readUserRootBooks = await Promise.all(
			allUserBooksInstances.docs
				.filter((doc) => doc.data().status === 'read')
				.map(
					async (doc) =>
						(
							await database.collection('books').doc(doc.data().bookId).get()
						).data().rootBook
				)
		);

		const getShelfBookInfo = async (rootBook) => {
			const rootBookQuery = await database
				.collection('rootBooks')
				.doc(rootBook)
				.get();
			const seriesName =
				rootBookQuery.data().series !== undefined
					? (
							await database
								.collection('series')
								.doc(rootBookQuery.data().series)
								.get()
					  ).data().name
					: undefined;
			const authorQuery =
				rootBookQuery !== null && rootBookQuery !== undefined
					? await database
							.collection('authors')
							.doc(rootBookQuery.data().authorId)
							.get()
					: undefined;
			const allEditionIds = (
				await database
					.collection('books')
					.where('rootBook', '==', rootBook)
					.get()
			).docs.map((doc) => doc.id);
			const userInstancesQuery = await database
				.collection('userBooksInstances')
				.where('bookId', 'in', allEditionIds)
				.where('userId', '==', userUID)
				.get();
			const editionQuery = await database
				.collection('books')
				.doc(userInstancesQuery.docs[0].data().bookId)
				.get();
			const allRatedBookInstances = (
				await database
					.collection('userBooksInstances')
					.where('bookId', 'in', allEditionIds)
					.get()
			).docs.filter(
				(doc) => doc.data().rating !== undefined && doc.data().rating !== 0
			);
			const averageBookRating = allRatedBookInstances.reduce(
				(previous, current) =>
					previous + current.data().rating / allRatedBookInstances.length,
				0
			);
			const userBookUpdates = await database
				.collection('userBooksUpdates')
				.where('user', '==', userUID)
				.where('book', 'in', allEditionIds)
				.get();
			const dateRead =
				userBookUpdates.docs.filter(
					(doc) =>
						doc.data().action === 'add-book' && doc.data().shelf === 'read'
				).length === 0
					? undefined
					: userBookUpdates.docs
							.filter(
								(doc) =>
									doc.data().action === 'add-book' &&
									doc.data().shelf === 'read'
							)[0]
							.data()
							.date.toDate();
			const reviewQuery = await database
				.collection('reviews')
				.where('bookEdition', 'in', allEditionIds)
				.where('user', '==', userUID)
				.get();
			const loggedInUserInstanceQuery =
				loggedInUserUID !== undefined && loggedInUserUID !== null
					? await database
							.collection('userBooksInstances')
							.where('bookId', 'in', allEditionIds)
							.where('userId', '==', loggedInUserUID)
							.get()
					: undefined;

			return {
				id: userInstancesQuery.docs[0].data().bookId,
				rootId: rootBook,
				cover: editionQuery.data().cover,
				title: editionQuery.data().title,
				seriesName,
				seriesInstance: rootBookQuery.data().seriesInstance,
				authorId: rootBookQuery.data().authorId,
				authorName: authorQuery.data().name,
				averageRating: averageBookRating,
				dateAdded:
					userBookUpdates.docs.length === 0
						? undefined
						: userBookUpdates.docs
								.sort(
									(a, b) => a.data().date.toDate() - b.data().date.toDate()
								)[0]
								.data()
								.date.toDate(),
				datePublished: (
					await database
						.collection('books')
						.where('rootBook', '==', rootBook)
						.get()
				).docs
					.sort(
						(a, b) =>
							a.data().publishedDate.toDate() - b.data().publishedDate.toDate()
					)[0]
					.data()
					.publishedDate.toDate(),
				datePublishedEdtion: editionQuery.data().publishedDate.toDate(),
				dateRead,
				dateStarted:
					userBookUpdates.docs.filter(
						(doc) =>
							doc.data().action === 'add-book' && doc.data().shelf === 'reading'
					).length === 0
						? dateRead
						: userBookUpdates.docs
								.filter(
									(doc) =>
										doc.data().action === 'add-book' &&
										doc.data().shelf === 'reading'
								)[0]
								.data()
								.date.toDate(),
				format: editionQuery.data().format,
				isbn: editionQuery.data().ISBN,
				numberOfPages: editionQuery.data().pageCount,
				numberOfRatings: allRatedBookInstances.length,
				position: userInstancesQuery.docs[0].data().position,
				rating: userInstancesQuery.docs[0].data().rating,
				review:
					reviewQuery.docs.length > 0
						? reviewQuery.docs[0].data().text
						: undefined,
				loggedInUserRating:
					loggedInUserInstanceQuery === undefined ||
					loggedInUserInstanceQuery.docs.length === 0
						? undefined
						: loggedInUserInstanceQuery.docs[0].data().rating,
			};
		};

		return {
			profilePicture: userQuery.data().profileImage,
			shelves: await Promise.all(
				shelvesQuery.docs
					.map((doc) => doc.data())
					.concat([
						{ name: 'all', rootBooks: allUserRootBooks },
						{ name: 'read', rootBooks: readUserRootBooks },
						{ name: 'want-to-read', rootBooks: wantToReadUserRootBooks },
						{ name: 'currently-reading', rootBooks: readingUserRootBooks },
					])
					.map(async (data) => {
						return {
							name:
								data.genre !== null && data.genre !== undefined
									? data.genre
									: data.name,
							books: await Promise.all(data.rootBooks.map(getShelfBookInfo)),
						};
					})
			),
		};
	};

	const queryLoggedInUserInfoForUserBookshelfPage = async (userUID) => {
		if (userUID === undefined || userUID === null) {
			return [];
		}
		const shelvesQuery = await database
			.collection('shelves')
			.where('user', '==', userUID)
			.get();
		const allUserBooksInstances = await database
			.collection('userBooksInstances')
			.where('userId', '==', userUID)
			.get();
		const allUserRootBooks = await Promise.all(
			allUserBooksInstances.docs.map(
				async (doc) =>
					(
						await database.collection('books').doc(doc.data().bookId).get()
					).data().rootBook
			)
		);
		const wantToReadUserRootBooks = await Promise.all(
			allUserBooksInstances.docs
				.filter((doc) => doc.data().status === 'to-read')
				.map(
					async (doc) =>
						(
							await database.collection('books').doc(doc.data().bookId).get()
						).data().rootBook
				)
		);
		const readingUserRootBooks = await Promise.all(
			allUserBooksInstances.docs
				.filter((doc) => doc.data().status === 'reading')
				.map(
					async (doc) =>
						(
							await database.collection('books').doc(doc.data().bookId).get()
						).data().rootBook
				)
		);
		const readUserRootBooks = await Promise.all(
			allUserBooksInstances.docs
				.filter((doc) => doc.data().status === 'read')
				.map(
					async (doc) =>
						(
							await database.collection('books').doc(doc.data().bookId).get()
						).data().rootBook
				)
		);

		const getShelfBookInfo = async (rootBook) => {
			const allEditionIds = (
				await database
					.collection('books')
					.where('rootBook', '==', rootBook)
					.get()
			).docs.map((doc) => doc.id);
			const userInstancesQuery = await database
				.collection('userBooksInstances')
				.where('bookId', 'in', allEditionIds)
				.where('userId', '==', userUID)
				.get();
			return {
				id: userInstancesQuery.docs[0].data().bookId,
				rootId: rootBook,
			};
		};

		return await Promise.all(
			shelvesQuery.docs
				.map((doc) => doc.data())
				.concat([
					{ name: 'all', rootBooks: allUserRootBooks },
					{ name: 'read', rootBooks: readUserRootBooks },
					{ name: 'want-to-read', rootBooks: wantToReadUserRootBooks },
					{ name: 'currently-reading', rootBooks: readingUserRootBooks },
				])
				.map(async (data) => {
					return {
						name:
							data.genre !== null && data.genre !== undefined
								? data.genre
								: data.name,
						books: await Promise.all(data.rootBooks.map(getShelfBookInfo)),
					};
				})
		);
	};

	const getUserInfoForYearInBooksPage = async (userUID, year) => {
		const loggedInUserAllBooks = (
			await database
				.collection('userBooksInstances')
				.where('userId', '==', userUID)
				.where('status', '==', 'read')
				.get()
		).docs;

		const userUpdatesQuery = (
			await database
				.collection('userBooksUpdates')
				.where('user', '==', userUID)
				.where('action', '==', 'add-book')
				.where('shelf', '==', 'read')
				.get()
		).docs.filter(
			(doc) =>
				doc.data().date >
					firebase.firestore.Timestamp.fromDate(
						startOfYear(new Date(year, 0))
					) &&
				doc.data().date <
					firebase.firestore.Timestamp.fromDate(endOfYear(new Date(year, 0)))
		);

		const loggedInUserYearBooks = loggedInUserAllBooks.filter((doc) =>
			userUpdatesQuery
				.map((updateDoc) => updateDoc.data().book)
				.includes(doc.data().bookId)
		);

		return Promise.all(
			loggedInUserYearBooks.map(async (doc) => {
				const bookId = doc.data().bookId;
				const bookQuery = await database.collection('books').doc(bookId).get();
				const pageCount = bookQuery.data().pageCount;
				const cover = bookQuery.data().cover;
				const title = bookQuery.data().title;
				const shelvedQuery = await database
					.collection('userBooksInstances')
					.where('bookId', '==', bookId)
					.get();
				const numberShelved = shelvedQuery.docs.length;
				const ratingsQuery = await database
					.collection('userBooksInstances')
					.where('bookId', '==', bookId)
					.where('rating', '>', 0)
					.get();
				const numberOfRatings = ratingsQuery.docs.length;
				const ratings = ratingsQuery.docs.map((doc) => doc.data().rating);
				const averageRating =
					ratingsQuery.docs.lengh === 0
						? 0
						: ratings.reduce(
								(previous, current) => previous + current / numberOfRatings,
								0
						  );
				const userRating = doc.data().rating;

				return {
					bookId,
					title,
					pageCount,
					cover,
					numberShelved,
					numberOfRatings,
					averageRating,
					userRating,
				};
			})
		);
	};

	const getUserProfilePicture = async (userUID) => {
		return (await database.collection('users').doc(userUID).get()).data()
			.profileImage;
	};

	const getRecommendationsToFromUser = async (userUID, isReceiver) => {
		const recommendationsQuery = (
			await database
				.collection('recommendations')
				.where(isReceiver ? 'receiver' : 'sender', '==', userUID)
				.get()
		).docs;
		return await Promise.all(
			recommendationsQuery.map(async (doc) => {
				const id = doc.id;
				const message = doc.data().message;
				const bookId = doc.data().bookId;
				const bookQuery = await database.collection('books').doc(bookId).get();
				const rootBookQuery = await database
					.collection('rootBooks')
					.doc(bookQuery.data().rootBook)
					.get();
				const authorQuery = await database
					.collection('authors')
					.doc(rootBookQuery.data().authorId)
					.get();
				const userInstanceQuery = (
					await database
						.collection('userBooksInstances')
						.where('bookId', '==', bookId)
						.where('userId', '==', userUID)
						.get()
				).docs;
				const book = {
					bookId,
					title: bookQuery.data().title,
					cover: bookQuery.data().cover,
					authorId: authorQuery.id,
					authorName: authorQuery.data().name,
					userStatus:
						userInstanceQuery.length > 0
							? userInstanceQuery[0].data().status
							: undefined,
					userRating:
						userInstanceQuery.length > 0
							? userInstanceQuery[0].data().rating
							: undefined,
					userProgress:
						userInstanceQuery.length > 0
							? userInstanceQuery[0].data().progress
							: undefined,
					toReadBookPosition:
						userInstanceQuery.length > 0
							? userInstanceQuery[0].data().position
							: undefined,
					pageCount: bookQuery.data().pageCount,
				};
				const otherUserId = isReceiver
					? doc.data().sender
					: doc.data().receiver;
				const otherUser = {
					userId: otherUserId,
					firstName: (
						await database.collection('users').doc(otherUserId).get()
					).data().firstName,
				};

				return {
					id,
					message,
					book,
					otherUser,
				};
			})
		);
	};

	const deleteRecommendation = async (recommendationId) => {
		await database.collection('recommendations').doc(recommendationId).delete();
	};

	const getInfoForFollowPage = async (userId, loggedInUserId, scope) => {
		const users =
			scope === 'followers'
				? (await database.collection('users').doc(userId).get()).data()
						.followers
				: scope === 'friends'
				? (await database.collection('users').doc(userId).get()).data().friends
				: (
						await database
							.collection('users')
							.where('followers', 'array-contains', userId)
							.get()
				  ).docs.map((doc) => doc.id);

		return await Promise.all(
			users.map(async (user) => {
				const userQuery = await database.collection('users').doc(user).get();
				const userBooksInstancesQuery = await database
					.collection('userBooksInstances')
					.where('userId', '==', user)
					.get();
				const currentlyReadingBooks = userBooksInstancesQuery.docs.filter(
					(doc) => doc.data().status === 'reading'
				);

				return {
					id: user,
					name:
						userQuery.data().lastName === undefined
							? userQuery.data().firstName
							: userQuery.data().firstName + ' ' + userQuery.data().lastName,
					numberOfBooks: userBooksInstancesQuery.docs.length,
					numberOfFriends:
						userQuery.data().friends === undefined
							? 0
							: userQuery.data().friends.length,
					location:
						userQuery.data().country === undefined
							? ''
							: userQuery.data().country,
					profilePicture: userQuery.data().profileImage,
					currentlyReadingBook:
						currentlyReadingBooks.length === 0
							? undefined
							: {
									id: currentlyReadingBooks[0].data().bookId,
									title: (
										await database
											.collection('books')
											.doc(currentlyReadingBooks[0].data().bookId)
											.get()
									).data().title,
									cover: (
										await database
											.collection('books')
											.doc(currentlyReadingBooks[0].data().bookId)
											.get()
									).data().cover,
							  },
					isFriend: userQuery.data().friends.includes(loggedInUserId),
				};
			})
		);
	};

	const getInfoForExplorePage = async (userId) => {
		const getBookInfo = async (bookId) => {
			const bookQuery = await database.collection('books').doc(bookId).get();
			const rootBookQuery = await database
				.collection('rootBooks')
				.doc(bookQuery.data().rootBook)
				.get();
			const authorQuery = await database
				.collection('authors')
				.doc(rootBookQuery.data().authorId)
				.get();
			const userInstanceQuery = (
				await database
					.collection('userBooksInstances')
					.where('bookId', '==', bookId)
					.where('rating', '>', 0)
					.get()
			).docs;

			return {
				title: bookQuery.data().title,
				id: bookId,
				cover: bookQuery.data().cover,
				authorName: authorQuery.data().name,
				rating:
					userInstanceQuery.length === 0
						? 0
						: userInstanceQuery.reduce(
								(previous, current) =>
									previous + current / userInstanceQuery.length,
								0
						  ),
				numberOfRatings: userInstanceQuery.length,
			};
		};

		const getSimilarBooks = async (bookId) => {
			const similarBooks = (
				await database.collection('books').doc(bookId).get()
			).data().similarBooks;
			if (similarBooks === undefined) {
				return [];
			}
			return await Promise.all(
				similarBooks.map(async (book) => {
					return await getBookInfo(book);
				})
			);
		};

		const articleQuery = (
			await database
				.collection('articles')
				.orderBy('datePublished', 'desc')
				.limit(15)
				.get()
		).docs;
		const enjoyedBooks = (
			await database
				.collection('userBooksInstances')
				.where('userId', '==', userId)
				.where('rating', '>=', 3)
				.get()
		).docs;
		const enjoyedBookId =
			enjoyedBooks.length === 0
				? undefined
				: enjoyedBooks[
						Math.round(Math.random() * (enjoyedBooks.length - 1))
				  ].data().bookId;
		const readingBooks = (
			await database
				.collection('userBooksInstances')
				.where('userId', '==', userId)
				.where('status', '==', 'reading')
				.get()
		).docs;
		const readingBookId =
			readingBooks.length === 0
				? undefined
				: readingBooks[
						Math.round(Math.random() * (readingBooks.length - 1))
				  ].data().bookId;
		const allUserUpdates = (
			await database
				.collection('userBooksUpdates')
				.orderBy('date', 'desc')
				.limit(1000)
				.get()
		).docs;
		const trendingBooks = allUserUpdates
			.reduce(
				(previous, current) =>
					previous.map((obj) => obj.id === current.data().book).length === 0
						? previous.concat({ id: current.data().book, count: 0 })
						: previous.map((obj) =>
								obj.id === current.data().book
									? { ...obj, count: obj.count + 1 }
									: obj
						  ),
				[]
			)
			.sort((a, b) => (a.count > b.count ? -1 : 1))
			.slice(0, 25)
			.map((obj) => obj.id);

		return {
			articles: articleQuery.map((doc) => {
				return {
					id: doc.id,
					datePublished: doc.data().datePublished,
					numberOfLikes:
						doc.data().usersWhoLiked !== undefined
							? doc.data().usersWhoLiked.length
							: 0,
					numberOfComments:
						doc.data().comments !== undefined ? doc.data().comments.length : 0,
					title: doc.data().title,
					image: doc.data().image,
				};
			}),
			enjoyedBook:
				enjoyedBookId === undefined
					? undefined
					: {
							id: enjoyedBookId,
							title: (
								await database.collection('books').doc(enjoyedBookId).get()
							).data().title,
							similarBooks: await getSimilarBooks(enjoyedBookId),
					  },
			readingBook:
				readingBookId === undefined
					? undefined
					: {
							id: readingBookId,
							title: (
								await database.collection('books').doc(readingBookId).get()
							).data().title,
							similarBooks: await getSimilarBooks(readingBookId),
					  },
			trendingBooks: await Promise.all(
				trendingBooks.map(async (bookId) => await getBookInfo(bookId))
			),
		};
	};

	const getInfoForSearchPage = async (userId, q, searchType, searchField) => {
		const query = q.toLowerCase();
		if (searchField === 'genre') {
			const allGenres = (await database.collection('genres').get()).docs;
			return allGenres
				.filter((genre) => genre.data().name.toLowerCase().includes(query))
				.map((genre) => {
					return {
						name: genre.data().name,
						parentGenre: genre.data().parentGenre,
					};
				});
		} else if (searchType === 'books') {
			const allBooks = await Promise.all(
				(await database.collection('books').get()).docs.map(async (doc) => {
					const rootBookQuery = await database
						.collection('rootBooks')
						.doc(doc.data().rootBook)
						.get();
					const authorQuery = await database
						.collection('authors')
						.doc(rootBookQuery.data().authorId)
						.get();
					return {
						id: doc.id,
						rootBookId: rootBookQuery.id,
						amazonLink: doc.data().amazonLink,
						title: doc.data().title,
						cover: doc.data().cover,
						authorId: authorQuery.id,
						authorName: authorQuery.data().name,
						authorIsMember: authorQuery.data().GRMember,
						publishedYear: doc.data().publishedDate.toDate().getFullYear(),
						pageCount: doc.data().pageCount,
					};
				})
			);

			const filteredBooks = allBooks.filter((book) =>
				searchField === 'all'
					? book.title.toLowerCase().includes(query) ||
					  book.authorName.toLowerCase().includes(query)
					: searchField === 'author'
					? book.authorName.toLowerCase().includes(query)
					: book.title.toLowerCase().includes(query)
			);
			return await Promise.all(
				filteredBooks.map(async (book) => {
					const userInstanceQuery = (
						await database
							.collection('userBooksInstances')
							.where('bookId', '==', book.id)
							.where('rating', '>', 0)
							.get()
					).docs;
					const userBookQuery =
						userId !== undefined
							? (
									await database
										.collection('userBooksInstances')
										.where('bookId', '==', book.id)
										.where('userId', '==', userId)
										.get()
							  ).docs
							: undefined;
					const editionsQuery = (
						await database
							.collection('books')
							.where('rootBook', '==', book.rootBookId)
							.get()
					).docs;

					return {
						id: book.id,
						amazonLink: book.amazonLink,
						title: book.title,
						cover: book.cover,
						authorId: book.authorId,
						authorName: book.authorName,
						authorIsMember: book.authorIsMember,
						averageRating:
							userInstanceQuery.length > 0
								? userInstanceQuery.reduce(
										(previous, current) =>
											previous +
											current.data().rating / userInstanceQuery.docs.length,
										0
								  )
								: 0,
						numberOfRatings:
							userInstanceQuery === undefined ? 0 : userInstanceQuery.length,
						publishedYear: book.publishedYear,
						numberOfEditions: editionsQuery.length,
						userStatus:
							userBookQuery === undefined || userBookQuery.length === 0
								? undefined
								: userBookQuery[0].data().status,
						userRating:
							userBookQuery === undefined || userBookQuery.length === 0
								? undefined
								: userBookQuery[0].data().rating,
						userProgress:
							userBookQuery === undefined || userBookQuery.length === 0
								? undefined
								: userBookQuery[0].data().progress,
						toReadBookPosition:
							userBookQuery === undefined || userBookQuery.length === 0
								? undefined
								: userBookQuery[0].data().position,
						pageCount: book.pageCount,
						genreShelves: await Promise.all(
							(
								await database
									.collection('shelves')
									.where('genre', '!=', null)
									.where('rootBooks', 'array-contains', book.rootBookId)
									.get()
							).docs.map(async (doc) => {
								return {
									name: doc.data().genre,
									parentGenre: (
										await database
											.collection('genres')
											.doc(doc.data().genre)
											.get()
									).data().parentGenre,
								};
							})
						),
					};
				})
			);
		} else {
			const allPeople = (await database.collection('users').get()).docs;
			const filteredPeople = allPeople.filter((doc) =>
				(
					doc.data().firstName +
					(doc.data().lastName !== undefined ? ' ' + doc.data().lastName : '')
				)
					.toLowerCase()
					.includes(query)
			);

			return await Promise.all(
				filteredPeople.map(async (person) => {
					return {
						id: person.id,
						name:
							person.data().lastName !== undefined
								? person.data().firstName + ' ' + person.data().lastName
								: person.data().firstName,
						profilePicture: person.data().profileImage,
						location:
							person.data().country === undefined ? '' : person.data().country,
						numberOfFriends: person.data().friends.length,
						numberOfBooks: (
							await database
								.collection('userBooksInstances')
								.where('userId', '==', person.id)
								.get()
						).docs.length,
					};
				})
			);
		}
	};

	return {
		pageGenerator,
		getAlsoEnjoyedBooksDetailsForBook,
		queryBookById,
		getEditionDetailsForBook,
		queryBooks,
		queryBooksForBookCreation,
		getFriendsInfo,
		queryBookRecommendedToFriendsStatus,
		queryStatusUpdatesForRootBook,
		queryStatusUpdatesForBook,
		signOut,
		resetPassword,
		passwordSignIn,
		facebookSignIn,
		twitterSignIn,
		googleSignIn,
		queryBookInstanceDetails,
		signUp,
		modifyUserInfo,
		addBookToShelf,
		removeBookFromShelf,
		rateBook,
		updateBookInShelf,
		changeBookPosition,
		addNewUserShelf,
		addBookToUserShelf,
		removeBookFromUserShelf,
		likeUnlikeReview,
		followUnfollowAuthor,
		recommendBook,
		switchBookEditionForUser,
		getBookPhotos,
		getPhotoDetails,
		getSynopsisAndPreSynopsisForBook,
		createNewBook,
		getBookInfoForTopShelvesPage,
		getBookInfoForGenreShelfPage,
		getBookInfoForTriviaPage,
		likeQuote,
		getBookInfoForQuotesPage,
		getBookInfoForListsPage,
		addRemoveAuthorToFavorites,
		getAuthorInfoForAuthorPage,
		changeFavoriteAuthors,
		fetchUserFavoriteAuthors,
		getUserInfoForFavoriteAuthorsForUserPage,
		getNotificationsForUser,
		saveUserSettings,
		deleteProfilePicture,
		getUserSettings,
		checkIfPasswordsMatch,
		changePassword,
		deleteAccount,
		getFavoriteGenresForUser,
		updateFavoriteGenresForUser,
		getGenreInfo,
		getNews,
		likeUnlikeArticle,
		getInfoForArticle,
		getArticleTitle,
		getUsersWhoLikedArticle,
		getUserInfoForUserPage,
		followUser,
		unfollowUser,
		unfriendUser,
		deleteUpdate,
		getInfoForCompareBooksPage,
		getBooksInfoForBookCompatibilityTestPage,
		getUsersInfoForCompatibilityTestPage,
		sendFriendRequest,
		getUserInfoForAddAsFriendPage,
		addNewBookshelf,
		queryUserInfoForUserBookshelfPage,
		queryLoggedInUserInfoForUserBookshelfPage,
		getUserInfoForYearInBooksPage,
		getUserProfilePicture,
		getRecommendationsToFromUser,
		deleteRecommendation,
		getInfoForFollowPage,
		getInfoForExplorePage,
		getInfoForSearchPage,
	};
})();

export default Firebase;
