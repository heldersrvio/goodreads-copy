import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import InteractiveStarRating from './InteractiveStarRating';
import Firebase from '../../Firebase';
import '../styles/User/UserBookshelfPage.css';
import AddToShelvesPopup from './AddToShelvesPopup';
import UserReviewSection from './UserReviewSection';
import TopAlertMessage from '../Global/TopAlertMessage';
import EditableBookshelfDateField from './EditableBookshelfDateField';

const UserBookshelfPage = ({ match }) => {
	const openAddShelvesPopup = useRef();
	const history = useHistory();
	const {
		params: { pageId },
	} = match;
	const userId = pageId.split('-')[0];
	const userFirstName =
		pageId.split('-')[1][0].toUpperCase() + pageId.split('-')[1].slice(1);
	const query = new URLSearchParams(useLocation().search);
	const shelves =
		query.get('shelf') !== null && query.get('shelf') !== undefined
			? query.get('shelf').split(',')
			: ['all'];
	const order =
		query.get('order') !== null && query.get('order') !== undefined
			? query.get('order') === 'd'
				? 'descending'
				: 'ascending'
			: 'descending';
	const sort =
		query.get('sort') !== null && query.get('sort') !== undefined
			? query.get('sort')
			: 'date-added';
	const perPage =
		query.get('per_page') !== null && query.get('per_page') !== undefined
			? query.get('per_page')
			: 20;
	const page =
		query.get('page') !== null && query.get('page') !== undefined
			? parseInt(query.get('page'))
			: 1;
	const view =
		query.get('view') !== null && query.get('view') !== undefined
			? query.get('view')
			: 'table';
	const searchQuery =
		query.get('search_query') !== null &&
		query.get('search_query') !== undefined
			? query.get('search_query')
			: '';
	const [loaded, setLoaded] = useState(false);
	const [userInfo, setUserInfo] = useState({});
	const [loggedInUserShelves, setLoggedInUserShelves] = useState([]);

	const topMessage = useLocation().state;

	/*
    userInfo: {
        profilePicture,
        shelves: [{
            name,
            books: [{
                id,
				rootId,
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
		books: [
			id,
			rootId,
		],
	}]
    */
	const [searchInputText, setSearchInputText] = useState(searchQuery);
	const [isSettingsTabOpen, setIsSettingsTabOpen] = useState(false);
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
	const [visibleAddToShelvesPopup, setVisibleAddToShelvesPopup] = useState(
		null
	);
	const [
		isShowingLoggedInUserAddShelfArea,
		setIsShowingLoggedInUserAddShelfArea,
	] = useState(false);
	const [loggedInUserAddShelfInput, setLoggedInUserAddShelfInput] = useState(
		''
	);
	const [batchEditSelectedShelf, setBatchEditSelectedShelf] = useState('read');
	const [isShowingBatchEdit, setIsShowingBatchEdit] = useState(false);
	const [booksChecked, setBooksChecked] = useState([]);
	const [batchEditLoadingButton, setBatchEditLoadingButton] = useState(null);
	const [wantToReadBooksPositionInputs, setWantToReadBooksPositionInputs] = useState([]);
	const [savePositionChangesVisiblePopup, setSavePositionChangesVisiblePopup] = useState(null);
	const [savingPositions, setSavingPositions] = useState(false);

	const user = JSON.parse(localStorage.getItem('userState')) !== null ? JSON.parse(localStorage.getItem('userState')) : { userUID: null, };

	useLayoutEffect(() => {
		document.addEventListener('click', (event) => {
			if (
				!(
					openAddShelvesPopup.current === null ||
					(openAddShelvesPopup.current !== null &&
						openAddShelvesPopup.current !== undefined &&
						openAddShelvesPopup.current.contains(event.target))
				) &&
				event.target.className !== 'add-new-shelf-span'
			) {
				setVisibleAddToShelvesPopup(null);
			}
		});
	}, []);

	useEffect(() => {
		const getUsersInfo = async () => {
			/*setUserInfo({
				profilePicture:
					'https://pbs.twimg.com/profile_images/1018676952629219328/IAnErcp1.jpg',
				shelves: [
					{
						name: 'all',
						books: Array(30)
							.fill(0)
							.map((_value, index) => {
								return {
									id: index.toString(),
									rootId: index.toString(),
									cover:
										'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1605574715l/55077642._SY75_.jpg',
									title: "She Wouldn't Change a Thing",
									authorId: '123',
									authorName: 'Sarah Adlakha',
									averageRating: 4.36,
									dateAdded: new Date(2020, 2, 10),
									datePublished: new Date(2018, 2, 1),
									datePublishedEdition: new Date(2018, 2, 1),
									dateRead: new Date(2020, 3, 10),
									dateStarted: new Date(2020, 2, 15),
									format: 'Paperback',
									isbn: 1250774551,
									numberOfPages: 304,
									numberOfRatings: 53,
									rating: 3,
									review: 'It was alright',
								};
							}) /*[
							{
								id: '1',
								rootId: '1',
								cover:
									'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1605574715l/55077642._SY75_.jpg',
								title: "She Wouldn't Change a Thing",
								authorId: '123',
								authorName: 'Sarah Adlakha',
								averageRating: 4.36,
								dateAdded: new Date(2020, 2, 10),
								datePublished: new Date(2018, 2, 1),
								datePublishedEdition: new Date(2018, 2, 1),
								dateRead: new Date(2020, 3, 10),
								dateStarted: new Date(2020, 2, 15),
								format: 'Paperback',
								isbn: 1250774551,
								numberOfPages: 304,
								numberOfRatings: 53,
								rating: 3,
								review: 'It was alright',
							},
							{
								id: '2',
								rootId: '1',
								cover:
									'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1608476881l/55711715._SX50_.jpg',
								title: 'The Perfect Family',
								authorId: '123',
								authorName: 'Robyn Harding',
								averageRating: 4.14,
								dateAdded: new Date(2020, 3, 10),
								datePublished: new Date(2018, 3, 10),
								datePublishedEdition: new Date(2018, 3, 19),
								dateRead: new Date(2020, 3, 10),
								dateStarted: new Date(2020, 3, 10),
								format: 'Hardcover',
								isbn: 1982169397,
								numberOfPages: 352,
								numberOfRatings: 126,
								rating: 4,
								review: 'It was great',
							},
							{
								id: '3',
								rootId: '1',
								cover:
									'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1601039560l/54304220.jpg',
								title: 'Under the Southern Sky',
								authorId: '123',
								authorName: 'Kristy Woodson Harvey',
								averageRating: 4.5,
								dateAdded: new Date(2010, 3, 10),
								datePublished: new Date(2009, 3, 10),
								datePublishedEdition: new Date(2009, 3, 18),
								dateRead: new Date(2010, 3, 10),
								dateStarted: new Date(2010, 3, 10),
								format: 'Hardcover',
								isbn: 1982117729,
								numberOfPages: 400,
								numberOfRatings: 327,
								rating: 1,
								review: 'It was terrible',
							},
							{
								id: '4',
								rootId: '1',
								cover:
									'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1510367389l/36573115._SX318_.jpg',
								title: 'The Anointed',
								seriesName: 'Red Proxy',
								seriesInstance: 3,
								authorId: '123',
								authorName: 'Keith Ward',
								averageRating: 3.77,
								dateAdded: new Date(2018, 7, 20),
								datePublished: new Date(2017, 10, 10),
								datePublishedEdition: new Date(2017, 10, 10),
								dateRead: new Date(2017, 10, 10),
								dateStarted: new Date(2017, 10, 5),
								format: 'ebook',
								numberOfRatings: 35,
								rating: 2,
								review: 'I could not take this book seriously at all.',
							},
							{
								id: '5',
								rootId: '1',
								cover:
									'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1362762309l/17249467.jpg',
								title: 'Shaman: A Novel of the Ice Age',
								authorId: '123',
								authorName: 'Kim Stanley Robinson',
								averageRating: 3.93,
								dateAdded: new Date(2013, 1, 26),
								datePublished: new Date(2013, 5, 4),
								datePublishedEdition: new Date(2013, 5, 4),
								format: 'Hardcover',
								numberOfRatings: 255031,
								position: 1,
							},
							{
								id: '6',
								rootId: '1',
								cover:
									'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1530054954l/59._SY475_.jpg',
								title: 'The Challenging Sea',
								authorId: '123',
								authorName: 'Patricia A. McKillip',
								averageRating: 4.07,
								dateAdded: new Date(2013, 3, 10),
								datePublished: new Date(1988, 9, 1),
								datePublishedEdition: new Date(2003, 3, 14),
								format: 'Paperback',
								numberOfRatings: 5043,
								position: 2,
							},
						],/,
					},
					{
						name: 'read',
						books: Array(30)
							.fill(0)
							.map((_value, index) => {
								return {
									id: index.toString(),
									rootId: index.toString(),
									cover:
										'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1605574715l/55077642._SY75_.jpg',
									title: "She Wouldn't Change a Thing",
									authorId: '123',
									authorName: 'Sarah Adlakha',
									averageRating: 4.36,
									dateAdded: new Date(2020, 2, 10),
									datePublished: new Date(2018, 2, 1),
									datePublishedEdition: new Date(2018, 2, 1),
									dateRead: new Date(2020, 3, 10),
									dateStarted: new Date(2020, 2, 15),
									format: 'Paperback',
									isbn: 1250774551,
									numberOfPages: 304,
									numberOfRatings: 53,
									rating: 3,
									review: 'It was alright',
								};
							})[
							{
								id: '1',
								rootId: '1',
								cover:
									'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1605574715l/55077642._SY75_.jpg',
								title: "She Wouldn't Change a Thing",
								authorId: '123',
								authorName: 'Sarah Adlakha',
								averageRating: 4.36,
								dateAdded: new Date(2020, 2, 10),
								datePublished: new Date(2018, 2, 1),
								datePublishedEdition: new Date(2018, 2, 1),
								dateRead: new Date(2020, 3, 10),
								dateStarted: new Date(2020, 2, 15),
								format: 'Paperback',
								isbn: 1250774551,
								numberOfPages: 304,
								numberOfRatings: 53,
								rating: 3,
								review: 'It was alright',
							},
							{
								id: '2',
								rootId: '1',
								cover:
									'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1608476881l/55711715._SX50_.jpg',
								title: 'The Perfect Family',
								authorId: '123',
								authorName: 'Robyn Harding',
								averageRating: 4.14,
								dateAdded: new Date(2020, 3, 10),
								datePublished: new Date(2018, 3, 10),
								datePublishedEdition: new Date(2018, 3, 19),
								dateRead: new Date(2020, 3, 10),
								dateStarted: new Date(2020, 3, 10),
								format: 'Hardcover',
								isbn: 1982169397,
								numberOfPages: 352,
								numberOfRatings: 126,
								rating: 4,
								review: 'It was great',
							},
							{
								id: '3',
								rootId: '1',
								cover:
									'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1601039560l/54304220.jpg',
								title: 'Under the Southern Sky',
								authorId: '123',
								authorName: 'Kristy Woodson Harvey',
								averageRating: 4.5,
								dateAdded: new Date(2010, 3, 10),
								datePublished: new Date(2009, 3, 10),
								datePublishedEdition: new Date(2009, 3, 18),
								dateRead: new Date(2010, 3, 10),
								dateStarted: new Date(2010, 3, 10),
								format: 'Hardcover',
								isbn: 1982117729,
								numberOfPages: 400,
								numberOfRatings: 327,
								rating: 1,
								review: 'It was terrible',
							},
						],/,
					},
					{
						name: 'currently-reading',
						books: [] /* [
							{
								id: '4',
								rootId: '1',
								cover:
									'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1510367389l/36573115._SX318_.jpg',
								title: 'The Anointed',
								seriesName: 'Red Proxy',
								seriesInstance: 3,
								authorId: '123',
								authorName: 'Keith Ward',
								averageRating: 3.77,
								dateAdded: new Date(2018, 7, 20),
								datePublished: new Date(2017, 10, 10),
								datePublishedEdition: new Date(2017, 10, 10),
								dateRead: new Date(2017, 10, 10),
								dateStarted: new Date(2017, 10, 5),
								format: 'ebook',
								numberOfRatings: 35,
								rating: 2,
								review: 'I could not take this book seriously at all.',
							},
						],/,
					},
					{
						name: 'want-to-read',
						books: [] /*[
							{
								id: '5',
								rootId: '1',
								cover:
									'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1362762309l/17249467.jpg',
								title: 'Shaman: A Novel of the Ice Age',
								authorId: '123',
								authorName: 'Kim Stanley Robinson',
								averageRating: 3.93,
								dateAdded: new Date(2013, 1, 26),
								datePublished: new Date(2013, 5, 4),
								datePublishedEdition: new Date(2013, 5, 4),
								format: 'Hardcover',
								numberOfRatings: 255031,
								position: 1,
							},
							{
								id: '6',
								rootId: '1',
								cover:
									'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1530054954l/59._SY475_.jpg',
								title: 'The Challenging Sea',
								authorId: '123',
								authorName: 'Patricia A. McKillip',
								averageRating: 4.07,
								dateAdded: new Date(2013, 3, 10),
								datePublished: new Date(1988, 9, 1),
								datePublishedEdition: new Date(2003, 3, 14),
								format: 'Paperback',
								numberOfRatings: 5043,
								position: 2,
							},
						],/,
					},
					/*{
						name: 'fantasy',
						books: [
							{
								id: '6',
								rootId: '1',
								cover:
									'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1530054954l/59._SY475_.jpg',
								title: 'The Challenging Sea',
								authorId: '123',
								authorName: 'Patricia A. McKillip',
								averageRating: 4.07,
								dateAdded: new Date(2013, 3, 10),
								datePublished: new Date(1988, 9, 1),
								datePublishedEdition: new Date(2003, 3, 14),
								format: 'Paperback',
								numberOfRatings: 5043,
								position: 2,
							},
							{
								id: '4',
								rootId: '1',
								cover:
									'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1510367389l/36573115._SX318_.jpg',
								title: 'The Anointed',
								seriesName: 'Red Proxy',
								seriesInstance: 3,
								authorId: '123',
								authorName: 'Keith Ward',
								averageRating: 3.77,
								dateAdded: new Date(2018, 7, 20),
								datePublished: new Date(2017, 10, 10),
								datePublishedEdition: new Date(2017, 10, 10),
								dateRead: new Date(2017, 10, 10),
								dateStarted: new Date(2017, 10, 5),
								format: 'ebook',
								numberOfRatings: 35,
								rating: 2,
								review: 'I could not take this book seriously at all.',
							},
						],
					},
					{
						name: 'womens-literature',
						books: [
							{
								id: '1',
								rootId: '1',
								cover:
									'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1605574715l/55077642._SY75_.jpg',
								title: "She Wouldn't Change a Thing",
								authorId: '123',
								authorName: 'Sarah Adlakha',
								averageRating: 4.36,
								dateAdded: new Date(2020, 2, 10),
								datePublished: new Date(2018, 2, 1),
								datePublishedEdition: new Date(2018, 2, 1),
								dateRead: new Date(2020, 3, 10),
								dateStarted: new Date(2020, 2, 15),
								format: 'Paperback',
								isbn: 1250774551,
								numberOfPages: 304,
								numberOfRatings: 53,
								rating: 3,
								review: 'It was alright',
							},
							{
								id: '2',
								rootId: '1',
								cover:
									'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1608476881l/55711715._SX50_.jpg',
								title: 'The Perfect Family',
								authorId: '123',
								authorName: 'Robyn Harding',
								averageRating: 4.14,
								dateAdded: new Date(2020, 3, 10),
								datePublished: new Date(2018, 3, 10),
								datePublishedEdition: new Date(2018, 3, 19),
								dateRead: new Date(2020, 3, 10),
								dateStarted: new Date(2020, 3, 10),
								format: 'Hardcover',
								isbn: 1982169397,
								numberOfPages: 352,
								numberOfRatings: 126,
								rating: 4,
								review: 'It was great',
							},
						],
					},/
				],
			});*/
			/*setLoggedInUserShelves([
				{
					name: 'read',
					books: [
						{
							id: '1',
							rootId: '1',
						},
						{
							id: '6',
							rootId: '6',
						},
					],
				},
				{
					name: 'currently-reading',
					books: [
						{
							id: '10',
							rootId: '10',
						},
						{
							id: '15',
							rootId: '15',
						},
					],
				},
				{
					name: 'want-to-read',
					books: [
						{
							id: '2',
							rootId: '2',
						},
					],
				},
			]);*/
			const newUserInfo = await Firebase.queryUserInfoForUserBookshelfPage(userId, user.userUID);
			setUserInfo(newUserInfo);
			setLoggedInUserShelves(
				await Firebase.queryLoggedInUserInfoForUserBookshelfPage(user.userUID)
			);
			setWantToReadBooksPositionInputs(newUserInfo.shelves.filter((shelf) => shelf.name === 'want-to-read')[0].books.map((book) => book.position));
			setLoaded(true);
		};
		getUsersInfo();
	}, [userId, user.userUID]);

	const rateBook = async (bookId, rating) => {
		if (user.userUID === undefined || user.userUID === null) {
			history.push('/user/sign_in');
		} else {
			await Firebase.rateBook(user.userUID, bookId, rating, history);
		}
	};

	const addShelf = async (shelfName) => {
		if (user.userUID !== undefined && user.userUID !== null) {
			await Firebase.addNewUserShelf(user.userUID, shelfName, history);
			history.go(0);
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
		? searchQuery.length > 0
			? userInfo.shelves.filter((shelf) => shelf.name === 'all')
			: shelves
					.map((shelf) => {
						return userInfo.shelves.filter(
							(bookshelf) => bookshelf.name === shelf
						).length > 0
							? userInfo.shelves.filter(
									(bookshelf) => bookshelf.name === shelf
							  )[0]
							: null;
					})
					.filter((obj) => obj !== null)
		: [];

	const booksToBeShown =
		searchQuery.length > 0
			? currentUserShelves.reduce((previous, current) => {
					current.books.forEach((book) => {
						if (
							!previous.includes(book) &&
							(book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
								book.authorName
									.toLowerCase()
									.includes(searchQuery.toLowerCase()))
						) {
							previous.push(book);
						}
					});
					return previous;
			  }, [])
			: currentUserShelves.length > 0
			? currentUserShelves.reduce((previous, current) => {
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
			  }, [])
			: loaded
			? userInfo.shelves.reduce((previous, current) => {
					current.books.forEach((shelfBook) => {
						if (
							!previous.map((book) => book.id).includes(shelfBook.id) &&
							(shelfBook.title
								.toLowerCase()
								.includes(searchQuery.toLowerCase()) ||
								shelfBook.authorName
									.toLowerCase()
									.includes(searchQuery.toLowerCase()))
						) {
							previous.push(shelfBook);
						}
					});
					return previous;
			  }, [])
			: [];

	const alertMessage = (
		<TopAlertMessage color='yellow' content={topMessage} />
	);

	const shelvesTopBarLeftSection = (
		<div className="left-section">
			<h1>
				<a
					className={userId === user.userUID ? 'profile-picture-a hidden' : 'profile-picture-a'}
					href={Firebase.pageGenerator.generateUserPage(userId, userFirstName)}
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
					className={userId === user.userUID ? 'first-name-a hidden' : 'first-name-a'}
					href={Firebase.pageGenerator.generateUserPage(userId, userFirstName)}
				>
					{userFirstName}
				</a>
				<span className={userId === user.userUID ? 'separator hidden' : 'separator'}>{' > '}</span>
				<a
					className="books-a"
					href={Firebase.pageGenerator.generateUserShelfPage(
						userId,
						userFirstName,
						['all']
					)}
				>
					{userId === user.userUID ? 'My Books' : 'Books'}
				</a>
				{currentUserShelves.length > 0 &&
				currentUserShelves[0].name !== 'all' ? (
					<span className="colon-span">:</span>
				) : null}
				{currentUserShelves.length > 0 && currentUserShelves[0].name !== 'all'
					? currentUserShelves.map((shelf, index) => {
							return (
								<div className="shelf-selection-indicator-wrapper" key={index}>
									<div className="shelf-selection-indicator">
										<span>
											<span className="shelf-name-span">
												{['read', 'want-to-read', 'currently-reading'].includes(
													shelf.name
												)
													? shelf.name
															.split('-')
															.map(
																(portion) =>
																	portion[0].toUpperCase() + portion.slice(1)
															)
															.join(' ')
													: shelf.name}
											</span>
											<span className="shelf-number-span">{` (${shelf.books.length}) `}</span>
										</span>
										<a
											className="deselect-a"
											href={Firebase.pageGenerator.generateUserShelfPage(
												userId,
												userFirstName,
												shelves.filter((bookshelf) => bookshelf !== shelf.name),
												'',
												'table',
												20,
												1
											)}
										>
											<img
												src="https://s.gr-assets.com/assets/layout/delete-small-d4ae0181ae7f3438c6eb1f1c658e6002.png"
												alt="Remove shelf filter"
											/>
										</a>
									</div>
									{index !== currentUserShelves.length - 1 ? (
										<span className="shelf-separator-span">{'&'}</span>
									) : null}
								</div>
							);
					  })
					: null}
			</h1>
		</div>
	);

	const shelvesTopBarRightSection = (
		<div className="right-section">
			<div className="search-bar-container">
				<input
					type="text"
					className="search-bar"
					placeholder="Search and add books"
					value={searchInputText}
					onChange={(e) => setSearchInputText(e.target.value)}
					onKeyDown={(e) => {
						console.log(e.keyCode);
						if (e.keyCode === 13) {
							history.push(
								Firebase.pageGenerator.generateUserShelfPage(
									userId,
									userFirstName,
									['all'],
									searchInputText,
									'table',
									perPage,
									1
								)
							);
						}
					}}
				></input>
				<a
					className="search-magnifying-glass-a"
					href={Firebase.pageGenerator.generateUserShelfPage(
						userId,
						userFirstName,
						['all'],
						searchInputText,
						'table',
						perPage,
						1
					)}
				>
					<img
						alt="search"
						src="https://s.gr-assets.com/assets/layout/magnifying_glass-a2d7514d50bcee1a0061f1ece7821750.png"
					/>
				</a>
			</div>
			{userId !== user.userUID ? (
				<a
					className="compare-books-a"
					href={Firebase.pageGenerator.generateUserCompareBooksPage(userId)}
				>
					Compare Books
				</a>
			) : null}
			{userId === user.userUID ? (
				<button
					className={
						isShowingBatchEdit
							? 'batch-edit-toggle-button toggled'
							: 'batch-edit-toggle-button'
					}
					onClick={(_e) => {
						setIsSettingsTabOpen(false);
						setIsShowingBatchEdit((previous) => !previous);
					}}
				>
					Batch Edit
				</button>
			) : null}
			<button
				className={
					isSettingsTabOpen
						? 'settings-toggle-button toggled'
						: 'settings-toggle-button'
				}
				onClick={(_e) => {
					setIsShowingBatchEdit(false);
					setIsSettingsTabOpen((previous) => !previous);
				}}
			>
				Settings
			</button>
			<span className="separator">|</span>
			<a
				className="view-type-a"
				href={
					searchQuery !== ''
						? Firebase.pageGenerator.generateUserShelfPage(
								userId,
								userFirstName,
								['all'],
								searchQuery,
								'table',
								perPage,
								1
						  )
						: Firebase.pageGenerator.generateUserShelfPage(
								userId,
								userFirstName,
								shelves,
								'',
								'table',
								perPage,
								1
						  )
				}
			>
				<img
					onMouseOver={(e) => {
						e.target.src =
							'https://s.gr-assets.com/assets/layout/list_selected.png';
					}}
					onMouseOut={(e) => {
						if (view === 'cover') {
							e.target.src =
								'https://s.gr-assets.com/assets/layout/list-fe412c89a6a612c841b5b58681660b82.png';
						}
					}}
					alt="Table View"
					src={
						view === 'table'
							? 'https://s.gr-assets.com/assets/layout/list_selected.png'
							: 'https://s.gr-assets.com/assets/layout/list-fe412c89a6a612c841b5b58681660b82.png'
					}
				/>
			</a>
			<a
				className="view-type-a"
				href={
					searchQuery !== ''
						? Firebase.pageGenerator.generateUserShelfPage(
								userId,
								userFirstName,
								['all'],
								searchQuery,
								'cover',
								perPage,
								1
						  )
						: Firebase.pageGenerator.generateUserShelfPage(
								userId,
								userFirstName,
								shelves,
								'',
								'cover',
								perPage,
								1
						  )
				}
			>
				<img
					onMouseOver={(e) => {
						e.target.src =
							'https://s.gr-assets.com/assets/layout/grid_selected.png';
					}}
					onMouseOut={(e) => {
						if (view === 'table') {
							e.target.src =
								'https://s.gr-assets.com/assets/layout/grid-2c030bffe1065f73ddca41540e8a267d.png';
						}
					}}
					alt="Cover View"
					src={
						view === 'cover'
							? 'https://s.gr-assets.com/assets/layout/grid_selected.png'
							: 'https://s.gr-assets.com/assets/layout/grid-2c030bffe1065f73ddca41540e8a267d.png'
					}
				/>
			</a>
		</div>
	);

	const shelvesTopBar = loaded ? (
		<div className="user-bookshelf-page-shelves-top-bar">
			{shelvesTopBarLeftSection}
			{shelvesTopBarRightSection}
		</div>
	) : null;

	const yourReadingActivitySession =
		userId === user.userUID ? (
			<div className="your-reading-activity-section">
				<span>
					<b>Your reading activity</b>
				</span>
				<a
					href={Firebase.pageGenerator.generateUserYearInBooksPage(
						new Date().getFullYear(),
						userId
					)}
				>
					Year in Books
				</a>
			</div>
		) : null;

	const addBooksSection =
		userId === user.userUID ? (
			<div className="add-books-section">
				<span>
					<b>Add books</b>
				</span>
				<a href={Firebase.pageGenerator.generateRecommendationsPage()}>
					Recommendations
				</a>
				<a href={Firebase.pageGenerator.generateExplorePage()}>Explore</a>
			</div>
		) : null;

	const addShelfInputArea = isShowingLoggedInUserAddShelfArea ? (
		<div className="logged-in-user-add-shelf-input-area">
			<label htmlFor="logged-in-user-add-shelf-input">Add a Shelf:</label>
			<div className="input-and-button">
				<input
					type="text"
					value={loggedInUserAddShelfInput}
					onChange={(e) => setLoggedInUserAddShelfInput(e.target.value)}
				></input>
				<button
					className="add-button"
					onClick={(_e) => {
						if (loggedInUserAddShelfInput.length > 0) {
							addShelf(loggedInUserAddShelfInput);
						}
					}}
				>
					add
				</button>
			</div>
		</div>
	) : (
		<button
			className="logged-in-user-add-shelf-button"
			onClick={(_e) => setIsShowingLoggedInUserAddShelfArea(true)}
		>
			Add shelf
		</button>
	);

	const addShelfArea = userId === user.userUID ? addShelfInputArea : null;

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
								shelves.length === 0 || shelves[0] === 'all'
									? 'general-shelf-a selected-shelf'
									: 'general-shelf-a'
							}
							href={Firebase.pageGenerator.generateUserShelfPage(
								userId,
								userFirstName,
								['all'],
								'',
								view,
								perPage,
								1
							)}
						>{`All (${
							userInfo.shelves.filter((shelf) => shelf.name === 'all')[0].books
								.length
						})`}</a>
					</li>
					<li>
						<a
							className={
								shelves.includes('read')
									? 'general-shelf-a selected-shelf'
									: 'general-shelf-a'
							}
							href={Firebase.pageGenerator.generateUserShelfPage(
								userId,
								userFirstName,
								['read'],
								'',
								view,
								perPage,
								1
							)}
						>{`Read (${
							userInfo.shelves.filter((shelf) => shelf.name === 'read')[0].books
								.length
						})`}</a>
						{isSelectingMultipleShelves ? (
							<a
								className="add-shelf-a"
								href={Firebase.pageGenerator.generateUserShelfPage(
									userId,
									userFirstName,
									!shelves.includes('read')
										? shelves.concat('read')
										: shelves.filter((shelf) => shelf !== 'read'),
									'',
									view,
									perPage,
									1
								)}
							>
								{!shelves.includes('read') ? '+' : '−'}
							</a>
						) : null}
					</li>
					<li>
						<a
							className={
								shelves.includes('want-to-read')
									? 'general-shelf-a selected-shelf'
									: 'general-shelf-a'
							}
							href={Firebase.pageGenerator.generateUserShelfPage(
								userId,
								userFirstName,
								['want-to-read'],
								'',
								view,
								perPage,
								1
							)}
						>{`Want To Read (${
							userInfo.shelves.filter(
								(shelf) => shelf.name === 'want-to-read'
							)[0].books.length
						})`}</a>
						{isSelectingMultipleShelves ? (
							<a
								className="add-shelf-a"
								href={Firebase.pageGenerator.generateUserShelfPage(
									userId,
									userFirstName,
									!shelves.includes('want-to-read')
										? shelves.concat('want-to-read')
										: shelves.filter((shelf) => shelf !== 'want-to-read'),
									'',
									view,
									perPage,
									1
								)}
							>
								{!shelves.includes('want-to-read') ? '+' : '−'}
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
								!['read', 'want-to-read', 'currently-reading', 'all'].includes(
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
											[shelf.name],
											'',
											view,
											perPage,
											1
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
													: shelves.filter((shelf) => shelf !== shelf.name),
												'',
												view,
												perPage,
												1
											)}
										>
											{!shelves.includes(shelf.name) ? '+' : '−'}
										</a>
									) : null}
								</li>
							);
						})}
				</ul>
				{currentUserShelves.length > 0 &&
				currentUserShelves[0].name !== 'all' ? (
					<button
						className="select-multiple-shelves-button"
						onClick={(_e) =>
							setIsSelectingMultipleShelves((previous) => !previous)
						}
					>
						select multiple
					</button>
				) : null}
				{addShelfArea}
			</div>
			{userInfo.shelves.filter(
				(shelf) =>
					!['read', 'want-to-read', 'currently-reading', 'all'].includes(
						shelf.name
					)
			).length > 0 ? (
				<div className="shelf-group-separator"></div>
			) : null}
			{yourReadingActivitySession}
			{addBooksSection}
		</div>
	) : null;

	const batchEditTab = loaded ? (
		<div className="user-bookshelf-page-batch-edit-tab">
			<div className="top-section">
				<label htmlFor="batch-edit-shelf-select">Shelf:</label>
				<select
					className="batch-edit-shelf-select"
					value={batchEditSelectedShelf}
					onChange={(e) => setBatchEditSelectedShelf(e.target.value)}
				>
					{userInfo.shelves
						.filter((shelf) => shelf.name !== 'all')
						.map((shelf) =>
							shelf.name === 'want-to-read' ? 'to-read' : shelf.name
						)
						.map((shelfName, index) => {
							return (
								<option key={index} value={shelfName}>
									{shelfName}
								</option>
							);
						})}
				</select>
				<div className="add-remove-books-buttons">
					{batchEditLoadingButton !== 'add' ? (
						<button
							className="add-books-to-this-shelf-button"
							onClick={async (_e) => {
								setBatchEditLoadingButton('add');
								await Promise.all(
									booksChecked.map(async (index) => {
										if (
											['to-read', 'currently-reading', 'read'].includes(
												batchEditSelectedShelf
											)
										) {
											await Firebase.addBookToShelf(
												user.userUID,
												booksToBeShown[index].id,
												batchEditSelectedShelf,
												history
											);
											setUserInfo((previous) => {
												return {
													...previous,
													shelves: previous.shelves.map((shelf) => {
														if (
															shelf.name === batchEditSelectedShelf ||
															(shelf.name === 'want-to-read' &&
																batchEditSelectedShelf === 'to-read')
														) {
															return {
																...shelf,
																books: shelf.books.concat(
																	booksToBeShown[index]
																),
															};
														} else if (
															[
																'want-to-read',
																'read',
																'currently-reading',
															].includes(shelf.name)
														) {
															return {
																...shelf,
																books: shelf.books.filter(
																	(book) =>
																		book.rootId !== booksToBeShown[index].rootId
																),
															};
														}
														return shelf;
													}),
												};
											});
										} else {
											await Firebase.addBookToUserShelf(
												user.userUID,
												booksToBeShown[index].rootId,
												batchEditSelectedShelf,
												null,
												history
											);
											setUserInfo((previous) => {
												return {
													...previous,
													shelves: previous.shelves.map((shelf) => {
														if (shelf.name === batchEditSelectedShelf) {
															return {
																...shelf,
																books: shelf.books.concat(
																	booksToBeShown[index]
																),
															};
														}
														return shelf;
													}),
												};
											});
										}
									})
								);
								setBatchEditLoadingButton(null);
							}}
						>
							add books to this shelf
						</button>
					) : (
						<img
							src="https://s.gr-assets.com/assets/loading-trans-ced157046184c3bc7c180ffbfc6825a4.gif"
							alt="loading"
						/>
					)}
					<span className="separator">|</span>
					{batchEditLoadingButton !== 'remove' ? (
						<button
							className="remove-books-from-this-shelf-button"
							onClick={async (_e) => {
								setBatchEditLoadingButton('remove');
								await Promise.all(
									booksChecked.map(async (index) => {
										if (
											['to-read', 'currently-reading', 'read'].includes(
												batchEditSelectedShelf
											)
										) {
											window.alert(
												`“${batchEditSelectedShelf}” is an exclusive shelf. You cannot remove a book from its exclusive shelf, but you can move it to a different one, such as “to-read”.`
											);
										} else {
											await Firebase.removeBookFromUserShelf(
												user.userUID,
												booksToBeShown[index].rootId,
												batchEditSelectedShelf,
												history
											);
											setUserInfo((previous) => {
												return {
													...previous,
													shelves: previous.shelves.map((shelf) => {
														if (shelf.name === batchEditSelectedShelf) {
															return {
																...shelf,
																books: shelf.books.filter(
																	(book) =>
																		book.rootId !== booksToBeShown[index].rootId
																),
															};
														}
														return shelf;
													}),
												};
											});
										}
									})
								);
								setBatchEditLoadingButton(null);
							}}
						>
							remove books from this shelf
						</button>
					) : (
						<img
							src="https://s.gr-assets.com/assets/loading-trans-ced157046184c3bc7c180ffbfc6825a4.gif"
							alt="loading"
						/>
					)}
					<span className="separator">|</span>
					{batchEditLoadingButton !== 'remove-all' ? (
						<button
							className="remove-books-from-all-shelves-button"
							onClick={async (_e) => {
								setBatchEditLoadingButton('remove-all');
								if (
									window.confirm(
										'This will completely remove the selected books from your shelves.'
									)
								) {
									const booksToBeRemovedRootIds = booksChecked.map(
										(index) => booksToBeShown[index].rootId
									);
									await Promise.all(
										userInfo.shelves.map(async (shelf) => {
											if (
												!['to-read', 'currently-reading', 'read'].includes(
													shelf.name
												)
											) {
												await Promise.all(
													shelf.books
														.filter((book) =>
															booksChecked.some(
																(index) =>
																	booksToBeShown[index].rootId === book.rootId
															)
														)
														.map(async (book) => {
															await Firebase.removeBookFromShelf(
																user.userUID,
																book.id
															);
														})
												);
											} else {
												await Promise.all(
													shelf.books
														.filter((book) =>
															booksChecked.some(
																(index) =>
																	booksToBeShown[index].rootId === book.rootId
															)
														)
														.map(async (book) => {
															await Firebase.removeBookFromUserShelf(
																user.userUID,
																book.rootId,
																shelf.name,
																history
															);
														})
												);
											}
										})
									);
									setUserInfo((previous) => {
										return {
											...previous,
											shelves: previous.shelves.map((shelf) => {
												return {
													...shelf,
													books: shelf.books.filter(
														(book) =>
															!booksToBeRemovedRootIds.includes(book.rootId)
													),
												};
											}),
										};
									});
								}
								setBatchEditLoadingButton(null);
							}}
						>
							remove books from all shelves
						</button>
					) : (
						<img
							src="https://s.gr-assets.com/assets/loading-trans-ced157046184c3bc7c180ffbfc6825a4.gif"
							alt="loading"
						/>
					)}
				</div>
			</div>
			<div className="bottom-section">
				<div className="bottom-section-left-section">
					<button
						className="select-all-button"
						onClick={(_e) => {
							setBooksChecked(booksToBeShown.map((_b, index) => index));
						}}
					>
						select all
					</button>
					<span className="separator">|</span>
					<button
						className="select-none-button"
						onClick={(_e) => {
							setBooksChecked([]);
						}}
					>
						select none
					</button>
				</div>
				<div className="bottom-section-right-section">
					<button
						className="close-batch-edit-tab-button"
						onClick={(_e) => setIsShowingBatchEdit(false)}
					>
						close
					</button>
				</div>
			</div>
		</div>
	) : null;

	const settingsTab = (
		<div className="user-bookshelf-page-settings-tab">
			<div className="top-section">
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
								type="checkbox"
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
								type="checkbox"
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
								type="checkbox"
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
								type="checkbox"
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
								type="checkbox"
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
								type="checkbox"
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
								type="checkbox"
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
								type="checkbox"
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
								type="checkbox"
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
								type="checkbox"
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
								type="checkbox"
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
								type="checkbox"
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
								type="checkbox"
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
								type="checkbox"
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
								type="checkbox"
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
								type="checkbox"
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
								type="checkbox"
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
			</div>
			<div className="bottom-section">
				{userId === user.userUID ? <div className="other-section">
						<h3>other</h3>
						<div className="parameters-section">
							<div className="per-page-parameter">
								<label htmlFor="per-page">Per page</label>
								<select
									name="per-page"
									value={perPage}
									onChange={(e) => {
										const newPageValue = e.target.value;
										history.push(
											Firebase.pageGenerator.generateUserShelfPage(
												userId,
												userFirstName,
												shelves,
												'',
												view,
												newPageValue,
												1
											)
										);
									}}
								>
									<option value="10">10</option>
									<option value="20">20</option>
									<option value="30">30</option>
									<option value="40">40</option>
									<option value="50">50</option>
									<option value="75">75</option>
									<option value="100">100</option>
									<option value="infinite-scroll">infinite scroll</option>
								</select>
							</div>
							<div className="sort-parameter">
								<label htmlFor="sort">Sort</label>
								<select
									name="sort"
									value={tableSortColumn}
									onChange={(e) => setTableSortColumn(e.target.value)}
								>
									<option value="author">Author</option>
									<option value="avg-rating">Avg rating</option>
									<option value="cover">Cover</option>
									<option value="date-added">Date added</option>
									<option value="date-pub">Date pub</option>
									<option value="date-pub-edition">Date pub edition</option>
									<option value="date-read">Date read</option>
									<option value="date-started">Date started</option>
									<option value="format">Format</option>
									<option value="isbn">Isbn</option>
									<option value="num-pages">Num pages</option>
									<option value="num-ratings">Num ratings</option>
									<option value="position">Position</option>
									<option value="random">Random</option>
									<option value="rating">Rating</option>
									<option value="review">Review</option>
									<option value="title">Title</option>
								</select>
							</div>
							<div className="sort-order-parameter">
								<input
									type="radio"
									checked={tableSortOrder === 'ascending'}
									onChange={(e) => {
										if (e.target.checked) {
											setTableSortOrder('ascending');
										}
									}}
									name="asc"
								></input>
								<label htmlFor="asc">ascending</label>
								<input
									type="radio"
									checked={tableSortOrder === 'descending'}
									onChange={(e) => {
										if (e.target.checked) {
											setTableSortOrder('descending');
										}
									}}
									name="desc"
								></input>
								<label htmlFor="desc">descending</label>
							</div>
						</div>
				</div> : null}
			</div>
			<button
				className="settings-tab-close-button"
				onClick={(_e) => setIsSettingsTabOpen(false)}
			>
				close
			</button>
		</div>
	);

	const pageNavigationSection =
		booksToBeShown.length > perPage ? (
			<div className="page-navigation-section">
				<a
					href={Firebase.pageGenerator.generateUserShelfPage(
						userId,
						userFirstName,
						shelves,
						searchQuery,
						view,
						perPage,
						page - 1
					)}
					className={page === 1 ? 'disabled' : ''}
				>
					« previous
				</a>
				{Array.from(
					{
						length: Math.ceil(booksToBeShown.length / perPage),
					},
					(_x, i) => i + 1
				).map((number) => {
					return (
						<a
							key={number}
							href={Firebase.pageGenerator.generateUserShelfPage(
								userId,
								userFirstName,
								shelves,
								searchQuery,
								view,
								perPage,
								number
							)}
							className={page === number ? 'disabled' : ''}
						>
							{page !== number ? number : <i>{number}</i>}
						</a>
					);
				})}
				<a
					href={Firebase.pageGenerator.generateUserShelfPage(
						userId,
						userFirstName,
						shelves,
						searchQuery,
						view,
						perPage,
						page + 1
					)}
					className={
						page === Math.ceil(booksToBeShown.length / perPage)
							? 'disabled'
							: ''
					}
				>
					next »
				</a>
			</div>
		) : null;

	const noMatchingItemsSpan = (
		<span className="no-matching-items-span">
			{userId !== user.userUID ? 'No matching items!' : <span>You have no books matching <b>{`"${searchInputText}"`}</b></span>}
		</span>
	);

	const booksTable =
		loaded && view === 'cover' ? (
			<div className="user-bookshelf-page-books-cover-view">
				{booksToBeShown.length === 0 ? (
					{noMatchingItemsSpan}
				) : (
					booksToBeShown
						.sort((a, b) => {
							const compare = (value1, value2) => {
								return tableSortOrder === 'ascending'
									? value1 < value2
										? -1
										: 1
									: value2 < value1
									? -1
									: 1;
							};

							switch (tableSortColumn) {
								case 'author':
									return compare(a.authorName, b.authorName);
								case 'avg-rating':
									return compare(a.averageRating, b.averageRating);
								case 'cover':
									return compare(a.cover, b.cover);
								case 'date-added':
									return compare(a.dateAdded, b.dateAdded);
								case 'date-pub':
									return compare(a.datePublished, b.datePublished);
								case 'date-pub-ed':
									return compare(
										a.datePublishedEdition,
										b.datePublishedEdition
									);
								case 'date-read':
									return compare(a.dateRead, b.dateRead);
								case 'date-started':
									return compare(a.dateStarted, b.dateStarted);
								case 'format':
									return compare(a.format, b.format);
								case 'isbn':
									return compare(a.isbn, b.isbn);
								case 'num-pages':
									return compare(a.numberOfPages, b.numberOfPages);
								case 'num-ratings':
									return compare(a.numberOfRatings, b.numberOfRatings);
								case 'position':
									return compare(a.position, b.position);
								case 'rating':
									return compare(a.rating, b.rating);
								case 'review':
									return compare(a.review, b.review);
								case 'title':
									return compare(a.title, b.title);
								default:
									return Math.random() > 0.5 ? a : b;
							}
						})
						.filter(
							(_book, index) =>
								index >= (page - 1) * perPage && index < page * perPage
						)
						.map((book, index) => {
							return (
								<a
									className="book-cover-view-cover-wrapper"
									key={index}
									href={Firebase.pageGenerator.generateBookPage(
										book.id,
										book.title
									)}
								>
									<img
										src={
											book.cover !== undefined ? book.cover : noPictureImageUrl
										}
										alt={book.title}
									/>
								</a>
							);
						})
				)}
			</div>
		) : loaded ? (
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
										setTableSortColumn('position');
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
										setTableSortColumn('cover');
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
										setTableSortColumn('title');
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
										setTableSortColumn('author');
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
										setTableSortColumn('isbn');
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
										setTableSortColumn('num-pages');
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
										setTableSortColumn('avg-rating');
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
										setTableSortColumn('num-ratings');
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
										setTableSortColumn('date-pub');
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
										setTableSortColumn('date-pub-ed');
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
										setTableSortColumn('rating');
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
							<th className="my-rating-th">
								{user.userUID !== userId ? 'my rating' : 'shelves'}
							</th>
						) : null}
						{isReviewColumnVisible ? (
							<th
								onClick={(_e) => {
									if (tableSortColumn === 'review') {
										setTableSortOrder((previous) =>
											previous === 'ascending' ? 'descending' : 'ascending'
										);
									} else {
										setTableSortColumn('review');
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
										setTableSortColumn('date-started');
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
										setTableSortColumn('date-read');
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
										setTableSortColumn('date-added');
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
										setTableSortColumn('format');
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
						{userId === user.userUID ? <th>{''}</th> : null}
					</tr>
				</thead>
				<tbody>
					{booksToBeShown.length === 0 ? (
						<tr className="no-matching-items-tr">
							<td colSpan="20">
								{noMatchingItemsSpan}
							</td>
						</tr>
					) : (
						booksToBeShown
							.sort((a, b) => {
								const compare = (value1, value2) => {
									return tableSortOrder === 'ascending'
										? value1 < value2
											? -1
											: 1
										: value2 < value1
										? -1
										: 1;
								};

								switch (tableSortColumn) {
									case 'author':
										return compare(a.authorName, b.authorName);
									case 'avg-rating':
										return compare(a.averageRating, b.averageRating);
									case 'cover':
										return compare(a.cover, b.cover);
									case 'date-added':
										return compare(a.dateAdded, b.dateAdded);
									case 'date-pub':
										return compare(a.datePublished, b.datePublished);
									case 'date-pub-ed':
										return compare(
											a.datePublishedEdition,
											b.datePublishedEdition
										);
									case 'date-read':
										return compare(a.dateRead, b.dateRead);
									case 'date-started':
										return compare(a.dateStarted, b.dateStarted);
									case 'format':
										return compare(a.format, b.format);
									case 'isbn':
										return compare(a.isbn, b.isbn);
									case 'num-pages':
										return compare(a.numberOfPages, b.numberOfPages);
									case 'num-ratings':
										return compare(a.numberOfRatings, b.numberOfRatings);
									case 'position':
										return compare(a.position, b.position);
									case 'rating':
										return compare(a.rating, b.rating);
									case 'review':
										return compare(a.review, b.review);
									case 'title':
										return compare(a.title, b.title);
									default:
										return Math.random() > 0.5 ? a : b;
								}
							})
							.filter(
								(_book, index) =>
									index >= (page - 1) * perPage && index < page * perPage
							)
							.map((book, index) => {
								const authorName =
									book.authorName !== undefined &&
									book.authorName.split(' ').length > 1
										? book.authorName.split(' ').slice(1).join(' ') +
										  ', ' +
										  book.authorName.split(' ')[0]
										: book.authorName;
								return (
									<tr
										key={index}
										className={
											booksChecked.includes((page - 1) * perPage + index)
												? 'selected'
												: isShowingBatchEdit
												? 'selecting'
												: ''
										}
										onClick={(_e) => {
											if (isShowingBatchEdit) {
												setBooksChecked((previous) =>
													previous.includes((page - 1) * perPage + index)
														? previous.filter(
																(i) => i !== (page - 1) * perPage + index
														  )
														: previous.concat((page - 1) * perPage + index)
												);
											}
										}}
									>
										{isShowingBatchEdit ? (
											<input
												type="checkbox"
												checked={booksChecked.includes(
													(page - 1) * perPage + index
												)}
											></input>
										) : null}
										{isPositionColumnVisible ? (
											<td>
												{userId !== user.userUID || !shelves.includes('want-to-read') || shelves.length !== 1 ? <span>
													{book.position !== undefined ? book.position : ''}
												</span> : !savingPositions ? 
												(
													<div className="want-to-read-position-input-section">
														<input type="text" value={wantToReadBooksPositionInputs[index]} onChange={(e) => {
															const newPosition = e.target.value;
															setWantToReadBooksPositionInputs((previous) => previous.map((v, i) => i === index ? newPosition : v));
														}} onFocus={() => setSavePositionChangesVisiblePopup(index)}></input>
														<div className={savePositionChangesVisiblePopup === index ? 'save-position-changes-popup' : 'save-position-changes-popup hidden'}>
															<div className="popup-point"></div>
															<button className="save-position-changes-button" onClick={async (_e) => {
																const oldPosition = userInfo.shelves.filter((shelf) => shelf.name === 'want-to-read')[0].books[index].position;
																const newPosition = isNaN(wantToReadBooksPositionInputs[index]) || parseInt(wantToReadBooksPositionInputs[index]) <= 0 ? 1 : parseInt(wantToReadBooksPositionInputs[index]);
																setSavingPositions(true);
																await Firebase.changeBookPosition(userId, book.id, newPosition);
																setWantToReadBooksPositionInputs((previous) => previous.map((value, i) => {
																	if (i === index) {
																		return newPosition;
																	}
																	if (newPosition < oldPosition) {
																		if (value >= newPosition && value < oldPosition) {
																			return value + 1;
																		}
																	}
																	if (newPosition > oldPosition) {
																		if (value <= newPosition && value > oldPosition) {
																			return value - 1;
																		}
																	}
																	return value;
																}));
																setSavePositionChangesVisiblePopup(null);
																setSavingPositions(false);
															}}>
																Save position changes
															</button>
															<button className="close-popup-button" onClick={() => setSavePositionChangesVisiblePopup(null)}>close</button>
														</div>
													</div>
												) : <img
														className="book-position-loading"
														src="https://s.gr-assets.com/assets/loading-trans-ced157046184c3bc7c180ffbfc6825a4.gif"
														alt="loading"
													/>
												}
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
														src={
															book.cover !== undefined ? book.cover : noCoverUrl
														}
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
													<span className="book-title-proper">
														{book.title}
													</span>
													{book.seriesName !== undefined ? (
														<span className="book-series-span">
															{` (${book.seriesName}, #${book.seriesInstance})`}
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
												{userId !== user.userUID ? (
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
												) : (
													<InteractiveStarRating
														rating={
															book.loggedInUserRating !== undefined
																? book.loggedInUserRating
																: 0
														}
														saveRating={(rating) => rateBook(book.id, rating)}
													/>
												)}
											</td>
										) : null}
										{isShelvesColumnVisible ? (
											<td>
												{userId !== user.userUID ? (
													<InteractiveStarRating
														rating={
															book.loggedInUserRating !== undefined
																? book.loggedInUserRating
																: 0
														}
														saveRating={(rating) => rateBook(book.id, rating)}
													/>
												) : (
													<a
														className="user-own-shelf-a"
														href={
															userInfo.shelves.some(
																(shelf) =>
																	shelf.name === 'read' &&
																	shelf.books.some(
																		(shelfBook) => shelfBook.id === book.id
																	)
															)
																? Firebase.pageGenerator.generateUserShelfPage(
																		userId,
																		userFirstName,
																		['read'],
																		'',
																		'table',
																		20,
																		1
																  )
																: userInfo.shelves.some(
																		(shelf) =>
																			shelf.name === 'currently-reading' &&
																			shelf.books.some(
																				(shelfBook) => shelfBook.id === book.id
																			)
																  )
																? Firebase.pageGenerator.generateUserShelfPage(
																		userId,
																		userFirstName,
																		['currently-reading'],
																		'',
																		'table',
																		20,
																		1
																  )
																: Firebase.pageGenerator.generateUserShelfPage(
																		userId,
																		userFirstName,
																		['want-to-read'],
																		'',
																		'table',
																		20,
																		1
																  )
														}
													>
														{userInfo.shelves.some(
															(shelf) =>
																shelf.name === 'read' &&
																shelf.books.some(
																	(shelfBook) => shelfBook.id === book.id
																)
														)
															? 'read'
															: userInfo.shelves.some(
																	(shelf) =>
																		shelf.name === 'currently-reading' &&
																		shelf.books.some(
																			(shelfBook) => shelfBook.id === book.id
																		)
															  )
															? 'currently-reading'
															: 'to-read'}
													</a>
												)}
												<div
													className="add-to-shelves-button-wrapper"
													ref={
														index === visibleAddToShelvesPopup
															? openAddShelvesPopup
															: null
													}
												>
													<button
														className="table-add-to-shelves-button"
														onClick={(_e) => {
															if (user.userUID !== null) {
																if (visibleAddToShelvesPopup === index) {
																	setVisibleAddToShelvesPopup(null);
																} else {
																	setVisibleAddToShelvesPopup(index);
																}
															} else {
																history.push('/user/sign_up');
															}
														}}
													>
														{userId === user.userUID
															? '[edit]'
															: loggedInUserShelves.some((shelf) =>
																	shelf.books
																		.map((loggedInBook) => loggedInBook.id)
																		.includes(book.id)
															  )
															? 'edit shelves'
															: 'add to shelves'}
													</button>
													<div
														className={
															visibleAddToShelvesPopup === index
																? 'add-to-shelves-popup-wrapper visible'
																: 'add-to-shelves-popup-wrapper'
														}
													>
														<AddToShelvesPopup
															shelves={loggedInUserShelves
																.map((shelf) =>
																	shelf.name !== 'want-to-read'
																		? shelf.name
																		: 'to-read'
																)
																.filter((shelf) => shelf !== 'all')}
															shelvesBookBelongsTo={loggedInUserShelves
																.filter(
																	(shelf) =>
																		shelf.name !== 'all' &&
																		shelf.books.some(
																			(shelfBook) => shelfBook.id === book.id
																		)
																)
																.map((shelf) =>
																	shelf.name !== 'want-to-read'
																		? shelf.name
																		: 'to-read'
																)}
															addBookToShelf={async (shelfName) => {
																await Firebase.addBookToUserShelf(
																	user.userUID,
																	book.rootId,
																	shelfName,
																	null,
																	history
																);
																setLoggedInUserShelves((previous) =>
																	!previous.some(
																		(previousShelf) =>
																			previousShelf.name === shelfName
																	)
																		? previous.concat({
																				name: shelfName,
																				books: [
																					{ id: book.id, rootId: book.rootId },
																				],
																		  })
																		: previous.map((previousShelf) => {
																				if (previousShelf.name === shelfName) {
																					return {
																						name: shelfName,
																						books: previousShelf.books.concat({
																							id: book.id,
																							rootId: book.rootId,
																						}),
																					};
																				}
																				return previousShelf;
																		  })
																);
															}}
															changeBookStatus={async (status) =>
																await Firebase.addBookToShelf(
																	user.userUID,
																	book.id,
																	status,
																	history
																)
															}
															close={() => setVisibleAddToShelvesPopup(null)}
														/>
													</div>
												</div>
											</td>
										) : null}
										{isReviewColumnVisible ? (
											<td>
												<UserReviewSection reviewText={book.review} />
											</td>
										) : null}
										{isDateStartedColumnVisible ? (
											<td>
												{userId !== user.userUID ? <span
													className={
														book.dateStarted === undefined ? 'no-date-span' : ''
													}
												>
													{book.dateStarted !== undefined
														? format(book.dateStarted, 'MMM dd, yyyy')
														: 'not set'}
												</span> : <EditableBookshelfDateField initialDate={book.dateStarted} save={(date) => {

												}} />}
											</td>
										) : null}
										{isDateReadColumnVisible ? (
											<td>
												{userId !== user.userUID ? <span
													className={
														book.dateRead === undefined ? 'no-date-span' : ''
													}
												>
													{book.dateRead !== undefined
														? format(book.dateRead, 'MMM dd, yyyy')
														: 'not set'}
												</span> : <EditableBookshelfDateField initialDate={book.dateStarted} save={(date) => {

												}} />}
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
										{userId === user.userUID ? (
											<td>
												<button className="remove-book-from-shelves-button" onClick={async (_e) => {
													if (window.confirm(`Are you sure you want to remove ${book.title} from your books? This will permanently remove this book from your shelves, including any review, or rating you have added. To change the shelf this book appears on please edit the shelves.`)) {
														await Firebase.removeBookFromShelf(userId, book.id);
														history.push({
															pathname: Firebase.pageGenerator.generateUserShelfPage(userId, userFirstName, shelves, '', 'table', 20, 1),
															state: `${book.title} was removed from your books.`,
														});
													}
												}}></button>
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
		<div className="user-bookshelf-page-table-parameters-section">
			<div className="per-page-parameter">
				<label htmlFor="per-page">per page</label>
				<select
					name="per-page"
					value={perPage}
					onChange={(e) => {
						const newPageValue = e.target.value;
						history.push(
							Firebase.pageGenerator.generateUserShelfPage(
								userId,
								userFirstName,
								shelves,
								'',
								view,
								newPageValue,
								1
							)
						);
					}}
				>
					<option value="10">10</option>
					<option value="20">20</option>
					<option value="30">30</option>
					<option value="40">40</option>
					<option value="50">50</option>
					<option value="75">75</option>
					<option value="100">100</option>
					<option value="infinite-scroll">infinite scroll</option>
				</select>
			</div>
			<div className="sort-parameter">
				<label htmlFor="sort">sort</label>
				<select
					name="sort"
					value={tableSortColumn}
					onChange={(e) => setTableSortColumn(e.target.value)}
				>
					<option value="author">Author</option>
					<option value="avg-rating">Avg rating</option>
					<option value="cover">Cover</option>
					<option value="date-added">Date added</option>
					<option value="date-pub">Date pub</option>
					<option value="date-pub-edition">Date pub edition</option>
					<option value="date-read">Date read</option>
					<option value="date-started">Date started</option>
					<option value="format">Format</option>
					<option value="isbn">Isbn</option>
					<option value="num-pages">Num pages</option>
					<option value="num-ratings">Num ratings</option>
					<option value="position">Position</option>
					<option value="random">Random</option>
					<option value="rating">Rating</option>
					<option value="review">Review</option>
					<option value="title">Title</option>
				</select>
			</div>
			<div className="sort-order-parameter">
				<input
					type="radio"
					checked={tableSortOrder === 'ascending'}
					onChange={(e) => {
						if (e.target.checked) {
							setTableSortOrder('ascending');
						}
					}}
					name="asc"
				></input>
				<label htmlFor="asc">asc.</label>
				<input
					type="radio"
					checked={tableSortOrder === 'descending'}
					onChange={(e) => {
						if (e.target.checked) {
							setTableSortOrder('descending');
						}
					}}
					name="desc"
				></input>
				<label htmlFor="desc">desc.</label>
			</div>
		</div>
	);

	const mainInfoContainer = (
		<div className="user-bookshelf-page-main-info-container">
			{isSettingsTabOpen ? settingsTab : null}
			{isShowingBatchEdit ? batchEditTab : null}
			<div className="top-page-navigation-section-wrapper">
				{pageNavigationSection}
			</div>
			{booksTable}
			{tableParametersSection}
			<div className="bottom-page-navigation-section-wrapper">
				{pageNavigationSection}
			</div>
		</div>
	);

	const mainContent = (
		<div className="user-bookshelf-page-main-content">
			<div className="user-bookshelf-page-main-content-top-section">
				{topMessage !== undefined ? alertMessage : null}
				{shelvesTopBar}
			</div>
			<div className="user-bookshelf-page-main-content-bottom-section">
				{bookshelfNavigationSection}
				{mainInfoContainer}
			</div>
		</div>
	);

	return (
		<div className="user-bookshelf-page">
			<TopBar />
			{mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default UserBookshelfPage;
