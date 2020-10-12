import React, { useState, useRef } from 'react';
import TopBar from './components/TopBar';
import HomePage from './components/HomePage';
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
			console.log('Done');
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
			window.location.href = '/user/sign_in';
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

	let firstPage = isLoggedIn ? (
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
	) : (
		<HomePage
			passwordSignIn={passwordSignIn}
			facebookSignIn={facebookSignIn}
			twitterSignIn={twitterSignIn}
			googleSignIn={googleSignIn}
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
