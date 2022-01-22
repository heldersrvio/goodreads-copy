import React, { useState, useEffect } from 'react';
import Firebase from '../../Firebase';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import { trackPromise } from 'react-promise-tracker';
import '../styles/User/UserYearInBooksPage.css';

const UserYearInBooksPage = ({ match }) => {
	const {
		params: { year, userId },
	} = match;
	const numberYear = Number.parseInt(year);
	const isCurrentYear = new Date().getFullYear() === numberYear;
	const [books, setBooks] = useState([]);
	const [loaded, setLoaded] = useState(false);
	const user = JSON.parse(localStorage.getItem('userState'));

	useEffect(() => {
		const loadInfo = async () => {
			setBooks(
				await trackPromise(Firebase.getUserInfoForYearInBooksPage(userId))
			);
			setLoaded(true);
		};

		loadInfo();
	}, [userId]);

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

	const overallStatsSection = loaded ? (
		<div className="user-year-in-books-overall-stats">
			<div className="user-year-in-books-overall-stats-top">
				<a
					href={Firebase.pageGenerator.generateUserYearInBooksPage(
						numberYear - 1,
						userId
					)}
				>
					Go to previous year
				</a>
				{!isCurrentYear ? (
					<a
						href={Firebase.pageGenerator.generateUserYearInBooksPage(
							numberYear + 1,
							userId
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
								user.userInfo.firstName !== undefined
									? user.userInfo.firstName
									: ''
							)}
						>
							<img
								alt="profile"
								src={
									user.userInfo !== undefined &&
									user.userInfo.profileImage !== undefined
										? user.userInfo.profileImage
										: 'https://www.goodreads.com/assets/nophoto/user/u_60x60-267f0ca0ea48fd3acfd44b95afa64f01.png'
								}
							></img>
						</a>
						{user.userInfo.firstName !== undefined ? (
							<a
								className="profile-name-a"
								href={Firebase.pageGenerator.generateUserPage(
									userId,
									user.userInfo.firstName !== undefined
										? user.userInfo.firstName
										: ''
								)}
							>
								{user.userInfo.firstName}
							</a>
						) : null}
					</div>
					<span className="stat">
						<span className="number">{books.length}</span> books read
					</span>
				</div>
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
							<img src={mostPopularBook.cover} alt={mostPopularBook.title} />
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
							<img src={leastPopularBook.cover} alt={leastPopularBook.title} />
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
						My average rating for {year}
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
