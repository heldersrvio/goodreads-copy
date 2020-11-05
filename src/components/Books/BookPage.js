import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Firebase from '../../Firebase';
//import TopBar from './TopBar';
//import HomePageFootBar from './HomePageFootBar';

const BookPage = (props) => {
	const [enlargingCover, setEnlargingCover] = useState(false);
	const [savingShelf, setSavingShelf] = useState(false);

	const user = useSelector((state) => state);

	const displayRemoveBookConfirm = () => {
		window.confirm(
			'Removing a book deletes your rating, review, etc. Remove this book from all your shelves?'
		);
	};

	const removeBookSafely = () => {
		if (displayRemoveBookConfirm()) {
			Firebase.removeBookFromShelf(user.userUID, props.book.id);
		}
	};

	const bookAddress = `${props.book.id}.${props.book.title.replace(/ /g, '_')}`;
	const originalBookAddress = `${
		props.book.originalId
	}.${props.book.originalTitle.replace(/ /g, '_')}`;
	const addToShelfButton =
		props.book.userStatus === 'to-read' ? (
			<button
				className="book-page-want-to-read-button"
				onClick={async () => {
					setSavingShelf(true);
					await Firebase.addBookToShelf(user.userUID, props.book.id, 'to-read');
					setSavingShelf(false);
				}}
			>
				{savingShelf ? '...saving' : 'Want to Read'}
			</button>
		) : props.book.userStatus === 'read' ? (
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
							<img
								src={props.book.cover}
								alt={props.book.title}
								className="book-info-book-cover"
							>
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
							</img>
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
					src={props.book.cover}
					alt={props.book.title}
					className="book-info-book-cover-enlarged"
				></img>
			</div>
		</div>
	);
};

BookPage.propTypes = {
	book: PropTypes.shape({
		id: PropTypes.string,
		title: PropTypes.string,
		series: PropTypes.shape({
			name: PropTypes.string,
			page: PropTypes.string,
			otherBooksIds: PropTypes.arrayOf(PropTypes.string),
			otherBooksCovers: PropTypes.arrayOf(PropTypes.string),
		}),
		authorNames: PropTypes.arrayOf(PropTypes.string),
		authorFunctions: PropTypes.arrayOf(PropTypes.string),
		authorPages: PropTypes.arrayOf(PropTypes.string),
		authorIsMember: PropTypes.bool,
		authorFollowerCount: PropTypes.number,
		cover: PropTypes.string,
		userStatus: PropTypes.string,
		userProgress: PropTypes.number,
		fiveRatings: PropTypes.number,
		fourRatings: PropTypes.number,
		threeRatings: PropTypes.number,
		twoRatings: PropTypes.number,
		oneRatings: PropTypes.number,
		reviews: PropTypes.arrayOf(
			PropTypes.shape({
				user: PropTypes.string,
				userName: PropTypes.string,
				id: PropTypes.string,
				shelves: PropTypes.arrayOf(PropTypes.string),
				edition: PropTypes.string,
				editionLink: PropTypes.string,
				text: PropTypes.string,
				numberOfLikes: PropTypes.number,
			})
		),
		addedBy: PropTypes.number,
		toReads: PropTypes.number,
		thisEditionRating: PropTypes.number,
		thisEditionRatings: PropTypes.number,
		thisEdtionAddedBy: PropTypes.number,
		preSynopsis: PropTypes.string,
		synopsis: PropTypes.string,
		amazonLink: PropTypes.string,
		type: PropTypes.string,
		edition: PropTypes.string,
		publisher: PropTypes.string,
		pages: PropTypes.number,
		editionPublishedDate: PropTypes.instanceOf(Date),
		firstEditionPublishedYear: PropTypes.number,
		originalId: PropTypes.string,
		originalTitle: PropTypes.string,
		ISBN: PropTypes.string,
		language: PropTypes.string,
		lists: PropTypes.arrayOf(
			PropTypes.shape({
				id: PropTypes.string,
				bookIds: PropTypes.arrayOf(PropTypes.string),
				bookCovers: PropTypes.arrayOf(PropTypes.string),
				bookTitles: PropTypes.arrayOf(PropTypes.string),
				voterCount: PropTypes.number,
			})
		),
		genres: PropTypes.arrayOf(
			PropTypes.shape({
				genre: PropTypes.string,
				userCount: PropTypes.number,
			})
		),
		publishedBooksByAuthor: PropTypes.arrayOf(
			PropTypes.shape({
				id: PropTypes.string,
				cover: PropTypes.string,
			})
		),
		alsoEnjoyedBooks: PropTypes.arrayOf(
			PropTypes.shape({
				id: PropTypes.string,
				cover: PropTypes.string,
			})
		),
		articles: PropTypes.arrayOf(
			PropTypes.shape({
				id: PropTypes.string,
				title: PropTypes.string,
				image: PropTypes.string,
				content: PropTypes.string,
				likeCount: PropTypes.number,
				commentCount: PropTypes.number,
			})
		),
		quizQuestions: PropTypes.arrayOf(
			PropTypes.shape({
				quizId: PropTypes.string,
				quizTitle: PropTypes.string,
				question: PropTypes.string,
				subQuestion: PropTypes.string,
				options: PropTypes.arrayOf(PropTypes.string),
			})
		),
		quotes: PropTypes.arrayOf(
			PropTypes.shape({
				id: PropTypes.string,
				text: PropTypes.string,
				likeCount: PropTypes.number,
			})
		),
	}),
};

export default BookPage;
