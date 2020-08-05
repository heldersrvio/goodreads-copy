import React, { useState } from 'react';
import PropTypes from 'prop-types';

const TopBarSearchBar = (props) => {
	const [searchBarInput, setSearchBarInput] = useState('');
	const [resultsSection, setResultsSection] = useState(null);
	const generateResults = async () => {
		if (searchBarInput === '') {
			return null;
		}
		const queryResults = await props.queryBooksFunction(searchBarInput);
		console.log(queryResults);
		return (
			<div id="search-books-results">
				<div id="search-books-results-top-section">
					{queryResults.map((book) => {
						return (
							<a className="search-result-book-card" href="/">
								<div className="search-results-book-card-cover-section">
									<img src={book.cover} alt="cover art" />
								</div>
								<div className="search-results-book-card-title-section">
									<span className="results-card-book-title">
										<strong>
											{book.series === null
												? book.title
												: `${book.title} (${book.series})`}
										</strong>
									</span>
									<div className="search-results-book-card-author">
										<span>{`by ${book.author}`}</span>
										{book.hasGoodReadsAuthor ? (
											<span className="results-author-badge"></span>
										) : null}
									</div>
								</div>
							</a>
						);
					})}
				</div>
				<div id="search-books-results-bottom-section">
					<a
						className="see-more-results"
						href="/"
					>{`See all results for "${searchBarInput}"`}</a>
				</div>
			</div>
		);
	};

	return (
		<div id="top-bar-search-bar">
			<input
				type="text"
				id="search-books-input"
				placeholder="Search books"
				value={searchBarInput}
				onChange={(e) => {
					setSearchBarInput(e.target.value);
					generateResults().then((results) => setResultsSection(results));
				}}
			/>
			{resultsSection}
		</div>
	);
};

TopBarSearchBar.propTypes = {
	queryBooksFunction: PropTypes.func,
};

export default TopBarSearchBar;
