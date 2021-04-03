import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';

const UserCompareBooksPage = ({ match }) => {
	const {
		params: { userId },
	} = match;
	const query = new URLSearchParams(useLocation().search);
	const sortFilter = query.get('sort') === 'rating' ? 'rating' : 'popularity';
	const shelf = query.get('shelf') !== null ? query.get('shelf') : 'all';
	const userShelf =
		query.get('user_shelf') !== null ? query.get('user_shelf') : shelf;
	const friendShelf =
		query.get('friend_shelf') !== null ? query.get('friend_shelf') : shelf;
	const [loaded, setLoaded] = useState(false);
	const [userBooksInfo, setUserBooksInfo] = useState({});

	const user = JSON.parse(localStorage.getItem('userState'));
	/*
    userBooksInfo: {
        otherUserId,
        otherUserFirstName,
        otherUserLastName,
        otherUserPronouns,
        loggedInUserBooks: [{
            id,
            rootId,
            title,
            cover,
            status,
            rating,
            popularityScore,
            averageRating,
            authorId,
            authorName,
        }],
        otherUserBooks: [{
            id,
            rootId,
            title,
            cover,
            status,
            rating,
            popularityScore,
            averageRating,
            authorId,
            authorName,
        }],
    },
    */

	const otherUserNumberOfBooks = loaded
		? userBooksInfo.otherUserBooks.length
		: 0;
	const otherUserNumberOfUniqueBooks = loaded
		? userBooksInfo.otherUserBooks.filter(
				(book) =>
					!userBooksInfo.loggedInUserBooks.some(
						(loggedInUserBook) => loggedInUserBook.rootId === book.rootId
					)
		  ).length
		: 0;
	const numberOfBooksInCommon =
		otherUserNumberOfBooks - otherUserNumberOfUniqueBooks;
	const loggedInUserNumberOfBooks = loaded
		? userBooksInfo.loggedInUserBooks.length
		: 0;
	const loggedInUserNumberOfUniqueBooks =
		loggedInUserNumberOfBooks - numberOfBooksInCommon;
	const percentageOfLoggedInUserBooksInCommon =
		loggedInUserNumberOfBooks !== 0
			? numberOfBooksInCommon / loggedInUserNumberOfBooks
			: 0;
	const percentageOfOtherUserBooksInCommon =
		otherUserNumberOfBooks !== 0
			? numberOfBooksInCommon / otherUserNumberOfBooks
			: 0;

	const booksInCommon = loaded
		? userBooksInfo.otherUserBooks
				.filter(
					(book) =>
						userBooksInfo.loggedInUserBooks.some(
							(loggedInUserBook) =>
								loggedInUserBook.rootId === book.rootId &&
								loggedInUserBook.rating !== undefined &&
								loggedInUserBook.rating !== 0
						) &&
						book.rating !== undefined &&
						book.rating !== 0
				)
				.map((book) => book.rootId)
		: [];
	const similarityOfTastesIndex = loaded
		? booksInCommon
				.map((book) => {
					const loggedInUserBook = userBooksInfo.loggedInUserBooks.filter(
						(b) => b.rootId === book.rootId
					)[0];
					const otherUserBook = userBooksInfo.otherUserBooks.filter(
						(b) => b.rootId === book.rootId
					)[0];

					return (
						100 - Math.abs(loggedInUserBook.rating - otherUserBook.rating) * 25
					);
				})
				.reduce(
					(previous, current) => previous + current / booksInCommon.length,
					0
				)
		: 0;

	const pageHeader = loaded ? (
		<h1 className="user-compare-books-page-header">
			<a
				href={Firebase.pageGenerator.generateUserPage(
					userBooksInfo.otherUserId,
					userBooksInfo.otherUserFirstName
				)}
			>
				{userBooksInfo.otherUserLastName !== undefined
					? userBooksInfo.otherUserFirstName +
					  ' ' +
					  userBooksInfo.otherUserLastName
					: userBooksInfo.otherUserFirstName}
			</a>
			<span>{' > Compare Books'}</span>
		</h1>
	) : null;

	const comparisonChartSection = loaded ? (
		<div className="user-compare-books-page-comparison-chart-section">
			<div className="top-section">
				<img
					src={`https://chart.googleapis.com/chart?cht=v&chs=200x100&chd=t:${otherUserNumberOfBooks},${loggedInUserNumberOfBooks},0,${numberOfBooksInCommon}&chds=0,${Math.max(
						otherUserNumberOfBooks,
						loggedInUserNumberOfBooks
					)}&chco=66bb66,6666bb`}
					alt="Comparison Chart"
				/>
				<div className="chart-explanation-area">
					<div className="other-user">
						<div className="other-user-chart-color-block"></div>
						<span>
							<span>{`${userBooksInfo.otherUserFirstName}'s books: ${otherUserNumberOfBooks} (`}</span>
							<a
								href={Firebase.pageGenerator.generateUserReviewsPage(userId)}
							>{`${otherUserNumberOfUniqueBooks}`}</a>
							<span>not in common)</span>
						</span>
					</div>
					<div className="books-in-common">
						<div className="books-in-common-chart-color-block"></div>
						<span>{`Books in common: ${numberOfBooksInCommon} (${percentageOfLoggedInUserBooksInCommon}% of your library and ${percentageOfOtherUserBooksInCommon}% of ${userBooksInfo.otherUserPronouns} library)`}</span>
					</div>
					<div className="logged-in-user">
						<div className="logged-in-user-chart-color-block"></div>
						<span>
							<span>{`My books: ${loggedInUserNumberOfBooks} (`}</span>
							<a
								href={Firebase.pageGenerator.generateUserReviewsPage(
									user.userUID
								)}
							>{`${loggedInUserNumberOfUniqueBooks}`}</a>
							<span>not in common)</span>
						</span>
					</div>
				</div>
			</div>
		</div>
	) : null;
};

export default UserCompareBooksPage;
