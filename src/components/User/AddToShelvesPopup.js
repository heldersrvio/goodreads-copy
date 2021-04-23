import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import '../styles/User/AddToShelvesPopup.css';

const AddToShelvesPopup = (props) => {
	const [selectedShelves, setSelectedShelves] = useState(
		props.shelvesBookBelongsTo
	);
	const [searchShelfInput, setSearchShelfInput] = useState('');
	const [isAddShelfSectionVisible, setIsAddShelfSectionVisible] = useState(
		false
	);
	const [addShelfInput, setAddShelfInput] = useState('');

	useEffect(() => {
		setSelectedShelves(props.shelvesBookBelongsTo);
	}, [props.shelvesBookBelongsTo]);

	return (
		<div className="user-bookshelf-page-add-to-shelves-popup">
			<div className="popup-top-section">
				<div className="popup-topmost-section">
					<button className="choose-shelves-button">choose shelves...</button>
					<button
						className="close-popup-button"
						onClick={(_e) => props.close()}
					>
						close
					</button>
				</div>
				<input
					type="text"
					className="search-shelf-input"
					value={searchShelfInput}
					onChange={(e) => setSearchShelfInput(e.target.value)}
				></input>
			</div>
			<div className="popup-middle-section">
				{props.shelves
					.filter(
						(shelf) =>
							searchShelfInput.length === 0 ||
							shelf.includes(searchShelfInput.toLowerCase())
					)
					.map((shelf, index) => {
						return (
							<div
								className={
									shelf === 'read'
										? selectedShelves.includes(shelf)
											? 'marked selected popup-shelf'
											: 'marked popup-shelf'
										: selectedShelves.includes(shelf)
										? 'selected popup-shelf'
										: 'popup-shelf'
								}
								key={index}
								onClick={async (_e) => {
									if (!selectedShelves.includes(shelf)) {
										if (
											['read', 'to-read', 'currently-reading'].includes(shelf)
										) {
											if (!selectedShelves.includes(shelf)) {
												setSelectedShelves((previous) =>
													previous
														.filter(
															(s) =>
																![
																	'read',
																	'to-read',
																	'currently-reading',
																].includes(s)
														)
														.concat(shelf)
												);
												await props.changeBookStatus(shelf);
											}
										} else if (!selectedShelves.includes(shelf)) {
											setSelectedShelves((previous) => previous.concat(shelf));
											await props.addBookToShelf(shelf);
										}
									}
								}}
							>
								<span>{shelf}</span>
							</div>
						);
					})}
			</div>
			<div className="popup-bottom-section">
				{!isAddShelfSectionVisible || searchShelfInput.length > 0 ? (
					<button
						className="add-new-shelf-button"
						onClick={async (_e) => {
							if (
								searchShelfInput.length === 0 ||
								props.shelves.includes(searchShelfInput)
							) {
								setIsAddShelfSectionVisible(true);
							} else {
								await props.addBookToShelf(searchShelfInput);
								setSearchShelfInput('');
								setIsAddShelfSectionVisible(false);
							}
						}}
					>
						{searchShelfInput.length === 0 ||
						props.shelves.includes(searchShelfInput) ? (
							<span className="add-new-shelf-span">Add new shelf</span>
						) : (
							<span>
								{`Add `}
								<b>{`"${searchShelfInput}"`}</b>
								{` shelf`}
							</span>
						)}
					</button>
				) : (
					<div className="add-new-shelf-container">
						<input
							type="text"
							value={addShelfInput}
							onChange={(e) => setAddShelfInput(e.target.value)}
						></input>
						<button
							className="add-new-shelf-with-input-button"
							onClick={async (_e) => {
								await props.addBookToShelf(addShelfInput);
								setAddShelfInput('');
								setIsAddShelfSectionVisible(false);
							}}
						>
							Add
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

AddToShelvesPopup.propTypes = {
	shelves: PropTypes.arrayOf(PropTypes.string),
	shelvesBookBelongsTo: PropTypes.arrayOf(PropTypes.string),
	addBookToShelf: PropTypes.func,
	changeBookStatus: PropTypes.func,
	close: PropTypes.func,
};

export default AddToShelvesPopup;
