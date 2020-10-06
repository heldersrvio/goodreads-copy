import React, { useRef } from 'react';
import TopBar from './components/TopBar';
import HomePage from './components/HomePage';
import firebase from 'firebase/app';
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

	const rememberLogin = (email, password) => {
		localStorage.email = email;
		localStorage.password = password;
	};

	return (
		/*
		<div className="App">
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
			/>
		</div>
		*/
		<div className="App">
			<HomePage signIn={(email, password, rememberMe) => {}} />
		</div>
	);
};

export default App;
