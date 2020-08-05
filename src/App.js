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
			/>
		</div>
	);
};

export default App;
