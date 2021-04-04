import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';
import '../styles/User/UserCompareBooksPage.css';

// TODO: distinguishing unrated/rated books in common, filter by shelf messages and functionality and no books added message

const UserCompareBooksPage = ({ match }) => {
	const {
		params: { userId },
	} = match;
	const history = useHistory();
	const query = new URLSearchParams(useLocation().search);
	const sortFilter = query.get('sort') === 'rating' ? 'rating' : 'popularity';
	const shelf = query.get('shelf') !== null ? query.get('shelf') : 'all';
	const userShelf =
		query.get('user_shelf') !== null ? query.get('user_shelf') : shelf;
	const friendShelf =
		query.get('friend_shelf') !== null ? query.get('friend_shelf') : shelf;
	const [loaded, setLoaded] = useState(false);
	const [userBooksInfo, setUserBooksInfo] = useState({});
	const [sortExplanationPopupHidden, setSortExplanationPopupHidden] = useState(
		true
	);
	const [otherUserUnratedBooksIndex, setOtherUserUnratedBooksIndex] = useState(
		0
	);
	const [unratedBookRating, setUnratedBookRating] = useState(0);
	const [reviewShowMore, setReviewShowMore] = useState(false);

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
            bookshelves,
            review,
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
            bookshelves,
            review,
        }],
    },
    */

	useEffect(() => {
		const userBooksObject = {
			otherUserId: '123',
			otherUserFirstName: 'Mark',
			otherUserLastName: 'Coleman',
			otherUserPronouns: 'his',
			loggedInUserBooks: [
				{
					id: '123',
					rootId: '1',
					title: 'Il cavaliere del sole nero',
					cover:
						'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1437435124l/36159._SY475_.jpg',
					status: 'read',
					rating: 4,
					popularityScore: 20,
					averageRating: 3.5,
					authorId: '123',
					authorName: 'C.S. Friedman',
					bookshelves: ['fantasy', 'science-fiction'],
				},
				{
					id: '123',
					rootId: '2',
					title: 'Thirteen',
					cover:
						'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1505068558l/36217425._SY475_.jpg',
					status: 'read',
					rating: 3,
					popularityScore: 243,
					averageRating: 3.98,
					authorId: '123',
					authorName: 'Steve Cavanagh',
					bookshelves: ['thriller', 'mystery'],
				},
				{
					id: '123',
					rootId: '3',
					title: 'Airman',
					cover:
						'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1327967233l/2049993.jpg',
					status: 'read',
					rating: 4,
					popularityScore: 45,
					averageRating: 3.0,
					authorId: '123',
					authorName: 'Eoin Colfer',
					bookshelves: ['science-fiction', 'steampunk'],
				},
				{
					id: '123',
					rootId: '4',
					title: 'The Wives',
					cover:
						'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1555189290l/43263004.jpg',
					status: 'reading',
					popularityScore: 18,
					averageRating: 4.4,
					authorId: '123',
					authorName: 'Tarryn Fisher',
					bookshelves: ['adult', 'romance'],
				},
				{
					id: '123',
					rootId: '1',
					title:
						'Restoring the Soul of Business: Staying Human in the Age of Data',
					cover:
						'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1562426921l/44442008.jpg',
					status: 'to-read',
					popularityScore: 2,
					averageRating: 3.5,
					authorId: '123',
					authorName: 'Rishad T.',
					bookshelves: ['business', 'non-fiction'],
				},
			],
			otherUserBooks: [
				{
					id: '123',
					rootId: '2',
					title: 'Thirteen',
					cover:
						'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1505068558l/36217425._SY475_.jpg',
					status: 'read',
					rating: 1,
					popularityScore: 243,
					averageRating: 3.98,
					authorId: '123',
					authorName: 'Steve Cavanagh',
					bookshelves: ['thriller', 'mystery'],
				},
				{
					id: '123',
					rootId: '3',
					title: 'Airman',
					cover:
						'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1327967233l/2049993.jpg',
					status: 'read',
					rating: 5,
					popularityScore: 45,
					averageRating: 3.0,
					authorId: '123',
					authorName: 'Eoin Colfer',
					bookshelves: ['science-fiction', 'steampunk'],
				},
				{
					id: '123',
					rootId: '6',
					title: 'The Chain',
					cover:
						'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1601216004l/42779092._SY475_.jpg',
					rating: 5,
					popularityScore: 30,
					averageRating: 4.3,
					authorId: '123',
					authorName: 'Adrian McKinty',
					bookshelves: ['mystery', 'thriller', 'baseball'],
					review: `
					This book needs a seat belt because it blasts off at some serious speed. The opening chapters are shocking and the principle of The Chain is completely unique and deeply unsettling. Rachel Klein is a divorced single mother, with a 13-year-old daughter, Kylie. She has just been appointed to a new job and hopes that her life can take a step forward, especially with her battle against breast cancer being in remission for a year. Then the ultimate horror is just about to unfold.\n
					The stranger explains that Kylie has been kidnapped and that there will be a call shortly that she must be ready for. The second call comes from an anxious woman who explains there are a number of parts and instructions that must be followed exactly or Kylie dies. First Rachel must pay twenty-five thousand dollars in ransom through a bitcoin exchange on the dark web or Kylie dies. For the second part, the woman explains that she has kidnapped Kylie so her son could be released. Her instruction is to kidnap someone to replace her daughter on The Chain, or Kylie dies. If Rachel breaks the rules her daughter will die and the kidnappers will move to another target or their own son will die. What a terrifying concept – I was stunned and impressed, shocked and fascinated, and afraid.
					`,
				},
				{
					id: '123',
					rootId: '7',
					title: 'The Family Upstairs',
					cover:
						'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1564517337l/43822820.jpg',
					rating: 4,
					popularityScore: 10,
					averageRating: 3.6,
					authorId: '123',
					authorName: 'Lisa Jewell',
					bookshelves: ['mystery', 'thriller', 'western'],
					review: `
					3.25 confused, restless, is it fair enough to give lower points because you’re die-hard fan of Lisa Jewell fan question flying over my head, creepy, oh those guests should urgently get the hell out of the house stars!\n
					Personally, honestly, I love this author’s work starting from “Watching you”, “Then she was gone”, “I found you”. She is the master evil queen of thrillers taken place in creepy houses and the characters formed in dysfunctional families who have unresolved issues.\n
					So this book is one of them. I enjoyed the prologue. I felt all the goose-bumps on my arm, sweat dripping down my forearm, shivered uncontrollably. My intellectual appetite increased and my level of curiosity hit to the top.\n
					Plot was intriguing: Unwanted and never-leaving guests occupied house and their numbers increased every day till they completely turned into an ominous, cursed and chilling cult, whose members wear ugly shapeless black clothes, chose organic style diet by famishing children. And we met David and Birdie, they’re one of the creepiest couples as like Natural Born Killer’s “Mickey and Mallory”, or any adopted children of Woody Allen and him.
					`,
				},
			],
		};
		setUserBooksInfo(userBooksObject);
		setLoaded(true);
	}, []);

	useEffect(() => {
		if (userBooksInfo.loggedInUserBooks !== undefined) {
			setUnratedBookRating(
				userBooksInfo.otherUserBooks.filter(
					(book, index) =>
						index < 20 &&
						!userBooksInfo.loggedInUserBooks.some(
							(b) => b.rootId === book.rootId
						) &&
						book.rating !== 0 &&
						book.rating !== undefined
				)[otherUserUnratedBooksIndex].rating
			);
		}
	}, [otherUserUnratedBooksIndex, userBooksInfo]);

	const loggedInUserBookshelves = loaded
		? userBooksInfo.loggedInUserBooks.reduce((previous, current) => {
				current.bookshelves.forEach((bookshelf) => {
					if (!previous.includes(bookshelf)) {
						previous.push(bookshelf);
					}
				});
				return previous;
		  }, [])
		: [];
	const otherUserBookshelves = loaded
		? userBooksInfo.otherUserBooks.reduce((previous, current) => {
				current.bookshelves.forEach((bookshelf) => {
					if (!previous.includes(bookshelf)) {
						previous.push(bookshelf);
					}
				});
				return previous;
		  }, [])
		: [];
	const commonShelves = loggedInUserBookshelves.filter((bookshelf) =>
		otherUserBookshelves.includes(bookshelf)
	);

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
				.filter((rootId) => {
					const loggedInUserBook = userBooksInfo.loggedInUserBooks.filter(
						(b) => b.rootId === rootId
					)[0];
					const otherUserBook = userBooksInfo.otherUserBooks.filter(
						(b) => b.rootId === rootId
					)[0];
					return (
						loggedInUserBook.rating !== undefined &&
						otherUserBook.rating !== undefined
					);
				})
				.map((rootId) => {
					const loggedInUserBook = userBooksInfo.loggedInUserBooks.filter(
						(b) => b.rootId === rootId
					)[0];
					const otherUserBook = userBooksInfo.otherUserBooks.filter(
						(b) => b.rootId === rootId
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
	const unratedBooksFromOtherUser = loaded
		? userBooksInfo.otherUserBooks.filter(
				(book, index) =>
					index < 20 &&
					!booksInCommon.includes(book.rootId) &&
					book.rating !== 0 &&
					book.rating !== undefined
		  )
		: [];

	const rateBook = async (bookObject, rating) => {
		if (bookObject.id !== undefined) {
			await Firebase.rateBook(user.userUID, bookObject.id, rating, history);
			setUserBooksInfo((previous) => {
				return {
					...previous,
					loggedInUserBooks: previous.loggedInUserBooks.concat({
						...bookObject,
						rating,
						status: 'read',
					}),
				};
			});
		}
	};

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
							>{`${otherUserNumberOfUniqueBooks} `}</a>
							<span>not in common)</span>
						</span>
					</div>
					<div className="books-in-common">
						<div className="books-in-common-chart-color-block"></div>
						<span>{`Books in common: ${numberOfBooksInCommon} (${
							percentageOfLoggedInUserBooksInCommon * 100
						}% of your library and ${
							percentageOfOtherUserBooksInCommon * 100
						}% of ${userBooksInfo.otherUserPronouns} library)`}</span>
					</div>
					<div className="logged-in-user">
						<div className="logged-in-user-chart-color-block"></div>
						<span>
							<span>{`My books: ${loggedInUserNumberOfBooks} (`}</span>
							<a
								href={Firebase.pageGenerator.generateUserReviewsPage(
									user.userUID
								)}
							>{`${loggedInUserNumberOfUniqueBooks} `}</a>
							<span>not in common)</span>
						</span>
					</div>
				</div>
			</div>
			<div className="bottom-section">
				<span>{`Your tastes are ${similarityOfTastesIndex}% similar for the books you both rated.`}</span>
				<div className="sort-area">
					<label htmlFor="sort">sort</label>
					<select
						name="sort"
						value={sortFilter}
						onChange={(e) =>
							history.push({
								pathname: Firebase.pageGenerator.generateUserCompareBooksPage(
									userId
								),
								search: `?sort=${e.target.value}&user_shelf=${userShelf}&friend_shelf=${friendShelf}`,
							})
						}
					>
						<option>inverse popularity</option>
						<option>rating</option>
					</select>
					<button
						onClick={(_e) =>
							setSortExplanationPopupHidden((previous) => !previous)
						}
					>
						(?)
					</button>
					<div
						className={
							sortExplanationPopupHidden
								? 'sort-explanation-popup hidden'
								: 'sort-explanation-popup'
						}
					>
						<div className="left-tip"></div>
						<div className="title-area">
							<span>
								<b>about sorts</b>
							</span>
							<button
								className="close-button"
								onClick={(_e) => setSortExplanationPopupHidden(true)}
							></button>
						</div>
						<div className="explanation">
							<span>
								<b>inverse popularity</b>
							</span>
							<p>
								Sort by the number of times the book has been added by people on
								Goodreads in descending order. Seeing the uncommon books you
								have in common with someone can be revealing!
							</p>
							<span>
								<b>rating</b>
							</span>
							<p>Sort by the other person's rating in descending order.</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	) : null;

	const booksInCommonTable = loaded ? (
		<table className="books-in-common-table">
			<thead>
				<tr className="top-row">
					<th width="70%">book title</th>
					<th width="15%">{`${userBooksInfo.otherUserFirstName}'s rating`}</th>
					<th width="15%">my rating</th>
				</tr>
			</thead>
			<tbody>
				{booksInCommon.map((rootId, index) => {
					const loggedInUserBook = userBooksInfo.loggedInUserBooks.filter(
						(book) => book.rootId === rootId
					)[0];
					const otherUserBook = userBooksInfo.otherUserBooks.filter(
						(book) => book.rootId === rootId
					)[0];
					return (
						<tr className="book-info-row" key={index}>
							<td width="70%">
								<div className="book-title-area">
									<a
										className="book-cover-a"
										href={Firebase.pageGenerator.generateBookPage(
											loggedInUserBook.id,
											loggedInUserBook.title
										)}
									>
										<img
											src={
												loggedInUserBook.cover !== undefined
													? loggedInUserBook.cover
													: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png'
											}
											alt={loggedInUserBook.title}
										/>
									</a>
									<div className="book-title-and-authorship">
										<a
											className="book-title-a"
											href={Firebase.pageGenerator.generateBookPage(
												loggedInUserBook.id,
												loggedInUserBook.title
											)}
										>
											{loggedInUserBook.title}
										</a>
										<span className="authorship-span">
											<span>by </span>
											<a
												className="book-author-a"
												href={Firebase.pageGenerator.generateAuthorPage(
													loggedInUserBook.authorId,
													loggedInUserBook.authorName
												)}
											>
												{loggedInUserBook.authorName}
											</a>
										</span>
									</div>
								</div>
							</td>
							<td width="15%">
								{otherUserBook.rating !== 0 &&
								otherUserBook.rating !== undefined ? (
									<div className="rating-stars">
										<div
											className={
												otherUserBook.rating >= 1
													? 'static-star small full'
													: otherUserBook.rating >= 0.5
													? 'static-star small almost-full'
													: otherUserBook.rating > 0
													? 'static-star small almost-empty'
													: 'static-star small empty'
											}
										></div>
										<div
											className={
												otherUserBook.rating >= 2
													? 'static-star small full'
													: otherUserBook.rating >= 1.5
													? 'static-star small almost-full'
													: otherUserBook.rating > 1
													? 'static-star small almost-empty'
													: 'static-star small empty'
											}
										></div>
										<div
											className={
												otherUserBook.rating >= 3
													? 'static-star small full'
													: otherUserBook.rating >= 2.5
													? 'static-star small almost-full'
													: otherUserBook.rating > 2
													? 'static-star small almost-empty'
													: 'static-star small empty'
											}
										></div>
										<div
											className={
												otherUserBook.rating >= 4
													? 'static-star small full'
													: otherUserBook.rating >= 3.5
													? 'static-star small almost-full'
													: otherUserBook.rating > 3
													? 'static-star small almost-empty'
													: 'static-star small empty'
											}
										></div>
										<div
											className={
												otherUserBook.rating >= 5
													? 'static-star small full'
													: otherUserBook.rating >= 4.5
													? 'static-star small almost-full'
													: otherUserBook.rating > 4
													? 'static-star small almost-empty'
													: 'static-star small empty'
											}
										></div>
									</div>
								) : null}
							</td>
							<td width="15%">
								{loggedInUserBook.rating !== 0 &&
								loggedInUserBook.rating !== undefined ? (
									<div className="rating-stars">
										<div
											className={
												loggedInUserBook.rating >= 1
													? 'static-star small full'
													: loggedInUserBook.rating >= 0.5
													? 'static-star small almost-full'
													: loggedInUserBook.rating > 0
													? 'static-star small almost-empty'
													: 'static-star small empty'
											}
										></div>
										<div
											className={
												loggedInUserBook.rating >= 2
													? 'static-star small full'
													: loggedInUserBook.rating >= 1.5
													? 'static-star small almost-full'
													: loggedInUserBook.rating > 1
													? 'static-star small almost-empty'
													: 'static-star small empty'
											}
										></div>
										<div
											className={
												loggedInUserBook.rating >= 3
													? 'static-star small full'
													: loggedInUserBook.rating >= 2.5
													? 'static-star small almost-full'
													: loggedInUserBook.rating > 2
													? 'static-star small almost-empty'
													: 'static-star small empty'
											}
										></div>
										<div
											className={
												loggedInUserBook.rating >= 4
													? 'static-star small full'
													: loggedInUserBook.rating >= 3.5
													? 'static-star small almost-full'
													: loggedInUserBook.rating > 3
													? 'static-star small almost-empty'
													: 'static-star small empty'
											}
										></div>
										<div
											className={
												loggedInUserBook.rating >= 5
													? 'static-star small full'
													: loggedInUserBook.rating >= 4.5
													? 'static-star small almost-full'
													: loggedInUserBook.rating > 4
													? 'static-star small almost-empty'
													: 'static-star small empty'
											}
										></div>
									</div>
								) : null}
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	) : null;

	const rateOtherBooksArea =
		loaded &&
		percentageOfOtherUserBooksInCommon < 100 &&
		unratedBooksFromOtherUser.length > 0 ? (
			<div className="user-compare-books-page-rate-other-books-area">
				<span className="rate-other-books-explanation-span">
					{`See what other books you have in common with ${userBooksInfo.otherUserFirstName}. Rate each book you've read, or click "skip".`}
				</span>
				{otherUserUnratedBooksIndex < unratedBooksFromOtherUser.length ? (
					<div className="rating-section">
						<span className="rate-this-book-title">
							<span>{`#${
								otherUserUnratedBooksIndex + 1
							}. rate this book: `}</span>
							<div className="book-page-rate-book-star-rating">
								<div
									className={
										unratedBookRating > 0
											? 'interactive-star small on'
											: 'interactive-star small'
									}
									title="did not like it"
									onMouseOver={(_e) => setUnratedBookRating(1)}
									onMouseLeave={(_e) =>
										setUnratedBookRating(
											unratedBooksFromOtherUser[otherUserUnratedBooksIndex]
												.rating
										)
									}
									onClick={() =>
										rateBook(
											unratedBooksFromOtherUser[otherUserUnratedBooksIndex],
											1
										)
									}
								></div>
								<div
									className={
										unratedBookRating > 1
											? 'interactive-star small on'
											: 'interactive-star small'
									}
									title="it was ok"
									onMouseOver={(_e) => setUnratedBookRating(2)}
									onMouseLeave={(_e) =>
										setUnratedBookRating(
											unratedBooksFromOtherUser[otherUserUnratedBooksIndex]
												.rating
										)
									}
									onClick={() =>
										rateBook(
											unratedBooksFromOtherUser[otherUserUnratedBooksIndex],
											2
										)
									}
								></div>
								<div
									className={
										unratedBookRating > 2
											? 'interactive-star small on'
											: 'interactive-star small'
									}
									title="liked it"
									onMouseOver={(_e) => setUnratedBookRating(3)}
									onMouseLeave={(_e) =>
										setUnratedBookRating(
											unratedBooksFromOtherUser[otherUserUnratedBooksIndex]
												.rating
										)
									}
									onClick={() =>
										rateBook(
											unratedBooksFromOtherUser[otherUserUnratedBooksIndex],
											3
										)
									}
								></div>
								<div
									className={
										unratedBookRating > 3
											? 'interactive-star small on'
											: 'interactive-star small'
									}
									title="really liked it"
									onMouseOver={(_e) => setUnratedBookRating(4)}
									onMouseLeave={(_e) =>
										setUnratedBookRating(
											unratedBooksFromOtherUser[otherUserUnratedBooksIndex]
												.rating
										)
									}
									onClick={() =>
										rateBook(
											unratedBooksFromOtherUser[otherUserUnratedBooksIndex],
											4
										)
									}
								></div>
								<div
									className={
										unratedBookRating > 4
											? 'interactive-star small on'
											: 'interactive-star small'
									}
									title="it was amazing"
									onMouseOver={(_e) => setUnratedBookRating(5)}
									onMouseLeave={(_e) =>
										setUnratedBookRating(
											unratedBooksFromOtherUser[otherUserUnratedBooksIndex]
												.rating
										)
									}
									onClick={() =>
										rateBook(
											unratedBooksFromOtherUser[otherUserUnratedBooksIndex],
											5
										)
									}
								></div>
							</div>
							<span className="or-span"> or </span>
							<button
								className="skip-button"
								onClick={(_e) =>
									setOtherUserUnratedBooksIndex((previous) => previous + 1)
								}
							>
								skip
							</button>
						</span>
						<div className="book-card">
							<a
								className="book-cover-a"
								href={Firebase.pageGenerator.generateBookPage(
									unratedBooksFromOtherUser[otherUserUnratedBooksIndex].id,
									unratedBooksFromOtherUser[otherUserUnratedBooksIndex].title
								)}
							>
								<img
									src={
										unratedBooksFromOtherUser[otherUserUnratedBooksIndex]
											.cover !== undefined
											? unratedBooksFromOtherUser[otherUserUnratedBooksIndex]
													.cover
											: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png'
									}
									alt={
										unratedBooksFromOtherUser[otherUserUnratedBooksIndex].title
									}
								/>
							</a>
							<div className="right-section">
								<a
									className="book-title-a"
									href={Firebase.pageGenerator.generateBookPage(
										unratedBooksFromOtherUser[otherUserUnratedBooksIndex].id,
										unratedBooksFromOtherUser[otherUserUnratedBooksIndex].title
									)}
								>
									{unratedBooksFromOtherUser[otherUserUnratedBooksIndex].title}
								</a>
								<span className="authorship-span">
									<span>by </span>
									<a
										className="book-author-a"
										href={Firebase.pageGenerator.generateAuthorPage(
											unratedBooksFromOtherUser[otherUserUnratedBooksIndex]
												.authorId,
											unratedBooksFromOtherUser[otherUserUnratedBooksIndex]
												.authorName
										)}
									>
										{
											unratedBooksFromOtherUser[otherUserUnratedBooksIndex]
												.authorName
										}
									</a>
								</span>
								<span className="user-rated-span">
									<span>{`${userBooksInfo.otherUserFirstName} rated it: `}</span>
									<div className="rating-stars">
										<div
											className={
												unratedBooksFromOtherUser[otherUserUnratedBooksIndex]
													.rating >= 1
													? 'static-star small full'
													: unratedBooksFromOtherUser[
															otherUserUnratedBooksIndex
													  ].rating >= 0.5
													? 'static-star small almost-full'
													: unratedBooksFromOtherUser[
															otherUserUnratedBooksIndex
													  ].rating > 0
													? 'static-star small almost-empty'
													: 'static-star small empty'
											}
										></div>
										<div
											className={
												unratedBooksFromOtherUser[otherUserUnratedBooksIndex]
													.rating >= 2
													? 'static-star small full'
													: unratedBooksFromOtherUser[
															otherUserUnratedBooksIndex
													  ].rating >= 1.5
													? 'static-star small almost-full'
													: unratedBooksFromOtherUser[
															otherUserUnratedBooksIndex
													  ].rating > 1
													? 'static-star small almost-empty'
													: 'static-star small empty'
											}
										></div>
										<div
											className={
												unratedBooksFromOtherUser[otherUserUnratedBooksIndex]
													.rating >= 3
													? 'static-star small full'
													: unratedBooksFromOtherUser[
															otherUserUnratedBooksIndex
													  ].rating >= 2.5
													? 'static-star small almost-full'
													: unratedBooksFromOtherUser[
															otherUserUnratedBooksIndex
													  ].rating > 2
													? 'static-star small almost-empty'
													: 'static-star small empty'
											}
										></div>
										<div
											className={
												unratedBooksFromOtherUser[otherUserUnratedBooksIndex]
													.rating >= 4
													? 'static-star small full'
													: unratedBooksFromOtherUser[
															otherUserUnratedBooksIndex
													  ].rating >= 3.5
													? 'static-star small almost-full'
													: unratedBooksFromOtherUser[
															otherUserUnratedBooksIndex
													  ].rating > 3
													? 'static-star small almost-empty'
													: 'static-star small empty'
											}
										></div>
										<div
											className={
												unratedBooksFromOtherUser[otherUserUnratedBooksIndex]
													.rating >= 5
													? 'static-star small full'
													: unratedBooksFromOtherUser[
															otherUserUnratedBooksIndex
													  ].rating >= 4.5
													? 'static-star small almost-full'
													: unratedBooksFromOtherUser[
															otherUserUnratedBooksIndex
													  ].rating > 4
													? 'static-star small almost-empty'
													: 'static-star small empty'
											}
										></div>
									</div>
								</span>
								<span className="bookshelves-span">
									<span>bookshelves: </span>
									{unratedBooksFromOtherUser[
										otherUserUnratedBooksIndex
									].bookshelves.map((bookshelf, index) => {
										return (
											<span
												className="bookshelf-span"
												key={index}
											>{`${bookshelf}, `}</span>
										);
									})}
								</span>
								{unratedBooksFromOtherUser[otherUserUnratedBooksIndex]
									.review !== undefined ? (
									<div className="book-review">
										<span className="review-span">
											{
												unratedBooksFromOtherUser[otherUserUnratedBooksIndex]
													.review
											}
										</span>
										{unratedBooksFromOtherUser[otherUserUnratedBooksIndex]
											.review.length > 500 ? (
											<button
												className="more-less-button"
												onClick={(_e) =>
													setReviewShowMore((previous) => !previous)
												}
											>
												{reviewShowMore ? '(less)' : '...more'}
											</button>
										) : null}
									</div>
								) : null}
							</div>
							<div className="book-index-section">
								<span>{`book ${otherUserUnratedBooksIndex + 1} of ${
									unratedBooksFromOtherUser.length
								}`}</span>
							</div>
						</div>
					</div>
				) : (
					<div className="finished-rating-area">
						<span>{`You have ${numberOfBooksInCommon} books in common with ${userBooksInfo.otherUserFirstName}. Based on these ratings your tastes are ${similarityOfTastesIndex}% similar.`}</span>
						<a
							href={Firebase.pageGenerator.generateUserPage(
								userBooksInfo.otherUserId,
								userBooksInfo.otherUserFirstName
							)}
						>{`back to ${userBooksInfo.otherUserFirstName}'s profile`}</a>
					</div>
				)}
			</div>
		) : null;

	const mainContentLeftSection = (
		<div className="user-compare-books-page-main-content-left-section">
			{pageHeader}
			{comparisonChartSection}
			{booksInCommonTable}
			{rateOtherBooksArea}
		</div>
	);

	const mainContentRightSection = loaded ? (
		<div className="user-compare-books-page-main-content-right-section">
			<a
				href={Firebase.pageGenerator.generateUserPage(
					userBooksInfo.otherUserId,
					userBooksInfo.otherUserFirstName
				)}
			>{`back to ${userBooksInfo.otherUserFirstName}'s profile`}</a>
			<a
				href={Firebase.pageGenerator.generateGiveRecommendationToUserPage(
					userId
				)}
			>{`recommend a book to ${userBooksInfo.otherUserFirstName}`}</a>
			<label htmlFor="common-shelves">common shelves</label>
			<select
				name="common-shelves"
				value={shelf}
				onChange={(e) => {
					history.push({
						pathname: Firebase.pageGenerator.generateUserCompareBooksPage(
							userId
						),
						search: `?sort=${sortFilter}&shelf=${e.target.value}`,
					});
				}}
			>
				<option>all</option>
				<option>read</option>
				<option>currently-reading</option>
				<option>to-read</option>
				{commonShelves.map((shelf, index) => {
					return <option key={index}>{shelf}</option>;
				})}
			</select>
			<label htmlFor="your-shelves">common shelves</label>
			<select
				name="your-shelves"
				value={userShelf}
				onChange={(e) => {
					history.push({
						pathname: Firebase.pageGenerator.generateUserCompareBooksPage(
							userId
						),
						search: `?sort=${sortFilter}&user_shelf=${e.target.value}&friend_shelf=${friendShelf}`,
					});
				}}
			>
				<option>all</option>
				<option>read</option>
				<option>currently-reading</option>
				<option>to-read</option>
				{loggedInUserBookshelves.map((shelf, index) => {
					return <option key={index}>{shelf}</option>;
				})}
			</select>
			<label htmlFor="their-shelves">common shelves</label>
			<select
				name="their-shelves"
				value={friendShelf}
				onChange={(e) => {
					history.push({
						pathname: Firebase.pageGenerator.generateUserCompareBooksPage(
							userId
						),
						search: `?sort=${sortFilter}&user_shelf=${userShelf}&friend_shelf=${e.target.value}`,
					});
				}}
			>
				<option>all</option>
				<option>read</option>
				<option>currently-reading</option>
				<option>to-read</option>
				{otherUserBookshelves.map((shelf, index) => {
					return <option key={index}>{shelf}</option>;
				})}
			</select>
		</div>
	) : null;

	return (
		<div className="user-compare-books-page">
			<TopBar />
			<div className="user-compare-books-page-main-content">
				{mainContentLeftSection}
				{mainContentRightSection}
			</div>
			<HomePageFootBar />
		</div>
	);
};

export default UserCompareBooksPage;
