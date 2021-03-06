import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Firebase from '../../Firebase';
import { format } from 'date-fns';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import '../styles/Books/BookEditionsPage.css';

const BookEditionsPage = ({ match }) => {
	const history = useHistory();
	const {
		params: { bookEditionsPageId },
	} = match;
	const bookId = bookEditionsPageId.split('.')[0];
	const bookTitle = bookEditionsPageId.split('.')[1].replace(/_/g, ' ');
	const [loaded, setLoaded] = useState(false);
	const [editionsInfo, setEditionsInfo] = useState([]);
	const [detailsExpanding, setDetailsExpanding] = useState([]);
	const [defaultExpanding, setDefaultExpanding] = useState(false);
	const [editionsPerPage, setEditionsPerPage] = useState(10);
	const [page, setPage] = useState(1);
	const [formatFilter, setFormatFilter] = useState('');
	const [sortOrder, setSortOrder] = useState('num ratings');
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

	const user = JSON.parse(localStorage.getItem('userState'));

	useEffect(() => {
		const getEditionsInfo = async () => {
			const lSObjectItem = localStorage.getItem(`editions${bookId}Obj`);
			if (lSObjectItem !== null) {
				const lSObject = JSON.parse(lSObjectItem).map((edition) => {
					return {
						...edition,
						publishedDate: new Date(edition.publishedDate),
					};
				});
				setEditionsInfo(lSObject);
				console.log('Loaded editions from storage');
				setDetailsExpanding(lSObject.map((_edition) => false));
				setSavingShelves(lSObject.map((_edition) => false));
				setAreAddShelfInputSectionsHidden(lSObject.map((_edition) => true));
				setAddShelfInputs(lSObject.map((_edition) => ''));
				setExhibitedStarRatings(
					lSObject.map((edition) =>
						edition.userRating !== undefined ? edition.userRating : 0
					)
				);
				setAreShelfPopupsHidden(lSObject.map((_edition) => true));
				setAreShelfPopupsBottomHidden(lSObject.map((_edition) => true));
				setShelfPopupReadingInputs(lSObject.map((_edition) => ''));
				setShelfPopupToReadInputs(lSObject.map((_edition) => ''));
			} else {
				const editionsObj = await Firebase.getEditionDetailsForBook(
					user.userUID,
					bookId
				);
				localStorage.setItem(
					`editions${bookId}Obj`,
					JSON.stringify(editionsObj)
				);
				setEditionsInfo(editionsObj);
				setDetailsExpanding(editionsObj.map((_edition) => false));
				setSavingShelves(editionsObj.map((_edition) => false));
				setAreAddShelfInputSectionsHidden(editionsObj.map((_edition) => true));
				setAddShelfInputs(editionsObj.map((_edition) => ''));
				setExhibitedStarRatings(
					editionsObj.map((edition) =>
						edition.userRating !== undefined ? edition.userRating : 0
					)
				);
				setAreShelfPopupsHidden(editionsObj.map((_edition) => true));
				setAreShelfPopupsBottomHidden(editionsObj.map((_edition) => true));
				setShelfPopupReadingInputs(editionsObj.map((_edition) => ''));
				setShelfPopupToReadInputs(editionsObj.map((_edition) => ''));
			}
			setLoaded(true);
		};
		getEditionsInfo();
	}, [bookId, user.userUID]);

	const displayRemoveBookConfirm = () => {
		return window.confirm(
			'Removing a book deletes your rating, review, etc. Remove this book from all your shelves?'
		);
	};

	const removeBookSafely = (bookId, index) => {
		if (displayRemoveBookConfirm()) {
			Firebase.removeBookFromShelf(user.userUID, bookId);
			setEditionsInfo((previous) => {
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

	const changeBookShelf = async (bookId, index, shelf) => {
		if (bookId !== undefined) {
			setSavingShelves((previous) =>
				previous.map((value, i) => (i === index ? true : value))
			);
			await Firebase.addBookToShelf(user.userUID, bookId, shelf, history);
			setEditionsInfo((previous) => {
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

	const rateBook = async (bookId, index, rating) => {
		if (bookId !== undefined) {
			await Firebase.rateBook(user.userUID, bookId, rating, history);
			setEditionsInfo((previous, i) => {
				return previous.map((previousObject, i) =>
					i === index
						? {
								...previousObject,
								userRating: rating,
						  }
						: previousObject
				);
			});
		}
	};

	const updateProgress = async (editionObject, index, pages) => {
		if (
			user.userUID !== null &&
			user.userUID !== undefined &&
			editionObject.id !== undefined &&
			pages.length > 0
		) {
			await Firebase.updateBookInShelf(
				user.userUID,
				editionObject.id,
				parseInt(pages)
			);
			setEditionsInfo((previous) => {
				return previous.map((previousObject, i) =>
					i === index
						? { ...previousObject, userProgress: pages }
						: previousObject
				);
			});
		}
	};

	const generateAddToShelfButton = (editionObject, index) => {
		return loaded && editionObject.userStatus === 'reading' ? (
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
								of {editionObject.pageCount}.{' '}
								<a
									href={
										user.userUID !== undefined && user.userUID !== null
											? Firebase.pageGenerator.generateUserShelfPage(
													user.userUID,
													user.userInfo.firstName,
													'reading'
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
									updateProgress(shelfPopupReadingInputs[index]);
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
									changeBookShelf('read');
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
					onClick={removeBookSafely}
				></button>
				<span>Currently Reading</span>
			</div>
		) : loaded && editionObject.userStatus === 'read' ? (
			<div className="book-on-read-shelf">
				<div className="shelf-pop-up-wrapper">
					<div className="shelf-pop-up read">
						<div className="shelf-pop-up-top">
							<a
								href={Firebase.pageGenerator.generateWriteReviewPageForBook(
									editionObject.id
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
												'to-read'
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
					onClick={removeBookSafely}
				></button>
				<span>Read</span>
			</div>
		) : loaded && editionObject.userStatus === 'to-read' ? (
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
													'to-read'
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
											editionObject.id,
											parseInt(shelfPopupToReadInputs[index])
										);
										setEditionsInfo((previous) =>
											previous.map((previousObject, i) =>
												i === index
													? {
															...previousObject,
															toReadBookPosition: parseInt(
																shelfPopupToReadInputs[index]
															),
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
					onClick={removeBookSafely}
				></button>
				<span>Want to Read</span>
			</div>
		) : (
			<button
				className="book-page-want-to-read-button"
				onClick={() => changeBookShelf('to-read')}
			>
				{savingShelves[index] ? '...saving' : 'Want to Read'}
			</button>
		);
	};

	const generateBookOptionsDropdown = (editionObject, index) => {
		return (
			<div className="book-page-book-option-dropdown-trigger">
				<div className="book-options-dropdown">
					<div className="book-options-dropdown-top">
						<button
							className="dropdown-read-button"
							onClick={() => changeBookShelf('read')}
						>
							Read
						</button>
						<button
							className="dropdown-currently-reading-button"
							onClick={() => changeBookShelf('reading')}
						>
							Currently Reading
						</button>
						<button
							className="dropdown-want-to-read-button"
							onClick={() => changeBookShelf('to-read')}
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
											editionObject.rootBook,
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

	const generateRateBookSection = (editionObject, index) => {
		return (
			<div className="book-page-rate-book">
				{editionObject.userRating === undefined ? null : (
					<button
						className="clear-rating-button"
						onClick={() => rateBook(undefined)}
					>
						Clear rating
					</button>
				)}
				{editionObject.userRating === undefined ? (
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
									i === index && editionObject.userRating !== undefined
										? editionObject.userRating
										: 0
								)
							)
						}
						onClick={() => rateBook(1)}
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
									i === index && editionObject.userRating !== undefined
										? editionObject.userRating
										: 0
								)
							)
						}
						onClick={() => rateBook(2)}
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
									i === index && editionObject.userRating !== undefined
										? editionObject.userRating
										: 0
								)
							)
						}
						onClick={() => rateBook(3)}
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
									i === index && editionObject.userRating !== undefined
										? editionObject.userRating
										: 0
								)
							)
						}
						onClick={() => rateBook(4)}
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
									i === index && editionObject.userRating !== undefined
										? editionObject.userRating
										: 0
								)
							)
						}
						onClick={() => rateBook(5)}
					></div>
				</div>
			</div>
		);
	};

	const generateEditionCard = (editionObject, index) => {
		const editionRatingCount =
			editionObject.fiveRatings +
			editionObject.fourRatings +
			editionObject.threeRatings +
			editionObject.twoRatings +
			editionObject.oneRatings;
		const editionAverageRating =
			editionRatingCount !== 0
				? (editionObject.fiveRatings * 5 +
						editionObject.fourRatings * 4 +
						editionObject.threeRatings * 3 +
						editionObject.twoRatings * 2 +
						editionObject.oneRatings) /
				  editionRatingCount
				: 0;

		return (
			<div className="book-editions-page-edition-card" key={index}>
				<div className="left-section">
					<div className="cover-section">
						<a
							href={Firebase.pageGenerator.generateBookPage(
								editionObject.id,
								editionObject.title
							)}
						>
							<img src={editionObject.cover} alt={editionObject.title} />
						</a>
					</div>
					<div className="info-section">
						<a
							className="edition-title-a"
							href={Firebase.pageGenerator.generateBookPage(
								editionObject.id,
								editionObject.title
							)}
						>
							{`${editionObject.title}${
								editionObject.type !== undefined
									? `(${editionObject.type})`
									: ''
							}`}
						</a>
						<span className="published-span">{`${
							editionObject.publishedDate !== undefined &&
							editionObject.publisher !== undefined
								? `Published ${format(
										editionObject.publishedDate,
										'MMMM do yyyy'
								  )} by ${editionObject.publisher}`
								: editionObject.publisher !== undefined
								? `Published by ${editionObject.publisher}`
								: editionObject.publishedDate !== undefined
								? `Published ${format(
										editionObject.publishedDate,
										'MMMM do yyyy'
								  )}`
								: ''
						}`}</span>
						<span className="format-and-pages">
							{editionObject.type !== undefined &&
							editionObject.pageCount !== undefined
								? `${editionObject.type}, ${editionObject.pageCount} pages`
								: editionObject.type !== undefined
								? `${editionObject.type}`
								: editionObject.pageCount !== undefined
								? `${editionObject.pageCount} pages`
								: ''}
						</span>
						<div
							className={
								detailsExpanding[index]
									? 'info-section-more-details'
									: 'info-section-more-details hidden'
							}
						>
							<div className="info-section-more-details-left">
								<span>Author(s):</span>
								{editionObject.ISBN !== undefined ? <span>ISBN:</span> : null}
								<span>Edition language:</span>
								<span>Average rating:</span>
							</div>
							<div className="info-section-more-details-right">
								<span className="authors-span">
									{editionObject.authorPages.map((authorPage, i) => {
										return (
											<span key={i}>
												<a href={authorPage}>{editionObject.authorNames[i]}</a>
												{i !== 0 ? (
													<span className="author-function">{` (${editionObject.authorFunctions[i]})`}</span>
												) : null}
												{i !== editionsInfo.length - 1 ? ', ' : ''}
											</span>
										);
									})}
								</span>
								{editionObject.ISBN !== undefined ? (
									<span>{editionObject.ISBN}</span>
								) : null}
								<span>{editionObject.language}</span>
								<span className="average-rating-span">
									<span className="rating-value-span">
										{Math.round(editionAverageRating, 2)}
									</span>
									<span className="rating-count-span">{`(${editionRatingCount} ratings)`}</span>
								</span>
							</div>
						</div>
						<button
							className="more-less-detail-button"
							onClick={(_e) => {
								setDetailsExpanding((previous) =>
									previous.map((previousValue, i) =>
										i === index ? !previousValue : previousValue
									)
								);
							}}
						>
							{detailsExpanding[index] ? 'less detail' : 'more detail'}
						</button>
					</div>
				</div>
				<div className="right-section">
					{generateAddToShelfButton(editionObject, index)}
					{generateBookOptionsDropdown(editionObject, index)}
					{generateRateBookSection(editionObject, index)}
				</div>
			</div>
		);
	};

	const sortedEditionCards = loaded
		? editionsInfo
				.map((edition, index) => generateEditionCard(edition, index))
				.sort((a, b) => {
					const aRatingCount =
						a.fiveRatings +
						a.fourRatings +
						a.threeRatings +
						a.twoRatings +
						a.oneRatings;
					const aAverageRating =
						aRatingCount !== 0
							? (a.fiveRatings * 5 +
									a.fourRatings * 4 +
									a.threeRatings * 3 +
									a.twoRatings * 2 +
									a.oneRatings) /
							  aRatingCount
							: 0;
					const bRatingCount =
						b.fiveRatings +
						b.fourRatings +
						b.threeRatings +
						b.twoRatings +
						b.oneRatings;
					const bAverageRating =
						bRatingCount !== 0
							? (b.fiveRatings * 5 +
									b.fourRatings * 4 +
									b.threeRatings * 3 +
									b.twoRatings * 2 +
									b.oneRatings) /
							  bRatingCount
							: 0;
					switch (sortOrder) {
						case 'title':
							return a.title < b.title ? -1 : 1;
						case 'original date published':
							return a.publishedDate - b.publishedDate;
						case 'date published':
							return b.publishedDate - a.publishedDate;
						case 'avg rating':
							return bAverageRating - aAverageRating;
						case 'num ratings':
							return bRatingCount - aRatingCount;
						case 'format':
							return a.type < b.type ? -1 : 1;
						default:
							return -1;
					}
				})
		: null;

	const editionCardList = loaded ? (
		<div className="book-editions-page-edition-card-list">
			{sortedEditionCards.length > 0 ? (
				sortedEditionCards.filter((_editionCard, index) => {
					return (
						index >= (page - 1) * 10 &&
						index + 1 <= (page - 1) * 10 + editionsPerPage
					);
				})
			) : (
				<span className="no-editions-with-format-span">{`There are no editions with format ${formatFilter}.`}</span>
			)}
			{Math.ceil(sortedEditionCards.length / editionsPerPage) > 1 ? (
				<div className="page-navigation-section">
					<button
						onClick={setPage((previous) => previous - 1)}
						disabled={page === 1}
					>
						« previous
					</button>
					{Array.from(
						{
							length: Math.ceil(sortedEditionCards.length / editionsPerPage),
						},
						(_x, i) => i + 1
					).map((number) => {
						return (
							<button onClick={setPage(number)} disabled={page === number}>
								{number}
							</button>
						);
					})}
					<button
						onClick={setPage((previous) => previous + 1)}
						disabled={
							page === Math.ceil(sortedEditionCards.length / editionsPerPage)
						}
					>
						next »
					</button>
				</div>
			) : null}
		</div>
	) : null;

	const editionsPerPageSelectionArea = loaded ? (
		<div className="editions-per-page-selection-area">
			<label htmlFor="editions-per-page">per page</label>
			<select
				name="editions-per-page"
				value={editionsPerPage}
				onChange={(e) => setEditionsPerPage(parseInt(e.target.value))}
			>
				<option value="10">10</option>
				<option value="25">25</option>
				<option value="50">50</option>
				<option value="75">75</option>
				<option value="100">100</option>
			</select>
		</div>
	) : null;

	const pageTitle = (
		<div className="book-editions-page-title">
			<a href={Firebase.pageGenerator.generateBookPage(bookId, bookTitle)}>
				{bookTitle}
			</a>
			<span>{'>'}</span>
			<span>Editions</span>
		</div>
	);

	const pageInfoAndFiltersTop = loaded ? (
		<div className="book-editions-page-info-and-filters-top">
			<div className="book-editions-page-info-and-filters-top-left">
				<span className="author-name-field">
					<span>{'by '}</span>
					<a href={editionsInfo[0].authorPages[0]}>
						{editionsInfo[0].authorNames[0]}
					</a>
				</span>
				<span className="first-published-date-field">
					{`First published ${format(
						editionsInfo.reduce((previous, current) => {
							if (
								previous.publishedDate === undefined ||
								current.publishedDate < previous.publishedDate
							) {
								return current.publishedDate;
							}
							return previous.publishedDate;
						}, editionsInfo[0].publishedDate),
						'MMMM do yyyy'
					)}`}
				</span>
			</div>
			<div className="book-editions-page-info-and-filters-top-right">
				<button
					className="expand-collapse-details-button"
					onClick={(_e) => {
						if (defaultExpanding) {
							setDetailsExpanding((previous) =>
								previous.map((_value) => false)
							);
							setDefaultExpanding(false);
						} else {
							setDetailsExpanding((previous) => previous.map((_value) => true));
							setDefaultExpanding(true);
						}
					}}
				>
					{defaultExpanding ? 'collapse details' : 'expand details'}
				</button>
				<a
					className="add-new-edition-a"
					href={Firebase.pageGenerator.generateAddBookPage()}
				>
					Add a new edition
				</a>
			</div>
		</div>
	) : null;

	const pageInfoAndFiltersBottom = loaded ? (
		<div className="book-editions-page-info-and-filters-bottom">
			<div className="book-editions-page-info-and-filters-bottom-left">
				<span className="editions-bold">Editions</span>
				<span className="page-showing-numbers-span">{`Showing ${
					sortedEditionCards.length > 0 ? (page - 1) * 10 + 1 : 0
				}-${
					(page - 1) * 10 + editionsPerPage <= sortedEditionCards.length
						? (page - 1) * 10 + editionsPerPage
						: sortedEditionCards.length
				} of ${sortedEditionCards.length}`}</span>
			</div>
			<div className="book-editions-page-info-and-filters-bottom-right">
				<label htmlFor="format">Format</label>
				<select
					name="format"
					value={formatFilter}
					className="format-select"
					onChange={(e) => setFormatFilter(e.target.value)}
				>
					<option value=""></option>
					<option value="Paperback">Paperback</option>
					<option value="Hardcover">Hardcover</option>
					<option value="Mass Market Paperback">Mass Market Paperback</option>
					<option value="Kindle Edition">Kindle Edition</option>
					<option value="Nook">Nook</option>
					<option value="ebook">ebook</option>
					<option value="Library Binding">Library Binding</option>
					<option value="Audiobook">Audiobook</option>
					<option value="Audio CD">Audio CD</option>
					<option value="Audio Cassette">Audio Cassette</option>
					<option value="Audible Audio">Audible Audio</option>
					<option value="CD-ROM">CD-ROM</option>
					<option value="MP3 CD">MP3 CD</option>
					<option value="Board book">Board book</option>
					<option value="Leather Bound">Leather Bound</option>
					<option value="Unbound">Unbound</option>
					<option value="Spiral-bound">Spiral-bound</option>
					<option value="Unknown Binding">Unknown Binding</option>
				</select>
				<label htmlFor="sort-order">Sort by</label>
				<select
					name="sort-order"
					value={sortOrder}
					className="sort-order-select"
					onChange={(e) => setSortOrder(e.target.value)}
				>
					<option value="Paperback">Paperback</option>
					<option value="title">title</option>
					<option value="original date published">
						original date published
					</option>
					<option value="date published">date published</option>
					<option value="avg rating">avg rating</option>
					<option value="num ratings">num ratings</option>
					<option value="format">format</option>
				</select>
			</div>
		</div>
	) : null;

	const pageInfoAndFilters = (
		<div className="page-info-and-filters">
			{pageInfoAndFiltersTop}
			{pageInfoAndFiltersBottom}
		</div>
	);

	const mainContent = loaded ? (
		<div className="book-editions-page-main-content">
			{pageTitle}
			{pageInfoAndFilters}
			{editionCardList}
			{editionsPerPageSelectionArea}
		</div>
	) : null;

	return (
		<div className="book-editions-page">
			<TopBar />
			{mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default BookEditionsPage;
