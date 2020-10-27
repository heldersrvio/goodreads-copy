import React, { useState, useRef, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import TopBar from './components/TopBar';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import './styles/App.css';

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

const App = () => {
	const [userUID, setUserUID] = useState(null);
	const [userInfo, setUserInfo] = useState({});
	const [loading, setLoading] = useState(true);
	const database = useRef(null);
	const history = useHistory();
	database.current = firebase.firestore();

	useEffect(() => {
		const queryUserInfo = async () => {
			if (userUID === null) {
				return userInfo;
			}
			let newUserInfo = {};
			try {
				const userQuery = await database.current
					.collection('users')
					.doc(userUID)
					.get();
				const userQueryData = userQuery.data();
				newUserInfo = { ...userQueryData };
				const bookInstancesQuery = await database.current
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
					bookInstancesQueryData.filter(
						(instance) => instance.status !== 'read'
					)
				);
				newUserInfo.wantToReadBooks = userBooks[0];
				newUserInfo.readingBooks = userBooks[1];
				return newUserInfo;
			} catch (error) {
				console.log(error);
			}
		};

		const modifyUserInfo = async () => {
			const newUserInfo = await queryUserInfo();
			setUserInfo(newUserInfo);
			setLoading(false);
		};

		if (userUID !== null) {
			modifyUserInfo();
		}
	}, [userUID, userInfo]);

	const queryBooks = async (searchString) => {
		try {
			const bookQuery = await database.current.collection('books').get();
			const books = await Promise.all(
				bookQuery.docs.map(async (document) => {
					const bookObj = {};
					const data = document.data();
					bookObj.title = data.title;
					bookObj.cover = data.cover;
					if (data.series !== undefined) {
						bookObj.seriesInstance = data.seriesInstance;
						const seriesQuery = await database.current
							.collection('series')
							.doc(data.series)
							.get();
						bookObj.series = seriesQuery.data().name;
					}
					const authorQuery = await database.current
						.collection('authors')
						.doc(data.authorId)
						.get();
					bookObj.author = authorQuery.data().name;
					return bookObj;
				})
			);
			return books.filter(
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
			const query = await database.current
				.collection('heldersrvioNotifications')
				.limit(9)
				.get();
			return query.docs.map((document) => document.data());
		} catch (error) {
			console.log(error);
		}
	};

	const getNumberOfNewFriends = async () => {
		if (userUID === null) {
			return 0;
		}
		try {
			const query = await database.current
				.collection('users')
				.doc(userUID)
				.get();
			return query.data().newFriendsRequests.length;
		} catch (error) {
			console.log(error);
		}
	};

	const setNewNotificationsToSeen = async () => {
		try {
			const query = await database.current
				.collection('heldersrvioNotifications')
				.get();
			query.forEach((doc) => doc.ref.set({ new: false }, { merge: true }));
		} catch (error) {
			console.log(error);
		}
	};

	const setNewFriendsToZero = async () => {
		try {
			const query = await database.current
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

	const signOut = async () => {
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

	const passwordSignIn = async (email, password, rememberMe) => {
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
			const bookQuery = await database.current
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
				const authorQuery = await database.current
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

	const signUp = async (email, password, name) => {
		try {
			if (name.length === 0) {
				throw new Error('name');
			}
			if (email.length === 0) {
				throw new Error('email-missing');
			}
			const newUserDocRef = database.current.collection('users').doc(email);
			const newUserDoc = await newUserDocRef.get();
			if (newUserDoc.exists) {
				throw new Error('email-exists');
			}
			await database.current.collection('users').doc(email).set({
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

	let firstPage =
		userUID !== null && !loading ? (
			<div id="user-home">
				<TopBar
					isLoggedIn={true}
					userInfo={userInfo}
					queryBooksFunction={queryBooks}
					fetchNotifications={queryNotifications}
					fetchNewFriends={getNumberOfNewFriends}
					setNewFriendsToZero={setNewFriendsToZero}
					setNewNotificationsToSeen={setNewNotificationsToSeen}
					signOut={signOut}
				/>
				<Dashboard userCode={userUID} userInfo={userInfo} />
			</div>
		) : (
			<HomePage
				passwordSignIn={passwordSignIn}
				facebookSignIn={facebookSignIn}
				twitterSignIn={twitterSignIn}
				googleSignIn={googleSignIn}
				signUp={signUp}
			/>
		);

	firebase.auth().onAuthStateChanged((user) => {
		if (user !== null) {
			setUserUID(user.uid);
		} else {
			setUserUID(null);
		}
	});

	return <div className="App">{firstPage}</div>;
};

export default App;
