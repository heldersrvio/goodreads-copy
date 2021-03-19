import React, { useState, useEffect } from 'react';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';
import '../styles/Authors/FavoriteAuthorsForUserPage.css';

const FavoriteAuthorsForUserPage = ({ match }) => {
	const {
		params: { userId },
	} = match;
	const [loaded, setLoaded] = useState(false);
	const [userInfo, setUserInfo] = useState({});
	/*
    userInfo: {
        firstName,
        authors: [{
            profilePicture,
            id,
            userId,
            name,
            bestBookId,
            bestBookTitle,
            rootBookCount,
            numberOfShelvedBooks,
            numberOfFriends,
            numberOfMemberReviews,
            numberOfFollowers,
        }]
    }
    */

	const user = JSON.parse(localStorage.getItem('userState'));

	useEffect(() => {
		const getUserInfo = async () => {
			setUserInfo(
				await Firebase.getUserInfoForFavoriteAuthorsForUserPage(userId)
			);
			/*setUserInfo({
                firstName: 'Rick',
                authors: [
                    {
                        id: '1234',
                        userId: '1234',
                        name: 'Suzanne Collins',
                        bestBookId: '123',
                        bestBookTitle: 'The Hunger Games',
                        rootBookCount: 31,
                        numberOfMemberReviews: 16425835,
                        numberOfFollowers: 86109,
                    },
                    {
                        profilePicture: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/authors/1562922774i/33467._UX150_CR0,36,150,150_RO75,1,255,255,255,255,255,255,15_.jpg',
                        id: '1234',
                        userId: '1234',
                        name: 'Jonathan Stroud',
                        bestBookId: '123',
                        bestBookTitle: 'The Amulet of Samarkand',
                        rootBookCount: 49,
                        numberOfShelvedBooks: 13,
                        numberOfFriends: 0,
                        numberOfMemberReviews: 699161,
                        numberOfFollowers: 7970,
                    },
                    {
                        profilePicture: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/authors/1254336426i/10896._UX150_CR0,37,150,150_RO75,1,255,255,255,255,255,255,15_.jpg',
                        id: '1234',
                        userId: '1234',
                        name: 'Eoin Colfer',
                        bestBookId: '123',
                        bestBookTitle: 'Artemis Fowl',
                        rootBookCount: 119,
                        numberOfMemberReviews: 2284983,
                        numberOfFollowers: 10235,
                    },
                    {
                        profilePicture: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/authors/1263049167i/6244._UX150_CR0,37,150,150_RO75,1,255,255,255,255,255,255,15_.jpg',
                        id: '1234',
                        userId: '1234',
                        name: 'Ridley Pearson',
                        bestBookId: '123',
                        bestBookTitle: 'Disney After Dark',
                        rootBookCount: 117,
                        numberOfMemberReviews: 510982,
                        numberOfFollowers: 1748,
                    },
                ],
            });*/
			setLoaded(true);
		};
		getUserInfo();
	}, [userId]);

	const pageHeader = loaded ? (
		<h1 className="favorite-authors-for-user-page-header">{`${
			user !== null && user.userUID === userId
				? 'Your'
				: `${userInfo.firstName}'s`
		} Favorite Authors`}</h1>
	) : null;

	const noAuthorsYetSpan = (
		<span className="no-authors-yet-span">None yet.</span>
	);

	const authorList = loaded ? (
		<div className="favorite-authors-page-author-list">
			{userInfo.authors.map((author, index) => {
				return (
					<div className="favorite-author-card" key={index}>
						<div className="left-section">
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
												: 'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/nophoto/user/m_700x933._UX150_CR0,25,150,150_RO75,1,255,255,255,255,255,255,15_.png'
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
										<span>Author of </span>
										<a
											href={Firebase.pageGenerator.generateBookPage(
												author.bestBookId,
												author.bestBookTitle
											)}
										>
											{author.bestBookTitle}
										</a>
										<span> and </span>
										<a
											href={Firebase.pageGenerator.generateAuthorPage(
												author.id,
												author.name
											)}
										>{`${author.rootBookCount - 1} more books`}</a>
									</span>
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
							<span>{`${author.numberOfMemberReviews} member reviews`}</span>
							<span>{`${author.numberOfFollowers} followers`}</span>
						</div>
					</div>
				);
			})}
		</div>
	) : null;

	const mainContentLeftSection = (
		<div className="favorite-authors-for-user-page-main-content-left-section">
			{pageHeader}
			{loaded && userInfo.authors.length === 0 ? noAuthorsYetSpan : authorList}
		</div>
	);

	const mainContentRightSection = loaded ? (
		<div className="favorite-authors-for-user-page-main-content-right-section">
			<a
				href={Firebase.pageGenerator.generateUserPage(
					userId,
					userInfo.firstName
				)}
			>{`${userInfo.firstName}'s profile`}</a>
			<a href={Firebase.pageGenerator.generateFavoriteAuthorsPage()}>
				Manage your favorite authors »
			</a>
		</div>
	) : null;

	const mainContent = (
		<div className="favorite-authors-for-user-page-main-content">
			{mainContentLeftSection}
			{mainContentRightSection}
		</div>
	);

	return (
		<div className="favorite-authors-for-user-page">
			<TopBar />
			{mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default FavoriteAuthorsForUserPage;
