import React, { useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import Firebase from '../../Firebase';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import '../styles/Explore/SearchPage.css';

const SearchPage = () => {
	const history = useHistory();
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
	const [savingShelves, setSavingShelves] = useState([]);
	const [
		areAddShelfInputSectionsHidden,
		setAreAddShelfInputSectionsHidden,
	] = useState([]);
	const [addShelfInputs, setAddShelfInputs] = useState([]);
	const [exhibitedStarRatings, setExhibitedStarRatings] = useState([]);
	const [areShelfPopupsHidden, setAreShelfPopupsHidden] = useState([]);
	const [areShelfPopupsBottomHidden, setAreShelfPopupsBottomHidden] = useState(
		[]
	);
	const [shelfPopupReadingInputs, setShelfPopupReadingInputs] = useState([]);
	const [shelfPopupToReadInputs, setShelfPopupToReadInputs] = useState([]);

	const [loaded, setLoaded] = useState(false);
	const [searchInput, setSearchInput] = useState(q);
	const [searchFieldInput, setSearchFieldInput] = useState(
		searchType === 'people' ? 'author' : searchField
	);
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

	const user = JSON.parse(localStorage.getItem('userState'));

	const noPictureImage =
		'https://s.gr-assets.com/assets/nophoto/user/u_50x66-632230dc9882b4352d753eedf9396530.png';
	const noCoverUrl =
		'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png';
	const resultsPerPage = 20;

	useEffect(() => {
		const loadInfo = async () => {
			if (q.length === 0) {
				setBooks([]);
				setPeople([]);
				setGenre(null);
			} else if (searchField === 'genre') {
				const info = {
					name: 'paranormal',
					parentGenre: 'fiction',
				};
				setGenre(info);
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
					toReadBookPosition: undefined,
					pageCount: 450,
					genreShelves: Array(10).fill({
						name: 'mystery',
						numberOfBooks: 14567,
					}),
				});
				setSavingShelves(info.map((_book) => false));
				setAreAddShelfInputSectionsHidden(info.map((_book) => true));
				setAddShelfInputs(info.map((_book) => ''));
				setExhibitedStarRatings(
					info.map((book) =>
						book.userRating !== undefined ? book.userRating : 0
					)
				);
				setAreShelfPopupsHidden(info.map((_book) => true));
				setAreShelfPopupsBottomHidden(info.map((_book) => true));
				setShelfPopupReadingInputs(info.map((_book) => ''));
				setShelfPopupToReadInputs(info.map((_book) => ''));
				setBooks(info);
			} else {
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
			}
			setLoaded(true);
		};
		loadInfo();
	}, [q, searchType, searchField]);

	const displayRemoveBookConfirm = () => {
		return window.confirm(
			'Removing a book deletes your rating, review, etc. Remove this book from all your shelves?'
		);
	};

	const removeBookSafely = (bookObject, index) => {
		if (displayRemoveBookConfirm()) {
			Firebase.removeBookFromShelf(user.userUID, bookObject.bookId);
			setBooks((previous) => {
				return previous.map((previousObject, i) =>
					i === index
						? {
								...previousObject,
								userStatus: undefined,
								userProgress: undefined,
								userRating: undefined,
						  }
						: previousObject
				);
			});
		}
	};

	const changeBookShelf = async (bookObject, index, shelf) => {
		if (bookObject.bookId !== undefined) {
			setSavingShelves((previous) =>
				previous.map((value, i) => (i === index ? true : value))
			);
			await Firebase.addBookToShelf(
				user.userUID,
				bookObject.bookId,
				shelf,
				history
			);
			setBooks((previous) => {
				return previous.map((previousObject, i) =>
					i === index
						? {
								...previousObject,
								userStatus: shelf,
						  }
						: previousObject
				);
			});
			setSavingShelves((previous) =>
				previous.map((value, i) => (i === index ? false : value))
			);
		}
	};

	const rateBook = async (bookObject, index, rating) => {
		if (bookObject.bookId !== undefined) {
			await Firebase.rateBook(user.userUID, bookObject.bookId, rating, history);
			setBooks((previous, i) => {
				return previous.map((previousObject, i) =>
					i === index
						? {
								...previousObject,
								userStatus:
									previousObject.userStatus !== undefined
										? previousObject.userStatus
										: 'read',
								userRating: rating,
						  }
						: previousObject
				);
			});
		}
	};

	const updateProgress = async (bookObject, index, pages) => {
		if (
			user.userUID !== null &&
			user.userUID !== undefined &&
			bookObject.bookId !== undefined &&
			pages.length > 0
		) {
			await Firebase.updateBookInShelf(
				user.userUID,
				bookObject.bookId,
				parseInt(pages)
			);
			setBooks((previous) => {
				return previous.map((previousObject, i) =>
					i === index
						? {
								...previousObject,
								userProgress: pages,
						  }
						: previousObject
				);
			});
		}
	};

	const generateAddToShelfButton = (bookObject, index) => {
		return loaded && bookObject.userStatus === 'reading' ? (
			<div className="book-on-reading-shelf">
				<div
					className={
						areShelfPopupsHidden[index]
							? 'shelf-pop-up-wrapper'
							: 'shelf-pop-up-wrapper always-visible'
					}
				>
					<div className="shelf-pop-up reading">
						<div className="shelf-pop-up-top">
							<span>
								<b>Update your reading progress:</b>
							</span>
							<span>
								I'm on page{' '}
								<input
									type="text"
									value={shelfPopupReadingInputs[index]}
									className={
										areShelfPopupsBottomHidden[index]
											? 'page-progress-input'
											: 'page-progress-input white-background'
									}
									onClick={(_e) => {
										setAreShelfPopupsBottomHidden((previous) =>
											previous.map((value, i) => (i === index ? false : value))
										);
										setAreShelfPopupsHidden((previous) =>
											previous.map((value, i) => (i === index ? false : value))
										);
									}}
									onChange={(e) => {
										const newValue = e.target.value;
										setShelfPopupReadingInputs((previous) =>
											previous.map((value, i) =>
												i === index ? newValue : value
											)
										);
									}}
								/>{' '}
								of {bookObject.pageCount}.{' '}
								<a
									href={
										user.userUID !== undefined && user.userUID !== null
											? Firebase.pageGenerator.generateUserShelfPage(
													user.userUID,
													user.userInfo.firstName,
													['reading']
											  )
											: '/user/sign_in'
									}
								>
									View shelf
								</a>
							</span>
						</div>
						<div
							className={
								areShelfPopupsBottomHidden[index]
									? 'shelf-pop-up-bottom hidden'
									: 'shelf-pop-up-bottom'
							}
						>
							<button
								className="progress-submit-button"
								onClick={(_e) => {
									updateProgress(
										bookObject,
										index,
										shelfPopupReadingInputs[index]
									);
									setAreShelfPopupsBottomHidden((previous) =>
										previous.map((value, i) => (i === index ? true : value))
									);
									setAreShelfPopupsHidden((previous) =>
										previous.map((value, i) => (i === index ? true : value))
									);
								}}
							>
								Submit
							</button>
							<button
								className="progress-cancel-button"
								onClick={(_e) => {
									setAreShelfPopupsBottomHidden((previous) =>
										previous.map((value, i) => (i === index ? true : value))
									);
									setAreShelfPopupsHidden((previous) =>
										previous.map((value, i) => (i === index ? true : value))
									);
								}}
							>
								Cancel
							</button>
							<span>·</span>
							<button
								className="progress-finished-button"
								onClick={(_e) => {
									changeBookShelf(bookObject, index, 'read');
									setAreShelfPopupsBottomHidden((previous) =>
										previous.map((value, i) => (i === index ? true : value))
									);
									setAreShelfPopupsHidden((previous) =>
										previous.map((value, i) => (i === index ? true : value))
									);
								}}
							>
								Finished book
							</button>
						</div>
					</div>
					<div className="shelf-pop-up-arrow-grey">
						<div className="shelf-pop-up-arrow"></div>
					</div>
				</div>
				<button
					className="remove-book-from-shelf reading"
					onClick={(_e) => removeBookSafely(bookObject, index)}
				></button>
				<span>Currently Reading</span>
			</div>
		) : loaded && bookObject.userStatus === 'read' ? (
			<div className="book-on-read-shelf">
				<div className="shelf-pop-up-wrapper">
					<div className="shelf-pop-up read">
						<div className="shelf-pop-up-top">
							<a
								href={Firebase.pageGenerator.generateWriteReviewPageForBook(
									bookObject.bookId
								)}
							>
								Write a review
							</a>
							<span>·</span>
							<a
								href={
									user.userUID !== undefined && user.userUID !== null
										? Firebase.pageGenerator.generateUserShelfPage(
												user.userUID,
												user.userInfo.firstName,
												['to-read']
										  )
										: '/user/sign_in'
								}
							>
								View shelf
							</a>
						</div>
					</div>
					<div className="shelf-pop-up-arrow-grey">
						<div className="shelf-pop-up-arrow"></div>
					</div>
				</div>
				<button
					className="remove-book-from-shelf read"
					onClick={(_e) => removeBookSafely(bookObject, index)}
				></button>
				<span>Read</span>
			</div>
		) : loaded && bookObject.userStatus === 'to-read' ? (
			<div className="book-on-to-read-shelf">
				<div
					className={
						areShelfPopupsHidden[index]
							? 'shelf-pop-up-wrapper'
							: 'shelf-pop-up-wrapper always-visible'
					}
				>
					<div className="shelf-pop-up to-read">
						<div className="shelf-pop-up-top">
							<span>
								#
								<input
									type="text"
									value={shelfPopupToReadInputs[index]}
									className="shelf-pop-up-to-read-input"
									onChange={(e) => {
										const newValue = e.target.value;
										setShelfPopupToReadInputs((previous) =>
											previous.map((value, i) =>
												i === index ? newValue : value
											)
										);
									}}
									onClick={(_e) => {
										setAreShelfPopupsBottomHidden((previous) =>
											previous.map((value, i) => (i === index ? false : value))
										);
										setAreShelfPopupsHidden((previous) =>
											previous.map((value, i) => (i === index ? false : value))
										);
									}}
								/>{' '}
								on your <b>To Read</b> shelf.
							</span>
						</div>
						{areShelfPopupsBottomHidden[index] ? (
							<div className="shelf-pop-up-bottom">
								<a
									href={
										user.userUID !== undefined && user.userUID !== null
											? Firebase.pageGenerator.generateUserShelfPage(
													user.userUID,
													user.userInfo.firstName,
													['to-read']
											  )
											: '/user/sign_in'
									}
								>
									View shelf
								</a>
							</div>
						) : (
							<div className="shelf-pop-up-bottom">
								<button
									className="progress-submit-button"
									onClick={(_e) => {
										Firebase.changeBookPosition(
											user.userUID,
											bookObject.bookId,
											parseInt(shelfPopupToReadInputs[index])
										);
										setBooks((previous) =>
											previous.map((previousObject, i) =>
												i === index
													? {
															...previousObject,
															book: {
																...previousObject.book,
																toReadBookPosition: parseInt(
																	shelfPopupToReadInputs[index]
																),
															},
													  }
													: previousObject
											)
										);
										setAreShelfPopupsBottomHidden((previous) =>
											previous.map((value, i) => (i === index ? true : value))
										);
										setAreShelfPopupsHidden((previous) =>
											previous.map((value, i) => (i === index ? true : value))
										);
									}}
								>
									Save
								</button>
								<button
									className="progress-cancel-button"
									onClick={(_e) => {
										setAreShelfPopupsBottomHidden((previous) =>
											previous.map((value, i) => (i === index ? true : value))
										);
										setAreShelfPopupsHidden((previous) =>
											previous.map((value, i) => (i === index ? true : value))
										);
									}}
								>
									Cancel
								</button>
							</div>
						)}
					</div>
					<div className="shelf-pop-up-arrow-grey">
						<div className="shelf-pop-up-arrow"></div>
					</div>
				</div>
				<button
					className="remove-book-from-shelf to-read"
					onClick={(_e) => removeBookSafely(bookObject, index)}
				></button>
				<span>Want to Read</span>
			</div>
		) : (
			<button
				className="book-page-want-to-read-button"
				onClick={() => changeBookShelf(bookObject, index, 'to-read')}
			>
				{savingShelves[index] ? '...saving' : 'Want to Read'}
			</button>
		);
	};

	const generateBookOptionsDropdown = (bookObject, index) => {
		return (
			<div className="book-page-book-option-dropdown-trigger">
				<div className="book-options-dropdown">
					<div className="book-options-dropdown-top">
						<button
							className="dropdown-read-button"
							onClick={() => changeBookShelf(bookObject, index, 'read')}
						>
							Read
						</button>
						<button
							className="dropdown-currently-reading-button"
							onClick={() => changeBookShelf(bookObject, index, 'reading')}
						>
							Currently Reading
						</button>
						<button
							className="dropdown-want-to-read-button"
							onClick={() => changeBookShelf(bookObject, index, 'to-read')}
						>
							Want to Read
						</button>
					</div>
					<div className="book-options-dropdown-bottom">
						<button
							className="dropdown-add-shelf"
							onClick={(_e) =>
								setAreAddShelfInputSectionsHidden((previous) =>
									previous.map((value, i) => (i === index ? false : value))
								)
							}
						>
							Add Shelf
						</button>
						<div
							className={
								areAddShelfInputSectionsHidden[index]
									? 'dropdown-add-shelf-input-section hidden'
									: 'dropdown-add-shelf-input-section'
							}
						>
							<input
								className="dropdown-add-shelf-input"
								type="text"
								value={addShelfInputs[index]}
								onChange={(e) => {
									const newValue = e.target.value;
									setAddShelfInputs((previous) =>
										previous.map((value, i) => (i === index ? newValue : value))
									);
								}}
							></input>
							<button
								className="dropdown-add-shelf-add-button"
								onClick={async (_e) => {
									if (addShelfInputs[index].length > 0) {
										await Firebase.addBookToUserShelf(
											user.userUID,
											bookObject.rootBook,
											addShelfInputs[index],
											null,
											history
										);
										setAreAddShelfInputSectionsHidden((previous) =>
											previous.map((value, i) => (i === index ? true : value))
										);
									}
								}}
							>
								Add
							</button>
						</div>
					</div>
				</div>
			</div>
		);
	};

	const generateRateBookSection = (bookObject, index) => {
		return (
			<div className="book-page-rate-book">
				{bookObject.userRating === undefined ? null : (
					<button
						className="clear-rating-button"
						onClick={() => rateBook(bookObject, index, undefined)}
					>
						Clear rating
					</button>
				)}
				{bookObject.userRating === undefined ? (
					<span className="rate-this-book">Rate this book</span>
				) : (
					<span className="rate-this-book my-rating">My rating:</span>
				)}
				<div className="book-page-rate-book-star-rating">
					<div
						className={
							exhibitedStarRatings[index] > 0
								? 'interactive-star small on'
								: 'interactive-star small'
						}
						title="did not like it"
						onMouseOver={(_e) =>
							setExhibitedStarRatings((previous) =>
								previous.map((value, i) => (i === index ? 1 : value))
							)
						}
						onMouseLeave={(_e) =>
							setExhibitedStarRatings((previous) =>
								previous.map((value, i) =>
									i === index && bookObject.userRating !== undefined
										? bookObject.userRating
										: i === index
										? 0
										: value
								)
							)
						}
						onClick={() => rateBook(bookObject, index, 1)}
					></div>
					<div
						className={
							exhibitedStarRatings[index] > 1
								? 'interactive-star small on'
								: 'interactive-star small'
						}
						title="it was ok"
						onMouseOver={(_e) =>
							setExhibitedStarRatings((previous) =>
								previous.map((value, i) => (i === index ? 2 : value))
							)
						}
						onMouseLeave={(_e) =>
							setExhibitedStarRatings((previous) =>
								previous.map((value, i) =>
									i === index && bookObject.userRating !== undefined
										? bookObject.userRating
										: i === index
										? 0
										: value
								)
							)
						}
						onClick={() => rateBook(bookObject, index, 2)}
					></div>
					<div
						className={
							exhibitedStarRatings[index] > 2
								? 'interactive-star small on'
								: 'interactive-star small'
						}
						title="liked it"
						onMouseOver={(_e) =>
							setExhibitedStarRatings((previous) =>
								previous.map((value, i) => (i === index ? 3 : value))
							)
						}
						onMouseLeave={(_e) =>
							setExhibitedStarRatings((previous) =>
								previous.map((value, i) =>
									i === index && bookObject.userRating !== undefined
										? bookObject.userRating
										: i === index
										? 0
										: value
								)
							)
						}
						onClick={() => rateBook(bookObject, index, 3)}
					></div>
					<div
						className={
							exhibitedStarRatings[index] > 3
								? 'interactive-star small on'
								: 'interactive-star small'
						}
						title="really liked it"
						onMouseOver={(_e) =>
							setExhibitedStarRatings((previous) =>
								previous.map((value, i) => (i === index ? 4 : value))
							)
						}
						onMouseLeave={(_e) =>
							setExhibitedStarRatings((previous) =>
								previous.map((value, i) =>
									i === index && bookObject.userRating !== undefined
										? bookObject.userRating
										: i === index
										? 0
										: value
								)
							)
						}
						onClick={() => rateBook(bookObject, index, 4)}
					></div>
					<div
						className={
							exhibitedStarRatings[index] > 4
								? 'interactive-star small on'
								: 'interactive-star small'
						}
						title="it was amazing"
						onMouseOver={(_e) =>
							setExhibitedStarRatings((previous) =>
								previous.map((value, i) => (i === index ? 5 : value))
							)
						}
						onMouseLeave={(_e) =>
							setExhibitedStarRatings((previous) =>
								previous.map((value, i) =>
									i === index && bookObject.userRating !== undefined
										? bookObject.userRating
										: i === index
										? 0
										: value
								)
							)
						}
						onClick={() => rateBook(bookObject, index, 5)}
					></div>
				</div>
			</div>
		);
	};

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
							return (
								<div className="book-result-card" key={index}>
									<a
										className="cover-a"
										href={Firebase.pageGenerator.generateBookPage(
											book.id,
											book.title
										)}
									>
										<img
											src={book.cover !== undefined ? book.cover : noCoverUrl}
											alt={book.title}
										/>
									</a>
									<div className="right-section">
										<a
											className="book-title-a"
											href={Firebase.pageGenerator.generateBookPage(
												book.id,
												book.title
											)}
										>
											{book.title}
										</a>
										<span className="authorship-span">
											{'by '}
											<a
												href={Firebase.pageGenerator.generateAuthorPage(
													book.authorId,
													book.authorName
												)}
											>
												{book.authorName}
											</a>
										</span>
										<div className="other-info-section">
											<div className="search-page-general-rating-stars">
												<div
													className={
														book.averageRating >= 1
															? 'static-star small full'
															: book.averageRating >= 0.5
															? 'static-star small almost-full'
															: book.averageRating > 0
															? 'static-star small almost-empty'
															: 'static-star small empty'
													}
												></div>
												<div
													className={
														book.averageRating >= 2
															? 'static-star small full'
															: book.averageRating >= 1.5
															? 'static-star small almost-full'
															: book.averageRating > 1
															? 'static-star small almost-empty'
															: 'static-star small empty'
													}
												></div>
												<div
													className={
														book.averageRating >= 3
															? 'static-star small full'
															: book.averageRating >= 2.5
															? 'static-star small almost-full'
															: book.averageRating > 2
															? 'static-star small almost-empty'
															: 'static-star small empty'
													}
												></div>
												<div
													className={
														book.averageRating >= 4
															? 'static-star small full'
															: book.averageRating >= 3.5
															? 'static-star small almost-full'
															: book.averageRating > 3
															? 'static-star small almost-empty'
															: 'static-star small empty'
													}
												></div>
												<div
													className={
														book.averageRating >= 5
															? 'static-star small full'
															: book.averageRating >= 4.5
															? 'static-star small almost-full'
															: book.averageRating > 4
															? 'static-star small almost-empty'
															: 'static-star small empty'
													}
												></div>
											</div>
											<span>
												<span>{`${book.averageRating.toFixed(2)} avg rating — ${
													book.ratings
												} ratings ${
													book.publishedYear !== undefined
														? `— published ${book.publishedYear}`
														: ''
												} —`}</span>
												<a
													href={Firebase.pageGenerator.generateBookEditionsPage(
														book.id,
														book.title
													)}
												>{` ${book.numberOfEditions} editions`}</a>
											</span>
										</div>
										<div className="read-buy-section">
											<div className="shelves-rating">
												<div
													className={`want-to-read-button-and-options ${
														book.userStatus !== undefined ? book.userStatus : ''
													}`}
												>
													{generateAddToShelfButton(book, index)}
													{generateBookOptionsDropdown(book, index)}
												</div>
												{generateRateBookSection(book, index)}
											</div>
											{book.amazonLink !== undefined ? (
												<a className="get-a-copy-a" href={book.amazonLink}>
													Get a copy
												</a>
											) : null}
										</div>
									</div>
								</div>
							);
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
				{genre !== null ? (
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
						return (
							<div className="person-result-card" key={index}>
								<a
									className="person-image-a"
									href={Firebase.pageGenerator.generateUserPage(
										person.id,
										person.name.split(' ')[0]
									)}
								>
									<img
										src={
											person.profilePicture === undefined
												? noPictureImage
												: person.profilePicture
										}
										alt={person.name}
									/>
								</a>
								<div className="right-section">
									<a
										className="person-name-a"
										href={Firebase.pageGenerator.generateUserPage(
											person.id,
											person.name.split(' ')[0]
										)}
									>
										{person.name}
									</a>
									{person.location !== undefined ? (
										<span className="location-span">{person.location}</span>
									) : null}
									<a
										className="person-friends-a"
										href={Firebase.pageGenerator.generateUserFriendsPage(
											person.id,
											person.name
										)}
									>
										{person.numberOfFriends === 1
											? '1 friend'
											: `${person.numberOfFriends} friends`}
									</a>
									<a
										className="person-shelves-a"
										href={Firebase.pageGenerator.generateUserShelfPage(
											person.id,
											person.name.split(' ')[0]
										)}
									>
										{person.numberOfBooks === 1
											? '1 book'
											: `${person.numberOfBooks} books`}
									</a>
								</div>
							</div>
						);
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
									</a>{' '}
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
