import React, { useState, useRef } from 'react';
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
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const database = useRef(null);
	const history = useHistory();
	database.current = firebase.firestore();

	const queryBooks = async (searchString) => {
		try {
			const query = await database.current
				.collection('books')
				.where('searchTerms', 'array-contains', searchString.toLowerCase())
				.limit(5)
				.get();
			return query.docs.map((document) => document.data());
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
		try {
			const query = await database.current
				.collection('users')
				.where('username', '==', 'heldersrvio')
				.get();
			return query.docs.map((document) => document.data())[0].newFriendsRequests
				.length;
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

	let firstPage = isLoggedIn ? (
		<div id="user-home">
			<TopBar
				isLoggedIn={true}
				profileImage="https://camo.githubusercontent.com/db6bd56a6ead4c0d902278e7c1f642ea166d9ddd/687474703a2f2f69636f6e732e69636f6e617263686976652e636f6d2f69636f6e732f746865686f74682f73656f2f3235362f73656f2d70616e64612d69636f6e2e706e67"
				favoriteGenres={[
					'Science Fiction',
					'Manga',
					'Contemporary',
					'Fantasy',
					'Fiction',
					'Graphic Novels',
					'Historical Fiction',
					'Romance',
				]}
				queryBooksFunction={queryBooks}
				profileName="Helder"
				fetchNotifications={queryNotifications}
				fetchNewFriends={getNumberOfNewFriends}
				setNewFriendsToZero={setNewFriendsToZero}
				setNewNotificationsToSeen={setNewNotificationsToSeen}
				signOut={signOut}
			/>
			<Dashboard
				userCode="2345"
				numberOfReadBooks={40}
				wantToReadBooks={[
					{
						cover:
							'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1533612066i/41045016._SY180_.jpg',
						title: 'The Dark Truth',
						page: '/book/show/41045016-the-dark-truth',
					},
					{
						cover:
							'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1328346428i/11802424._SY180_.jpg',
						title: 'The Trafficked',
						page: '/book/show/11802424-the-trafficked',
					},
					{
						cover:
							'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1390760180i/6656._SY180_.jpg',
						title: 'The Divine Comedy',
						page: '/book/show/6656.The_Divine_Comedy',
					},
					{
						cover:
							'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1390760180i/6656._SY180_.jpg',
						title: 'The Divine Comedy',
						page: '/book/show/6656.The_Divine_Comedy',
					},
				]}
				readingBooks={[
					{
						cover:
							'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1320534275i/958549._SY180_.jpg',
						title: 'The Bible as History',
						page: '/book/show/958549.The_Bible_as_History',
						authorPage: '/author/show/221172.Werner_Keller',
						author: 'Werner Keller',
						authorHasBadge: false,
					},
					{
						cover:
							'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1562033943i/43667389._SX120_.jpg',
						title:
							'Stop Self-Sabotage: Six Steps to Unlock Your True Motivation, Harness Your Willpower, and Get Out of Your Own Way',
						page: '/book/show/43667389-stop-self-sabotage',
						authorPage: '/author/show/19274073.Judy_Ho',
						author: 'Judy Ho',
						authorHasBadge: true,
					},
				]}
			/>
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
			setIsLoggedIn(true);
		} else {
			setIsLoggedIn(false);
		}
	});

	return <div className="App">{firstPage}</div>;
};

export default App;
