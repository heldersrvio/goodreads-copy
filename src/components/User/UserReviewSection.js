import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/User/UserReviewSection.css';

const UserReviewSection = (props) => {
	const [isExpanded, setIsExpanded] = useState(false);

	return (
		<div
			className={
				isExpanded
					? 'user-bookshelf-page-user-review-section showing-all'
					: 'user-bookshelf-page-user-review-section'
			}
		>
			<span className={props.reviewText === undefined ? 'no-review-span' : ''}>
				{props.reviewText !== undefined
					? props.reviewText.slice(
							0,
							isExpanded ? props.reviewText.length : 150
					  )
					: 'None'}
			</span>
			{props.reviewText !== undefined && props.reviewText.length > 150 ? (
				<button
					className="review-more-less-button"
					onClick={(_e) => setIsExpanded((previous) => !previous)}
				>
					{isExpanded ? '(less)' : '...more'}
				</button>
			) : null}
		</div>
	);
};

UserReviewSection.propTypes = {
	reviewText: PropTypes.string,
};

export default UserReviewSection;
