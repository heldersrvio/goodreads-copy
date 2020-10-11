import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './styles/HomePageBottomSection.css';

const HomePageBottomSection = (props) => {
	const [searchTerm, setSearchTerm] = useState('');
	const genreList = [
		'Art',
		'Biography',
		'Business',
		"Children's",
		'Christian',
		'Classics',
		'Comics',
		'Cookbooks',
		'Ebooks',
		'Fantasy',
		'Fiction',
		'Graphic Novels',
		'Historical Fiction',
		'History',
		'Horror',
		'Memoir',
		'Music',
		'Mystery',
		'Nonfiction',
		'Poetry',
		'Psychology',
		'Romance',
		'Science',
		'Science Fiction',
		'Self Help',
		'Sports',
		'Thriller',
		'Travel',
		'Young Adult',
	];
	return (
		<div id="homepage-bottom-section">
			<div id="homepage-bottom-section-main">
				<div className="intro">
					<div className="left-section">
						<h2>Deciding what to read next?</h2>
						<span>
							You’re in the right place. Tell us what titles or genres you’ve
							enjoyed in the past, and we’ll give you surprisingly insightful
							recommendations.
						</span>
					</div>
					<div className="right-section">
						<h2>What are your friends reading?</h2>
						<span>
							Chances are your friends are discussing their favorite (and least
							favorite) books on Goodreads.
						</span>
					</div>
				</div>
				<div className="discovery-box">
					<h2>
						What will <i>you</i> discover?
					</h2>
					<div className="discovery">
						<div className="discovery-left-section">
							<span>Because {props.recExample1.userName} liked...</span>
							<div className="book-recs">
								{props.recExample1.bookList.map((book, index) => {
									return (
										<a href={props.recExample1.bookLinkList[index]} key={index}>
											<img
												src={props.recExample1.bookCoverList[index]}
												alt={book}
											/>
										</a>
									);
								})}
							</div>
						</div>
						<img
							className="rec-arrow"
							src="https://www.goodreads.com/assets/home/discovery_arrow.png"
							alt="Arrow"
						/>
						<div className="discovery-right-section">
							<span>
								{props.recExample1.gender === 'm'
									? 'He'
									: props.recExample1.gender === 'f'
									? 'She'
									: 'They'}{' '}
								discovered:
							</span>
							<div className="book-rec-and-source">
								<a href={props.recExample1.recBookLink}>
									<img
										src={props.recExample1.recBookCover}
										alt={props.recExample1.recBook}
									/>
								</a>
							</div>
						</div>
					</div>
					<div className="discovery">
						<div className="discovery-left-section">
							<span>Because {props.recExample2.userName} liked...</span>
							<div className="book-recs">
								{props.recExample2.bookList.map((book, index) => {
									return (
										<a href={props.recExample2.bookLinkList[index]}>
											<img
												src={props.recExample2.bookCoverList[index]}
												alt={book}
											/>
										</a>
									);
								})}
							</div>
						</div>
						<img
							className="rec-arrow"
							src="https://www.goodreads.com/assets/home/discovery_arrow.png"
							alt="Arrow"
						/>
						<div className="discovery-right-section">
							<span>
								{props.recExample2.gender === 'm'
									? 'He'
									: props.recExample2.gender === 'f'
									? 'She'
									: 'They'}{' '}
								discovered:
							</span>
							<div className="book-rec-and-source">
								<a href={props.recExample2.recBookLink}>
									<img
										src={props.recExample2.recBookCover}
										alt={props.recExample2.recBook}
									/>
								</a>
							</div>
						</div>
					</div>
				</div>
				<div className="homepage-search-section">
					<h2>Search and browse books</h2>
					<input
						type="text"
						placeholder="Title / Author / ISBN"
						value={searchTerm}
						onChange={(e) => {
							setSearchTerm(e.target.value);
						}}
					/>
					<a href={`/search?utf8=✓&query=${searchTerm}`} id="search-a">
						<img
							id="magnifying-glass-img"
							src="https://www.goodreads.com/assets/layout/magnifying_glass-a2d7514d50bcee1a0061f1ece7821750.png"
							alt="Magnifying glass"
						></img>
					</a>
					<div id="genre-list">
						{genreList.map((genre) => {
							return (
								<a
									href={`/genres/${genre
										.toLowerCase()
										.replace(' ', '')
										.replace("'", '')}`}
								>
									{genre}
								</a>
							);
						})}
					</div>
				</div>
			</div>
			<div id="homepage-bottom-section-right">
				<span id="love-lists">Love lists?</span>
				{props.popularLists.map((list) => {
					return (
						<div className="book-list-preview">
							<div className="book-list-preview-left">
								<a href={list.link}>{list.title}</a>
								<span>
									{list.bookQuantity
										.toString()
										.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
									books |{' '}
									{list.voterQuantity
										.toString()
										.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{' '}
									voters
								</span>
							</div>
							<div className="book-list-preview-right">
								{list.topBookNames.map((book, index) => {
									return (
										<a href={list.topBookLinks[index]}>
											<img src={list.topBookCovers[index]} alt={book} />
										</a>
									);
								})}
							</div>
						</div>
					);
				})}
				<a id="more-book-lists" href="/list">
					More book lists
				</a>
			</div>
		</div>
	);
};

HomePageBottomSection.propTypes = {
	recExample1: PropTypes.shape({
		userName: PropTypes.string,
		gender: PropTypes.string,
		bookList: PropTypes.arrayOf(PropTypes.string),
		bookLinkList: PropTypes.arrayOf(PropTypes.string),
		bookCoverList: PropTypes.arrayOf(PropTypes.string),
		recBook: PropTypes.string,
		recBookLink: PropTypes.string,
		recBookCover: PropTypes.string,
		source: PropTypes.string,
	}),
	recExample2: PropTypes.shape({
		userName: PropTypes.string,
		gender: PropTypes.string,
		bookList: PropTypes.arrayOf(PropTypes.string),
		bookLinkList: PropTypes.arrayOf(PropTypes.string),
		bookCoverList: PropTypes.arrayOf(PropTypes.string),
		recBook: PropTypes.string,
		recBookLink: PropTypes.string,
		recBookCover: PropTypes.string,
		source: PropTypes.string,
	}),
	popularLists: PropTypes.arrayOf(
		PropTypes.shape({
			title: PropTypes.string,
			link: PropTypes.string,
			bookQuantity: PropTypes.number,
			voterQuantity: PropTypes.number,
			topBookNames: PropTypes.arrayOf(PropTypes.string),
			topBookCovers: PropTypes.arrayOf(PropTypes.string),
			topBookLinks: PropTypes.arrayOf(PropTypes.string),
		})
	),
};

export default HomePageBottomSection;
