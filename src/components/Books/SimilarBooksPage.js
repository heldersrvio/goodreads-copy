import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import Firebase from '../../Firebase';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';

const SimilarBooksPage = ({ match }) => {
	const history = useHistory();
	const {
		params: { similarBooksPageId },
	} = match;
	const [bookInfo, setBookInfo] = useState({ title: '', cover: '' });
	const [loaded, setLoaded] = useState(false);

	const user = JSON.parse(localStorage.getItem('userState'));

	useEffect(() => {
		const getBookInfo = async () => {
			let bookId = '';
			let i = 0;
			while (i < similarBooksPageId.length) {
				if (similarBooksPageId[i] !== '.') {
					bookId += similarBooksPageId[i];
				} else {
					break;
				}
				i++;
			}
			/*const lSObjectItem = localStorage.getItem(`${bookId}Obj`);
			if (lSObjectItem !== null) {
				const lSObject = JSON.parse(lSObjectItem);
				console.log('Loaded book from storage');
				const newLSObject = {};
				Object.keys(lSObject).forEach((key) => {
					switch (key) {
						case 'editionPublishedDate':
							newLSObject[key] = new Date(2006, 9, 1);
							break;
						/case 'otherEditionsPages':
							newLSObject[key] = [
								'/book/show/6277040.the-dark-tower',
								'book/show/408854.The_Dark_Tower',
								'/book/show/11227306.the-dark-tower',
								'/book/show/10091130.la-torre-nera',
								'/book/show/17670090.5170336934',
								'/book/show/6746616.la-torre-oscura',
							];
							break;
						case 'otherEditionsCovers':
							newLSObject[key] = [
								'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1433530080l/6277040._SY475_.jpg',
								'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1532335721l/408854.jpg',
								'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1494166372l/11227306._SY475_.jpg',
								'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1302708142l/10091130.jpg',
								'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1364053865l/17670090.jpg',
								'https://i.gr-assets.com/images/S/compressed.photo.goodreads.com/books/1590518878l/6746616._SY475_.jpg',
							];
							break;
						case 'oneRatings':
							newLSObject[key] = 5;
							break;
						case 'twoRatings':
							newLSObject[key] = 2;
							break;
						case 'threeRatings':
							newLSObject[key] = 11;
							break;
						case 'fourRatings':
							newLSObject[key] = 15;
							break;
						case 'fiveRatings':
							newLSObject[key] = 20;
							break;/
						case 'reviews':
							newLSObject[key] = [{}];
							Object.keys(lSObject[key][0]).forEach((key2) => {
								if (key2 === 'date') {
									newLSObject[key][0][key2] = new Date(2021, 2, 1);
								} else {
									newLSObject[key][0][key2] = lSObject[key][0][key2];
								}
							});
							break;
						case 'thisEditionRating':
							console.log(lSObject[key]);
							newLSObject[key] = lSObject[key];
							break;
						default:
							newLSObject[key] = lSObject[key];
					}
				});
				newLSObject.reviews[0].shelves = [
					'alt-universes',
					'fantasy',
					'magic',
					'favorite',
					'dark-tower-2011-western-vampires',
					'time-travel',
					'uncle-steview',
				];
				newLSObject.reviews[0].rating = 4;
				newLSObject.reviews[0].likedByUser = false;
				newLSObject.rootBook = 'KiX9EuoW7aRFd296zeDn';
				newLSObject.userIsFollowingAuthor = false;
				newLSObject.mainAuthorId = 'eIqpFmjgPfIO6VU3FH8x';
				setBookInfo(newLSObject);
				if (newLSObject.userRating !== undefined) {
					setExhibitedStarRating(newLSObject.userRating);
				}
			} else {*/
			const bookObj = await Firebase.queryBookById(user.userUID, bookId);
			localStorage.setItem(`${bookId}Obj`, JSON.stringify(bookObj));
			setBookInfo(bookObj);
			//}
			setLoaded(true);
		};
		getBookInfo();
	}, [similarBooksPageId, user.userUID]);
};

export default SimilarBooksPage;
