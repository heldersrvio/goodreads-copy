import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';

const UserPage = ({ match }) => {
	const {
		params: { userPageId },
	} = match;
	const history = useHistory();
	const userId = userPageId.split('-')[0];
	const firstName =
		userPageId.split('-')[1].length > 1
			? userPageId.split('-')[1][0].toUpperCase() +
			  userPageId.split('-')[1].slice(1)
			: userPageId.split('-')[1].toUpperCase();
	const [loaded, setLoaded] = useState(false);
	const [userInfo, setUserInfo] = useState({});
	const [savingFollow, setSavingFollow] = useState(false);
	const [showingMoreDropdown, setShowingMoreDropdown] = useState(false);
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

	const location = loaded
		? userInfo.city !== undefined &&
		  userInfo.stateProvinceCode !== undefined &&
		  userInfo.country !== undefined
			? `${userInfo.city}, ${userInfo.stateProvinceCode}, ${userInfo.country}`
			: userInfo.city !== undefined && userInfo.stateProvinceCode !== undefined
			? `${userInfo.city}, ${userInfo.stateProvinceCode}`
			: userInfo.city !== undefined && userInfo.country !== undefined
			? `${userInfo.city}, ${userInfo.country}`
			: userInfo.stateProvinceCode !== undefined &&
			  userInfo.country !== undefined
			? `${userInfo.stateProvinceCode}, ${userInfo.country}`
			: userInfo.city !== undefined
			? userInfo.city
			: userInfo.stateProvinceCode !== undefined
			? userInfo.stateProvinceCode
			: userInfo.country !== undefined
			? userInfo.country
			: ''
		: '';
	const showGender =
		loaded &&
		userInfo.gender !== '' &&
		(userInfo.showGenderTo === 'everyone' ||
			(userInfo.showGenderTo === 'friendOnly' && userInfo.isUserFriend));
	const showLocation =
		loaded &&
		location !== '' &&
		(userInfo.locationViewableBy === 'everyone' ||
			(userInfo.locationViewableBy === 'friendOnly' && userInfo.isUserFriend));
	/*
    userInfo: {
        isFollowedByUser,
        isUserFriend,
        lastName,
        showGenderTo,
        gender,
        locationViewableBy,
        country,
        stateProvinceCode,
        city,
        website,
        lastActiveDate,
        joinedDate,
        interests,
        favoriteBooks,
        about,
        profilePicture,
        numberOfRatings,
        averageRating,
        numberOfReviews,
        bookShelves: [{
            name,
            numberOfBooks,
        }],
        toReadBooks: [{
            id,
            title,
            cover,
        }],
        currentlyReadingBooks: [{
            id,
            title,
            mainAuthorId,
            mainAuthorName,
            mainAuthorIsMember,
			bookshelves,
            updateDate,
            userStatus,
            userRating,
            userProgress,
            userToReadPosition,
        }],
        recentUpdates: [{
            type,
            date,
            authorInfo: {
                id,
                name,
                picture,
                isMember,
                userIsFollowing,
            },
            bookInfo: {
                id,
                title,
                mainAuthorId,
                mainAuthorName,
                mainAuthorIsMember,
                updateDate,
                userStatus,
                userRating,
                userProgress,
                userToReadPosition,
            },
        }],
        quotes: [{
            id,
            content,
            authorId,
            authorName,
            authorProfilePicture,
            bookTitle,
            numberOfLikes,
            likedByUser,
        }],
        friends: [{
            id,
            name,
            picture,
            numberOfBooks,
            numberOfFriends,
        }],
        following: [{
            id,
            picture,
            name,
        }],
        numberOfFollowers,
        votedLists: [{
            id,
            title,
            bookCovers,
            numberOfBooks,
            numberOfVoters,
        }],
        favoriteGenres,
    }
    */

	const user = JSON.parse(localStorage.getItem('userState'));

	const displayRemoveBookConfirm = () => {
		return window.confirm(
			'Removing a book deletes your rating, review, etc. Remove this book from all your shelves?'
		);
	};

	const removeBookSafely = (bookObject, index) => {
		if (displayRemoveBookConfirm()) {
			Firebase.removeBookFromShelf(user.userUID, bookObject.id);
			setUserInfo((previous) => {
				return {
					...previous,
					currentlyReadingBooks:
						index >= previous.currentlyReadingBooks.length
							? previous.currentlyReadingBooks
							: previous.currentlyReadingBooks.map((book, i) => {
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
					recentUpdates:
						index < previous.currentlyReadingBooks.length
							? previous.recentUpdates
							: previous.recentUpdates.map((update, i) => {
									if (
										update.type !== 'add-book' &&
										update.type !== 'rate-book'
									) {
										return update;
									} else {
										if (
											previous.recentUpdates
												.filter(
													(recentUpdate) =>
														recentUpdate.type === 'rate-book' ||
														recentUpdate.type === 'add-book'
												)
												.indexOf(update) +
												previous.currentlyReadingBooks.length -
												1 ===
											index
										) {
											return {
												...update,
												bookInfo: {
													...update.bookInfo,
													userStatus: undefined,
													userProgress: undefined,
													userRating: undefined,
												},
											};
										}
										return update;
									}
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
			setUserInfo((previous) => {
				return {
					...previous,
					currentlyReadingBooks:
						index >= previous.currentlyReadingBooks.length
							? previous.currentlyReadingBooks
							: previous.currentlyReadingBooks.map((book, i) => {
									if (i === index) {
										return {
											...book,
											userStatus: shelf,
										};
									}
									return book;
							  }),
					recentUpdates:
						index < previous.currentlyReadingBooks.length
							? previous.recentUpdates
							: previous.recentUpdates.map((update, i) => {
									if (
										update.type !== 'add-book' &&
										update.type !== 'rate-book'
									) {
										return update;
									} else {
										if (
											previous.recentUpdates
												.filter(
													(recentUpdate) =>
														recentUpdate.type === 'rate-book' ||
														recentUpdate.type === 'add-book'
												)
												.indexOf(update) +
												previous.currentlyReadingBooks.length -
												1 ===
											index
										) {
											return {
												...update,
												bookInfo: {
													...update.bookInfo,
													userStatus: shelf,
												},
											};
										}
										return update;
									}
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
			setUserInfo((previous, i) => {
				return {
					...previous,
					currentlyReadingBooks:
						index >= previous.currentlyReadingBooks.length
							? previous.currentlyReadingBooks
							: previous.currentlyReadingBooks.map((book, i) => {
									if (i === index) {
										return {
											...book,
											userStatus:
												book.userStatus === undefined
													? 'read'
													: book.userStatus,
											userRating: rating,
										};
									}
									return book;
							  }),
					recentUpdates:
						index < previous.currentlyReadingBooks.length
							? previous.recentUpdates
							: previous.recentUpdates.map((update, i) => {
									if (
										update.type !== 'add-book' &&
										update.type !== 'rate-book'
									) {
										return update;
									} else {
										if (
											previous.recentUpdates
												.filter(
													(recentUpdate) =>
														recentUpdate.type === 'rate-book' ||
														recentUpdate.type === 'add-book'
												)
												.indexOf(update) +
												previous.currentlyReadingBooks.length -
												1 ===
											index
										) {
											return {
												...update,
												bookInfo: {
													...update.bookInfo,
													userStatus:
														update.bookInfo.userStatus === undefined
															? 'read'
															: update.bookInfo.userStatus,
													userRating: rating,
												},
											};
										}
										return update;
									}
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
			setUserInfo((previous) => {
				return {
					...previous,
					currentlyReadingBooks:
						index >= previous.currentlyReadingBooks.length
							? previous.currentlyReadingBooks
							: previous.currentlyReadingBooks.map((book, i) => {
									if (i === index) {
										return {
											...book,
											userProgress: pages,
										};
									}
									return book;
							  }),
					recentUpdates:
						index < previous.currentlyReadingBooks.length
							? previous.recentUpdates
							: previous.recentUpdates.map((update, i) => {
									if (
										update.type !== 'add-book' &&
										update.type !== 'rate-book'
									) {
										return update;
									} else {
										if (
											previous.recentUpdates
												.filter(
													(recentUpdate) =>
														recentUpdate.type === 'rate-book' ||
														recentUpdate.type === 'add-book'
												)
												.indexOf(update) +
												previous.currentlyReadingBooks.length -
												1 ===
											index
										) {
											return {
												...update,
												bookInfo: {
													...update.bookInfo,
													userProgress: pages,
												},
											};
										}
										return update;
									}
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
											bookObject.id,
											parseInt(shelfPopupToReadInputs[index])
										);
										setUserInfo((previous) => {
											return {
												...previous,
												currentlyReadingBooks:
													index >= previous.currentlyReadingBooks.length
														? previous.currentlyReadingBooks
														: previous.currentlyReadingBooks.map((book, i) => {
																if (i === index) {
																	return {
																		...book,
																		userToReadPosition: parseInt(
																			shelfPopupToReadInputs[index]
																		),
																	};
																}
																return book;
														  }),
												recentUpdates:
													index < previous.currentlyReadingBooks.length
														? previous.recentUpdates
														: previous.recentUpdates.map((update, i) => {
																if (
																	update.type !== 'add-book' &&
																	update.type !== 'rate-book'
																) {
																	return update;
																} else {
																	if (
																		previous.recentUpdates
																			.filter(
																				(recentUpdate) =>
																					recentUpdate.type === 'rate-book' ||
																					recentUpdate.type === 'add-book'
																			)
																			.indexOf(update) +
																			previous.currentlyReadingBooks.length -
																			1 ===
																		index
																	) {
																		return {
																			...update,
																			bookInfo: {
																				...update.bookInfo,
																				userToReadPosition: parseInt(
																					shelfPopupToReadInputs[index]
																				),
																			},
																		};
																	}
																	return update;
																}
														  }),
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

	const introduction = loaded ? (
		<div className="user-page-introduction">
			<div className="left-section">
				{userInfo.profilePicture !== undefined ? (
					<a
						className="user-photo-a"
						href={Firebase.pageGenerator.generateUserPhotoPage(userId)}
					>
						<img
							src={userInfo.profilePicture}
							alt={firstName + ' ' + userInfo.lastName}
						/>
					</a>
				) : (
					<img
						src={
							'https://s.gr-assets.com/assets/nophoto/user/u_225x300-c928cbb998d4ac6dd1f0f66f31f74b81.png'
						}
						alt={firstName + ' ' + userInfo.lastName}
					/>
				)}
				<span className="ratings-stats">
					<a
						href={Firebase.pageGenerator.generateUserRatingsPage(userId)}
					>{`${userInfo.numberOfRatings} ratings`}</a>
					<button className="show-stats-window-button">{`(${userInfo.averageRating.toFixed(
						2
					)} avg)`}</button>
				</span>
				<a
					href={Firebase.pageGenerator.generateUserReviewsPage(userId)}
				>{`${userInfo.numberOfReviews} reviews`}</a>
			</div>
			<div className="right-section">
				<h1>{firstName + ' ' + userInfo.lastName}</h1>
				{!savingFollow ? (
					<div className="follow-friends-buttons">
						<button
							className={
								userInfo.isFollowedByUser
									? 'follow-button following'
									: 'follow-button'
							}
							onMouseOver={(e) => {
								if (userInfo.isFollowedByUser) {
									e.target.innerHTML = 'Unfollow';
								}
							}}
						>
							{userInfo.isFollowedByUser ? (
								<span>
									<div className="following-checkmark"></div>
									<span>Following</span>
								</span>
							) : (
								<span>Follow</span>
							)}
						</button>
						<a
							className="add-as-friend-a"
							href={Firebase.pageGenerator.generateAddAsFriendPage}
						>
							Add friend
						</a>
						<button
							className="more-dropdown-trigger"
							onClick={(_e) => setShowingMoreDropdown((previous) => !previous)}
						>
							<span>More</span>
							<div className="downwards-arrow"></div>
							<div className="more-dropdown">
								<ul>
									<li>
										<a
											className="compare-books-a"
											href={Firebase.pageGenerator.generateUserCompareBooksPage(
												userId
											)}
										>
											Compare books
										</a>
									</li>
								</ul>
							</div>
						</button>
					</div>
				) : (
					<div className="follow-loading-spinner"></div>
				)}
				<table className="user-misc">
					<tbody>
						{showGender || showLocation ? (
							<tr>
								<th>Details</th>
								<td>
									{showGender && showLocation
										? `${
												userInfo.gender[0].toUpperCase() +
												userInfo.gender.slice(1)
										  }, ${location}`
										: showGender
										? userInfo.gender[0].toUpperCase() +
										  userInfo.gender.slice(1)
										: location}
								</td>
							</tr>
						) : null}
						{userInfo.website !== undefined ? (
							<tr>
								<th>Website</th>
								<td>{userInfo.website}</td>
							</tr>
						) : null}
						<tr>
							<th>Activity</th>
							<td>{`Joined in ${format(
								userInfo.joinedDate,
								'MMMM yyyy'
							)}, last active ${
								userInfo.lastActiveDate.getFullYear() ===
									new Date().getFullYear() &&
								userInfo.lastActiveDate.getMonth() === new Date().getMonth()
									? 'this month'
									: (userInfo.lastActiveDate.getFullYear() ===
											new Date().getFullYear() &&
											userInfo.lastActiveDate.getMonth() ===
												new Date().getMonth() - 1) ||
									  (userInfo.lastActiveDate.getFullYear() ===
											new Date().getFullYear() - 1 &&
											userInfo.lastActiveDate.getMonth() === 11 &&
											new Date().getMonth() === 0)
									? 'last month'
									: userInfo.lastActiveDate.getFullYear() ===
									  new Date().getFullYear()
									? 'this year'
									: `in ${format(userInfo.lastActiveDate, 'MMMM yyyy')}`
							}`}</td>
						</tr>
						{userInfo.interests.length > 0 ? (
							<tr>
								<th>Interests</th>
								<td>{userInfo.interests}</td>
							</tr>
						) : null}
						{userInfo.favoriteBooks.length > 0 ? (
							<tr>
								<th>Favorite Books</th>
								<td>{userInfo.favoriteBooks}</td>
							</tr>
						) : null}
						{userInfo.about.length > 0 ? (
							<tr>
								<th>About</th>
								<td>{userInfo.about}</td>
							</tr>
						) : null}
					</tbody>
				</table>
			</div>
		</div>
	) : null;

	const userToReadShelfSection = loaded ? (
		<div className="user-page-to-read-shelf-section">
			<a
				href={Firebase.pageGenerator.generateUserShelfPage(
					userId,
					firstName,
					'to-read'
				)}
				className="section-title"
			>{`${firstName.toUpperCase()}'S TO-READ SHELF`}</a>
			<div className="book-list">
				{userInfo.toReadBooks.map((book, index) => {
					return (
						<a
							className="book-a"
							href={Firebase.pageGenerator.generateBookPage(
								book.id,
								book.title
							)}
							key={index}
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
			<a
				className="more-books-a"
				href={Firebase.pageGenerator.generateUserShelfPage(
					userId,
					firstName,
					'to-read'
				)}
			>
				More...
			</a>
		</div>
	) : null;

	const userBookShelvesSection = loaded ? (
		<div className="user-page-bookshelves-section">
			<a
				className="section-title"
				href={Firebase.pageGenerator.generateUserBooksPage()}
			>{`${firstName.toUpperCase()}'S BOOKSHELVES`}</a>
			<div className="bookshelves-list">
				{userInfo.bookshelves.map((shelf, index) => {
					return (
						<a
							key={index}
							href={Firebase.pageGenerator.generateUserShelfPage(
								userId,
								firstName,
								shelf.name
							)}
						>{`${shelf.name} (${shelf.numberOfBooks})`}</a>
					);
				})}
			</div>
			<a
				className="more-a"
				href={Firebase.pageGenerator.generateUserBooksPage()}
			>
				More...
			</a>
		</div>
	) : null;

	const userCurrentlyReadingSection =
		loaded && userInfo.currentlyReadingBooks.length > 0 ? (
			<div className="user-page-currently-reading-section">
				<a
					className="section-title"
					href={Firebase.pageGenerator.generateUserShelfPage(
						userId,
						firstName,
						'reading'
					)}
				>{`${firstName.toUpperCase()} IS CURRENTLY READING`}</a>
				<div className="currently-reading-list">
					{userInfo.currentlyReadingBooks.map((book, index) => {
						return (
							<div className="book-update" key={index}>
								<div className="left-section">
									<a
										className="book-cover-a"
										href={Firebase.pageGenerator.generateBookPage(
											book.id,
											book.title
										)}
									>
										<img
											alt={book.title}
											src={
												book.cover !== undefined
													? book.cover
													: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png'
											}
										/>
									</a>
									<div className="book-update-info">
										<span>
											<a
												href={Firebase.pageGenerator.generateUserPage(
													userId,
													firstName
												)}
											>{`${firstName + ' ' + userInfo.lastName}`}</a>
											<span> is currently reading</span>
										</span>
										<a
											className="book-title-a"
											href={Firebase.pageGenerator.generateBookPage(
												book.id,
												book.title
											)}
										>
											{book.title}
										</a>
										<span className="book-authorship-span">
											<span>by </span>
											<a
												href={Firebase.pageGenerator.generateAuthorPage(
													book.mainAuthorId,
													book.mainAuthorName
												)}
											>
												{book.mainAuthorName}
											</a>
											{book.mainAuthorIsMember ? (
												<span className="goodreads-member-span">
													(Goodreads Author)
												</span>
											) : null}
										</span>
										<span className="bookshelves-span">
											<span>bookshelves: </span>
											{book.bookshelves.map((shelf, i) => {
												return (
													<a
														href={Firebase.pageGenerator.generateUserShelfPage(
															userId,
															firstName,
															shelf
														)}
														key={i}
													>
														{shelf}
													</a>
												);
											})}
										</span>
										<span className="update-date-span">
											{format(book.updateDate, 'MMM dd, yyyy HH:mma..aa')}
										</span>
									</div>
								</div>
								<div className="right-section">
									<div className="add-to-shelf-button-and-dropdown">
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

	const userRecentUpdatesSection = loaded ? (
		<div className="user-recent-updates-section">
			<a className="section-title">{`${firstName.toUpperCase()}'S RECENT UPDATES`}</a>
		</div>
	) : null;
};

export default UserPage;
