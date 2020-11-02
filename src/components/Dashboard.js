import React from 'react';
import DashboardUpdates from './DashboardUpdates';
import TopBar from './TopBar';
import PropTypes from 'prop-types';
import './styles/Dashboard.css';

const Dashboard = (props) => {
	return (
		<div id="user-home">
			<TopBar userUID={props.userUID} userInfo={props.userInfo} />
			<div id="dashboard">
				<div id="dashboard-shelf">
					<div id="dashboard-shelf-currently-reading">
						<h2 id="dashboard-shelf-currently-reading-h2">CURRENTLY READING</h2>
						{props.userInfo !== undefined &&
						props.userInfo.readingBooks !== undefined
							? props.userInfo.readingBooks.map((book, index) => {
									if (index > 1) {
										return null;
									}
									return (
										<div
											className="dashboard-shelf-reading-book-card"
											key={index}
										>
											<a
												href={book.page}
												className="dashboard-shelf-reading-book-card-cover-a"
											>
												<img
													className="dashboard-shelf-reading-book-card-cover"
													src={book.cover}
													alt={book.title}
												/>
											</a>
											<div className="dashboard-shelf-reading-book-card-details">
												<a
													className="dashboard-shelf-book-title-a"
													href={book.page}
												>
													{book.title}
												</a>
												<span>
													by <a href={book.authorPage}>{book.author}</a>{' '}
													{book.authorHasBadge ? (
														<span className="author-badge-wrapper">
															<span className="author-badge"></span>
														</span>
													) : null}
												</span>
												<button className="dashboard-update-progress">
													Update progress
												</button>
											</div>
										</div>
									);
							  })
							: null}
						<span id="dashboard-shelf-currently-reading-bottom">
							<a href={`/review/list/${props.userUID}?shelf=currently-reading`}>
								View all books
							</a>
							<span>·</span>
							<button id="add-a-book">Add a book</button>
							<span>·</span>
							<button id="general-update">General update</button>
						</span>
					</div>
					<div id="dashboard-shelf-want-to-read">
						<h2 id="dashboard-shelf-want-to-read-h2">WANT TO READ</h2>
						<div id="dashboard-shelf-want-to-read-grid">
							{props.userInfo !== undefined &&
							props.userInfo.wantToReadBooks !== undefined
								? props.userInfo.wantToReadBooks.map((book, index) => {
										if (index > 5) {
											return null;
										}
										return (
											<a
												key={index}
												className="dashboard-shelf-want-to-read-book"
												href={book.page}
											>
												<img src={book.cover} alt={book.title}></img>
											</a>
										);
								  })
								: null}
						</div>
						<a
							id="view-all-to-read"
							href={`/review/list/${props.userUID}?shelf=to-read`}
						>
							View all books
						</a>
					</div>
					<div id="dashboard-shelf-bookshelves">
						<h2 id="bookshelves-h2">BOOKSHELVES</h2>
						<div id="dashboard-shelf-bookshelves-bottom">
							<div id="dashboard-shelf-bookshelves-numbers">
								<a href={`/review/list/${props.userUID}?shelf=to-read`}>
									{props.userInfo !== undefined &&
									props.userInfo.wantToReadBooks !== undefined
										? props.userInfo.wantToReadBooks.length
										: null}
								</a>
								<a
									href={`/review/list/${props.userUID}?shelf=currently-reading`}
								>
									{props.userInfo !== undefined &&
									props.userInfo.readingBooks !== undefined
										? props.userInfo.readingBooks.length
										: null}
								</a>
								<a href={`/review/list/${props.userUID}?shelf=read`}>
									{props.userInfo !== undefined &&
									props.userInfo.numberOfReadBooks !== undefined
										? props.userInfo.numberOfReadBooks
										: null}
								</a>
							</div>
							<div id="dashboard-shelf-bookshelves-titles">
								<a
									href={`/review/list/${props.userUID}?shelf=currently-reading`}
								>
									Want to Read
								</a>
								<a href={`/review/list/${props.userUID}?shelf=to-read`}>
									Currently Reading
								</a>
								<a href={`/review/list/${props.userUID}?shelf=read`}>Read</a>
							</div>
						</div>
					</div>
				</div>
				<DashboardUpdates queryUpdates={() => {}} />
				<div id="dashboard-right-section">
					{
						//TODO: TOP SECTION
					}
					<div id="dashboard-bottom">
						<div className="top-section">
							<h2 className="connect-h2">CONNECT</h2>
							<div className="social-media-links">
								<a
									className="facebook-a"
									href="https://www.facebook.com/Goodreads/"
								>
									<img
										src="https://s.gr-assets.com/assets/site_footer/footer_facebook-ea4ab848f8e86c5f5c98311bc9495a1b.svg"
										alt="Facebook logo"
									/>
								</a>
								<a className="twitter-a" href="https://twitter.com/goodreads">
									<img
										src="https://s.gr-assets.com/assets/site_footer/footer_twitter-126b3ee80481a763f7fccb06ca03053c.svg"
										alt="Twitter logo"
									/>
								</a>
								<a
									className="instagram-a"
									href="https://www.instagram.com/goodreads/"
								>
									<img
										src="https://s.gr-assets.com/assets/site_footer/footer_instagram-d59e3887020f12bcdb12e6c539579d85.svg"
										alt="Instagram logo"
									/>
								</a>
								<a
									className="linkedin-a"
									href="https://www.linkedin.com/company/goodreads-com/"
								>
									<img
										src="https://s.gr-assets.com/assets/site_footer/footer_linkedin-5b820f4703eff965672594ef4d10e33c.svg"
										alt="Linkedin logo"
									/>
								</a>
							</div>
						</div>
						<div className="bottom-section">
							<div className="bottom-section-links">
								<a
									className="iOS-a"
									href="https://itunes.apple.com/app/apple-store/id355833469?pt=325668&ct=mw_footer&mt=8"
								>
									<img
										src="https://s.gr-assets.com/assets/app/badge-ios-desktop-homepage-6ac7ae16eabce57f6c855361656a7540.svg"
										alt="Download on the App Store"
									/>
								</a>
								<a
									className="Android-a"
									href="https://play.google.com/store/apps/details?id=com.goodreads&utm_source=mw_footer&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
								>
									<img
										src="https://s.gr-assets.com/assets/app/badge-android-desktop-home-2x-e31514e1fb4dddecf9293aa526a64cfe.png"
										alt="Get it on Google Play"
									/>
								</a>
							</div>
							<span>Goodreads</span>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
};

Dashboard.propTypes = {
	userUID: PropTypes.string,
	userInfo: PropTypes.shape({
		readingBooks: PropTypes.arrayOf(
			PropTypes.shape({
				page: PropTypes.string,
				cover: PropTypes.string,
				title: PropTypes.string,
				author: PropTypes.string,
				authorPage: PropTypes.string,
				authorHasBadge: PropTypes.bool,
			})
		),
		wantToReadBooks: PropTypes.arrayOf(
			PropTypes.shape({
				page: PropTypes.string,
				cover: PropTypes.string,
				title: PropTypes.string,
			})
		),
		numberOfReadBooks: PropTypes.number,
	}),
};

export default Dashboard;
