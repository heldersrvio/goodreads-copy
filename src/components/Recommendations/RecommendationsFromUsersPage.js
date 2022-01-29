import React, { useState, useEffect } from 'react';
import Firebase from '../../Firebase';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import { trackPromise } from 'react-promise-tracker';
import { useHistory } from 'react-router-dom';
import '../styles/Recommendations/RecommendationsFromUsersPage.css';

const RecommendationsFromUsersPage = () => {
	// TODO: No recommendations case

	const history = useHistory();
	const [loaded, setLoaded] = useState(false);
	const [recommendations, setRecommendations] = useState([]);

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
	/*
    [
        {
            id,
            message,
            book: {
                bookId,
                title,
                cover,
                authorId,
                authorName,
                userStatus,
                userRating,
                userProgress,
            },
            otherUser: {
                userId,
                firstName,
            },
        }
    ]
    */
	const genericBookCover =
		'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png';

	useEffect(() => {
		const loadRecommendations = async () => {
			const recommendationsArray = await trackPromise(
				Firebase.getRecommendationsToFromUser(user.userUID, true)
			);
			setRecommendations(recommendationsArray);
			setSavingShelves(
				recommendationsArray.map((rec) => rec.book).map((_book) => false)
			);
			setAreAddShelfInputSectionsHidden(
				recommendationsArray.map((rec) => rec.book).map((_book) => true)
			);
			setAddShelfInputs(
				recommendationsArray.map((rec) => rec.book).map((_book) => '')
			);
			setExhibitedStarRatings(
				recommendationsArray
					.map((rec) => rec.book)
					.map((edition) =>
						edition.userRating !== undefined ? edition.userRating : 0
					)
			);
			setAreShelfPopupsHidden(
				recommendationsArray.map((rec) => rec.book).map((_book) => true)
			);
			setAreShelfPopupsBottomHidden(
				recommendationsArray.map((rec) => rec.book).map((_book) => true)
			);
			setShelfPopupReadingInputs(
				recommendationsArray.map((rec) => rec.book).map((_book) => '')
			);
			setShelfPopupToReadInputs(
				recommendationsArray.map((rec) => rec.book).map((_book) => '')
			);
			setLoaded(true);
		};

		loadRecommendations();
	}, [user.userUID]);

	const ignoreRecommendation = async (id) => {
		await Firebase.deleteRecommendation(id);
		setRecommendations((previous) => previous.filter((rec) => rec.id !== id));
	};

	const displayRemoveBookConfirm = () => {
		return window.confirm(
			'Removing a book deletes your rating, review, etc. Remove this book from all your shelves?'
		);
	};

	const removeBookSafely = (bookObject, index) => {
		if (displayRemoveBookConfirm()) {
			Firebase.removeBookFromShelf(user.userUID, bookObject.bookId);
			setRecommendations((previous) => {
				return previous.map((previousObject, i) =>
					i === index
						? {
								...previousObject,
								book: {
									...previousObject.book,
									userStatus: undefined,
									userProgress: undefined,
									userRating: undefined,
								},
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
			setRecommendations((previous) => {
				return previous.map((previousObject, i) =>
					i === index
						? {
								...previousObject,
								book: {
									...previousObject.book,
									userStatus: shelf,
								},
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
			setRecommendations((previous, i) => {
				return previous.map((previousObject, i) =>
					i === index
						? {
								...previousObject,
								book: {
									...previousObject.book,
									userStatus:
										previousObject.userStatus !== undefined
											? previousObject.userStatus
											: 'read',
									userRating: rating,
								},
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
			setRecommendations((previous) => {
				return previous.map((previousObject, i) =>
					i === index
						? {
								...previousObject,
								book: { ...previousObject.book, userProgress: pages },
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
										setRecommendations((previous) =>
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

	return (
		<div className="recommendations-from-users-page recommendation-page">
			<TopBar />
			<div className="recommendations-main-content">
				<span className="recommendations-page-indicator">
					Recommendations {'>'} From Users
				</span>
				<span className="recommendations-total-span">
					{`Showing 1-${recommendations.length} of ${recommendations.length}`}
				</span>
				<div className="main-content">
					<div className="recommendation-list">
						{recommendations.map((recommendation, index) => {
							return (
								<div className="recommendation-card" key={recommendation.id}>
									<div className="top-section">
										<span>
											<a
												href={Firebase.pageGenerator.generateUserPage(
													recommendation.otherUser.userId,
													recommendation.otherUser.firstName
												)}
											>
												{recommendation.otherUser.firstName}
											</a>{' '}
											recommended:
										</span>
										<button
											className="ignore-button"
											onClick={() => ignoreRecommendation(recommendation.id)}
										>
											ignore
										</button>
									</div>
									<div className="bottom-section">
										<div className="left-section">
											<a
												className="cover-wrapper-a"
												href={Firebase.pageGenerator.generateBookPage(
													recommendation.book.bookId,
													recommendation.book.title
												)}
											>
												<img
													src={
														recommendation.book.cover !== undefined &&
														recommendation.book.cover !== null
															? recommendation.book.cover
															: genericBookCover
													}
													alt={recommendation.book.title}
												/>
											</a>
											<div className="book-info">
												<a
													className="book-title-a"
													href={Firebase.pageGenerator.generateBookPage(
														recommendation.book.bookId,
														recommendation.book.title
													)}
												>
													{recommendation.book.title}
												</a>
												<span className="authorship-span">
													by{' '}
													<a
														className="author-name-a"
														href={Firebase.pageGenerator.generateAuthorPage(
															recommendation.book.authorId,
															recommendation.book.authorName
														)}
													>
														{recommendation.book.authorName}
													</a>
												</span>
												{recommendation.message !== undefined &&
												recommendation.message !== null &&
												recommendation.message.length > 0 ? (
													<span className="rec-message-span">
														<a
															href={Firebase.pageGenerator.generateUserPage(
																recommendation.otherUser.userId,
																recommendation.otherUser.firstName
															)}
														>
															they
														</a>{' '}
														said: " {recommendation.message} "
													</span>
												) : null}
											</div>
										</div>
										<div className="right-section">
											<div
												className={`want-to-read-button-and-options ${
													recommendation.book.userStatus !== undefined
														? recommendation.book.userStatus
														: ''
												}`}
											>
												{generateAddToShelfButton(recommendation.book, index)}
												{generateBookOptionsDropdown(
													recommendation.book,
													index
												)}
											</div>
											{generateRateBookSection(recommendation.book, index)}
										</div>
									</div>
								</div>
							);
						})}
					</div>
					<div className="more-actions-box">
						<span className="more-actions-title">More Actions</span>
						<div className="anchors-list">
							<a
								className="selected"
								href={Firebase.pageGenerator.generateRecommendationsPage(true)}
							>
								Recommendations from Users
							</a>
							<a
								href={Firebase.pageGenerator.generateRecommendationsPage(false)}
							>
								Recommendations from You
							</a>
						</div>
					</div>
				</div>
			</div>
			<HomePageFootBar />
		</div>
	);
};

export default RecommendationsFromUsersPage;
