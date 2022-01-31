import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Firebase from '../../Firebase';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';

const SearchPage = () => {
	const query = new URLSearchParams(useLocation().search);
	const q =
		query.get('q') !== null && query.get('q') !== undefined
			? query.get('q')
			: '';
	const searchType =
		query.get('search_type') !== null && query.get('search_type') !== undefined
			? query.get('search_type')
			: 'books';
	const searchField =
		query.get('search_field') !== null &&
		query.get('search_field') !== undefined
			? query.get('search_field')
			: 'all';
	const [loaded, setLoaded] = useState(false);
	const [searchInput, setSearchInput] = useState(q);
	const [searchFieldInput, setSearchFieldInput] = useState(searchField);
	const [books, setBooks] = useState([]);
	/*
    books: [{
        id,
        amazonLink,
        title,
        cover,
        authorId,
        authorName,
        authorIsMember,
        averageRating,
        numberOfRatings,
        publishedYear,
        numberOfEditions,
        userStatus,
        userRating,
        userProgress,
        toReadBookPosition,
        pageCount,
        genreShelves: [{
            name,
            numberOfBooks,
        }],
    }]
    */
	const [people, setPeople] = useState([]);
	/*
    people: [{
        id,
        name,
        profilePicture,
        location,
        numberOfFriends,
        numberOfBooks,
    }]
    */
	const [genre, setGenre] = useState(null);
	/*
    genre: {
        name,
        parentGenre,
    }
    */
	const [page, setPage] = useState(1);
	// const user = JSON.parse(localStorage.getItem('userState'));

	// const noPictureImage =
	// 	'https://s.gr-assets.com/assets/nophoto/user/u_50x66-632230dc9882b4352d753eedf9396530.png';
	// const noCoverUrl =
	// 	'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png';
	const resultsPerPage = 20;

	useEffect(() => {
		const loadInfo = async () => {
			if (q.length === 0) {
				setBooks([]);
				setPeople([]);
				setGenre(null);
			} else if (searchType === 'books') {
				const info = Array(60).fill({
					id: '234',
					amazonLink: 'https://www.amazon.com/gp/product/1501154648',
					title: 'Then She Was Gone',
					cover:
						'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1523891273l/35297426.jpg',
					authorId: '222',
					authorName: 'Lisa Wingate',
					authorIsMember: true,
					averageRating: 4,
					numberOfRatings: 200,
					publishedYear: 2017,
					numberOfEditions: 12,
					userStatus: 'reading',
					userRating: 2,
					userProgress: 17,
					pageCount: 450,
					genreShelves: Array(10).fill({
						name: 'mystery',
						numberOfBooks: 14567,
					}),
				});
				setBooks(info);
			} else if (searchType === 'people') {
				const info = Array(50).fill({
					id: '78',
					name: 'Nils Hol',
					profilePicture:
						'https://tmbidigitalassetsazure.blob.core.windows.net/rms3-prod/attachments/37/1200x1200/Homemade-Chocolate-Pudding_EXPS_DIYD19_7927_B04_16_3b.jpg',
					location: 'Canada',
					numberOfFriends: 4500,
					numberOfBooks: 460,
				});
				setPeople(info);
			} else {
				const info = {
					name: 'paranormal',
					parentGenre: 'fiction',
				};
				setGenre(info);
			}
			setLoaded(true);
		};
		loadInfo();
	}, [q, searchType]);

	const searchArea = loaded ? (
		<div className="search-area">
			<div className="input-and-button">
				<input
					type="text"
					value={searchInput}
					onChange={(e) => setSearchInput(e.value)}
				></input>
				<a
					href={Firebase.pageGenerator.generateSearchPage(
						searchInput,
						searchType,
						searchFieldInput
					)}
				>
					Search
				</a>
			</div>
			<div className="radio-inputs">
				{['all', 'title', 'author', 'genre'].map((field, index) => {
					return (
						<div className="input-wrapper" key={index}>
							<input
								type="radio"
								id={field}
								key={index}
								checked={searchFieldInput === field}
								value={field}
								onChange={(_e) => setSearchFieldInput(field)}
							></input>
							<label htmlFor={field}>{field}</label>
						</div>
					);
				})}
			</div>
		</div>
	) : null;

	const navigationTabsSection = loaded ? (
		<div className="search-page-navigation-tabs-section">
			<a
				className={searchType === 'books' ? 'disabled' : ''}
				href={Firebase.pageGenerator.generateSearchPage(
					q,
					'books',
					searchField
				)}
			>
				Books
			</a>
			<a
				className={searchType === 'people' ? 'disabled' : ''}
				href={Firebase.pageGenerator.generateSearchPage(
					q,
					'people',
					searchField
				)}
			>
				People
			</a>
		</div>
	) : null;

	const bookResultsSection =
		loaded && searchField !== 'genre' ? (
			<div className="book-results-section">
				{books.length > 0 ? (
					<span className="total-results-span">{`Page ${page} of about ${books.length} results`}</span>
				) : null}
				<div className="book-list">
					{books
						.filter(
							(_book, index) =>
								index >= (page - 1) * 20 && index <= page * 20 - 1
						)
						.map((book, index) => {
							return <div className="book-result-card" key={index}></div>;
						})}
				</div>
				{Math.ceil(books.length / resultsPerPage) > 1 ? (
					<div className="page-navigation-section">
						<button
							onClick={(_e) => setPage((previous) => previous - 1)}
							disabled={page === 1}
						>
							« previous
						</button>
						{Array.from(
							{
								length: Math.ceil(books.length / resultsPerPage),
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
							disabled={page === Math.ceil(books.length / resultsPerPage)}
						>
							next »
						</button>
					</div>
				) : null}
			</div>
		) : loaded && searchField === 'genre' ? (
			<div className="book-results-section">
				{genre !== undefined ? (
					<div className="genre-result">
						<span>
							Genre:{' '}
							{genre.parentGenre !== undefined ? (
								<span>
									<a
										href={Firebase.pageGenerator.generateGenrePage(
											genre.parentGenre
										)}
									>
										{genre.parentGenre}
									</a>
									{' > '}
								</span>
							) : null}
							<a href={Firebase.pageGenerator.generateGenrePage(genre.name)}>
								{genre.name}
							</a>
						</span>
					</div>
				) : null}
				<div className="search-unavailable-section">
					<span>Search is temporarily unavailable.</span>
					<span>Use this time to read a book!</span>
				</div>
			</div>
		) : null;

	const peopleResultsSection = loaded ? (
		<div className="people-results-section">
			{people.length > 0 ? (
				<span className="total-results-span">{`Page ${page} of about ${people.length} results`}</span>
			) : null}
			<div className="people-list">
				{people
					.filter(
						(_person, index) =>
							index >= (page - 1) * 20 && index <= page * 20 - 1
					)
					.map((person, index) => {
						return <div className="person-result-card" key={index}></div>;
					})}
			</div>
			{Math.ceil(people.length / resultsPerPage) > 1 ? (
				<div className="page-navigation-section">
					<button
						onClick={(_e) => setPage((previous) => previous - 1)}
						disabled={page === 1}
					>
						« previous
					</button>
					{Array.from(
						{
							length: Math.ceil(people.length / resultsPerPage),
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
						disabled={page === Math.ceil(people.length / resultsPerPage)}
					>
						next »
					</button>
				</div>
			) : null}
		</div>
	) : null;

	const mainContentLeftSection = loaded ? (
		<div className="search-page-main-content-left-section">
			<span className="page-title-span">Search</span>
			{searchArea}
			{navigationTabsSection}
			{searchType === 'books' ? bookResultsSection : peopleResultsSection}
		</div>
	) : null;

	const mainContentRightSection = loaded ? (
		<div className="search-page-main-content-right-section">
			<div className="top-anchors">
				<a href={Firebase.pageGenerator.generateAddBookPage()}>
					Manually add a book
				</a>
			</div>
			{searchType === 'books' && searchField !== 'genre' ? (
				<div className="top-shelves-area">
					<span className="top-shelves-area-title">Related Shelves</span>
					{books
						.map((book) => book.genreShelves)
						.reduce(
							(previous, current) =>
								previous.concat(
									current.filter(
										(genreShelf) =>
											!previous.map((p) => p.name).includes(genreShelf.name)
									)
								),
							[]
						)
						.map((shelf, index) => {
							return (
								<span className="genre-shelf-span" key={index}>
									<a
										href={Firebase.pageGenerator.generateGenrePage(shelf.name)}
									>
										{shelf.name}
									</a>
									<span className="number-of-books-span">
										({shelf.numberOfBooks})
									</span>
								</span>
							);
						})}
				</div>
			) : null}
		</div>
	) : null;

	const mainContent = loaded ? (
		<div className="search-page-main-content">
			{mainContentLeftSection}
			{mainContentRightSection}
		</div>
	) : null;

	return (
		<div className="search-page">
			<TopBar />
			{mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default SearchPage;
