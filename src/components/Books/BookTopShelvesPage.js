import React, { useState, useEffect } from 'react';
import Firebase from '../../Firebase';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import '../styles/Books/BookTopShelvesPage.css';
import { trackPromise } from 'react-promise-tracker';

const BookTopShelvesPage = ({ match }) => {
	const {
		params: { bookId },
	} = match;
	const [loaded, setLoaded] = useState(false);
	const [bookInfo, setBookInfo] = useState({});
	const [page, setPage] = useState(1);

	useEffect(() => {
		const getInfo = async () => {
			setBookInfo(
				await trackPromise(Firebase.getBookInfoForTopShelvesPage(bookId))
			);
			setLoaded(true);
		};
		getInfo();
	}, [bookId]);

	const pageHeader = loaded ? (
		<h1 className="book-top-shelves-page-header">
			<a href={Firebase.pageGenerator.generateBookPage(bookId, bookInfo.title)}>
				{bookInfo.title}
			</a>
			<span>{' > Top Shelves'}</span>
		</h1>
	) : null;

	const showingShelfNumbers = loaded ? (
		<div className="book-top-shelves-page-showing-shelf-numbers">
			<span className="page-description">{`Top shelves for ${bookInfo.title}`}</span>
			<span className="showing-numbers">{`Showing ${(page - 1) * 100 + 1}-${
				page !== Math.ceil(bookInfo.genres.length / 100)
					? page * 100
					: bookInfo.genres.length
			} of ${bookInfo.genres.length}`}</span>
		</div>
	) : null;

	const pageNavigationSection =
		loaded && Math.ceil(bookInfo.genres.length / 100) > 1 ? (
			<div className="page-navigation-section">
				<button
					onClick={(_e) => setPage((previous) => previous - 1)}
					disabled={page === 1}
				>
					« previous
				</button>
				{Array.from(
					{
						length: Math.ceil(bookInfo.genres.length / 100),
					},
					(_x, i) => i + 1
				).map((number) => {
					return (
						<button
							key={number}
							onClick={(_e) => setPage(number)}
							disabled={page === number}
						>
							{page !== number ? number : <i>{number}</i>}
						</button>
					);
				})}
				<button
					onClick={(_e) => setPage((previous) => previous + 1)}
					disabled={page === Math.ceil(bookInfo.genres.length / 100)}
				>
					next »
				</button>
			</div>
		) : null;

	const genreList = loaded ? (
		<div className="book-top-shelves-page-genre-list">
			{bookInfo.genres
				.filter((_genre, index) => {
					return index >= (page - 1) * 100 && index <= page * 100 - 1;
				})
				.map((genre, index) => {
					return (
						<div className="book-top-shelves-page-genre" key={index}>
							<a
								className="genre-a"
								href={Firebase.pageGenerator.generateGenrePage(genre.name)}
							>
								{genre.name.toLowerCase().replace(/ /g, '-')}
							</a>
							<a
								className="user-shelves-a"
								href={Firebase.pageGenerator.generateBookGenreShelfPage(
									bookId,
									bookInfo.title,
									genre.name
								)}
							>
								{genre.userCount > 1 ? `${genre.userCount} people` : '1 person'}
							</a>
						</div>
					);
				})}
			{pageNavigationSection}
		</div>
	) : null;

	const mainContent = (
		<div className="book-top-shelves-page-main-content">
			{pageHeader}
			{showingShelfNumbers}
			{genreList}
		</div>
	);

	return (
		<div className="book-top-shelves-page">
			<TopBar />
			{mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default BookTopShelvesPage;
