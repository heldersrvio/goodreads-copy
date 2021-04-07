import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';

const BookCompatibilityTestPage = () => {
	const history = useHistory();
	const query = new URLSearchParams(useLocation().search);
	const pageId = query.get('id');
	const userId = pageId !== null ? pageId.split('-')[0] : null;
	const userName =
		pageId !== null
			? pageId
					.split('-')
					.splice(1)
					.map((name) => name[0].toUpperCase() + name.splice(1))
					.join(' ')
			: null;
	const [loaded, setLoaded] = useState(false);
	const [usersInfo, setUsersInfo] = useState({});
	const [booksInfo, setBooksInfo] = useState({});

	const popularBooksIds = Array(10).fill('1');
	const classicsBooksIds = Array(10).fill('1');
	const popularFictionBooksIds = Array(10).fill('1');
	const thrillersBooksIds = Array(10).fill('1');
	const nonFictionBooksIds = Array(9).fill('1');
	const fantasyBooksIds = Array(5).fill('1');
	const romanceBooksIds = Array(10).fill('1');
	const scienceFictionBooksIds = Array(10).fill('1');
	const womensFictionBooksIds = Array(10).fill('1');

	const noPictureImageUrl =
		'https://s.gr-assets.com/assets/nophoto/user/u_100x100-259587f1619f5253426a4fa6fb508831.png';

	const user = JSON.parse(localStorage.getItem('userState'));

	/*
	usersInfo: {
		loggedInUser: {
			profilePicture,
			friends: [{
				rootId,
				name,
			}],
			popularBooks: [{
				rootId,
				status,
				rating,
			}],
			classicsBooks: [{
				rootId,
				status,
				rating,
			}],
			popularFictionBooks: [{
				rootId,
				status,
				rating,
			}],
			thrillersBooks: [{
				rootId,
				status,
				rating
			}],
			nonfictionBooks: [{
				rootId,
				status,
				rating,
			}],
			fantasyBooks: [{
				rootId,
				status,
				rating,
			}],
			romanceBooks: [{
				rootId,
				status,
				rating,
			}],
			scienceFictionBooks: [{
				rootId,
				status,
				rating,
			}],
			womensFictionBooks: [{
				rootId,
				status,
				rating,
			}],
		},
		otherUser: {
			profilePicture,
			popularBooks: [{
				rootId,
				status,
				rating,
			}],
			classicsBooks: [{
				rootId,
				status,
				rating,
			}],
			popularFictionBooks: [{
				rootId,
				status,
				rating,
			}],
			thrillersBooks: [{
				rootId,
				status,
				rating
			}],
			nonfictionBooks: [{
				rootId,
				status,
				rating,
			}],
			fantasyBooks: [{
				rootId,
				status,
				rating,
			}],
			romanceBooks: [{
				rootId,
				status,
				rating,
			}],
			scienceFictionBooks: [{
				rootId,
				status,
				rating,
			}],
			womensFictionBooks: [{
				rootId,
				status,
				rating,
			}],
		},
	}

	booksInfo: {
		popularBooks: [{
			title,
			authorId,
			authorName,
		}],
		classicsBooks: [{
			title,
			authorId,
			authorName,
		}],
		popularFictionBooks: [{
			title,
			authorId,
			authorName,
		}],
		thrillersBooks: [{
			title,
			authorId,
			authorName
		}],
		nonfictionBooks: [{
			title,
			authorId,
			authorName,
		}],
		fantasyBooks: [{
			title,
			authorId,
			authorName,
		}],
		romanceBooks: [{
			title,
			authorId,
			authorName,
		}],
		scienceFictionBooks: [{
			title,
			authorId,
			authorName,
		}],
		womensFictionBooks: [{
			title,
			authorId,
			authorName,
		}],
	}
	*/

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
	const generalMatch =
		(popularMatch +
			classicsMatch +
			popularFictionMatch +
			thrillersMatch +
			nonFictionMatch +
			fantasyMatch +
			romanceMatch +
			scienceFictionMatch +
			womensFictionMatch) /
		5;

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
						user.userInfo.profilePicture !== undefined
							? user.userInfo.profilePicture
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
				<span>{` is ${generalMatch * 100}%`}</span>
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
				<th>Category</th>
				<th>Score</th>
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
					return (
						<tr key={index}>
							<td>
								<a
									href={Firebase.pageGenerator.generateGenrePage(
										genre.split(' ').join('-')
									)}
								>
									{genre}
								</a>
							</td>
							<td>
								<span>{matchesArray[index] * 100}</span>
								<div
									className={
										'green-bar ' + (matchesArray[index] * 100).toString()
									}
								></div>
							</td>
						</tr>
					);
				})}
			</tbody>
		</table>
	) : null;

	const mainContentLeftSection = (
		<div className="book-compatibility-test-page-main-content-left-section">
			{pageHeader}
			{generalCompatibilitySection}
			{categoryCompatibilitySection}
		</div>
	);

	const mainContent = (
		<div className="book-compatibility-test-page-main-content"></div>
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
