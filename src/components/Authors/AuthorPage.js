import React, { useState, useEffect, useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';

const AuthorPage = ({ match }) => {
	const history = useHistory();
	const {
		params: { authorPageId },
	} = match;
	const followAuthorDropdown = useRef();
	const followAuthorDropdownTrigger = useRef();
	const authorId = authorPageId.split('.')[0];
	const authorName = authorPageId.split('.')[1].replace(/_/g, ' ');
	const authorFirstName = authorName.split(' ')[0];
	const [loaded, setLoaded] = useState(false);
	const [authorInfo, setAuthorInfo] = useState({});
	const [nowAuthorInFavorites, setNowAuthorInFavorites] = useState(false);
	const [nowAuthorNotInFavorites, setNowAuthorNotInFavorites] = useState(false);
	const [
		followAuthorDropdownVisible,
		setFollowAuthorDropdownVisible,
	] = useState(false);
	const [isShowingAuthorRatingStats, setIsShowingAuthorRatingStats] = useState(
		false
	);
	const [authorDescriptionShowMore, setAuthorDescriptionShowMore] = useState(
		false
	);

	const user = JSON.parse(localStorage.getItem('userState'));
	/* 
        authorInfo: {
            GRMember,
            placeOfBirth,
            dateOfBirth,
            influences: [{
                id,
                name,
            }],
            website,
            twitter,
            genre,
            memberSince,
            description,
            profilePicture,
            numberOfRatings,
            numberOfReviews,
            averageRating,
            followers: [{
                id,
                name,
                profilePicture,
            }],
            mostFollowedPosition,
            reviewerPosition,
            usersWhoHaveAsFavorite,
            numberOfReadBooks,
            numberOfToReadBooks,
            numberOfReadingBooks,
            numberOfFavoriteBooks,
            friends: [{
                id,
                name,
                profilePicture,
                numberOfBooks,
                numberOfFriends,
            }],
            booksByAuthor: [{
                title,
                series,
                seriesInstance,
                cover,
                userStatus,
                userRating,
                averageRating,
                ratings,
                publishedYear,
                editions,
                numberOfReviews,
            }],
            seriesByAuthor: [{
                title,
                books: [{
                    id,
                    seriesInstance,
                    cover,
                }],
                averageRating,
                numberOfRatings,
            }],
            relatedNews: [{
                id,
                title,
                content,
                numberOfLikes,
            }],
            updates: [{
                date,
                action,
                book: {
                    id,
                    title,
                    authorId,
                    authorName,
                    authorIsMember,
                    cover,
                    userStatus,
                    userRating,
                },
                review,
            }],
            quotes: [{
                id,
                content,
                bookTitle,
                tags,
                usersWhoLiked,
            }],
            favoriteAuthors: [{
                id,
                name,
                bestBookId,
                bestBookTitle,
            }],
        }
    */

	useEffect(() => {
		document.addEventListener('click', (event) => {
			if (
				followAuthorDropdown.current !== null &&
				followAuthorDropdown.current !== undefined &&
				followAuthorDropdownTrigger.current !== null &&
				followAuthorDropdownTrigger.current !== undefined &&
				!followAuthorDropdown.current.contains(event.target) &&
				!followAuthorDropdownTrigger.current.contains(event.target)
			) {
				setFollowAuthorDropdownVisible(false);
			}
		});
	}, []);

	const authorBooksAverageRating =
		loaded && authorInfo.booksByAuthor.length > 0
			? authorInfo.booksByAuthor.reduce(
					(previous, current) =>
						previous + current.averageRating / authorInfo.booksByAuthor.length,
					0
			  )
			: 0;
	const authorBooksTotalRatings = loaded
		? authorInfo.booksByAuthor.reduce(
				(previous, current) => previous + current.ratings,
				0
		  )
		: 0;
	const authorBooksNumberOfReviews = loaded
		? authorInfo.booksByAuthor.reduce(
				(previous, current) => previous + current.numberOfReviews,
				0
		  )
		: 0;

	const followButtonAndDropdown = loaded ? (
		<div className="follow-button-and-dropdown">
			<button
				className="follow-author-button"
				onClick={async (_e) => {
					await Firebase.followUnfollowAuthor(
						user !== null ? user.userUID : null,
						authorId,
						history
					);
					setAuthorInfo((previous) => {
						return {
							...previous,
							followers:
								user !== null &&
								previous.followers
									.map((follower) => follower.id)
									.includes(user.userUID)
									? previous.followers.filter(
											(follower) => follower.id !== user.userUID
									  )
									: user !== null
									? previous.followers.concat({
											id: user.userUID,
											name: user.userInfo.firstName,
											profilePicture:
												user.userInfo.profilePicture !== undefined
													? user.userInfo.profilePicture
													: 'https://www.goodreads.com/assets/nophoto/user/u_60x60-267f0ca0ea48fd3acfd44b95afa64f01.png',
									  })
									: previous.followers,
						};
					});
				}}
				onMouseOver={(_e) => {
					if (
						user !== null &&
						!authorInfo.followers
							.map((follower) => follower.id)
							.includes(user.userUID)
					) {
						document.getElementsByClassName(
							'follow-author-button'
						)[0].innerHTML = 'Unfollow';
					}
				}}
				onMouseOut={(_e) => {
					if (
						user !== null &&
						!authorInfo.followers
							.map((follower) => follower.id)
							.includes(user.userUID)
					) {
						document.getElementsByClassName(
							'follow-author-button'
						)[0].innerHTML = 'Following';
					}
				}}
			>
				{user === null ||
				user.userUID === undefined ||
				authorInfo.followers
					.map((follower) => follower.id)
					.includes(user.userUID)
					? 'Follow Author'
					: 'Following'}
			</button>
			<div
				className="follow-author-dropdown-trigger"
				onClick={(_e) => {
					setFollowAuthorDropdownVisible((previous) => !previous);
				}}
				ref={followAuthorDropdownTrigger}
			>
				<div
					className={
						followAuthorDropdownVisible
							? 'follow-author-dropdown'
							: 'follow-author-dropdown hidden'
					}
					ref={followAuthorDropdown}
				>
					<ul>
						<li>
							<a
								href={Firebase.pageGenerator.generateUserCompareBooksPage(
									authorId
								)}
							>
								Compare books
							</a>
						</li>
						<li>
							<button
								onClick={async (_e) => {
									await Firebase.addRemoveAuthorToFavorites(
										user.userUID,
										authorId,
										history
									);
									if (
										user !== null &&
										authorInfo.usersWhoHaveAsFavorite.includes(user.userUID)
									) {
										setAuthorInfo((previous) => {
											return {
												...previous,
												usersWhoHaveAsFavorite: previous.usersWhoHaveAsFavorite.filter(
													(user) => user !== user.userUID
												),
											};
										});
										setNowAuthorInFavorites(false);
										setNowAuthorNotInFavorites(true);
									} else {
										if (user !== null) {
											setAuthorInfo((previous) => {
												return {
													...previous,
													usersWhoHaveAsFavorite: previous.usersWhoHaveAsFavorite.concat(
														user.userUID
													),
												};
											});
											setNowAuthorInFavorites(true);
											setNowAuthorNotInFavorites(false);
										}
									}
								}}
							>
								{user === null ||
								!authorInfo.usersWhoHaveAsFavorite.includes(user.userUID)
									? 'Add to my favorite authors'
									: 'Remove from my favorite authors'}
							</button>
						</li>
						<li>
							<a href={Firebase.pageGenerator.generateFavoriteAuthorsPage()}>
								Edit my favorite authors
							</a>
						</li>
					</ul>
				</div>
			</div>
		</div>
	) : null;

	const photoAndStatsArea = loaded ? (
		<div className="author-page-photo-and-stats-area">
			<div className="top-section">
				<div className="profile-picture-section">
					<img
						src={
							authorInfo.profilePicture !== undefined
								? authorInfo.profilePicture
								: 'https://www.goodreads.com/assets/nophoto/user/u_60x60-267f0ca0ea48fd3acfd44b95afa64f01.png'
						}
						alt={authorName}
					/>
					{authorInfo.GRMember ? (
						<div className="author-stats">
							<a
								href={Firebase.pageGenerator.generateUserRatingsPage(authorId)}
							>{`${authorInfo.numberOfRatings} ratings`}</a>
							<span>|</span>
							<a
								href={Firebase.pageGenerator.generateUserReviewsPage(authorId)}
							>{`${authorInfo.numberOfReviews} reviews`}</a>
							<span>|</span>
							<button
								onClick={(_e) => setIsShowingAuthorRatingStats(true)}
							>{`avg rating:${Math.round(
								authorInfo.averageRating,
								2
							)}`}</button>
							<div
								className={
									isShowingAuthorRatingStats
										? 'author-rating-stats'
										: 'author-rating-stats hidden'
								}
							>
								{/* Rating stats */}
							</div>
						</div>
					) : null}
				</div>
				{followButtonAndDropdown}
			</div>
			<div className="bottom-section">
				<span>{`#${authorInfo.mostFollowedPosition} most followed`}</span>
				<span>{`#${authorInfo.reviewerPosition} best reviewers`}</span>
			</div>
		</div>
	) : null;

	const yearInBooksSection =
		loaded && authorInfo.GRMember ? (
			<div className="author-page-year-in-books-section">
				<a
					className="section-title"
					href={Firebase.pageGenerator.generateUserYearInBooksPage(
						new Date().getFullYear(),
						authorId
					)}
				>{`${authorFirstName.toUpperCase()}'S YEAR IN BOOKS`}</a>
				<div className="inner-content">
					<a
						className="image-wrapper"
						href={Firebase.pageGenerator.generateUserYearInBooksPage(
							new Date().getFullYear(),
							authorId
						)}
					>
						<img
							src={
								'https://s.gr-assets.com/assets/yyib/yearly/yyib_badge-58c13ce9eeb35da7dda8dcf63aba2962.jpg'
							}
							alt="Year in books"
						/>
					</a>
					<div className="year-in-books-right-section">
						<span>
							<b>{`${authorFirstName}'s ${new Date().getFullYear()} Year in Books`}</b>
						</span>
						<span>{`Take a look at ${authorFirstName}'s Year in Books. The long, the short—it’s all here.`}</span>
						<a
							href={Firebase.pageGenerator.generateUserYearInBooksPage(
								new Date().getFullYear(),
								authorId
							)}
						>{`See ${authorFirstName}'s ${new Date().getFullYear()} Year in Books`}</a>
					</div>
				</div>
			</div>
		) : null;

	const followersSection = loaded ? (
		<div className="author-page-followers-section">
			<span className="section-title">{`${authorName.toUpperCase()}'S FOLLOWERS (${
				authorInfo.followers.length
			})`}</span>
			{authorInfo.followers.length > 0 ? (
				<div className="follower-list">
					{authorInfo.followers.map((follower, index) => {
						return (
							<a
								href={Firebase.pageGenerator.generateUserPage(follower.id)}
								key={index}
							>
								<img src={follower.profilePicture} alt={follower.name} />
							</a>
						);
					})}
				</div>
			) : (
				<span className="no-followers-span">None yet</span>
			)}
		</div>
	) : null;

	const bookshelvesSection =
		loaded && authorInfo.GRMember ? (
			<div className="author-page-bookshelves-section">
				<a
					className="section-title"
					href={Firebase.pageGenerator.generateUserBooksPage(authorId)}
				>{`${authorFirstName.toUpperCase()}'S BOOKSHELVES`}</a>
				<div className="shelf-list">
					<a
						href={Firebase.pageGenerator.generateUserShelfPage(
							authorId,
							authorFirstName,
							'read'
						)}
					>{`read (${authorInfo.numberOfReadBooks})`}</a>
					<a
						href={Firebase.pageGenerator.generateUserShelfPage(
							authorId,
							authorFirstName,
							'reading'
						)}
					>{`currently-reading (${authorInfo.numberOfReadingBooks})`}</a>
					<a
						href={Firebase.pageGenerator.generateUserShelfPage(
							authorId,
							authorFirstName,
							'to-read'
						)}
					>{`to-read (${authorInfo.numberOfToReadBooks})`}</a>
					<a
						href={Firebase.pageGenerator.generateUserShelfPage(
							authorId,
							authorFirstName,
							'favorites'
						)}
					>{`favorites (${authorInfo.numberOfFavoriteBooks})`}</a>
				</div>
			</div>
		) : null;

	const friendsSection =
		loaded && authorInfo.GRMember && authorInfo.friends.length > 0 ? (
			<div className="author-page-friends-section">
				<span className="section-title">{`${authorFirstName.toUpperCase}'S FRIENDS`}</span>
				<div className="friend-list">
					{authorInfo.friends.map((friend, index) => {
						return (
							<div className="friend-card" key={index}>
								<a
									className="profile-picture-wrapper"
									href={Firebase.pageGenerator.generateAuthorPage(
										friend.id,
										friend.name
									)}
								>
									<img
										src={
											friend.profilePicture !== undefined
												? friend.profilePicture
												: 'https://www.goodreads.com/assets/nophoto/user/u_60x60-267f0ca0ea48fd3acfd44b95afa64f01.png'
										}
										alt={friend.name}
									/>
								</a>
								<div className="right-section">
									<a
										href={Firebase.pageGenerator.generateAuthorPage(
											friend.id,
											friend.name
										)}
									>
										{friend.name}
									</a>
									<div className="friend-stats">
										<span>{`${friend.numberOfBooks} books`}</span>
										<span className="sepator">|</span>
										<span>{`${friend.numberOfFriends} friends`}</span>
									</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		) : null;

	const mainContentLeftSection = (
		<div className="author-page-main-content-left-section">
			{photoAndStatsArea}
			{yearInBooksSection}
			{followersSection}
			{bookshelvesSection}
			{friendsSection}
		</div>
	);

	const authorMainInfoSection = loaded ? (
		<div className="author-page-author-main-info-section">
			<div className="author-name-area">
				<span className="author-name">{authorName}</span>
				{authorInfo.GRMember ? (
					<div className="goodreads-seal-area">
						<div className="goodreads-seal"></div>
						<span>Goodreads Author</span>
					</div>
				) : null}
			</div>
			<table className="author-info-table">
				<tbody>
					{authorInfo.placeOfBirth !== undefined ||
					authorInfo.dateOfBirth !== undefined ? (
						<tr>
							<th>Born</th>
							{authorInfo.placeOfBirth !== undefined ? (
								<td>{`in ${authorInfo.placeOfBirth}`}</td>
							) : null}
							{authorInfo.dateOfBirth !== undefined ? (
								<td>{`${format(authorInfo.dateOfBirth, 'MMMM dd, yyyy')}`}</td>
							) : null}
						</tr>
					) : null}
					{authorInfo.website !== undefined ? (
						<tr>
							<th>Website</th>
							<td>
								<a href={authorInfo.website}>{authorInfo.website}</a>
							</td>
						</tr>
					) : null}
					{authorInfo.twitter !== undefined ? (
						<tr>
							<th>Twitter</th>
							<td>
								<a href={authorInfo.twitter}>{authorInfo.twitter}</a>
							</td>
						</tr>
					) : null}
					{authorInfo.genre !== undefined ? (
						<tr>
							<th>Genre</th>
							<td>
								{authorInfo.genre.map((genre, index) => {
									return (
										<span className="author-genre">
											<a
												key={index}
												href={Firebase.pageGenerator.generateGenrePage(genre)}
											>
												{genre}
											</a>
											{index !== authorInfo.genre.length - 1 ? (
												<span>,</span>
											) : null}
										</span>
									);
								})}
							</td>
						</tr>
					) : null}
					{authorInfo.influences !== undefined ? (
						<tr>
							<td>
								{authorInfo.influences.map((influence, index) => {
									return (
										<span className="author-influence">
											<a
												key={index}
												href={Firebase.pageGenerator.generateAuthorPage(
													influence.id
												)}
											>
												{influence.name}
											</a>
											{index !== authorInfo.influences.length - 1 ? (
												<span>,</span>
											) : null}
										</span>
									);
								})}
							</td>
						</tr>
					) : null}
					{authorInfo.memberSince !== undefined ? (
						<tr>
							<th>Member Since</th>
							<td>{format(authorInfo.memberSince, 'MMMM yyyy')}</td>
						</tr>
					) : null}
				</tbody>
			</table>
			{authorInfo.description !== undefined ? (
				<div
					className={
						authorDescriptionShowMore
							? 'author-description-area more'
							: 'author-description-area'
					}
				>
					<p>{authorInfo.description}</p>
					<button
						className="author-description-show-more-button"
						onClick={(_e) =>
							setAuthorDescriptionShowMore((previous) => previous)
						}
					>
						{authorDescriptionShowMore ? '(less)' : '...more'}
					</button>
				</div>
			) : null}
		</div>
	) : null;

	const authorBooksSection = loaded ? (
		<div className="author-page-author-books-section">
			<span className="section-title">{`${authorName.toUpperCase()}'S BOOKS`}</span>
			<div className="author-books-stats">
				<span>{`Average rating: ${Math.round(
					authorBooksAverageRating,
					2
				)}`}</span>
				<span className="separator">·</span>
				<span>{`${authorBooksTotalRatings} ratings`}</span>
				<span className="separator">·</span>
				<span>{`${authorBooksNumberOfReviews} reviews`}</span>
			</div>
		</div>
	) : null;

	const mainContentRightSection = (
		<div className="author-page-main-content-right-section">
			{authorMainInfoSection}
			{authorBooksSection}
		</div>
	);

	const mainContent = (
		<div className="author-page-main-content">
			{mainContentLeftSection}
			{mainContentRightSection}
		</div>
	);

	return (
		<div className="author-page">
			<TopBar />
			{mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default AuthorPage;
