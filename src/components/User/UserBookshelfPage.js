import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import InteractiveStarRating from './InteractiveStarRating';
import Firebase from '../../Firebase';

// TODO: Implement sorting, add to shelves popup and review more/less buttons, table parameters links

const UserBookshelfPage = ({ match }) => {
	const history = useHistory();
	const {
		params: { pageId },
	} = match;
	const userId = pageId.split('-')[0];
	const userFirstName = pageId.split('-')[1];
	const query = new URLSearchParams(useLocation().search);
	const shelves =
		query.get('shelf') !== null ? query.get('shelf').split(',') : ['all'];
	const order =
		query.get('order') !== null
			? query.get('order') === 'd'
				? 'descending'
				: 'ascending'
			: 'descending';
	const sort = query.get('sort') !== null ? query.get('sort') : 'date-added';
	const perPage =
		query.get('per_page') !== null
			? Number.parseInt(query.get('per_page'))
			: 20;
	const page = query.get('page') !== null ? query.get('page') : 1;
	const view = query.get('view') !== null ? query.get('view') : 'table';
	const searchQuery = query.get('search_query');
	const [loaded, setLoaded] = useState(false);
	const [userInfo, setUserInfo] = useState({});
	const [loggedInUserShelves, setLoggedInUserShelves] = useState([]);

	/*
    userInfo: {
        profilePicture,
        shelves: [{
            name,
            books: [{
                id,
                cover,
                title,
				seriesName,
				seriesInstance,
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
                review,
                loggedInUserRating,
            }],
        }]
    }

	loggedInUserShelves: [{
		name,
		books,
	}]
    */
	const [searchInputText, setSearchInputText] = useState('');
	const [isSettingsTabOpen, setIsSettingsTabOpen] = useState(false);
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
	const [isReviewColumnVisible, setIsReviewColumnVisible] = useState(true);
	const [isShelvesColumnVisible, setIsShelvesColumnVisible] = useState(true);
	const [isTitleColumnVisible, setIsTitleColumnVisible] = useState(false);
	const [isSelectingMultipleShelves, setIsSelectingMultipleShelves] = useState(
		false
	);
	const [selectedColumnSetButton, setSelectedColumnSetButton] = useState('');
	const [tableSortColumn, setTableSortColumn] = useState(sort);
	const [tableSortOrder, setTableSortOrder] = useState(order);

	const user = JSON.parse(localStorage.getItem('userState'));

	const rateBook = async (bookId, rating) => {
		if (user.userUID === undefined || user.userUID === null) {
			history.push({
				pathname: '/user/sign_in',
			});
		} else {
			await Firebase.rateBook(user.userUID, bookId, rating, history);
		}
	};

	const setAllColumns = (
		author,
		avgRating,
		cover,
		dateAdded,
		datePublished,
		datePublishedEdition,
		dateRead,
		dateStarted,
		format,
		isbn,
		numPages,
		numRatings,
		position,
		rating,
		review,
		shelves,
		title
	) => {
		setIsAuthorColumnVisible(author);
		setIsAvgRatingColumnVisible(avgRating);
		setIsCoverColumnVisible(cover);
		setIsDateAddedColumnVisible(dateAdded);
		setIsDatePublicationColumnVisible(datePublished);
		setIsDatePublicationEditionColumnVisible(datePublishedEdition);
		setIsDateReadColumnVisible(dateRead);
		setIsDateStartedColumnVisible(dateStarted);
		setIsFormatColumnVisible(format);
		setIsIsbnColumnVisible(isbn);
		setIsNumPagesColumnVisible(numPages);
		setIsNumRatingsColumnVisible(numRatings);
		setIsPositionColumnVisible(position);
		setIsRatingColumnVisible(rating);
		setIsReviewColumnVisible(review);
		setIsShelvesColumnVisible(shelves);
		setIsTitleColumnVisible(title);
	};

	const noPictureImageUrl =
		'https://s.gr-assets.com/assets/nophoto/user/u_100x100-259587f1619f5253426a4fa6fb508831.png';

	const noCoverUrl =
		'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png';

	const currentUserShelves = loaded
		? shelves.map((shelf) =>
				userInfo.shelves.filter((bookshelf) => bookshelf.name === shelf)
		  )
		: [];

	const booksToBeShown = currentUserShelves.reduce((previous, current) => {
		current.books.forEach((shelfBook) => {
			if (
				!previous.map((book) => book.id).includes(shelfBook.id) &&
				currentUserShelves.every((shelf) =>
					shelf.books.some((b) => b.id === shelfBook.id)
				)
			) {
				previous.push(shelfBook);
			}
		});
		return previous;
	}, []);

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
						isSettingsTabOpen
							? 'settings-toggle-button toggled'
							: 'settings-toggle-button'
					}
					onClick={(_e) => setIsSettingsTabOpen((previous) => !previous)}
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
							className={
								shelves[0] === 'all'
									? 'general-shelf-a selected-shelf'
									: 'general-shelf-a'
							}
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
					<li>
						<a
							className={
								shelves.includes('Read')
									? 'general-shelf-a selected-shelf'
									: 'general-shelf-a'
							}
							href={Firebase.pageGenerator.generateUserShelfPage(
								userId,
								userFirstName,
								['Read']
							)}
						>{`Read (${
							userInfo.shelves.filter((shelf) => shelf.name === 'Read').books
								.length
						})`}</a>
						{isSelectingMultipleShelves ? (
							<a
								className="add-shelf-a"
								href={Firebase.pageGenerator.generateUserShelfPage(
									userId,
									userFirstName,
									!shelves.includes('Read')
										? shelves.concat('Read')
										: shelves.filter((shelf) => shelf !== 'Read')
								)}
							>
								{!shelves.includes('Read') ? '+' : '-'}
							</a>
						) : null}
					</li>
					<li>
						<a
							className={
								shelves.includes('Want To Read')
									? 'general-shelf-a selected-shelf'
									: 'general-shelf-a'
							}
							href={Firebase.pageGenerator.generateUserShelfPage(
								userId,
								userFirstName,
								['Want To Read']
							)}
						>{`Want To Read (${
							userInfo.shelves.filter((shelf) => shelf.name === 'Want To Read')
								.books.length
						})`}</a>
						{isSelectingMultipleShelves ? (
							<a
								className="add-shelf-a"
								href={Firebase.pageGenerator.generateUserShelfPage(
									userId,
									userFirstName,
									!shelves.includes('Want To Read')
										? shelves.concat('Want To Read')
										: shelves.filter((shelf) => shelf !== 'Want To Read')
								)}
							>
								{!shelves.includes('Want To Read') ? '+' : '-'}
							</a>
						) : null}
					</li>
				</ul>
			</div>
			<div className="shelf-group-separator"></div>
			<div className="other-shelves-section">
				<ul>
					{userInfo.shelves
						.filter(
							(shelf) =>
								!['Read', 'Want To Read', 'Currently Reading'].includes(
									shelf.name
								)
						)
						.map((shelf, index) => {
							return (
								<li key={index}>
									<a
										className={
											shelves.includes(shelf.name)
												? 'general-shelf-a selected-shelf'
												: 'general-shelf-a'
										}
										href={Firebase.pageGenerator.generateUserShelfPage(
											userId,
											userFirstName,
											[shelf.name]
										)}
									>{`${shelf.name} (${shelf.books.length})`}</a>
									{isSelectingMultipleShelves ? (
										<a
											className="add-shelf-a"
											href={Firebase.pageGenerator.generateUserShelfPage(
												userId,
												userFirstName,
												!shelves.includes(shelf.name)
													? shelves.concat(shelf.name)
													: shelves.filter((shelf) => shelf !== shelf.name)
											)}
										>
											{!shelves.includes(shelf.name) ? '+' : '-'}
										</a>
									) : null}
								</li>
							);
						})}
				</ul>
				<button
					className="select-multiple-shelves-button"
					onClick={(_e) =>
						setIsSelectingMultipleShelves((previous) => !previous)
					}
				>
					select multiple
				</button>
			</div>
			<div className="shelf-group-separator"></div>
		</div>
	) : null;

	const settingsTab = (
		<div className="user-bookshelf-page-settings-tab">
			<div className="left-section">
				<div className="settings-title">
					<span>
						<b>visible columns</b>
					</span>
					<button
						onClick={(_e) => {
							setAllColumns(
								true,
								true,
								true,
								true,
								true,
								true,
								true,
								true,
								true,
								true,
								true,
								true,
								true,
								true,
								true,
								true,
								true
							);
						}}
					>
						select all
					</button>
				</div>
				<span className="gray-settings-message">
					These settings only apply to table view.
				</span>
				<div className="column-checkboxes">
					<div className="author-column-selection">
						<input
							name="author"
							type="chekbox"
							checked={isAuthorColumnVisible}
							onChange={(e) => {
								setSelectedColumnSetButton('');
								setIsAuthorColumnVisible(e.target.checked);
							}}
						></input>
						<label htmlFor="author">author</label>
					</div>
					<div className="avg-rating-column-selection">
						<input
							name="avg-rating"
							type="chekbox"
							checked={isAvgRatingColumnVisible}
							onChange={(e) => {
								setSelectedColumnSetButton('');
								setIsAvgRatingColumnVisible(e.target.checked);
							}}
						></input>
						<label htmlFor="avg-rating">avg rating</label>
					</div>
					<div className="cover-column-selection">
						<input
							name="cover"
							type="chekbox"
							checked={isCoverColumnVisible}
							onChange={(e) => {
								setSelectedColumnSetButton('');
								setIsCoverColumnVisible(e.target.checked);
							}}
						></input>
						<label htmlFor="cover">cover</label>
					</div>
					<div className="date-added-column-selection">
						<input
							name="date-added"
							type="chekbox"
							checked={isDateAddedColumnVisible}
							onChange={(e) => {
								setSelectedColumnSetButton('');
								setIsDateAddedColumnVisible(e.target.checked);
							}}
						></input>
						<label htmlFor="date-added">date added</label>
					</div>
					<div className="date-publication-column-selection">
						<input
							name="date-publication"
							type="chekbox"
							checked={isDatePublicationColumnVisible}
							onChange={(e) => {
								setSelectedColumnSetButton('');
								setIsDatePublicationColumnVisible(e.target.checked);
							}}
						></input>
						<label htmlFor="date-publication">date pub</label>
					</div>
					<div className="date-publication-edition-column-selection">
						<input
							name="date-publication-edition"
							type="chekbox"
							checked={isDatePublicationEditionColumnVisible}
							onChange={(e) => {
								setSelectedColumnSetButton('');
								setIsDatePublicationEditionColumnVisible(e.target.checked);
							}}
						></input>
						<label htmlFor="date-publication-edition">date pub (ed.)</label>
					</div>
					<div className="date-read-column-selection">
						<input
							name="date-read"
							type="chekbox"
							checked={isDateReadColumnVisible}
							onChange={(e) => {
								setSelectedColumnSetButton('');
								setIsDateReadColumnVisible(e.target.checked);
							}}
						></input>
						<label htmlFor="date-read">date read</label>
					</div>
					<div className="date-started-column-selection">
						<input
							name="date-started"
							type="chekbox"
							checked={isDateStartedColumnVisible}
							onChange={(e) => {
								setSelectedColumnSetButton('');
								setIsDateStartedColumnVisible(e.target.checked);
							}}
						></input>
						<label htmlFor="date-started">date started</label>
					</div>
					<div className="format-column-selection">
						<input
							name="format"
							type="chekbox"
							checked={isFormatColumnVisible}
							onChange={(e) => {
								setSelectedColumnSetButton('');
								setIsFormatColumnVisible(e.target.checked);
							}}
						></input>
						<label htmlFor="format">format</label>
					</div>
					<div className="isbn-column-selection">
						<input
							name="isbn"
							type="chekbox"
							checked={isIsbnColumnVisible}
							onChange={(e) => {
								setSelectedColumnSetButton('');
								setIsIsbnColumnVisible(e.target.checked);
							}}
						></input>
						<label htmlFor="isbn">isbn</label>
					</div>
					<div className="number-of-pages-column-selection">
						<input
							name="number-of-pages"
							type="chekbox"
							checked={isNumPagesColumnVisible}
							onChange={(e) => {
								setSelectedColumnSetButton('');
								setIsNumPagesColumnVisible(e.target.checked);
							}}
						></input>
						<label htmlFor="number-of-pages">num pages</label>
					</div>
					<div className="number-of-ratings-column-selection">
						<input
							name="number-of-ratings"
							type="chekbox"
							checked={isNumRatingsColumnVisible}
							onChange={(e) => {
								setSelectedColumnSetButton('');
								setIsNumRatingsColumnVisible(e.target.checked);
							}}
						></input>
						<label htmlFor="number-of-ratings">num ratings</label>
					</div>
					<div className="position-column-selection">
						<input
							name="position"
							type="chekbox"
							checked={isPositionColumnVisible}
							onChange={(e) => {
								setSelectedColumnSetButton('');
								setIsPositionColumnVisible(e.target.checked);
							}}
						></input>
						<label htmlFor="position">position</label>
					</div>
					<div className="rating-column-selection">
						<input
							name="rating"
							type="chekbox"
							checked={isRatingColumnVisible}
							onChange={(e) => {
								setSelectedColumnSetButton('');
								setIsRatingColumnVisible(e.target.checked);
							}}
						></input>
						<label htmlFor="rating">rating</label>
					</div>
					<div className="review-column-selection">
						<input
							name="review"
							type="chekbox"
							checked={isReviewColumnVisible}
							onChange={(e) => {
								setSelectedColumnSetButton('');
								setIsReviewColumnVisible(e.target.checked);
							}}
						></input>
						<label htmlFor="review">review</label>
					</div>
					<div className="shelves-column-selection">
						<input
							name="shelves"
							type="chekbox"
							checked={isShelvesColumnVisible}
							onChange={(e) => {
								setSelectedColumnSetButton('');
								setIsShelvesColumnVisible(e.target.checked);
							}}
						></input>
						<label htmlFor="shelves">shelves</label>
					</div>
					<div className="title-column-selection">
						<input
							name="title"
							type="chekbox"
							checked={isTitleColumnVisible}
							onChange={(e) => {
								setSelectedColumnSetButton('');
								setIsTitleColumnVisible(e.target.checked);
							}}
						></input>
						<label htmlFor="title">title</label>
					</div>
				</div>
			</div>
			<div className="right-section">
				<span className="column-sets-title">
					<b>column sets</b>
				</span>
				<button
					className={
						selectedColumnSetButton === 'main'
							? 'column-set-button selected'
							: 'column-set-button'
					}
					onClick={(_e) => {
						setSelectedColumnSetButton('main');
						setAllColumns(
							true,
							true,
							true,
							true,
							false,
							false,
							true,
							false,
							false,
							false,
							false,
							false,
							true,
							true,
							false,
							true,
							true
						);
					}}
				>
					main
				</button>
				<button
					className={
						selectedColumnSetButton === 'reading'
							? 'column-set-button selected'
							: 'column-set-button'
					}
					onClick={(_e) => {
						setSelectedColumnSetButton('reading');
						setAllColumns(
							true,
							true,
							true,
							true,
							false,
							false,
							false,
							false,
							false,
							false,
							false,
							false,
							true,
							false,
							false,
							false,
							true
						);
					}}
				>
					reading
				</button>
				<button
					className={
						selectedColumnSetButton === 'list'
							? 'column-set-button selected'
							: 'column-set-button'
					}
					onClick={(_e) => {
						setSelectedColumnSetButton('list');
						setAllColumns(
							true,
							true,
							false,
							true,
							true,
							false,
							true,
							false,
							false,
							false,
							false,
							true,
							true,
							true,
							false,
							false,
							true
						);
					}}
				>
					list
				</button>
				<button
					className={
						selectedColumnSetButton === 'review'
							? 'column-set-button selected'
							: 'column-set-button'
					}
					onClick={(_e) => {
						setSelectedColumnSetButton('review');
						setAllColumns(
							false,
							false,
							true,
							false,
							false,
							false,
							true,
							false,
							false,
							false,
							false,
							false,
							false,
							true,
							true,
							true,
							true
						);
					}}
				>
					review
				</button>
			</div>
			<button
				className="settings-tab-close-button"
				onClick={(_e) => setIsSettingsTabOpen(false)}
			>
				close
			</button>
		</div>
	);

	const booksTable = loaded ? (
		<table className="user-bookshelf-page-books-table">
			<thead>
				<tr>
					{isPositionColumnVisible ? (
						<th
							onClick={(_e) => {
								if (tableSortColumn === 'position') {
									setTableSortOrder((previous) =>
										previous === 'ascending' ? 'descending' : 'ascending'
									);
								} else {
									setTableSortOrder('position');
								}
							}}
						>
							<span>#</span>
							{tableSortColumn === 'position' ? (
								<img
									src={
										tableSortOrder === 'ascending'
											? 'https://s.gr-assets.com/assets/up_arrow-eed7cf633822703667086373e41273eb.gif'
											: 'https://s.gr-assets.com/assets/down_arrow-1e1fa5642066c151f5e0136233fce98a.gif'
									}
									alt={
										tableSortOrder === 'ascending' ? 'Up arrow' : 'Down arrow'
									}
								/>
							) : null}
						</th>
					) : null}
					{isCoverColumnVisible ? (
						<th
							onClick={(_e) => {
								if (tableSortColumn === 'cover') {
									setTableSortOrder((previous) =>
										previous === 'ascending' ? 'descending' : 'ascending'
									);
								} else {
									setTableSortOrder('cover');
								}
							}}
						>
							<span>cover</span>
							{tableSortColumn === 'cover' ? (
								<img
									src={
										tableSortOrder === 'ascending'
											? 'https://s.gr-assets.com/assets/up_arrow-eed7cf633822703667086373e41273eb.gif'
											: 'https://s.gr-assets.com/assets/down_arrow-1e1fa5642066c151f5e0136233fce98a.gif'
									}
									alt={
										tableSortOrder === 'ascending' ? 'Up arrow' : 'Down arrow'
									}
								/>
							) : null}
						</th>
					) : null}
					{isTitleColumnVisible ? (
						<th
							onClick={(_e) => {
								if (tableSortColumn === 'title') {
									setTableSortOrder((previous) =>
										previous === 'ascending' ? 'descending' : 'ascending'
									);
								} else {
									setTableSortOrder('title');
								}
							}}
						>
							<span>title</span>
							{tableSortColumn === 'title' ? (
								<img
									src={
										tableSortOrder === 'ascending'
											? 'https://s.gr-assets.com/assets/up_arrow-eed7cf633822703667086373e41273eb.gif'
											: 'https://s.gr-assets.com/assets/down_arrow-1e1fa5642066c151f5e0136233fce98a.gif'
									}
									alt={
										tableSortOrder === 'ascending' ? 'Up arrow' : 'Down arrow'
									}
								/>
							) : null}
						</th>
					) : null}
					{isAuthorColumnVisible ? (
						<th
							onClick={(_e) => {
								if (tableSortColumn === 'author') {
									setTableSortOrder((previous) =>
										previous === 'ascending' ? 'descending' : 'ascending'
									);
								} else {
									setTableSortOrder('author');
								}
							}}
						>
							<span>author</span>
							{tableSortColumn === 'author' ? (
								<img
									src={
										tableSortOrder === 'ascending'
											? 'https://s.gr-assets.com/assets/up_arrow-eed7cf633822703667086373e41273eb.gif'
											: 'https://s.gr-assets.com/assets/down_arrow-1e1fa5642066c151f5e0136233fce98a.gif'
									}
									alt={
										tableSortOrder === 'ascending' ? 'Up arrow' : 'Down arrow'
									}
								/>
							) : null}
						</th>
					) : null}
					{isIsbnColumnVisible ? (
						<th
							onClick={(_e) => {
								if (tableSortColumn === 'isbn') {
									setTableSortOrder((previous) =>
										previous === 'ascending' ? 'descending' : 'ascending'
									);
								} else {
									setTableSortOrder('isbn');
								}
							}}
						>
							<span>isbn</span>
							{tableSortColumn === 'isbn' ? (
								<img
									src={
										tableSortOrder === 'ascending'
											? 'https://s.gr-assets.com/assets/up_arrow-eed7cf633822703667086373e41273eb.gif'
											: 'https://s.gr-assets.com/assets/down_arrow-1e1fa5642066c151f5e0136233fce98a.gif'
									}
									alt={
										tableSortOrder === 'ascending' ? 'Up arrow' : 'Down arrow'
									}
								/>
							) : null}
						</th>
					) : null}
					{isNumPagesColumnVisible ? (
						<th
							onClick={(_e) => {
								if (tableSortColumn === 'num-pages') {
									setTableSortOrder((previous) =>
										previous === 'ascending' ? 'descending' : 'ascending'
									);
								} else {
									setTableSortOrder('num-pages');
								}
							}}
						>
							<span>num pages</span>
							{tableSortColumn === 'num-pages' ? (
								<img
									src={
										tableSortOrder === 'ascending'
											? 'https://s.gr-assets.com/assets/up_arrow-eed7cf633822703667086373e41273eb.gif'
											: 'https://s.gr-assets.com/assets/down_arrow-1e1fa5642066c151f5e0136233fce98a.gif'
									}
									alt={
										tableSortOrder === 'ascending' ? 'Up arrow' : 'Down arrow'
									}
								/>
							) : null}
						</th>
					) : null}
					{isAvgRatingColumnVisible ? (
						<th
							onClick={(_e) => {
								if (tableSortColumn === 'avg-rating') {
									setTableSortOrder((previous) =>
										previous === 'ascending' ? 'descending' : 'ascending'
									);
								} else {
									setTableSortOrder('avg-rating');
								}
							}}
						>
							<span>avg rating</span>
							{tableSortColumn === 'avg-rating' ? (
								<img
									src={
										tableSortOrder === 'ascending'
											? 'https://s.gr-assets.com/assets/up_arrow-eed7cf633822703667086373e41273eb.gif'
											: 'https://s.gr-assets.com/assets/down_arrow-1e1fa5642066c151f5e0136233fce98a.gif'
									}
									alt={
										tableSortOrder === 'ascending' ? 'Up arrow' : 'Down arrow'
									}
								/>
							) : null}
						</th>
					) : null}
					{isNumRatingsColumnVisible ? (
						<th
							onClick={(_e) => {
								if (tableSortColumn === 'num-ratings') {
									setTableSortOrder((previous) =>
										previous === 'ascending' ? 'descending' : 'ascending'
									);
								} else {
									setTableSortOrder('num-ratings');
								}
							}}
						>
							<span>num ratings</span>
							{tableSortColumn === 'num-ratings' ? (
								<img
									src={
										tableSortOrder === 'ascending'
											? 'https://s.gr-assets.com/assets/up_arrow-eed7cf633822703667086373e41273eb.gif'
											: 'https://s.gr-assets.com/assets/down_arrow-1e1fa5642066c151f5e0136233fce98a.gif'
									}
									alt={
										tableSortOrder === 'ascending' ? 'Up arrow' : 'Down arrow'
									}
								/>
							) : null}
						</th>
					) : null}
					{isDatePublicationColumnVisible ? (
						<th
							onClick={(_e) => {
								if (tableSortColumn === 'date-pub') {
									setTableSortOrder((previous) =>
										previous === 'ascending' ? 'descending' : 'ascending'
									);
								} else {
									setTableSortOrder('date-pub');
								}
							}}
						>
							<span>date pub</span>
							{tableSortColumn === 'date-pub' ? (
								<img
									src={
										tableSortOrder === 'ascending'
											? 'https://s.gr-assets.com/assets/up_arrow-eed7cf633822703667086373e41273eb.gif'
											: 'https://s.gr-assets.com/assets/down_arrow-1e1fa5642066c151f5e0136233fce98a.gif'
									}
									alt={
										tableSortOrder === 'ascending' ? 'Up arrow' : 'Down arrow'
									}
								/>
							) : null}
						</th>
					) : null}
					{isDatePublicationEditionColumnVisible ? (
						<th
							onClick={(_e) => {
								if (tableSortColumn === 'date-pub-ed') {
									setTableSortOrder((previous) =>
										previous === 'ascending' ? 'descending' : 'ascending'
									);
								} else {
									setTableSortOrder('date-pub-ed');
								}
							}}
						>
							<span>date pub (ed.)</span>
							{tableSortColumn === 'date-pub-ed' ? (
								<img
									src={
										tableSortOrder === 'ascending'
											? 'https://s.gr-assets.com/assets/up_arrow-eed7cf633822703667086373e41273eb.gif'
											: 'https://s.gr-assets.com/assets/down_arrow-1e1fa5642066c151f5e0136233fce98a.gif'
									}
									alt={
										tableSortOrder === 'ascending' ? 'Up arrow' : 'Down arrow'
									}
								/>
							) : null}
						</th>
					) : null}
					{isRatingColumnVisible ? (
						<th
							onClick={(_e) => {
								if (tableSortColumn === 'rating') {
									setTableSortOrder((previous) =>
										previous === 'ascending' ? 'descending' : 'ascending'
									);
								} else {
									setTableSortOrder('rating');
								}
							}}
						>
							<span>rating</span>
							{tableSortColumn === 'rating' ? (
								<img
									src={
										tableSortOrder === 'ascending'
											? 'https://s.gr-assets.com/assets/up_arrow-eed7cf633822703667086373e41273eb.gif'
											: 'https://s.gr-assets.com/assets/down_arrow-1e1fa5642066c151f5e0136233fce98a.gif'
									}
									alt={
										tableSortOrder === 'ascending' ? 'Up arrow' : 'Down arrow'
									}
								/>
							) : null}
						</th>
					) : null}
					{isShelvesColumnVisible ? (
						<th className="my-rating-th">my rating</th>
					) : null}
					{isReviewColumnVisible ? (
						<th
							onClick={(_e) => {
								if (tableSortColumn === 'review') {
									setTableSortOrder((previous) =>
										previous === 'ascending' ? 'descending' : 'ascending'
									);
								} else {
									setTableSortOrder('review');
								}
							}}
						>
							<span>review</span>
							{tableSortColumn === 'review' ? (
								<img
									src={
										tableSortOrder === 'ascending'
											? 'https://s.gr-assets.com/assets/up_arrow-eed7cf633822703667086373e41273eb.gif'
											: 'https://s.gr-assets.com/assets/down_arrow-1e1fa5642066c151f5e0136233fce98a.gif'
									}
									alt={
										tableSortOrder === 'ascending' ? 'Up arrow' : 'Down arrow'
									}
								/>
							) : null}
						</th>
					) : null}
					{isDateStartedColumnVisible ? (
						<th
							onClick={(_e) => {
								if (tableSortColumn === 'date-started') {
									setTableSortOrder((previous) =>
										previous === 'ascending' ? 'descending' : 'ascending'
									);
								} else {
									setTableSortOrder('date-started');
								}
							}}
						>
							<span>date started</span>
							{tableSortColumn === 'date-started' ? (
								<img
									src={
										tableSortOrder === 'ascending'
											? 'https://s.gr-assets.com/assets/up_arrow-eed7cf633822703667086373e41273eb.gif'
											: 'https://s.gr-assets.com/assets/down_arrow-1e1fa5642066c151f5e0136233fce98a.gif'
									}
									alt={
										tableSortOrder === 'ascending' ? 'Up arrow' : 'Down arrow'
									}
								/>
							) : null}
						</th>
					) : null}
					{isDateReadColumnVisible ? (
						<th
							onClick={(_e) => {
								if (tableSortColumn === 'date-read') {
									setTableSortOrder((previous) =>
										previous === 'ascending' ? 'descending' : 'ascending'
									);
								} else {
									setTableSortOrder('date-read');
								}
							}}
						>
							<span>date read</span>
							{tableSortColumn === 'date-read' ? (
								<img
									src={
										tableSortOrder === 'ascending'
											? 'https://s.gr-assets.com/assets/up_arrow-eed7cf633822703667086373e41273eb.gif'
											: 'https://s.gr-assets.com/assets/down_arrow-1e1fa5642066c151f5e0136233fce98a.gif'
									}
									alt={
										tableSortOrder === 'ascending' ? 'Up arrow' : 'Down arrow'
									}
								/>
							) : null}
						</th>
					) : null}
					{isDateAddedColumnVisible ? (
						<th
							onClick={(_e) => {
								if (tableSortColumn === 'date-added') {
									setTableSortOrder((previous) =>
										previous === 'ascending' ? 'descending' : 'ascending'
									);
								} else {
									setTableSortOrder('date-added');
								}
							}}
						>
							<span>date added</span>
							{tableSortColumn === 'date-added' ? (
								<img
									src={
										tableSortOrder === 'ascending'
											? 'https://s.gr-assets.com/assets/up_arrow-eed7cf633822703667086373e41273eb.gif'
											: 'https://s.gr-assets.com/assets/down_arrow-1e1fa5642066c151f5e0136233fce98a.gif'
									}
									alt={
										tableSortOrder === 'ascending' ? 'Up arrow' : 'Down arrow'
									}
								/>
							) : null}
						</th>
					) : null}
					{isFormatColumnVisible ? (
						<th
							onClick={(_e) => {
								if (tableSortColumn === 'format') {
									setTableSortOrder((previous) =>
										previous === 'ascending' ? 'descending' : 'ascending'
									);
								} else {
									setTableSortOrder('format');
								}
							}}
						>
							<span>format</span>
							{tableSortColumn === 'format' ? (
								<img
									src={
										tableSortOrder === 'ascending'
											? 'https://s.gr-assets.com/assets/up_arrow-eed7cf633822703667086373e41273eb.gif'
											: 'https://s.gr-assets.com/assets/down_arrow-1e1fa5642066c151f5e0136233fce98a.gif'
									}
									alt={
										tableSortOrder === 'ascending' ? 'Up arrow' : 'Down arrow'
									}
								/>
							) : null}
						</th>
					) : null}
				</tr>
			</thead>
			<tbody>
				{booksToBeShown.length === 0 ? (
					<span className="no-matching-items-span">No matching items!</span>
				) : (
					booksToBeShown.map((book, index) => {
						const authorName =
							book.authorName !== undefined &&
							book.authorName.split(' ').length > 1
								? book.authorName.split(' ').slice(1).join(' ') +
								  ', ' +
								  book.authorName.split(' ')[0]
								: book.authorName;
						return (
							<tr key={index}>
								{isPositionColumnVisible ? (
									<td>
										<span>
											{book.position !== undefined ? book.position : ''}
										</span>
									</td>
								) : null}
								{isCoverColumnVisible ? (
									<td>
										<a
											className="book-cover-wrapper"
											href={Firebase.pageGenerator.generateBookPage(
												book.id,
												book.title
											)}
										>
											<img
												src={book.cover !== undefined ? book.cover : noCoverUrl}
												alt={book.title}
											/>
										</a>
									</td>
								) : null}
								{isTitleColumnVisible ? (
									<td>
										<a
											className="book-title-a"
											href={Firebase.pageGenerator.generateBookPage(
												book.id,
												book.title
											)}
										>
											<span className="book-title-proper">{book.title}</span>
											{book.seriesName !== undefined ? (
												<span className="book-series-span">
													{`(${book.seriesName}, #${book.seriesInstance})`}
												</span>
											) : null}
										</a>
									</td>
								) : null}
								{isAuthorColumnVisible ? (
									<td>
										<a
											className="author-a"
											href={Firebase.pageGenerator.generateAuthorPage(
												book.authorId,
												book.authorName
											)}
										>
											{authorName !== undefined ? authorName : ''}
										</a>
									</td>
								) : null}
								{isIsbnColumnVisible ? (
									<td>
										<span>{book.isbn !== undefined ? book.isbn : ''}</span>
									</td>
								) : null}
								{isNumPagesColumnVisible ? (
									<td>
										{book.numberOfPages !== undefined ? (
											<span className="num-pages-span">
												<span className="black">{book.numberOfPages}</span>
												<span className="gray"> pp</span>
											</span>
										) : null}
									</td>
								) : null}
								{isAvgRatingColumnVisible ? (
									<td>
										<span>{book.averageRating.toFixed(2)}</span>
									</td>
								) : null}
								{isNumRatingsColumnVisible ? (
									<td>
										<span>{book.numberOfRatings}</span>
									</td>
								) : null}
								{isDatePublicationColumnVisible ? (
									<td>
										<span>
											{book.datePublished !== undefined
												? format(book.datePublished, 'MMM dd, yyyy')
												: ''}
										</span>
									</td>
								) : null}
								{isDatePublicationEditionColumnVisible ? (
									<td>
										<span>
											{book.datePublishedEdition !== undefined
												? format(book.datePublishedEdition, 'MMM dd, yyyy')
												: ''}
										</span>
									</td>
								) : null}
								{isRatingColumnVisible ? (
									<td>
										<div className="rating-stars">
											<div
												className={
													book.rating >= 1
														? 'static-star small full'
														: book.rating >= 0.5
														? 'static-star small almost-full'
														: book.rating > 0
														? 'static-star small almost-empty'
														: 'static-star small empty'
												}
											></div>
											<div
												className={
													book.rating >= 2
														? 'static-star small full'
														: book.rating >= 1.5
														? 'static-star small almost-full'
														: book.rating > 1
														? 'static-star small almost-empty'
														: 'static-star small empty'
												}
											></div>
											<div
												className={
													book.rating >= 3
														? 'static-star small full'
														: book.rating >= 2.5
														? 'static-star small almost-full'
														: book.rating > 2
														? 'static-star small almost-empty'
														: 'static-star small empty'
												}
											></div>
											<div
												className={
													book.rating >= 4
														? 'static-star small full'
														: book.rating >= 3.5
														? 'static-star small almost-full'
														: book.rating > 3
														? 'static-star small almost-empty'
														: 'static-star small empty'
												}
											></div>
											<div
												className={
													book.rating >= 5
														? 'static-star small full'
														: book.rating >= 4.5
														? 'static-star small almost-full'
														: book.rating > 4
														? 'static-star small almost-empty'
														: 'static-star small empty'
												}
											></div>
										</div>
									</td>
								) : null}
								{isShelvesColumnVisible ? (
									<td>
										<InteractiveStarRating
											rating={
												book.loggedInUserRating !== undefined
													? book.loggedInUserRating
													: 0
											}
											saveRating={(rating) => rateBook(book.id, rating)}
										/>
										<button className="add-to-shelves-button">
											{loggedInUserShelves.some((shelf) =>
												shelf.books.includes(book.id)
											)
												? 'edit shelves'
												: 'add to shelves'}
										</button>
									</td>
								) : null}
								{isReviewColumnVisible ? (
									<td>
										<span>{book.review !== undefined ? book.review : ''}</span>
										{book.review !== undefined && book.review.length > 150 ? (
											<button className="review-more-less-button">
												...more
											</button>
										) : null}
									</td>
								) : null}
								{isDateStartedColumnVisible ? (
									<td>
										<span>
											{book.dateStarted !== undefined
												? format(book.dateStarted, 'MMM dd, yyyy')
												: ''}
										</span>
									</td>
								) : null}
								{isDateReadColumnVisible ? (
									<td>
										<span>
											{book.dateRead !== undefined
												? format(book.dateRead, 'MMM dd, yyyy')
												: ''}
										</span>
									</td>
								) : null}
								{isDateAddedColumnVisible ? (
									<td>
										<span>
											{book.dateAdded !== undefined
												? format(book.dateAdded, 'MMM dd, yyyy')
												: ''}
										</span>
									</td>
								) : null}
								{isFormatColumnVisible ? (
									<td>
										<span>{book.format}</span>
									</td>
								) : null}
							</tr>
						);
					})
				)}
			</tbody>
		</table>
	) : null;

	const tableParametersSection = (
		<div className="user-bookshelf-page">
			<div className="per-page-parameter">
				<label htmlFor="per-page">per page</label>
				<select name="per-page" value={perPage.toString()}>
					<option>10</option>
					<option>20</option>
					<option>30</option>
					<option>40</option>
					<option>50</option>
					<option>75</option>
					<option>100</option>
					<option>infinite scroll</option>
				</select>
			</div>
		</div>
	);

	return (
		<div className="user-bookshelf-page">
			<TopBar />
			<HomePageFootBar />
		</div>
	);
};

export default UserBookshelfPage;
