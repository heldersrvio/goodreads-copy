import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';
import '../styles/Dashboard/EditFavoriteGenresPage.css';

const EditFavoriteGenresPage = () => {
	const history = useHistory();
	const [loaded, setLoaded] = useState(false);
	const [favoriteGenres, setFavoriteGenres] = useState([]);
	const [allGenres, setAllGenres] = useState([]);
	const [
		isShowingCustomGenresOption,
		setIsShowingCustomGenresOption,
	] = useState(false);
	const [customGenreInput, setCustomGenreInput] = useState('');

	const user = JSON.parse(localStorage.getItem('userState'));

	useEffect(() => {
		const getFavoriteGenres = async () => {
			const standardGenreList = [
				'contemporary',
				'fantasy',
				'fiction',
				'graphic-novels',
				'historical-fiction',
				'manga',
				'romance',
				'science-fiction',
				'thriller',
				'young-adult',
				'art',
				'biography',
				'business',
				'chick-lit',
				"children's",
				'christian',
				'classics',
				'comics',
				'cookbooks',
				'crime',
				'ebooks',
				'gay-and-lesbian',
				'history',
				'horror',
				'humor-and-comedy',
				'memoir',
				'music',
				'mystery',
				'non-fiction',
				'paranoia',
				'philosophy',
				'poetry',
				'psychology',
				'religion',
				'science',
				'self-help',
				'suspense',
				'spirituality',
				'sports',
				'travel',
			];

			const userFavorites = await Firebase.getFavoriteGenresForUser(
				user.userUID,
				history
			);
			setFavoriteGenres(userFavorites);
			setAllGenres(
				userFavorites.concat(
					standardGenreList.filter((genre) => !userFavorites.includes(genre))
				)
			);
			setLoaded(true);
		};
		getFavoriteGenres();
	}, [user.userUID, history]);

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

	const pageHeader = (
		<h1 className="edit-favorite-genres-page-header">
			Follow Your Favorite Genres
		</h1>
	);

	const explanationBox = (
		<div className="edit-favorite-genres-page-explanation-box">
			<span>
				We use your favorite genres to make better book recommendations and
				tailor what you see in your Updates feed.
			</span>
		</div>
	);

	const genreSelectionArea = loaded ? (
		<div className="edit-favorite-genres-page-genre-selection-area">
			<div className="genre-boxes">
				{allGenres.map((genre, index) => {
					return (
						<div
							className={
								favoriteGenres.includes(genre)
									? 'genre-box selected'
									: 'genre-box'
							}
							key={index}
							onClick={(e) => {
								e.preventDefault();
								if (favoriteGenres.includes(genre)) {
									setFavoriteGenres((previous) =>
										previous.filter((g) => g !== genre)
									);
								} else {
									setFavoriteGenres((previous) => previous.concat(genre));
								}
							}}
						>
							<input
								type="checkbox"
								name="genre-checkbox"
								checked={favoriteGenres.includes(genre)}
								onClick={(e) => {
									e.stopPropagation();
									if (favoriteGenres.includes(genre)) {
										setFavoriteGenres((previous) =>
											previous.filter((g) => g !== genre)
										);
									} else {
										setFavoriteGenres((previous) => previous.concat(genre));
									}
								}}
								readOnly={true}
							></input>
							<label htmlFor="genre-checkbox">
								{capitalizeAndSeparate(genre)}
							</label>
						</div>
					);
				})}
			</div>
			{!isShowingCustomGenresOption ? (
				<button
					className="custom-genres-button"
					onClick={(_e) => setIsShowingCustomGenresOption(true)}
				>
					Don’t see your favorite genres here?
				</button>
			) : (
				<div className="custom-genre-section">
					<label htmlFor="custom-genre">
						Enter other favorite genres, separated by commas:{' '}
					</label>
					<input
						type="text"
						name="custom-genre"
						placeholder="ex: Chess, Cooking, Hobbies"
						value={customGenreInput}
						onChange={(e) => setCustomGenreInput(e.target.value)}
					></input>
				</div>
			)}
		</div>
	) : null;

	const mainContent = (
		<div className="edit-favorite-genres-page-main-content">
			{pageHeader}
			{explanationBox}
			{genreSelectionArea}
			<input
				type="submit"
				value="Continue"
				onClick={async (e) => {
					e.preventDefault();
					const newGenres =
						customGenreInput.length > 0
							? favoriteGenres.concat(
									lowerCaseAndJoinCustomGenres(customGenreInput)
							  )
							: favoriteGenres;
					await Firebase.updateFavoriteGenresForUser(user.userUID, newGenres);
					history.push({
						pathname: '/',
					});
				}}
			></input>
		</div>
	);

	return (
		<div className="edit-favorite-genres-page">
			<TopBar />
			{mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default EditFavoriteGenresPage;
