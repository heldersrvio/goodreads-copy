import React, { useRef } from 'react';
import TopBar from './components/TopBar';
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

	return (
		<div className="App">
			<TopBar
				isLoggedIn={true}
				profileImage="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/users/1552168666i/28296577._UX60_CR0,1,60,60_.jpg"
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
	);
};

export default App;
