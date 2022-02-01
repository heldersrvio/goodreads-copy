import React, { useEffect, useState, useRef, useLayoutEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Firebase from '../../Firebase';
import { format } from 'date-fns';
import '../styles/Books/BookPage.css';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import { trackPromise } from 'react-promise-tracker';

const BookPage = ({ match }) => {
	const history = useHistory();
	const {
		params: { bookPageId },
	} = match;
	const authorAboutP = useRef();
	const synopsisP = useRef();
	const enlargeCoverWindow = useRef();
	const enlargeCoverButton = useRef();
	const recommendWindow = useRef();
	const recommendItButton = useRef();
	const [synopsisHeight, setSynopsisHeight] = useState(0);
	const [authorAboutHeight, setAuthorAboutHeight] = useState(0);
	const [bookInfo, setBookInfo] = useState({ title: '', cover: '' });
	const [loaded, setLoaded] = useState(false);
	const [savingShelf, setSavingShelf] = useState(false);
	const [quizQuestionOptionSelected, setQuizQuestionOptionSelected] = useState(
		-1
	);
	const [synopsisShowMore, setSynopsisShowMore] = useState(false);
	const [showMoreBookInfoDetails, setShowMoreBookInfoDetails] = useState(false);
	const [
		readersEnjoyedListTranslation,
		setReadersEnjoyedListTranslation,
	] = useState(0);
	const [authorAboutShowMore, setAuthorAboutShowMore] = useState(false);
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
	const [reviewSearchInput, setReviewSearchInput] = useState('');
	const [reviewsShowingMore, setReviewsShowingMore] = useState([]);
	const [reviewsHaveButton, setReviewsHaveButton] = useState([]);
	const [showFiltersDialogBox, setShowFiltersDialogBox] = useState(false);
	const [showSortOrderDialogBox, setShowSortOrderDialogBox] = useState(false);
	const [reviewStars, setReviewStars] = useState(0);
	const [showAllEditionsForReviews, setShowAllEditionsForReviews] = useState(
		true
	);
	const [sortOrder, setSortOrder] = useState('default');
	const [searchReviewFilter, setSearchReviewFilter] = useState('');
	const [loadingFollowAuthor, setLoadingFollowAuthor] = useState(false);
	const [showEnlargeCoverWindow, setShowEnlargeCoverWindow] = useState(false);
	const [showRecommendWindow, setShowRecommendWindow] = useState(false);
	const [recommendWindowSearchBox, setRecommendWindowSearchBox] = useState('');
	const [loadingFriends, setLoadingFriends] = useState(false);
	const [friendsInfo, setFriendsInfo] = useState([]);
	const [
		recommendWindowAddingMessages,
		setRecommendWindowAddingMessages,
	] = useState([]);
	const [recommendWindowMessages, setRecommendWindowMessages] = useState([]);
	const [
		recommendWindowSentStatuses,
		setRecommendWindowSentStatuses,
	] = useState([]);
	const [
		topRatingDetailsPopupHidden,
		setTopRatingDetailsPopupHidden,
	] = useState(true);
	const [
		bottomRatingDetailsPopupHidden,
		setBottomRatingDetailsPopupHidden,
	] = useState(true);

	const user = JSON.parse(localStorage.getItem('userState'));

	useEffect(() => {
		const getBookInfo = async () => {
			let bookId = '';
			let i = 0;
			while (i < bookPageId.length) {
				if (bookPageId[i] !== '.') {
					bookId += bookPageId[i];
				} else {
					break;
				}
				i++;
			}
			const bookObj = await trackPromise(
				Firebase.queryBookById(user.userUID, bookId)
			);
			localStorage.setItem(`${bookId}Obj`, JSON.stringify(bookObj));
			setBookInfo(bookObj);
			if (bookObj.userRating !== undefined) {
				setExhibitedStarRating(bookObj.userRating);
			}
			setLoaded(true);
		};
		getBookInfo();
	}, [bookPageId, user.userUID, match]);

	useEffect(() => {
		document.addEventListener('click', (e) => {
			if (
				enlargeCoverWindow.current !== undefined &&
				enlargeCoverWindow.current !== null
			) {
				if (
					showEnlargeCoverWindow &&
					!enlargeCoverWindow.current.contains(e.target) &&
					!enlargeCoverButton.current.contains(e.target)
				) {
					setShowEnlargeCoverWindow(false);
				}
			}
		});

		document.addEventListener('click', (e) => {
			if (
				recommendWindow.current !== undefined &&
				recommendWindow.current !== null
			) {
				if (
					showRecommendWindow &&
					!recommendWindow.current.contains(e.target) &&
					!recommendItButton.current.contains(e.target)
				) {
					setShowRecommendWindow(false);
				}
			}
		});
	});

	useEffect(() => {
		if (bookInfo.userRating !== undefined) {
			setExhibitedStarRating(bookInfo.userRating);
		} else {
			setExhibitedStarRating(0);
		}
		if (bookInfo.userProgress !== undefined) {
			setShelfPopupReadingInput(`${bookInfo.userProgress}`);
		} else {
			setShelfPopupReadingInput('');
		}
		if (bookInfo.toReadBookPosition !== undefined) {
			setShelfPopupToReadInput(`${bookInfo.toReadBookPosition}`);
		} else {
			setShelfPopupToReadInput('');
		}
	}, [bookInfo]);

	useEffect(() => {
		const queryFriends = async () => {
			const newFriendsInfo = await trackPromise(
				Firebase.getFriendsInfo(user.userUID, history)
			);
			setFriendsInfo(newFriendsInfo);
			setRecommendWindowAddingMessages(newFriendsInfo.map((_friend) => false));
			setRecommendWindowMessages(newFriendsInfo.map((_friend) => ''));
			const recommendedToFriendsStatus = await trackPromise(
				Firebase.queryBookRecommendedToFriendsStatus(
					user.userUID,
					bookInfo.id,
					newFriendsInfo.map((friend) => friend.id),
					history
				)
			);
			setRecommendWindowSentStatuses(recommendedToFriendsStatus);
		};
		setLoadingFriends(false);

		if (loadingFriends) {
			queryFriends();
		}
	}, [loadingFriends, user.userUID, bookInfo.id, history]);

	useLayoutEffect(() => {
		if (authorAboutP.current !== undefined) {
			setAuthorAboutHeight(authorAboutP.current.scrollHeight);
		}
		if (synopsisP.current !== undefined) {
			setSynopsisHeight(synopsisP.current.scrollHeight);
		}

		const reviews = document.getElementsByClassName(
			'book-page-review-main-body'
		);
		if (reviews.length > 0) {
			const haveButtons = [];
			setReviewsShowingMore(Array.from(reviews).map((review) => false));
			Array.from(reviews).forEach((review) => {
				if (review.scrollHeight <= 292) {
					haveButtons.push(false);
				} else {
					haveButtons.push(true);
				}
			});
			setReviewsHaveButton(haveButtons);
		}
	}, [loaded]);

	const ratingCount = loaded
		? bookInfo.fiveRatings +
		  bookInfo.fourRatings +
		  bookInfo.threeRatings +
		  bookInfo.twoRatings +
		  bookInfo.oneRatings
		: 1;

	const generalRating = loaded
		? (
				(bookInfo.fiveRatings * 5 +
					bookInfo.fourRatings * 4 +
					bookInfo.threeRatings * 3 +
					bookInfo.twoRatings * 2 +
					bookInfo.oneRatings) /
				ratingCount
		  ).toFixed(2)
		: 0;

	const mostFrequentRating = loaded
		? Math.max(
				bookInfo.fiveRatings,
				bookInfo.fourRatings,
				bookInfo.threeRatings,
				bookInfo.twoRatings,
				bookInfo.oneRatings
		  )
		: 0;

	const displayRemoveBookConfirm = () => {
		return window.confirm(
			'Removing a book deletes your rating, review, etc. Remove this book from all your shelves?'
		);
	};

	const removeBookSafely = () => {
		if (displayRemoveBookConfirm()) {
			Firebase.removeBookFromShelf(user.userUID, bookInfo.id);
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
		if (bookInfo.id !== undefined) {
			setSavingShelf(true);
			await Firebase.addBookToShelf(user.userUID, bookInfo.id, shelf, history);
			setBookInfo((previous) => {
				return {
					...previous,
					userStatus: shelf,
				};
			});
			setSavingShelf(false);
		}
	};

	const rateBook = async (rating) => {
		if (bookInfo.id !== undefined) {
			await Firebase.rateBook(user.userUID, bookInfo.id, rating, history);
			setBookInfo((previous) => {
				return {
					...previous,
					userStatus:
						previous.userStatus !== undefined ? previous.userStatus : 'read',
					userRating: rating,
				};
			});
		}
	};

	const updateProgress = async (pages) => {
		if (
			user.userUID !== null &&
			user.userUID !== undefined &&
			bookInfo.id !== undefined &&
			pages.length > 0
		) {
			await Firebase.updateBookInShelf(
				user.userUID,
				bookInfo.id,
				parseInt(pages)
			);
			setBookInfo((previous) => {
				return {
					...previous,
					userProgress: parseInt(pages),
				};
			});
		}
	};

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

	const bookPageInfoLeft = loaded ? (
		<div className="book-page-book-info-left">
			<div className="book-page-book-info-cover-wrap">
				<a
					className="book-cover-page-anchor"
					href={Firebase.pageGenerator.generateBookCoverPage(
						bookInfo.id,
						bookInfo.title
					)}
				>
					<img
						src={
							bookInfo.cover !== undefined
								? bookInfo.cover
								: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png'
						}
						alt={bookInfo.title}
						className="book-info-book-cover"
					/>
				</a>
				<div className="cover-options">
					<a
						className="book-other-editions-anchor"
						href={Firebase.pageGenerator.generateBookEditionsPage(
							bookInfo.originalId,
							bookInfo.originalTitle
						)}
					>
						Other editions
					</a>
					{bookInfo.cover !== undefined ? (
						<button
							className="book-page-enlarge-cover"
							onClick={() => setShowEnlargeCoverWindow((previous) => !previous)}
							ref={enlargeCoverButton}
						>
							Enlarge cover
						</button>
					) : null}
				</div>
			</div>
			<div className="book-page-user-shelf-section">
				<div className="add-to-shelf-buttons">
					<div
						className={`want-to-read-button-and-options ${
							bookInfo.userStatus !== undefined ? bookInfo.userStatus : ''
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
	) : null;

	const bookPageTitleArea = loaded ? (
		<div className="book-page-title-area">
			<h1 className="book-page-book-title">{bookInfo.title}</h1>
			{bookInfo.series !== undefined ? (
				<a
					className="book-page-book-title-series-a"
					href={bookInfo.series.page}
				>{`(${bookInfo.series.name} #${bookInfo.seriesInstance})`}</a>
			) : (
				''
			)}
			<span className="book-page-author-name">
				by{' '}
				<a className="book-page-author-name-a" href={bookInfo.authorPages[0]}>
					{bookInfo.authorNames[0]}
				</a>
				{bookInfo.authorIsMember ? (
					<span>
						<span className="book-page-goodreads-author">
							{' '}
							(Goodreads Author)
						</span>
						{bookInfo.authorNames.length > 1 ? ',' : ''}
					</span>
				) : null}
			</span>
			{bookInfo.authorNames.slice(1).map((authorName, index) => {
				return (
					<span key={index}>
						<a
							className="book-page-other-author-name-a"
							href={bookInfo.authorPages[index]}
						>
							{authorName}
						</a>
						<span className="book-page-goodreads-other-author">
							{' '}
							({bookInfo.authorFunctions[index]})
						</span>
						{index === bookInfo.authorNames.length - 1 ? ',' : ''}
					</span>
				);
			})}
		</div>
	) : null;

	const generateBookPageRatingsArea = (isTop) => {
		return loaded ? (
			<div
				className={
					isTop ? 'book-page-ratings-area top' : 'book-page-ratings-area bottom'
				}
			>
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
					<span>{!isNaN(generalRating) ? generalRating : ''}</span>
				</div>
				<span className="book-page-ratings-dot">·</span>
				<div
					className="rating-details"
					onMouseOver={(_e) => {
						if (!isTop) {
							setBottomRatingDetailsPopupHidden(false);
						}
					}}
					onMouseLeave={(e) => {
						if (
							!isTop &&
							(e.clientX > 974 ||
								e.clientX < 375 ||
								e.clientY > 308 ||
								e.clientY < 80)
						) {
							setBottomRatingDetailsPopupHidden(true);
						}
					}}
				>
					<div className="svg-container">
						<svg width="12" height="11">
							<rect
								width={
									ratingCount !== 0
										? (bookInfo.fiveRatings * 16) / ratingCount
										: 0
								}
								height="2"
								y="0"
								fill="rgb(33,86,37)"
							></rect>
							<rect
								width={
									ratingCount !== 0
										? (bookInfo.fourRatings * 16) / ratingCount
										: 0
								}
								height="2"
								y="3"
								fill="rgb(33,86,37)"
							></rect>
							<rect
								width={
									ratingCount !== 0
										? (bookInfo.threeRatings * 16) / ratingCount
										: 0
								}
								height="2"
								y="6"
								fill="rgb(33,86,37)"
							></rect>
							<rect
								width={
									ratingCount !== 0
										? (bookInfo.twoRatings * 16) / ratingCount
										: 0
								}
								height="2"
								y="9"
								fill="rgb(33,86,37)"
							></rect>
							<rect
								width={
									ratingCount !== 0
										? (bookInfo.oneRatings * 16) / ratingCount
										: 0
								}
								height="2"
								y="12"
								fill="rgb(33,86,37)"
							></rect>
						</svg>
					</div>
					<span
						onClick={(_e) => {
							if (isTop) {
								setTopRatingDetailsPopupHidden(false);
							}
						}}
					>
						Rating details
					</span>
					<div
						className={
							(isTop && !topRatingDetailsPopupHidden) ||
							(!isTop && !bottomRatingDetailsPopupHidden)
								? 'rating-details-popup'
								: 'rating-details-popup hidden'
						}
					>
						<div className="rating-details-popup-tip"></div>
						<span className="rating-details-top-title">
							{isTop ? 'Rating details' : 'book data'}
						</span>
						{isTop ? (
							<button
								className="rating-details-top-close-button"
								onClick={(_e) => setTopRatingDetailsPopupHidden(true)}
							></button>
						) : null}
						<table className="rating-distribution">
							<tbody>
								<tr>
									<th width="25" className="rating-and-star">
										5<div className="static-star small full"></div>
									</th>
									<td className="green-bar-container">
										<div
											className="green-bar"
											style={{
												width:
													ratingCount !== 0
														? (bookInfo.fiveRatings * 350) / mostFrequentRating
														: 0,
											}}
										></div>
									</td>
									<td width="90" className="rating-percentage-and-absolute">
										{`${
											ratingCount !== 0
												? Math.round((bookInfo.fiveRatings * 100) / ratingCount)
												: 0
										}% (${bookInfo.fiveRatings})`}
									</td>
								</tr>
								<tr>
									<th width="25" className="rating-and-star">
										4<div className="static-star small full"></div>
									</th>
									<td className="green-bar-container">
										<div
											className="green-bar"
											style={{
												width:
													ratingCount !== 0
														? (bookInfo.fourRatings * 350) / mostFrequentRating
														: 0,
											}}
										></div>
									</td>
									<td width="90" className="rating-percentage-and-absolute">
										{`${
											ratingCount !== 0
												? Math.round((bookInfo.fourRatings * 100) / ratingCount)
												: 0
										}% (${bookInfo.fourRatings})`}
									</td>
								</tr>
								<tr>
									<th width="25" className="rating-and-star">
										3<div className="static-star small full"></div>
									</th>
									<td className="green-bar-container">
										<div
											className="green-bar"
											style={{
												width:
													ratingCount !== 0
														? (bookInfo.threeRatings * 350) / mostFrequentRating
														: 0,
											}}
										></div>
									</td>
									<td width="90" className="rating-percentage-and-absolute">
										{`${
											ratingCount !== 0
												? Math.round(
														(bookInfo.threeRatings * 100) / ratingCount
												  )
												: 0
										}% (${bookInfo.threeRatings})`}
									</td>
								</tr>
								<tr>
									<th width="25" className="rating-and-star">
										2<div className="static-star small full"></div>
									</th>
									<td className="green-bar-container">
										<div
											className="green-bar"
											style={{
												width:
													ratingCount !== 0
														? (bookInfo.twoRatings * 350) / mostFrequentRating
														: 0,
											}}
										></div>
									</td>
									<td width="90" className="rating-percentage-and-absolute">
										{`${
											ratingCount !== 0
												? Math.round((bookInfo.twoRatings * 100) / ratingCount)
												: 0
										}% (${bookInfo.threeRatings})`}
									</td>
								</tr>
								<tr>
									<th width="25" className="rating-and-star">
										1<div className="static-star small full"></div>
									</th>
									<td className="green-bar-container">
										<div
											className="green-bar"
											style={{
												width:
													ratingCount !== 0
														? (bookInfo.oneRatings * 350) / mostFrequentRating
														: 0,
											}}
										></div>
									</td>
									<td width="90" className="rating-percentage-and-absolute">
										{`${
											ratingCount !== 0
												? Math.round((bookInfo.oneRatings * 100) / ratingCount)
												: 0
										}% (${bookInfo.oneRatings})`}
									</td>
								</tr>
							</tbody>
						</table>
						<span className="percent-of-people-who-liked">
							<span className="number">
								{ratingCount !== 0
									? Math.round(
											((bookInfo.fiveRatings +
												bookInfo.fourRatings +
												bookInfo.threeRatings) *
												100) /
												ratingCount
									  )
									: 0}
							</span>
							% of people liked it
						</span>
						<span className="all-editions-info">
							<span className="title">All editions: </span>
							<span className="number">{generalRating}</span> average rating,{' '}
							<span className="number">{ratingCount}</span> ratings,{' '}
							<span className="number">{bookInfo.reviews.length}</span> reviews,
							added by <span className="number">{bookInfo.addedBy}</span>{' '}
							people, <span className="number">{bookInfo.toReads}</span>{' '}
							to-reads
						</span>
						<span className="this-edition-info">
							<span className="title">This edition: </span>
							<span className="number">{bookInfo.thisEditionRating}</span>{' '}
							average rating,{' '}
							<span className="number">{bookInfo.thisEditionRatings}</span>{' '}
							ratings,{' '}
							<span className="number">
								{
									bookInfo.reviews.filter(
										(review) => review.edition === bookInfo.id
									).length
								}
							</span>{' '}
							reviews, added by{' '}
							<span className="number">{bookInfo.thisEditionAddedBy}</span>{' '}
							people
						</span>
					</div>
				</div>
				<span className="book-page-ratings-dot">·</span>
				<a
					className="book-page-ratings-count"
					href={`${bookPageId}#other-reviews`}
				>
					{`${ratingCount} ratings`}
				</a>
				<span className="book-page-ratings-dot">·</span>
				<a
					className="book-page-reviews-count"
					href={`${bookPageId}#other-reviews`}
				>
					{`${bookInfo.reviews.length} ${
						bookInfo.reviews.length === 1 ? 'review' : 'reviews'
					}`}
				</a>
			</div>
		) : null;
	};

	const bookPageSynopsisArea = loaded ? (
		<div className="book-page-synopsis-wrapper">
			<div
				className={
					synopsisShowMore
						? 'book-page-synopsis-area-full'
						: 'book-page-synopsis-area'
				}
			>
				{bookInfo.preSynopsis !== undefined ? (
					<p className="pre-synopsis">
						<b>{bookInfo.preSynopsis}</b>
					</p>
				) : null}
				<p className="synopsis" ref={synopsisP}>
					{bookInfo.synopsis}
				</p>
			</div>
			{synopsisHeight > 105 ? (
				<button
					className="synopsis-show-more"
					onClick={(_e) => {
						setSynopsisShowMore((previous) => !previous);
					}}
				>
					{synopsisShowMore ? '(less)' : '...more'}
				</button>
			) : null}
		</div>
	) : null;

	const bookPageGetACopy = loaded ? (
		<div className="book-page-get-a-copy">
			<span>GET A COPY</span>
			<a href={bookInfo.amazonLink}>Amazon</a>
		</div>
	) : null;

	const bookPageBookInfoDetailsExpanded = loaded ? (
		<div className="book-page-book-info-details-expanded">
			<div className="book-page-book-info-details-expanded-left">
				<span>Original Title</span>
				{bookInfo.ISBN !== undefined ? <span>ISBN</span> : null}
				{bookInfo.language !== undefined ? <span>Edition Language</span> : null}
				{bookInfo.series !== undefined ? <span>Series</span> : null}
				<a
					href={Firebase.pageGenerator.generateBookEditionsPage(
						bookInfo.rootBook,
						bookInfo.originalTitle
					)}
				>{`Other Editions (${bookInfo.otherEditionsPages.length})`}</a>
			</div>
			<div className="book-page-book-info-details-expanded-right">
				<span>{bookInfo.originalTitle}</span>
				{bookInfo.ISBN !== undefined ? <span>{bookInfo.ISBN}</span> : null}
				{bookInfo.language !== undefined ? (
					<span>{bookInfo.language}</span>
				) : null}
				{bookInfo.series !== undefined ? (
					<a
						href={bookInfo.series.page}
						className="book-page-details-series-a"
					>{`${bookInfo.series.name} #${bookInfo.seriesInstance}`}</a>
				) : null}
				<div className="book-page-details-editions">
					<div className="book-page-details-other-editions">
						{bookInfo.otherEditionsPages.length > 0 ? (
							bookInfo.otherEditionsPages.map((page, index) => {
								return (
									<a
										href={page}
										key={index}
										className="book-page-details-other-editions-a"
									>
										<img
											src={
												bookInfo.otherEditionsCovers[index] !== undefined
													? bookInfo.otherEditionsCovers[index]
													: 'bookInfo.otherEditionsCovers[index]'
											}
											alt={bookInfo.title}
										/>
									</a>
								);
							})
						) : (
							<span className="no-other-editions-found-span">None found</span>
						)}
					</div>
					<div className="book-page-details-editions-bottom">
						<a
							href={Firebase.pageGenerator.generateBookEditionsPage(
								bookInfo.rootBook,
								bookInfo.originalTitle
							)}
						>
							All Editions
						</a>
						<span>|</span>
						<a href={Firebase.pageGenerator.generateAddBookPage()}>
							Add a New Edition
						</a>
					</div>
				</div>
			</div>
		</div>
	) : null;

	const bookPageBookInfoDetails = loaded ? (
		<div className="book-page-book-info-details">
			<span className="book-type-and-pages">
				{bookInfo.type !== undefined
					? `${bookInfo.type}, ${bookInfo.pageCount} pages`
					: `${bookInfo.pageCount} pages`}
			</span>
			<span className="book-publication">
				{bookInfo.editionPublishedDate !== undefined
					? `Published ${format(
							bookInfo.editionPublishedDate,
							'MMMM do yyyy'
					  )} by ${bookInfo.publisher}`
					: null}
				{bookInfo.firstEditionPublishedYear !==
					bookInfo.editionPublishedDate.getYear() &&
				bookInfo.firstEditionPublishedYear !== undefined ? (
					<span className="book-publication-original-year">{` (first published ${bookInfo.firstEditionPublishedYear})`}</span>
				) : null}
			</span>
			{showMoreBookInfoDetails ? bookPageBookInfoDetailsExpanded : null}
			<div className="book-page-book-info-bottom">
				<button
					className="show-more-book-info-details-button"
					onClick={(_e) => {
						setShowMoreBookInfoDetails((previous) => !previous);
					}}
				>
					{showMoreBookInfoDetails ? '...Less Detail' : 'More Details...'}
				</button>
			</div>
		</div>
	) : null;

	const bookPageInfoRight = (
		<div className="book-page-book-info-right">
			{bookPageTitleArea}
			{generateBookPageRatingsArea(true)}
			{bookPageSynopsisArea}
			{bookPageGetACopy}
			{bookPageBookInfoDetails}
		</div>
	);

	const bookPageBookInfo = (
		<div className="book-page-book-info">
			{bookPageInfoLeft}
			{bookPageInfoRight}
		</div>
	);

	const bookPageListsWithBook =
		loaded && bookInfo.lists !== undefined ? (
			<div className="book-page-lists-with-book">
				<div className="book-page-lists-with-book-top">
					<a className="lists-with-book-a" href={`/lists/book/${bookInfo.id}`}>
						LISTS WITH THIS BOOK
					</a>
				</div>
				<div className="book-page-lists-with-book-bottom">
					{bookInfo.lists.map((list) => (
						<div className="book-page-lists-with-book-pv" key={list.id}>
							<div className="book-page-lists-with-book-pv-top">
								{list.bookIds.map((_bookId, index) => (
									<a
										className="book-page-lists-book-pv"
										href={Firebase.pageGenerator.generateListPage(
											list.id,
											list.title
										)}
										key={index}
									>
										<img
											src={
												list.bookCovers[index] !== undefined
													? list.bookCovers[index]
													: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png'
											}
											alt={list.bookTitles[index]}
										/>
									</a>
								))}
							</div>
							<div className="book-page-lists-with-book-pv-bottom">
								<a
									className="book-page-lists-with-book-pv-title"
									href={Firebase.pageGenerator.generateListPage(
										list.id,
										list.title
									)}
								>
									{list.title}
								</a>
								<span className="book-page-lists-with-book-pv-stats">{`${list.bookIds.length} books – ${list.voterCount} voters`}</span>
							</div>
						</div>
					))}
				</div>
				<div className="book-page-lists-with-book-more">
					<a
						className="more-lists-with-book-a"
						href={`/lists/book/${bookInfo.id}`}
					>
						More lists with this book...
					</a>
				</div>
			</div>
		) : loaded ? (
			<div className="book-page-lists-with-book">
				<div className="book-page-lists-with-book-top">
					<a className="lists-with-book-a" href={`/lists/book/${bookInfo.id}`}>
						LISTS WITH THIS BOOK
					</a>
				</div>
				<div className="not-featured-listopia">
					<span>
						This book is not yet featured on Listopia.{' '}
						<a href="/list">Add this book to your favorite list »</a>
					</span>
				</div>
			</div>
		) : null;

	const startYourReviewSection =
		loaded && user.userInfo !== undefined ? (
			<div className="start-your-review-section">
				<div className="start-your-review-profile-picture">
					<img
						alt="profile"
						src={
							user.userInfo.profileImage !== undefined
								? user.userInfo.profileImage
								: 'https://www.goodreads.com/assets/nophoto/user/u_60x60-267f0ca0ea48fd3acfd44b95afa64f01.png'
						}
					></img>
				</div>
				<div className="start-your-review-section-right">
					{user.userUID !== undefined && user.userUID !== null ? (
						<span>
							<a
								href={
									user.userUID !== undefined && user.userUID !== null
										? Firebase.pageGenerator.generateUserPage(
												user.userUID,
												user.userInfo.firstName
										  )
										: '/user/sign_in'
								}
							>
								{user.userInfo.firstName},
							</a>{' '}
							{`start your review of ${bookInfo.title} ${
								bookInfo.series !== undefined
									? `(${bookInfo.series.name} #${bookInfo.seriesInstance})`
									: null
							}`}
						</span>
					) : (
						<span>{`Start your review of ${bookInfo.title} ${
							bookInfo.series !== undefined
								? `(${bookInfo.series.name} #${bookInfo.seriesInstance})`
								: null
						}`}</span>
					)}
					<div className="start-your-review-section-right-stars-write">
						<div className="start-your-review-section-right-stars">
							<div
								className={
									exhibitedStarRating > 0
										? 'interactive-star big on'
										: 'interactive-star big'
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
										? 'interactive-star big on'
										: 'interactive-star big'
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
										? 'interactive-star big on'
										: 'interactive-star big'
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
										? 'interactive-star big on'
										: 'interactive-star big'
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
										? 'interactive-star big on'
										: 'interactive-star big'
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
						<a
							href={
								user.userUID !== undefined && user.userUID !== null
									? Firebase.pageGenerator.generateWriteReviewPageForBook(
											bookInfo.id
									  )
									: '/user/sign_in'
							}
							className="write-review-button"
						>
							Write a review
						</a>
					</div>
				</div>
			</div>
		) : null;

	const reviewList = loaded
		? bookInfo.reviews
				.filter((review) => {
					if (reviewStars !== 0) {
						return review.rating === reviewStars;
					}
					if (!showAllEditionsForReviews) {
						return review.edition === bookInfo.id;
					}
					if (searchReviewFilter.length > 0) {
						return review.text.includes(searchReviewFilter);
					}
					return true;
				})
				.sort((first, second) => {
					if (sortOrder === 'oldest') {
						return first.date - second.date;
					} else if (sortOrder === 'newest') {
						return second.date - first.date;
					}
					return 0;
				})
				.map((review, index) => {
					return (
						<div className="book-page-review-instance" key={index}>
							<img
								className="book-page-review-instance-profile-image"
								src={
									review.profileImage !== undefined
										? review.profileImage
										: 'https://www.goodreads.com/assets/nophoto/user/u_60x60-267f0ca0ea48fd3acfd44b95afa64f01.png'
								}
								alt={review.userName}
							/>
							<div className="book-page-review-instance-right">
								<div className="book-page-review-instance-right-top-line">
									<span className="book-page-review-instance-user-rated">
										<a
											href={Firebase.pageGenerator.generateUserPage(
												review.user,
												review.userName.split(' ')[0]
											)}
										>
											{review.userName}
										</a>
										<span>&nbsp;rated it</span>
										<div className="review-instance-stars">
											<div
												className={
													review.rating >= 1
														? 'static-star small full'
														: 'static-star small empty'
												}
											></div>
											<div
												className={
													review.rating >= 2
														? 'static-star small full'
														: 'static-star small empty'
												}
											></div>
											<div
												className={
													review.rating >= 3
														? 'static-star small full'
														: 'static-star small empty'
												}
											></div>
											<div
												className={
													review.rating >= 4
														? 'static-star small full'
														: 'static-star small empty'
												}
											></div>
											<div
												className={
													review.rating >= 5
														? 'static-star small full'
														: 'static-star small empty'
												}
											></div>
										</div>
									</span>
									<a
										className="book-page-review-instance-date"
										href={Firebase.pageGenerator.generateReviewPage(review.id)}
									>
										{format(review.date, 'MMM dd, yyyy')}
									</a>
								</div>
								{review.recommendsItFor !== undefined ? (
									<span className="recommends-it-for">
										Recommends it for:{' '}
										<span className="recommends-it-for-answer">
											{review.recommendsItFor}
										</span>
									</span>
								) : null}
								{review.shelves !== undefined ? (
									<span className="book-page-review-instance-shelves">
										Shelves:{' '}
										<span className="book-page-review-instance-shelves-answer">
											{review.shelves.map((shelf, index) => {
												return (
													<span key={index}>
														<a
															href={Firebase.pageGenerator.generateUserShelfPage(
																review.user,
																review.userName.split(' ')[0],
																[shelf]
															)}
														>
															{shelf}
														</a>
														{index !== review.shelves.length - 1 ? ', ' : null}
													</span>
												);
											})}
										</span>
									</span>
								) : null}
								<div className="review-main-body-container">
									<p
										className={
											reviewsShowingMore.includes(index)
												? 'book-page-review-main-body full'
												: 'book-page-review-main-body'
										}
									>
										{review.text}
									</p>
									{reviewsHaveButton[index] ? (
										<button
											className="review-show-more"
											onClick={(_e) => {
												setReviewsShowingMore((previous) => {
													if (previous.includes(index)) {
														return previous.filter((item) => item !== index);
													} else {
														return previous.concat([index]);
													}
												});
											}}
										>
											{reviewsShowingMore.includes(index)
												? '(less)'
												: '...more'}
										</button>
									) : null}
								</div>
								<div className="book-page-review-bottom">
									{review.numberOfLikes > 0 ? (
										<a
											className="book-page-review-likes"
											href={Firebase.pageGenerator.generateReviewLikesPage(
												review.id
											)}
										>
											{review.numberOfLikes} likes
										</a>
									) : null}
									{review.numberOfLikes > 0 ? (
										<span className="black-dot">·</span>
									) : null}
									<button
										className="book-page-review-like-button"
										onClick={async (_e) => {
											await Firebase.likeUnlikeReview(
												user.userUID,
												review.id,
												history
											);
											setBookInfo((previous) => {
												return {
													...previous,
													reviews: previous.reviews.map((r) => {
														if (r.id !== review.id) {
															return r;
														} else {
															return {
																...r,
																likedByUser: !r.likedByUser,
															};
														}
													}),
												};
											});
										}}
									>
										{review.likedByUser ? 'Unlike' : 'Like'}
									</button>
									<span className="black-dot">·</span>
									<a
										className="book-page-review-see-review"
										href={Firebase.pageGenerator.generateReviewPage(review.id)}
									>
										see review
									</a>
								</div>
							</div>
						</div>
					);
				})
		: null;

	const bookPageCommunityReviews = loaded ? (
		<div className="book-page-community-reviews">
			<div className="book-page-community-reviews-top">
				<span className="book-page-community-reviews-title">
					COMMUNITY REVIEWS
				</span>
				<span className="book-page-community-reviews-showing">
					{bookInfo.reviews.length === 0
						? 'Showing 0-0'
						: bookInfo.reviews.length < 30
						? `Showing 1-${bookInfo.reviews.length}`
						: 'Showing 1-30'}
				</span>
			</div>
			<div className="ratings-section">
				<div className="ratings-section-top">
					{generateBookPageRatingsArea(false)}
				</div>
				<div className="ratings-section-bottom">
					<div className="ratings-section-bottom-left">
						<div
							className="ratings-section-bottom-left-wrapper"
							onMouseOver={(_e) => {
								setShowFiltersDialogBox(true);
								setShowSortOrderDialogBox(false);
							}}
							onMouseLeave={(e) => {
								if (
									e.clientX >
										document
											.getElementsByClassName(
												'ratings-section-bottom-left-wrapper'
											)[0]
											.getBoundingClientRect().left +
											400 ||
									e.clientY >
										document
											.getElementsByClassName(
												'ratings-section-bottom-left-wrapper'
											)[0]
											.getBoundingClientRect().bottom +
											15
								) {
									setShowFiltersDialogBox(false);
								}
							}}
						>
							<span className="ratings-section-bottom-left-filters-title">
								Filters
							</span>
							<div
								className={
									showFiltersDialogBox
										? 'reviews-filter-dialog-box'
										: 'reviews-filter-dialog-box hidden'
								}
							>
								<div className="dialog-box-tip"></div>
								<div className="rating-filters">
									<button
										className="all-filter"
										onClick={(_e) => setReviewStars(0)}
									>{`all (${bookInfo.reviews.length})`}</button>
									<span className="filter-separator">|</span>
									<button
										className="five-star-filter"
										onClick={(_e) => setReviewStars(5)}
									>
										<span>
											<span className="filter-button-stars">5 stars </span>
											<span className="filter-button-amount">{`(${
												bookInfo.reviews.filter((review) => review.rating === 5)
													.length
											})`}</span>
										</span>
									</button>
									<span className="filter-separator">|</span>
									<button
										className="four-star-filter"
										onClick={(_e) => setReviewStars(4)}
									>
										<span>
											<span className="filter-button-stars">4 stars </span>
											<span className="filter-button-amount">{`(${
												bookInfo.reviews.filter((review) => review.rating === 4)
													.length
											})`}</span>
										</span>
									</button>
									<span className="filter-separator">|</span>
									<button
										className="three-star-filter"
										onClick={(_e) => setReviewStars(3)}
									>
										<span>
											<span className="filter-button-stars">3 stars </span>
											<span className="filter-button-amount">{`(${
												bookInfo.reviews.filter((review) => review.rating === 3)
													.length
											})`}</span>
										</span>
									</button>
									<span className="filter-separator">|</span>
									<button
										className="two-star-filter"
										onClick={(_e) => setReviewStars(2)}
									>
										<span>
											<span className="filter-button-stars">2 stars </span>
											<span className="filter-button-amount">{`(${
												bookInfo.reviews.filter((review) => review.rating === 2)
													.length
											})`}</span>
										</span>
									</button>
									<span className="filter-separator">|</span>
									<button
										className="one-star-filter"
										onClick={(_e) => setReviewStars(1)}
									>
										<span>
											<span className="filter-button-stars">1 star </span>
											<span className="filter-button-amount">{`(${
												bookInfo.reviews.filter((review) => review.rating === 1)
													.length
											})`}</span>
										</span>
									</button>
								</div>
								<div className="edition-filters">
									<span className="edition-filters-title">editions:</span>
									<button
										className="all-editions-filter"
										onClick={(_e) => setShowAllEditionsForReviews(true)}
									>
										all
									</button>
									<span className="filter-separator">|</span>
									<button
										className="this-edition-filter"
										onClick={(_e) => setShowAllEditionsForReviews(false)}
									>
										this edition
									</button>
								</div>
							</div>
						</div>
						<span className="separator">|</span>
						<div
							onMouseOver={(_e) => {
								setShowSortOrderDialogBox(true);
								setShowFiltersDialogBox(false);
							}}
							onMouseLeave={(e) => {
								if (
									e.clientX >
										document
											.getElementsByClassName(
												'ratings-section-bottom-left-wrapper-two'
											)[0]
											.getBoundingClientRect().right +
											10 ||
									e.clientY >
										document
											.getElementsByClassName(
												'ratings-section-bottom-left-wrapper'
											)[0]
											.getBoundingClientRect().bottom +
											10
								) {
									setShowSortOrderDialogBox(false);
								}
							}}
							className="ratings-section-bottom-left-wrapper-two"
						>
							<span className="ratings-section-bottom-left-sort-title">
								Sort order
							</span>
							<div
								className={
									showSortOrderDialogBox
										? 'reviews-sort-dialog-box'
										: 'reviews-sort-dialog-box hidden'
								}
							>
								<div className="dialog-box-tip"></div>
								<button
									className="sort-review-default-button"
									onClick={(_e) => setSortOrder('default')}
								>
									Default
								</button>
								<span className="filter-separator">|</span>
								<button
									className="sort-review-newest-button"
									onClick={(_e) => setSortOrder('newest')}
								>
									Newest
								</button>
								<span className="filter-separator">|</span>
								<button
									className="sort-review-oldest-button"
									onClick={(_e) => setSortOrder('oldest')}
								>
									Oldest
								</button>
							</div>
						</div>
					</div>
					<div className="ratings-section-bottom-right">
						<input
							className="book-page-review-search-box"
							type="text"
							value={reviewSearchInput}
							onChange={(e) => setReviewSearchInput(e.target.value)}
							placeholder="Search review text"
							disabled={reviewStars > 0 || !showAllEditionsForReviews}
							onKeyDown={(e) => {
								if (e.keyCode === 13 && reviewSearchInput.length > 0) {
									setSearchReviewFilter(reviewSearchInput);
								}
							}}
						></input>
						<button
							className="review-search-box-magnifying-glass"
							onClick={(_e) => {
								if (reviewSearchInput.length > 0) {
									setSearchReviewFilter(reviewSearchInput);
								}
							}}
						></button>
					</div>
				</div>
			</div>
			<div className="reviews-section">
				{bookInfo.reviews.filter((review) => {
					if (user.UID !== undefined) {
						return review.user === user.UID;
					}
					return false;
				}).length > 0
					? null
					: startYourReviewSection}
				<div className="book-page-reviews-section-review-list">
					{reviewStars > 0 ||
					!showAllEditionsForReviews ||
					searchReviewFilter.length > 0 ? (
						reviewStars > 0 && reviewList.length === 0 ? (
							<span className="review-filter-message">
								<span>
									There are 0 reviews rated <b>{reviewStars} stars</b>.{' '}
								</span>
								<button
									className="clear-review-filters-button"
									onClick={(_e) => {
										setReviewStars(0);
										setShowAllEditionsForReviews(true);
										setSearchReviewFilter('');
									}}
								>
									Clear filters
								</button>
							</span>
						) : reviewStars > 0 ? (
							<span className="review-filter-message">
								<span>
									Displaying 1-
									{reviewList.length >= 30 ? 30 : reviewList.length} of{' '}
									{reviewList.length} reviews rated <b>{reviewStars} stars</b>,
									sorted by{' '}
									<b>
										{sortOrder.charAt(0).toUpperCase() + sortOrder.slice(1)}
									</b>
									.{' '}
								</span>
								<button
									className="clear-review-filters-button"
									onClick={(_e) => {
										setReviewStars(0);
										setShowAllEditionsForReviews(true);
										setSearchReviewFilter('');
									}}
								>
									Clear filters
								</button>
							</span>
						) : !showAllEditionsForReviews && reviewList.length === 0 ? (
							<span className="review-filter-message">
								<span>
									There are 0 reviews for <b>this edition</b>.{' '}
								</span>
								<button
									className="clear-review-filters-button"
									onClick={(_e) => {
										setReviewStars(0);
										setShowAllEditionsForReviews(true);
										setSearchReviewFilter('');
									}}
								>
									Clear filters
								</button>
							</span>
						) : !showAllEditionsForReviews ? (
							<span className="review-filter-message">
								<span>
									Displaying 1-
									{reviewList.length >= 30 ? 30 : reviewList.length} of{' '}
									{reviewList.length} reviews for <b>this edition</b>, sorted by{' '}
									<b>
										{sortOrder.charAt(0).toUpperCase() + sortOrder.slice(1)}
									</b>
									.{' '}
								</span>
								<button
									className="clear-review-filters-button"
									onClick={(_e) => {
										setReviewStars(0);
										setShowAllEditionsForReviews(true);
										setSearchReviewFilter('');
									}}
								>
									Clear filters
								</button>
							</span>
						) : searchReviewFilter.length > 0 && reviewList.length === 0 ? (
							<span className="review-filter-message">
								<span>
									There are 0 reviews that mention <b>"{searchReviewFilter}"</b>
									.{' '}
								</span>
								<button
									className="clear-review-filters-button"
									onClick={(_e) => {
										setReviewStars(0);
										setShowAllEditionsForReviews(true);
										setSearchReviewFilter('');
									}}
								>
									Clear filters
								</button>
							</span>
						) : (
							<span className="review-filter-message">
								<span>
									Displaying 1-
									{reviewList.length >= 30 ? 30 : reviewList.length} of{' '}
									{reviewList.length} reviews that mention{' '}
								</span>
								<b>"{searchReviewFilter}"</b>, sorted by{' '}
								<b>{sortOrder.charAt(0).toUpperCase() + sortOrder.slice(1)}</b>.{' '}
								<button
									className="clear-review-filters-button"
									onClick={(_e) => {
										setReviewStars(0);
										setShowAllEditionsForReviews(true);
										setSearchReviewFilter('');
									}}
								>
									Clear filters
								</button>
							</span>
						)
					) : null}
					{reviewList.length > 0 ? (
						reviewList
					) : (
						<div className="no-matching-reviews">
							<span>No matching reviews.</span>
						</div>
					)}
				</div>
			</div>
		</div>
	) : null;

	const bookPageMainContentLeft = (
		<div className="book-page-main-content-left">
			{bookPageBookInfo}
			{bookPageListsWithBook}
			{bookPageCommunityReviews}
		</div>
	);

	const bookPageMainContentRightTop = loaded ? (
		<div className="book-page-main-content-right-top">
			<button
				className="recommend-book-button"
				onClick={(_e) => {
					setLoadingFriends(true);
					setShowRecommendWindow(true);
				}}
				ref={recommendItButton}
			>
				Recommend it
			</button>
			<span className="book-page-main-content-right-top-separator">|</span>
			<a
				href={Firebase.pageGenerator.generateBookStatsPage(bookInfo.id)}
				className="book-page-book-stats-a"
			>
				Stats
			</a>
		</div>
	) : null;

	const bookPageReadersAlsoEnjoyedSection =
		loaded && bookInfo.alsoEnjoyedBooks.length > 0 ? (
			<div className="book-page-readers-also-enjoyed">
				<div className="book-page-readers-also-enjoyed-main">
					<span>READERS ALSO ENJOYED</span>
					<div className="book-page-readers-also-enjoyed-selection">
						<div className="book-page-readers-also-enjoyed-main-list">
							<div
								className="book-page-readers-also-enjoyed-main-list-contents"
								style={{
									transform: `translate(${readersEnjoyedListTranslation}px)`,
								}}
							>
								{bookInfo.alsoEnjoyedBooks.map((book, index) => {
									return (
										<a
											key={index}
											className="book-page-also-enjoyed-book-a"
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
									);
								})}
							</div>
						</div>
						<button
							className={
								readersEnjoyedListTranslation < 0
									? 'book-page-readers-also-enjoyed-back-button'
									: 'book-page-readers-also-enjoyed-back-button hidden'
							}
							onClick={(_e) => {
								setReadersEnjoyedListTranslation((previousValue) => {
									const forwardButton = document.getElementsByClassName(
										'book-page-readers-also-enjoyed-forward-button'
									)[0];
									if (previousValue < -250) {
										forwardButton.classList.remove('hidden');
										return previousValue + 250;
									} else {
										return 0;
									}
								});
							}}
						></button>
						<button
							className={'book-page-readers-also-enjoyed-forward-button'}
							onClick={(_e) => {
								setReadersEnjoyedListTranslation((previousValue) => {
									const forwardButton = document.getElementsByClassName(
										'book-page-readers-also-enjoyed-forward-button'
									)[0];
									const mainListWidth = document.getElementsByClassName(
										'book-page-readers-also-enjoyed-main-list'
									)[0].offsetWidth;
									const mainListContentsWidth = document.getElementsByClassName(
										'book-page-readers-also-enjoyed-main-list-contents'
									)[0].scrollWidth;
									if (
										previousValue === 0 ||
										previousValue > -mainListContentsWidth + 250 + mainListWidth
									) {
										return previousValue - 250;
									} else {
										forwardButton.classList.add('hidden');
										return -mainListContentsWidth + mainListWidth;
									}
								});
							}}
						></button>
					</div>
				</div>
				<a
					className="book-page-readers-also-enjoyed-similar-books-a"
					href={Firebase.pageGenerator.generateSimilarBooksPage(
						bookInfo.id,
						bookInfo.title
					)}
				>
					See similar books...
				</a>
			</div>
		) : null;

	const bookPageGenres = loaded ? (
		<div className="book-page-genres">
			<div className="book-page-genres-main">
				<div className="book-page-genres-title-area">
					<a
						className="book-page-genres-title-a"
						href={Firebase.pageGenerator.generateBookTopShelvesPage(
							bookInfo.id
						)}
					>
						GENRES
					</a>
				</div>
				<div className="book-page-genres-list">
					{bookInfo.genres.map((genre, index) => {
						return (
							<div
								className={
									index === bookInfo.genres.length - 1
										? 'book-page-genres-list-cell last'
										: 'book-page-genres-list-cell'
								}
								key={index}
							>
								<a
									href={Firebase.pageGenerator.generateGenrePage(genre.genre)}
									className="genre-name"
								>
									{genre.genre.charAt(0).toUpperCase() + genre.genre.slice(1)}
								</a>
								<a
									href={Firebase.pageGenerator.generateBookGenreShelfPage(
										bookInfo.id,
										bookInfo.title,
										genre.genre
									)}
									className="user-count"
								>
									{genre.userCount} users
								</a>
							</div>
						);
					})}
				</div>
			</div>
			<a
				className="book-page-genres-see-top-shelves"
				href={Firebase.pageGenerator.generateBookTopShelvesPage(bookInfo.id)}
			>
				See top shelves...
			</a>
		</div>
	) : null;

	const bookPageAuthorAboutSection = loaded ? (
		<div className="author-about-section">
			<div className="author-about-section-title-area">
				<a
					className="author-about-section-title-a"
					href={bookInfo.authorPages[0]}
				>{`ABOUT ${bookInfo.authorNames[0].toUpperCase()}`}</a>
			</div>
			<div className="author-about-section-preview">
				<div className="author-about-section-preview-top">
					<a href={bookInfo.authorPages[0]}>
						<img
							src={
								bookInfo.mainAuthorPicture !== undefined
									? bookInfo.mainAuthorPicture
									: 'https://www.goodreads.com/assets/nophoto/user/u_60x60-267f0ca0ea48fd3acfd44b95afa64f01.png'
							}
							alt={bookInfo.authorNames[0]}
						/>
					</a>
					<div className="author-about-section-preview-right">
						<div className="author-about-section-preview-name">
							<a href={bookInfo.authorPages[0]}>{bookInfo.authorNames[0]}</a>
							{bookInfo.authorIsMember ? (
								<div className="goodreads-seal"></div>
							) : null}
						</div>
						<span className="author-about-section-preview-follower-count">
							{bookInfo.authorFollowerCount} followers
						</span>
						<button
							className={
								loadingFollowAuthor
									? 'book-page-follow-author-button loading'
									: 'book-page-follow-author-button'
							}
							onMouseOver={(_e) => {
								if (bookInfo.userIsFollowingAuthor) {
									document.getElementsByClassName(
										'book-page-follow-author-button'
									)[0].innerHTML = 'Unfollow';
								}
							}}
							onMouseOut={(_e) => {
								if (bookInfo.userIsFollowingAuthor) {
									document.getElementsByClassName(
										'book-page-follow-author-button'
									)[0].innerHTML = 'Following';
								}
							}}
							onClick={async (_e) => {
								setLoadingFollowAuthor(true);
								await Firebase.followUnfollowAuthor(
									user.userUID,
									bookInfo.mainAuthorId,
									history
								);
								setLoadingFollowAuthor(false);
								setBookInfo((previous) => {
									return {
										...previous,
										userIsFollowingAuthor: !previous.userIsFollowingAuthor,
									};
								});
							}}
						>
							{bookInfo.userIsFollowingAuthor ? 'Following' : 'Follow Author'}
						</button>
					</div>
				</div>
				<div className="author-about-section-about-wrapper">
					{bookInfo.mainAuthorAbout !== undefined ? (
						<div
							className={
								authorAboutShowMore
									? 'author-about-section-about-full'
									: 'author-about-section-about'
							}
						>
							<p className="main-author-about-p" ref={authorAboutP}>
								{bookInfo.mainAuthorAbout}
							</p>
						</div>
					) : null}
					{authorAboutHeight > 162 ? (
						<button
							className="author-about-show-more"
							onClick={(_e) => {
								setAuthorAboutShowMore((previous) => !previous);
							}}
						>
							{authorAboutShowMore ? '(less)' : '...more'}
						</button>
					) : null}
				</div>
			</div>
		</div>
	) : null;

	const bookPageBooksByAuthorSection = loaded ? (
		<div className="book-page-books-by-author">
			<div className="book-page-books-by-author-main">
				<div className="book-page-books-by-author-main-title-area">
					<a
						className="book-page-books-by-author-a"
						href={bookInfo.booksByAuthorPage}
					>{`BOOKS BY ${bookInfo.authorNames[0].toUpperCase()}`}</a>
				</div>
				<div className="book-page-books-by-author-main-list">
					{bookInfo.publishedBooksByAuthor.map((book, index) => {
						return (
							<a key={index} href={book.page}>
								<img
									src={
										book.cover !== undefined
											? book.cover
											: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png'
									}
									alt={book.id}
								/>
							</a>
						);
					})}
				</div>
			</div>
			<a
				className="book-page-books-by-author-more"
				href={bookInfo.booksByAuthorPage}
			>
				More...
			</a>
		</div>
	) : null;

	const bookPageArticlesFeaturingBook =
		loaded && bookInfo.articles.length > 0 ? (
			<div className="book-page-articles">
				<div className="book-page-articles-title-area">
					<span className="book-page-articles-title">
						ARTICLES FEATURING THIS BOOK
					</span>
				</div>
				<div className="book-page-articles-article">
					{bookInfo.articles[0].image !== undefined ? (
						<img
							className="book-page-article-image"
							src={bookInfo.articles[0].image}
							alt={bookInfo.articles[0].title}
						/>
					) : null}
					<a
						className="book-page-article-title-a"
						href={Firebase.pageGenerator.generateArticlePage(
							bookInfo.articles[0].id,
							bookInfo.articles[0].title
						)}
					>
						{bookInfo.articles[0].title}
					</a>
					<p className="book-page-article-content">
						{bookInfo.articles[0].content}
					</p>
					<a
						className="book-page-article-read-more-a"
						href={Firebase.pageGenerator.generateArticlePage(
							bookInfo.articles[0].id,
							bookInfo.articles[0].title
						)}
					>
						Read more...
					</a>
					<div className="book-page-articles-article-bottom">
						<span>{`${bookInfo.articles[0].likeCount} likes`}</span>
						<span>·</span>
						<span>{`${bookInfo.articles[0].commentCount} comments`}</span>
					</div>
				</div>
			</div>
		) : null;

	const bookPageQuizQuestionIndex = loaded
		? Math.floor(Math.random() * bookInfo.quizQuestions.length)
		: -1;

	const bookPageQuizQuestion = loaded ? (
		bookInfo.quizQuestions.length > 0 ? (
			<div className="book-page-quiz-section">
				<div className="book-page-quiz-section-title-area">
					<a
						className="book-page-quiz-question-a"
						href={Firebase.pageGenerator.generateBookTriviaPage(
							bookInfo.id,
							bookInfo.title
						)}
					>
						QUIZ QUESTION
					</a>
				</div>
				<div className="book-page-quiz-question-main">
					<a
						className="book-page-quiz-title-a"
						href={bookInfo.quizQuestions[bookPageQuizQuestionIndex].quizPage}
					>
						{bookInfo.quizQuestions[bookPageQuizQuestionIndex].quizTitle}
					</a>
					<span className="book-page-quiz-description">
						{bookInfo.quizQuestions[bookPageQuizQuestionIndex].quizDescription}
					</span>
					<div className="book-page-quiz-question-main-actual-question">
						<span>
							{bookInfo.quizQuestions[bookPageQuizQuestionIndex].question}
						</span>
						{bookInfo.quizQuestions[bookPageQuizQuestionIndex].options.map(
							(option, index) => {
								return (
									<div className="book-page-quiz-answer" key={index}>
										<input
											id={`quiz-radio-${index}`}
											type="radio"
											checked={quizQuestionOptionSelected === index}
											value={option}
											onChange={(_e) => {
												setQuizQuestionOptionSelected(index);
											}}
										/>
										<label htmlFor={`quiz-radio-${index}`}>{option}</label>
									</div>
								);
							}
						)}
					</div>
				</div>
				<a
					className="book-page-quiz-question-take"
					href={bookInfo.quizQuestions[bookPageQuizQuestionIndex].quizPage}
				>
					Take this quizz...
				</a>
			</div>
		) : (
			<div className="book-page-quiz-section">
				<div className="book-page-quiz-section-title-area">
					<a
						className="book-page-quiz-question-a"
						href={Firebase.pageGenerator.generateBookTriviaPage(
							bookInfo.id,
							bookInfo.title
						)}
					>{`QUIZZES ABOUT ${bookInfo.title.toUpperCase()}:...`}</a>
				</div>
				<span className="book-page-no-quizzes-yet-span">
					No quizzes yet.{' '}
					<a
						className="book-page-add-quizzes-now-a"
						href={Firebase.pageGenerator.generateBookTriviaPage(
							bookInfo.id,
							bookInfo.title
						)}
					>
						Add some now »
					</a>
				</span>
			</div>
		)
	) : null;

	const bookPageQuotes =
		loaded && bookInfo.quotes.length > 0 ? (
			<div className="book-page-quotes-section">
				<div className="book-page-quotes-section-title-area">
					<a
						className="book-page-quotes-section-a"
						href={bookInfo.quotesPage}
					>{`QUOTES FROM ${bookInfo.title.toUpperCase()}:...`}</a>
				</div>
				<div className="book-info-quotes-section-main">
					{bookInfo.quotes.map((quote, index) => {
						return (
							<span className="book-page-quotes-section-quote" key={index}>
								{`"${quote.text}" – `}
								<a href={quote.page}>{`${quote.likeCount} likes`}</a>
							</span>
						);
					})}
				</div>
				<a className="book-info-quotes-more-quotes" href={bookInfo.quotesPage}>
					More quotes...
				</a>
			</div>
		) : null;

	const bookPageMainContentRight = (
		<div className="book-page-main-content-right">
			{bookPageMainContentRightTop}
			{bookPageReadersAlsoEnjoyedSection}
			{bookPageGenres}
			{bookPageAuthorAboutSection}
			{bookPageBooksByAuthorSection}
			{bookPageArticlesFeaturingBook}
			{bookPageQuizQuestion}
			{bookPageQuotes}
		</div>
	);

	const bookPageMainContent = loaded ? (
		<div className="book-page-main-content">
			{bookPageMainContentLeft}
			{bookPageMainContentRight}
		</div>
	) : null;

	const bookPageEnlargingCover = loaded ? (
		<div
			className={
				showEnlargeCoverWindow
					? 'cover-picture-box'
					: 'cover-picture-box hidden'
			}
			ref={enlargeCoverWindow}
		>
			<button
				className="window-close-button"
				onClick={(_e) => setShowEnlargeCoverWindow(false)}
			></button>
			<img
				src={bookInfo.cover}
				alt={bookInfo.title}
				className="book-info-book-cover-enlarged"
			></img>
		</div>
	) : null;

	const bookPageRecommendToFriends = loaded ? (
		<div
			className={
				showRecommendWindow ? 'recommend-window' : 'recommend-window hidden'
			}
			ref={recommendWindow}
		>
			<button
				className="window-close-button"
				onClick={(_e) => setShowRecommendWindow(false)}
			></button>
			<div className="content">
				<div className="recommend-window-top-area">
					<div className="recommend-window-top-area-left">
						<span>
							Recommend <i>{bookInfo.title}</i> to your friends
						</span>
						<div className="searchbox-area">
							<input
								type="search"
								placeholder="Search by name"
								value={recommendWindowSearchBox}
								onChange={(e) => setRecommendWindowSearchBox(e.target.value)}
							></input>
							<button
								className={
									recommendWindowSearchBox.length > 0
										? 'clear-button'
										: 'clear-button hidden'
								}
								onClick={(e) => {
									setRecommendWindowSearchBox('');
								}}
							></button>
						</div>
					</div>
					<div className="recommend-window-top-area-right">
						<img
							src={
								bookInfo.cover !== undefined
									? bookInfo.cover
									: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png'
							}
							alt={bookInfo.title}
						/>
					</div>
				</div>
				<div className="recommend-window-bottom-area">
					{!loadingFriends ? (
						friendsInfo
							.filter((friendInfo) =>
								friendInfo.firstName.includes(recommendWindowSearchBox)
							)
							.map((friend, index) => {
								return (
									<div className="recommend-window-friend-info" key={index}>
										<div className="recommend-window-friend-info-left">
											<img
												src={
													friend.profileImage !== undefined
														? friend.profileImage
														: 'https://www.goodreads.com/assets/nophoto/user/u_60x60-267f0ca0ea48fd3acfd44b95afa64f01.png'
												}
												alt={friend.firstName}
											/>
										</div>
										<div className="recommend-window-friend-info-right">
											<div className="recommend-window-friend-info-right-top">
												{!recommendWindowAddingMessages[index] ||
												recommendWindowSentStatuses[index] ? (
													<span className="friend-name-span">
														{friend.firstName}
													</span>
												) : (
													<textarea
														type="text"
														className="friend-recommend-message-input"
														placeholder={`${friend.firstName} would like this book because...`}
														value={recommendWindowMessages[index]}
														onChange={(event) => {
															const newValue = event.target.value;
															setRecommendWindowMessages((previous) => {
																return previous.map((message, i) => {
																	if (i === index) {
																		return newValue;
																	} else {
																		return message;
																	}
																});
															});
														}}
													></textarea>
												)}
											</div>
											<div className="recommend-window-friend-info-right-bottom">
												<button
													className="recommend-to-friend-button"
													onClick={async (_e) => {
														if (!recommendWindowSentStatuses[index]) {
															await Firebase.recommendBook(
																user.userUID,
																friend.id,
																bookInfo.id,
																recommendWindowMessages[index]
															);
															setRecommendWindowSentStatuses((previous) => {
																return previous.map((status, i) => {
																	if (i === index) {
																		return !status;
																	}
																	return status;
																});
															});
														}
													}}
												>
													Recommend
												</button>
												{!recommendWindowSentStatuses[index] ? (
													<button
														className="clear-message-button"
														onClick={(_e) =>
															setRecommendWindowAddingMessages((previous) =>
																previous.map((value, i) => {
																	if (i === index) {
																		return !value;
																	} else {
																		return value;
																	}
																})
															)
														}
													>
														{recommendWindowAddingMessages[index]
															? 'clear message'
															: 'add message'}
													</button>
												) : null}
											</div>
											{recommendWindowSentStatuses[index] ? (
												<div className="recommended-message-area">
													<div className="check-banner"></div>
													<span>Recommended</span>
												</div>
											) : null}
										</div>
									</div>
								);
							})
					) : (
						<img
							className="loading-spinner"
							src={'https://s.gr-assets.com/assets/spinner.gif'}
							alt="Loading"
						></img>
					)}
				</div>
			</div>
		</div>
	) : null;

	return (
		<div className="book-page">
			<TopBar />
			{bookPageMainContent}
			{bookPageEnlargingCover}
			{bookPageRecommendToFriends}
			<HomePageFootBar />
			<div
				className={
					showEnlargeCoverWindow || showRecommendWindow
						? 'page-mask'
						: 'page-mask hidden'
				}
			></div>
		</div>
	);
};

export default BookPage;
