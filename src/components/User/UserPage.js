import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { format, differenceInYears } from 'date-fns';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';
import '../styles/User/UserPage.css';
import RatingsChart from './RatingsChart';

// TODO: Accept request option

const UserPage = ({ match }) => {
	const {
		params: { userPageId },
	} = match;
	const history = useHistory();
	const pageLocation = useLocation();
	const moreDropdown = useRef();
	const moreDropdownTrigger = useRef();
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
	const [userLikedQuotes, setUserLikedQuotes] = useState([]);
	const [unfollowModalVisible, setUnfollowModalVisible] = useState(false);
	const [userRatingsChartVisible, setUserRatingsChartVisible] = useState(false);
	const [updatesBeingDeleted, setUpdatesBeingDeleted] = useState([]);
	const [topMessage, setTopMessage] = useState('');

	const user = JSON.parse(localStorage.getItem('userState'));

	useLayoutEffect(() => {
		document.addEventListener('click', (event) => {
			if (
				!(
					(moreDropdown.current !== null &&
						moreDropdown.current !== undefined &&
						moreDropdown.current.contains(event.target)) ||
					(moreDropdownTrigger.current !== null &&
						moreDropdownTrigger.current !== undefined &&
						moreDropdownTrigger.current.contains(event.target))
				)
			) {
				setShowingMoreDropdown(false);
			}
		});
	});

	useEffect(() => {
		if (pageLocation.state !== undefined && pageLocation.state.addedFriend) {
			setTopMessage(
				'A friend request has been sent to Entien. After confirmation has been made, you will be notified by email.'
			);
		}
	}, [pageLocation.state]);

	useEffect(() => {
		const getUserInfo = async () => {
			const userInfoObject = await Firebase.getUserInfoForUserPage(
				userId,
				user.userUID
			);
			userInfoObject.isUserFriend = true;
			setUserInfo(userInfoObject);
			setLoaded(true);
			const numberOfInteractiveBookCards =
				userInfoObject.currentlyReadingBooks.length +
				userInfoObject.recentUpdates.filter(
					(update) =>
						update.type === 'add-book-to-read' ||
						update.type === 'add-book-read' ||
						update.type === 'add-book-reading' ||
						update.type === 'rate-book'
				).length;
			setSavingShelves(Array(numberOfInteractiveBookCards).fill(false));
			setAreShelfPopupsHidden(Array(numberOfInteractiveBookCards).fill(true));
			setAreShelfPopupsBottomHidden(
				Array(numberOfInteractiveBookCards).fill(true)
			);
			setShelfPopupReadingInputs(Array(numberOfInteractiveBookCards).fill(''));
			setShelfPopupToReadInputs(Array(numberOfInteractiveBookCards).fill(''));
			setAreAddShelfInputSectionsHidden(
				Array(numberOfInteractiveBookCards).fill(true)
			);
			setAddShelfInputs(Array(numberOfInteractiveBookCards).fill(''));
			setExhibitedStarRatings(
				userInfoObject.currentlyReadingBooks
					.map((book) => (book.userRating === undefined ? 0 : book.userRating))
					.concat(
						userInfoObject.recentUpdates
							.filter(
								(update) =>
									update.type === 'add-book-to-read' ||
									update.type === 'add-book-read' ||
									update.type === 'add-book-reading' ||
									update.type === 'rate-book' ||
									update.type === 'recommend-book'
							)
							.map((update) =>
								update.bookInfo.userRating === undefined
									? 0
									: update.bookInfo.userRating
							)
					)
			);
			setUpdatesBeingDeleted(
				Array(userInfoObject.recentUpdates.length).fill(false)
			);
		};
		getUserInfo();
	}, [user.userUID, userId]);

	const location = loaded
		? userInfo.city !== undefined &&
		  userInfo.city !== '' &&
		  userInfo.stateProvinceCode !== undefined &&
		  userInfo.stateProvinceCode !== '' &&
		  userInfo.country !== undefined &&
		  userInfo.country !== ''
			? `${userInfo.city}, ${userInfo.stateProvinceCode}, ${userInfo.country}`
			: userInfo.city !== undefined &&
			  userInfo.city !== '' &&
			  userInfo.stateProvinceCode !== undefined &&
			  userInfo.stateProvinceCode !== ''
			? `${userInfo.city}, ${userInfo.stateProvinceCode}`
			: userInfo.city !== undefined &&
			  userInfo.city !== '' &&
			  userInfo.country !== undefined &&
			  userInfo.country !== ''
			? `${userInfo.city}, ${userInfo.country}`
			: userInfo.stateProvinceCode !== undefined &&
			  userInfo.stateProvinceCode !== '' &&
			  userInfo.country !== undefined &&
			  userInfo.country !== ''
			? `${userInfo.stateProvinceCode}, ${userInfo.country}`
			: userInfo.city !== undefined && userInfo.city !== ''
			? userInfo.city
			: userInfo.stateProvinceCode !== undefined &&
			  userInfo.stateProvinceCode !== ''
			? userInfo.stateProvinceCode
			: userInfo.country !== undefined && userInfo.country !== ''
			? userInfo.country
			: ''
		: '';
	const isLoggedInUser = userId === user.userUID;
	const showProfile =
		loaded &&
		(isLoggedInUser ||
			userInfo.whoCanViewUserProfile === 'anyone' ||
			(userInfo.whoCanViewUserProfile === 'goodreads-members' &&
				user.userUID !== null &&
				user.userUID !== undefined) ||
			(userInfo.whoCanViewUserProfile === 'just-my-friends' &&
				userInfo.isUserFriend));
	const showLastName =
		loaded &&
		userInfo.lastName !== '' &&
		userInfo.lastName !== undefined &&
		(userInfo.showLastNameTo === 'anyone' ||
			(userInfo.showLastNameTo === 'friends' && userInfo.isUserFriend));
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
	const showAge =
		loaded &&
		userInfo.birthday !== undefined &&
		(([
			'age-members-birthday-members',
			'age-members-birthday-no-one',
			'age-members-birthday-friends',
		].includes(userInfo.ageAndBirthdayPrivacy) &&
			user.userUID !== null &&
			user.userUID !== undefined) ||
			(['age-friends-birthday-friends', 'age-friends-birthday-no-one'].includes(
				userInfo.ageAndBirthdayPrivacy
			) &&
				userInfo.isUserFriend));
	const showBirthday =
		loaded &&
		userInfo.birthday !== undefined &&
		((['age-members-birthday-members', 'age-no-one-birthday-members'].includes(
			userInfo.ageAndBirthdayPrivacy
		) &&
			user.userUID !== null &&
			user.userUID !== undefined) ||
			([
				'age-members-birthday-friends',
				'age-friends-birthday-friends',
				'age-no-one-birthday-friends',
			].includes(userInfo.ageAndBirthdayPrivacy) &&
				userInfo.isUserFriend));

	const userAge =
		loaded && userInfo.birthday !== undefined
			? differenceInYears(new Date(), userInfo.birthday)
			: 0;

	const capitalizeAndSeparate = (string) => {
		return string
			.split('-')
			.map((s) =>
				s.length === 1 ? s.toUpperCase() : s[0].toUpperCase() + s.slice(1)
			)
			.join(' ');
	};

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
										!update.type.includes('add-book') &&
										update.type !== 'rate-book' &&
										update.type !== 'recommend-book'
									) {
										return update;
									} else {
										if (
											previous.recentUpdates
												.filter(
													(recentUpdate) =>
														recentUpdate.type === 'rate-book' ||
														recentUpdate.type.includes('add-book') ||
														recentUpdate.type === 'recommend-book'
												)
												.indexOf(update) +
												previous.currentlyReadingBooks.length ===
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
										!update.type.includes('add-book') &&
										update.type !== 'rate-book' &&
										update.type !== 'recommend-book'
									) {
										return update;
									} else {
										if (
											previous.recentUpdates
												.filter(
													(recentUpdate) =>
														recentUpdate.type === 'rate-book' ||
														recentUpdate.type.includes('add-book') ||
														recentUpdate.type === 'recommend-book'
												)
												.indexOf(update) +
												previous.currentlyReadingBooks.length ===
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
										!update.type.includes('add-book') &&
										update.type !== 'rate-book' &&
										update.type !== 'recommend-book'
									) {
										return update;
									} else {
										if (
											previous.recentUpdates
												.filter(
													(recentUpdate) =>
														recentUpdate.type === 'rate-book' ||
														recentUpdate.type.includes('add-book') ||
														recentUpdate.type === 'recommend-book'
												)
												.indexOf(update) +
												previous.currentlyReadingBooks.length ===
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
										!update.type.includes('add-book') &&
										update.type !== 'rate-book' &&
										update.type !== 'recommend-book'
									) {
										return update;
									} else {
										if (
											previous.recentUpdates
												.filter(
													(recentUpdate) =>
														recentUpdate.type === 'rate-book' ||
														recentUpdate.type.includes('add-book') ||
														recentUpdate.type === 'recommend-book'
												)
												.indexOf(update) +
												previous.currentlyReadingBooks.length ===
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
																	!update.type.includes('add-book') &&
																	update.type !== 'rate-book' &&
																	update.type !== 'recommend-book'
																) {
																	return update;
																} else {
																	if (
																		previous.recentUpdates
																			.filter(
																				(recentUpdate) =>
																					recentUpdate.type === 'rate-book' ||
																					recentUpdate.type.includes(
																						'add-book'
																					) ||
																					recentUpdate.type === 'recommend-book'
																			)
																			.indexOf(update) +
																			previous.currentlyReadingBooks.length ===
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
								value={
									addShelfInputs[index] !== undefined
										? addShelfInputs[index]
										: ''
								}
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

	const topMessageSection =
		loaded && topMessage.length > 0 ? (
			<div className="top-message-div yellow">
				<span>{topMessage}</span>
				<button
					className="close-button"
					onClick={(_e) => setTopMessage('')}
				></button>
			</div>
		) : null;

	const introduction = loaded ? (
		<div className="user-page-introduction">
			<div className="left-section">
				{userInfo.profilePicture !== undefined ? (
					<a
						className="user-photo-a"
						href={Firebase.pageGenerator.generateUserPhotoPage(userId)}
					>
						<img src={userInfo.profilePicture} alt={firstName} />
					</a>
				) : (
					<img
						src={
							'https://s.gr-assets.com/assets/nophoto/user/u_225x300-c928cbb998d4ac6dd1f0f66f31f74b81.png'
						}
						alt={firstName}
					/>
				)}
				<span className="ratings-stats">
					<a
						href={Firebase.pageGenerator.generateUserRatingsPage(userId)}
					>{`${userInfo.numberOfRatings} ratings`}</a>
					<button
						className="show-stats-window-button"
						onClick={(_e) => setUserRatingsChartVisible(true)}
					>{`(${userInfo.averageRating.toFixed(2)} avg)`}</button>
					<div
						className={
							userRatingsChartVisible
								? 'user-ratings-chart visible'
								: 'user-ratings-chart'
						}
					>
						<RatingsChart
							fiveRatings={userInfo.fiveRatings}
							fourRatings={userInfo.fourRatings}
							threeRatings={userInfo.threeRatings}
							twoRatings={userInfo.twoRatings}
							oneRatings={userInfo.oneRatings}
							closeChart={() => setUserRatingsChartVisible(false)}
						/>
					</div>
				</span>
				<a
					className="number-of-reviews-a"
					href={Firebase.pageGenerator.generateUserReviewsPage(userId)}
				>{`${userInfo.numberOfReviews} reviews`}</a>
			</div>
			<div className="right-section">
				<h1>
					{showLastName ? firstName + ' ' + userInfo.lastName : firstName}
					{isLoggedInUser ? (
						<a href={Firebase.pageGenerator.generateAccountSettingsPage()}>
							(edit profile)
						</a>
					) : null}
				</h1>
				{!savingFollow && !isLoggedInUser ? (
					<div className="follow-friends-buttons">
						{!userInfo.isUserFriend ? (
							<button
								className={
									userInfo.isFollowedByUser
										? 'follow-button following'
										: 'follow-button'
								}
								onMouseOver={(_e) => {
									if (userInfo.isFollowedByUser) {
										const outerSpan = document.querySelector(
											'span.followed-by-user-span'
										);
										outerSpan.innerHTML = 'Unfollow';
									}
								}}
								onMouseOut={(_e) => {
									if (userInfo.isFollowedByUser) {
										const checkmark = document.createElement('div');
										checkmark.classList.add('following-checkmark');
										const span = document.createElement('span');
										span.innerHTML = 'Following';
										const outerSpan = document.querySelector(
											'span.followed-by-user-span'
										);
										outerSpan.innerHTML = '';
										outerSpan.appendChild(checkmark);
										outerSpan.appendChild(span);
									}
								}}
								onClick={async (_e) => {
									if (userInfo.isFollowedByUser) {
										setUnfollowModalVisible(true);
									} else {
										setSavingFollow(true);
										await Firebase.followUser(user.userUID, userId, history);
										setSavingFollow(false);
										setUserInfo((previous) => {
											return {
												...previous,
												isFollowedByUser: true,
												numberOfFollowers: previous.numberOfFollowers + 1,
											};
										});
									}
								}}
							>
								{userInfo.isFollowedByUser ? (
									<span className="followed-by-user-span">
										<div className="following-checkmark"></div>
										<span>Following</span>
									</span>
								) : (
									<span>Follow</span>
								)}
							</button>
						) : null}
						<a
							className={
								userInfo.hasPendingFriendRequestFromUser
									? 'add-as-friend-a pending'
									: 'add-as-friend-a'
							}
							disabled={userInfo.hasPendingFriendRequestFromUser}
							href={Firebase.pageGenerator.generateAddAsFriendPage(userId)}
							onMouseOver={(_e) => {
								if (userInfo.isUserFriend) {
									const outerSpan = document.querySelector(
										'span.friends-with-user-span'
									);
									outerSpan.innerHTML = 'Unfriend';
								}
							}}
							onMouseOut={(_e) => {
								if (userInfo.isUserFriend) {
									const checkmark = document.createElement('div');
									checkmark.classList.add('following-checkmark');
									const span = document.createElement('span');
									span.innerHTML = 'Friends';
									const outerSpan = document.querySelector(
										'span.friends-with-user-span'
									);
									outerSpan.innerHTML = '';
									outerSpan.appendChild(checkmark);
									outerSpan.appendChild(span);
								}
							}}
							onClick={(e) => {
								if (userInfo.isUserFriend) {
									e.preventDefault();
									setUnfollowModalVisible(true);
								}
							}}
						>
							{userInfo.isUserFriend ? (
								<span className="friends-with-user-span">
									<div className="following-checkmark"></div>
									<span>Friends</span>
								</span>
							) : userInfo.hasPendingFriendRequestFromUser ? (
								<span className="pending-span">Pending</span>
							) : (
								<span>Add friend</span>
							)}
						</a>
						<button
							ref={moreDropdownTrigger}
							className="more-dropdown-trigger"
							onClick={(_e) => setShowingMoreDropdown((previous) => !previous)}
						>
							<span>More</span>
							<div className="downwards-arrow"></div>
							<div
								ref={moreDropdown}
								className={
									showingMoreDropdown ? 'more-dropdown' : 'more-dropdown hidden'
								}
							>
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
				) : savingFollow ? (
					<div id="loadingSpinner">
						<div></div>
						<div></div>
						<div></div>
						<div></div>
					</div>
				) : null}
				<table className="user-misc">
					<tbody>
						<tr>
							<th>Details</th>
							{showGender || showLocation || showAge ? (
								<td>
									{showAge && showGender && showLocation
										? `Age ${userAge}, ${
												userInfo.gender[0].toUpperCase() +
												userInfo.gender.slice(1)
										  }, ${location}`
										: showAge && showGender
										? `Age ${userAge}, ${
												userInfo.gender[0].toUpperCase() +
												userInfo.gender.slice(1)
										  }`
										: showAge && showLocation
										? `Age ${userAge}, ${location}`
										: showAge
										? `Age ${userAge}`
										: showGender && showLocation
										? `${
												userInfo.gender[0].toUpperCase() +
												userInfo.gender.slice(1)
										  }, ${location}`
										: showGender
										? userInfo.gender[0].toUpperCase() +
										  userInfo.gender.slice(1)
										: location}
								</td>
							) : (
								<td>{`${firstName} hasn't added any details yet`}</td>
							)}
						</tr>
						{showBirthday ? (
							<tr>
								<th>Birthday</th>
								<td>{format(userInfo.birthday, 'MMMM dd, yyyy')}</td>
							</tr>
						) : null}
						{userInfo.website !== undefined && userInfo.website.length > 0 ? (
							<tr>
								<th>Website</th>
								<td>
									<a href={userInfo.website}>{userInfo.website}</a>
								</td>
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
				{userInfo.toReadBooks
					.filter((_b, index) => index < 11)
					.map((book, index) => {
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

	const userBookshelvesSection = loaded ? (
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
										<span className="currently-reading-span">
											<a
												href={Firebase.pageGenerator.generateUserPage(
													userId,
													firstName
												)}
											>{`${
												showLastName
													? firstName + ' ' + userInfo.lastName
													: firstName
											}`}</a>
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
													<span key={i}>
														<a
															href={Firebase.pageGenerator.generateUserShelfPage(
																userId,
																firstName,
																shelf
															)}
														>
															{shelf}
														</a>
														{i !== book.bookshelves.length - 1 ? (
															<span>, </span>
														) : null}
													</span>
												);
											})}
										</span>
										<span className="update-date-span">
											{format(book.updateDate, 'MMM dd, yyyy HH:mma')}
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
			<span className="section-title">{`${firstName.toUpperCase()}'S RECENT UPDATES`}</span>
			{userInfo.recentUpdates.map((update, index) => {
				return (
					<div
						className={
							index === userInfo.recentUpdates.length - 1
								? 'update-card'
								: 'update-card bordered'
						}
						key={index}
					>
						<span className="update-description">
							<a
								href={Firebase.pageGenerator.generateUserPage(
									userId,
									firstName
								)}
							>
								{showLastName ? firstName + ' ' + userInfo.lastName : firstName}
							</a>
							<span> </span>
							{update.type === 'rate-book' ? (
								<span className="rated-book-span">
									rated a book{' '}
									<div className="rating-stars">
										<div
											className={
												update.rating >= 1
													? 'static-star small full'
													: update.rating >= 0.5
													? 'static-star small almost-full'
													: update.rating > 0
													? 'static-star small almost-empty'
													: 'static-star small empty'
											}
										></div>
										<div
											className={
												update.rating >= 2
													? 'static-star small full'
													: update.rating >= 1.5
													? 'static-star small almost-full'
													: update.rating > 1
													? 'static-star small almost-empty'
													: 'static-star small empty'
											}
										></div>
										<div
											className={
												update.rating >= 3
													? 'static-star small full'
													: update.rating >= 2.5
													? 'static-star small almost-full'
													: update.rating > 2
													? 'static-star small almost-empty'
													: 'static-star small empty'
											}
										></div>
										<div
											className={
												update.rating >= 4
													? 'static-star small full'
													: update.rating >= 3.5
													? 'static-star small almost-full'
													: update.rating > 3
													? 'static-star small almost-empty'
													: 'static-star small empty'
											}
										></div>
										<div
											className={
												update.rating >= 5
													? 'static-star small full'
													: update.rating >= 4.5
													? 'static-star small almost-full'
													: update.rating > 4
													? 'static-star small almost-empty'
													: 'static-star small empty'
											}
										></div>
									</div>
								</span>
							) : update.type === 'add-book-to-read' ? (
								<span>wants to read</span>
							) : update.type === 'add-book-read' ? (
								<span>finished reading</span>
							) : update.type === 'add-book-reading' ? (
								<span>started reading</span>
							) : update.type === 'add-friend' ? (
								<span>
									<span>is now friends with </span>
									<a
										href={Firebase.pageGenerator.generateUserPage(
											update.userInfo.id,
											update.userInfo.name
										)}
									>
										{update.userInfo.name}
									</a>
								</span>
							) : update.type === 'vote-for-book-review' ? (
								<span>
									<span>{`and ${
										update.numberOfReviewVoters - 1
									} other people liked `}</span>
									<a
										href={Firebase.pageGenerator.generateUserPage(
											update.userInfo.id,
											update.userInfo.name
										)}
									>{`${update.userInfo.name}'s`}</a>
									<span> review of </span>
									<a
										href={Firebase.pageGenerator.generateBookPage(
											update.bookInfo.id,
											update.bookInfo.title
										)}
									>
										{update.bookInfo.title}
									</a>
								</span>
							) : update.type === 'add-quote' ? (
								<span>
									<span>liked a </span>
									<a
										href={Firebase.pageGenerator.generateQuotePage(
											update.quoteId,
											update.quoteContent
										)}
									>
										quote
									</a>
								</span>
							) : update.type === 'recommend-book' ? (
								<span>
									<span> recommended</span>
									<a
										href={Firebase.pageGenerator.generateBookPage(
											update.bookInfo.id,
											update.bookInfo.title
										)}
									>
										{' '}
										{update.bookInfo.title}{' '}
									</a>
									<span>to </span>
									<a
										href={Firebase.pageGenerator.generateUserPage(
											update.userInfo.id,
											update.userInfo.name
										)}
									>
										{update.userInfo.name}
									</a>
								</span>
							) : (
								<span> is now following</span>
							)}
						</span>
						{update.type === 'add-book-to-read' ||
						update.type === 'add-book-reading' ||
						update.type === 'add-book-read' ||
						update.type === 'rate-book' ||
						update.type === 'recommend-book' ? (
							<div className="update-book-section">
								<div className="left-section">
									<a
										className="book-cover-a"
										href={Firebase.pageGenerator.generateBookPage(
											update.bookInfo.id,
											update.bookInfo.title
										)}
									>
										<img
											alt={update.bookInfo.title}
											src={
												update.bookInfo.cover !== undefined
													? update.bookInfo.cover
													: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png'
											}
										/>
									</a>
									<div className="book-update-info">
										<a
											className="book-title-a"
											href={Firebase.pageGenerator.generateBookPage(
												update.bookInfo.id,
												update.bookInfo.title
											)}
										>
											{update.bookInfo.title}
										</a>
										<span className="book-authorship-span">
											<span>by </span>
											<a
												href={Firebase.pageGenerator.generateAuthorPage(
													update.authorInfo.id,
													update.authorInfo.name
												)}
											>
												{update.authorInfo.name}
											</a>
											{update.authorInfo.isMember ? (
												<span className="goodreads-member-span">
													(Goodreads Author)
												</span>
											) : null}
										</span>
									</div>
								</div>
								<div className="right-section">
									<div className="add-to-shelf-button-and-dropdown">
										{generateAddToShelfButton(
											update.bookInfo,
											userInfo.currentlyReadingBooks.length +
												userInfo.recentUpdates
													.filter((update) =>
														[
															'add-book-to-read',
															'add-book-read',
															'add-book-reading',
															'recommend-book',
															'rate-book',
														].includes(update.type)
													)
													.indexOf(update)
										)}
										{generateBookOptionsDropdown(
											update.bookInfo,
											userInfo.currentlyReadingBooks.length +
												userInfo.recentUpdates
													.filter((update) =>
														[
															'add-book-to-read',
															'add-book-read',
															'add-book-reading',
															'recommend-book',
															'rate-book',
														].includes(update.type)
													)
													.indexOf(update)
										)}
									</div>
									{generateRateBookSection(
										update.bookInfo,
										userInfo.currentlyReadingBooks.length +
											userInfo.recentUpdates
												.filter((update) =>
													[
														'add-book-to-read',
														'add-book-read',
														'add-book-reading',
														'recommend-book',
														'rate-book',
													].includes(update.type)
												)
												.indexOf(update)
									)}
								</div>
							</div>
						) : null}
						{update.type === 'add-friend' ? (
							<a
								className="friend-profile-picture-a"
								href={Firebase.pageGenerator.generateUserPage(
									update.userInfo.id,
									update.userInfo.name
								)}
							>
								<img
									src={
										update.userInfo.picture !== undefined
											? update.userInfo.picture
											: 'https://s.gr-assets.com/assets/nophoto/user/u_100x100-259587f1619f5253426a4fa6fb508831.png'
									}
									alt={update.userInfo.name}
								/>
							</a>
						) : null}
						{update.type === 'vote-for-book-review' ? (
							<div className="book-review-preview">
								<a
									href={Firebase.pageGenerator.generateBookPage(
										update.bookInfo.id,
										update.bookInfo.title
									)}
								>
									<img
										src={
											update.bookInfo.cover !== undefined
												? update.bookInfo.cover
												: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png'
										}
										alt={update.bookInfo.title}
									/>
								</a>
								<span className="review-text-span">{`"${update.reviewText.slice(
									0,
									250
								)}"`}</span>
							</div>
						) : null}
						{update.type === 'add-quote' ? (
							<div className="quote-area">
								<a
									href={Firebase.pageGenerator.generateBookPage(
										update.bookInfo.id,
										update.bookInfo.title
									)}
								>
									<img
										src={
											update.bookInfo.cover !== undefined
												? update.bookInfo.cover
												: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png'
										}
										alt={update.bookInfo.title}
									/>
								</a>
								<div className="quote-content-and-authorship">
									<span>{`“${update.quoteContent}”`}</span>
									<a
										href={Firebase.pageGenerator.generateAuthorPage(
											update.authorInfo.id,
											update.authorInfo.name
										)}
									>
										{update.authorInfo.name}
									</a>
								</div>
							</div>
						) : null}
						{update.type === 'follow-author' ? (
							<div className="author-info-section">
								<a
									className="author-profile-picture-wrapper"
									href={Firebase.pageGenerator.generateAuthorPage(
										update.authorInfo.id,
										update.authorInfo.name
									)}
								>
									<img
										src={
											update.authorInfo.picture !== undefined
												? update.authorInfo.picture
												: 'https://s.gr-assets.com/assets/nophoto/user/u_100x100-259587f1619f5253426a4fa6fb508831.png'
										}
										alt={update.authorInfo.name}
									/>
								</a>
								<div className="author-actual-info-section">
									<span className="author-name-span">
										<a
											href={Firebase.pageGenerator.generateAuthorPage(
												update.authorInfo.id,
												update.authorInfo.name
											)}
										>
											{update.authorInfo.name}
										</a>
										{update.authorInfo.isMember ? (
											<div className="goodreads-badge"></div>
										) : null}
									</span>
									<span className="author-best-book-span">
										<span>Author of </span>
										<a
											href={Firebase.pageGenerator.generateBookPage(
												update.authorInfo.bestBookId,
												update.authorInfo.bestBookTitle
											)}
										>
											{update.authorInfo.bestBookSeries === undefined
												? update.authorInfo.bestBookTitle
												: `${update.authorInfo.bestBookTitle} (${update.authorInfo.bestBookSeries}, #${update.authorInfo.bestBookSeriesInstance})`}
										</a>
										<button
											className="follow-author-button"
											onMouseOver={(e) => {
												if (update.authorInfo.userIsFollowing) {
													e.target.innerHTML = 'Unfollow';
												}
											}}
											onMouseOut={(e) => {
												if (update.authorInfo.userIsFollowing) {
													e.target.innerHTML = 'Following';
												}
											}}
										>
											{update.authorInfo.userIsFollowing
												? 'Following'
												: 'Follow Author'}
										</button>
									</span>
								</div>
							</div>
						) : null}
						{updatesBeingDeleted[index] ? (
							<img
								src="https://s.gr-assets.com/assets/loading-trans-ced157046184c3bc7c180ffbfc6825a4.gif"
								alt="Loading"
							/>
						) : null}
						<span className="update-date-span">
							{format(update.date, 'MMM dd, yyyy HH:mma')}
						</span>
						<button
							className="delete-update-button"
							onClick={async (_e) => {
								if (
									window.confirm(
										"This will hide this item from your updates feed so that it no longer appears on your profile or your friends' home pages. The item itself will not be deleted. Are you sure?"
									)
								) {
									setUpdatesBeingDeleted((previous) =>
										previous.map((value, i) => {
											if (i === index) {
												return true;
											}
											return value;
										})
									);
									await Firebase.deleteUpdate(update.id);
									setUserInfo((previous) => {
										return {
											...previous,
											recentUpdates: previous.recentUpdates.filter(
												(u, i) => i !== index
											),
										};
									});
									setUpdatesBeingDeleted((previous) =>
										previous.map((value, i) => {
											if (i === index) {
												return false;
											}
											return value;
										})
									);
								}
							}}
						></button>
					</div>
				);
			})}
		</div>
	) : null;

	const userQuotesSection =
		loaded && userInfo.quotes.length > 0 ? (
			<div className="user-page-quotes-section">
				<span className="section-title">{`${firstName.toUpperCase()}'S QUOTES`}</span>
				{userInfo.quotes
					.filter((_q, index) => index < 5)
					.map((quote, index) => {
						return (
							<div className="user-page-quote-card" key={index}>
								<div className="left-section">
									<a
										href={Firebase.pageGenerator.generateAuthorPage(
											quote.authorId,
											quote.authorName
										)}
									>
										<img
											src={
												quote.authorProfilePicture !== undefined
													? quote.authorProfilePicture
													: 'https://s.gr-assets.com/assets/nophoto/user/u_100x100-259587f1619f5253426a4fa6fb508831.png'
											}
											alt={quote.authorName}
										/>
									</a>
									<div className="actual-quote-section">
										<span className="quote">{`“${quote.content}”`}</span>
										<span className="quote-authorship">
											<span className="dash">― </span>
											<span>{`${quote.authorName}, `}</span>
											<a
												href={Firebase.pageGenerator.generateAddBookPage(
													quote.bookId,
													quote.bookTitle
												)}
											>
												{quote.bookTitle}
											</a>
										</span>
									</div>
								</div>
								<div className="right-section">
									{user.userUID === null || !quote.likedByUser ? (
										<button
											onClick={async (_e) => {
												await Firebase.likeQuote(
													user.userUID,
													quote.id,
													history
												);
												setUserInfo((previous) => {
													return {
														...previous,
														quotes: previous.quotes.map((q, i) => {
															if (i === index) {
																return {
																	...quote,
																	likedByUser: true,
																};
															} else {
																return quote;
															}
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
									>{`${quote.numberOfLikes} likes`}</a>
								</div>
							</div>
						);
					})}
			</div>
		) : null;

	const mainContentLeftSection = (
		<div className="user-page-main-content-left-section">
			{topMessageSection}
			{introduction}
			{userToReadShelfSection}
			{userBookshelvesSection}
			{userCurrentlyReadingSection}
			{userRecentUpdatesSection}
			{userQuotesSection}
		</div>
	);

	const userYearInBooksSection = (
		<div className="user-page-year-in-books-section">
			<a
				className="section-title"
				href={Firebase.pageGenerator.generateUserYearInBooksPage(
					new Date().getFullYear(),
					userId
				)}
			>{`${firstName.toUpperCase()}'S YEAR IN BOOKS`}</a>
			<div className="inner-content">
				<a
					className="image-wrapper"
					href={Firebase.pageGenerator.generateUserYearInBooksPage(
						new Date().getFullYear(),
						userId
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
						<b>{`${
							isLoggedInUser ? 'Your' : `${firstName}'s`
						} ${new Date().getFullYear()} Year in Books`}</b>
					</span>
					<span>{`Take a look at ${
						isLoggedInUser ? 'Your' : `${firstName}'s`
					} Year in Books. The long, the short—it’s all here.`}</span>
					<a
						href={Firebase.pageGenerator.generateUserYearInBooksPage(
							new Date().getFullYear(),
							userId
						)}
					>{`See ${
						isLoggedInUser ? 'Your' : `${firstName}'s`
					} ${new Date().getFullYear()} Year in Books`}</a>
				</div>
			</div>
		</div>
	);

	const userFriendsSection =
		loaded && userInfo.friends.length > 0 ? (
			<div className="user-page-friends-section">
				<span className="section-title">{`${firstName.toUpperCase()}'S FRIENDS (${
					userInfo.friends.length
				})`}</span>
				<div className="friend-list">
					{userInfo.friends
						.filter((_f, index) => index < 8)
						.map((friend, index) => {
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
												friend.picture !== undefined
													? friend.picture
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

	const userFollowingSection =
		loaded && userInfo.following.length > 0 ? (
			<div className="user-page-following-section">
				<span className="section-title">{`PEOPLE ${firstName.toUpperCase()} IS FOLLOWING`}</span>
				<div className="following-list">
					{userInfo.following.map((followingUser, index) => {
						return (
							<a
								href={Firebase.pageGenerator.generateUserPage(
									followingUser.id,
									followingUser.name
								)}
								key={index}
							>
								<img
									src={
										followingUser.picture !== undefined
											? followingUser.picture
											: 'https://www.goodreads.com/assets/nophoto/user/u_60x60-267f0ca0ea48fd3acfd44b95afa64f01.png'
									}
									alt={followingUser.name}
								/>
							</a>
						);
					})}
				</div>
				<span className="number-of-followers-span">{`${userInfo.numberOfFollowers} people are following ${firstName}`}</span>
			</div>
		) : null;

	const userFavoriteAuthorsSection =
		loaded && userInfo.favoriteAuthors.length > 0 ? (
			<div className="user-page-favorite-authors-section">
				<span className="section-title">
					{`${firstName.toUpperCase()}'S FAVORITE AUTHORS`}
					{isLoggedInUser ? (
						<a href={Firebase.pageGenerator.generateFavoriteAuthorsPage()}>
							edit
						</a>
					) : null}
				</span>
				<div className="favorite-author-list">
					{userInfo.favoriteAuthors
						.filter((_a, index) => index < 6)
						.map((author, index) => {
							return (
								<div className="favorite-author-card" key={index}>
									<a
										className="favorite-author-picture-wrapper"
										href={Firebase.pageGenerator.generateAuthorPage(
											author.id,
											author.name
										)}
									>
										<img
											src={
												author.picture !== undefined
													? author.picture
													: 'https://www.goodreads.com/assets/nophoto/user/u_60x60-267f0ca0ea48fd3acfd44b95afa64f01.png'
											}
											alt={author.name}
										/>
									</a>
									<div className="right-section">
										<a
											className="author-name-a"
											href={Firebase.pageGenerator.generateAuthorPage(
												author.id,
												author.name
											)}
										>
											{author.name}
										</a>
										<span>
											<span>author of: </span>
											<a
												className="favorite-author-best-book-a"
												href={Firebase.pageGenerator.generateBookPage(
													author.bestBookId,
													author.bestBookTitle
												)}
											>
												{author.bestBookTitle}
											</a>
										</span>
									</div>
								</div>
							);
						})}
				</div>
			</div>
		) : null;

	const userListopiaSection =
		loaded && userInfo.votedLists.length > 0 ? (
			<div className="user-page-listopia-section">
				<a
					className="section-title"
					href={Firebase.pageGenerator.generateListsVotedByUserPage(
						userId,
						firstName
					)}
				>
					LISTOPIA VOTES
				</a>
				<div className="lists-list">
					{userInfo.votedLists
						.filter((_l, index) => index < 2)
						.map((list, index) => {
							return (
								<div className="list-card" key={index}>
									<div className="covers">
										{list.bookCovers.map((cover, i) => {
											return (
												<a
													className="list-book-cover-wrapper"
													href={Firebase.pageGenerator.generateListPage(
														list.id,
														list.title
													)}
													key={i}
												>
													<img src={cover} alt={list.title} />
												</a>
											);
										})}
									</div>
									<a
										className="list-title-a"
										href={Firebase.pageGenerator.generateListPage(
											list.id,
											list.title
										)}
									>
										{list.title}
									</a>
									<span className="list-stats-span">{`${list.numberOfBooks} books — ${list.numberOfVoters} voters`}</span>
								</div>
							);
						})}
				</div>
				<a
					className="more-lists-a"
					href={Firebase.pageGenerator.generateListsVotedByUserPage(
						userId,
						firstName
					)}
				>
					More...
				</a>
			</div>
		) : null;

	const userFavoriteGenresSection =
		loaded && userInfo.favoriteGenres.length > 0 ? (
			<div className="user-page-favorite-genres-section">
				<span className="section-title">
					FAVORITE GENRES
					{isLoggedInUser ? (
						<a href={Firebase.pageGenerator.generateEditFavoriteGenresPage()}>
							edit
						</a>
					) : null}
				</span>
				<span className="favorite-genres-span">
					{userInfo.favoriteGenres.map((genre, index) => {
						if (index === userInfo.favoriteGenres.length - 1) {
							return (
								<a
									href={Firebase.pageGenerator.generateGenrePage(genre)}
									key={index}
								>
									{capitalizeAndSeparate(genre)}
								</a>
							);
						} else if (index === userInfo.favoriteGenres.length - 2) {
							return (
								<span key={index}>
									<a href={Firebase.pageGenerator.generateGenrePage(genre)}>
										{capitalizeAndSeparate(genre)}
									</a>
									<span>{', and '}</span>
								</span>
							);
						}
						return (
							<span key={index}>
								<a href={Firebase.pageGenerator.generateGenrePage(genre)}>
									{capitalizeAndSeparate(genre)}
								</a>
								<span>, </span>
							</span>
						);
					})}
				</span>
			</div>
		) : null;

	const mainContentRightSectionBottomLinks = (
		<div className="user-page-main-content-right-section-bottom-links">
			<a
				href={Firebase.pageGenerator.generateListsLikedByUserPage(
					userId,
					firstName
				)}
			>{`Lists liked by ${firstName}`}</a>
		</div>
	);

	const mainContentRightSection = (
		<div className="user-page-main-content-right-section">
			{userYearInBooksSection}
			{userFriendsSection}
			{userFollowingSection}
			{userFavoriteAuthorsSection}
			{userListopiaSection}
			{userFavoriteGenresSection}
			{mainContentRightSectionBottomLinks}
		</div>
	);

	const unfollowUserModal = loaded ? (
		<div
			className={
				unfollowModalVisible
					? 'user-page-unfollow-user-modal visible'
					: 'user-page-unfollow-user-modal'
			}
		>
			<button
				className="close-button"
				onClick={(_e) => setUnfollowModalVisible(false)}
			></button>
			<h1>{`${userInfo.isUserFriend ? 'Unfollow' : 'Unfriend'} ${
				showLastName ? firstName + ' ' + userInfo.lastName : firstName
			}?`}</h1>
			<span>
				{userInfo.isUserFriend
					? `This will remove ${firstName}'s activity from your updates feed, and your own activity will stop appearing in their updates feed. ${firstName} will not be notified.`
					: `This will remove ${firstName}'s activity from your updates feed.`}
			</span>
			<div className="buttons">
				<button
					className="confirm-button"
					onClick={async (_e) => {
						setUnfollowModalVisible(false);
						setSavingFollow(true);
						if (userInfo.isUserFriend) {
							await Firebase.unfriendUser(user.userUID, userId, history);
						} else {
							await Firebase.unfollowUser(user.userUID, userId, history);
						}
						setSavingFollow(false);
						setUserInfo((previous) => {
							return {
								...previous,
								isFollowedByUser: false,
								numberOfFollowers: previous.numberOfFollowers - 1,
							};
						});
					}}
				>
					Confirm
				</button>
				<button
					className="cancel-button"
					onClick={(_e) => setUnfollowModalVisible(false)}
				>
					Cancel
				</button>
			</div>
		</div>
	) : null;

	const privateProfileSection = loaded ? (
		<div className="private-profile">
			<h1>{`${firstName}'s profile`}</h1>
			<div className="main-section">
				<div className="left-section">
					<img
						src="https://s.gr-assets.com/assets/nophoto/user/u_225x300-c928cbb998d4ac6dd1f0f66f31f74b81.png"
						alt="Private profile"
					/>
					<span>{`${userInfo.numberOfRatings} ratings | ${userInfo.numberOfReviews} reviews`}</span>
					<button
						className="show-stats-window-button"
						onClick={(_e) => setUserRatingsChartVisible(true)}
					>{`avg rating: ${userInfo.averageRating.toFixed(2)}`}</button>
					<div
						className={
							userRatingsChartVisible
								? 'user-ratings-chart visible'
								: 'user-ratings-chart'
						}
					>
						<RatingsChart
							fiveRatings={userInfo.fiveRatings}
							fourRatings={userInfo.fourRatings}
							threeRatings={userInfo.threeRatings}
							twoRatings={userInfo.twoRatings}
							oneRatings={userInfo.oneRatings}
							closeChart={() => setUserRatingsChartVisible(false)}
						/>
					</div>
				</div>
				<div className="right-section">
					<span className="introduction-span">{`${firstName}'s profile data is set to private.`}</span>
					<span>You can view profiles for:</span>
					<ul>
						<li>direct friends (if you are signed in)</li>
						<li>users who have made their profile public</li>
					</ul>
					<a
						className="add-as-friend-a"
						href={Firebase.pageGenerator.generateAddAsFriendPage(userId)}
					>
						Add friend
					</a>
				</div>
			</div>
		</div>
	) : null;

	const mainContent =
		loaded && showProfile ? (
			<div className="user-page-main-content">
				{mainContentLeftSection}
				{mainContentRightSection}
				{unfollowUserModal}
			</div>
		) : (
			privateProfileSection
		);

	return (
		<div
			className={
				unfollowModalVisible ? 'user-page disabled-scrolling' : 'user-page'
			}
		>
			<div
				className={
					unfollowModalVisible ? 'dark-page-cover visible' : 'dark-page-cover'
				}
			></div>
			<TopBar />
			{mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default UserPage;
