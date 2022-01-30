import React, { useState, useEffect } from 'react';
import { trackPromise } from 'react-promise-tracker';
import Firebase from '../../Firebase';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import TopBar from '../Global/TopBar';
import '../styles/Friends/FriendsPage.css';

const FriendsPage = ({ match }) => {
	const {
		params: { pageId },
	} = match;
	const userId = pageId.split('-')[0];
	const userFirstName =
		pageId.split('-')[1].charAt(0).toUpperCase() +
		pageId.split('-')[1].slice(1);
	const [loaded, setLoaded] = useState(false);
	const [friends, setFriends] = useState([]);
	const [userProfilePicture, setUserProfilePicture] = useState(null);
	const [page, setPage] = useState(1);

	const user = JSON.parse(localStorage.getItem('userState'));

	const noPictureImage =
		'https://s.gr-assets.com/assets/nophoto/user/u_50x66-632230dc9882b4352d753eedf9396530.png';
	const noCoverUrl =
		'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png';

	useEffect(() => {
		const loadFriends = async () => {
			setUserProfilePicture(
				await trackPromise(Firebase.getUserProfilePicture(userId))
			);
			setFriends(
				await trackPromise(
					Firebase.getInfoForFollowPage(userId, user.userUID, 'friends')
				)
			);
			setLoaded(true);
		};

		loadFriends();
	}, [user.userUID, userId]);

	const mainContent = loaded ? (
		<div className="follow-page-main-content">
			<span className="follow-page-page-indicator">
				<a
					href={Firebase.pageGenerator.generateUserPage(userId, userFirstName)}
				>
					<img
						src={
							userProfilePicture === undefined
								? noPictureImage
								: userProfilePicture
						}
						alt={userFirstName}
					/>
				</a>
				{userId === user.userUID
					? `Your Friends`
					: `${userFirstName}'s Friends`}
				<span className="showing-page-span">{`Showing ${
					friends.length === 0 ? 0 : (page - 1) * 30 + 1
				}-${
					page * 30 - 1 <= friends.length ? page * 30 - 1 : friends.length
				} of ${friends.length}`}</span>
			</span>
			{Math.ceil(friends.length / 30) > 1 ? (
				<div className="page-navigation-section">
					<button
						onClick={(_e) => setPage((previous) => previous - 1)}
						disabled={page === 1}
					>
						« previous
					</button>
					{Array.from(
						{
							length: Math.ceil(friends.length / 30),
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
						disabled={page === Math.ceil(friends.length / 30)}
					>
						next »
					</button>
				</div>
			) : null}
			<div className="follow-list-and-links">
				<div className="follow-list">
					{friends.length > 0 ? (
						friends
							.filter(
								(_friend, index) =>
									index >= (page - 1) * 30 && index <= page * 30 - 1
							)
							.map((friend) => {
								return (
									<div className="follow-card" key={friend.id}>
										<div className="left-section">
											<a
												className="picture-a"
												href={Firebase.pageGenerator.generateUserPage(
													friend.id,
													friend.name.split(' ').join('-')
												)}
											>
												<img
													src={
														friend.profilePicture === undefined
															? noPictureImage
															: friend.profilePicture
													}
													alt={friend.name}
												/>
											</a>
											<div className="user-info">
												<a
													className="name-a"
													href={Firebase.pageGenerator.generateUserPage(
														friend.id,
														friend.name.split(' ').join('-')
													)}
												>
													{friend.name}
												</a>
												<span className="books-and-friends-span">
													<a
														href={Firebase.pageGenerator.generateUserShelfPage(
															friend.id,
															friend.name.split(' ')[0]
														)}
													>{`${friend.numberOfBooks} books`}</a>
													<span>{' | '}</span>
													<a
														href={Firebase.pageGenerator.generateUserFriendsPage(
															friend.id,
															friend.name.split(' ')[0]
														)}
													>{`${friend.numberOfFriends} friends`}</a>
												</span>
												<span className="location-span">{friend.location}</span>
											</div>
										</div>
										{friend.currentlyReadingBook !== undefined ? (
											<div className="middle-section">
												<a
													className="cover-a"
													href={Firebase.pageGenerator.generateBookPage(
														friend.currentlyReadingBook.id,
														friend.currentlyReadingBook.title
													)}
												>
													<img
														src={
															friend.currentlyReadingBook.cover !== undefined
																? friend.currentlyReadingBook.cover
																: noCoverUrl
														}
														alt={friend.currentlyReadingBook.title}
													/>
												</a>
												<div className="book-info">
													<span className="currently-reading-span">
														Currently reading:
													</span>
													<a
														href={Firebase.pageGenerator.generateBookPage(
															friend.currentlyReadingBook.id,
															friend.currentlyReadingBook.title
														)}
													>
														{friend.currentlyReadingBook.title}
													</a>
												</div>
											</div>
										) : null}
										<div className="right-section">
											<a
												className={
													friend.isFriend
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
													friend.id
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
								? `${userFirstName} doesn't have any friends.`
								: `You don't have any friends.`}
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
		<div className="friends-page follow-page">
			<TopBar />
			{mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default FriendsPage;
