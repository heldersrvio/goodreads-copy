import React, { useState, useEffect } from 'react';
import Firebase from '../../Firebase';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import TopBar from '../Global/TopBar';
import '../styles/Friends/FollowersPage.css';

const FollowersPage = ({ match }) => {
	const {
		params: { pageId },
	} = match;
	const userId = pageId.split('-')[0];
	const userFirstName =
		pageId.split('-')[1].charAt(0).toUpperCase() +
		pageId.split('-')[1].slice(1);
	const [loaded, setLoaded] = useState(false);
	const [followers, setFollowers] = useState([]);
	const [page, setPage] = useState(1);

	const user = JSON.parse(localStorage.getItem('userState'));

	const noPictureImage =
		'https://s.gr-assets.com/assets/nophoto/user/u_50x66-632230dc9882b4352d753eedf9396530.png';
	const noCoverUrl =
		'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png';

	useEffect(() => {
		const loadFollowers = async () => {
			setFollowers(
				await Firebase.getInfoForFollowPage(userId, user.userUID, 'followers')
			);
			setLoaded(true);
		};

		loadFollowers();
	}, [user.userUID, userId]);

	const mainContent = loaded ? (
		<div className="follow-page-main-content">
			<span className="follow-page-page-indicator">
				<a
					href={Firebase.pageGenerator.generateUserPage(userId, userFirstName)}
				>
					{userFirstName}
				</a>
				{' > Followers'}
			</span>
			{Math.ceil(followers.length / 30) > 1 ? (
				<div className="page-navigation-section">
					<button
						onClick={(_e) => setPage((previous) => previous - 1)}
						disabled={page === 1}
					>
						« previous
					</button>
					{Array.from(
						{
							length: Math.ceil(followers.length / 30),
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
						disabled={page === Math.ceil(followers.length / 30)}
					>
						next »
					</button>
				</div>
			) : null}
			<div className="follow-list">
				{followers.length > 0 ? (
					followers
						.filter(
							(_follower, index) =>
								index >= (page - 1) * 30 && index <= page * 30 - 1
						)
						.map((follower) => {
							return (
								<div className="follow-card" key={follower.id}>
									<div className="left-section">
										<a
											className="picture-a"
											href={Firebase.pageGenerator.generateUserPage(
												follower.id,
												follower.name.split(' ').join('-')
											)}
										>
											<img
												src={
													follower.profilePicture === undefined
														? noPictureImage
														: follower.profilePicture
												}
												alt={follower.name}
											/>
										</a>
										<div className="user-info">
											<a
												className="name-a"
												href={Firebase.pageGenerator.generateUserPage(
													follower.id,
													follower.name.split(' ').join('-')
												)}
											>
												{follower.name}
											</a>
											<span className="books-and-friends-span">
												<a
													href={Firebase.pageGenerator.generateUserShelfPage(
														follower.id,
														follower.name.split(' ')[0]
													)}
												>{`${follower.numberOfBooks} books`}</a>
												<span>{' | '}</span>
												<a
													href={Firebase.pageGenerator.generateUserFriendsPage(
														follower.id,
														follower.name.split(' ')[0]
													)}
												>{`${follower.numberOfFriends} friends`}</a>
											</span>
											<span className="location-span">{follower.location}</span>
										</div>
									</div>
									{follower.currentlyReadingBook !== undefined ? (
										<div className="middle-section">
											<a
												className="cover-a"
												href={Firebase.pageGenerator.generateBookPage(
													follower.currentlyReadingBook.id,
													follower.currentlyReadingBook.title
												)}
											>
												<img
													src={
														follower.currentlyReadingBook.cover !== undefined
															? follower.currentlyReadingBook.cover
															: noCoverUrl
													}
													alt={follower.currentlyReadingBook.title}
												/>
											</a>
											<div className="book-info">
												<span className="currently-reading-span">
													Currently reading:
												</span>
												<a
													href={Firebase.pageGenerator.generateBookPage(
														follower.currentlyReadingBook.id,
														follower.currentlyReadingBook.title
													)}
												>
													{follower.currentlyReadingBook.title}
												</a>
											</div>
										</div>
									) : null}
									<div className="right-section">
										<a
											className={
												follower.isFriend
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
												follower.id
											)}
										>
											compare books
										</a>
									</div>
								</div>
							);
						})
				) : (
					<span className="no-follow-span">No followers.</span>
				)}
			</div>
		</div>
	) : null;

	return (
		<div className="followers-page follow-page">
			<TopBar />
			{mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default FollowersPage;
