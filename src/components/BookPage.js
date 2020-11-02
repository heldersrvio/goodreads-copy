import React from 'react';
import PropTypes from 'prop-types';
import TopBar from './TopBar';

const BookPage = (props) => {};

BookPage.propTypes = {
	book: PropTypes.shape({
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
		synopsys: PropTypes.string,
		amazonLink: PropTypes.string,
		type: PropTypes.string,
		edition: PropTypes.string,
		pages: PropTypes.number,
		editionPublishedDate: PropTypes.instanceOf(Date),
		firstEditionPublishedYear: PropTypes.number,
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
