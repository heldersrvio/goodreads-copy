import React, { useState, useEffect } from 'react';
import Firebase from '../../Firebase';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import '../styles/Books/BookCoverPage.css';
import { trackPromise } from 'react-promise-tracker';

const BookCoverPage = ({ match }) => {
	const {
		params: { bookCoverPageId },
	} = match;
	const bookId = bookCoverPageId.split('.')[0];
	const bookTitle = bookCoverPageId.split('.')[1].replace(/_/g, ' ');
	const [bookPhotos, setBookPhotos] = useState(null);
	const [loaded, setLoaded] = useState(false);

	useEffect(() => {
		const getBookInfo = async () => {
			const bookPhotosObj = await trackPromise(Firebase.getBookPhotos(bookId));
			setBookPhotos(bookPhotosObj);
			setLoaded(true);
		};
		getBookInfo();
	}, [bookId]);

	const mainContent = loaded ? (
		<div className="book-cover-page-main-content">
			<div className="main-content-left-section">
				<span className="book-cover-page-title">
					<a href={Firebase.pageGenerator.generateBookPage(bookId, bookTitle)}>
						{bookTitle}
					</a>
					<span>{'>'}</span>
					<span>Cover</span>
				</span>
				<a href={Firebase.pageGenerator.generateBookPage(bookId, bookTitle)}>
					<img
						src={
							bookPhotos.cover !== undefined
								? bookPhotos.cover
								: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png'
						}
						alt={`${bookTitle} cover`}
					/>
				</a>
			</div>
			<div className="main-content-right-section">
				<span className="main-content-right-section-title-span">
					{`${bookTitle.toUpperCase()} PHOTOS`}
				</span>
				{bookPhotos.photos.length > 0 ? (
					<div className="photo-list">
						{bookPhotos.photos.map((photo, index) => (
							<a
								href={Firebase.pageGenerator.generateBookPhotoPage(
									bookId,
									bookTitle,
									photo.id
								)}
								key={index}
							>
								<img src={photo.url} alt={`${bookTitle} ${photo.type}`} />
							</a>
						))}
					</div>
				) : (
					<span className="no-photos-yet-span">
						This book has no photos yet.
					</span>
				)}
			</div>
		</div>
	) : null;

	return (
		<div className="book-cover-page">
			<TopBar />
			{mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default BookCoverPage;
