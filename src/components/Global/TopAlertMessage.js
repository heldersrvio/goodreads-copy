import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/Global/TopAlertMessage.css';

const TopAlertMessage = (props) => {
	const [isVisible, setIsVisible] = useState(true);

	return (
		<div
			className={`top-message-div ${props.color} ${!isVisible ? 'hidden' : ''}`}
		>
			<span>{props.content}</span>
			<button
				className="close-button"
				onClick={(_e) => setIsVisible(false)}
			></button>
		</div>
	);
};

TopAlertMessage.propTypes = {
	color: PropTypes.string,
	content: PropTypes.string,
};

export default TopAlertMessage;
