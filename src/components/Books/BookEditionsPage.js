import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import Firebase from '../../Firebase';
import { format } from 'date-fns';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';

const BookEditionsPage = ({ match }) => {
	const history = useHistory();
	const {
		params: { bookEditionsPageId },
	} = match;
	const bookId = bookEditionsPageId.split('.')[0];
	const bookTitle = bookEditionsPageId.split('.')[1].replace('_', ' ');
	const [loaded, setLoaded] = useState(false);
	const [editionsInfo, setEditionsInfo] = useState([]);
	const [detailsExpanding, setDetailsExpanding] = useState([]);
	const [defaultExpanding, setDefaultExpanding] = useState(false);
	const [editionsPerPage, setEditionsPerPage] = useState(10);
	const [page, setPage] = useState(1);

	const pageTitle = (
		<div className="book-editions-page-title">
			<a href={Firebase.pageGenerator.generateBookPage(bookId, bookTitle)}>
				{bookTitle}
			</a>
			<span>{'>'}</span>
			<span>Editions</span>
		</div>
	);

	const pageInfoAndFiltersTop = loaded ? (
		<div className="book-editions-page-info-and-filters-top">
			<div className="book-editions-page-info-and-filters-top-left">
				<span className="author-name-field">
					<span>by</span>
					<a
						href={Firebase.pageGenerator.generateAuthorPage(
							editionsInfo[0].authorIds[0],
							editionsInfo[0].authorNames[0]
						)}
					>
						{editionsInfo[0].authorNames[0]}
					</a>
				</span>
				<span className="first-published-date-field">
					{`First published ${format(
						editionsInfo.reduce((previous, current) => {
							if (current.publishedDate < previous.publishedDate) {
								return current.publishedDate;
							}
							return previous.publishedDate;
						}, editionsInfo[0].publishedDate),
						'MMMM do yyyy'
					)}`}
				</span>
			</div>
			<div className="book-editions-page-info-and-filters-top-right">
				<button
					className="expand-collapse-details-button"
					onClick={(_e) => {
						if (defaultExpanding) {
							setDetailsExpanding((previous) =>
								previous.map((_value) => false)
							);
							setDefaultExpanding(false);
						} else {
							setDetailsExpanding((previous) => previous.map((_value) => true));
							setDefaultExpanding(true);
						}
					}}
				>
					{defaultExpanding ? 'collapse details' : 'expand details'}
				</button>
				<a
					className="add-new-edition-a"
					href={Firebase.pageGenerator.generateAddBookPage()}
				>
					Add a new edition
				</a>
			</div>
		</div>
	) : null;

	const pageInfoAndFiltersBottom = loaded ? (
		<div className="book-editions-page-info-and-filters-bottom">
			<div className="book-editions-page-info-and-filters-bottom-left">
				<span className="editions-bold">Editions</span>
				<span className="page-showing-numbers-span">{`Showing ${
					(page - 1) * 10 + 1
				}-${(page - 1) * 10 + editionsPerPage} of ${
					editionsInfo.length
				}`}</span>
			</div>
		</div>
	) : null;
};

export default BookEditionsPage;
