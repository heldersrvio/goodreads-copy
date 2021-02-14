import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Firebase from '../../Firebase';
import { format } from 'date-fns';
//import TopBar from './TopBar';
//import HomePageFootBar from './HomePageFootBar';

const BookPage = ({ match }) => {
	const {
		params: { bookPageId },
	} = match;
	const [bookInfo, setBookInfo] = useState({ title: '', cover: '' });
	const [loaded, setLoaded] = useState(false);
	const [enlargingCover, setEnlargingCover] = useState(false);
	const [savingShelf, setSavingShelf] = useState(false);

	const user = useSelector((state) => state);

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
			const bookObj = await Firebase.queryBookById(user.userUID, bookId);
			setBookInfo(bookObj);
			setLoaded(true);
		};
		getBookInfo();
	}, [bookPageId, user.userUID]);

	const displayRemoveBookConfirm = () => {
		window.confirm(
			'Removing a book deletes your rating, review, etc. Remove this book from all your shelves?'
		);
	};

	const removeBookSafely = () => {
		if (displayRemoveBookConfirm()) {
			Firebase.removeBookFromShelf(user.userUID, bookInfo.id);
		}
	};

	const bookAddress = loaded
		? `${bookInfo.id}.${bookInfo.title.replace(/ /g, '_')}`
		: '';
	const originalBookAddress = loaded
		? `${bookInfo.originalId}.${bookInfo.originalTitle.replace(/ /g, '_')}`
		: '';
	const addToShelfButton =
		loaded && bookInfo.userStatus === 'reading' ? (
			<div className="book-page-reading-button">
				<button
					className="remove-book-from-shelf-button-reading"
					onClick={removeBookSafely}
				/>
				<span>Currently Reading</span>
			</div>
		) : loaded && bookInfo.userStatus === 'read' ? (
			<div className="book-page-read-button">
				<button
					className="remove-book-from-shelf-button-read"
					onClick={removeBookSafely}
				/>
				<span>Read</span>
			</div>
		) : (
			<button
				className="book-page-want-to-read-button"
				onClick={async () => {
					if (user.userUID !== null && user.userUID !== undefined) {
						setSavingShelf(true);
						await Firebase.addBookToShelf(user.userUID, bookInfo.id, 'to-read');
						setSavingShelf(false);
					}
				}}
			>
				{savingShelf ? '...saving' : 'Want to Read'}
			</button>
		);

	const bookPageMainContent = loaded ? (
		<div className="book-page-main-content">
			<div className="book-page-main-content-left">
				<div className="book-page-book-info">
					<div className="book-page-book-info-left">
						<div className="book-page-book-info-cover-wrap">
							<img
								src={bookInfo.cover}
								alt={bookInfo.title}
								className="book-info-book-cover"
							/>
							<a
								className="book-cover-page-anchor"
								href={`/book/photo/${bookAddress}`}
							>
								<span></span>
							</a>
							<a
								className="book-other-editions-anchor"
								href={`/work/editions/${originalBookAddress}`}
							>
								Other editions
							</a>
							<button
								className="book-page-enlarge-cover"
								onClick={() => setEnlargingCover(!enlargingCover)}
							>
								Enlarge cover
							</button>
							<a
								className="book-cover-page-anchor"
								href={`/book/photo/${bookAddress}`}
							>
								<span></span>
							</a>
						</div>
						<div className="book-page-user-shelf-section">
							<div className="add-to-shelf-buttons">{addToShelfButton}</div>
						</div>
						<div className="book-page-rate-book">
							<span className="rate-this-book">Rate this book</span>
							{/* The stars go here */}
						</div>
					</div>
					<div className="book-page-book-info-right">
						<div className="book-page-title-area">
							<h1 className="book-page-book-title">
								{bookInfo.title}
								{bookInfo.series !== undefined ? (
									<a
										className="book-page-book-title-series-a"
										href={bookInfo.series.page}
									>{`(${bookInfo.series.name} #${bookInfo.seriesInstance})`}</a>
								) : (
									''
								)}
							</h1>
							<span className="book-page-author-name">
								by{' '}
								<a
									className="book-page-author-name-a"
									href={bookInfo.authorPages[0]}
								>
									{bookInfo.authorNames[0]}
								</a>
								{bookInfo.authorIsMember ? (
									<span className="book-page-goodreads-author">
										(Goodreads Author)
									</span>
								) : null}
							</span>
						</div>
						<div className="book-page-ratings-area">
							<div className="book-page-general-rating">
								{/* Stars and general rating go here */}
							</div>
							<button className="rating-details">Rating details</button>
							<a
								className="book-page-ratings-count"
								href={`${bookPageId}#other-reviews`}
							>
								{`${
									bookInfo.fiveRatings +
									bookInfo.fourRatings +
									bookInfo.threeRatings +
									bookInfo.twoRatings +
									bookInfo.oneRatings
								} ratings`}
							</a>
							<a
								className="book-page-reviews-count"
								href={`${bookPageId}#other-reviews`}
							>
								{`${bookInfo.reviews.length} reviews`}
							</a>
						</div>
						<div className="book-page-synopsis-area">
							{bookInfo.preSynopsis !== undefined ? (
								<p className="pre-synopsis">
									<b>{bookInfo.preSynopsis}</b>
								</p>
							) : null}
							<p className="synopsis">{bookInfo.synopsis}</p>
						</div>
						<div className="book-page-get-a-copy">
							<span>GET A COPY</span>
							<a href={bookInfo.amazonLink}>Amazon</a>
						</div>
						<div className="book-page-book-info-details">
							<span className="book-type-and-pages">
								{bookInfo.type !== undefined
									? `${bookInfo.type}, ${bookInfo.pages}`
									: bookInfo.pages}
							</span>
							<span className="book-publication">
								{`Published ${format(
									bookInfo.editionPublishedDate,
									'MMMM do yyyy'
								)} by ${bookInfo.publisher}`}
								{bookInfo.firstEditionPublishedYear !==
								bookInfo.editionPublishedDate.getYear() ? (
									<span className="book-publication-original-year">{`(first published ${bookInfo.firstEditionPublishedYear})`}</span>
								) : null}
							</span>
							<div className="book-page-book-info-details-expanded">
								<div className="book-page-book-info-details-expanded-left">
									<span>ISBN</span>
									<span>Edition Language</span>
									{bookInfo.series !== undefined ? <span>Series</span> : null}
								</div>
								<div className="book-page-book-info-details-expanded-right">
									<span>{bookInfo.ISBN}</span>
									<span>{bookInfo.language}</span>
									{bookInfo.series !== undefined ? (
										<a
											href={bookInfo.series.page}
										>{`${bookInfo.series.name} #${bookInfo.seriesInstance}`}</a>
									) : null}
								</div>
							</div>
							<div className="book-page-book-info-edit-details">
								<a href="/">Edit Details</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	) : null;

	return (
		<div className="book-page">
			{bookPageMainContent}
			<div
				className={
					enlargingCover ? 'cover-picture-box' : 'cover-picture-box hidden'
				}
			>
				<img
					src={bookInfo.cover}
					alt={bookInfo.title}
					className="book-info-book-cover-enlarged"
				></img>
			</div>
		</div>
	);
};

export default BookPage;
