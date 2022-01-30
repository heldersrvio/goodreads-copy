import React, { useState, useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import Firebase from '../../Firebase';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import TopBar from '../Global/TopBar';
import '../styles/Friends/PeopleFollowingPage.css';

const PeopleFollowingPage = ({ match }) => {
	const {
		params: { pageId },
	} = match;
	const userId = pageId.split('-')[0];
	const userFirstName =
		pageId.split('-')[1].charAt(0).toUpperCase() +
		pageId.split('-')[1].slice(1);
	const [loaded, setLoaded] = useState(false);
	const [followings, setFollowings] = useState([]);
	const [page, setPage] = useState(1);

	const user = JSON.parse(localStorage.getItem('userState'));

	const noPictureImage =
		'https://s.gr-assets.com/assets/nophoto/user/u_50x66-632230dc9882b4352d753eedf9396530.png';
	const noCoverUrl =
		'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png';

	useEffect(() => {
		const loadFollowings = async () => {
			setFollowings(
				await trackPromise(
					Firebase.getInfoForFollowPage(userId, user.userUID, 'following')
				)
			);
			setLoaded(true);
		};

		loadFollowings();
	}, [user.userUID, userId]);

	const mainContent = loaded ? (
		<div className="follow-page-main-content">
			<span className="follow-page-page-indicator">
				<a
					href={Firebase.pageGenerator.generateUserPage(userId, userFirstName)}
				>
					{userFirstName}
				</a>
				{userId === user.userUID
					? ` > People You're Following`
					: ` > People ${userFirstName} is Following`}
			</span>
			{Math.ceil(followings.length / 30) > 1 ? (
				<div className="page-navigation-section">
					<button
						onClick={(_e) => setPage((previous) => previous - 1)}
						disabled={page === 1}
					>
						« previous
					</button>
					{Array.from(
						{
							length: Math.ceil(followings.length / 30),
						},
						(_x, i) => i + 1
					).map((number) => {
						return (
							<button
								key={number}
								onClick={(_e) => setPage(number)}
								disabled={page === number}
							>
								{page !== number ? number : <i>{number}</i>}
							</button>
						);
					})}
					<button
						onClick={(_e) => setPage((previous) => previous + 1)}
						disabled={page === Math.ceil(followings.length / 30)}
					>
						next »
					</button>
				</div>
			) : null}
			<div className="follow-list-and-links">
				<div className="follow-list">
					{followings.length > 0 ? (
						followings
							.filter(
								(_following, index) =>
									index >= (page - 1) * 30 && index <= page * 30 - 1
							)
							.map((following) => {
								return (
									<div className="follow-card" key={following.id}>
										<div className="left-section">
											<a
												className="picture-a"
												href={Firebase.pageGenerator.generateUserPage(
													following.id,
													following.name.split(' ').join('-')
												)}
											>
												<img
													src={
														following.profilePicture === undefined
															? noPictureImage
															: following.profilePicture
													}
													alt={following.name}
												/>
											</a>
											<div className="user-info">
												<a
													className="name-a"
													href={Firebase.pageGenerator.generateUserPage(
														following.id,
														following.name.split(' ').join('-')
													)}
												>
													{following.name}
												</a>
												<span className="books-and-friends-span">
													<a
														href={Firebase.pageGenerator.generateUserShelfPage(
															following.id,
															following.name.split(' ')[0]
														)}
													>{`${following.numberOfBooks} books`}</a>
													<span>{' | '}</span>
													<a
														href={Firebase.pageGenerator.generateUserFriendsPage(
															following.id,
															following.name.split(' ')[0]
														)}
													>{`${following.numberOfFriends} friends`}</a>
												</span>
												<span className="location-span">
													{following.location}
												</span>
											</div>
										</div>
										{following.currentlyReadingBook !== undefined ? (
											<div className="middle-section">
												<a
													className="cover-a"
													href={Firebase.pageGenerator.generateBookPage(
														following.currentlyReadingBook.id,
														following.currentlyReadingBook.title
													)}
												>
													<img
														src={
															following.currentlyReadingBook.cover !== undefined
																? following.currentlyReadingBook.cover
																: noCoverUrl
														}
														alt={following.currentlyReadingBook.title}
													/>
												</a>
												<div className="book-info">
													<span className="currently-reading-span">
														Currently reading:
													</span>
													<a
														href={Firebase.pageGenerator.generateBookPage(
															following.currentlyReadingBook.id,
															following.currentlyReadingBook.title
														)}
													>
														{following.currentlyReadingBook.title}
													</a>
												</div>
											</div>
										) : null}
										<div className="right-section">
											<a
												className={
													following.isFriend
														? 'hidden add-friend-a'
														: 'add-friend-a'
												}
												href={Firebase.pageGenerator.generateAddAsFriendPage(
													userId
												)}
											>
												Add as Friend
											</a>
											<a
												href={Firebase.pageGenerator.generateUserCompareBooksPage(
													following.id
												)}
											>
												compare books
											</a>
										</div>
									</div>
								);
							})
					) : (
						<span className="no-follow-span">
							{userId !== user.userUID
								? `${userFirstName} is not following anyone.`
								: `You aren't following anyone.`}
						</span>
					)}
				</div>
				<div className="links">
					<a
						href={Firebase.pageGenerator.generateUserPage(
							userId,
							userFirstName
						)}
					>{`${
						userId === user.userUID ? 'My' : `${userFirstName}'s`
					} profile »`}</a>
				</div>
			</div>
		</div>
	) : null;

	return (
		<div className="people-following-page follow-page">
			<TopBar />
			{mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default PeopleFollowingPage;
