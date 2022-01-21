import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';
import '../styles/Authors/AuthorPage.css';

const AuthorPage = ({ match }) => {
	const history = useHistory();
	const {
		params: { authorPageId },
	} = match;
	const followAuthorDropdown = useRef();
	const followAuthorDropdownTrigger = useRef();
	const authorId = authorPageId.split('.')[0];
	const authorName = authorPageId.split('.')[1].replace(/_/g, ' ');
	const authorFirstName = authorName.split(' ')[0];
	const [loaded, setLoaded] = useState(false);
	const [authorInfo, setAuthorInfo] = useState({});
	const [savingShelves, setSavingShelves] = useState([]);
	const [areShelfPopupsHidden, setAreShelfPopupsHidden] = useState([]);
	const [areShelfPopupsBottomHidden, setAreShelfPopupsBottomHidden] = useState(
		[]
	);
	const [shelfPopupReadingInputs, setShelfPopupReadingInputs] = useState([]);
	const [shelfPopupToReadInputs, setShelfPopupToReadInputs] = useState([]);
	const [
		areAddShelfInputSectionsHidden,
		setAreAddShelfInputSectionsHidden,
	] = useState([]);
	const [addShelfInputs, setAddShelfInputs] = useState([]);
	const [exhibitedStarRatings, setExhibitedStarRatings] = useState([]);
	const [nowAuthorInFavorites, setNowAuthorInFavorites] = useState(false);
	const [nowAuthorNotInFavorites, setNowAuthorNotInFavorites] = useState(false);
	const [
		followAuthorDropdownVisible,
		setFollowAuthorDropdownVisible,
	] = useState(false);
	const [isShowingAuthorRatingStats, setIsShowingAuthorRatingStats] = useState(
		false
	);
	const [authorDescriptionShowMore, setAuthorDescriptionShowMore] = useState(
		false
	);
	const [userLikedQuotes, setUserLikedQuotes] = useState([]);

	const user = JSON.parse(localStorage.getItem('userState'));

	useEffect(() => {
		const getAuthorInfo = async () => {
			const authorObject = await Firebase.getAuthorInfoForAuthorPage(
				user !== null ? user.userUID : null,
				authorId
			);
			setAuthorInfo(authorObject);
			setSavingShelves(authorObject.booksByAuthor.map((_book) => false));
			setAreAddShelfInputSectionsHidden(
				authorObject.booksByAuthor.map((_book) => true)
			);
			setAddShelfInputs(authorObject.booksByAuthor.map((_book) => ''));
			setExhibitedStarRatings(
				authorObject.booksByAuthor.map((book) =>
					book.userRating !== undefined ? book.userRating : 0
				)
			);
			setAreShelfPopupsHidden(authorObject.booksByAuthor.map((_book) => true));
			setAreShelfPopupsBottomHidden(
				authorObject.booksByAuthor.map((_book) => true)
			);
			setShelfPopupReadingInputs(authorObject.booksByAuthor.map((_book) => ''));
			setShelfPopupToReadInputs(authorObject.booksByAuthor.map((_book) => ''));
			setLoaded(true);
		};
		getAuthorInfo();
	}, [authorId, user]);

	useEffect(() => {
		document.addEventListener('click', (event) => {
			if (
				followAuthorDropdown.current !== null &&
				followAuthorDropdown.current !== undefined &&
				followAuthorDropdownTrigger.current !== null &&
				followAuthorDropdownTrigger.current !== undefined &&
				!followAuthorDropdown.current.contains(event.target) &&
				!followAuthorDropdownTrigger.current.contains(event.target)
			) {
				setFollowAuthorDropdownVisible(false);
			}
		});
	}, []);

	const authorBooksAverageRating =
		loaded &&
		authorInfo.booksByAuthor.filter((book) => book.averageRating !== 0).length >
			0
			? authorInfo.booksByAuthor
					.filter((book) => book.averageRating !== 0)
					.reduce(
						(previous, current) =>
							previous +
							current.averageRating /
								authorInfo.booksByAuthor.filter(
									(book) => book.averageRating !== 0
								).length,
						0
					)
			: 0;
	const authorBooksTotalRatings = loaded
		? authorInfo.booksByAuthor.reduce(
				(previous, current) => previous + current.ratings,
				0
		  )
		: 0;
	const authorBooksNumberOfReviews = loaded
		? authorInfo.booksByAuthor.reduce(
				(previous, current) => previous + current.numberOfReviews,
				0
		  )
		: 0;

	const displayRemoveBookConfirm = () => {
		return window.confirm(
			'Removing a book deletes your rating, review, etc. Remove this book from all your shelves?'
		);
	};

	const removeBookSafely = (bookObject, index) => {
		if (displayRemoveBookConfirm()) {
			Firebase.removeBookFromShelf(user.userUID, bookObject.id);
			setAuthorInfo((previous) => {
				return {
					...previous,
					booksByAuthor: previous.booksByAuthor.map((book, i) => {
						if (i === index) {
							return {
								...book,
								userStatus: undefined,
								userProgress: undefined,
								userRating: undefined,
							};
						}
						return book;
					}),
				};
			});
		}
	};

	const changeBookShelf = async (bookObject, index, shelf) => {
		if (bookObject.id !== undefined) {
			setSavingShelves((previous) =>
				previous.map((value, i) => (i === index ? true : value))
			);
			await Firebase.addBookToShelf(
				user.userUID,
				bookObject.id,
				shelf,
				history
			);
			setAuthorInfo((previous) => {
				return {
					...previous,
					booksByAuthor: previous.booksByAuthor.map((book, i) => {
						if (i === index) {
							return {
								...book,
								userStatus: shelf,
							};
						}
						return book;
					}),
				};
			});
			setSavingShelves((previous) =>
				previous.map((value, i) => (i === index ? false : value))
			);
		}
	};

	const rateBook = async (bookObject, index, rating) => {
		if (bookObject.id !== undefined) {
			await Firebase.rateBook(user.userUID, bookObject.id, rating, history);
			setAuthorInfo((previous, i) => {
				return {
					...previous,
					booksByAuthor: previous.booksByAuthor.map((book, i) => {
						if (i === index) {
							return {
								...book,
								userStatus:
									book.userStatus === undefined ? 'read' : book.userStatus,
								userRating: rating,
							};
						}
						return book;
					}),
				};
			});
		}
	};

	const updateProgress = async (bookObject, index, pages) => {
		if (
			user.userUID !== null &&
			user.userUID !== undefined &&
			bookObject.id !== undefined &&
			pages.length > 0
		) {
			await Firebase.updateBookInShelf(
				user.userUID,
				bookObject.id,
				parseInt(pages)
			);
			setAuthorInfo((previous) => {
				return {
					...previous,
					booksByAuthor: previous.booksByAuthor.map((book, i) => {
						if (i === index) {
							return {
								...book,
								userProgress: pages,
							};
						}
						return book;
					}),
				};
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
									bookObject.id
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
											bookObject.id,
											parseInt(shelfPopupToReadInputs[index])
										);
										setAuthorInfo((previous) => {
											return {
												...previous,
												booksByAuthor: previous.booksByAuthor.map((book, i) =>
													i === index
														? {
																...book,
																toReadBookPosition: parseInt(
																	shelfPopupToReadInputs[index]
																),
														  }
														: book
												),
											};
										});
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

	const followButtonAndDropdown = loaded ? (
		<div className="follow-button-and-dropdown">
			<button
				className="follow-author-button"
				onClick={async (_e) => {
					await Firebase.followUnfollowAuthor(
						user !== null ? user.userUID : null,
						authorId,
						history
					);
					setAuthorInfo((previous) => {
						return {
							...previous,
							followers:
								user !== null &&
								previous.followers
									.map((follower) => follower.id)
									.includes(user.userUID)
									? previous.followers.filter(
											(follower) => follower.id !== user.userUID
									  )
									: user !== null
									? previous.followers.concat({
											id: user.userUID,
											name: user.userInfo.firstName,
											profilePicture:
												user.userInfo.profilePicture !== undefined
													? user.userInfo.profilePicture
													: 'https://www.goodreads.com/assets/nophoto/user/u_60x60-267f0ca0ea48fd3acfd44b95afa64f01.png',
									  })
									: previous.followers,
						};
					});
				}}
				onMouseOver={(_e) => {
					if (
						user !== null &&
						authorInfo.followers
							.map((follower) => follower.id)
							.includes(user.userUID)
					) {
						document.getElementsByClassName(
							'follow-author-button'
						)[0].innerHTML = 'Unfollow';
					}
				}}
				onMouseOut={(_e) => {
					if (
						user !== null &&
						authorInfo.followers
							.map((follower) => follower.id)
							.includes(user.userUID)
					) {
						document.getElementsByClassName(
							'follow-author-button'
						)[0].innerHTML = 'Following';
					}
				}}
			>
				{user === null ||
				user.userUID === undefined ||
				!authorInfo.followers
					.map((follower) => follower.id)
					.includes(user.userUID)
					? 'Follow Author'
					: 'Following'}
			</button>
			<div
				className="follow-author-dropdown-trigger"
				onClick={(_e) => {
					setFollowAuthorDropdownVisible((previous) => !previous);
				}}
				ref={followAuthorDropdownTrigger}
			>
				<div
					className={
						followAuthorDropdownVisible
							? 'follow-author-dropdown'
							: 'follow-author-dropdown hidden'
					}
					ref={followAuthorDropdown}
				>
					<ul>
						<li>
							<a
								href={Firebase.pageGenerator.generateUserCompareBooksPage(
									authorId
								)}
							>
								Compare books
							</a>
						</li>
						<li>
							<button
								onClick={async (_e) => {
									await Firebase.addRemoveAuthorToFavorites(
										user.userUID,
										authorId,
										history
									);
									if (
										user !== null &&
										authorInfo.usersWhoHaveAsFavorite.includes(user.userUID)
									) {
										setAuthorInfo((previous) => {
											return {
												...previous,
												usersWhoHaveAsFavorite: previous.usersWhoHaveAsFavorite.filter(
													(user) => user !== user.userUID
												),
											};
										});
										setNowAuthorInFavorites(false);
										setNowAuthorNotInFavorites(true);
									} else {
										if (user !== null) {
											setAuthorInfo((previous) => {
												return {
													...previous,
													usersWhoHaveAsFavorite: previous.usersWhoHaveAsFavorite.concat(
														user.userUID
													),
												};
											});
											setNowAuthorInFavorites(true);
											setNowAuthorNotInFavorites(false);
										}
									}
								}}
							>
								{user === null ||
								!authorInfo.usersWhoHaveAsFavorite.includes(user.userUID)
									? 'Add to my favorite authors'
									: 'Remove from my favorite authors'}
							</button>
						</li>
						<li>
							<a href={Firebase.pageGenerator.generateFavoriteAuthorsPage()}>
								Edit my favorite authors
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	) : null;

	const photoAndStatsArea = loaded ? (
		<div className="author-page-photo-and-stats-area">
			<div className="top-section">
				<div className="profile-picture-section">
					<img
						src={
							authorInfo.profilePicture !== undefined
								? authorInfo.profilePicture
								: 'https://www.goodreads.com/assets/nophoto/user/u_60x60-267f0ca0ea48fd3acfd44b95afa64f01.png'
						}
						alt={authorName}
					/>
					{authorInfo.GRMember ? (
						<div className="author-stats">
							<a
								href={Firebase.pageGenerator.generateUserRatingsPage(authorId)}
							>{`${authorInfo.numberOfRatings} ratings`}</a>
							<span>|</span>
							<a
								href={Firebase.pageGenerator.generateUserReviewsPage(authorId)}
							>{`${authorInfo.numberOfReviews} reviews`}</a>
							<span>|</span>
							<button
								onClick={(_e) => setIsShowingAuthorRatingStats(true)}
							>{`avg rating:${Math.round(
								authorInfo.averageRating,
								2
							)}`}</button>
							<div
								className={
									isShowingAuthorRatingStats
										? 'author-rating-stats'
										: 'author-rating-stats hidden'
								}
							>
								{/* Rating stats */}
							</div>
						</div>
					) : null}
				</div>
				{followButtonAndDropdown}
			</div>
			<div className="bottom-section">
				{authorInfo.mostFollowedPosition !== undefined ? (
					<span>{`#${authorInfo.mostFollowedPosition} most followed`}</span>
				) : null}
				{authorInfo.reviewerPosition !== undefined ? (
					<span>{`#${authorInfo.reviewerPosition} best reviewers`}</span>
				) : null}
			</div>
		</div>
	) : null;

	const yearInBooksSection =
		loaded && authorInfo.GRMember ? (
			<div className="author-page-year-in-books-section">
				<a
					className="section-title"
					href={Firebase.pageGenerator.generateUserYearInBooksPage(
						new Date().getFullYear(),
						authorId
					)}
				>{`${authorFirstName.toUpperCase()}'S YEAR IN BOOKS`}</a>
				<div className="inner-content">
					<a
						className="image-wrapper"
						href={Firebase.pageGenerator.generateUserYearInBooksPage(
							new Date().getFullYear(),
							authorId
						)}
					>
						<img
							src={
								'https://s.gr-assets.com/assets/yyib/yearly/yyib_badge-58c13ce9eeb35da7dda8dcf63aba2962.jpg'
							}
							alt="Year in books"
						/>
					</a>
					<div className="year-in-books-right-section">
						<span>
							<b>{`${authorFirstName}'s ${new Date().getFullYear()} Year in Books`}</b>
						</span>
						<span>{`Take a look at ${authorFirstName}'s Year in Books. The long, the short—it’s all here.`}</span>
						<a
							href={Firebase.pageGenerator.generateUserYearInBooksPage(
								new Date().getFullYear(),
								authorId
							)}
						>{`See ${authorFirstName}'s ${new Date().getFullYear()} Year in Books`}</a>
					</div>
				</div>
			</div>
		) : null;

	const followersSection = loaded ? (
		<div className="author-page-followers-section">
			<span className="section-title">{`${authorName.toUpperCase()}'S FOLLOWERS (${
				authorInfo.followers.length
			})`}</span>
			{authorInfo.followers.length > 0 ? (
				<div className="follower-list">
					{authorInfo.followers.map((follower, index) => {
						return (
							<a
								href={Firebase.pageGenerator.generateUserPage(
									follower.id,
									follower.name
								)}
								key={index}
							>
								<img src={follower.profilePicture} alt={follower.name} />
							</a>
						);
					})}
				</div>
			) : (
				<span className="no-followers-span">None yet.</span>
			)}
		</div>
	) : null;

	const bookshelvesSection =
		loaded && authorInfo.GRMember ? (
			<div className="author-page-bookshelves-section">
				<a
					className="section-title"
					href={Firebase.pageGenerator.generateUserBooksPage(authorId)}
				>{`${authorFirstName.toUpperCase()}'S BOOKSHELVES`}</a>
				<div className="shelf-list">
					<a
						href={Firebase.pageGenerator.generateUserShelfPage(
							authorId,
							authorFirstName,
							['read']
						)}
					>{`read (${authorInfo.numberOfReadBooks})`}</a>
					<a
						href={Firebase.pageGenerator.generateUserShelfPage(
							authorId,
							authorFirstName,
							['reading']
						)}
					>{`currently-reading (${authorInfo.numberOfReadingBooks})`}</a>
					<a
						href={Firebase.pageGenerator.generateUserShelfPage(
							authorId,
							authorFirstName,
							['to-read']
						)}
					>{`to-read (${authorInfo.numberOfToReadBooks})`}</a>
					<a
						href={Firebase.pageGenerator.generateUserShelfPage(
							authorId,
							authorFirstName,
							['favorites']
						)}
					>{`favorites (${authorInfo.numberOfFavoriteBooks})`}</a>
				</div>
			</div>
		) : null;

	const friendsSection =
		loaded && authorInfo.GRMember && authorInfo.friends.length > 0 ? (
			<div className="author-page-friends-section">
				<span className="section-title">{`${authorFirstName.toUpperCase()}'S FRIENDS`}</span>
				<div className="friend-list">
					{authorInfo.friends.map((friend, index) => {
						return (
							<div className="friend-card" key={index}>
								<a
									className="profile-picture-wrapper"
									href={Firebase.pageGenerator.generateAuthorPage(
										friend.id,
										friend.name
									)}
								>
									<img
										src={
											friend.profilePicture !== undefined
												? friend.profilePicture
												: 'https://www.goodreads.com/assets/nophoto/user/u_60x60-267f0ca0ea48fd3acfd44b95afa64f01.png'
										}
										alt={friend.name}
									/>
								</a>
								<div className="right-section">
									<a
										href={Firebase.pageGenerator.generateAuthorPage(
											friend.id,
											friend.name
										)}
									>
										{friend.name}
									</a>
									<div className="friend-stats">
										<span>{`${friend.numberOfBooks} books`}</span>
										<span className="separator">|</span>
										<span>{`${friend.numberOfFriends} friends`}</span>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		) : null;

	const mainContentLeftSection = (
		<div className="author-page-main-content-left-section">
			{photoAndStatsArea}
			{yearInBooksSection}
			{followersSection}
			{bookshelvesSection}
			{friendsSection}
		</div>
	);

	const authorNowInFavoritesMessage =
		loaded & (nowAuthorInFavorites || nowAuthorNotInFavorites) ? (
			<div className="author-now-in-favorites-message">
				{nowAuthorInFavorites ? (
					<span>
						{`${authorName} is now on your `}
						<b>Favorite Authors</b> list
					</span>
				) : (
					<span>
						{`${authorName} has been removed from your `}
						<b>Favorite Authors</b> list
					</span>
				)}
				<button
					className="close-button"
					onClick={(_e) => {
						setNowAuthorInFavorites(false);
						setNowAuthorNotInFavorites(false);
					}}
				></button>
			</div>
		) : null;

	const authorMainInfoSection = loaded ? (
		<div className="author-page-author-main-info-section">
			<div className="author-name-area">
				<span className="author-name">{authorName}</span>
				{authorInfo.GRMember ? (
					<div className="goodreads-seal-area">
						<div className="goodreads-seal"></div>
						<span>Goodreads Author</span>
					</div>
				) : null}
			</div>
			<table className="author-info-table">
				<tbody>
					{authorInfo.placeOfBirth !== undefined ||
					authorInfo.dateOfBirth !== undefined ? (
						<tr>
							<th>Born</th>
							<td className="birth-info">
								{authorInfo.placeOfBirth !== undefined ? (
									<td>{`in ${authorInfo.placeOfBirth}`}</td>
								) : null}
								{authorInfo.dateOfBirth !== undefined ? (
									<td>{`${format(
										authorInfo.dateOfBirth,
										'MMMM dd, yyyy'
									)}`}</td>
								) : null}
							</td>
						</tr>
					) : null}
					{authorInfo.website !== undefined ? (
						<tr>
							<th>Website</th>
							<td>
								<a href={authorInfo.website}>{authorInfo.website}</a>
							</td>
						</tr>
					) : null}
					{authorInfo.twitter !== undefined ? (
						<tr>
							<th>Twitter</th>
							<td>
								<a href={`https://twitter.com/${authorInfo.twitter}`}>
									{authorInfo.twitter}
								</a>
							</td>
						</tr>
					) : null}
					{authorInfo.genre !== undefined ? (
						<tr>
							<th>Genre</th>
							<td>
								{authorInfo.genre.map((genre, index) => {
									return (
										<span className="author-genre" key={index}>
											<a
												key={index}
												href={Firebase.pageGenerator.generateGenrePage(genre)}
											>
												{genre
													.split('-')
													.map((string) =>
														string.length > 1
															? string[0].toUpperCase() + string.slice(1)
															: string[0]
													)
													.join(' ')}
											</a>
											{index !== authorInfo.genre.length - 1 ? (
												<span>{', '}</span>
											) : null}
										</span>
									);
								})}
							</td>
						</tr>
					) : null}
					{authorInfo.influences !== undefined ? (
						<tr>
							<th>Influences</th>
							<td>
								{authorInfo.influences.map((influence, index) => {
									return (
										<span className="author-influence">
											<a
												key={index}
												href={Firebase.pageGenerator.generateAuthorPage(
													influence.id,
													influence.name
												)}
											>
												{influence.name}
											</a>
											{index !== authorInfo.influences.length - 1 ? (
												<span>{', '}</span>
											) : null}
										</span>
									);
								})}
							</td>
						</tr>
					) : null}
					{authorInfo.memberSince !== undefined ? (
						<tr>
							<th>Member Since</th>
							<td>{format(authorInfo.memberSince, 'MMMM yyyy')}</td>
						</tr>
					) : null}
				</tbody>
			</table>
			{authorInfo.description !== undefined ? (
				<div
					className={
						authorDescriptionShowMore
							? 'author-description-area more'
							: 'author-description-area'
					}
				>
					<p>{authorInfo.description}</p>
					<button
						className="author-description-show-more-button"
						onClick={(_e) =>
							setAuthorDescriptionShowMore((previous) => !previous)
						}
					>
						{authorDescriptionShowMore ? '(less)' : '...more'}
					</button>
				</div>
			) : null}
		</div>
	) : null;

	const authorBooksSection = loaded ? (
		<div className="author-page-author-books-section">
			<span className="section-title">{`${authorName.toUpperCase()}'S BOOKS`}</span>
			<div className="author-books-stats">
				<span>{`Average rating: ${authorBooksAverageRating.toFixed(2)}`}</span>
				<span className="separator">·</span>
				<span>{`${authorBooksTotalRatings} ratings`}</span>
				<span className="separator">·</span>
				<span>{`${authorBooksNumberOfReviews} reviews`}</span>
			</div>
			<div className="author-book-list">
				{authorInfo.booksByAuthor
					.filter((_book, index) => index <= 9)
					.map((book, index) => {
						return (
							<div className="author-book-card" key={index}>
								<div className="left-section">
									<a
										className="book-cover-wrapper"
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
									<div className="book-details-section">
										<a
											className="book-title-a"
											href={Firebase.pageGenerator.generateBookPage(
												book.id,
												book.title
											)}
										>
											{book.series === undefined
												? book.title
												: `${book.title} (${book.series}, #${book.seriesInstance})`}
										</a>
										<span className="by-author-span">
											<span>by </span>
											<a
												className="author-book-card-author-a"
												href={Firebase.pageGenerator.generateAuthorPage(
													authorId,
													authorName
												)}
											>
												{authorName}
											</a>
											{authorInfo.GRMember ? (
												<span className="book-card-goodreads-member-span">
													{' '}
													(Goodreads Author)
												</span>
											) : null}
										</span>
										<div className="author-book-card-stats">
											<div className="author-page-general-rating">
												<div className="author-page-general-rating-stars">
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
													<span>{`${book.averageRating.toFixed(
														2
													)} avg rating — ${book.ratings} ratings ${
														book.publishedYear !== undefined
															? `— published ${book.publishedYear}`
															: ''
													} —`}</span>
													<a
														href={Firebase.pageGenerator.generateBookEditionsPage(
															book.id,
															book.title
														)}
													>{` ${book.editions} editions`}</a>
												</span>
											</div>
										</div>
									</div>
								</div>
								<div className="right-section">
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
							</div>
						);
					})}
			</div>
		</div>
	) : null;

	const authorSeriesSection =
		loaded && authorInfo.seriesByAuthor.length > 0 ? (
			<div className="author-page-author-series-section">
				<span className="title-span">{`SERIES BY ${authorName.toUpperCase()}`}</span>
				<div className="series-list">
					{authorInfo.seriesByAuthor
						.filter((_series, index) => index <= 4)
						.map((series, index) => {
							return (
								<div className="author-page-series-card" key={index}>
									<div className="series-card-left-section">
										<div className="series-title">
											<span className="bold-title">{series.title}</span>
											<span className="number-of-books">{` (${series.books.length} books)`}</span>
										</div>
										<div className="series-authorship">
											<span className="by-author-span">
												by{' '}
												<a
													className="author-series-card-author-a"
													href={Firebase.pageGenerator.generateAuthorPage(
														authorId,
														authorName
													)}
												>
													{authorName}
												</a>
												{authorInfo.GRMember ? (
													<span className="series-card-goodreads-member-span">
														{' '}
														(Goodreads Author)
													</span>
												) : null}
											</span>
											<div className="series-stats">
												<div className="author-page-general-rating-stars">
													<div
														className={
															series.averageRating >= 1
																? 'static-star small full'
																: series.averageRating >= 0.5
																? 'static-star small almost-full'
																: series.averageRating > 0
																? 'static-star small almost-empty'
																: 'static-star small empty'
														}
													></div>
													<div
														className={
															series.averageRating >= 2
																? 'static-star small full'
																: series.averageRating >= 1.5
																? 'static-star small almost-full'
																: series.averageRating > 1
																? 'static-star small almost-empty'
																: 'static-star small empty'
														}
													></div>
													<div
														className={
															series.averageRating >= 3
																? 'static-star small full'
																: series.averageRating >= 2.5
																? 'static-star small almost-full'
																: series.averageRating > 2
																? 'static-star small almost-empty'
																: 'static-star small empty'
														}
													></div>
													<div
														className={
															series.averageRating >= 4
																? 'static-star small full'
																: series.averageRating >= 3.5
																? 'static-star small almost-full'
																: series.averageRating > 3
																? 'static-star small almost-empty'
																: 'static-star small empty'
														}
													></div>
													<div
														className={
															series.averageRating >= 5
																? 'static-star small full'
																: series.averageRating >= 4.5
																? 'static-star small almost-full'
																: series.averageRating > 4
																? 'static-star small almost-empty'
																: 'static-star small empty'
														}
													></div>
												</div>
												<span className="stats-span">{`${series.averageRating} avg rating — ${series.numberOfRatings} ratings`}</span>
											</div>
										</div>
									</div>
									<div className="series-card-right-section">
										{series.books
											.sort((a, b) => a.seriesInstance - b.seriesInstance)
											.map((book, i) => {
												return (
													<a
														className="series-card-book-cover-wrapper"
														key={i}
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
							);
						})}
				</div>
			</div>
		) : null;

	const relatedNewsSection =
		loaded && authorInfo.relatedNews.length > 0 ? (
			<div className="author-page-related-news-section">
				<span className="section-title">RELATED NEWS</span>
				<div className="news-list">
					{authorInfo.relatedNews
						.filter((_article, index) => index <= 2)
						.map((article, index) => {
							return (
								<div className="related-news-card" key={index}>
									<div className="left-section">
										<a
											className="article-title"
											href={Firebase.pageGenerator.generateArticlePage(
												article.id,
												article.title
											)}
										>
											{article.title}
										</a>
										<p>{article.content}</p>
										<a
											className="article-read-more-a"
											href={Firebase.pageGenerator.generateArticlePage(
												article.id,
												article.title
											)}
										>
											Read more...
										</a>
										<span className="article-like-count">{`${article.numberOfLikes} likes · ${article.numberOfComments} comments`}</span>
									</div>
									{article.image !== undefined ? (
										<div className="right-section">
											<a
												className="article-image-wrapper"
												href={Firebase.pageGenerator.generateArticlePage(
													article.id,
													article.title
												)}
											>
												<img src={article.image} alt={article.title} />
											</a>
										</div>
									) : null}
								</div>
							);
						})}
				</div>
			</div>
		) : null;

	const quotesSection =
		loaded && authorInfo.quotes.length > 0 ? (
			<div className="author-page-quotes-section">
				<span className="section-title">{`QUOTES BY ${authorName.toUpperCase()}`}</span>
				<div className="quote-list">
					{authorInfo.quotes
						.filter((_quote, index) => index <= 2)
						.map((quote, index) => {
							return (
								<div className="quote-card" key={index}>
									<div className="left-section">
										<span className="quote">{`“${quote.content}”`}</span>
										<span className="quote-authorship">
											<span className="dash">― </span>
											{`${authorName}, ${quote.bookTitle}`}
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
																	className="tag-list-tag-a"
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
																		className="tag-list-tag-a"
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
													await Firebase.likeQuote(
														user.userUID,
														quote.id,
														history
													);
													setAuthorInfo((previous) => {
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
													setUserLikedQuotes((previous) =>
														previous.concat(index)
													);
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
				</div>
			</div>
		) : null;

	const favoriteAuthorsSection =
		loaded &&
		authorInfo.favoriteAuthors !== undefined &&
		authorInfo.favoriteAuthors.length > 0 ? (
			<div className="author-page-favorite-authors-section">
				<div className="section-title">
					<a
						href={Firebase.pageGenerator.generateUserFavoriteAuthorsPage(
							authorId
						)}
						className="title"
					>{`${authorName.toUpperCase()}'S FAVORITE AUTHORS`}</a>
					<a
						className="grey-small-a"
						href={Firebase.pageGenerator.generateUserFavoriteAuthorsPage(
							authorId
						)}
					>{`view all ${authorInfo.favoriteAuthors.length}`}</a>
				</div>
				<div className="main-section">
					{authorInfo.favoriteAuthors.map((author, index) => {
						return (
							<div className="favorite-author-card" key={index}>
								<a
									className="author-image-wrapper"
									href={Firebase.pageGenerator.generateAuthorPage(
										author.id,
										author.name
									)}
								>
									<img
										src={
											author.image !== undefined
												? author.image
												: 'https://www.goodreads.com/assets/nophoto/user/u_60x60-267f0ca0ea48fd3acfd44b95afa64f01.png'
										}
										alt={author.name}
									/>
								</a>
								<a
									className="author-name-a"
									href={Firebase.pageGenerator.generateAuthorPage(
										author.id,
										author.name
									)}
								>
									{author.name}
								</a>
								<span>author of</span>
								<a
									className="best-book-a"
									href={Firebase.pageGenerator.generateBookPage(
										author.bestBookId,
										author.bestBookTitle
									)}
								>
									{author.bestBookTitle}
								</a>
							</div>
						);
					})}
				</div>
				<div className="bottom-section">
					<a
						href={Firebase.pageGenerator.generateUserFavoriteAuthorsPage(
							authorId
						)}
					>{`More of ${authorName}'s favorite authors...`}</a>
				</div>
			</div>
		) : null;

	const mainContentRightSection = (
		<div className="author-page-main-content-right-section">
			{authorNowInFavoritesMessage}
			{authorMainInfoSection}
			{authorBooksSection}
			{authorSeriesSection}
			{relatedNewsSection}
			{quotesSection}
			{favoriteAuthorsSection}
		</div>
	);

	const mainContent = (
		<div className="author-page-main-content">
			{mainContentLeftSection}
			{mainContentRightSection}
		</div>
	);

	return (
		<div className="author-page">
			<TopBar />
			{mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default AuthorPage;
