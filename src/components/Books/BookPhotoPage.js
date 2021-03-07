import React, { useState, useEffect } from 'react';
import Firebase from '../../Firebase';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import '../styles/Books/BookPhotoPage.css';

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
		const loadInfo = () => {
			//const photoObj = await Firebase.getPhotoDetails(user.userUID, photoId);
			const photoObj = {
				url:
					'https://m.media-amazon.com/images/M/MV5BMTU3MjUwMzQ3MF5BMl5BanBnXkFtZTgwMjcwNjkxMjI@._V1_UY1200_CR90,0,630,1200_AL_.jpg',
				usersWhoViewed: ['3Vh4hNGoKqXx27fpUrsGalLOyU62'],
				type: 'Extra',
			};
			setPhotoInfo(photoObj);
			setLoaded(true);
		};
		loadInfo();
	}, []);

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
