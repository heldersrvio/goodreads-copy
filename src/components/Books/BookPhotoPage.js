import React, { useState, useEffect } from 'react';
import Firebase from '../../Firebase';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import '../styles/Books/BookPhotoPage.css';
import { trackPromise } from 'react-promise-tracker';

const BookPhotoPage = ({ match, location }) => {
	const {
		params: { bookPhotoPageId },
	} = match;
	const photoId = new URLSearchParams(location.search).get('photo');
	const [loaded, setLoaded] = useState(false);
	const [photoInfo, setPhotoInfo] = useState(null);
	const bookId = bookPhotoPageId.split('.')[0];
	const bookTitle = bookPhotoPageId.split('.')[1].replace(/_/g, ' ');

	const user = JSON.parse(localStorage.getItem('userState'));

	useEffect(() => {
		const loadInfo = async () => {
			const photoObj = await trackPromise(
				Firebase.getPhotoDetails(user.userUID, photoId)
			);
			setPhotoInfo(photoObj);
			setLoaded(true);
		};
		loadInfo();
	}, [user.userUID, photoId]);

	const mainContent = loaded ? (
		<div className="book-photo-page-main-content">
			<span className="book-photo-page-title">
				<a href={Firebase.pageGenerator.generateBookPage(bookId, bookTitle)}>
					{bookTitle}
				</a>
				<span>{'>'}</span>
				<span>Photos</span>
				<span>{'>'}</span>
				<span>{photoInfo.type}</span>
			</span>
			<a
				href={Firebase.pageGenerator.generateBookPhotoPage(
					bookId,
					bookTitle,
					photoId
				)}
				className="small-photo-a"
			>
				<img src={photoInfo.url} alt={photoInfo.type} />
			</a>
			<div className="main-photo-section">
				<a className="largest-size-a" href={photoInfo.url}>
					largest size
				</a>
				<img src={photoInfo.url} alt={photoInfo.type} />
				<span className="views-span">{`Views: ${photoInfo.usersWhoViewed.length}`}</span>
			</div>
		</div>
	) : null;

	return (
		<div className="book-photo-page">
			<TopBar />
			{mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default BookPhotoPage;
