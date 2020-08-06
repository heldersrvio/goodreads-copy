import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './styles/TopBarSearchBar.css';

const TopBarSearchBar = (props) => {
// TODO: loadingSpinner animation and lenses icon

	const [searchBarInput, setSearchBarInput] = useState('');
    const [resultsSection, setResultsSection] = useState(null);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        const generateResults = async () => {
            if (searchBarInput !== '') {
                setLoading(true);
            }
            const queryResults = await props.queryBooksFunction(searchBarInput);
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
                                                {book.series === null && book.seriesInstance !== null
                                                    ? book.title
                                                    : `${book.title} (${book.series}, #${book.seriesInstance})`}
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
        
        const assignResultsToDisplay = async () => {
            const results = await generateResults();
            setLoading(false);
            if (searchBarInput !== '') {
                setResultsSection(results);
            } else {
                setResultsSection(null);
            }
        };

        assignResultsToDisplay();
    }, [setResultsSection, props, searchBarInput]);

    const inputIcon = loading ?
        <div id="loadingSpinner">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div> :
        <a id="search-magnifiying-glass" href="/">
            <span></span>
        </a>;

	return (
        <div id="top-bar-search-bar-container">
            <div id="top-bar-search-bar">
                <input
                    type="text"
                    id="search-books-input"
                    placeholder="Search books"
                    value={searchBarInput}
                    onChange={(e) => {
                        setSearchBarInput(e.target.value);
                    }}
                />
                {inputIcon}
		    </div>
			{resultsSection}
        </div>
	);
};

TopBarSearchBar.propTypes = {
	queryBooksFunction: PropTypes.func,
};

export default TopBarSearchBar;
