import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';
import '../styles/User/UserCompareBooksPage.css';
import { trackPromise } from 'react-promise-tracker';

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

	useEffect(() => {
		const getUserBooksInfo = async () => {
			if (user.userUID === userId) {
				history.push({
					pathname: Firebase.pageGenerator.generateUserPage(
						userId,
						user.userInfo.firstName
					),
					state: "You can't compare books with yourself",
				});
			} else {
				const userBooksObject = await trackPromise(
					Firebase.getInfoForCompareBooksPage(user.userUID, userId, history)
				);
				setUserBooksInfo(userBooksObject);
				setLoaded(true);
			}
		};
		getUserBooksInfo();
	}, [user.userUID, userId, history, user.userInfo.firstName]);

	useEffect(() => {
		if (userBooksInfo.loggedInUserBooks !== undefined) {
			const otherUserUnratedBooks = userBooksInfo.otherUserBooks.filter(
				(book, index) =>
					index < 20 &&
					!userBooksInfo.loggedInUserBooks.some(
						(b) => b.rootId === book.rootId
					) &&
					book.rating !== 0 &&
					book.rating !== undefined
			);
			if (otherUserUnratedBooksIndex < otherUserUnratedBooks.length) {
				setUnratedBookRating(
					otherUserUnratedBooks[otherUserUnratedBooksIndex].rating
				);
			}
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

	const otherUserFilteredBooks = loaded
		? userBooksInfo.otherUserBooks.filter(
				(book) =>
					friendShelf === 'all' ||
					book.bookshelves.includes(friendShelf) ||
					book.status === friendShelf
		  )
		: [];
	const loggedInUserFilteredBooks = loaded
		? userBooksInfo.loggedInUserBooks.filter(
				(book) =>
					userShelf === 'all' ||
					book.bookshelves.includes(userShelf) ||
					book.status === userShelf
		  )
		: [];

	const otherUserNumberOfBooks = loaded ? otherUserFilteredBooks.length : 0;
	const otherUserNumberOfUniqueBooks = loaded
		? otherUserFilteredBooks.filter(
				(book) =>
					!loggedInUserFilteredBooks.some(
						(loggedInUserBook) => loggedInUserBook.rootId === book.rootId
					)
		  ).length
		: 0;
	const numberOfBooksInCommon =
		otherUserNumberOfBooks - otherUserNumberOfUniqueBooks;
	const loggedInUserNumberOfBooks = loaded
		? loggedInUserFilteredBooks.length
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

	const allBooksInCommon = loaded
		? otherUserFilteredBooks
				.filter((book) =>
					loggedInUserFilteredBooks.some(
						(loggedInUserBook) => loggedInUserBook.rootId === book.rootId
					)
				)
				.map((book) => book.rootId)
		: [];
	const ratedBooksInCommon = allBooksInCommon.filter((rootId) => {
		const loggedInBookObject = loggedInUserFilteredBooks.filter(
			(loggedInUserBook) => loggedInUserBook.rootId === rootId
		)[0];
		const otherUserBookObject = otherUserFilteredBooks.filter(
			(loggedInUserBook) => loggedInUserBook.rootId === rootId
		)[0];
		return (
			loggedInBookObject.rating !== undefined &&
			loggedInBookObject.rating !== 0 &&
			otherUserBookObject.rating !== undefined &&
			otherUserBookObject.rating !== 0
		);
	});
	const similarityOfTastesIndex = loaded
		? ratedBooksInCommon
				.map((rootId) => {
					const loggedInUserBook = loggedInUserFilteredBooks.filter(
						(b) => b.rootId === rootId
					)[0];
					const otherUserBook = otherUserFilteredBooks.filter(
						(b) => b.rootId === rootId
					)[0];

					return (
						100 - Math.abs(loggedInUserBook.rating - otherUserBook.rating) * 25
					);
				})
				.reduce(
					(previous, current) => previous + current / ratedBooksInCommon.length,
					0
				)
		: 0;
	const unratedBooksFromOtherUser = loaded
		? otherUserFilteredBooks.filter(
				(book, index) =>
					index < 20 &&
					!allBooksInCommon.includes(book.rootId) &&
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
					userId,
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
					{numberOfBooksInCommon !== 0 ? (
						<div className="books-in-common">
							<div className="books-in-common-chart-color-block"></div>
							<span>{`Books in common: ${numberOfBooksInCommon} (${(
								percentageOfLoggedInUserBooksInCommon * 100
							).toFixed(0)}% of your library and ${(
								percentageOfOtherUserBooksInCommon * 100
							).toFixed(0)}% of ${
								userBooksInfo.otherUserPronouns
							} library)`}</span>
						</div>
					) : null}
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
			{numberOfBooksInCommon !== 0 ? (
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
									Sort by the number of times the book has been added by people
									on Goodreads in descending order. Seeing the uncommon books
									you have in common with someone can be revealing!
								</p>
								<span>
									<b>rating</b>
								</span>
								<p>Sort by the other person's rating in descending order.</p>
							</div>
						</div>
					</div>
				</div>
			) : null}
		</div>
	) : null;

	const booksInCommonTable = loaded ? (
		allBooksInCommon.length === 0 ? (
			<span className="no-books-in-common-span">{`You and ${userBooksInfo.otherUserFirstName} don't have any books in common.`}</span>
		) : (
			<table className="books-in-common-table">
				<thead>
					<tr className="top-row">
						<th width="70%">book title</th>
						<th width="15%">{`${userBooksInfo.otherUserFirstName}'s rating`}</th>
						<th width="15%">my rating</th>
					</tr>
				</thead>
				<tbody>
					{allBooksInCommon
						.sort((a, b) => {
							const otherUserBookObjectA = otherUserFilteredBooks.filter(
								(book) => book.rootId === a
							)[0];
							const otherUserBookObjectB = otherUserFilteredBooks.filter(
								(book) => book.rootId === b
							)[0];
							if (sortFilter === 'rating') {
								if (
									otherUserBookObjectA.rating === undefined ||
									otherUserBookObjectA.rating === 0
								) {
									return b;
								} else if (
									otherUserBookObjectB.rating === undefined ||
									otherUserBookObjectB.rating === 0
								) {
									return a;
								} else {
									return (
										otherUserBookObjectB.rating - otherUserBookObjectA.rating
									);
								}
							} else {
								return (
									otherUserBookObjectB.popularityScore -
									otherUserBookObjectA.popularityScore
								);
							}
						})
						.map((rootId, index) => {
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
										) : (
											<span className="status-span">
												{otherUserBook.status}
											</span>
										)}
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
										) : (
											<span className="status-span">
												{loggedInUserBook.status}
											</span>
										)}
									</td>
								</tr>
							);
						})}
				</tbody>
			</table>
		)
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
									<div
										className={
											reviewShowMore ? 'book-review show-more' : 'book-review'
										}
									>
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
								userId,
								userBooksInfo.otherUserFirstName
							)}
						>{`back to ${userBooksInfo.otherUserFirstName}'s profile`}</a>
					</div>
				)}
			</div>
		) : null;

	const mainContentLeftSection = loaded ? (
		<div className="user-compare-books-page-main-content-left-section">
			{pageHeader}
			{userBooksInfo.otherUserBooks.length > 0 ? (
				<div className="comparisons-and-ratings">
					{comparisonChartSection}
					{booksInCommonTable}
					{rateOtherBooksArea}
				</div>
			) : (
				<span className="no-books-added-span">{`${userBooksInfo.otherUserFirstName} hasn't added any books.`}</span>
			)}
		</div>
	) : null;

	const mainContentRightSection = loaded ? (
		<div className="user-compare-books-page-main-content-right-section">
			<a
				href={Firebase.pageGenerator.generateUserPage(
					userId,
					userBooksInfo.otherUserFirstName
				)}
			>{`back to ${userBooksInfo.otherUserFirstName}'s profile »`}</a>
			<a
				href={Firebase.pageGenerator.generateBookCompatibilityTestPage(
					userId,
					userBooksInfo.otherUserFirstName
				)}
			>
				book compatibility test
			</a>
			<a
				href={Firebase.pageGenerator.generateGiveRecommendationToUserPage(
					userId
				)}
			>{`recommend a book to ${userBooksInfo.otherUserFirstName}`}</a>
			<div className="common-shelves-area">
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
			</div>
			<div className="your-shelves-area">
				<label htmlFor="your-shelves">your shelves</label>
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
			</div>
			<div className="their-shelves-area">
				<label htmlFor="their-shelves">their shelves</label>
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
