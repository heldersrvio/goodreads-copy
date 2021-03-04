import React, { useEffect, useState, useLayoutEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Firebase from '../../Firebase';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';

const SimilarBooksPage = ({ match }) => {
	const history = useHistory();
	const {
		params: { similarBooksPageId },
	} = match;
	const [bookInfo, setBookInfo] = useState({ title: '', cover: '' });
	const [loaded, setLoaded] = useState(false);
	const [savingShelves, setSavingShelves] = useState([]);
	const [synopsisHaveButton, setSynopsisHaveButton] = useState([]);
	const [synopsisShowingMore, setSynopsisShowingMore] = useState([]);
	const [
		areAddShelfInputSectionsHidden,
		setAreAddShelfInputSectionsHidden,
	] = useState([]);
	const [addShelfInputs, setAddShelfInputs] = useState([]);
	const [exhibitedStarRatings, setExhibitedStarRatings] = useState([]);

	const user = JSON.parse(localStorage.getItem('userState'));

	useEffect(() => {
		const getBookInfo = async () => {
			let bookId = '';
			let i = 0;
			while (i < similarBooksPageId.length) {
				if (similarBooksPageId[i] !== '.') {
					bookId += similarBooksPageId[i];
				} else {
					break;
				}
				i++;
			}
			/*const lSObjectItem = localStorage.getItem(`alsoEnjoyed${bookId}Obj`);
			if (lSObjectItem !== null) {
				const lSObject = JSON.parse(lSObjectItem);
				console.log('Loaded book from storage');
				const newLSObject = {};
				Object.keys(lSObject).forEach((key) => {
					switch (key) {
						case 'editionPublishedDate':
							newLSObject[key] = new Date(2006, 9, 1);
							break;
						/case 'otherEditionsPages':
							newLSObject[key] = [
								'/book/show/6277040.the-dark-tower',
								'book/show/408854.The_Dark_Tower',
								'/book/show/11227306.the-dark-tower',
								'/book/show/10091130.la-torre-nera',
								'/book/show/17670090.5170336934',
								'/book/show/6746616.la-torre-oscura',
							];
							break;
						case 'otherEditionsCovers':
							newLSObject[key] = [
								'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1433530080l/6277040._SY475_.jpg',
								'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1532335721l/408854.jpg',
								'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1494166372l/11227306._SY475_.jpg',
								'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1302708142l/10091130.jpg',
								'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1364053865l/17670090.jpg',
								'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1590518878l/6746616._SY475_.jpg',
							];
							break;
						case 'oneRatings':
							newLSObject[key] = 5;
							break;
						case 'twoRatings':
							newLSObject[key] = 2;
							break;
						case 'threeRatings':
							newLSObject[key] = 11;
							break;
						case 'fourRatings':
							newLSObject[key] = 15;
							break;
						case 'fiveRatings':
							newLSObject[key] = 20;
							break;/
						case 'reviews':
							newLSObject[key] = [{}];
							Object.keys(lSObject[key][0]).forEach((key2) => {
								if (key2 === 'date') {
									newLSObject[key][0][key2] = new Date(2021, 2, 1);
								} else {
									newLSObject[key][0][key2] = lSObject[key][0][key2];
								}
							});
							break;
						case 'thisEditionRating':
							console.log(lSObject[key]);
							newLSObject[key] = lSObject[key];
							break;
						default:
							newLSObject[key] = lSObject[key];
					}
				});
				newLSObject.reviews[0].shelves = [
					'alt-universes',
					'fantasy',
					'magic',
					'favorite',
					'dark-tower-2011-western-vampires',
					'time-travel',
					'uncle-steview',
				];
				newLSObject.reviews[0].rating = 4;
				newLSObject.reviews[0].likedByUser = false;
				newLSObject.rootBook = 'KiX9EuoW7aRFd296zeDn';
				newLSObject.userIsFollowingAuthor = false;
				newLSObject.mainAuthorId = 'eIqpFmjgPfIO6VU3FH8x';
				setBookInfo(newLSObject);
				if (newLSObject.userRating !== undefined) {
					setExhibitedStarRating(newLSObject.userRating);
				}
			} else {*/
			const bookObj = await Firebase.getAlsoEnjoyedBooksDetailsForBook(
				user.userUID,
				bookId
			);
			localStorage.setItem(`alsoEnjoyed${bookId}Obj`, JSON.stringify(bookObj));
			setBookInfo(bookObj);
			//}
			setLoaded(true);
		};
		getBookInfo();
	}, [similarBooksPageId, user.userUID]);

	useLayoutEffect(() => {
		const synopsis = document.getElementsByClassName('synopsis');
		setSynopsisHaveButton(Array.from(synopsis).map((p) => p.scrollHeight > 36));
		if (loaded) {
			setSynopsisShowingMore(
				[bookInfo.mainBook, ...bookInfo.alsoEnjoyedBooks].map((_book) => false)
			);
			setAreAddShelfInputSectionsHidden(
				[bookInfo.mainBook, ...bookInfo.alsoEnjoyedBooks].map((_book) => true)
			);
			setAddShelfInputs(
				[bookInfo.mainBook, ...bookInfo.alsoEnjoyedBooks].map((_book) => '')
			);
			setExhibitedStarRatings(
				[bookInfo.mainBook, ...bookInfo.alsoEnjoyedBooks].map((book) =>
					book.userRating !== undefined ? book.userRating : 0
				)
			);
		}
	}, [loaded, bookInfo.mainBook, bookInfo.alsoEnjoyedBooks]);

	const displayRemoveBookConfirm = () => {
		return window.confirm(
			'Removing a book deletes your rating, review, etc. Remove this book from all your shelves?'
		);
	};

	const removeBookSafely = (bookId, index) => {
		if (displayRemoveBookConfirm()) {
			Firebase.removeBookFromShelf(user.userUID, bookId);
			setBookInfo((previous) => {
				if (index === 0) {
					return {
						...previous,
						mainBook: {
							...previous.mainBook,
							userStatus: undefined,
							userProgress: undefined,
							userRating: undefined,
						},
					};
				}
				return {
					...previous,
					alsoEnjoyedBooks: previous.alsoEnjoyedBooks.map((previousObject, i) =>
						i === index
							? {
									...previousObject,
									userStatus: undefined,
									userProgress: undefined,
									userRating: undefined,
							  }
							: previousObject
					),
				};
			});
		}
	};

	const changeBookShelf = async (bookId, index, shelf) => {
		if (bookId !== undefined) {
			setSavingShelves((previous) =>
				previous.map((value, i) => (i === index ? true : value))
			);
			await Firebase.addBookToShelf(user.userUID, bookId, shelf, history);
			setBookInfo((previous) => {
				if (index === 0) {
					return {
						...previous,
						mainBook: {
							...previous.mainBook,
							userStatus: shelf,
						},
					};
				}
				return {
					...previous,
					alsoEnjoyedBooks: previous.alsoEnjoyedBooks.map((previousObject, i) =>
						i === index
							? {
									...previousObject,
									userStatus: shelf,
							  }
							: previousObject
					),
				};
			});
			setSavingShelves((previous) =>
				previous.map((value, i) => (i === index ? false : value))
			);
		}
	};

	const rateBook = async (bookId, index, rating) => {
		if (bookInfo.id !== undefined) {
			await Firebase.rateBook(user.userUID, bookId, rating, history);
			setBookInfo((previous, i) => {
				if (index === 0) {
					return {
						...previous,
						mainBook: {
							...previous.mainBook,
							userRating: rating,
						},
					};
				}
				return {
					...previous,
					alsoEnjoyedBooks: previous.alsoEnjoyedBooks.map((previousObject, i) =>
						i === index
							? {
									...previousObject,
									userRating: rating,
							  }
							: previousObject
					),
				};
			});
		}
	};

	const pageIndicator = loaded ? (
		<div className="similar-books-page-page-indicator">
			<a
				href={Firebase.pageGenerator.generateAuthorPage(
					bookInfo.mainBook.authorId,
					bookInfo.mainBook.authorName
				)}
			>
				{bookInfo.mainBook.authorName}
			</a>
			<span className="similar-books-page-page-indicator-arrow"></span>
			<a
				href={Firebase.pageGenerator.generateBookPage(
					bookInfo.mainBook.id,
					bookInfo.mainBook.title
				)}
			>
				{bookInfo.mainBook.title}
			</a>
			<span className="similar-books-page-page-indicator-arrow"></span>
			<span>Similar books</span>
		</div>
	) : null;

	const title = loaded ? (
		<h1 className="similar-books-page-title">{`Books similar to ${
			bookInfo.mainBook.title
		}${
			bookInfo.mainBook.series !== undefined
				? ` (${bookInfo.mainBook.series}, #${bookInfo.mainBook.seriesInstance})`
				: ''
		}`}</h1>
	) : null;

	const generateAddToShelfButton = (bookObject, index) => {
		return loaded && bookInfo.userStatus === 'reading' ? (
			<div className="book-on-reading-shelf">
				<button
					className="remove-book-from-shelf reading"
					onClick={(_e) => removeBookSafely(bookObject.id, index)}
				></button>
				<span>Currently Reading</span>
			</div>
		) : loaded && bookInfo.userStatus === 'read' ? (
			<div className="book-on-read-shelf">
				<button
					className="remove-book-from-shelf read"
					onClick={(_e) => removeBookSafely(bookObject.id, index)}
				></button>
				<span>Read</span>
			</div>
		) : loaded && bookInfo.userStatus === 'to-read' ? (
			<div className="book-on-to-read-shelf">
				<button
					className="remove-book-from-shelf to-read"
					onClick={(_e) => removeBookSafely(bookObject.id, index)}
				></button>
				<span>Want to Read</span>
			</div>
		) : (
			<button
				className="book-page-want-to-read-button"
				onClick={() => changeBookShelf(bookObject.id, index, 'to-read')}
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
							onClick={() => changeBookShelf(bookObject.id, index, 'read')}
						>
							Read
						</button>
						<button
							className="dropdown-currently-reading-button"
							onClick={() => changeBookShelf(bookObject.id, index, 'reading')}
						>
							Currently Reading
						</button>
						<button
							className="dropdown-want-to-read-button"
							onClick={() => changeBookShelf(bookObject.id, index, 'to-read')}
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
								onChange={(e) =>
									setAddShelfInputs((previous) =>
										previous.map((value, i) =>
											i === index ? e.target.value : value
										)
									)
								}
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

	const generateBookCard = (bookObject, index) => {
		const ratingCount =
			bookObject.fiveRatings +
			bookObject.fourRatings +
			bookObject.threeRatings +
			bookObject.twoRatings +
			bookObject.oneRatings;

		const generalRating =
			ratingCount !== 0
				? (
						(bookObject.fiveRatings * 5 +
							bookObject.fourRatings * 4 +
							bookObject.threeRatings * 3 +
							bookObject.twoRatings * 2 +
							bookObject.oneRatings) /
						ratingCount
				  ).toFixed(2)
				: 0;

		return (
			<div className="similar-books-page-book-card" key={index}>
				<div className="similar-books-page-book-card-left-section">
					<a
						href={Firebase.pageGenerator.generateBookPage(
							bookObject.id,
							bookObject.title
						)}
					>
						<img src={bookObject.cover} alt={bookObject.title} />
					</a>
				</div>
				<div className="similar-books-page-book-card-right-section">
					<h2 className="book-card-book-title">{`${bookObject.title}${
						bookObject.series !== undefined
							? ` (${bookObject.series}, #${bookObject.seriesInstance})`
							: ''
					}`}</h2>
					<span className="author-span">
						by{' '}
						<a
							href={Firebase.pageGenerator.generateAuthorPage(
								bookObject.authorId,
								bookObject.authorName
							)}
						>
							{bookObject.authorName}
						</a>
						{bookObject.authorIsMember ? (
							<div className="goodreads-seal"></div>
						) : null}
					</span>
					<div className="book-page-general-rating">
						<div className="book-page-general-rating-stars">
							<div
								className={
									generalRating >= 1
										? 'static-star small full'
										: generalRating >= 0.5
										? 'static-star small almost-full'
										: generalRating > 0
										? 'static-star small almost-empty'
										: 'static-star small empty'
								}
							></div>
							<div
								className={
									generalRating >= 2
										? 'static-star small full'
										: generalRating >= 1.5
										? 'static-star small almost-full'
										: generalRating > 1
										? 'static-star small almost-empty'
										: 'static-star small empty'
								}
							></div>
							<div
								className={
									generalRating >= 3
										? 'static-star small full'
										: generalRating >= 2.5
										? 'static-star small almost-full'
										: generalRating > 2
										? 'static-star small almost-empty'
										: 'static-star small empty'
								}
							></div>
							<div
								className={
									generalRating >= 4
										? 'static-star small full'
										: generalRating >= 3.5
										? 'static-star small almost-full'
										: generalRating > 3
										? 'static-star small almost-empty'
										: 'static-star small empty'
								}
							></div>
							<div
								className={
									generalRating >= 5
										? 'static-star small full'
										: generalRating >= 4.5
										? 'static-star small almost-full'
										: generalRating > 4
										? 'static-star small almost-empty'
										: 'static-star small empty'
								}
							></div>
						</div>
						<span>
							{!isNaN(generalRating) ? `${generalRating} avg. rating` : ''}
						</span>
						<span className="separator-dot">·</span>
						<span>{`${ratingCount} Ratings`}</span>
					</div>
					<div className="book-page-synopsis-wrapper">
						<div
							className={
								synopsisShowingMore[index]
									? 'book-page-synopsis-area-full'
									: 'book-page-synopsis-area'
							}
						>
							{bookObject.preSynopsis !== undefined ? (
								<p className="pre-synopsis">
									<b>{bookObject.preSynopsis}</b>
								</p>
							) : null}
							<p className="synopsis">{bookObject.synopsis}</p>
						</div>
						{synopsisHaveButton[index] ? (
							<button
								className="synopsis-show-more"
								onClick={(_e) => {
									setSynopsisShowingMore((previous) =>
										previous.map((value, i) => (i === index ? !value : value))
									);
								}}
							>
								{synopsisShowingMore[index] ? '(less)' : '...more'}
							</button>
						) : null}
					</div>
					<div className="shelf-and-ratings-section">
						<div className="shelf-section">
							{generateAddToShelfButton(bookObject, index)}
							{generateBookOptionsDropdown(bookObject, index)}
						</div>
						<div className="rating-section">
							{bookObject.userRating === undefined ? (
								<span>Rate it: </span>
							) : (
								<span>Your rating: </span>
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
									onClick={() => rateBook(bookObject.id, index, 1)}
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
									onClick={() => rateBook(bookObject.id, index, 2)}
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
									onClick={() => rateBook(bookObject.id, index, 3)}
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
									onClick={() => rateBook(bookObject.id, index, 4)}
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
									onClick={() => rateBook(bookObject.id, index, 5)}
								></div>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	};

	const mainContent = loaded ? (
		<div className="similar-books-page-main-content">
			{pageIndicator}
			{title}
			<div className="main-book-card">
				{generateBookCard(bookInfo.mainBook, 0)}
			</div>
			<span>Goodreads members who liked this book also liked:</span>
			<div className="similar-books-cards">
				{bookInfo.alsoEnjoyedBooks.map((book, index) =>
					generateBookCard(book, index + 1)
				)}
			</div>
		</div>
	) : null;

	return (
		<div className="similar-books-page">
			<TopBar />
			{mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default SimilarBooksPage;
