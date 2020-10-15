import React from 'react';
import PropTypes from 'prop-types';

const Dashboard = (props) => {
	return (
		<div id="dashboard">
			<div id="dashboard-shelf">
				<div id="dashboard-shelf-currently-reading">
					<h2 id="dashboard-shelf-currently-reading-h2">CURRENTLY READING</h2>
					{props.readingBooks.map((book, index) => {
						if (index > 1) {
							return null;
						}
						return (
							<div className="dashboard-shelf-reading-book-card">
								<a href={book.page}>
									<img
										className="dashboard-shelf-reading-book-card-cover"
										src={book.cover}
										alt={book.title}
									/>
								</a>
								<div className="dashboard-shelf-reading-book-card-details">
									<a href={book.page}>{book.title}</a>
									<span>
										by <a href={book.authorPage}>{book.author}</a>{' '}
										{book.authorHasBadge ? (
											<span className="author-badge"></span>
										) : null}
									</span>
									<button id="dashboard-update-progress">
										Update progress
									</button>
								</div>
							</div>
						);
					})}
					<div id="dashboard-shelf-currently-reading-bottom">
						<a href={`/review/list/${props.userCode}?shelf=currently-reading`}>
							View all books
						</a>
						<button id="add-a-book">Add a book</button>
						<button id="general-update">General update</button>
					</div>
				</div>
				<div id="dashboard-shelf-want-to-read">
					<h2 id="dashboard-shelf-want-to-read-h2">WANT TO READ</h2>
					{props.wantToReadBooks.map((book, index) => {
						if (index > 5) {
							return null;
						}
						return (
							<a className="dashboard-shelf-want-to-read-book" href={book.page}>
								<img src={book.cover} alt={book.title}></img>
							</a>
						);
					})}
					<a
						id="view-all-to-read"
						href={`/review/list/${props.userCode}?shelf=to-read`}
					>
						View all books
					</a>
				</div>
				<div id="dashboard-shelf-bookshelves">
					<h2 id="bookshelves-h2">BOOKSHELVES</h2>
					<div id="dashboard-shelf-bookshelves-bottom">
						<div id="dashboard-shelf-bookshelves-numbers">
							<a
								href={`/review/list/${props.userCode}?shelf=currently-reading`}
							>
								{props.readingBooks.length}
							</a>
							<a href={`/review/list/${props.userCode}?shelf=to-read`}>
								{props.wantToReadBooks.length}
							</a>
							<a href={`/review/list/${props.userCode}?shelf=read`}>
								{props.numberOfReadBooks}
							</a>
						</div>
						<div id="dashboard-shelf-bookshelves-titles">
							<a
								href={`/review/list/${props.userCode}?shelf=currently-reading`}
							>
								Want to Read
							</a>
							<a href={`/review/list/${props.userCode}?shelf=to-read`}>
								Currently Reading
							</a>
							<a href={`/review/list/${props.userCode}?shelf=read`}>Read</a>
						</div>
					</div>
				</div>
			</div>
			<div id="dashboard-updates"></div>
			<div id="dashboard-right-section"></div>
		</div>
	);
};

Dashboard.propTypes = {
	readingBooks: PropTypes.arrayOf(
		PropTypes.shape({
			cover: PropTypes.string,
			title: PropTypes.string,
			page: PropTypes.string,
			authorPage: PropTypes.string,
			author: PropTypes.string,
			authorHasBadge: PropTypes.bool,
		})
	),
	wantToReadBooks: PropTypes.arrayOf(
		PropTypes.shape({
			cover: PropTypes.string,
			title: PropTypes.string,
			page: PropTypes.string,
		})
	),
	numberOfReadBooks: PropTypes.number,
	userCode: PropTypes.string,
};

export default Dashboard;
