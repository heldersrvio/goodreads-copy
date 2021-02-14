import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import Firebase from '../../Firebase';
//import TopBar from './TopBar';
//import HomePageFootBar from './HomePageFootBar';

const BookPage = ({ match }) => {
	const {
		params: { bookPageId },
	} = match;
	const [bookInfo, setBookInfo] = useState({ title: '', cover: '' });
	const [loaded, setLoaded] = useState(false);
	const [enlargingCover, setEnlargingCover] = useState(false);
	const [savingShelf, setSavingShelf] = useState(false);

	const user = useSelector((state) => state);

	useEffect(() => {
		const getBookInfo = async () => {
			let bookId = '';
			let i = 0;
			while (i < bookPageId.length) {
				if (bookPageId[i] !== '.') {
					bookId += bookPageId[i];
				} else {
					break;
				}
				i++;
			}
			const bookObj = await Firebase.queryBookById(user.userUID, bookId);
			setBookInfo(bookObj);
			setLoaded(true);
		};
		getBookInfo();
	}, [bookPageId, user.userUID]);

	const displayRemoveBookConfirm = () => {
		window.confirm(
			'Removing a book deletes your rating, review, etc. Remove this book from all your shelves?'
		);
	};

	const removeBookSafely = () => {
		if (displayRemoveBookConfirm()) {
			Firebase.removeBookFromShelf(user.userUID, bookInfo.id);
		}
	};

	const bookAddress = loaded
		? `${bookInfo.id}.${bookInfo.title.replace(/ /g, '_')}`
		: '';
	const originalBookAddress = loaded
		? `${bookInfo.originalId}.${bookInfo.originalTitle.replace(/ /g, '_')}`
		: '';
	const addToShelfButton =
		loaded && bookInfo.userStatus === 'to-read' ? (
			<button
				className="book-page-want-to-read-button"
				onClick={async () => {
					setSavingShelf(true);
					await Firebase.addBookToShelf(user.userUID, bookInfo.id, 'to-read');
					setSavingShelf(false);
				}}
			>
				{savingShelf ? '...saving' : 'Want to Read'}
			</button>
		) : loaded && bookInfo.userStatus === 'read' ? (
			<div className="book-page-read-button">
				<button
					className="remove-book-from-shelf-button-read"
					onClick={removeBookSafely}
				/>
				<span>Read</span>
			</div>
		) : (
			<div className="book-page-reading-button">
				<button
					className="remove-book-from-shelf-button-reading"
					onClick={removeBookSafely}
				/>
				<span>Currently Reading</span>
			</div>
		);

	return (
		<div className="book-page">
			<div className="book-page-main-content">
				<div className="book-page-main-content-left">
					<div className="book-page-book-info">
						<div className="book-page-book-info-left">
							<div className="book-page-book-info-cover-wrap">
								<img
									src={bookInfo.cover}
									alt={bookInfo.title}
									className="book-info-book-cover"
								/>
								<a
									className="book-cover-page-anchor"
									href={`/book/photo/${bookAddress}`}
								>
									<span></span>
								</a>
								<a
									className="book-other-editions-anchor"
									href={`/work/editions/${originalBookAddress}`}
								>
									Other editions
								</a>
								<button
									className="book-page-enlarge-cover"
									onClick={() => setEnlargingCover(!enlargingCover)}
								>
									Enlarge cover
								</button>
								<a
									className="book-cover-page-anchor"
									href={`/book/photo/${bookAddress}`}
								>
									<span></span>
								</a>
							</div>
							<div className="book-page-user-shelf-section">
								<div className="add-to-shelf-buttons">{addToShelfButton}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
			<div
				className={
					enlargingCover ? 'cover-picture-box' : 'cover-picture-box hidden'
				}
			>
				<img
					src={bookInfo.cover}
					alt={bookInfo.title}
					className="book-info-book-cover-enlarged"
				></img>
			</div>
		</div>
	);
};

export default BookPage;
