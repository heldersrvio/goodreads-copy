import React, { useState, useEffect } from 'react';
import Firebase from '../../Firebase';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';

const BookGenreShelfPage = ({ match, location }) => {
	const {
		params: { bookGenreShelfPageId },
	} = match;
	const shelf = new URLSearchParams(location.search).get('shelf');
	const bookId = bookGenreShelfPageId.split('.')[0];
	const bookTitle = bookGenreShelfPageId.split('.')[1].replace(/_/g, ' ');
	const [loaded, setLoaded] = useState(false);
	/*
        bookInfo: {
            series,
            seriesInstance,
            users: [{
                id,
                name,
                picture,
                numberOfBooks,
                numberOfFriends,
                numberOfBooksOnShelf,
            }],
            popularBooksOnShelf: [{
                id,
                title,
                cover,
            }],
        }
    */
	const [bookInfo, setBookInfo] = useState({});
	const pageHeader = loaded ? (
		<h1 className="book-genre-shelf-page-header">
			<a href={Firebase.pageGenerator.generateBookPage(bookId, bookTitle)}>
				{bookInfo.seriesInstance === undefined
					? bookTitle
					: `${bookTitle} (${bookInfo.series}, #${bookInfo.seriesInstance})`}
			</a>
			<span>{' > '}</span>
			<a href={Firebase.pageGenerator.generateBookTopShelvesPage(bookId)}>
				Top Shelves
			</a>
			<span>{' > '}</span>
			<span>{shelf}</span>
		</h1>
	) : null;
};

export default BookGenreShelfPage;
