import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Firebase from '../../Firebase';

const ProfileSettings = (props) => {
	const [firstNameInput, setFirstNameInput] = useState(props.firstName);
	const [middleNameInput, setMiddleNameInput] = useState(props.middleName);
	const [lastNameInput, setLastNameInput] = useState(props.lastName);
	const [showLastNameToInput, setShowLastNameToInput] = useState(
		props.showLastNameTo
	);
	const [genderInput, setGenderInput] = useState(props.gender);
	const [customGenderInput, setCustomGenderInput] = useState(
		props.customGender
	);
	const [pronounsInput, setPronounsInput] = useState(props.pronouns);
	const [showGenderToInput, setShowGenderToInput] = useState(
		props.showGenderTo
	);
	const [zipCodeInput, setZipCodeInput] = useState(props.zipCode);
	const [cityInput, setCityInput] = useState(props.city);
	const [stateProvinceCodeInput, setStateProvidenceCodeInput] = useState(
		props.stateProvinceCode
	);
	const [countryInput, setCountryInput] = useState(props.country);
	const [locationViewableByInput, setLocationViewableByInput] = useState(
		props.locationViewableBy
	);
	const [dateOfBirthInput, setDateOfBirthInput] = useState(props.dateOfBirth);
	const [ageAndBirthdayPrivacyInput, setAgeAndBirthdayPrivacyInput] = useState(
		props.ageAndBirthdayPrivacy
	);
	const [websiteInput, setWebsiteInput] = useState(props.website);
	const [interestsInput, setInterestsInput] = useState(props.interests);
	const [typeOfBooksInput, setTypeOfBooksInput] = useState(props.typeOfBooks);
	const [aboutMeInput, setAboutMeInput] = useState(props.aboutMe);
	const [profilePictureFileInput, setProfilePictureFileInput] = useState('');

	const countryList = [
		'United States',
		'Canada',
		'Afghanistan',
		'Albania',
		'Algeria',
		'American Samoa',
		'Andorra',
		'Angola',
		'Anguilla',
		'Antarctica',
		'Antigua and/or Barbuda',
		'Argentina',
		'Armenia',
		'Aruba',
		'Australia',
		'Austria',
		'Azerbaijan',
		'Bahamas',
		'Bahrain',
		'Bangladesh',
		'Barbados',
		'Belarus',
		'Belgium',
		'Belize',
		'Benin',
		'Bermuda',
		'Bhutan',
		'Bolivia',
		'Bosnia and Herzegovina',
		'Botswana',
		'Bouvet Island',
		'Brazil',
		'British Indian Ocean Territory',
		'Brunei Darussalam',
		'Bulgaria',
		'Burkina Faso',
		'Burundi',
		'Cambodia',
		'Cameroon',
		'Cape Verde',
		'Cayman Islands',
		'Central African Republic',
		'Chad',
		'Chile',
		'China',
		'Christmas Island',
		'Cocos (Keeling) Islands',
		'Colombia',
		'Comoros',
		'Congo',
		'Cook Islands',
		'Costa Rica',
		'Croatia (Hrvatska)',
		'Cuba',
		'Cyprus',
		'Czech Republic',
		'Denmark',
		'Djibouti',
		'Dominica',
		'Dominican Republic',
		'East Timor',
		'Ecudaor',
		'Egypt',
		'El Salvador',
		'Equatorial Guinea',
		'Eritrea',
		'Estonia',
		'Ethiopia',
		'Falkland Islands (Malvinas)',
		'Faroe Islands',
		'Fiji',
		'Finland',
		'France',
		'France, Metropolitan',
		'French Guiana',
		'French Polynesia',
		'French Southern Territories',
		'Gabon',
		'Gambia',
		'Georgia',
		'Germany',
		'Ghana',
		'Gibraltar',
		'Greece',
		'Greenland',
		'Grenada',
		'Guadeloupe',
		'Guam',
		'Guatemala',
		'Guinea',
		'Guinea-Bissau',
		'Guyana',
		'Haiti',
		'Heard and Mc Donald Islands',
		'Honduras',
		'Hong Kong',
		'Hungary',
		'Iceland',
		'India',
		'Indonesia',
		'Iran (Islamic Republic of)',
		'Iraq',
		'Ireland',
		'Israel',
		'Italy',
		'Ivory Coast',
		'Jamaica',
		'Japan',
		'Jordan',
		'Kazakhstan',
		'Kenya',
		'Kiribati',
		"Korea, Democratic People's Republic of",
		'Korea, Republic of',
		'Kosovo',
		'Kuwait',
		'Kyrgyzstan',
		"Lao People's Democratic Republic",
		'Latvia',
		'Lebanon',
		'Lesotho',
		'Liberia',
		'Libyan Arab Jamahiriya',
		'Liechtenstein',
		'Lithuania',
		'Luxembourg',
		'Macau',
		'Macedonia',
		'Madagascar',
		'Malawi',
		'Malaysia',
		'Maldives',
		'Mali',
		'Malta',
		'Marshall Islands',
		'Martinique',
		'Mauritania',
		'Mauritius',
		'Mayotte',
		'Mexico',
		'Micronesia, Federated States of',
		'Moldova, Republic of',
		'Monaco',
		'Mongolia',
		'Montserrat',
		'Morocco',
		'Mozambique',
		'Myanmar',
		'Namibia',
		'Nauru',
		'Nepal',
		'Netherlands',
		'Netherlands Antilles',
		'New Caledonia',
		'New Zealand',
		'Nicaragua',
		'Niger',
		'Nigeria',
		'Niue',
		'Norfork Island',
		'Northern Mariana Islands',
		'Norway',
		'Oman',
		'Pakistan',
		'Palau',
		'Panama',
		'Papua New Guinea',
		'Paraguay',
		'Peru',
		'Philippines',
		'Pitcairn',
		'Poland',
		'Portugal',
		'Puerto Rico',
		'Qatar',
		'Reunion',
		'Romania',
		'Russian Federation',
		'Rwanda',
		'Saint Kitts and Nevis',
		'Saint Lucia',
		'Saint Vincent and the Grenadines',
		'Samoa',
		'San Marino',
		'Sao Tome and Principe',
		'Saudi Arabia',
		'Senegal',
		'Seychelles',
		'Sierra Leone',
		'Singapore',
		'Slovakia',
		'Slovenia',
		'Solomon Islands',
		'Somalia',
		'South Africa',
		'South Georgia South Sandwich Islands',
		'South Sudan',
		'Spain',
		'Sri Lanka',
		'St. Helena',
		'St. Pierre and Miquelon',
		'Sudan',
		'Suriname',
		'Svalbarn and Jan Mayen Islands',
		'Swaziland',
		'Sweden',
		'Switzerland',
		'Syrian Arab Republic',
		'Taiwan',
		'Tajikistan',
		'Tanzania, United Republic of',
		'Thailand',
		'Togo',
		'Tokelau',
		'Tonga',
		'Trinidad and Tobago',
		'Tunisia',
		'Turkey',
		'Turkmenistan',
		'Turks and Caicos Islands',
		'Tuvalu',
		'Uganda',
		'Ukraine',
		'United Arab Emirates',
		'United Kingdom',
		'United States minor outlying islands',
		'Uruguay',
		'Uzbekistan',
		'Vanuatu',
		'Vatican City State',
		'Venezuela',
		'Vietnam',
		'Virigan Islands (British)',
		'Virgin Islands (U.S.)',
		'Wallis and Futuna Islands',
		'Western Sahara',
		'Yemen',
		'Yugoslavia',
		'Zaire',
		'Zambia',
		'Zimbabwe',
	];
	const monthList = [
		'January',
		'February',
		'March',
		'April',
		'May',
		'June',
		'July',
		'August',
		'September',
		'October',
		'November',
		'December',
	];

	return (
		<form className="profile-settings">
			<div className="left-section">
				<label htmlFor="first-name">
					First Name <span className="red-asterisk">*</span>
				</label>
				<input
					type="text"
					className="first-name-input"
					name="first-name"
					value={firstNameInput}
					onChange={(e) => setFirstNameInput(e.target.value)}
				></input>
				<label htmlFor="middle-name">Middle Name</label>
				<input
					type="text"
					className="middle-name-input"
					name="middle-name"
					value={middleNameInput}
					onChange={(e) => setMiddleNameInput(e.target.value)}
				></input>
				<label htmlFor="last-name">Last Name</label>
				<input
					type="text"
					className="last-name-input"
					name="last-name"
					value={lastNameInput}
					onChange={(e) => setLastNameInput(e.target.value)}
				></input>
				<label htmlFor="show-last-name-preference">Show my last name to:</label>
				<div className="show-last-name-preference">
					<input
						type="radio"
						name="anyone-radio-input"
						value="anyone"
						checked={showLastNameToInput === 'anyone'}
						onChange={(e) => setShowLastNameToInput(e.target.value)}
					></input>
					<label htmlFor="anyone-radio-input">Anyone</label>
					<input
						type="radio"
						name="friends-radio-input"
						value="friends"
						checked={showLastNameToInput === 'friends'}
						onChange={(e) => setShowLastNameToInput(e.target.value)}
					></input>
					<label htmlFor="friends-radio-input">Friends</label>
				</div>
				<label htmlFor="gender">Gender</label>
				<select
					value={genderInput}
					name="gender"
					className="gender-select"
					onChange={(e) => setGenderInput(e.target.value)}
				>
					<option value="">Select</option>
					<option value="m">Male</option>
					<option value="f">Female</option>
					<option value="c">Custom</option>
				</select>
				{genderInput === 'c' ? (
					<div className="custom-gender-section">
						<label htmlFor="custom-gender">Custom gender</label>
						<input
							type="text"
							name="custom-gender"
							className="custom-gender-input"
							value={customGenderInput}
							onChange={(e) => setCustomGenderInput(e.target.value)}
						></input>
						<label htmlFor="preferred-pronoun">Preferred pronoun</label>
						<select
							value={pronounsInput}
							name="preferred-pronoun"
							className="preferred-pronoun-select"
							onChange={(e) => setPronounsInput(e.target.value)}
						>
							<option value="neutral">Neutral: "Recommend them a book!"</option>
							<option value="male">Male: "Recommend him a book!"</option>
							<option value="female">Female: "Recommend her a book!"</option>
						</select>
					</div>
				) : null}
				<label html="gender-privacy">Gender Viewable By</label>
				<select
					name="gender-privacy"
					value={showGenderToInput}
					onChange={(e) => setShowGenderToInput(e.target.value)}
				>
					<option value="everyone">Everyone</option>
					<option value="friends-only">Friends Only</option>
					<option value="no-one">No One</option>
				</select>
				<span className="gender-privacy-note">
					Note: Pronouns (he/she/they) will be seen by everyone regardless of
					this setting.
				</span>
				<label htmlFor="zip-code">
					ZIP CODE <span className="small-text">(US only)</span>
				</label>
				<input
					className="zip-code-input"
					name="zip-code"
					type="text"
					value={zipCodeInput}
					onChange={(e) => setZipCodeInput(e.target.value)}
				></input>
				<label htmlFor="city">City</label>
				<input
					className="city-input"
					name="city"
					type="text"
					value={cityInput}
					onChange={(e) => setCityInput(e.target.value)}
				></input>
				<label htmlFor="state-province-code">State/Providence Code</label>
				<input
					className="state-province-code-input"
					name="state-province-code"
					type="text"
					value={stateProvinceCodeInput}
					onChange={(e) => setStateProvidenceCodeInput(e.target.value)}
				></input>
				<label htmlFor="country">Country</label>
				<select
					value={countryInput}
					name="country"
					className="country-select"
					onChange={(e) => setCountryInput(e.target.value)}
				>
					<option value="">Select</option>
					{countryList.map((country, index) => {
						return (
							<option key={index} value={country}>
								{country}
							</option>
						);
					})}
				</select>
				<label htmlFor="location-privacy">Location Viewable By:</label>
				<select
					name="location-privacy"
					className="location-privacy-select"
					value={locationViewableByInput}
					onChange={(e) => setLocationViewableByInput(e.target.value)}
				>
					<option value="everyone">Everyone</option>
					<option value="friends-only">Friends Only</option>
					<option value="no-one">No One</option>
				</select>
				<label htmlFor="date-of-birth">
					<span>Date of Birth</span>
					<button
						className="set-birthday-to-blank-button"
						onClick={(_e) => setDateOfBirthInput(undefined)}
					>
						{' '}
						(set all to blank to remove)
					</button>
				</label>
				<div className="date-of-birth">
					<select
						className="birth-year-select"
						value={
							dateOfBirthInput !== undefined
								? dateOfBirthInput.getFullYear()
								: ''
						}
						onChange={(e) =>
							setDateOfBirthInput((previous) =>
								e.target.value === ''
									? undefined
									: new Date(
											parseInt(e.target.value),
											previous.getMonth(),
											previous.getDate()
									  )
							)
						}
					>
						<option value=""></option>
						{Array(88)
							.map((_value, index) => new Date().getFullYear() - 87 + index)
							.map((year, index) => {
								return (
									<option value={year} key={index}>
										{year}
									</option>
								);
							})}
					</select>
					<select
						className="birth-month-select"
						value={
							dateOfBirthInput !== undefined ? dateOfBirthInput.getMonth() : ''
						}
						onChange={(e) =>
							setDateOfBirthInput((previous) =>
								e.target.value === ''
									? undefined
									: new Date(
											previous.getFullYear(),
											parseInt(e.target.value) - 1,
											previous.getDate()
									  )
							)
						}
					>
						<option value=""></option>
						{Array(12)
							.map((_value, index) => monthList[index])
							.map((month, index) => {
								return (
									<option value={month} key={index}>
										{month}
									</option>
								);
							})}
					</select>
					<select
						className="birth-day-select"
						value={
							dateOfBirthInput !== undefined ? dateOfBirthInput.getMonth() : ''
						}
						onChange={(e) =>
							setDateOfBirthInput((previous) =>
								e.target.value === ''
									? undefined
									: new Date(
											previous.getFullYear(),
											monthList.indexOf(previous.getMonth()),
											parseInt(e.target.value)
									  )
							)
						}
					>
						<option value=""></option>
						{Array(31).map((_value, index) => (
							<option value={index + 1}>{index + 1}</option>
						))}
					</select>
				</div>
				<label htmlFor="age-and-birthday-privacy">
					{'Age & Birthday Privacy:'}
				</label>
				<select
					value={ageAndBirthdayPrivacyInput}
					name="age-and-birthday-privacy"
					className="age-and-birthday-privacy-select"
					onChange={(e) => setAgeAndBirthdayPrivacyInput(e.target.value)}
				>
					<option value="age-members-birthday-members">
						{'Age & Birthday to Goodreads members'}
					</option>
					<option value="age-members-birthday-friends">
						Age to Goodreads members, Birthday to friends
					</option>
					<option value="age-members-birthday-no-one">
						Age to Goodreads members, Birthday to no one
					</option>
					<option value="age-friends-birthday-friends">
						{'Age & Birthday to friends'}
					</option>
					<option value="age-friends-birthday-no-one">
						Age to friends, Birthday to no one
					</option>
					<option value="age-no-one-birthday-no-one">
						{'Age & Birthday to no one'}
					</option>
					<option value="age-no-one-birthday-members">
						{'Age to no one & Birthday to Goodreads members'}
					</option>
					<option value="age-no-one-birthday-friends">
						{'Age to no one & Birthday to friends'}
					</option>
				</select>
				<label htmlFor="website">
					My Web Site
					<span className="small-text"> (e.g. http://www.myblog.com)</span>
				</label>
				<input
					type="text"
					value={websiteInput}
					name="website"
					className="website-input"
					onChange={(e) => setWebsiteInput(e.target.value)}
				></input>
				<label htmlFor="interests">
					My Interests — favorite subjects, or really anything you know a lot
					about
				</label>
				<span className="interests-note">
					<i>(in comma separated phrases, please)</i>
				</span>
				<input
					type="text"
					name="interests"
					className="interests-input"
					value={interestsInput}
					onChange={(e) => setInterestsInput(e.target.value)}
				></input>
				<label htmlFor="type-of-books">
					What Kind of Books Do You Like to Read?
				</label>
				<input
					type="text"
					name="type-of-books"
					className="type-of-books-input"
					value={typeOfBooksInput}
					onChange={(e) => setTypeOfBooksInput(e.target.value)}
				></input>
				<label htmlFor="about-me">About Me</label>
				<textarea
					name="about-me"
					className="about-me-input"
					value={aboutMeInput}
					onChange={(e) => setAboutMeInput(e.target.value)}
				></textarea>
				<input
					type="submit"
					className="submit-button"
					value="Save Profile Settings"
					onClick={(e) => {
						e.preventDefault();
						props.saveProfileSettings({
							firstNameInput,
							middleNameInput,
							lastNameInput,
							showLastNameToInput,
							genderInput,
							customGenderInput,
							pronounsInput,
							showGenderToInput,
							zipCodeInput,
							cityInput,
							stateProvinceCodeInput,
							countryInput,
							locationViewableByInput,
							dateOfBirthInput,
							ageAndBirthdayPrivacyInput,
							websiteInput,
							interestsInput,
							typeOfBooksInput,
							aboutMeInput,
						});
					}}
				></input>
			</div>
			<div className="right-section">
				<a
					className="profile-picture-wrapper"
					href={Firebase.pageGenerator.generateUserPhotoPage(props.id)}
				>
					<img
						src={
							props.profilePicture !== undefined
								? props.profilePicture
								: 'https://s.gr-assets.com/assets/nophoto/user/m_111x148-e08b4682eea7088f8cdfd67c131d51cd.png'
						}
						alt={props.firstName}
					/>
				</a>
				{props.profilePicture !== undefined ? (
					<button
						className="delete-change-profile-picture-button"
						onClick={(_e) => props.deleteProfilePicture()}
					>
						Delete/Change Photo
					</button>
				) : (
					<div className="new-photo-section">
						<input
							type="file"
							value={profilePictureFileInput}
							onChange={(e) => setProfilePictureFileInput(e.target.value)}
						></input>
						<button
							className="upload-photo-button"
							onClick={(_e) =>
								props.saveProfilePicture(profilePictureFileInput)
							}
						></button>
					</div>
				)}
				<button
					className="delete-account-button"
					onClick={(_e) => props.deleteAccount()}
				>
					Delete my account
				</button>
			</div>
		</form>
	);
};

ProfileSettings.propTypes = {
	id: PropTypes.string,
	firstName: PropTypes.string,
	middleName: PropTypes.string,
	lastName: PropTypes.string,
	showLastNameTo: PropTypes.string,
	gender: PropTypes.string,
	customGender: PropTypes.string,
	pronouns: PropTypes.string,
	showGenderTo: PropTypes.string,
	zipCode: PropTypes.string,
	city: PropTypes.string,
	stateProvinceCode: PropTypes.string,
	country: PropTypes.string,
	locationViewableBy: PropTypes.string,
	dateOfBirth: PropTypes.instanceOf(Date),
	ageAndBirthdayPrivacy: PropTypes.string,
	website: PropTypes.string,
	interests: PropTypes.string,
	typeOfBooks: PropTypes.string,
	aboutMe: PropTypes.string,
	profilePicture: PropTypes.string,
	saveProfileSettings: PropTypes.func,
	saveProfilePicture: PropTypes.func,
	deleteProfilePicture: PropTypes.func,
	deleteAccount: PropTypes.func,
};

export default ProfileSettings;
