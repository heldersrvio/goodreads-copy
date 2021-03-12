import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';

const BookQuotesPage = ({ match }) => {
	const history = useHistory();
	const {
		params: { bookQuotesPageId },
	} = match;
	const bookId = bookQuotesPageId.split('-')[0];
	const bookTitle = bookQuotesPageId.split('-').slice(1).join(' ');
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
	/*
    bookInfo: {
        authorId,
        authorName,
        numberOfRatings,
        averageRating,
        numberOfReviews,
        userStatus,
        userRating,
        userProgress,
        toReadBookPosition,
        quotes: [{
            id,
            content,
            tags,
            usersWhoLiked,
        }]
    };
    */

	const user = JSON.parse(localStorage.getItem('userState'));

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

	const pageHeader = <h1 className="book-quotes-page-header">{bookTitle}</h1>;

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

	return (
		<div className="book-quotes-page">
			<TopBar />
			<HomePageFootBar />
		</div>
	);
};

export default BookQuotesPage;
