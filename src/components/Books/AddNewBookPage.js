import React, { useState, useEffect } from 'react';
import Firebase from '../../Firebase';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import ReCAPTCHA from 'react-google-recaptcha';
import '../styles/Books/AddNewBookPage.css';

const AddNewBookPage = ({ location }) => {
	const query = new URLSearchParams(location.search);
	const authorName = query.get('author[name]');
	const bookTitle = query.get('book[title]');
	const bookId = query.get('work[id]');
	const [loaded, setLoaded] = useState(false);
	const [description, setDescription] = useState('');
	const [titleInput, setTitleInput] = useState(
		bookTitle !== null ? bookTitle : ''
	);
	const [mainAuthorNameInput, setMainAuthorNameInput] = useState(
		authorName !== null ? authorName : ''
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
	const [isTitlePopupHidden, setIsTitlePopupHidden] = useState(true);
	const [isMainAuthorPopupHidden, setIsMainAuthorPopupHidden] = useState(true);
	const [
		isMainAuthorRolePopupHidden,
		setIsMainAuthorRolePopupHidden,
	] = useState(true);
	const [isOtherAuthorsPopupHidden, setIsOtherAuthorsPopupHidden] = useState(
		[]
	);
	const [
		isOtherAuthorsRolesPopupHidden,
		setIsOtherAuthorsRolesPopupHidden,
	] = useState([]);
	const [isPublishedYearPopupHidden, setIsPublishedYearPopupHidden] = useState(
		true
	);
	const [isFormatPopupHidden, setIsFormatPopupHidden] = useState(true);
	const [isEditionPopupHidden, setIsEditionPopupHidden] = useState(true);
	const [isDescriptionPopupHidden, setIsDescriptionPopupHidden] = useState(
		true
	);
	const [isLanguagePopupHidden, setIsLanguagePopupHidden] = useState(true);
	const [isOriginalTitlePopupHidden, setIsOriginalTitlePopupHidden] = useState(
		true
	);
	const [
		isOriginalPublicationYearPopupHidden,
		setIsOriginalPublicationYearPopupHidden,
	] = useState(true);

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
		<div
			className={
				isTitlePopupHidden
					? 'add-new-book-page-popup-wrapper hidden'
					: 'add-new-book-page-popup-wrapper'
			}
		>
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
		<div
			className={
				isMainAuthorPopupHidden
					? 'add-new-book-page-popup-wrapper hidden'
					: 'add-new-book-page-popup-wrapper'
			}
		>
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

	const generateRolePopup = (index) => (
		<div
			className={
				(index === 0 && isMainAuthorRolePopupHidden) ||
				(index !== 0 && isOtherAuthorsRolesPopupHidden[index - 1])
					? 'add-new-book-page-popup-wrapper hidden'
					: 'add-new-book-page-popup-wrapper'
			}
		>
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

	const generateOtherAuthorsPopup = (index) => (
		<div
			className={
				isOtherAuthorsPopupHidden[index]
					? 'add-new-book-page-popup-wrapper hidden'
					: 'add-new-book-page-popup-wrapper'
			}
		>
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
		<div
			className={
				isPublishedYearPopupHidden
					? 'add-new-book-page-popup-wrapper hidden'
					: 'add-new-book-page-popup-wrapper'
			}
		>
			<div className="add-new-book-page-popup">
				<span>This is the date this particular edition was published.</span>
			</div>
			<div className="add-new-book-page-popup-tip"></div>
		</div>
	);

	const formatPopup = (
		<div
			className={
				isFormatPopupHidden
					? 'add-new-book-page-popup-wrapper hidden'
					: 'add-new-book-page-popup-wrapper'
			}
		>
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
		<div
			className={
				isEditionPopupHidden
					? 'add-new-book-page-popup-wrapper hidden'
					: 'add-new-book-page-popup-wrapper'
			}
		>
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
		<div
			className={
				isDescriptionPopupHidden
					? 'add-new-book-page-popup-wrapper hidden'
					: 'add-new-book-page-popup-wrapper'
			}
		>
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
		<div
			className={
				isLanguagePopupHidden
					? 'add-new-book-page-popup-wrapper hidden'
					: 'add-new-book-page-popup-wrapper'
			}
		>
			<div className="add-new-book-page-popup">
				<span>
					The language this edition of the book is primarily written in.
				</span>
			</div>
			<div className="add-new-book-page-popup-tip"></div>
		</div>
	);

	const originalTitlePopup = (
		<div
			className={
				isOriginalTitlePopupHidden
					? 'add-new-book-page-popup-wrapper hidden'
					: 'add-new-book-page-popup-wrapper'
			}
		>
			<div className="add-new-book-page-popup">
				<span>Title of the original publication of this work.</span>
			</div>
			<div className="add-new-book-page-popup-tip"></div>
		</div>
	);

	const originalPublicationYearPopup = (
		<div
			className={
				isOriginalPublicationYearPopupHidden
					? 'add-new-book-page-popup-wrapper hidden'
					: 'add-new-book-page-popup-wrapper'
			}
		>
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
					onFocus={(_e) => setIsTitlePopupHidden(false)}
					onBlur={(_e) => setIsTitlePopupHidden(true)}
				></input>
				{titlePopup}
			</div>
			<div className="form-author-area">
				<div className="main-author-area">
					<label htmlFor="author" className="main-label">
						<span>author</span>
						<span className="red-asterisk">*</span>
					</label>
					<input
						type="text"
						name="author"
						required={true}
						value={mainAuthorNameInput}
						onChange={(e) => setMainAuthorNameInput(e.target.value)}
						onFocus={(_e) => setIsMainAuthorPopupHidden(false)}
						onBlur={(_e) => setIsMainAuthorPopupHidden(true)}
					></input>
					{mainAuthorPopup}
					{mainAuthorRoleInput === null ? (
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
								value={mainAuthorRoleInput !== null ? mainAuthorRoleInput : ''}
								onChange={(e) => setMainAuthorRoleInput(e.target.value)}
								onFocus={(_e) => setIsMainAuthorRolePopupHidden(false)}
								onBlur={(_e) => setIsMainAuthorRolePopupHidden(true)}
							></input>
							{generateRolePopup(0)}
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
										onFocus={(_e) =>
											setIsOtherAuthorsPopupHidden((previous) =>
												previous.map((value, i) =>
													i === index ? false : value
												)
											)
										}
										onBlur={(_e) =>
											setIsOtherAuthorsPopupHidden((previous) =>
												previous.map((value, i) => (i === index ? true : value))
											)
										}
									></input>
									{generateOtherAuthorsPopup(index)}
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
										onFocus={(_e) =>
											setIsOtherAuthorsRolesPopupHidden((previous) =>
												previous.map((value, i) =>
													i === index + 1 ? false : value
												)
											)
										}
										onBlur={(_e) =>
											setIsOtherAuthorsRolesPopupHidden((previous) =>
												previous.map((value, i) =>
													i === index + 1 ? true : value
												)
											)
										}
									></input>
									{generateRolePopup(index + 1)}
								</div>
							</div>
						);
					})}
					<button
						className="add-new-author-button"
						onClick={(_e) => {
							setOtherAuthorNameInputs((previous) => previous.concat(''));
							setOtherAuthorRoleInputs((previous) => previous.concat(''));
							setIsOtherAuthorsPopupHidden((previous) => previous.concat(true));
							setIsOtherAuthorsRolesPopupHidden((previous) =>
								previous.concat(true)
							);
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
							onFocus={(_e) => setIsPublishedYearPopupHidden(false)}
							onBlur={(_e) => setIsPublishedYearPopupHidden(true)}
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
						onFocus={(_e) => setIsFormatPopupHidden(false)}
						onBlur={(_e) => setIsFormatPopupHidden(true)}
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
							setIsFormatPopupHidden(true);
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
					onFocus={(_e) => setIsEditionPopupHidden(false)}
					onBlur={(_e) => setIsEditionPopupHidden(true)}
				></input>
				{editionPopup}
			</div>
			<div className="form-description-area">
				<label htmlFor="description" className="main-label">
					description
				</label>
				<textarea
					name="description"
					rows="20"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
					onFocus={(_e) => setIsDescriptionPopupHidden(false)}
					onBlur={(_e) => setIsDescriptionPopupHidden(true)}
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
					onFocus={(_e) => setIsLanguagePopupHidden(false)}
					onBlur={(_e) => setIsLanguagePopupHidden(true)}
				>
					<option value="Select...">Select...</option>
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
		bookId === null ? (
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
						<label htmlFor="original-title" className="main-label">
							original title
						</label>
						<input
							type="text"
							name="original-title"
							value={originalTitleInput}
							onChange={(e) => setOriginalTitleInput(e.target.value)}
							onFocus={(_e) => setIsOriginalTitlePopupHidden(false)}
							onBlur={(_e) => setIsOriginalTitlePopupHidden(true)}
						></input>
						{originalTitlePopup}
					</div>
					<div className="form-original-publication-date-area">
						<label htmlFor="original-publication-date" className="main-label">
							original publication date
						</label>
						<div className="original-publication-date">
							<div className="published-year">
								<label htmlFor="published-year">year:</label>
								<input
									type="text"
									name="published-year"
									value={originalPublishedYearInput}
									onChange={(e) =>
										setOriginalPublishedYearInput(e.target.value)
									}
									onFocus={(_e) =>
										setIsOriginalPublicationYearPopupHidden(false)
									}
									onBlur={(_e) => setIsOriginalPublicationYearPopupHidden(true)}
								></input>
								{originalPublicationYearPopup}
							</div>
							<div className="published-month">
								<label htmlFor="published-month">month:</label>
								<select
									name="published-month"
									value={originalPublishedMonthInput}
									onChange={(e) =>
										setOriginalPublishedMonthInput(e.target.value)
									}
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
				<ReCAPTCHA
					sitekey={process.env.REACT_APP_SITE_KEY}
					onChange={(value) => console.log(value)}
				/>
				<input type="submit" value="Create book"></input>
			</div>
		</div>
	) : null;

	const rightSection = (
		<div className="add-new-book-page-right-section">
			<div className="add-cover-image-section">
				<span>Add a cover image for this book.</span>
				<input type="file"></input>
			</div>
			<div className="guidelines-section">
				<span className="guidelines-section-title">Guidelines</span>
				<ul>
					<li>
						<b>Authors: </b>
						Add authors in the order they are listed on the book cover, or
						alphabetically if there is no cover or various editions disagree.
					</li>
					<li>
						<b>Format: </b>
						Should generally be Hardcover, Paperback, Audio CD, Ebook, etc
					</li>
					<li>
						<b>Title: </b>
						If the book is in a series, put which book it is in parenthesis
						after the title. For example: Harry Potter and the Sorcerer's Stone
						(Harry Potter, #1).
					</li>
					<li>
						<b>Types of books: </b>
						Please only add books. Books generally have ISBN numbers (but don't
						have to), and are usually published. Periodicals such as newspapers,
						magazines, and comics are not books. However a volume of comics or
						articles or a graphic novel is considered a book.
					</li>
				</ul>
			</div>
		</div>
	);

	const mainContent = (
		<div className="add-new-book-page-main-content">
			{leftSection}
			{rightSection}
		</div>
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
