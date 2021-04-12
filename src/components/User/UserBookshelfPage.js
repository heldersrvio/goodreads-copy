import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';

const UserBookshelfPage = ({ match }) => {
	const history = useHistory();
	const {
		params: { pageId },
	} = match;
	const userId = pageId.split('-')[0];
	const userFirstName = pageId.split('-')[1];
	const query = new URLSearchParams(useLocation().search);
	const shelves =
		query.get('shelf') !== null ? query.get('shelf').split(',') : 'all';
	const page = query.get('page') !== null ? query.get('page') : 1;
	const view = query.get('view') !== null ? query.get('view') : 'table';
	const searchQuery = query.get('search_query');
	const [loaded, setLoaded] = useState(false);
	const [userInfo, setUserInfo] = useState({});

	/*
    userInfo: {
        profilePicture,
        shelves: [{
            name,
            books: [{
                id,
                cover,
                title,
                authorId,
                authorName,
                averageRating,
                dateAdded,
                datePublished,
                datePublishedEdition,
                dateRead,
                dateStarted,
                format,
                isbn,
                numberOfPages,
                numberOfRatings,
                position,
                rating,
                readCount,
                review,
                loggedInUserRating,
                loggedInUserHasInShelves,
            }],
        }]
    }
    */
	const [searchInputText, setSearchInputText] = useState('');
	const [isSettingsWindowOpen, setIsSettingsWindowOpen] = useState(false);
	const [columnSet, setColumnSet] = useState('');
	const [isAuthorColumnVisible, setIsAuthorColumnVisible] = useState(true);
	const [isAvgRatingColumnVisible, setIsAvgRatingColumnVisible] = useState(
		true
	);
	const [isCoverColumnVisible, setIsCoverColumnVisible] = useState(true);
	const [isDateAddedColumnVisible, setIsDateAddedColumnVisible] = useState(
		true
	);
	const [
		isDatePublicationColumnVisible,
		setIsDatePublicationColumnVisible,
	] = useState(false);
	const [
		isDatePublicationEditionColumnVisible,
		setIsDatePublicationEditionColumnVisible,
	] = useState(false);
	const [isDateReadColumnVisible, setIsDateReadColumnVisible] = useState(true);
	const [isDateStartedColumnVisible, setIsDateStartedColumnVisible] = useState(
		false
	);
	const [isFormatColumnVisible, setIsFormatColumnVisible] = useState(false);
	const [isIsbnColumnVisible, setIsIsbnColumnVisible] = useState(false);
	const [isNumPagesColumnVisible, setIsNumPagesColumnVisible] = useState(false);
	const [isNumRatingsColumnVisible, setIsNumRatingsColumnVisible] = useState(
		false
	);
	const [isPositionColumnVisible, setIsPositionColumnVisible] = useState(false);
	const [isRatingColumnVisible, setIsRatingColumnVisible] = useState(true);
	const [isReadCountColumnVisible, setIsReadCountColumnVisible] = useState(
		false
	);
	const [isReviewColumnVisible, setIsReviewColumnVisible] = useState(true);
	const [isShelvesColumnVisible, setIsShelvesColumnVisible] = useState(true);
	const [isTitleColumnVisible, setIsTitleColumnVisible] = useState(false);
	const [isSelectingMultipleShelves, setIsSelectingMultipleShelves] = useState(
		false
	);

	const noPictureImageUrl =
		'https://s.gr-assets.com/assets/nophoto/user/u_100x100-259587f1619f5253426a4fa6fb508831.png';

	const currentUserShelves = shelves.map((shelf) =>
		userInfo.shelves.filter((bookshelf) => bookshelf.name === shelf)
	);

	const shelvesTopBar = loaded ? (
		<div className="user-bookshelf-page-shelves-top-bar">
			<div className="left-section">
				<h1>
					<a
						className="profile-picture-a"
						href={Firebase.pageGenerator.generateUserPage(
							userId,
							userFirstName
						)}
					>
						<img
							src={
								userInfo.profilePicture !== undefined
									? userInfo.profilePicture
									: noPictureImageUrl
							}
							alt={userFirstName}
						/>
					</a>
					<a
						className="first-name-a"
						href={Firebase.pageGenerator.generateUserPage(
							userId,
							userFirstName
						)}
					>
						{userFirstName}
					</a>
					<span className="separator">{' > '}</span>
					<a
						className="books-a"
						href={Firebase.pageGenerator.generateUserShelfPage(
							userId,
							userFirstName,
							['all']
						)}
					>
						Books
					</a>
					{shelves[0] !== 'all' ? <span className="colon-span">:</span> : null}
					{shelves[0] !== 'all'
						? shelves.map((shelf, index) => {
								return (
									<div className="shelf-selection-indicator-wrapper">
										<div className="shelf-selection-indicator" key={index}>
											<span>
												<span className="shelf-name-span">{shelf}</span>
												<span className="shelf-number-span">{` (${
													currentUserShelves[index].length === 0
														? 0
														: currentUserShelves[index][0].books.length
												}) `}</span>
											</span>
											<a
												className="deselect-a"
												href={Firebase.pageGenerator.generateUserShelfPage(
													userId,
													userFirstName,
													shelves.filter((bookshelf) => bookshelf !== shelf)
												)}
											>
												<img
													src="https://s.gr-assets.com/assets/layout/delete-small-d4ae0181ae7f3438c6eb1f1c658e6002.png"
													alt="Remove shelf filter"
												/>
											</a>
										</div>
										{index !== shelves.length - 1 ? (
											<span className="shelf-separator-span">{'&'}</span>
										) : null}
									</div>
								);
						  })
						: null}
				</h1>
			</div>
			<div className="right-section">
				<div className="search-bar-container">
					<input
						type="text"
						className="search-bar"
						placeholder="Search and add books"
						value={searchInputText}
						onChange={(e) => setSearchInputText(e.target.value)}
					></input>
					<a
						className="search-magnifying-glass-a"
						href={Firebase.pageGenerator.generateUserShelfWithSearchTermPage(
							userId,
							userFirstName,
							searchInputText
						)}
					>
						<img
							alt="search"
							src="https://s.gr-assets.com/assets/layout/magnifying_glass-a2d7514d50bcee1a0061f1ece7821750.png"
						/>
					</a>
				</div>
				<a
					className="compare-books-a"
					href={Firebase.pageGenerator.generateUserCompareBooksPage(userId)}
				>
					Compare Books
				</a>
				<button
					className={
						isSettingsWindowOpen
							? 'settings-toggle-button toggled'
							: 'settings-toggle-button'
					}
					onClick={(_e) => setIsSettingsWindowOpen((previous) => !previous)}
				>
					Settings
				</button>
				<span className="separator">|</span>
				<a
					className={view === 'table' ? 'view-type-a selected' : 'view-type-a'}
					href={
						searchQuery !== null
							? Firebase.pageGenerator.generateUserShelfWithSearchTermPage(
									userId,
									userFirstName,
									searchQuery,
									'table'
							  )
							: Firebase.pageGenerator.generateUserShelfPage(
									userId,
									userFirstName,
									shelves,
									'table'
							  )
					}
				>
					<img
						alt="Table View"
						src="https://s.gr-assets.com/assets/layout/list-fe412c89a6a612c841b5b58681660b82.png"
					/>
				</a>
				<a
					className={view === 'cover' ? 'view-type-a selected' : 'view-type-a'}
					href={
						searchQuery !== null
							? Firebase.pageGenerator.generateUserShelfWithSearchTermPage(
									userId,
									userFirstName,
									searchQuery,
									'cover'
							  )
							: Firebase.pageGenerator.generateUserShelfPage(
									userId,
									userFirstName,
									shelves,
									'cover'
							  )
					}
				>
					<img
						alt="Cover View"
						src="https://s.gr-assets.com/assets/layout/grid-2c030bffe1065f73ddca41540e8a267d.png"
					/>
				</a>
			</div>
		</div>
	) : null;

	const bookshelfNavigationSection = loaded ? (
		<div className="user-bookshelf-page-bookshelf-navigation-section">
			<div className="general-shelves-section">
				<span className="title-span">
					<b>Bookshelves</b>
				</span>
				<ul>
					<li>
						<a
							className="general-shelf-a"
							href={Firebase.pageGenerator.generateUserShelfPage(
								userId,
								userFirstName,
								['all']
							)}
						>{`All (${
							userInfo.shelves.filter((shelf) => shelf.name === 'all').books
								.length
						})`}</a>
					</li>
				</ul>
			</div>
		</div>
	) : null;

	return (
		<div className="user-bookshelf-page">
			<TopBar />
			<HomePageFootBar />
		</div>
	);
};

export default UserBookshelfPage;
