import React, { useState, useEffect } from 'react';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';
import '../styles/News/ArticleLikedByPage.css';
import { trackPromise } from 'react-promise-tracker';

const ArticleLikedByPage = ({ match }) => {
	const {
		params: { articleId },
	} = match;
	const [loaded, setLoaded] = useState(false);
	const [page, setPage] = useState(1);
	const [title, setTitle] = useState(null);
	const [users, setUsers] = useState([]);

	useEffect(() => {
		const getUsersAndTitle = async () => {
			setTitle(await trackPromise(Firebase.getArticleTitle(articleId)));
			setUsers(await trackPromise(Firebase.getUsersWhoLikedArticle(articleId)));
			setLoaded(true);
		};
		getUsersAndTitle();
	}, [articleId]);

	useEffect(() => {
		console.log(users);
	}, [users]);

	const pageHeader = loaded ? (
		<h1 className="article-liked-by-page-header">
			<a href={Firebase.pageGenerator.generateArticlePage(articleId, title)}>
				{title}
			</a>
			<span>{'> Liked By'}</span>
		</h1>
	) : null;

	const userList = loaded ? (
		<div className="article-liked-by-page-user-list">
			<span className="showing-numbers-span">{`Showing ${
				(page - 1) * 100 + 1
			}-${
				page === Math.ceil(users.length / 100) ? users.length : page * 100
			} of ${users.length}`}</span>
			<div className="list">
				{users
					.filter(
						(_u, index) => index >= (page - 1) * 100 && index <= page * 100
					)
					.map((user, index) => {
						return (
							<div className="user-card" key={index}>
								<a
									className="user-profile-picture-wrapper"
									href={Firebase.pageGenerator.generateUserPage(
										user.id,
										user.name
									)}
								>
									<img
										src={
											user.profilePicture !== undefined
												? user.profilePicture
												: 'https://s.gr-assets.com/assets/nophoto/user/u_100x100-259587f1619f5253426a4fa6fb508831.png'
										}
										alt={user.name}
									/>
								</a>
								<div className="right-section">
									<a
										className="user-name-a"
										href={Firebase.pageGenerator.generateUserPage(
											user.id,
											user.name
										)}
									>
										{user.name}
									</a>
									<span>{`${user.numberOfBooks} books`}</span>
									<span>{`${user.numberOfFriends} friends`}</span>
								</div>
							</div>
						);
					})}
			</div>
			{users.length > 100 ? (
				<div className="page-navigation-area">
					<button
						onClick={(_e) => setPage((previous) => previous - 1)}
						disabled={page === 1}
					>
						« previous
					</button>
					{Array.from(
						{
							length: Math.ceil(users.length / 100),
						},
						(_x, i) => i + 1
					).map((number) => {
						return (
							<button
								className="page-number-button"
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
						disabled={page === Math.ceil(users.length / 100)}
					>
						next »
					</button>
				</div>
			) : null}
		</div>
	) : null;

	return (
		<div className="article-liked-by-page">
			<TopBar />
			<div className="article-liked-by-page-main-content">
				{pageHeader}
				{userList}
			</div>
			<HomePageFootBar />
		</div>
	);
};

export default ArticleLikedByPage;
