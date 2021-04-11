import React, { useState, useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import InteractiveStarRating from './InteractiveStarRating';
import Firebase from '../../Firebase';
import WantToReadButton from './WantToReadButton';
import '../styles/User/EditCompatibilityTestAnswersPage.css';

const EditCompatibilityTestAnswersPage = () => {
	const history = useHistory();
	const [loaded, setLoaded] = useState(false);
	const [booksInfo, setBooksInfo] = useState({});
	const [ratedBooks, setRatedBooks] = useState([]);
	const [wantToReadBooks, setWantToReadBooks] = useState([]);
	const query = new URLSearchParams(useLocation().search);
	const userId = query.get('id');

	const user = JSON.parse(localStorage.getItem('userState'));

	const noCoverUrl =
		'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png';

	const categoryTitles = [
		'POPULAR BOOKS',
		'CLASSICS BOOKS',
		'POPULAR FICTION BOOKS',
		'THRILLERS BOOKS',
		'NONFICTION BOOKS',
		'FANTASY BOOKS',
		'ROMANCE BOOKS',
		'SCIENCE FICTION BOOKS',
		"WOMEN'S FICTION BOOKS",
	];

	const popularBooksIds = useMemo(
		() => [
			'JdE1oE1zeZYOVU8PYyy7',
			'Fctu87S2XLy2RA5Wcr6H',
			'0Ahlt0lmj06b0rKaD7qJ',
			'24P8kxLmS4LmtcDSPkvl',
			'4uhaVEO0ZZvDCvT8FgEM',
			'AsA2JWdwSzRg6vTJ7adi',
		],
		[]
	);
	const classicsBooksIds = useMemo(
		() => [
			'6490z4ij4qsGAIBoeBMK',
			'Djx2P7Egc9cJgfdwwF37',
			'H1xRvYEIDyk54H68QssS',
			'HfkmwYPOfQ4MtpLnLNlq',
		],
		[]
	);
	const popularFictionBooksIds = useMemo(
		() => ['JQBwpf6G3ND5pKXDYNlx', 'JdE1oE1zeZYOVU8PYyy7'],
		[]
	);
	const thrillersBooksIds = useMemo(
		() => [
			'VYSVKcKAKYwDq2PhV2cJ',
			'VncumXL1QTrVaGdhvM4O',
			'aJSCUT07kmUQqUlTegRv',
		],
		[]
	);
	const nonFictionBooksIds = useMemo(
		() => [
			'aJy9OMGHhUQ8GPZGRn6C',
			'bzRUzMqsdgjKD75Jxosn',
			'dDSxgc4Af87DFYEsiTxq',
			'e7wTYJTr4dSkJLaEXWEO',
		],
		[]
	);
	const fantasyBooksIds = useMemo(
		() => [
			'hx124Fx58u2xRqWUaxlv',
			'ljpqnZKAKgZSjbmrO6sF',
			'nSpJeOPwkgFKg45uc164',
			'oJ2euLQwJOn944VBu1tl',
		],
		[]
	);
	const romanceBooksIds = useMemo(
		() => ['pe83n32WlbIWRmYwyLiD', 'pttjrCHmNS16f2lhOU9e'],
		[]
	);
	const scienceFictionBooksIds = useMemo(
		() => [
			'qNejPAmYF2xlTdbnhH41',
			'qUe7SD2Jba5MbybZNUj5',
			'sBVe4XtgS9K0HldzfRBN',
		],
		[]
	);
	const womensFictionBooksIds = useMemo(
		() => [
			't8AF9o4IHodXuusb62ws',
			'uBI55trKgMJpRohAtxry',
			'unRbEhtsd1vcMxpSvDKI',
			'zCikj4mmQyZlyVNyP7cF',
		],
		[]
	);

	useEffect(() => {
		const getBooksInfo = async () => {
			setBooksInfo(
				await Firebase.getBooksInfoForBookCompatibilityTestPage(
					popularBooksIds,
					classicsBooksIds,
					popularFictionBooksIds,
					thrillersBooksIds,
					nonFictionBooksIds,
					fantasyBooksIds,
					romanceBooksIds,
					scienceFictionBooksIds,
					womensFictionBooksIds
				)
			);
			setLoaded(true);
		};
		if (user.userUID === null || user.userUID === undefined) {
			history.push({
				pathname: '/user/sign_in',
			});
		} else {
			getBooksInfo();
		}
	}, [
		popularBooksIds,
		classicsBooksIds,
		popularFictionBooksIds,
		thrillersBooksIds,
		nonFictionBooksIds,
		fantasyBooksIds,
		romanceBooksIds,
		scienceFictionBooksIds,
		womensFictionBooksIds,
		user.userUID,
		history,
	]);

	const moveBookToWantToReadShelf = async (id) => {
		await Firebase.addBookToShelf(user.userUID, id, 'to-read', history);
		setWantToReadBooks((previous) => previous.concat(id));
	};

	const removeBookFromWantToReadShelf = async (id) => {
		await Firebase.removeBookFromShelf(user.userUID, id);
		setWantToReadBooks((previous) =>
			previous.filter((bookId) => bookId !== id)
		);
	};

	const rateBook = async (id, rating) => {
		await Firebase.rateBook(user.userUID, id, rating, history);
		setRatedBooks((previous) =>
			previous.concat({
				id,
				rating,
			})
		);
	};

	const topSection = (
		<div className="edit-compatibility-test-answers-page-main-content-top-section">
			<h1>Book Compatibility Test</h1>
			<span>Rate the books below and then click to get your report.</span>
			<a
				href={
					userId !== null
						? Firebase.pageGenerator.generateBookCompatibilityTestPage(userId)
						: Firebase.pageGenerator.generateInviteFriendsPage()
				}
			>
				Compare Results
			</a>
		</div>
	);

	const categoriesSection = loaded ? (
		<div className="edit-compatibility-test-answers-page-main-content-categories-section">
			<div className="categories">
				{Object.keys(booksInfo).map((key, index) => {
					const generateBookRow = (startingIndex) => {
						return (
							<div className="book-row">
								{booksInfo[key]
									.filter(
										(_book, i) => i >= startingIndex && i < startingIndex + 5
									)
									.map((book, i) => {
										const ratedBook = ratedBooks.filter(
											(ratedBook) => ratedBook.id === book.id
										);
										return (
											<div className="book-card" key={i}>
												<img
													src={
														book.cover !== undefined ? book.cover : noCoverUrl
													}
													alt={book.title}
												/>
												<WantToReadButton
													wantToRead={wantToReadBooks.includes(book.id)}
													addToShelf={() => moveBookToWantToReadShelf(book.id)}
													removeFromShelf={() =>
														removeBookFromWantToReadShelf(book.id)
													}
												/>
												<InteractiveStarRating
													rating={
														ratedBook.length > 0 ? ratedBook[0].rating : 0
													}
													saveRating={(rating) => rateBook(book.id, rating)}
												/>
											</div>
										);
									})}
							</div>
						);
					};

					return (
						<div className="category-books-list" key={index}>
							<span className="section-title">{categoryTitles[index]}</span>
							{generateBookRow(0)}
							{booksInfo[key].length > 5 ? (
								<div className="divider"></div>
							) : null}
							{booksInfo[key].length > 5 ? generateBookRow(5) : null}
						</div>
					);
				})}
			</div>
			<a
				href={
					userId !== null
						? Firebase.pageGenerator.generateBookCompatibilityTestPage(userId)
						: Firebase.pageGenerator.generateInviteFriendsPage()
				}
			>
				Compare Results
			</a>
		</div>
	) : null;

	return (
		<div className="edit-compatibility-test-answers-page">
			<TopBar />
			<div className="edit-compatibility-test-answers-page-main-section">
				{topSection}
				{categoriesSection}
			</div>
			<HomePageFootBar />
		</div>
	);
};

export default EditCompatibilityTestAnswersPage;
