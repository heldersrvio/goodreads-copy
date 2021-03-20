import React, { useState } from 'react';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import Firebase from '../../Firebase';

const Settings = (props) => {
	const [emailInput, setEmailInput] = useState(props.email);
	const [whoCanViewMyProfileInput, setWhoCanViewMyProfileInput] = useState(
		props.whoCanViewMyProfile
	);
	const [emailAddressVisibleToInput, setEmailAddressVisibleToInput] = useState(
		props.emailAddressVisibleTo
	);
	const [
		friendChallengeQuestionInput,
		setFriendChallengeQuestionInput,
	] = useState(props.friendChallengeQuestion);
	const [hasChallengeAnswer, setHasChallengeAnswer] = useState(
		props.friendChallengeAnswer !== ''
	);
	const [friendChallengeAnswerInput, setFriendChallengeAnswerInput] = useState(
		props.friendChallengeAnswer
	);

	return (
		<form className="settings">
			<label htmlFor="email">
				Email Address <span className="red-asterisk">*</span>
				<span className="small-text">
					{props.emailVerifiedDate !== undefined
						? `(verified ${format(props.emailVerifiedDate, 'MM-dd-yyyy')})`
						: ''}
				</span>
			</label>
			<input
				type="text"
				name="email"
				value={emailInput}
				onChange={(e) => setEmailInput(e.target.value)}
			></input>
			<label htmlFor="password"></label>
			<span className="password">
				<span>{Array(props.passwordLength).map((_value) => '*')}</span>
				<a href={Firebase.pageGenerator.generateChangePasswordPage()}>
					change password
				</a>
			</span>
			<div className="privacy-section">
				<h2>Privacy</h2>
				<span className="privacy-info-span">
					You control who can see your profile. Your profile includes your
					information on the{' '}
					<button
						className="profile-tab-button"
						onClick={props.moveToProfileTab}
					>
						profile tab
					</button>
					, your bookshelves, and your friend list. Your profile image thumbnail
					and your name will always be visible in some areas of the site, but
					you can hide your last name using the setting on the{' '}
					<button
						className="profile-tab-button"
						onClick={props.moveToProfileTab}
					>
						profile tab
					</button>
					. Book reviews are always public and will appear on book pages
					throughout the site regardless of privacy setting.
				</span>
				<label htmlFor="who-can-view-my-profile">
					<b>Who Can View My Profile:</b>
				</label>
				<div className="who-can-view-my-profile">
					<input
						type="radio"
						name="anyone"
						value="anyone"
						checked={whoCanViewMyProfileInput === 'anyone'}
						onChange={(e) => setWhoCanViewMyProfileInput(e.target.value)}
					></input>
					<label htmlFor="anyone">anyone</label>
					<input
						type="radio"
						name="goodreads-members"
						value="goodreads-members"
						checked={whoCanViewMyProfileInput === 'goodreads-members'}
						onChange={(e) => setWhoCanViewMyProfileInput(e.target.value)}
					></input>
					<label htmlFor="goodreads-members">Goodreads members</label>
					<input
						type="radio"
						name="just-my-friends"
						value="just-my-friends"
						checked={whoCanViewMyProfileInput === 'just-my-friends'}
						onChange={(e) => setWhoCanViewMyProfileInput(e.target.value)}
					></input>
					<label htmlFor="just-my-friends">just-my-friends</label>
				</div>
				<label htmlFor="email-visible-to">
					Make my email address visible to:
				</label>
				<div className="email-visible-to">
					<input
						type="radio"
						name="friends-friends-requests"
						value="friends-friends-requests"
						checked={emailAddressVisibleToInput === 'friends-friends-requests'}
						onChange={(e) => setEmailAddressVisibleToInput(e.target.value)}
					></input>
					<label htmlFor="friends-friends-requests">
						{'Friends & friend requests'}
					</label>
					<input
						type="radio"
						name="no-one"
						value="no-one"
						checked={emailAddressVisibleToInput === 'no-one'}
						onChange={(e) => setEmailAddressVisibleToInput(e.target.value)}
					></input>
					<label htmlFor="no-one">No one</label>
				</div>
			</div>
			<div className="friends-requests-section">
				<h2>Friend Requests</h2>
				<span className="friends-requests-info-span">
					You can require other Goodreads members to answer a challenge question
					when sending you friend requests. Note that this doesn't apply to
					friends who already know your email address.
				</span>
				<label htmlFor="challenge-question">Challenge question</label>
				<span className="challenge-question-example-span">
					{hasChallengeAnswer
						? 'Make it easy — eg. Where did I go to college? What kind of car do I drive? What is my last name?'
						: 'e.g., Why do you want to be my friend?'}
				</span>
				<input
					type="text"
					name="challenge-question"
					value={friendChallengeQuestionInput}
					onChange={(e) => setFriendChallengeQuestionInput(e.target.value)}
				></input>
				{hasChallengeAnswer ? (
					<label htmlFor="challenge-answer">
						Challenge Answer — your friends must guess this to friend you.
					</label>
				) : null}
				{hasChallengeAnswer ? (
					<span className="challenge-answer-span">
						Answers must be one word only.
					</span>
				) : null}
				{hasChallengeAnswer ? (
					<input
						type="text"
						name="challenge-answer"
						className="challenge-answer-input"
						value={friendChallengeAnswerInput}
						onChange={(e) => setFriendChallengeAnswerInput(e.target.value)}
					></input>
				) : null}
				<button
					className="require-challenge-answer-button"
					onChange={(_e) => setHasChallengeAnswer((previous) => !previous)}
				>
					{hasChallengeAnswer
						? "Don't require a challenge answer"
						: 'Require a challenge answer'}
				</button>
			</div>
			<input
				type="submit"
				className="submit-button"
				value="Save account settings"
				onClick={(e) => {
					e.preventDefault();
					props.saveAccountSettings({
						emailInput,
						whoCanViewMyProfileInput,
						emailAddressVisibleToInput,
						friendChallengeQuestionInput,
						friendChallengeAnswerInput,
					});
				}}
			></input>
			<a
				className="delete-account-a"
				href={Firebase.pageGenerator.generateDeleteAccountPage()}
			>
				Delete my account
			</a>
		</form>
	);
};

Settings.propTypes = {
	email: PropTypes.string,
	emailVerifiedDate: PropTypes.string,
	passwordLength: PropTypes.number,
	whoCanViewMyProfile: PropTypes.string,
	emailAddressVisibleTo: PropTypes.string,
	friendChallengeQuestion: PropTypes.string,
	friendChallengeAnswer: PropTypes.string,
	saveAccountSettings: PropTypes.func,
	moveToProfileTab: PropTypes.func,
};

export default Settings;
