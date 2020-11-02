import React from 'react';
import PropTypes from 'prop-types';

const BookPage = (props) => {};

BookPage.propTypes = {
	book: PropTypes.shape({
		title: PropTypes.string,
		seriesName: PropTypes.string,
		seriesPage: PropTypes.string,
		seriesOtherBooksIds: PropTypes.arrayOf(PropTypes.string),
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
		listIds: PropTypes.arrayOf(PropTypes.string),
		genreList: PropTypes.arrayOf(PropTypes.string),
		genreUsers: PropTypes.arrayOf(PropTypes.number),
		publishedBooksByAuthorIds: PropTypes.arrayOf(PropTypes.string),
		alsoEnjoyedBooksIds: PropTypes.arrayOf(PropTypes.string),
		articlesIds: PropTypes.arrayOf(PropTypes.string),
		quizzesIds: PropTypes.arrayOf(PropTypes.string),
		quotesIds: PropTypes.arrayOf(PropTypes.string),
	}),
};

export default BookPage;
