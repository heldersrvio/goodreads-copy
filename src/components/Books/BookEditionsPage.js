import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Firebase from '../../Firebase';
import { format } from 'date-fns';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';

const BookEditionsPage = ({ match }) => {
	const history = useHistory();
	const {
		params: { bookEditionsPageId },
	} = match;
	const bookId = bookEditionsPageId.split('.')[0];
	const bookTitle = bookEditionsPageId.split('.')[1].replace('_', ' ');
	const [loaded, setLoaded] = useState(false);
	const [editionsInfo, setEditionsInfo] = useState([]);
	const [detailsExpanding, setDetailsExpanding] = useState([]);
	const [defaultExpanding, setDefaultExpanding] = useState(false);
	const [editionsPerPage, setEditionsPerPage] = useState(10);
	const [page, setPage] = useState(1);
	const [format, setFormat] = useState('');
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
					<span>by</span>
					<a
						href={Firebase.pageGenerator.generateAuthorPage(
							editionsInfo[0].authorIds[0],
							editionsInfo[0].authorNames[0]
						)}
					>
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
					(page - 1) * 10 + 1
				}-${(page - 1) * 10 + editionsPerPage} of ${
					editionsInfo.length
				}`}</span>
			</div>
			<div className="book-editions-page-info-and-filters-bottom-right">
				<label htmlFor="format">Format</label>
				<select
					name="format"
					value={format}
					onChange={(e) => setFormat(e.target.value)}
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
				<div className="right-section"></div>
			</div>
		);
	};

	const editionCardList = loaded ? (
		<div className="book-editions-page-edition-card-list"></div>
	) : null;
};

export default BookEditionsPage;
