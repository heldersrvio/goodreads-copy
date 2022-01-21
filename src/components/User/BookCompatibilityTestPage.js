import React, { useState, useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';
import '../styles/User/BookCompatibilityTestPage.css';
import { trackPromise } from 'react-promise-tracker';

const BookCompatibilityTestPage = () => {
	const history = useHistory();
	const query = new URLSearchParams(useLocation().search);
	const pageId = query.get('id');
	const userId = pageId !== null ? pageId.split('-')[0] : null;
	const userName =
		pageId !== null
			? pageId
					.split('-')
					.slice(1)
					.map((name) => name[0].toUpperCase() + name.slice(1))
					.join(' ')
			: null;
	const userFirstName = userName !== null ? userName.split(' ')[0] : null;
	const [loaded, setLoaded] = useState(false);
	const [usersInfo, setUsersInfo] = useState({});
	const [booksInfo, setBooksInfo] = useState({});
	const [friendSelectInput, setFriendSelectInput] = useState(0);

	const popularBooksIds = useMemo(
		() => [
			'JdE1oE1zeZYOVU8PYyy7',
			'Fctu87S2XLy2RA5Wcr6H',
			'0Ahlt0lmj06b0rKaD7qJ',
			'24P8kxLmS4LmtcDSPkvl',
		],
		[]
	);
	const classicsBooksIds = useMemo(
		() => [
			'6490z4ij4qsGAIBoeBMK',
			'Djx2P7Egc9cJgfdwwF37',
			'H1xRvYEIDyk54H68QssS',
			'HfkmwYPOfQ4MtpLnLNlq',
		],
		[]
	);
	const popularFictionBooksIds = useMemo(
		() => ['JQBwpf6G3ND5pKXDYNlx', 'JdE1oE1zeZYOVU8PYyy7'],
		[]
	);
	const thrillersBooksIds = useMemo(
		() => [
			'VYSVKcKAKYwDq2PhV2cJ',
			'VncumXL1QTrVaGdhvM4O',
			'aJSCUT07kmUQqUlTegRv',
		],
		[]
	);
	const nonFictionBooksIds = useMemo(
		() => [
			'aJy9OMGHhUQ8GPZGRn6C',
			'bzRUzMqsdgjKD75Jxosn',
			'dDSxgc4Af87DFYEsiTxq',
			'e7wTYJTr4dSkJLaEXWEO',
		],
		[]
	);
	const fantasyBooksIds = useMemo(
		() => [
			'hx124Fx58u2xRqWUaxlv',
			'ljpqnZKAKgZSjbmrO6sF',
			'nSpJeOPwkgFKg45uc164',
			'oJ2euLQwJOn944VBu1tl',
		],
		[]
	);
	const romanceBooksIds = useMemo(
		() => ['pe83n32WlbIWRmYwyLiD', 'pttjrCHmNS16f2lhOU9e'],
		[]
	);
	const scienceFictionBooksIds = useMemo(
		() => [
			'qNejPAmYF2xlTdbnhH41',
			'qUe7SD2Jba5MbybZNUj5',
			'sBVe4XtgS9K0HldzfRBN',
		],
		[]
	);
	const womensFictionBooksIds = useMemo(
		() => [
			't8AF9o4IHodXuusb62ws',
			'uBI55trKgMJpRohAtxry',
			'unRbEhtsd1vcMxpSvDKI',
			'zCikj4mmQyZlyVNyP7cF',
		],
		[]
	);

	const noPictureImageUrl =
		'https://s.gr-assets.com/assets/nophoto/user/u_100x100-259587f1619f5253426a4fa6fb508831.png';

	const user = JSON.parse(localStorage.getItem('userState'));

	useEffect(() => {
		const getInfo = async () => {
			setBooksInfo(
				await trackPromise(
					Firebase.getBooksInfoForBookCompatibilityTestPage(
						popularBooksIds,
						classicsBooksIds,
						popularFictionBooksIds,
						thrillersBooksIds,
						nonFictionBooksIds,
						fantasyBooksIds,
						romanceBooksIds,
						scienceFictionBooksIds,
						womensFictionBooksIds
					)
				)
			);
			setUsersInfo(
				await trackPromise(
					Firebase.getUsersInfoForCompatibilityTestPage(
						popularBooksIds,
						classicsBooksIds,
						popularFictionBooksIds,
						thrillersBooksIds,
						nonFictionBooksIds,
						fantasyBooksIds,
						romanceBooksIds,
						scienceFictionBooksIds,
						womensFictionBooksIds,
						user.userUID,
						userId,
						history
					)
				)
			);
			setLoaded(true);
		};
		getInfo();
	}, [
		classicsBooksIds,
		popularFictionBooksIds,
		popularBooksIds,
		thrillersBooksIds,
		fantasyBooksIds,
		womensFictionBooksIds,
		scienceFictionBooksIds,
		nonFictionBooksIds,
		romanceBooksIds,
		user.userUID,
		userId,
		history,
	]);

	const calculateMatchForCategory = (
		generalCategoryIdArray,
		user1BookArray,
		user2BookArray
	) => {
		const ratedBooksInCommon = generalCategoryIdArray.filter(
			(rootId) =>
				user1BookArray.some(
					(book) =>
						book.rootId === rootId &&
						book.rating !== undefined &&
						book.rating > 0
				) &&
				user2BookArray.some(
					(book) =>
						book.rootId === rootId &&
						book.rating !== undefined &&
						book.rating > 0
				)
		);
		if (ratedBooksInCommon.length === 0) {
			return -1;
		}
		return ratedBooksInCommon.reduce(
			(previous, current) =>
				previous +
				(5 -
					Math.abs(
						user1BookArray.filter((book) => book.rootId === current)[0].rating -
							user2BookArray.filter((book) => book.rootId === current)[0].rating
					)) /
					5 /
					ratedBooksInCommon.length,
			0
		);
	};

	const popularMatch = loaded
		? calculateMatchForCategory(
				popularBooksIds,
				usersInfo.loggedInUser.popularBooks,
				usersInfo.otherUser.popularBooks
		  )
		: 0;
	const classicsMatch = loaded
		? calculateMatchForCategory(
				classicsBooksIds,
				usersInfo.loggedInUser.classicsBooks,
				usersInfo.otherUser.classicsBooks
		  )
		: 0;
	const popularFictionMatch = loaded
		? calculateMatchForCategory(
				popularFictionBooksIds,
				usersInfo.loggedInUser.popularFictionBooks,
				usersInfo.otherUser.popularFictionBooks
		  )
		: 0;
	const thrillersMatch = loaded
		? calculateMatchForCategory(
				thrillersBooksIds,
				usersInfo.loggedInUser.thrillersBooks,
				usersInfo.otherUser.thrillersBooks
		  )
		: 0;
	const nonFictionMatch = loaded
		? calculateMatchForCategory(
				nonFictionBooksIds,
				usersInfo.loggedInUser.nonFictionBooks,
				usersInfo.otherUser.nonFictionBooks
		  )
		: 0;
	const fantasyMatch = loaded
		? calculateMatchForCategory(
				fantasyBooksIds,
				usersInfo.loggedInUser.fantasyBooks,
				usersInfo.otherUser.fantasyBooks
		  )
		: 0;
	const romanceMatch = loaded
		? calculateMatchForCategory(
				romanceBooksIds,
				usersInfo.loggedInUser.romanceBooks,
				usersInfo.otherUser.romanceBooks
		  )
		: 0;
	const scienceFictionMatch = loaded
		? calculateMatchForCategory(
				scienceFictionBooksIds,
				usersInfo.loggedInUser.scienceFictionBooks,
				usersInfo.otherUser.scienceFictionBooks
		  )
		: 0;
	const womensFictionMatch = loaded
		? calculateMatchForCategory(
				womensFictionBooksIds,
				usersInfo.loggedInUser.womensFictionBooks,
				usersInfo.otherUser.womensFictionBooks
		  )
		: 0;
	const matchesArray = [
		popularMatch,
		classicsMatch,
		popularFictionMatch,
		thrillersMatch,
		nonFictionMatch,
		fantasyMatch,
		romanceMatch,
		scienceFictionMatch,
		womensFictionMatch,
	];
	const generalMatch = matchesArray
		.filter((match) => match !== -1)
		.reduce(
			(previous, current) =>
				previous +
				current / matchesArray.filter((match) => match !== -1).length,
			0
		);

	const pageHeader = (
		<h1 className="book-compatibility-test-page-header">
			Book Compatibility Test Results
		</h1>
	);

	const generalCompatibilitySection = loaded ? (
		<div className="book-compatibility-test-page-general-compatibility-section">
			<a
				className="user-profile-picture-wrapper"
				href={Firebase.pageGenerator.generateUserPage(
					user.userUID,
					user.userInfo.firstName
				)}
			>
				<img
					src={
						usersInfo.loggedInUser.profilePicture !== undefined
							? usersInfo.loggedInUser.profilePicture
							: noPictureImageUrl
					}
					alt={user.userInfo.firstName}
				/>
			</a>
			<span>
				<span>{`Your compatibility with `}</span>
				<a
					href={Firebase.pageGenerator.generateUserPage(
						userId,
						userName.split(' ')[0]
					)}
				>
					{userName}
				</a>
				<span>{` is ${(generalMatch * 100).toFixed(0)}%.`}</span>
			</span>
			<a
				className="user-profile-picture-wrapper"
				href={Firebase.pageGenerator.generateUserPage(
					user.userUID,
					user.userInfo.firstName
				)}
			>
				<img
					src={
						usersInfo.otherUser.profilePicture !== undefined
							? usersInfo.otherUser.profilePicture
							: noPictureImageUrl
					}
					alt={user.userInfo.firstName}
				/>
			</a>
		</div>
	) : null;

	const categoryCompatibilitySection = loaded ? (
		<table className="book-compatibility-test-page-category-compatibility-section">
			<thead>
				<tr>
					<th>Category</th>
					<th>Score</th>
				</tr>
			</thead>
			<tbody>
				{[
					'popular',
					'classics',
					'popular fiction',
					'thrillers',
					'nonfiction',
					'fantasy',
					'romance',
					'science fiction',
					"women's fiction",
				].map((genre, index) => {
					const matchValue =
						matchesArray[index] === -1 ? 0 : matchesArray[index];
					return (
						<tr key={index} className={index === 8 ? 'last-row' : ''}>
							<td className="category-td">
								<a
									href={Firebase.pageGenerator.generateGenrePage(
										genre.split(' ').join('-')
									)}
								>
									{genre}
								</a>
							</td>
							<td className="score-td">
								<span>{matchValue * 100}</span>
								<div
									className={'green-bar-' + (matchValue * 100).toString()}
								></div>
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	) : null;

	const generateSpecificCategoryCompatibilitySection = (
		categoryName,
		bookIdsArray,
		booksInfoObject,
		loggedInUserInfoObject,
		otherUserInfoObject,
		index
	) => {
		const generateTableEntryForBook = (bookObjectArray) => {
			if (bookObjectArray.length > 0) {
				if (
					bookObjectArray[0].rating !== undefined &&
					bookObjectArray[0].rating !== 0
				) {
					return (
						<div className="rating-stars">
							<div
								className={
									bookObjectArray[0].rating >= 1
										? 'static-star small full'
										: bookObjectArray[0].rating >= 0.5
										? 'static-star small almost-full'
										: bookObjectArray[0].rating > 0
										? 'static-star small almost-empty'
										: 'static-star small empty'
								}
							></div>
							<div
								className={
									bookObjectArray[0].rating >= 2
										? 'static-star small full'
										: bookObjectArray[0].rating >= 1.5
										? 'static-star small almost-full'
										: bookObjectArray[0].rating > 1
										? 'static-star small almost-empty'
										: 'static-star small empty'
								}
							></div>
							<div
								className={
									bookObjectArray[0].rating >= 3
										? 'static-star small full'
										: bookObjectArray[0].rating >= 2.5
										? 'static-star small almost-full'
										: bookObjectArray[0].rating > 2
										? 'static-star small almost-empty'
										: 'static-star small empty'
								}
							></div>
							<div
								className={
									bookObjectArray[0].rating >= 4
										? 'static-star small full'
										: bookObjectArray[0].rating >= 3.5
										? 'static-star small almost-full'
										: bookObjectArray[0].rating > 3
										? 'static-star small almost-empty'
										: 'static-star small empty'
								}
							></div>
							<div
								className={
									bookObjectArray[0].rating >= 5
										? 'static-star small full'
										: bookObjectArray[0].rating >= 4.5
										? 'static-star small almost-full'
										: bookObjectArray[0].rating > 4
										? 'static-star small almost-empty'
										: 'static-star small empty'
								}
							></div>
						</div>
					);
				} else {
					return (
						<span className="status-span">{bookObjectArray[0].status}</span>
					);
				}
			}
			return <span className="nothing-span">--</span>;
		};

		return (
			<table className="specific-category-table" key={index}>
				<thead>
					<tr>
						<th>{categoryName + ' Books'}</th>
						<th>My Rating</th>
						<th>{`${userFirstName}'s Rating`}</th>
						<th>Match</th>
					</tr>
				</thead>
				<tbody>
					{bookIdsArray.map((bookRootId, i) => {
						const loggedInUserBook = loggedInUserInfoObject.filter(
							(book) => book.rootId === bookRootId
						);
						const otherUserBook = otherUserInfoObject.filter(
							(book) => book.rootId === bookRootId
						);
						return (
							<tr
								key={i}
								className={i === bookIdsArray.length - 1 ? 'last-row' : ''}
							>
								<td>
									<span>
										<a
											href={Firebase.pageGenerator.generateBookPage(
												booksInfoObject[i].id,
												booksInfoObject[i].title
											)}
										>
											{booksInfoObject[i].title}
										</a>
										<span> by </span>
										<a
											href={Firebase.pageGenerator.generateAuthorPage(
												booksInfoObject[i].authorId,
												booksInfoObject[i].authorName
											)}
										>
											{booksInfoObject[i].authorName}
										</a>
									</span>
								</td>
								<td>{generateTableEntryForBook(loggedInUserBook)}</td>
								<td>{generateTableEntryForBook(otherUserBook)}</td>
								<td>
									{loggedInUserBook.length > 0 &&
									loggedInUserBook[0].rating !== undefined &&
									loggedInUserBook[0].rating !== 0 &&
									otherUserBook.length > 0 &&
									otherUserBook[0].rating !== undefined &&
									otherUserBook[0].rating !== 0 ? (
										Math.abs(
											loggedInUserBook[0].rating - otherUserBook[0].rating
										) === 0 ? (
											<span className="excellent">excellent</span>
										) : Math.abs(
												loggedInUserBook[0].rating - otherUserBook[0].rating
										  ) === 1 ? (
											<span className="good">good</span>
										) : Math.abs(
												loggedInUserBook[0].rating - otherUserBook[0].rating
										  ) === 2 ? (
											<span className="ok">ok</span>
										) : Math.abs(
												loggedInUserBook[0].rating - otherUserBook[0].rating
										  ) === 3 ? (
											<span className="not-good">not good</span>
										) : (
											<span className="very-bad">very bad</span>
										)
									) : (
										<span></span>
									)}
								</td>
							</tr>
						);
					})}
				</tbody>
			</table>
		);
	};

	const popularSection = loaded ? (
		<div className="book-compatibility-test-page-popular-section">
			{generateSpecificCategoryCompatibilitySection(
				'popular',
				popularBooksIds,
				booksInfo.popularBooks,
				usersInfo.loggedInUser.popularBooks,
				usersInfo.otherUser.popularBooks,
				0
			)}
		</div>
	) : null;

	const classicsSection = loaded ? (
		<div className="book-compatibility-test-page-classics-section">
			{generateSpecificCategoryCompatibilitySection(
				'classics',
				classicsBooksIds,
				booksInfo.classicsBooks,
				usersInfo.loggedInUser.classicsBooks,
				usersInfo.otherUser.classicsBooks,
				0
			)}
		</div>
	) : null;

	const popularFictionSection = loaded ? (
		<div className="book-compatibility-test-page-popular-fiction-section">
			{generateSpecificCategoryCompatibilitySection(
				'popular fiction',
				popularFictionBooksIds,
				booksInfo.popularFictionBooks,
				usersInfo.loggedInUser.popularFictionBooks,
				usersInfo.otherUser.popularFictionBooks,
				0
			)}
		</div>
	) : null;

	const thrillersSection = loaded ? (
		<div className="book-compatibility-test-page-thrillers-section">
			{generateSpecificCategoryCompatibilitySection(
				'thrillers',
				thrillersBooksIds,
				booksInfo.thrillersBooks,
				usersInfo.loggedInUser.thrillersBooks,
				usersInfo.otherUser.thrillersBooks,
				0
			)}
		</div>
	) : null;

	const nonFictionSection = loaded ? (
		<div className="book-compatibility-test-page-nonfiction-section">
			{generateSpecificCategoryCompatibilitySection(
				'nonfiction',
				nonFictionBooksIds,
				booksInfo.nonFictionBooks,
				usersInfo.loggedInUser.nonFictionBooks,
				usersInfo.otherUser.nonFictionBooks,
				0
			)}
		</div>
	) : null;

	const fantasySection = loaded ? (
		<div className="book-compatibility-test-page-fantasy-section">
			{generateSpecificCategoryCompatibilitySection(
				'fantasy',
				fantasyBooksIds,
				booksInfo.fantasyBooks,
				usersInfo.loggedInUser.fantasyBooks,
				usersInfo.otherUser.fantasyBooks,
				0
			)}
		</div>
	) : null;

	const romanceSection = loaded ? (
		<div className="book-compatibility-test-page-romance-section">
			{generateSpecificCategoryCompatibilitySection(
				'romance',
				romanceBooksIds,
				booksInfo.romanceBooks,
				usersInfo.loggedInUser.romanceBooks,
				usersInfo.otherUser.romanceBooks,
				0
			)}
		</div>
	) : null;

	const scienceFictionSection = loaded ? (
		<div className="book-compatibility-test-page-science-fiction-section">
			{generateSpecificCategoryCompatibilitySection(
				'science fiction',
				scienceFictionBooksIds,
				booksInfo.scienceFictionBooks,
				usersInfo.loggedInUser.scienceFictionBooks,
				usersInfo.otherUser.scienceFictionBooks,
				0
			)}
		</div>
	) : null;

	const womensFictionSection = loaded ? (
		<div className="book-compatibility-test-page-womens-fiction-section">
			{generateSpecificCategoryCompatibilitySection(
				"women's fiction",
				womensFictionBooksIds,
				booksInfo.womensFictionBooks,
				usersInfo.loggedInUser.womensFictionBooks,
				usersInfo.otherUser.womensFictionBooks,
				0
			)}
		</div>
	) : null;

	const mainContentLeftSection = (
		<div className="book-compatibility-test-page-main-content-left-section">
			{pageHeader}
			{generalCompatibilitySection}
			{categoryCompatibilitySection}
			{popularSection}
			{classicsSection}
			{popularFictionSection}
			{thrillersSection}
			{nonFictionSection}
			{fantasySection}
			{romanceSection}
			{scienceFictionSection}
			{womensFictionSection}
		</div>
	);

	const mainContentRightSection = loaded ? (
		<div className="book-compatibility-test-page-main-content-right-section">
			<div className="top-links">
				<a
					href={Firebase.pageGenerator.generateBookEditCompatibilityTestAnswersPage(
						userId
					)}
				>
					edit my answers
				</a>
				<a href={Firebase.pageGenerator.generateUserCompareBooksPage(userId)}>
					compare books
				</a>
			</div>
			<div className="compare-with-friends-section">
				<h2>Compare with Friends</h2>
				<select
					value={friendSelectInput}
					onChange={(e) => {
						const newFriendIndex = e.target.value;
						setFriendSelectInput(newFriendIndex);

						history.push({
							pathname: Firebase.pageGenerator.generateBookCompatibilityTestPage(
								usersInfo.loggedInUser.friends[newFriendIndex - 1].id,
								usersInfo.loggedInUser.friends[newFriendIndex - 1].name
							),
						});
					}}
				>
					<option className="no-display-option" value={0}></option>
					{usersInfo.loggedInUser.friends.map((friend, index) => {
						return (
							<option key={index} value={index + 1}>
								{friend.name}
							</option>
						);
					})}
				</select>
			</div>
		</div>
	) : null;

	const mainContent = (
		<div className="book-compatibility-test-page-main-content">
			{mainContentLeftSection}
			{mainContentRightSection}
		</div>
	);

	return (
		<div className="book-compatibility-test-page">
			<TopBar />
			{mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default BookCompatibilityTestPage;
