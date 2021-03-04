import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

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

		const generateBookEditionsPage = (originalBookId, originalBookTitle) => {
			return (
				'/work/editions/' +
				originalBookId +
				'.' +
				originalBookTitle.replace(/ /g, '_')
			);
		};

		const generateSeriesPage = (seriesId, name) => {
			return `/series/${seriesId}-${name.toLowerCase().replace(/ /g, '-')}`;
		};

		const generateAuthorPage = (authorId, name) => {
			return '/author/show/' + authorId + '.' + name.replace(/ /g, '_');
		};

		const generateListPage = (listId, title) => {
			return '/list/show/' + listId + '.' + title.replace(/ /g, '_');
		};

		const generateUserPage = (userId, firstName) => {
			return '/user/show/' + userId + '-' + firstName.toLowerCase();
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

		const generateQuizPage = (quizId, title) => {
			return (
				'/quizzes/' + quizId + '-' + title.toLowerCase().replace(/ /g, '-')
			);
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

		const generateWriteReviewPageForBook = (bookId) => {
			return '/review/edit' + bookId;
		};

		return {
			generateBookPage,
			generateAddBookPage,
			generateBookCoverPage,
			generateBookEditionsPage,
			generateSeriesPage,
			generateAuthorPage,
			generateListPage,
			generateUserPage,
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
			generateQuizPage,
			generateBookQuotesPage,
			generateQuotePage,
			generateWriteReviewPageForBook,
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
			await database.collection('userBooksUpdates').add({
				user: userUID,
				book: bookId,
				action: 'rate-book',
				rating,
				date: firebase.firestore.Timestamp.fromDate(new Date()),
			});
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

	return {
		pageGenerator,
		getAlsoEnjoyedBooksDetailsForBook,
		queryBookById,
		queryBooks,
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
	};
})();

export default Firebase;
