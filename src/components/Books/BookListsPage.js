import React, { useState, useEffect } from 'react';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';
import '../styles/Books/BookListsPage.css';
import { trackPromise } from 'react-promise-tracker';

const BookListsPage = ({ match }) => {
	const {
		params: { bookId },
	} = match;
	const [loaded, setLoaded] = useState(false);
	const [page, setPage] = useState(1);
	const [bookInfo, setBookInfo] = useState({});
	const [searchInput, setSearchInput] = useState('');

	const user = JSON.parse(localStorage.getItem('userState'));

	useEffect(() => {
		const getBookInfo = async () => {
			setBookInfo(await trackPromise(Firebase.getBookInfoForListsPage(bookId)));
			setLoaded(true);
		};
		getBookInfo();
	}, [bookId]);

	const pageHeader = loaded ? (
		<h1 className="book-lists-page-header">
			<a href={Firebase.pageGenerator.generateBookPage(bookId, bookInfo.title)}>
				{bookInfo.series === undefined
					? bookInfo.title
					: `${bookInfo.title} (${bookInfo.series}, #${bookInfo.seriesInstance})`}
			</a>
			{' > Lists'}
		</h1>
	) : null;

	const authorshipSection = loaded ? (
		<span className="book-lists-page-authorship">
			by{' '}
			<a
				href={Firebase.pageGenerator.generateAuthorPage(
					bookInfo.authorId,
					bookInfo.authorName
				)}
			>
				{bookInfo.authorName}
			</a>
			{bookInfo.authorIsMember ? (
				<span className="goodreads-author-span"> (Goodreads Author)</span>
			) : null}
		</span>
	) : null;

	const bookCard = loaded ? (
		<div className="book-lists-page-book-card">
			<a
				className="cover-wrapper"
				href={Firebase.pageGenerator.generateBookPage(bookId, bookInfo.title)}
			>
				<img
					src={
						bookInfo.cover !== undefined
							? bookInfo.cover
							: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png'
					}
					alt={bookInfo.title}
				/>
			</a>
			<div className="right-section">
				{pageHeader}
				{authorshipSection}
			</div>
		</div>
	) : null;

	const listsList = loaded ? (
		<div className="book-lists-page-lists-list">
			{bookInfo.lists
				.filter(
					(_list, index) => index >= (page - 1) * 30 && index <= page * 30 - 1
				)
				.map((list, index) => {
					return (
						<div className="book-list" key={index}>
							<div className="covers">
								{list.bookCovers.map((cover, i) => {
									return (
										<a
											className="book-cover-wrapper"
											href={Firebase.pageGenerator.generateListPage(
												list.id,
												list.name
											)}
											key={i}
										>
											<img
												src={
													cover !== undefined
														? cover
														: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png'
												}
												alt={`${list.name} book`}
											/>
										</a>
									);
								})}
							</div>
							<a
								className="list-name-a"
								href={Firebase.pageGenerator.generateListPage(
									list.id,
									list.name
								)}
							>
								{list.name}
							</a>
							<span className="list-details-span">{`${
								list.bookPosition === 1
									? '1st'
									: list.bookPosition === 2
									? '2nd'
									: list.bookPosition === 3
									? '3rd'
									: `${list.bookPosition}th`
							} out of ${list.bookCovers.length} books — ${
								list.voterCount
							} voters`}</span>
						</div>
					);
				})}
			{Math.ceil(bookInfo.lists.length / 30) > 1 ? (
				<div className="page-navigation-section">
					<button
						onClick={(_e) => setPage((previous) => previous - 1)}
						disabled={page === 1}
					>
						« previous
					</button>
					{Array.from(
						{
							length: Math.ceil(bookInfo.lists.length / 30),
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
						disabled={page === Math.ceil(bookInfo.lists.length / 30)}
					>
						next »
					</button>
				</div>
			) : null}
		</div>
	) : null;

	const mainContentLeftSection = (
		<div className="book-lists-page-main-content-left-section">
			{bookCard}
			{listsList}
		</div>
	);

	const mainContentRightSection = (
		<div className="book-lists-page-main-content-right-section">
			<form className="top-section">
				<input
					className="search-quote input"
					type="text"
					placeholder="Search lists"
					value={searchInput}
					onChange={(e) => setSearchInput(e.target.value)}
				></input>
				<a
					className="search-a"
					href={Firebase.pageGenerator.generateQuotesSearchPage(searchInput)}
				>
					Search
				</a>
			</form>
			<div className="bottom-section">
				<a href={Firebase.pageGenerator.generateCreateListPage()}>
					Create New List
				</a>
				<a href={Firebase.pageGenerator.generateListopiaPage()}>All Lists</a>
				<a
					href={
						user.userUID !== null
							? Firebase.pageGenerator.generateListsCreatedByUserPage(
									user.userUID,
									user.userInfo.firstName
							  )
							: '/user/sign_in'
					}
				>
					Lists I Created
				</a>
				<a
					href={
						user.userUID !== null
							? Firebase.pageGenerator.generateListsVotedByUserPage(
									user.userUID,
									user.userInfo.firstName
							  )
							: '/user/sign_in'
					}
				>
					Lists I've Voted On
				</a>
				<a
					href={
						user.userUID !== null
							? Firebase.pageGenerator.generateListsLikedByUserPage(
									user.userUID,
									user.userInfo.firstName
							  )
							: '/user/sign_in'
					}
				>
					Lists I've Liked
				</a>
				<a
					className="listopia-home-a"
					href={Firebase.pageGenerator.generateListopiaPage()}
				>
					Listopia Home
				</a>
			</div>
		</div>
	);

	const mainContent = (
		<div className="book-lists-page-main-content">
			{mainContentLeftSection}
			{mainContentRightSection}
		</div>
	);

	return (
		<div className="book-lists-page">
			<TopBar />
			{mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default BookListsPage;
