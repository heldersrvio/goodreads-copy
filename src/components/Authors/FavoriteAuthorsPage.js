import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';
import '../styles/Authors/FavoriteAuthorsPage.css';

const FavoriteAuthorsPage = () => {
	const history = useHistory();
	const [loaded, setLoaded] = useState(false);
	const [authors, setAuthors] = useState([]);
	const [orderInputs, setOrderInputs] = useState([]);
	/* 
	author: {
		name,
		id,
		userId,
		bestBookId,
		bestBookTitle,
		profilePicture,
		numberOfBooks,
		numberOfShelvedBooks,
		numberOfMemberReviews,
		numberOfFriends,
	}
	*/
	const user = JSON.parse(localStorage.getItem('userState'));

	useEffect(() => {
		if (user === null || user.userUID === null || user.userUID === undefined) {
			history.push({
				pathname: '/user/sign_in',
			});
		} else {
			const authorArray = [
				{
					name: 'Stephen King',
					id: '123',
					userId: '123',
					bestBookId: '123',
					bestBookTitle: 'The Shining',
					profilePicture:
						'https://images.gr-assets.com/authors/1362814142p3/3389.jpg',
					numberOfBooks: 1768,
					numberOfShelvedBooks: 15,
					numberOfMemberReviews: 26710161,
					numberOfFriends: 2476,
				},
				{
					name: 'Jo Salmson',
					id: '123',
					bestBookId: '123',
					bestBookTitle: 'Tam Tiggarpojken',
					profilePicture:
						'https://images.gr-assets.com/authors/1513626882p3/4124390.jpg',
					numberOfBooks: 43,
					numberOfMemberReviews: 2213,
				},
				{
					name: 'Rick Riordan',
					id: '123',
					userId: '123',
					bestBookId: '123',
					bestBookTitle: 'The Lightning Thief',
					profilePicture:
						'https://images.gr-assets.com/authors/1608906571p3/15872.jpg',
					numberOfBooks: 151,
					numberOfShelvedBooks: 424,
					numberOfMemberReviews: 14676215,
					numberOfFriends: 11,
				},
			];
			setAuthors(authorArray);
			setOrderInputs(authorArray.map((_author, index) => index + 1));
			setLoaded(true);
		}
	}, [user, history]);

	const pageHeader = (
		<h1 className="favorite-authors-page-header">Your Favorite Authors</h1>
	);

	const noAuthorsYetMessage = (
		<span className="no-authors-yet-message">
			You haven’t marked any author as your favorite.
		</span>
	);

	const reorderInstructionMessage = (
		<span className="reorder-instruction-message">
			To re-order your favorite authors, you can drag and drop or manually enter
			a position number, then click "Save position changes".
		</span>
	);

	const generateAuthorCard = (author, index) => {
		return (
			<div className="favorite-authors-page-author-card" key={index}>
				<div className="left-section">
					<input
						type="text"
						className="order-input"
						value={orderInputs[index]}
						onChange={(e) =>
							setOrderInputs((previous) => {
								const newValue = e.target.value;
								return previous.map((value, i) =>
									i === index && !parseInt(newValue).isNaN()
										? parseInt(newValue)
										: value
								);
							})
						}
					></input>
					<div className="author-details">
						<a
							className="author-profile-picture-wrapper"
							href={Firebase.pageGenerator.generateAuthorPage(
								author.id,
								author.name
							)}
						>
							<img
								src={
									author.profilePicture !== undefined
										? author.profilePicture
										: 'https://www.goodreads.com/assets/nophoto/user/u_60x60-267f0ca0ea48fd3acfd44b95afa64f01.png'
								}
								alt={author.name}
							/>
						</a>
						<div className="author-info">
							<a
								className="author-name-a"
								href={Firebase.pageGenerator.generateAuthorPage(
									author.id,
									author.name
								)}
							>
								{author.name}
							</a>
							<span>
								<span>author of </span>
								<a
									href={Firebase.pageGenerator.generateBookPage(
										author.bestBookId,
										author.bestBookTitle
									)}
								>
									{author.bestBookTitle}
								</a>
							</span>
							<a
								href={Firebase.pageGenerator.generateAuthorPage(
									author.id,
									author.name
								)}
							>{`${author.numberOfBooks} books`}</a>
							<span>{`(${author.numberOfMemberReviews} member reviews)`}</span>
							{author.numberOfShelvedBooks !== undefined ? (
								<a
									href={Firebase.pageGenerator.generateUserReviewsPage(
										author.userId
									)}
								>{`${author.numberOfShelvedBooks} books shelved`}</a>
							) : null}
							{author.numberOfFriends !== undefined ? (
								<a
									href={Firebase.pageGenerator.generateUserFriendsPage(
										author.userId,
										author.name
									)}
								>{`${author.numberOfFriends} friends`}</a>
							) : null}
						</div>
					</div>
				</div>
				<div className="right-section">
					<button className="remove-author-button">Remove</button>
				</div>
			</div>
		);
	};

	const favoriteAuthorsList = loaded ? (
		<div className="favorite-authors-list">
			{reorderInstructionMessage}
			<div className="header">
				<span>Order</span>
				<span>Author</span>
			</div>
			{authors.map((author, index) => generateAuthorCard(author, index))}
			<button className="save-positions-button">Save Position Changes</button>
		</div>
	) : null;

	const mainContentLeftSection = loaded ? (
		<div className="favorite-authors-page-main-content-left-section">
			{pageHeader}
			{authors.length === 0 ? noAuthorsYetMessage : favoriteAuthorsList}
		</div>
	) : null;

	const mainContentRightSection =
		loaded && user !== null ? (
			<div className="favorite-authors-page-main-content-right-section">
				<a
					href={Firebase.pageGenerator.generateUserPage(
						user.userUID,
						user.userInfo.firstName
					)}
				>
					Your profile »
				</a>
			</div>
		) : null;

	const mainContent = (
		<div className="favorite-authors-page-main-content">
			{mainContentLeftSection}
			{mainContentRightSection}
		</div>
	);

	return (
		<div className="favorite-authors-page">
			<TopBar />
			{mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default FavoriteAuthorsPage;
