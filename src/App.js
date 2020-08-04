import React from 'react';
import TopBar from './components/TopBar';
import './styles/App.css';

const App = () => {
	return (
		<div className="App">
			<TopBar isLoggedIn={true} profileImage="https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/users/1552168666i/28296577._UX60_CR0,1,60,60_.jpg" favoriteGenres={["Science Fiction", "Manga"]} />
		</div>
	);
};

export default App;
