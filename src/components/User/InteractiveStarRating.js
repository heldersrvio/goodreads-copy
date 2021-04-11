import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/User/InteractiveStarRating.css';

const InteractiveStarRating = (props) => {
	const [exhibitedStarRating, setExhibitedStarRating] = useState(props.rating);
	const [saving, setSaving] = useState(false);

	const rateBook = async (rating) => {
		setSaving(true);
		props.saveRating(rating);
		setSaving(false);
	};

	return !saving ? (
		<div className="user-book-page-rate-book-star-rating">
			<div
				className={
					exhibitedStarRating > 0
						? 'interactive-star small on'
						: 'interactive-star small'
				}
				title="did not like it"
				onMouseOver={(_e) => setExhibitedStarRating(1)}
				onMouseLeave={(_e) =>
					setExhibitedStarRating(props.rating === undefined ? 0 : props.rating)
				}
				onClick={() => rateBook(1)}
			></div>
			<div
				className={
					exhibitedStarRating > 1
						? 'interactive-star small on'
						: 'interactive-star small'
				}
				title="it was ok"
				onMouseOver={(_e) => setExhibitedStarRating(2)}
				onMouseLeave={(_e) =>
					setExhibitedStarRating(props.rating === undefined ? 0 : props.rating)
				}
				onClick={() => rateBook(2)}
			></div>
			<div
				className={
					exhibitedStarRating > 2
						? 'interactive-star small on'
						: 'interactive-star small'
				}
				title="liked it"
				onMouseOver={(_e) => setExhibitedStarRating(3)}
				onMouseLeave={(_e) =>
					setExhibitedStarRating(props.rating === undefined ? 0 : props.rating)
				}
				onClick={() => rateBook(3)}
			></div>
			<div
				className={
					exhibitedStarRating > 3
						? 'interactive-star small on'
						: 'interactive-star small'
				}
				title="really liked it"
				onMouseOver={(_e) => setExhibitedStarRating(4)}
				onMouseLeave={(_e) =>
					setExhibitedStarRating(props.rating === undefined ? 0 : props.rating)
				}
				onClick={() => rateBook(4)}
			></div>
			<div
				className={
					exhibitedStarRating > 4
						? 'interactive-star small on'
						: 'interactive-star small'
				}
				title="it was amazing"
				onMouseOver={(_e) => setExhibitedStarRating(5)}
				onMouseLeave={(_e) =>
					setExhibitedStarRating(props.rating === undefined ? 0 : props.rating)
				}
				onClick={() => rateBook(5)}
			></div>
		</div>
	) : (
		<div className="book-page-rate-book-star-rating">
			<span className="saving-span">saving</span>
		</div>
	);
};

InteractiveStarRating.propTypes = {
	rating: PropTypes.number,
	saveRating: PropTypes.func,
};

export default InteractiveStarRating;
