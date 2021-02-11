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

	const queryAllBooks = async () => {
		try {
			const bookQuery = await database.collection('books').get();
			return await Promise.all(
				bookQuery.docs.map(async (document) => {
					const bookObj = {};
					const data = document.data();
					bookObj.id = document.id;
					bookObj.title = data.title;
					bookObj.cover = data.cover;
					if (data.series !== undefined) {
						bookObj.seriesInstance = data.seriesInstance;
						const seriesQuery = await database
							.collection('series')
							.doc(data.series)
							.get();
						bookObj.series = { ...seriesQuery.data() };
					}
					bookObj.authorNames = [];
					bookObj.authorFunctions = [];
					bookObj.authorPages = [];
					const mainAuthorQuery = await database
						.collection('authors')
						.doc(data.authorId)
						.get();
					const otherAuthorsQuery =
						data.otherAuthors !== undefined
							? await Promise.all(
									data.otherAuthors.map(
										async (author) =>
											await database.collection('authors').doc(author.id).get()
									)
							  )
							: null;
					const otherAuthorsQueryData =
						otherAuthorsQuery !== null
							? otherAuthorsQuery.map((document) => document.data())
							: null;
					if (
						otherAuthorsQueryData !== null &&
						otherAuthorsQueryData[0] === undefined
					) {
						console.log(bookObj.title);
					}
					bookObj.authorNames.push(mainAuthorQuery.data().name);
					bookObj.authorPages.push(
						`/author/show/${data.authorId}${mainAuthorQuery
							.data()
							.name.replace(' ', '_')}`
					);
					bookObj.authorIsMember = mainAuthorQuery.data().GRMember;
					bookObj.authorFollowerCount =
						mainAuthorQuery.data().followersIds !== undefined
							? mainAuthorQuery.data().followersIds.length
							: 0;
					if (otherAuthorsQueryData !== null) {
						for (let i = 0; i < otherAuthorsQueryData.length; i++) {
							bookObj.authorNames.push(otherAuthorsQueryData[i].name);
							bookObj.authorPages.push(
								`/author/show/${data.otherAuthors[i].id}${otherAuthorsQueryData[
									i
								].name.replace(' ', '_')}`
							);
							bookObj.authorFunctions.push(data.otherAuthors[i].role);
						}
					}

					return bookObj;
				})
			);
		} catch (error) {
			console.log(error);
		}
	};

	const queryBooks = async (searchString) => {
		try {
			const allBooksQuery = await queryAllBooks();
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
			bookObj.page =
				'/book/show/' +
				bookInstanceData[i].bookId +
				'.' +
				bookQueryData.title.replace(/ /g, '_');
			if (bookInstanceData[i].status === 'to-read') {
				wantToReadBooks.push(bookObj);
			} else {
				const authorQuery = await database
					.collection('authors')
					.doc(bookQueryData.authorId)
					.get();
				const authorQueryData = authorQuery.data();
				bookObj.author = authorQueryData.name;
				bookObj.authorPage =
					'/author/show/' +
					bookQueryData.authorId +
					'.' +
					authorQueryData.name.replace(/ /g, '_');
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
