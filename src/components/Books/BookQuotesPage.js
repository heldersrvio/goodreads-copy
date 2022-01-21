import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';
import '../styles/Books/BookQuotesPage.css';
import { trackPromise } from 'react-promise-tracker';

const BookQuotesPage = ({ match }) => {
	const history = useHistory();
	const {
		params: { bookQuotesPageId },
	} = match;
	const bookId = bookQuotesPageId.split('-')[0];
	const bookTitle = bookQuotesPageId
		.split('-')
		.slice(1)
		.map((string) => string[0].toUpperCase() + string.slice(1))
		.join(' ');
	const [loaded, setLoaded] = useState(false);
	const [bookInfo, setBookInfo] = useState({});
	const [page, setPage] = useState(1);
	const [isShelfPopupHidden, setIsShelfPopupHidden] = useState(true);
	const [isShelfPopupBottomHidden, setIsShelfPopupBottomHidden] = useState(
		true
	);
	const [
		isAddShelfInputSectionHidden,
		setIsAddShelfInputSectionHidden,
	] = useState(true);
	const [addShelfInput, setAddShelfInput] = useState('');
	const [shelfPopupReadingInput, setShelfPopupReadingInput] = useState('');
	const [shelfPopupToReadInput, setShelfPopupToReadInput] = useState('');
	const [exhibitedStarRating, setExhibitedStarRating] = useState(0);
	const [savingShelf, setSavingShelf] = useState(false);
	const [userLikedQuotes, setUserLikedQuotes] = useState([]);
	const [searchInput, setSearchInput] = useState('');

	const user = JSON.parse(localStorage.getItem('userState'));

	useEffect(() => {
		const getBookInfo = async () => {
			setBookInfo(
				await trackPromise(
					Firebase.getBookInfoForQuotesPage(user.userUID, bookId)
				)
			);
			setLoaded(true);
		};
		getBookInfo();
	}, [bookId, user.userUID]);

	const displayRemoveBookConfirm = () => {
		return window.confirm(
			'Removing a book deletes your rating, review, etc. Remove this book from all your shelves?'
		);
	};

	const removeBookSafely = () => {
		if (displayRemoveBookConfirm()) {
			Firebase.removeBookFromShelf(user.userUID, bookId);
			setBookInfo((previous) => {
				return {
					...previous,
					userStatus: undefined,
					userProgress: undefined,
					userRating: undefined,
				};
			});
		}
	};

	const changeBookShelf = async (shelf) => {
		setSavingShelf(true);
		await Firebase.addBookToShelf(user.userUID, bookId, shelf, history);
		setBookInfo((previous) => {
			return {
				...previous,
				userStatus: shelf,
			};
		});
		setSavingShelf(false);
	};

	const rateBook = async (rating) => {
		await Firebase.rateBook(user.userUID, bookId, rating, history);
		setBookInfo((previous) => {
			return {
				...previous,
				userStatus:
					previous.userStatus !== undefined ? previous.userStatus : 'read',
				userRating: rating,
			};
		});
	};

	const updateProgress = async (pages) => {
		if (
			user.userUID !== null &&
			user.userUID !== undefined &&
			pages.length > 0
		) {
			await Firebase.updateBookInShelf(user.userUID, bookId, parseInt(pages));
			setBookInfo((previous) => {
				return {
					...previous,
					userProgress: parseInt(pages),
				};
			});
		}
	};

	const pageHeader = (
		<h1 className="book-quotes-page-header">{`${bookTitle} Quotes`}</h1>
	);

	const addToShelfButton =
		loaded && bookInfo.userStatus === 'reading' ? (
			<div className="book-on-reading-shelf">
				<div
					className={
						isShelfPopupHidden
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
									value={shelfPopupReadingInput}
									className={
										isShelfPopupBottomHidden
											? 'page-progress-input'
											: 'page-progress-input white-background'
									}
									onClick={(_e) => {
										setIsShelfPopupBottomHidden(false);
										setIsShelfPopupHidden(false);
									}}
									onChange={(e) => setShelfPopupReadingInput(e.target.value)}
								/>{' '}
								of {bookInfo.pageCount}.{' '}
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
								isShelfPopupBottomHidden
									? 'shelf-pop-up-bottom hidden'
									: 'shelf-pop-up-bottom'
							}
						>
							<button
								className="progress-submit-button"
								onClick={(_e) => {
									updateProgress(shelfPopupReadingInput);
									setIsShelfPopupHidden(true);
									setIsShelfPopupBottomHidden(true);
								}}
							>
								Submit
							</button>
							<button
								className="progress-cancel-button"
								onClick={(_e) => {
									setIsShelfPopupHidden(true);
									setIsShelfPopupBottomHidden(true);
								}}
							>
								Cancel
							</button>
							<span>·</span>
							<button
								className="progress-finished-button"
								onClick={(_e) => {
									changeBookShelf('read');
									setIsShelfPopupHidden(true);
									setIsShelfPopupBottomHidden(true);
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
		) : loaded && bookInfo.userStatus === 'read' ? (
			<div className="book-on-read-shelf">
				<div className="shelf-pop-up-wrapper">
					<div className="shelf-pop-up read">
						<div className="shelf-pop-up-top">
							<a
								href={Firebase.pageGenerator.generateWriteReviewPageForBook(
									bookInfo.id
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
					onClick={removeBookSafely}
				></button>
				<span>Read</span>
			</div>
		) : loaded && bookInfo.userStatus === 'to-read' ? (
			<div className="book-on-to-read-shelf">
				<div
					className={
						isShelfPopupHidden
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
									value={shelfPopupToReadInput}
									className="shelf-pop-up-to-read-input"
									onChange={(e) => setShelfPopupToReadInput(e.target.value)}
									onClick={(_e) => {
										setIsShelfPopupHidden(false);
										setIsShelfPopupBottomHidden(false);
									}}
								/>{' '}
								on your <b>To Read</b> shelf.
							</span>
						</div>
						{isShelfPopupBottomHidden ? (
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
											bookInfo.id,
											parseInt(shelfPopupToReadInput)
										);
										setBookInfo((previous) => {
											return {
												...previous,
												toReadBookPosition: parseInt(shelfPopupToReadInput),
											};
										});
										setIsShelfPopupHidden(true);
										setIsShelfPopupBottomHidden(true);
									}}
								>
									Save
								</button>
								<button
									className="progress-cancel-button"
									onClick={(_e) => {
										setIsShelfPopupHidden(true);
										setIsShelfPopupBottomHidden(true);
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
				{savingShelf ? '...saving' : 'Want to Read'}
			</button>
		);

	const bookOptionsDropdown = (
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
						onClick={(_e) => setIsAddShelfInputSectionHidden(false)}
					>
						Add Shelf
					</button>
					<div
						className={
							isAddShelfInputSectionHidden
								? 'dropdown-add-shelf-input-section hidden'
								: 'dropdown-add-shelf-input-section'
						}
					>
						<input
							className="dropdown-add-shelf-input"
							type="text"
							value={addShelfInput}
							onChange={(e) => setAddShelfInput(e.target.value)}
						></input>
						<button
							className="dropdown-add-shelf-add-button"
							onClick={async (_e) => {
								if (addShelfInput.length > 0) {
									await Firebase.addBookToUserShelf(
										user.userUID,
										bookInfo.rootBook,
										addShelfInput,
										null,
										history
									);
									setIsAddShelfInputSectionHidden(true);
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

	const bookCard = loaded ? (
		<div className="book-quotes-page-book-card">
			<div className="left-section">
				<a
					className="cover-wrapper"
					href={Firebase.pageGenerator.generateBookPage(bookId, bookTitle)}
				>
					<img
						src={
							bookInfo.cover !== undefined
								? bookInfo.cover
								: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png'
						}
						alt={bookTitle}
					/>
				</a>
				<div className="book-info">
					<span className="book-title">
						<a
							className="book-title-bold"
							href={Firebase.pageGenerator.generateBookPage(bookId, bookTitle)}
						>
							{bookTitle}
						</a>{' '}
						by{' '}
						<a
							className="author-name"
							href={Firebase.pageGenerator.generateAuthorPage(
								bookInfo.authorId,
								bookInfo.authorName
							)}
						>
							{bookInfo.authorName}
						</a>
					</span>
					<span className="numbers">{`${bookInfo.numberOfRatings} ratings, ${bookInfo.averageRating} average rating, ${bookInfo.numberOfReviews} reviews`}</span>
				</div>
			</div>
			<div className="right-section">
				<div className="book-page-user-shelf-section">
					<div className="add-to-shelf-buttons">
						<div
							className={`want-to-read-button-and-options ${
								bookInfo.userStatus !== undefined
									? bookInfo.userStatus
									: 'to-read'
							}`}
						>
							{addToShelfButton}
							{bookOptionsDropdown}
						</div>
					</div>
				</div>
				<div className="book-page-rate-book">
					{bookInfo.userRating === undefined ? null : (
						<button
							className="clear-rating-button"
							onClick={() => rateBook(undefined)}
						>
							Clear rating
						</button>
					)}
					{bookInfo.userRating === undefined ? (
						<span className="rate-this-book">Rate this book</span>
					) : (
						<span className="rate-this-book my-rating">My rating:</span>
					)}
					<div className="book-page-rate-book-star-rating">
						<div
							className={
								exhibitedStarRating > 0
									? 'interactive-star small on'
									: 'interactive-star small'
							}
							title="did not like it"
							onMouseOver={(_e) => setExhibitedStarRating(1)}
							onMouseLeave={(_e) =>
								setExhibitedStarRating(
									bookInfo.userRating === undefined ? 0 : bookInfo.userRating
								)
							}
							onClick={() => rateBook(1)}
						></div>
						<div
							className={
								exhibitedStarRating > 1
									? 'interactive-star small on'
									: 'interactive-star small'
							}
							title="it was ok"
							onMouseOver={(_e) => setExhibitedStarRating(2)}
							onMouseLeave={(_e) =>
								setExhibitedStarRating(
									bookInfo.userRating === undefined ? 0 : bookInfo.userRating
								)
							}
							onClick={() => rateBook(2)}
						></div>
						<div
							className={
								exhibitedStarRating > 2
									? 'interactive-star small on'
									: 'interactive-star small'
							}
							title="liked it"
							onMouseOver={(_e) => setExhibitedStarRating(3)}
							onMouseLeave={(_e) =>
								setExhibitedStarRating(
									bookInfo.userRating === undefined ? 0 : bookInfo.userRating
								)
							}
							onClick={() => rateBook(3)}
						></div>
						<div
							className={
								exhibitedStarRating > 3
									? 'interactive-star small on'
									: 'interactive-star small'
							}
							title="really liked it"
							onMouseOver={(_e) => setExhibitedStarRating(4)}
							onMouseLeave={(_e) =>
								setExhibitedStarRating(
									bookInfo.userRating === undefined ? 0 : bookInfo.userRating
								)
							}
							onClick={() => rateBook(4)}
						></div>
						<div
							className={
								exhibitedStarRating > 4
									? 'interactive-star small on'
									: 'interactive-star small'
							}
							title="it was amazing"
							onMouseOver={(_e) => setExhibitedStarRating(5)}
							onMouseLeave={(_e) =>
								setExhibitedStarRating(
									bookInfo.userRating === undefined ? 0 : bookInfo.userRating
								)
							}
							onClick={() => rateBook(5)}
						></div>
					</div>
				</div>
			</div>
		</div>
	) : null;

	const showingNumbersSpan = loaded ? (
		<span className="book-quotes-page-showing-numbers-span">
			<span className="big-text">{`${bookTitle} Quotes `}</span>
			<span className="small-text">{`Showing ${(page - 1) * 30 + 1}-${
				page === Math.ceil(bookInfo.quotes.length / 30)
					? bookInfo.quotes.length
					: page * 30
			} of ${bookInfo.quotes.length}`}</span>
		</span>
	) : null;

	const quoteList = loaded ? (
		<div className="book-quotes-page-quote-list">
			{bookInfo.quotes
				.filter(
					(_quote, index) => index >= (page - 1) * 30 && index <= page * 30
				)
				.map((quote, index) => {
					return (
						<div className="quote-card" key={index}>
							<div className="left-section">
								<span className="quote">{`“${quote.content}”`}</span>
								<span className="quote-authorship">
									<span className="dash">― </span>
									{`${bookInfo.authorName}, ${bookTitle}`}
								</span>
								{quote.tags.length !== 0 ? (
									<span className="tag-list">
										<span>tags: </span>
										<span>
											{quote.tags.map((tag, i) => {
												if (i === quote.tags.length - 1) {
													return (
														<a
															key={i}
															href={Firebase.pageGenerator.generateQuotesTagPage(
																tag
															)}
														>
															{tag}
														</a>
													);
												} else {
													return (
														<span key={i}>
															<a
																href={Firebase.pageGenerator.generateQuotesTagPage(
																	tag
																)}
															>
																{tag}
															</a>
															{', '}
														</span>
													);
												}
											})}
										</span>
									</span>
								) : null}
							</div>
							<div className="right-section">
								{user.userUID === null ||
								!quote.usersWhoLiked.includes(user.userUID) ? (
									<button
										className="like-button"
										onClick={async (_e) => {
											await Firebase.likeQuote(user.userUID, quote.id, history);
											setBookInfo((previous) => {
												return {
													...previous,
													quotes: previous.quotes.map((quote, i) => {
														if (i === index) {
															return {
																...quote,
																usersWhoLiked: quote.usersWhoLiked.concat(
																	user.userUID
																),
															};
														}
														return quote;
													}),
												};
											});
											setUserLikedQuotes((previous) => previous.concat(index));
										}}
									>
										Like
									</button>
								) : userLikedQuotes.includes(index) ? (
									<a
										className="quote-a"
										href={Firebase.pageGenerator.generateQuotePage(
											quote.id,
											quote.content
										)}
									>
										View quote
									</a>
								) : (
									<a
										className="quote-a"
										href={Firebase.pageGenerator.generateQuotePage(
											quote.id,
											quote.content
										)}
									>
										In my quotes
									</a>
								)}
								<a
									className="number-of-likes-a"
									href={Firebase.pageGenerator.generateQuotePage(
										quote.id,
										quote.content
									)}
								>{`${quote.usersWhoLiked.length} likes`}</a>
							</div>
						</div>
					);
				})}
			{Math.ceil(bookInfo.quotes.length / 30) > 1 ? (
				<div className="page-navigation-section">
					<button
						onClick={(_e) => setPage((previous) => previous - 1)}
						disabled={page === 1}
					>
						« previous
					</button>
					{Array.from(
						{
							length: Math.ceil(bookInfo.quotes.length / 30),
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
						disabled={page === Math.ceil(bookInfo.quotes.length / 30)}
					>
						next »
					</button>
				</div>
			) : null}
		</div>
	) : null;

	const mainContentLeftSection = (
		<div className="book-quotes-page-main-content-left-section">
			{pageHeader}
			{bookCard}
			{showingNumbersSpan}
			{quoteList}
		</div>
	);

	const mainContentRightSection = (
		<div className="book-quotes-page-main-content-right-section">
			<form className="top-section">
				<input
					className="search-quote input"
					type="text"
					placeholder="Find quotes by keyword, author"
					value={searchInput}
					onChange={(e) => setSearchInput(e.target.value)}
				></input>
				<a
					className="search-a"
					href={Firebase.pageGenerator.generateQuotesSearchPage(searchInput)}
				>
					Search
				</a>
			</form>
			<div className="bottom-section">
				<span>
					<a href={Firebase.pageGenerator.generateQuotesPage()}>All Quotes</a> |{' '}
					<a href={Firebase.pageGenerator.generateAddQuotePage()}>
						Add A Quote
					</a>
				</span>
			</div>
		</div>
	);

	const mainContent = (
		<div className="book-quotes-page-main-content">
			{mainContentLeftSection}
			{mainContentRightSection}
		</div>
	);

	return (
		<div className="book-quotes-page">
			<TopBar />
			{mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default BookQuotesPage;
