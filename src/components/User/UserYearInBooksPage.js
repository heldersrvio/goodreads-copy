import React, { useState, useEffect } from 'react';
import Firebase from '../../Firebase';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import { trackPromise } from 'react-promise-tracker';
import '../styles/User/UserYearInBooksPage.css';

const UserYearInBooksPage = ({ match }) => {
	const {
		params: { year, pageId },
	} = match;
	const userId = pageId.split('-')[0];
	const userFirstName =
		pageId.split('-')[1].charAt(0).toUpperCase() +
		pageId.split('-')[1].slice(1);
	const numberYear = Number.parseInt(year);
	const isCurrentYear = new Date().getFullYear() === numberYear;
	const [books, setBooks] = useState([]);
	const [userProfilePicture, setUserProfilePicture] = useState(null);
	const [loaded, setLoaded] = useState(false);
	const user = JSON.parse(localStorage.getItem('userState'));

	useEffect(() => {
		const loadInfo = async () => {
			setBooks(
				await trackPromise(
					Firebase.getUserInfoForYearInBooksPage(userId, numberYear)
				)
			);
			setUserProfilePicture(
				await trackPromise(Firebase.getUserProfilePicture(userId))
			);
			setLoaded(true);
		};

		loadInfo();
	}, [userId, numberYear]);

	const shortestBook = books.reduce(
		(previous, current) =>
			previous === null || previous.pageCount > current.pageCount
				? current
				: previous,
		null
	);
	const longestBook = books.reduce(
		(previous, current) =>
			previous === null || previous.pageCount < current.pageCount
				? current
				: previous,
		null
	);
	const averageLength = Math.round(
		books.reduce(
			(previous, current) =>
				books.length === 0 ? 0 : previous + current.pageCount / books.length,
			0
		)
	);

	const mostPopularBook = books.reduce(
		(previous, current) =>
			previous === null || previous.numberShelved < current.numberShelved
				? current
				: previous,
		null
	);
	const leastPopularBook = books.reduce(
		(previous, current) =>
			previous === null || previous.numberShelved > current.numberShelved
				? current
				: previous,
		null
	);

	const userAverageRating = books
		.reduce(
			(previous, current) =>
				books.length === 0
					? 0
					: current.userRating === undefined
					? previous
					: previous +
					  current.userRating /
							books.filter((book) => book.userRating !== undefined).length,
			0
		)
		.toFixed(1);

	const highestRatedBook = books.reduce(
		(previous, current) =>
			previous === null || previous.averageRating < current.averageRating
				? current
				: previous,
		null
	);

	const booksSortedByRating = books.sort((a, b) =>
		a.userRating > b.userRating ? -1 : 1
	);

	const overallStatsSection = loaded ? (
		<div className="user-year-in-books-overall-stats">
			<div className="user-year-in-books-overall-stats-top">
				<a
					href={Firebase.pageGenerator.generateUserYearInBooksPage(
						numberYear - 1,
						userId,
						userFirstName
					)}
				>
					Go to previous year
				</a>
				{!isCurrentYear ? (
					<a
						href={Firebase.pageGenerator.generateUserYearInBooksPage(
							numberYear + 1,
							userId,
							userFirstName
						)}
					>
						Go to next year
					</a>
				) : null}
			</div>
			<div className="user-year-in-books-image-and-title">
				<span className="year-span">{year}</span>
				<img
					src="https://s.gr-assets.com/assets/yyib/hero_desktop_2021@2x-2075d93f13d7007160228ce5e23000a7.png"
					alt="Open book"
				/>
			</div>
			<div className="bottom-section">
				<div className="top-half">
					<span className="stat">
						<span className="number">
							{books.reduce(
								(previous, current) => previous + current.pageCount,
								0
							)}
						</span>{' '}
						pages read
					</span>
					<div className="profile-info">
						<a
							className="profile-a"
							href={Firebase.pageGenerator.generateUserPage(
								userId,
								userFirstName !== undefined ? userFirstName : ''
							)}
						>
							<img
								alt="profile"
								src={
									userProfilePicture !== undefined &&
									userProfilePicture !== null
										? userProfilePicture
										: 'https://www.goodreads.com/assets/nophoto/user/u_60x60-267f0ca0ea48fd3acfd44b95afa64f01.png'
								}
							></img>
						</a>
						{userFirstName !== undefined ? (
							<a
								className="profile-name-a"
								href={Firebase.pageGenerator.generateUserPage(
									userId,
									userFirstName
								)}
							>
								{userFirstName}
							</a>
						) : null}
					</div>
					<span className="stat">
						<span className="number">{books.length}</span> books read
					</span>
				</div>
				{books.length !== 0 ? (
					<div className="bottom-half">
						<div className="longest-shortest-section book-and-info-wrapper">
							<div className="book-and-info">
								<a
									className="book-and-info-a"
									href={Firebase.pageGenerator.generateBookPage(
										shortestBook.bookId,
										shortestBook.title
									)}
								>
									<img src={shortestBook.cover} alt={shortestBook.title} />
								</a>
								<div className="info">
									<span className="small-text">Shortest Book</span>
									<span className="big-text">{shortestBook.pageCount}</span>
									<span className="medium-text">pages</span>
								</div>
							</div>
							<div className="book-and-info">
								<a
									className="book-and-info-a"
									href={Firebase.pageGenerator.generateBookPage(
										longestBook.bookId,
										longestBook.title
									)}
								>
									<img src={longestBook.cover} alt={longestBook.title} />
								</a>
								<div className="info">
									<span className="small-text">Shortest Book</span>
									<span className="big-text">{longestBook.pageCount}</span>
									<span className="medium-text">pages</span>
								</div>
							</div>
						</div>
						<div className="book-length-section">
							<span className="average-length-span">
								Average book length in {year}
							</span>
							<span className="number-pages">
								<span className="number">{averageLength}</span>
								<span className="pages">pages</span>
							</span>
						</div>
						<div className="most-least-popular-section book-and-info-wrapper">
							<div className="book-and-info">
								<a
									className="book-and-info-a"
									href={Firebase.pageGenerator.generateBookPage(
										mostPopularBook.bookId,
										mostPopularBook.title
									)}
								>
									<img
										src={mostPopularBook.cover}
										alt={mostPopularBook.title}
									/>
								</a>
								<div className="info">
									<span className="small-text">Most Popular</span>
									<span className="big-text">
										{mostPopularBook.numberShelved - 1}
									</span>
									<span className="medium-text">people also shelved</span>
								</div>
							</div>
							<div className="book-and-info">
								<a
									className="book-and-info-a"
									href={Firebase.pageGenerator.generateBookPage(
										leastPopularBook.bookId,
										leastPopularBook.title
									)}
								>
									<img
										src={leastPopularBook.cover}
										alt={leastPopularBook.title}
									/>
								</a>
								<div className="info">
									<span className="small-text">Least Popular</span>
									<span className="big-text">
										{leastPopularBook.numberShelved - 1}
									</span>
									<span className="medium-text">people also shelved</span>
								</div>
							</div>
						</div>
						<div className="average-rating-section">
							<span className="average-rating-span">
								{user.userUID === userId ? 'My' : `${userFirstName}'s`} average
								rating for {year}
							</span>
							<span className="stars-rating">
								<div className="rating-stars">
									<div
										className={
											userAverageRating >= 1
												? 'static-star large full'
												: userAverageRating >= 0.5
												? 'static-star large almost-full'
												: userAverageRating > 0
												? 'static-star large almost-empty'
												: 'static-star large empty'
										}
									></div>
									<div
										className={
											userAverageRating >= 2
												? 'static-star large full'
												: userAverageRating >= 1.5
												? 'static-star large almost-full'
												: userAverageRating > 1
												? 'static-star large almost-empty'
												: 'static-star large empty'
										}
									></div>
									<div
										className={
											userAverageRating >= 3
												? 'static-star large full'
												: userAverageRating >= 2.5
												? 'static-star large almost-full'
												: userAverageRating > 2
												? 'static-star large almost-empty'
												: 'static-star large empty'
										}
									></div>
									<div
										className={
											userAverageRating >= 4
												? 'static-star large full'
												: userAverageRating >= 3.5
												? 'static-star large almost-full'
												: userAverageRating > 3
												? 'static-star large almost-empty'
												: 'static-star large empty'
										}
									></div>
									<div
										className={
											userAverageRating >= 5
												? 'static-star large full'
												: userAverageRating >= 4.5
												? 'static-star large almost-full'
												: userAverageRating > 4
												? 'static-star large almost-empty'
												: 'static-star large empty'
										}
									></div>
								</div>
								<span className="rating">{userAverageRating}</span>
							</span>
						</div>
						<div className="highest-rated-section">
							<a
								className="book-and-info-a"
								href={Firebase.pageGenerator.generateBookPage(
									highestRatedBook.bookId,
									highestRatedBook.title
								)}
							>
								<img
									src={highestRatedBook.cover}
									alt={highestRatedBook.title}
								/>
							</a>
							<div className="highest-rated-info">
								<span className="highest-rated-span">
									Highest Rated on Goodreads
								</span>
								<span className="stars-rating">
									<div className="rating-stars">
										<div
											className={
												highestRatedBook.averageRating >= 1
													? 'static-star large full'
													: highestRatedBook.averageRating >= 0.5
													? 'static-star large almost-full'
													: highestRatedBook.averageRating > 0
													? 'static-star large almost-empty'
													: 'static-star large empty'
											}
										></div>
										<div
											className={
												highestRatedBook.averageRating >= 2
													? 'static-star large full'
													: highestRatedBook.averageRating >= 1.5
													? 'static-star large almost-full'
													: highestRatedBook.averageRating > 1
													? 'static-star large almost-empty'
													: 'static-star large empty'
											}
										></div>
										<div
											className={
												highestRatedBook.averageRating >= 3
													? 'static-star large full'
													: highestRatedBook.averageRating >= 2.5
													? 'static-star large almost-full'
													: highestRatedBook.averageRating > 2
													? 'static-star large almost-empty'
													: 'static-star large empty'
											}
										></div>
										<div
											className={
												highestRatedBook.averageRating >= 4
													? 'static-star large full'
													: highestRatedBook.averageRating >= 3.5
													? 'static-star large almost-full'
													: highestRatedBook.averageRating > 3
													? 'static-star large almost-empty'
													: 'static-star large empty'
											}
										></div>
										<div
											className={
												highestRatedBook.averageRating >= 5
													? 'static-star large full'
													: highestRatedBook.averageRating >= 4.5
													? 'static-star large almost-full'
													: highestRatedBook.averageRating > 4
													? 'static-star large almost-empty'
													: 'static-star large empty'
											}
										></div>
									</div>
									<span className="rating-average">
										{highestRatedBook.averageRating.toFixed(2)} average
									</span>
								</span>
							</div>
						</div>
						<div className="all-books-section">
							<span className="my-books-span">{`My ${year} Books`}</span>
							<div className="top-section">
								<a
									className="book-and-info-a"
									href={Firebase.pageGenerator.generateBookPage(
										booksSortedByRating[0].bookId,
										booksSortedByRating[0].title
									)}
								>
									<img
										src={booksSortedByRating[0].cover}
										alt={booksSortedByRating[0].title}
									/>
								</a>
								{booksSortedByRating.length > 1 ? (
									<div className="other-top-books">
										{booksSortedByRating.slice(1, 5).map((book) => {
											return (
												<a
													key={book.bookId}
													className="book-and-info-a"
													href={Firebase.pageGenerator.generateBookPage(
														book.bookId,
														book.title
													)}
												>
													<img src={book.cover} alt={book.title} />
												</a>
											);
										})}
									</div>
								) : null}
							</div>
							{booksSortedByRating.length > 5 ? (
								<div className="bottom-section">
									{booksSortedByRating.slice(5).map((book) => {
										return (
											<a
												className="book-and-info-a"
												key={book.bookId}
												href={Firebase.pageGenerator.generateBookPage(
													book.bookId,
													book.title
												)}
											>
												<img src={book.cover} alt={book.title} />
											</a>
										);
									})}
								</div>
							) : null}
						</div>
					</div>
				) : null}
				{userId === user.userUID ? (
					<div className="missing-books-section">
						<span className="missing-books-span">Missing books?</span>
						<span className="missing-books-message">
							You can easily add books to this list by setting{' '}
							<strong>“Date Read”</strong> for each book to any time in{' '}
							<strong>{year}</strong>. Are you re-reading? That counts too!
						</span>
						<a
							className="missing-books-a"
							href={Firebase.pageGenerator.generateUserShelfPage(
								userId,
								userFirstName,
								['all']
							)}
						>
							Go to My Books
						</a>
					</div>
				) : null}
			</div>
		</div>
	) : null;

	const bookStatsSection = <div></div>;

	const myBooks = <div></div>;

	const mainContent = loaded ? (
		<div className="user-year-in-books-page-main-content">
			{overallStatsSection}
			{bookStatsSection}
			{myBooks}
		</div>
	) : null;

	return (
		<div className="user-year-in-books-page">
			<TopBar />
			{mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default UserYearInBooksPage;
