import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/Dashboard/FeedUpdateSettings.css';

const FeedUpdateSettings = (props) => {
	const [addBookToShelvesInput, setAddBookToShelvesInput] = useState(
		props.addBookToShelves
	);
	const [addAFriendInput, setAddAFriendInput] = useState(props.addAFriend);
	const [voteForABookReviewInput, setVoteForABookReviewInput] = useState(
		props.voteForABookReview
	);
	const [addAQuoteInput, setAddAQuoteInput] = useState(props.addAQuote);
	const [recommendABookInput, setRecommendABookInput] = useState(
		props.recommendABook
	);
	const [addANewStatusToBookInput, setAddANewStatusToBookInput] = useState(
		props.addANewStatusToBook
	);
	const [followAnAuthorInput, setFollowAnAuthorInput] = useState(
		props.followAnAuthor
	);

	return (
		<form className="feed-update-settings">
			<h2>Feed Update Settings</h2>
			<span>
				Some actions on Goodreads are published to your Update Feed. Your Update
				Feed is what shows up on your profile and your friends‘ homepages.
				Updates are published when you:
			</span>
			<div className="preference-list">
				<div className="add-book-to-shelves-preference">
					<input
						type="checkbox"
						name="add-book-to-shelves"
						checked={addBookToShelvesInput}
						onChange={(e) => setAddBookToShelvesInput(e.target.checked)}
					></input>
					<label htmlFor="add-book-to-shelves">
						Add a book to your shelves
					</label>
				</div>
				<div className="add-a-friend-preference">
					<input
						type="checkbox"
						name="add-a-friend"
						checked={addAFriendInput}
						onChange={(e) => setAddAFriendInput(e.target.checked)}
					></input>
					<label htmlFor="add-a-friend">Add a friend</label>
				</div>
				<div className="vote-for-a-book-review-preference">
					<input
						type="checkbox"
						name="vote-for-a-book-review"
						checked={voteForABookReviewInput}
						onChange={(e) => setVoteForABookReviewInput(e.target.checked)}
					></input>
					<label htmlFor="vote-for-a-book-review">Vote for a book review</label>
				</div>
				<div className="add-a-quote-preference">
					<input
						type="checkbox"
						name="add-a-quote"
						checked={addAQuoteInput}
						onChange={(e) => setAddAQuoteInput(e.target.checked)}
					></input>
					<label htmlFor="add-a-quote">Add a quote</label>
				</div>
				<div className="recommend-a-book">
					<input
						type="checkbox"
						name="recommend-a-book"
						checked={recommendABookInput}
						onChange={(e) => setRecommendABookInput(e.target.checked)}
					></input>
					<label htmlFor="recommend-a-book">Recommend a book</label>
				</div>
				<div className="add-a-new-status-to-book-preference">
					<input
						type="checkbox"
						name="add-a-new-status-to-book"
						checked={addANewStatusToBookInput}
						onChange={(e) => setAddANewStatusToBookInput(e.target.checked)}
					></input>
					<label htmlFor="add-a-new-status-to-book">
						Add a new status to a book I'm reading
					</label>
				</div>
				<div className="follow-an-author">
					<input
						type="checkbox"
						name="follow-an-author"
						checked={followAnAuthorInput}
						onChange={(e) => setFollowAnAuthorInput(e.target.checked)}
					></input>
					<label htmlFor="follow-an-author">Follow an author</label>
				</div>
			</div>
			<input
				type="submit"
				value="Save Feed Settings"
				className="save-feed-settings-button"
				onClick={(e) => {
					e.preventDefault();
					props.saveFeedSettings({
						addBookToShelves: addBookToShelvesInput,
						addAFriend: addAFriendInput,
						voteForABookReview: voteForABookReviewInput,
						addAQuote: addAQuoteInput,
						recommendABook: recommendABookInput,
						addANewStatusToBook: addANewStatusToBookInput,
						followAnAuthor: followAnAuthorInput,
					});
				}}
			></input>
		</form>
	);
};

FeedUpdateSettings.propTypes = {
	addBookToShelves: PropTypes.bool,
	addAFriend: PropTypes.bool,
	voteForABookReview: PropTypes.bool,
	addAQuote: PropTypes.bool,
	recommendABook: PropTypes.bool,
	addANewStatusToBook: PropTypes.bool,
	followAnAuthor: PropTypes.bool,
	saveFeedSettings: PropTypes.func,
};

export default FeedUpdateSettings;
