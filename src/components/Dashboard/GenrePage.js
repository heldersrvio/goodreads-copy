import React, { useState, useEffect } from 'react';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';
import '../styles/Dashboard/GenrePage.css';

const GenrePage = ({ match }) => {
	const {
		params: { genre },
	} = match;
	const [loaded, setLoaded] = useState(false);
	const [genreInfo, setGenreInfo] = useState({});
	const [descriptionShowingMore, setDescriptionShowingMore] = useState(false);
	/*
    genreInfo: {
        userFavoriteGenres,
        description,
        relatedGenres,
        parentGenre,
        newReleases: [{
            id,
            cover,
            title,
        }],
        mostReadThisWeek: [{
            id,
            cover,
            title,
        }],
        lists: [{
            id,
            title,
            bookCovers,
            numberOfBooks,
            numberOfVoters,
        }],
        genreBooks: [{
            id,
            cover,
            title,
        }],
        relatedNews: [{
            id,
            image,
            title,
            content
        }],
        quotesTagged: [{
            id,
            content,
            numberOfLikes,
            authorId,
            authorName,
            authorPicture,
			bookTitle,
        }],
    }
    */

	const user = JSON.parse(localStorage.getItem('userState'));

	useEffect(() => {
		const getGenreInfo = () => {
			setGenreInfo({
				userFavoriteGenres: ['science-fiction', 'fantasy', 'contemporary'],
				description:
					'Fantasy is a genre that uses magic and other supernatural forms as a primary element of plot, theme, and/or setting. Fantasy is generally distinguished from science fiction and horror by the expectation that it steers clear of technological and macabre themes, respectively, though there is a great deal of overlap between the three (collectively known as speculative fiction or science fiction/fantasy)\nIn its broadest sense, fantasy comprises works by many writers, artists, filmmakers, and musicians, from ancient myths and legends to many recent works embraced by a wide audience today, including young adults, most of whom are represented by the works below.',
				relatedGenres: [
					'fiction',
					'paranormal',
					'urban-fantasy',
					'magic',
					'supernatural',
					'mythology',
					'high-fantasy',
					'fairy-tales',
					'epic-fantasy',
					'dragons',
					'dark-fantasy',
					'low-fantasy',
					'weird-fiction',
					'heroic-fantasy',
					'elves',
					'unicorns',
					'fantasy-of-manners',
				],
				parentGenre: 'fiction',
				newReleases: [
					{
						id: '123',
						cover:
							'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1602570691l/53138095.jpg',
						title: 'A Court of Silver Flames',
					},
					{
						id: '123',
						cover:
							'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1585578175l/40024121._SY475_.jpg',
						title: 'The Gilded Ones',
					},
					{
						id: '123',
						cover:
							'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1602570691l/53138095.jpg',
						title: 'A Court of Silver Flames',
					},
					{
						id: '123',
						cover:
							'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1585578175l/40024121._SY475_.jpg',
						title: 'The Gilded Ones',
					},
					{
						id: '123',
						cover:
							'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1602570691l/53138095.jpg',
						title: 'A Court of Silver Flames',
					},
					{
						id: '123',
						cover:
							'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1585578175l/40024121._SY475_.jpg',
						title: 'The Gilded Ones',
					},
					{
						id: '123',
						cover:
							'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1602570691l/53138095.jpg',
						title: 'A Court of Silver Flames',
					},
					{
						id: '123',
						cover:
							'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1585578175l/40024121._SY475_.jpg',
						title: 'The Gilded Ones',
					},
					{
						id: '123',
						cover:
							'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1602570691l/53138095.jpg',
						title: 'A Court of Silver Flames',
					},
					{
						id: '123',
						cover:
							'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1585578175l/40024121._SY475_.jpg',
						title: 'The Gilded Ones',
					},
					{
						id: '123',
						cover:
							'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1602570691l/53138095.jpg',
						title: 'A Court of Silver Flames',
					},
					{
						id: '123',
						cover:
							'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1585578175l/40024121._SY475_.jpg',
						title: 'The Gilded Ones',
					},
				],
				mostReadThisWeek: Array(15).fill({
					id: '123',
					cover:
						'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1593892032l/51901147._SY475_.jpg',
					title: 'The Ballad of Songbirds and Snakes',
				}),
				lists: Array(6).fill({
					id: '123',
					title: 'Hidden Gems: YA-Fantasy Novels',
					bookCovers: [
						'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1364170135l/367158._SX98_.jpg',
						'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1388793034l/142776._SX98_.jpg',
						'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1330303462l/92717._SY160_.jpg',
						'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1441373154l/195381._SX98_.jpg',
						'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1388849827l/245727._SX98_.jpg',
					],
					numberOfBooks: 1985,
					numberOfVoters: 4318,
				}),
				genreBooks: Array(15).fill({
					id: '123',
					cover:
						'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1571318786l/62291.jpg',
					title: 'A Storm of Swords',
				}),
				relatedNews: [
					{
						id: '123',
						image: 'https://images.gr-assets.com/blogs/1613753047p8/2039.jpg',
						title: "Jeff VanderMeer's Climate Fiction Reading List",
						content:
							"Bestselling author Jeff VanderMeer is perhaps best known for his creepy sci-fi thriller Annihilation, which was made into a movie and kicked off the beloved Southern Reach trilogy. His latest novel, Hummingbird Salamander, publishes in the U.S. on April 6 and promises readers a thriller of dark conspiracy, endangered species, and the possible end of all things. Here, he's picked some of his favorite examples of climate fiction, from the plausible to the out-of-this-world.",
					},
				],
				quotesTagged: [
					{
						id: '123',
						content:
							'I have stolen princesses back from sleeping barrow kings. I burned down the town of Trebon. I have spent the night with Felurian and left with both my sanity and my life. I was expelled from the University at a younger age than most people are allowed in. I tread paths by moonlight that others fear to speak of during day. I have talked to gods, loved women, and written songs that make the minstrels weep. You may have heard of me.',
						numberOfLikes: 1195,
						authorId: '123',
						authorName: 'Patrick Rothfuss',
						authorPicture:
							'https://images.gr-assets.com/authors/1351307341p2/108424.jpg',
						bookTitle: 'The Name of the Wind',
					},
					{
						id: '123',
						content:
							'Fairies have to be one thing or the other, because being so small they unfortunately have room for one feeling only at a time.',
						numberOfLikes: 944,
						authorId: '123',
						authorName: 'J.M. Barrie',
						authorPicture:
							'https://images.gr-assets.com/authors/1519029719p2/5255014.jpg',
						bookTitle: 'Peter Pan',
					},
				],
			});
			setLoaded(true);
		};
		getGenreInfo();
	}, []);

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
				{genreInfo.parentGenre !== null ? <span>{'>'}</span> : null}
				{genreInfo.parentGenre !== null ? (
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

	const newReleasesSection = loaded ? (
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

	const mostReadThisWeekSection = loaded ? (
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

	const listsSection = loaded ? (
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
											index={coverIndex}
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

	const genreBooksSection = loaded ? (
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

	const relatedGenresSection = loaded ? (
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

	const relatedNewsSection = loaded ? (
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

	const quotesSection = loaded ? (
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
										<img src={quote.authorPicture} alt={quote.authorName} />
									</a>
								) : null}
								<span className="quote-content">{`“ ${quote.content} ”`}</span>
							</div>
							<span className="quote-authorship-span">
								<span>{'― '}</span>
								<b>{`${quote.authorName}, ${quote.bookTitle}`}</b>
							</span>
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
