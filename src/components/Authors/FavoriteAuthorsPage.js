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
	const [isSaving, setIsSaving] = useState(false);
	const [showingErrorMessage, setShowingErrorMessage] = useState(false);
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
		const getAuthorsInfo = async () => {
			const authorArray = await Firebase.fetchUserFavoriteAuthors(
				user.userUID,
				history
			);
			setAuthors(authorArray);
			setOrderInputs(
				authorArray.map((_author, index) => (index + 1).toString())
			);
			setLoaded(true);
		};
		getAuthorsInfo();
	}, [user.userUID, history]);

	useEffect(() => {
		const saveFavoriteAuthorList = async () => {
			if (loaded) {
				setIsSaving(true);
				await Firebase.changeFavoriteAuthors(
					user.userUID,
					authors.map((author) => author.id)
				);
				setIsSaving(false);
			}
		};

		saveFavoriteAuthorList();
	}, [user.userUID, authors, loaded]);

	const reorganizeFavoriteAuthorList = () => {
		if (
			orderInputs.some(
				(input) => Number.isNaN(parseInt(input)) || parseInt(input) <= 0
			)
		) {
			setShowingErrorMessage(true);
			setOrderInputs((previous) =>
				previous.map((_input, index) => (index + 1).toString())
			);
		} else {
			setShowingErrorMessage(false);
			setAuthors((previous) =>
				previous
					.map((_author, index) => index)
					.sort((a, b) => orderInputs[a] - orderInputs[b])
					.map((index) => previous[index])
			);
		}
	};

	const removeAuthor = (index) => {
		if (
			window.confirm(
				`Are you sure you want remove ${authors[index].name} from your list of favorite authors?`
			)
		) {
			setAuthors((previous) => previous.filter((_author, i) => i !== index));
		}
	};

	const errorMessage = (
		<div className="error-message-container">
			<span className="error-message">
				Please use positive whole numbers for positions.
			</span>
			<button
				className="close-message-button"
				onClick={(_e) => setShowingErrorMessage(false)}
			/>
		</div>
	);

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
			<div
				className="favorite-authors-page-author-card"
				key={index}
				draggable="true"
				onDragStart={(e) => {
					e.dataTransfer.setData('index', index.toString());
				}}
				onDragOver={(e) => e.preventDefault()}
				onDrop={(e) => {
					e.preventDefault();
					const newIndex = parseInt(e.dataTransfer.getData('index'));
					if (!Number.isNaN(newIndex)) {
						setAuthors((previous) =>
							previous.map((author, i) =>
								i === newIndex
									? previous[index]
									: i === index
									? previous[newIndex]
									: author
							)
						);
					}
				}}
			>
				<div className="left-section">
					{!isSaving ? (
						<input
							type="text"
							className="order-input"
							value={orderInputs[index]}
							onChange={(e) => {
								const newValue = e.target.value;
								setOrderInputs((previous) => {
									return previous.map((value, i) =>
										i === index ? newValue : value
									);
								});
							}}
						></input>
					) : (
						<img
							className="loading-spinner"
							src={
								'https://s.gr-assets.com/assets/loading-45f04d682f1e9151cf1e6fb18a1bde21.gif'
							}
							alt="Loading"
						/>
					)}
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
					<button
						className="remove-author-button"
						onClick={() => removeAuthor(index)}
					>
						Remove
					</button>
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
			<button
				className="save-positions-button"
				onClick={() => {
					reorganizeFavoriteAuthorList();
				}}
			>
				Save Position Changes
			</button>
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
			{showingErrorMessage ? errorMessage : null}
			{mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default FavoriteAuthorsPage;
