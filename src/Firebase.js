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

	const generateBookPage = (bookId, title) => {
		return '/book/show/' + bookId + '.' + title.replace(/ /g, '_');
	};

	const generateSeriesPage = (seriesId, name) => {
		return `/series/${seriesId}-${name.toLowerCase().replace(/ /g, '-')}`;
	};

	const generateAuthorPage = (authorId, name) => {
		return '/author/show/' + authorId + '.' + name.replace(/ /g, '_');
	};

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
			seriesInfo.series.page = generateSeriesPage(
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

	const getMainAuthorDetailsForBook = async (rootBook) => {
		const rootBookQuery = await database
			.collection('rootBooks')
			.doc(rootBook)
			.get();
		const mainAuthorQuery = await database
			.collection('authors')
			.doc(rootBookQuery.data().authorId)
			.get();
		const authorDetails = {};
		authorDetails.authorNames = [];
		authorDetails.authorPages = [];
		authorDetails.authorNames.push(mainAuthorQuery.data().name);
		authorDetails.authorPages.push(
			generateAuthorPage(
				rootBookQuery.data().authorId,
				mainAuthorQuery.data().name
			)
		);
		authorDetails.authorIsMember = mainAuthorQuery.data().GRMember;
		authorDetails.authorFollowerCount =
			mainAuthorQuery.data().followersIds !== undefined
				? mainAuthorQuery.data().followersIds.length
				: 0;
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
					generateAuthorPage(otherAuthors[i].id, otherAuthorsQueryData[i].name)
				);
				authorFunctions.push(otherAuthors[i].role);
			}
		}
	};

	const getUserDetailsForBook = async (userUID, bookId) => {
		if (userUID !== null) {
			const bookInstanceQuery = await database
				.collection('userBooksInstances')
				.where('userId', '==', userUID)
				.where('bookId', '==', bookId)
				.get();
			const bookInstanceQueryResults = bookInstanceQuery.docs.map((document) =>
				document.data()
			);
			const userDetails = {};
			if (bookInstanceQueryResults.length > 0) {
				userDetails.userStatus = bookInstanceQueryResults[0].status;
				userDetails.userProgress = bookInstanceQueryResults[0].progress;
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
			const allEditionsQueryBooks = allEditionsQuery.docs.map(
				(document) => document.id
			);
			allBookInstancesQuery.docs.forEach((document) => {
				if (allEditionsQueryBooks.includes(document.data().bookId)) {
					if (document.data().bookId === bookId) {
						userDetails.thisEditionRatings++;
						userDetails.thisEditionRating += document.data().rating;
						userDetails.thisEditionAddedBy++;
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
						default:
							userDetails.oneRatings++;
					}
				}
			});
			userDetails.thisEditionRating =
				userDetails.thisEditionRating / userDetails.thisEditionRatings;
		}
	};

	const getReviewDetailsForBook = async (rootBook, title) => {
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
		await Promise.all(
			bookReviews.map(async (document) => {
				const review = {};
				review.user = document.data().user;
				const userQuery = await database
					.collection('users')
					.doc(review.user)
					.get();
				review.userName = userQuery.data().firstName;
				if (userQuery.data().lastName !== undefined) {
					review.userName = review.userName + ' ' + userQuery.data().lastName;
				}
				review.id = document.id;
				review.shelves = document.data().shelves;
				review.edition = document.data().bookEdition;
				review.editionLink = generateBookPage(review.edition, title);
				review.text = document.data().text;
				review.numberOfLikes = document.data().usersWhoLiked.length;
				return review;
			})
		);
		reviewDetails.reviews = bookReviews;
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
		if (bookDocumentData.pages !== undefined) {
			miscDetails.pages = bookDocumentData.pages;
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

	const queryAllBooks = async (userUID) => {
		try {
			const bookQuery = await database.collection('books').get();
			return await Promise.all(
				bookQuery.docs.map(async (document) => {
					const bookObj = {};
					const data = document.data();
					bookObj.id = document.id;
					bookObj.title = data.title;
					bookObj.cover = data.cover;
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
						data.rootBook,
						bookObj.title
					);
					Object.assign(bookObj, reviewDetails);
					const firstEditionInfo = await getFirstEditionInfoForBook(
						data.rootBook
					);
					Object.assign(bookObj, firstEditionInfo);
					return bookObj;
				})
			);
		} catch (error) {
			console.log(error);
		}
	};

	const queryBooks = async (userUID, searchString) => {
		try {
			const allBooksQuery = await queryAllBooks(userUID);
			return allBooksQuery.filter(
				(book) =>
					book.title.toLowerCase().includes(searchString.toLowerCase()) ||
					book.author.toLowerCase().includes(searchString.toLowerCase())
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
		try {
			const query = await database.collection('users').doc(userUID).get();
			return query.data().newFriendsRequests.length;
		} catch (error) {
			console.log(error);
		}
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
			bookObj.page = generateBookPage(
				bookInstanceData[i].bookId,
				bookQueryData.title
			);
			if (bookInstanceData[i].status === 'to-read') {
				wantToReadBooks.push(bookObj);
			} else {
				const authorQuery = await database
					.collection('authors')
					.doc(bookQueryData.authorId)
					.get();
				const authorQueryData = authorQuery.data();
				bookObj.author = authorQueryData.name;
				bookObj.authorPage = generateAuthorPage(
					bookQueryData.authorId,
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
		return newUserInfo;
	};

	const addBookToShelf = async (userUID, bookId, status) => {};

	const removeBookFromShelf = async (userUID, bookId) => {};

	const updateBookInShelf = async (userUID, bookId, progress) => {};

	return {
		queryBooks,
		queryNotifications,
		getNumberOfNewFriends,
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
		updateBookInShelf,
	};
})();

export default Firebase;
