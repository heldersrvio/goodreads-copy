import React, { useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/User/WantToReadButton.css';
import { trackPromise } from 'react-promise-tracker';

const WantToReadButton = (props) => {
	const [saving, setSaving] = useState(false);

	const addBook = async () => {
		setSaving(true);
		await trackPromise(props.addToShelf());
		setSaving(false);
	};

	const removeBook = async () => {
		setSaving(true);
		await trackPromise(props.removeFromShelf());
		setSaving(false);
	};

	return (
		<button
			className={
				props.wantToRead
					? 'user-want-to-read-button remove'
					: 'user-want-to-read-button add'
			}
			onClick={(_e) => {
				if (props.wantToRead) {
					removeBook();
				} else {
					addBook();
				}
			}}
		>
			<span>
				{!saving ? (
					<img
						className="check-img"
						src="https://s.gr-assets.com/assets/green_check-101ac6f308922bc4fd60437500d7b60a.png"
						alt="Green check"
					/>
				) : null}
				<span>{saving ? '...saving' : 'Want to Read'}</span>
			</span>
		</button>
	);
};

WantToReadButton.propTypes = {
	wantToRead: PropTypes.bool,
	addToShelf: PropTypes.func,
	removeFromShelf: PropTypes.func,
};

export default WantToReadButton;
