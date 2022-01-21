import React, { useState, useEffect } from 'react';
import Firebase from '../../Firebase';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import '../styles/Books/BookGenreShelfPage.css';
import { trackPromise } from 'react-promise-tracker';

const BookGenreShelfPage = ({ match, location }) => {
	const {
		params: { bookGenreShelfPageId },
	} = match;
	const shelf = new URLSearchParams(location.search).get('shelf');
	const bookId = bookGenreShelfPageId.split('.')[0];
	const bookTitle = bookGenreShelfPageId.split('.')[1].replace(/_/g, ' ');
	const [loaded, setLoaded] = useState(false);
	const [bookInfo, setBookInfo] = useState({});

	useEffect(() => {
		const getBookInfo = async () => {
			setBookInfo(
				await trackPromise(Firebase.getBookInfoForGenreShelfPage(bookId, shelf))
			);
			setLoaded(true);
		};
		getBookInfo();
	}, [bookId, shelf]);

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

	const leftSection = loaded ? (
		<div className="book-genre-shelf-page-left-section">
			{bookInfo.users.map((user, index) => {
				return (
					<div className="user-card" key={index}>
						<a
							className="user-card-picture-a"
							href={Firebase.pageGenerator.generateUserPage(
								user.id,
								user.firstName
							)}
						>
							<img
								className="user-card-picture"
								src={
									user.picture !== undefined
										? user.picture
										: 'https://s.gr-assets.com/assets/nophoto/user/m_100x100-c7bfe730633c9983e27caaa66a8e244a.png'
								}
								alt={user.firstName}
							/>
						</a>
						<div className="user-card-right-section">
							<a
								href={Firebase.pageGenerator.generateUserPage(
									user.id,
									user.firstName
								)}
								className="user-name-a"
							>
								{user.firstName}
							</a>
							<span>{`${user.numberOfBooks} books`}</span>
							<span>{`${user.numberOfFriends} friends`}</span>
							<a
								href={Firebase.pageGenerator.generateUserShelfPage(
									user.id,
									user.firstName,
									[shelf]
								)}
							>{`${user.numberOfBooksOnShelf} ${shelf} books`}</a>
						</div>
					</div>
				);
			})}
		</div>
	) : null;

	const rightSection = loaded ? (
		<div className="book-genre-shelf-page-right-section">
			<span className="popular-books-title">{`POPULAR ${shelf.toUpperCase()} BOOKS`}</span>
			<div className="popular-books-list">
				{bookInfo.popularBooksOnShelf.map((book, index) => {
					return (
						<div className="popular-book-card" key={index}>
							<a
								className="image-container"
								href={Firebase.pageGenerator.generateBookPage(
									book.id,
									book.title
								)}
							>
								<img
									src={
										book.cover !== undefined
											? book.cover
											: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png'
									}
									alt={book.title}
								/>
							</a>
							<a
								className="book-title-a"
								href={Firebase.pageGenerator.generateBookPage(
									book.id,
									book.title
								)}
							>
								{book.title}
							</a>
						</div>
					);
				})}
			</div>
		</div>
	) : null;

	const mainContent = (
		<div className="book-genre-shelf-page-main-content">
			{pageHeader}
			<div className="central-section">
				{leftSection}
				{rightSection}
			</div>
		</div>
	);

	return (
		<div className="book-genre-shelf-page">
			<TopBar />
			{mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default BookGenreShelfPage;
