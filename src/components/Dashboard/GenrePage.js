import React, { useState, useEffect } from 'react';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';

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
        }],
    }
    */

	const user = JSON.parse(localStorage.getItem('userState'));

	const capitalizeAndSeparate = (string) => {
		return string
			.split('-')
			.map((s) =>
				s.length === 1 ? s.toUpperCase() : s[0].toUpperCase() + s.slice(1)
			)
			.join(' ');
	};

	const lowerCaseAndJoinCustomGenres = (string) => {
		return string
			.split(',')
			.map((s) =>
				s[0] === ' '
					? s.slice(1).toLowerCase().split(' ').join('-')
					: s.toLowerCase().split(' ').join('-')
			);
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
					<a href={Firebase.pageGenerator.generateGenrePage(genre.parentGenre)}>
						{capitalizeAndSeparate(genre.parentGenre)}
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
				{descriptionShowingMore ? '...more' : '(less)'}
			</button>
		</div>
	) : null;

	const mainContentLeftSection = (
		<div className="genre-page-main-content-left-section">
			{pageHeader}
			{descriptionSection}
		</div>
	);

	return (
		<div className="genre-page">
			<TopBar />
			<div className="genre-page-main-content">{mainContentLeftSection}</div>
			<HomePageFootBar />
		</div>
	);
};

export default GenrePage;
