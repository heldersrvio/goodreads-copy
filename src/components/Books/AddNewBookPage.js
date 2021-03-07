import React, { useState, useEffect } from 'react';
import Firebase from '../../Firebase';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';

const AddNewBookPage = ({ location }) => {
	const query = new URLSearchParams(location.search);
	const authorName = query.get('author[name]');
	const bookTitle = query.get('book[title]');
	const bookId = query.get('work[id]');
	const [loaded, setLoaded] = useState(false);
	const [description, setDescription] = useState('');
	const [titleInput, setTitleInput] = useState(
		bookTitle !== undefined ? bookTitle : ''
	);
	const [mainAuthorNameInput, setMainAuthorNameInput] = useState(
		authorName !== undefined ? authorName : ''
	);
	const [mainAuthorRoleInput, setMainAuthorRoleInput] = useState(null);
	const [otherAuthorNameInputs, setOtherAuthorNameInputs] = useState([]);
	const [otherAuthorRoleInputs, setOtherAuthorRoleInputs] = useState([]);
	const [isbnInput, setIsbnInput] = useState('');
	const [publisherInput, setPublisherInput] = useState('');
	const [publishedYearInput, setPublishedYearInput] = useState('');
	const [publishedMonthInput, setPublishedMonthInput] = useState('');
	const [publishedDayInput, setPublishedDayInput] = useState('');
	const [numberOfPagesInput, setNumberOfPagesInput] = useState('');
	const [formatIsOther, setFormatIsOther] = useState(false);
	const [formatInput, setFormatInput] = useState('');
	const [editionInput, setEditionInput] = useState('');
	const [editionLanguageInput, setEditionLanguageInput] = useState('Select...');
	const [originalTitleInput, setOriginalTitleInput] = useState('');
	const [originalPublishedYearInput, setOriginalPublishedYearInput] = useState(
		''
	);
	const [
		originalPublishedMonthInput,
		setOriginalPublishedMonthInput,
	] = useState('');
	const [originalPublishedDayInput, setOriginalPublishedDayInput] = useState(
		''
	);

	const languageOptions = [
		'Arabic',
		'Bengali',
		'Chinese',
		'Dutch',
		'English',
		'French',
		'German',
		'Hindi',
		'Italian',
		'Japanese',
		'Korean',
		'Portuguese',
		'Russian',
		'Spanish',
	];

	useEffect(() => {
		const getBookMiscInfo = async () => {
			const synopsisAndPreSynopsisObj = await Firebase.getSynopsisAndPreSynopsisForBook(
				bookId
			);
			if (synopsisAndPreSynopsisObj.preSynopsis !== null) {
				setDescription(synopsisAndPreSynopsisObj.preSynopsis);
				if (synopsisAndPreSynopsisObj.synopsis !== null) {
					setDescription(
						(previous) => previous + synopsisAndPreSynopsisObj.synopsis
					);
				}
			} else if (synopsisAndPreSynopsisObj.synopsis !== null) {
				setDescription(synopsisAndPreSynopsisObj.synopsis);
			}
			setLoaded(true);
		};
		getBookMiscInfo();
	}, [bookId]);

	const addNewBookPageTitle = (
		<h1 className="add-new-book-page-title">Add a New Book</h1>
	);

	const titlePopup = (
		<div className="add-new-book-page-popup-wrapper">
			<div className="add-new-book-page-popup">
				<span>
					If the book is in a series, put which book it is in parenthesis after
					the title. For example: Breaking Dawn (Twilight, #4).
				</span>
			</div>
			<div className="add-new-book-page-popup-tip"></div>
		</div>
	);

	const mainAuthorPopup = (
		<div className="add-new-book-page-popup-wrapper">
			<div className="add-new-book-page-popup">
				<span>
					First name goes first. Only social suffixes are used. This includes
					Jr., Sr., and Roman numerals. There is no punctuation between the name
					and the suffix.
				</span>
			</div>
			<div className="add-new-book-page-popup-tip"></div>
		</div>
	);

	const rolePopup = (
		<div className="add-new-book-page-popup-wrapper">
			<div className="add-new-book-page-popup">
				<span>
					Help us keep this field consistent. Suggested values are:
					<br />
					-Author (default) - no need to specify this
					<br />
					-Illustrator
					<br />
					-Contributor
					<br />
					-Editor
					<br />
					-Translator
					<br />
					-Narrator
				</span>
			</div>
			<div className="add-new-book-page-popup-tip"></div>
		</div>
	);

	const otherAuthorsPopup = (
		<div className="add-new-book-page-popup-wrapper">
			<div className="add-new-book-page-popup">
				<span>
					Add authors in the order they are listed on the book cover, or
					alphabetically if there is no cover or various editions disagree.
				</span>
			</div>
			<div className="add-new-book-page-popup-tip"></div>
		</div>
	);

	const publishedYearPopup = (
		<div className="add-new-book-page-popup-wrapper">
			<div className="add-new-book-page-popup">
				<span>This is the date this particular edition was published.</span>
			</div>
			<div className="add-new-book-page-popup-tip"></div>
		</div>
	);

	const formatPopup = (
		<div className="add-new-book-page-popup-wrapper">
			<div className="add-new-book-page-popup">
				<span>
					To use a format not in the list click "other". Please only add books.
					Books generally have ISBN numbers (but don\'t have to), and are
					usually published. Periodicals such as newspapers, magazines, and
					comics are not books. However a volume of comics or articles or
					graphic novels is considered a book.
				</span>
			</div>
			<div className="add-new-book-page-popup-tip"></div>
		</div>
	);

	const editionPopup = (
		<div className="add-new-book-page-popup-wrapper">
			<div className="add-new-book-page-popup">
				<span>
					Edition specific information about this book such as "Large print" or
					"Anniversary Edition" should go in this field.
				</span>
			</div>
			<div className="add-new-book-page-popup-tip"></div>
		</div>
	);

	const descriptionPopup = (
		<div className="add-new-book-page-popup-wrapper">
			<div className="add-new-book-page-popup">
				<span>
					Description/synopsis only -- not your review. Please avoid spoilers,
					especially if copying from Wikipedia.
				</span>
			</div>
			<div className="add-new-book-page-popup-tip"></div>
		</div>
	);

	const languagePopup = (
		<div className="add-new-book-page-popup-wrapper">
			<div className="add-new-book-page-popup">
				<span>
					The language this edition of the book is primarily written in.
				</span>
			</div>
			<div className="add-new-book-page-popup-tip"></div>
		</div>
	);

	const originalTitlePopup = (
		<div className="add-new-book-page-popup-wrapper">
			<div className="add-new-book-page-popup">
				<span>Title of the original publication of this work.</span>
			</div>
			<div className="add-new-book-page-popup-tip"></div>
		</div>
	);

	const originalPublicationYearPopup = (
		<div className="add-new-book-page-popup-wrapper">
			<div className="add-new-book-page-popup">
				<span>
					The date the first edition of this title was published. All fields
					optional.
				</span>
			</div>
			<div className="add-new-book-page-popup-tip"></div>
		</div>
	);

	const bookForm = (
		<form className="add-new-book-page-book-form">
			<div className="form-title-area">
				<label htmlFor="title" className="main-label">
					<span>title</span>
					<span className="red-asterisk">*</span>
				</label>
				<input
					type="text"
					name="title"
					required={true}
					value={titleInput}
					onChange={(e) => setTitleInput(e.target.value)}
				></input>
				{titlePopup}
			</div>
			<div className="form-author-area">
				<label htmlFor="author" className="main-label">
					<span>author</span>
					<span className="red-asterisk">*</span>
				</label>
				<div className="main-author-area">
					<input
						type="text"
						name="author"
						required={true}
						value={mainAuthorNameInput}
						onChange={(e) => setMainAuthorNameInput(e.target.value)}
					></input>
					{mainAuthorPopup}
					{mainAuthorRoleInput !== null ? (
						<button
							className="add-role-button"
							onClick={(_e) => setMainAuthorRoleInput('')}
						>
							Add role
						</button>
					) : (
						<div className="main-author-role-area">
							<label htmlFor="main-author-role">Role:</label>
							<input
								type="text"
								name="main-author-role"
								value={mainAuthorRoleInput}
								onChange={(e) => setMainAuthorRoleInput(e.target.value)}
							></input>
							{rolePopup}
						</div>
					)}
				</div>
				<div className="other-authors-area">
					{otherAuthorNameInputs.map((name, index) => {
						return (
							<div className="other-author-input" key={index}>
								<div className="other-author-input-name">
									<label htmlFor="name">name:</label>
									<input
										type="text"
										name="name"
										value={name}
										onChange={(e) => {
											const newValue = e.target.value;
											setOtherAuthorNameInputs((previous) =>
												previous.map((value, i) =>
													i === index ? newValue : value
												)
											);
										}}
									></input>
									{otherAuthorsPopup}
								</div>
								<div className="other-author-input-role">
									<label htmlFor="role">role:</label>
									<input
										type="text"
										name="role"
										value={otherAuthorRoleInputs[index]}
										onChange={(e) => {
											const newValue = e.target.value;
											setOtherAuthorRoleInputs((previous) =>
												previous.map((value, i) =>
													i === index ? newValue : value
												)
											);
										}}
									></input>
									{rolePopup}
								</div>
							</div>
						);
					})}
					<button
						className="add-new-author-button"
						onClick={(_e) => {
							setOtherAuthorNameInputs((previous) => previous.concat(''));
							setOtherAuthorRoleInputs((previous) => previous.concat(''));
						}}
					>
						Add new author
					</button>
				</div>
			</div>
			<div className="form-isbn-area">
				<label htmlFor="isbn" className="main-label">
					isbn
				</label>
				<input
					type="text"
					name="isbn"
					value={isbnInput}
					onChange={(e) => setIsbnInput(e.target.value)}
				></input>
			</div>
			<div className="form-publisher-area">
				<label htmlFor="publisher" className="main-label">
					publisher
				</label>
				<input
					type="text"
					name="publisher"
					value={publisherInput}
					onChange={(e) => setPublisherInput(e.target.value)}
				></input>
			</div>
			<div className="form-published-area">
				<label htmlFor="published" className="main-label">
					published
				</label>
				<div className="published">
					<div className="published-year">
						<label htmlFor="published-year">year:</label>
						<input
							type="text"
							name="published-year"
							value={publishedYearInput}
							onChange={(e) => setPublishedYearInput(e.target.value)}
						></input>
						{publishedYearPopup}
					</div>
					<div className="published-month">
						<label htmlFor="published-month">month:</label>
						<select
							name="published-month"
							value={publishedMonthInput}
							onChange={(e) => setPublishedMonthInput(e.target.value)}
						>
							<option value=""></option>
							<option value="January">January</option>
							<option value="February">February</option>
							<option value="March">March</option>
							<option value="April">April</option>
							<option value="May">May</option>
							<option value="June">June</option>
							<option value="July">July</option>
							<option value="August">August</option>
							<option value="September">September</option>
							<option value="October">October</option>
							<option value="November">November</option>
							<option value="December">December</option>
						</select>
					</div>
					<div className="published-day">
						<label htmlFor="published-day">day:</label>
						<select
							name="published-day"
							value={publishedDayInput}
							onChange={(e) => setPublishedDayInput(e.target.value)}
						>
							<option></option>
							{Array(31)
								.fill(0)
								.map((_value, index) => (
									<option key={index} value={toString(index + 1)}>
										{index + 1}
									</option>
								))}
						</select>
					</div>
				</div>
			</div>
			<div className="form-pages-area">
				<label htmlFor="number-of-pages" className="main-label">
					number of pages
				</label>
				<input
					type="text"
					name="number-of-pages"
					value={numberOfPagesInput}
					onChange={(e) => setNumberOfPagesInput(e.target.value)}
				></input>
			</div>
			<div className="form-format-area">
				<label htmlFor="format" className="main-label">
					format
				</label>
				{!formatIsOther ? (
					<select
						name="format"
						value={formatInput}
						onChange={(e) => setFormatInput(e.target.value)}
					>
						<option value=""></option>
						<option value="Paperback">Paperback</option>
						<option value="Hardcover">Hardcover</option>
						<option value="Mass Market Paperback">Mass Market Paperback</option>
						<option value="Kindle Edition">Kindle Edition</option>
						<option value="Nook">Nook</option>
						<option value="ebook">ebook</option>
						<option value="Library Binding">Library Binding</option>
						<option value="Audiobook">Audiobook</option>
						<option value="Audio CD">Audio CD</option>
						<option value="Audio Cassette">Audio Cassette</option>
						<option value="Audible Audio">Audible Audio</option>
						<option value="CD-ROM">CD-ROM</option>
						<option value="MP3 CD">MP3 CD</option>
						<option value="Board book">Board book</option>
						<option value="Leather Bound">Leather Bound</option>
						<option value="Unbound">Unbound</option>
						<option value="Spiral-bound">Spiral-bound</option>
						<option value="Unknown Binding">Unknown Binding</option>
					</select>
				) : (
					<input
						type="text"
						value={formatInput}
						onChange={(e) => setFormatInput(e.target.value)}
					></input>
				)}
				{!formatIsOther ? (
					<button
						className="set-format-to-other-button"
						onClick={(_e) => {
							setFormatIsOther(true);
							setFormatInput('');
						}}
					>
						Other
					</button>
				) : (
					<button
						className="set-format-to-options"
						onClick={(_e) => {
							setFormatIsOther(false);
							setFormatInput('');
						}}
					>
						options
					</button>
				)}
				{!formatIsOther ? formatPopup : null}
			</div>
			<div className="form-edition-area">
				<label htmlFor="edition" className="main-label">
					edition
				</label>
				<input
					type="text"
					name="edition"
					value={editionInput}
					onChange={(e) => setEditionInput(e.target.value)}
				></input>
				{editionPopup}
			</div>
			<div className="form-description-area">
				<label htmlFor="description" className="main-label">
					description
				</label>
				<textarea
					name="description"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				></textarea>
				{descriptionPopup}
			</div>
			<div className="form-edition-language-area">
				<label htmlFor="edition-language" className="main-label">
					edition language
				</label>
				<select
					name="edition-language"
					value={editionLanguageInput}
					onChange={(e) => setEditionLanguageInput(e.target.value)}
				>
					<option value="Selected...">Selected...</option>
					{languageOptions.map((option, index) => {
						return (
							<option value={option} key={index}>
								{option}
							</option>
						);
					})}
				</select>
				{languagePopup}
			</div>
		</form>
	);

	const workSettingsForm =
		bookId === undefined ? (
			<form className="add-new-book-page-work-settings-form">
				<div className="work-settings-form-top">
					<h2>Work Settings</h2>
					<span>
						Original publication date, characters, awards, and setting apply to
						all books in this work.
					</span>
				</div>
				<div className="work-settings-form-bottom">
					<div className="form-original-title-area">
						<label htmlFor="original-title">original title</label>
						<input
							type="text"
							name="original-title"
							value={originalTitleInput}
							onChange={(e) => setOriginalTitleInput(e.target.value)}
						></input>
						{originalTitlePopup}
					</div>
					<div className="form-original-publication-date-area">
						<div className="published-year">
							<label htmlFor="published-year">year:</label>
							<input
								type="text"
								name="published-year"
								value={originalPublishedYearInput}
								onChange={(e) => setOriginalPublishedYearInput(e.target.value)}
							></input>
							{originalPublicationYearPopup}
						</div>
						<div className="published-month">
							<label htmlFor="published-month">month:</label>
							<select
								name="published-month"
								value={originalPublishedMonthInput}
								onChange={(e) => setOriginalPublishedMonthInput(e.target.value)}
							>
								<option value=""></option>
								<option value="January">January</option>
								<option value="February">February</option>
								<option value="March">March</option>
								<option value="April">April</option>
								<option value="May">May</option>
								<option value="June">June</option>
								<option value="July">July</option>
								<option value="August">August</option>
								<option value="September">September</option>
								<option value="October">October</option>
								<option value="November">November</option>
								<option value="December">December</option>
							</select>
						</div>
						<div className="published-day">
							<label htmlFor="published-day">day:</label>
							<select
								name="published-day"
								value={originalPublishedDayInput}
								onChange={(e) => setOriginalPublishedDayInput(e.target.value)}
							>
								<option></option>
								{Array(31)
									.fill(0)
									.map((_value, index) => (
										<option key={index} value={toString(index + 1)}>
											{index + 1}
										</option>
									))}
							</select>
						</div>
					</div>
				</div>
			</form>
		) : null;

	const leftSection = loaded ? (
		<div className="add-new-book-page-left-section">
			{addNewBookPageTitle}
			{bookForm}
			{workSettingsForm}
			<div className="add-new-book-page-left-section-bottom">
				<span>
					<span className="red-asterisk">*</span>
					<span>denotes required field</span>
				</span>
			</div>
		</div>
	) : null;

	const mainContent = (
		<div className="add-new-book-page-main-content">{leftSection}</div>
	);

	return (
		<div className="add-new-book-page">
			<TopBar />
			{mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default AddNewBookPage;
