import React, { useState, useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import Firebase from '../../Firebase';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import TopBar from '../Global/TopBar';
import '../styles/Explore/ExplorePage.css';

const ExplorePage = () => {
	const [info, setInfo] = useState(null);
	const [loaded, setLoaded] = useState(false);
	const [enjoyedBookSectionSequence, setEnjoyedBookSectionSequence] = useState(
		1
	);
	const [readingBookSectionSequence, setReadingBookSectionSequence] = useState(
		1
	);
	const [
		trendingBooksSectionSequence,
		setTrendingBooksSectionSequence,
	] = useState(1);
	const [articlesSequence, setArticlesSequence] = useState(1);

	const booksPerSequence = 4;
	const articlesPerSequence = 2;

	const user = JSON.parse(localStorage.getItem('userState'));

	const noCoverUrl =
		'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png';

	useEffect(() => {
		const loadInfo = async () => {
			setInfo(await trackPromise(Firebase.getInfoForExplorePage(user.userUID)));
			setLoaded(true);
		};

		loadInfo();
	}, [user.userUID]);

	useEffect(() => {
		console.log(info);
	}, [info]);

	const topNewsAndInterviewsSection =
		loaded && info.articles.length > 0 ? (
			<div className="top-news-and-interviews-section">
				<a
					className="featured-article-card"
					href={Firebase.pageGenerator.generateArticlePage(
						info.articles[0].id,
						info.articles[0].title
					)}
				>
					<img src={info.articles[0].image} alt={info.articles[0].title} />
					<div className="right-section">
						<span className="article-title-span">{info.articles[0].title}</span>
						<span className="comments-likes-span">
							{`${info.articles[0].numberOfLikes} likes · ${info.articles[0].numberOfComments} comments`}
						</span>
					</div>
				</a>
				<a
					className="see-all-a"
					href={Firebase.pageGenerator.generateNewsPage()}
				>
					<span>{'More news & interviews'}</span>
					<span className="chevron-span"></span>
				</a>
			</div>
		) : null;

	const enjoyedBookSection =
		loaded &&
		info.enjoyedBook !== undefined &&
		info.enjoyedBook.similarBooks.length > 0 ? (
			<div className="similar-books-section">
				<div className="similar-books-section-header explore-page-section-header">
					<span className="title-span">
						Because you enjoyed{' '}
						<a
							href={Firebase.pageGenerator.generateBookPage(
								info.enjoyedBook.id,
								info.enjoyedBook.title
							)}
						>
							<i>{info.enjoyedBook.title}</i>
						</a>
					</span>
					<div className="back-forward-arrows">
						<button
							className="arrow-back-button"
							disabled={enjoyedBookSectionSequence === 1}
							onClick={() =>
								setEnjoyedBookSectionSequence((previous) => previous - 1)
							}
						>
							<span className="chevron-span"></span>
						</button>
						<button
							className="arrow-forward-button"
							disabled={
								enjoyedBookSectionSequence ===
								Math.ceil(
									info.enjoyedBook.similarBooks.length / booksPerSequence
								)
							}
							onClick={() =>
								setEnjoyedBookSectionSequence((previous) => previous + 1)
							}
						>
							<span className="chevron-span"></span>
						</button>
					</div>
				</div>
				<div className="similar-books-list">
					{info.enjoyedBook.similarBooks
						.filter(
							(_book, index) =>
								index >= (enjoyedBookSectionSequence - 1) * booksPerSequence &&
								index <= enjoyedBookSectionSequence * booksPerSequence - 1
						)
						.map((book, index) => {
							return (
								<a
									className="book-card"
									key={index}
									href={Firebase.pageGenerator.generateBookPage(
										book.id,
										book.title
									)}
								>
									<img
										src={book.cover === undefined ? noCoverUrl : book.cover}
										alt={book.title}
									/>
									<span className="title-span">{book.title}</span>
									<span className="author-name-span">{book.authorName}</span>
									<div className="rating-section">
										<div className="star">
											<svg viewBox="0 0 24 24" role="presentation">
												<g
													stroke="none"
													strokeWidth="1"
													fill="none"
													fillRule="evenodd"
												>
													<path
														className="RatingStar__fill"
														d="M12.4770229,1.34326985 L15.0891563,9.1315756 L23.4968842,9.1315756 C23.7747474,9.1315756 24,9.35682823 24,9.63469143 C24,9.79809886 23.9206399,9.95132779 23.7871766,10.0456121 L16.9959586,14.8432273 L19.5982827,22.6117477 C19.6865419,22.8752212 19.5445026,23.1603569 19.2810291,23.2486161 C19.1293386,23.2994298 18.9625235,23.2750752 18.8316924,23.1830139 L12.0000207,18.3758025 L5.1685337,23.1876292 C4.94136559,23.3476374 4.62749722,23.2931935 4.46748907,23.0660254 C4.37533831,22.9351963 4.35092131,22.7683321 4.4017231,22.616585 L7.00408269,14.8432273 L0.212864685,10.0456121 C-0.0140805533,9.88528803 -0.0680876559,9.57134421 0.0922364448,9.34439897 C0.186520784,9.21093568 0.339749724,9.1315756 0.503157148,9.1315756 L8.910885,9.1315756 L11.5230185,1.34326985 C11.6113744,1.0798288 11.8965622,0.937894292 12.1600033,1.02625024 C12.3095218,1.07639751 12.4268756,1.19375135 12.4770229,1.34326985 Z"
													></path>
												</g>
											</svg>
										</div>
										<span className="rating-span">
											{book.rating.toFixed(2)}
										</span>
										<span className="number-of-ratings-span">{`· ${book.numberOfRatings}`}</span>
									</div>
								</a>
							);
						})}
				</div>
				<a
					className="see-all-a"
					href={Firebase.pageGenerator.generateSimilarBooksPage(
						info.enjoyedBook.id,
						info.enjoyedBook.title
					)}
				>
					<span>See all</span>
					<span className="chevron-span"></span>
				</a>
			</div>
		) : null;

	const readingBookSection =
		loaded &&
		info.readingBook !== undefined &&
		info.readingBook.similarBooks.length > 0 ? (
			<div className="similar-books-section">
				<div className="similar-books-section-header explore-page-section-header">
					<span className="title-span">
						Because you're reading{' '}
						<a
							href={Firebase.pageGenerator.generateBookPage(
								info.readingBook.id,
								info.readingBook.title
							)}
						>
							<i>{info.readingBook.title}</i>
						</a>
					</span>
					<div className="back-forward-arrows">
						<button
							className="arrow-back-button"
							disabled={readingBookSectionSequence === 1}
							onClick={() =>
								setReadingBookSectionSequence((previous) => previous - 1)
							}
						>
							<span className="chevron-span"></span>
						</button>
						<button
							className="arrow-forward-button"
							disabled={
								readingBookSectionSequence ===
								Math.ceil(
									info.readingBook.similarBooks.length / booksPerSequence
								)
							}
							onClick={() =>
								setReadingBookSectionSequence((previous) => previous + 1)
							}
						>
							<span className="chevron-span"></span>
						</button>
					</div>
				</div>
				<div className="similar-books-list">
					{info.readingBook.similarBooks
						.filter(
							(_book, index) =>
								index >= (readingBookSectionSequence - 1) * booksPerSequence &&
								index <= readingBookSectionSequence * booksPerSequence - 1
						)
						.map((book, index) => {
							return (
								<a
									className="book-card"
									key={index}
									href={Firebase.pageGenerator.generateBookPage(
										book.id,
										book.title
									)}
								>
									<img
										src={book.cover === undefined ? noCoverUrl : book.cover}
										alt={book.title}
									/>
									<span className="title-span">{book.title}</span>
									<span className="author-name-span">{book.authorName}</span>
									<div className="rating-section">
										<div className="star">
											<svg viewBox="0 0 24 24" role="presentation">
												<g
													stroke="none"
													strokeWidth="1"
													fill="none"
													fillRule="evenodd"
												>
													<path
														className="RatingStar__fill"
														d="M12.4770229,1.34326985 L15.0891563,9.1315756 L23.4968842,9.1315756 C23.7747474,9.1315756 24,9.35682823 24,9.63469143 C24,9.79809886 23.9206399,9.95132779 23.7871766,10.0456121 L16.9959586,14.8432273 L19.5982827,22.6117477 C19.6865419,22.8752212 19.5445026,23.1603569 19.2810291,23.2486161 C19.1293386,23.2994298 18.9625235,23.2750752 18.8316924,23.1830139 L12.0000207,18.3758025 L5.1685337,23.1876292 C4.94136559,23.3476374 4.62749722,23.2931935 4.46748907,23.0660254 C4.37533831,22.9351963 4.35092131,22.7683321 4.4017231,22.616585 L7.00408269,14.8432273 L0.212864685,10.0456121 C-0.0140805533,9.88528803 -0.0680876559,9.57134421 0.0922364448,9.34439897 C0.186520784,9.21093568 0.339749724,9.1315756 0.503157148,9.1315756 L8.910885,9.1315756 L11.5230185,1.34326985 C11.6113744,1.0798288 11.8965622,0.937894292 12.1600033,1.02625024 C12.3095218,1.07639751 12.4268756,1.19375135 12.4770229,1.34326985 Z"
													></path>
												</g>
											</svg>
										</div>
										<span className="rating-span">
											{book.rating.toFixed(2)}
										</span>
										<span className="number-of-ratings-span">{`· ${book.numberOfRatings}`}</span>
									</div>
								</a>
							);
						})}
				</div>
				<a
					className="see-all-a"
					href={Firebase.pageGenerator.generateSimilarBooksPage(
						info.readingBook.id,
						info.readingBook.title
					)}
				>
					<span>See all</span>
					<span className="chevron-span"></span>
				</a>
			</div>
		) : null;

	const trendingBooksSection =
		loaded &&
		info.trendingBooks !== undefined &&
		info.trendingBooks.length > 0 ? (
			<div className="similar-books-section">
				<div className="similar-books-section-header explore-page-section-header">
					<span className="title-span">Trending with Goodreads members</span>
					<div className="back-forward-arrows">
						<button
							className="arrow-back-button"
							disabled={trendingBooksSectionSequence === 1}
							onClick={() =>
								setTrendingBooksSectionSequence((previous) => previous - 1)
							}
						>
							<span className="chevron-span"></span>
						</button>
						<button
							className="arrow-forward-button"
							disabled={
								trendingBooksSectionSequence ===
								Math.ceil(info.trendingBooks.length / booksPerSequence)
							}
							onClick={() =>
								setTrendingBooksSectionSequence((previous) => previous + 1)
							}
						>
							<span className="chevron-span"></span>
						</button>
					</div>
				</div>
				<div className="similar-books-list">
					{info.trendingBooks
						.filter(
							(_book, index) =>
								index >=
									(trendingBooksSectionSequence - 1) * booksPerSequence &&
								index <= trendingBooksSectionSequence * booksPerSequence - 1
						)
						.map((book, index) => {
							return (
								<a
									className="book-card"
									key={index}
									href={Firebase.pageGenerator.generateBookPage(
										book.id,
										book.title
									)}
								>
									<img
										src={book.cover === undefined ? noCoverUrl : book.cover}
										alt={book.title}
									/>
									<span className="title-span">{book.title}</span>
									<span className="author-name-span">{book.authorName}</span>
									<div className="rating-section">
										<div className="star">
											<svg viewBox="0 0 24 24" role="presentation">
												<g
													stroke="none"
													strokeWidth="1"
													fill="none"
													fillRule="evenodd"
												>
													<path
														className="RatingStar__fill"
														d="M12.4770229,1.34326985 L15.0891563,9.1315756 L23.4968842,9.1315756 C23.7747474,9.1315756 24,9.35682823 24,9.63469143 C24,9.79809886 23.9206399,9.95132779 23.7871766,10.0456121 L16.9959586,14.8432273 L19.5982827,22.6117477 C19.6865419,22.8752212 19.5445026,23.1603569 19.2810291,23.2486161 C19.1293386,23.2994298 18.9625235,23.2750752 18.8316924,23.1830139 L12.0000207,18.3758025 L5.1685337,23.1876292 C4.94136559,23.3476374 4.62749722,23.2931935 4.46748907,23.0660254 C4.37533831,22.9351963 4.35092131,22.7683321 4.4017231,22.616585 L7.00408269,14.8432273 L0.212864685,10.0456121 C-0.0140805533,9.88528803 -0.0680876559,9.57134421 0.0922364448,9.34439897 C0.186520784,9.21093568 0.339749724,9.1315756 0.503157148,9.1315756 L8.910885,9.1315756 L11.5230185,1.34326985 C11.6113744,1.0798288 11.8965622,0.937894292 12.1600033,1.02625024 C12.3095218,1.07639751 12.4268756,1.19375135 12.4770229,1.34326985 Z"
													></path>
												</g>
											</svg>
										</div>
										<span className="rating-span">
											{book.rating.toFixed(2)}
										</span>
										<span className="number-of-ratings-span">{`· ${book.numberOfRatings}`}</span>
									</div>
								</a>
							);
						})}
				</div>
			</div>
		) : null;

	const bottomNewsAndInterviewsSection =
		loaded && info.articles.length > 1 ? (
			<div className="bottom-news-and-interviews-section">
				<div className="bottom-news-and-interviews-section-header explore-page-section-header">
					<span className="title-span">News and interviews</span>
					<div className="back-forward-arrows">
						<button
							className="arrow-back-button"
							disabled={articlesSequence === 1}
							onClick={() => setArticlesSequence((previous) => previous - 1)}
						>
							<span className="chevron-span"></span>
						</button>
						<button
							className="arrow-forward-button"
							disabled={
								articlesSequence ===
								Math.ceil((info.articles.length - 1) / articlesPerSequence)
							}
							onClick={() => setArticlesSequence((previous) => previous + 1)}
						>
							<span className="chevron-span"></span>
						</button>
					</div>
				</div>
				<div className="articles-list">
					{info.articles
						.slice(1)
						.filter(
							(_article, index) =>
								index >= (articlesSequence - 1) * articlesPerSequence &&
								index <= articlesSequence * articlesPerSequence - 1
						)
						.map((article, index) => {
							return (
								<a
									className="bottom-article-card"
									href={Firebase.pageGenerator.generateArticlePage(
										article.id,
										article.title
									)}
									key={index}
								>
									<div className="image-container">
										<img src={article.image} alt={article.title} />
									</div>
									<span className="article-title-span">{article.title}</span>
								</a>
							);
						})}
				</div>
				<a
					className="see-all-a"
					href={Firebase.pageGenerator.generateNewsPage()}
				>
					<span>{'More news & interviews'}</span>
					<span className="chevron-span"></span>
				</a>
			</div>
		) : null;

	const mainContent = (
		<div className="explore-page-main-content">
			{topNewsAndInterviewsSection}
			{enjoyedBookSection}
			{readingBookSection}
			{trendingBooksSection}
			{bottomNewsAndInterviewsSection}
		</div>
	);

	return (
		<div className="explore-page">
			<TopBar />
			{mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default ExplorePage;
