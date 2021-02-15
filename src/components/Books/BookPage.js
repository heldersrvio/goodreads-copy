import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Firebase from '../../Firebase';
import { format } from 'date-fns';
//import TopBar from './TopBar';
//import HomePageFootBar from './HomePageFootBar';

//Missing other editions

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
		? Firebase.generateBookPage(bookInfo.id, bookInfo.title)
		: '';
	const originalBookAddress = loaded
		? Firebase.generateBookPage(bookInfo.originalId, bookInfo.originalTitle)
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

	const bookPageInfoLeft = loaded ? (
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
	) : null;

	const bookPageTitleArea = loaded ? (
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
				<a className="book-page-author-name-a" href={bookInfo.authorPages[0]}>
					{bookInfo.authorNames[0]}
				</a>
				{bookInfo.authorIsMember ? (
					<span className="book-page-goodreads-author">(Goodreads Author)</span>
				) : null}
			</span>
		</div>
	) : null;

	const bookPageRatingsArea = loaded ? (
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
	) : null;

	const bookPageSynopsisArea = loaded ? (
		<div className="book-page-synopsis-area">
			{bookInfo.preSynopsis !== undefined ? (
				<p className="pre-synopsis">
					<b>{bookInfo.preSynopsis}</b>
				</p>
			) : null}
			<p className="synopsis">{bookInfo.synopsis}</p>
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
				{bookInfo.ISBN !== undefined ? <span>ISBN</span> : null}
				<span>Edition Language</span>
				{bookInfo.series !== undefined ? <span>Series</span> : null}
			</div>
			<div className="book-page-book-info-details-expanded-right">
				{bookInfo.ISBN !== undefined ? <span>{bookInfo.ISBN}</span> : null}
				<span>{bookInfo.language}</span>
				{bookInfo.series !== undefined ? (
					<a
						href={bookInfo.series.page}
					>{`${bookInfo.series.name} #${bookInfo.seriesInstance}`}</a>
				) : null}
			</div>
		</div>
	) : null;

	const bookPageBookInfoDetails = loaded ? (
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
			{bookPageBookInfoDetailsExpanded}
			<div className="book-page-book-info-edit-details">
				<a href="/">Edit Details</a>
			</div>
		</div>
	) : null;

	const bookPageInfoRight = (
		<div className="book-page-book-info-right">
			{bookPageTitleArea}
			{bookPageRatingsArea}
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
		bookInfo.lists !== undefined ? (
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
								{list.bookIds.map((bookId, index) => (
									<a
										className="book-page-lists-book-pv"
										href={Firebase.generateListPage(list.id, list.title)}
										key={index}
									>
										<img
											src={list.bookCovers[index]}
											alt={list.bookTitles[index]}
										/>
									</a>
								))}
							</div>
							<div className="book-page-lists-with-book-pv-bottom">
								<a
									className="book-page-lists-with-book-pv-title"
									href={Firebase.generateListPage(list.id, list.title)}
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
					<span>
						<a
							href={Firebase.generateUserPage(
								user.userUID,
								user.userInfo.firstName
							)}
						>
							{user.userInfo.firstName},
						</a>{' '}
						start your review of {bookInfo.title}
					</span>
					<div className="start-your-review-section-right-stars-write">
						<div className="start-your-review-section-right-starts">
							{/* Stars go here */}
						</div>
						<button className="write-review-button">Write a review</button>
					</div>
				</div>
			</div>
		) : null;

	const reviewList = loaded
		? bookInfo.reviews.map((review, index) => {
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
										href={Firebase.generateUserPage(
											review.user,
											review.userName.split(' ')[0]
										)}
									>
										{review.userName}
									</a>{' '}
									rated it <div>{/* Stars go here */}</div>
								</span>
								<a
									className="book-page-review-instance-date"
									href={Firebase.generateReviewPage(review.id)}
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
												<span>
													<a
														href={Firebase.generateShelfPage(
															review.user,
															review.userName.split(' ')[0],
															shelf
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
							<p className="book-page-review-main-body">{review.text}</p>
							<div className="book-page-review-bottom">
								<a
									className="book-page-review-likes"
									href={Firebase.generateReviewLikesPage(review.id)}
								>
									{review.numberOfLikes} likes
								</a>
								<button className="book-page-review-like-button">Like</button>
								<a
									className="book-page-review-see-review"
									href={Firebase.generateReviewPage(review.id)}
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
				<div className="ratings-section-top">{bookPageRatingsArea}</div>
				<div className="ratings-section-bottom">
					<div className="ratings-section-bottom-left">
						<a href="/">Filters</a>
						<span>|</span>
						<a href="/">Sort order</a>
					</div>
					<div className="ratings-section-bottom-right">{/* Search box */}</div>
				</div>
			</div>
			<div className="reviews-section">
				{bookInfo.reviews.filter((review) => {
					if (user.userInfo !== undefined) {
						if (
							user.userInfo.firstName !== undefined &&
							user.userInfo.lastName !== undefined
						) {
							return (
								review.userName ===
								user.userInfo.firstName + user.userInfo.lastName
							);
						} else if (user.userInfo.firstName !== undefined) {
							return review.userName === user.userInfo.firstName;
						}
					}
					return false;
				}).length > 0
					? null
					: startYourReviewSection}
				<div className="book-page-reviews-section-review-list">
					{reviewList}
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

	const bookPageMainContent = loaded ? (
		<div className="book-page-main-content">{bookPageMainContentLeft}</div>
	) : null;

	const bookPageEnlargingCover = (
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
	);

	return (
		<div className="book-page">
			{bookPageMainContent}
			{bookPageEnlargingCover}
		</div>
	);
};

export default BookPage;
