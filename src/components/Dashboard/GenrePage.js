import React, { useState, useEffect } from 'react';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';
import '../styles/Dashboard/GenrePage.css';
import { trackPromise } from 'react-promise-tracker';

const GenrePage = ({ match }) => {
	const {
		params: { genre },
	} = match;
	const [loaded, setLoaded] = useState(false);
	const [genreInfo, setGenreInfo] = useState({});
	const [descriptionShowingMore, setDescriptionShowingMore] = useState(false);

	const user = JSON.parse(localStorage.getItem('userState'));

	useEffect(() => {
		const getGenreInfo = async () => {
			setGenreInfo(
				await trackPromise(Firebase.getGenreInfo(user.userUID, genre))
			);
			setLoaded(true);
		};
		getGenreInfo();
	}, [user.userUID, genre]);

	const capitalizeAndSeparate = (string) => {
		return string
			.split('-')
			.map((s) =>
				s.length === 1 ? s.toUpperCase() : s[0].toUpperCase() + s.slice(1)
			)
			.join(' ');
	};

	const addGenreToFavorites = async () => {
		await Firebase.updateFavoriteGenresForUser(
			user.userUID,
			genreInfo.userFavoriteGenres.concat(genre)
		);
		setGenreInfo((previous) => {
			return {
				...previous,
				userFavoriteGenres: previous.userFavoriteGenres.concat(genre),
			};
		});
	};

	const removeGenreFromFavorites = async () => {
		await Firebase.updateFavoriteGenresForUser(
			user.userUID,
			genreInfo.userFavoriteGenres.filter((g) => g !== genre)
		);
		setGenreInfo((previous) => {
			return {
				...previous,
				userFavoriteGenres: previous.userFavoriteGenres.filter(
					(g) => g !== genre
				),
			};
		});
	};

	const pageHeader = loaded ? (
		<div className="genre-page-header">
			<div className="page-indication">
				<span>Genres</span>
				{genreInfo.parentGenre !== undefined ? <span>{'>'}</span> : null}
				{genreInfo.parentGenre !== undefined ? (
					<a
						href={Firebase.pageGenerator.generateGenrePage(
							genreInfo.parentGenre
						)}
					>
						{capitalizeAndSeparate(genreInfo.parentGenre)}
					</a>
				) : null}
			</div>
			<h1>{capitalizeAndSeparate(genre)}</h1>
			{genreInfo.userFavoriteGenres !== undefined ? (
				<button
					className="user-favorite-button"
					onMouseOver={(e) => {
						if (genreInfo.userFavoriteGenres.includes(genre)) {
							e.target.innerHTML = 'Unfavorite this Genre';
						}
					}}
					onMouseLeave={(e) => {
						if (genreInfo.userFavoriteGenres.includes(genre)) {
							e.target.innerHTML = 'Favorited';
						}
					}}
					onClick={(_e) => {
						if (genreInfo.userFavoriteGenres.includes(genre)) {
							removeGenreFromFavorites();
						} else {
							addGenreToFavorites();
						}
					}}
				>
					{genreInfo.userFavoriteGenres.includes(genre)
						? 'Favorited'
						: 'Add to Favorite Genres'}
				</button>
			) : null}
		</div>
	) : null;

	const descriptionSection = loaded ? (
		<div
			className={
				descriptionShowingMore
					? 'genre-page-description-section more'
					: 'genre-page-description-section'
			}
		>
			<p>{genreInfo.description}</p>
			<button
				className="genre-description-more-less-button"
				onClick={(_e) => {
					setDescriptionShowingMore((previous) => !previous);
				}}
			>
				{descriptionShowingMore ? '(less)' : '...more'}
			</button>
		</div>
	) : null;

	const newReleasesSection =
		loaded && genreInfo.newReleases.length > 0 ? (
			<div className="genre-page-new-releases-section">
				<span className="section-title">{`NEW RELEASES TAGGED "${genre.toUpperCase()}"`}</span>
				<div className="book-list">
					{genreInfo.newReleases.map((book, index) => {
						return (
							<a
								key={index}
								className="book-cover-wrapper"
								href={Firebase.pageGenerator.generateBookPage(
									book.id,
									book.title
								)}
							>
								<img
									src={
										book.cover !== undefined
											? book.cover
											: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png'
									}
									alt={book.title}
								/>
							</a>
						);
					})}
				</div>
			</div>
		) : null;

	const mostReadThisWeekSection =
		loaded && genreInfo.mostReadThisWeek.length > 0 ? (
			<div className="genre-page-new-most-read-this-week-section">
				<span className="section-title">MOST READ THIS WEEK</span>
				<div className="book-list">
					{genreInfo.mostReadThisWeek.map((book, index) => {
						return (
							<a
								key={index}
								className="book-cover-wrapper"
								href={Firebase.pageGenerator.generateBookPage(
									book.id,
									book.title
								)}
							>
								<img
									src={
										book.cover !== undefined
											? book.cover
											: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png'
									}
									alt={book.title}
								/>
							</a>
						);
					})}
				</div>
			</div>
		) : null;

	const listsSection =
		loaded && genreInfo.lists.length > 0 ? (
			<div className="genre-page-lists-section">
				<span className="section-title">LISTS</span>
				<div className="lists-list">
					{genreInfo.lists.map((list, index) => {
						return (
							<div className="list-card" key={index}>
								<div className="covers">
									{list.bookCovers.map((cover, coverIndex) => {
										return (
											<a
												className="cover-wrapper"
												href={Firebase.pageGenerator.generateListPage(
													list.id,
													list.title
												)}
												key={coverIndex}
											>
												<img src={cover} alt={'list book'} />
											</a>
										);
									})}
								</div>
								<a
									className="list-a"
									href={Firebase.pageGenerator.generateListPage(
										list.id,
										list.title
									)}
								>
									{list.title}
								</a>
								<span className="list-numbers">{`${list.numberOfBooks} books — ${list.numberOfVoters} voters`}</span>
							</div>
						);
					})}
				</div>
			</div>
		) : null;

	const genreBooksSection =
		loaded && genreInfo.genreBooks.length > 0 ? (
			<div className="genre-page-genre-books-section">
				<span className="section-title">{`${capitalizeAndSeparate(
					genre
				).toUpperCase()} BOOKS`}</span>
				<div className="book-list">
					{genreInfo.genreBooks.map((book, index) => {
						return (
							<a
								key={index}
								className="book-cover-wrapper"
								href={Firebase.pageGenerator.generateBookPage(
									book.id,
									book.title
								)}
							>
								<img
									src={
										book.cover !== undefined
											? book.cover
											: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png'
									}
									alt={book.title}
								/>
							</a>
						);
					})}
				</div>
			</div>
		) : null;

	const mainContentLeftSection = (
		<div className="genre-page-main-content-left-section">
			{pageHeader}
			{descriptionSection}
			{newReleasesSection}
			{mostReadThisWeekSection}
			{listsSection}
			{genreBooksSection}
		</div>
	);

	const relatedGenresSection =
		loaded && genreInfo.relatedGenres.length > 0 ? (
			<div className="genre-page-related-genres-section">
				<span className="section-title">RELATED GENRES</span>
				<div className="related-genres-list">
					{genreInfo.relatedGenres.map((relatedGenre, index) => {
						return (
							<a
								key={index}
								href={Firebase.pageGenerator.generateGenrePage(relatedGenre)}
							>
								{capitalizeAndSeparate(relatedGenre)}
							</a>
						);
					})}
				</div>
			</div>
		) : null;

	const relatedNewsSection =
		loaded && genreInfo.relatedNews.length > 0 ? (
			<div className="genre-page-related-news-section">
				<span className="section-title">RELATED NEWS</span>
				{genreInfo.relatedNews.map((article, index) => {
					return (
						<div className="article-preview" key={index}>
							{article.image !== undefined ? (
								<a
									className="article-image-wrapper"
									href={Firebase.pageGenerator.generateArticlePage(
										article.id,
										article.title
									)}
								>
									<img src={article.image} alt={article.title} />
								</a>
							) : null}
							<a
								className="article-title-a"
								href={Firebase.pageGenerator.generateArticlePage(
									article.id,
									article.title
								)}
							>
								{article.title}
							</a>
							<p>{article.content}</p>
							<a
								className="article-read-more-a"
								href={Firebase.pageGenerator.generateArticlePage(
									article.id,
									article.title
								)}
							>
								Read more...
							</a>
						</div>
					);
				})}
			</div>
		) : null;

	const quotesSection =
		loaded && genreInfo.quotesTagged.length > 0 ? (
			<div className="genre-page-quotes-section">
				<a
					href={Firebase.pageGenerator.generateQuotesTagPage(genre)}
					className="section-title"
				>{`QUOTES TAGGED “${capitalizeAndSeparate(genre).toUpperCase()}”`}</a>
				<div className="quotes-list">
					{genreInfo.quotesTagged.map((quote, index) => {
						return (
							<div className="quote-card" key={index}>
								<div className="quote-and-author-picture">
									{quote.authorPicture !== undefined ? (
										<a
											href={Firebase.pageGenerator.generateAuthorPage(
												quote.authorId,
												quote.authorName
											)}
										>
											<img
												src={
													quote.authorPicture !== undefined
														? quote.authorPicture
														: 'https://www.goodreads.com/assets/nophoto/user/u_60x60-267f0ca0ea48fd3acfd44b95afa64f01.png'
												}
												alt={quote.authorName}
											/>
										</a>
									) : null}
									<div className="actual-quote">
										<span className="quote-content">{`“ ${quote.content} ”`}</span>
										<span className="quote-authorship-span">
											<span>{'― '}</span>
											<b>{`${quote.authorName}, ${quote.bookTitle}`}</b>
										</span>
									</div>
								</div>
								<a
									className="quote-likes-a"
									href={Firebase.pageGenerator.generateQuotePage(
										quote.id,
										quote.content
									)}
								>{`${quote.numberOfLikes} likes`}</a>
							</div>
						);
					})}
				</div>
				<a
					className="more-quotes-a"
					href={Firebase.pageGenerator.generateQuotesTagPage(genre)}
				>
					More quotes...
				</a>
			</div>
		) : null;

	const mainContentRightSection = (
		<div className="genre-page-main-content-right-section">
			{relatedGenresSection}
			{relatedNewsSection}
			{quotesSection}
		</div>
	);

	return (
		<div className="genre-page">
			<TopBar />
			<div className="genre-page-main-content">
				{mainContentLeftSection}
				{mainContentRightSection}
			</div>
			<HomePageFootBar />
		</div>
	);
};

export default GenrePage;
