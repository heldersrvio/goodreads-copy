import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import { differenceInDays } from 'date-fns';

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
		const generateBookPage = (bookId, title) => {
			return '/book/show/' + bookId + '.' + title.replace(/ /g, '_');
		};

		const generateAddBookPage = () => {
			return '/book/new';
		};

		const generateBookCoverPage = (bookId, title) => {
			return '/book/photo/' + bookId + '.' + title.replace(/ /g, '_');
		};

		const generateBookPhotoPage = (bookId, title, photoId) => {
			return (
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
				'/work/editions/' +
				originalBookId +
				'.' +
				originalBookTitle.replace(/ /g, '_')
			);
		};

		const generateBookListsPage = (bookId) => {
			return '/list/book' + bookId;
		};

		const generateSeriesPage = (seriesId, name) => {
			return `/series/${seriesId}-${name.toLowerCase().replace(/ /g, '-')}`;
		};

		const generateAuthorPage = (authorId, name) => {
			return '/author/show/' + authorId + '.' + name.replace(/ /g, '_');
		};

		const generateListopiaPage = () => {
			return '/list';
		};

		const generateCreateListPage = () => {
			return '/list/new';
		};

		const generateListsCreatedByUserPage = (userId, firstName) => {
			return '/list/created/' + userId + '-' + firstName.toLowerCase();
		};

		const generateListsVotedByUserPage = (userId, firstName) => {
			return '/list/user_votes/' + userId + '-' + firstName.toLowerCase();
		};

		const generateListsLikedByUserPage = (userId, firstName) => {
			return '/list/liked/' + userId + '-' + firstName.toLowerCase();
		};

		const generateListPage = (listId, title) => {
			return '/list/show/' + listId + '.' + title.replace(/ /g, '_');
		};

		const generateUserPage = (userId, firstName) => {
			return '/user/show/' + userId + '-' + firstName.toLowerCase();
		};

		const generateUserPhotoPage = (userId) => {
			return '/photo/user' + userId;
		};

		const generateUserBooksPage = (userId) => {
			return '/review/list/' + userId;
		};

		const generateUserRatingsPage = (userId) => {
			return '/review/list/' + userId + '?sort=rating&view=reviews';
		};

		const generateUserReviewsPage = (userId) => {
			return '/review/list/' + userId + '?sort=review&view=reviews';
		};

		const generateUserShelfPage = (userId, firstName, shelf) => {
			return (
				'/review/list/' +
				userId +
				'-' +
				firstName.toLowerCase() +
				'?shelf=' +
				shelf
			);
		};

		const generateBookGenreShelfPage = (bookId, title, genre) => {
			return (
				'/shelf/users/' +
				bookId +
				'.' +
				title.replace(/ /g, '_') +
				'?shelf=' +
				genre.toLowerCase().replace(/ /g, '-')
			);
		};

		const generateBookTopShelvesPage = (bookId) => {
			return '/work/shelves/' + bookId;
		};

		const generateBookStatsPage = (bookId) => {
			return '/book/stats?id=' + bookId;
		};
		const generateBookStatsPageForEdition = (bookId) => {
			return '/book/stats?id=' + bookId + '&just_this_edition=yep';
		};

		const generateReviewPage = (reviewId) => {
			return '/review/show/' + reviewId;
		};

		const generateReviewLikesPage = (reviewId) => {
			return '/rating/voters/' + reviewId + '?resource_type=Review';
		};

		const generateSimilarBooksPage = (bookId, title) => {
			return '/book/similar/' + bookId + '.' + title.replace(/ /g, '_');
		};

		const generateGenrePage = (genre) => {
			return '/genres/' + genre.toLowerCase().replace(/ /g, '-');
		};

		const generateBooksByAuthorPage = (authorId, name) => {
			return '/author/list/' + authorId + '.' + name.replace(/ /g, '_');
		};

		const generateArticlePage = (articleId, title) => {
			return (
				'/blog/show/' + articleId + '-' + title.toLowerCase().replace(/ /g, '-')
			);
		};

		const generateBookTriviaPage = (bookId, title) => {
			return '/trivia/work/' + bookId + '.' + title.replace(/ /g, '_');
		};

		const generateQuizzesPage = () => {
			return '/quizzes';
		};

		const generateQuizPage = (quizId, title) => {
			return (
				'/quizzes/' + quizId + '-' + title.toLowerCase().replace(/ /g, '-')
			);
		};

		const generateCreateQuizPage = () => {
			return '/quizzes/new';
		};

		const generateQuotesPage = () => {
			return '/quotes';
		};

		const generateBookQuotesPage = (bookId, title) => {
			return (
				'/work/quotes/' + bookId + '-' + title.toLowerCase().replace(/ /g, '-')
			);
		};

		const generateQuotePage = (quoteId, text) => {
			return (
				'/quotes/' +
				quoteId +
				'-' +
				text.slice(0, 50).toLowerCase().replace(/ /g, '-')
			);
		};

		const generateAddQuotePage = () => {
			return '/quotes/new';
		};

		const generateQuotesTagPage = (tag) => {
			return '/quotes/tag/' + tag;
		};

		const generateQuotesSearchPage = (queryTerm) => {
			return '/quotes/search?q=' + queryTerm;
		};

		const generateWriteReviewPageForBook = (bookId) => {
			return '/review/edit' + bookId;
		};

		const generateUserCompareBooksPage = (userId) => {
			return '/user/compare/' + userId;
		};

		const generateFavoriteAuthorsPage = () => {
			return '/favorite_authors';
		};

		const generateUserFavoriteAuthorsPage = (userId) => {
			return '/user/' + userId + '/favorite_authors';
		};

		const generateUserYearInBooksPage = (year, userId) => {
			return '/user/year_in_books/' + year + '/' + userId;
		};

		const generateUserFriendsPage = (userId, name) => {
			return (
				'/friend/user/' + userId + '-' + name.toLowerCase().replace(/ /g, '-')
			);
		};

		const generateAccountSettingsPage = () => {
			return '/user/edit';
		};

		const generateChangePasswordPage = () => {
			return '/user/change_password';
		};

		const generateDeleteAccountPage = () => {
			return '/user/destroy';
		};

		const generateEditFavoriteGenresPage = () => {
			return '/user/edit_fav_genres';
		};

		const generateNewsPage = () => {
			return '/news';
		};

		const generateAllStoriesNewsPage = () => {
			return '/news?content_type=all';
		};

		const generateArticlesNewsPage = () => {
			return '/news?content_type=articles';
		};

		const generateInterviewsNewsPage = () => {
			return '/news?content_type=interviews';
		};

		const generateArticleLikesPage = (articleId) => {
			return '/rating/voters/' + articleId + '?resource_type=Article';
		};

		const generateAddAsFriendPage = (userId) => {
			return '/friend/add_as_friend/' + userId;
		};

		return {
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

	const queryNotifications = async () => {
		try {
			const query = await database
				.collection('heldersrvioNotifications')
				.limit(9)
				.get();
			return query.docs.map((document) => document.data());
		} catch (error) {
			console.log(error);
		}
	};

	const getNumberOfNewFriends = async (userUID) => {
		if (userUID === null) {
			return 0;
		}
		//try {
		//const query = await database.collection('users').doc(userUID).get();
		//return query.data().newFriendsRequests.length;
		return 0;
		/*} catch (error) {
			console.log(error);
		}*/
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

	const setNewNotificationsToSeen = async () => {
		try {
			const query = await database.collection('heldersrvioNotifications').get();
			query.forEach((doc) => doc.ref.set({ new: false }, { merge: true }));
		} catch (error) {
			console.log(error);
		}
	};

	const setNewFriendsToZero = async () => {
		try {
			const query = await database
				.collection('users')
				.where('username', '==', 'heldersrvio')
				.get();
			query.forEach((doc) =>
				doc.ref.set({ newFriendsRequests: [] }, { merge: true })
			);
		} catch (error) {
			console.log(error);
		}
	};

	const signOut = async (history) => {
		console.log('Signing out...');
		try {
			await firebase.auth().signOut();
			localStorage.userInfo = null;
			history.push({
				pathname: '/user/sign_out',
			});
		} catch (error) {
			console.log(error);
		}
	};

	const passwordSignIn = async (email, password, rememberMe, history) => {
		try {
			firebase.auth().signInWithEmailAndPassword(email, password);
			if (rememberMe) {
				localStorage.user = email;
				localStorage.password = password;
			}
		} catch (error) {
			history.push({
				pathname: '/user/sign_in',
				state: { error: error.message },
			});
		}
	};

	const facebookSignIn = async () => {
		const provider = new firebase.auth.FacebookAuthProvider();
		try {
			await firebase.auth().signInWithPopup(provider);
		} catch (error) {
			console.log(error.code);
		}
	};

	const twitterSignIn = async () => {
		const provider = new firebase.auth.TwitterAuthProvider();
		try {
			await firebase.auth().signInWithPopup(provider);
		} catch (error) {
			console.log(error.code);
		}
	};

	const googleSignIn = async () => {
		const provider = new firebase.auth.GoogleAuthProvider();
		try {
			await firebase.auth().signInWithPopup(provider);
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
			const newUserDocRef = database.collection('users').doc(email);
			const newUserDoc = await newUserDocRef.get();
			if (newUserDoc.exists) {
				throw new Error('email-exists');
			}
			await database.collection('users').doc(email).set({
				name,
				email,
				password,
			});
		} catch (error) {
			history.push({
				pathname: '/user/sign_up',
				state: { error: error.message },
			});
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
		console.log(newUserInfo);
		return newUserInfo;
	};

	const addBookToShelf = async (userUID, bookId, status, history) => {
		if (userUID === undefined || userUID === null) {
			history.push({
				pathname: '/user/sign_in',
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
				pathname: '/user/sign_in',
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

	const addBookToUserShelf = async (
		userUID,
		rootBook,
		shelf,
		genre = null,
		history
	) => {
		if (userUID === undefined || userUID === null) {
			history.push({
				pathname: '/user/sign_in',
				state: { error: 'User not logged in' },
			});
		} else {
			const shelfQuery = await database
				.collection('shelves')
				.where('user', '==', userUID)
				.where('shelf', '==', shelf)
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

	const likeUnlikeReview = async (userUID, reviewId, history) => {
		if (userUID === undefined || userUID === null) {
			history.push({
				pathname: '/user/sign_in',
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
				pathname: '/user/sign_in',
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
					const originalBookCandidates = await Promise.all(
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
				pathname: `/review/new/${newBookRef.id}?newBook=yes`,
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
				pathname: '/user/sign_in',
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
				pathname: '/user/sign_in',
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
				pathname: '/user/sign_in',
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
				pathname: '/user/sign_in',
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
				pathname: '/user/sign_in',
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
					dateOfBirth: userQueryData.dateOfBirth.toDate(),
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
			pathname: '/user/sign_in',
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
			pathname: '/home',
			state: { message: 'Your account will be permanently deleted.' },
		});
	};

	const getFavoriteGenresForUser = async (userUID, history) => {
		if (userUID === null || userUID === undefined) {
			history.push({
				pathname: '/user/sign_in',
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
				pathname: '/user/sign_in',
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
			isFollowedByUser:
				userQuery.data().followers !== undefined &&
				userQuery.data().followers.includes(loggedInUserUID),
			isUserFriend: userQuery.data().friends.includes(loggedInUserUID),
			lastName: userQuery.data().lastName,
			showGenderTo: userQuery.data().showGenderTo,
			gender: userQuery.data().gender,
			locationViewableBy: userQuery.data().locationViewableBy,
			country: userQuery.data().country,
			stateProvinceCode: userQuery.data().stateProvinceCode,
			city: userQuery.data().city,
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
					.sort((a, b) => b.data().date.toDate() - a.data().date.toDate())
					.filter((doc, index) => index < 10)
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

	return {
		pageGenerator,
		getAlsoEnjoyedBooksDetailsForBook,
		queryBookById,
		getEditionDetailsForBook,
		queryBooks,
		queryBooksForBookCreation,
		queryNotifications,
		getNumberOfNewFriends,
		getFriendsInfo,
		queryBookRecommendedToFriendsStatus,
		queryStatusUpdatesForRootBook,
		queryStatusUpdatesForBook,
		setNewNotificationsToSeen,
		setNewFriendsToZero,
		signOut,
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
		addBookToUserShelf,
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
	};
})();

export default Firebase;
