import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Firebase from '../../Firebase';
import { format } from 'date-fns';
import '../styles/Books/BookPage.css';
import TopBar from '../Global/TopBar';
//import HomePageFootBar from './HomePageFootBar';

//Missing other editions
//Reviews: missing 'more...' button, testing shelves and testing several reviews
// Missing testing and styling for articles

const BookPage = ({ match }) => {
	const {
		params: { bookPageId },
	} = match;
	const [bookInfo, setBookInfo] = useState({ title: '', cover: '' });
	const [loaded, setLoaded] = useState(false);
	const [enlargingCover, setEnlargingCover] = useState(false);
	const [savingShelf, setSavingShelf] = useState(false);
	const [quizQuestionOptionSelected, setQuizQuestionOptionSelected] = useState(
		-1
	);
	const [synopsisShowMore, setSynopsisShowMore] = useState(false);
	const [showMoreBookInfoDetails, setShowMoreBookInfoDetails] = useState(false);

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
		? Firebase.pageGenerator.generateBookPage(bookInfo.id, bookInfo.title)
		: '';
	const originalBookAddress = loaded
		? Firebase.pageGenerator.generateBookPage(
				bookInfo.originalId,
				bookInfo.originalTitle
		  )
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

	const bookPageRatingsArea = loaded ? (
		<div className="book-page-ratings-area">
			<div className="book-page-general-rating">
				{/* Stars and general rating go here */}
			</div>
			<span className="book-page-ratings-dot">·</span>
			<button className="rating-details">Rating details</button>
			<span className="book-page-ratings-dot">·</span>
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
				<p className="synopsis">{bookInfo.synopsis}</p>
			</div>
			<button
				className="synopsis-show-more"
				onClick={(e) => {
					setSynopsisShowMore((previous) => !previous);
				}}
			>
				{synopsisShowMore ? '(less)' : '...more'}
			</button>
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
				<span>Edition Language</span>
				{bookInfo.series !== undefined ? <span>Series</span> : null}
			</div>
			<div className="book-page-book-info-details-expanded-right">
				<span>{bookInfo.originalTitle}</span>
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
					? `${bookInfo.type}, ${bookInfo.pageCount} pages`
					: `${bookInfo.pageCount} pages`}
			</span>
			<span className="book-publication">
				{`Published ${format(
					bookInfo.editionPublishedDate,
					'MMMM do yyyy'
				)} by ${bookInfo.publisher}`}
				{bookInfo.firstEditionPublishedYear !==
				bookInfo.editionPublishedDate.getYear() ? (
					<span className="book-publication-original-year">{` (first published ${bookInfo.firstEditionPublishedYear})`}</span>
				) : null}
			</span>
			{showMoreBookInfoDetails ? bookPageBookInfoDetailsExpanded : null}
			<div className="book-page-book-info-bottom">
				<button
					className="show-more-book-info-details-button"
					onClick={(e) => {
						setShowMoreBookInfoDetails((previous) => !previous);
					}}
				>
					{showMoreBookInfoDetails ? '...Less Detail' : 'More Details...'}
				</button>
				<a href="/" className="book-page-book-info-edit-details">
					Edit Details
				</a>
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
								{list.bookIds.map((bookId, index) => (
									<a
										className="book-page-lists-book-pv"
										href={Firebase.pageGenerator.generateListPage(
											list.id,
											list.title
										)}
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
					<span>
						<a
							href={Firebase.pageGenerator.generateUserPage(
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
										href={Firebase.pageGenerator.generateUserPage(
											review.user,
											review.userName.split(' ')[0]
										)}
									>
										{review.userName}
									</a>
									<span>&nbsp;rated it</span> {/* Stars go here */}
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
												<span>
													<a
														href={Firebase.pageGenerator.generateReviewShelfPage(
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
									href={Firebase.pageGenerator.generateReviewLikesPage(
										review.id
									)}
								>
									{review.numberOfLikes} likes
								</a>
								<span className="black-dot">·</span>
								<button className="book-page-review-like-button">Like</button>
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
				<div className="ratings-section-top">{bookPageRatingsArea}</div>
				<div className="ratings-section-bottom">
					<div className="ratings-section-bottom-left">
						<button>Filters</button>
						<span>|</span>
						<button>Sort order</button>
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

	const bookPageMainContentRightTop = loaded ? (
		<div className="book-page-main-content-right-top">
			<button className="recommend-book-button">Recommend it</button>
			<span className="book-page-main-content-right-top-separator">|</span>
			<a
				href={Firebase.pageGenerator.generateBookStatsPage(
					bookInfo.id,
					bookInfo.title
				)}
				className="book-page-book-stats-a"
			>
				Stats
			</a>
		</div>
	) : null;

	const bookPageReadersAlsoEnjoyedSection = loaded ? (
		<div className="book-page-readers-also-enjoyed">
			<div className="book-page-readers-also-enjoyed-main">
				<span>READERS ALSO ENJOYED</span>
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
							<img src={book.cover} alt={book.title} />
						</a>
					);
				})}
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
				<a
					className="book-page-genres-title-a"
					href={Firebase.pageGenerator.generateBookTopShelvesPage(bookInfo.id)}
				>
					GENRES
				</a>
				<div className="book-page-genres-list">
					{bookInfo.genres.map((genre, index) => {
						return (
							<div className="book-page-genres-list-cell" key={index}>
								<a href={Firebase.pageGenerator.generateGenrePage(genre.genre)}>
									{genre.genre}
								</a>
								<a
									href={Firebase.pageGenerator.generateBookGenreShelfPage(
										bookInfo.id,
										bookInfo.title,
										genre
									)}
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
			<a
				className="author-about-section-title-a"
				href={bookInfo.authorPages[0]}
			>{`ABOUT ${bookInfo.authorNames[0].toUpperCase()}`}</a>
			<div className="author-about-section-preview">
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
					<a
						className="author-about-section-preview-name"
						href={bookInfo.authorPages[0]}
					>
						{bookInfo.authorNames[0]}
						<span>{/* Goodreads seal if member else null */}</span>
					</a>
					<span className="author-about-section-preview-follower-count">
						{bookInfo.authorFollowerCount}
					</span>
					<button className="book-page-follow-author-button">
						Follow Author
					</button>
				</div>
				{bookInfo.mainAuthorAbout !== undefined ? (
					<p className="author-about-section-about">
						{bookInfo.mainAuthorAbout}
					</p>
				) : null}
			</div>
		</div>
	) : null;

	const bookPageBooksByAuthorSection = loaded ? (
		<div className="book-page-books-by-author">
			<div className="book-page-books-by-author-main">
				<a
					className="book-page-books-by-author-a"
					href={bookInfo.booksByAuthorPage}
				>{`BOOKS BY ${bookInfo.authorNames[0].toUpperCase()}`}</a>
				{bookInfo.publishedBooksByAuthor.map((book, index) => {
					return (
						<a key={index} href={book.page}>
							<img src={book.cover} alt={book.id} />
						</a>
					);
				})}
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
				<span className="book-page-articles-title">
					ARTICLES FEATURING THIS BOOK
				</span>
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
				<a
					className="book-page-quiz-question-a"
					href={Firebase.pageGenerator.generateBookTriviaPage(
						bookInfo.id,
						bookInfo.title
					)}
				>
					QUIZ QUESTION
				</a>
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
											onChange={(e) => {
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
				<a
					className="book-page-quiz-question-a"
					href={Firebase.pageGenerator.generateBookTriviaPage(
						bookInfo.id,
						bookInfo.title
					)}
				>{`QUIZZES ABOUT ${bookInfo.title.toUpperCase()}:...`}</a>
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
				<a
					className="book-page-quotes-section-a"
					href={bookInfo.quotesPage}
				>{`QUOTES FROM ${bookInfo.title.toUpperCase()}:...`}</a>
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
				enlargingCover ? 'cover-picture-box' : 'cover-picture-box hidden'
			}
		>
			<img
				src={bookInfo.cover}
				alt={bookInfo.title}
				className="book-info-book-cover-enlarged"
			></img>
		</div>
	) : null;

	return (
		<div className="book-page">
			<TopBar />
			{bookPageMainContent}
			{bookPageEnlargingCover}
		</div>
	);
};

export default BookPage;
