import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';
import '../styles/User/UserAddAsFriendPage.css';
import { trackPromise } from 'react-promise-tracker';

const UserAddAsFriendPage = ({ match }) => {
	const history = useHistory();
	const {
		params: { newFriendId },
	} = match;
	const [loaded, setLoaded] = useState(false);
	const [userInfo, setUserInfo] = useState({});
	const [isShowingMessageArea, setIsShowingMessageArea] = useState(false);
	const [message, setMessage] = useState('');
	const [isRequestSent, setIsRequestSent] = useState(false);

	const user = JSON.parse(localStorage.getItem('userState'));

	useEffect(() => {
		const getUserInfo = async () => {
			setUserInfo(
				await trackPromise(
					Firebase.getUserInfoForAddAsFriendPage(
						user.userUID,
						newFriendId,
						history
					)
				)
			);
			setLoaded(true);
		};

		if (user.userUID === newFriendId) {
			history.push({
				pathname: Firebase.pageGenerator.generateUserPage(
					newFriendId,
					user.userInfo.firstName
				),
				state: "You can't be friends with yourself.",
			});
		} else if (user.userUID === null || user.userUID === undefined) {
			history.push({
				pathname: '/user/sign_in',
			});
		} else {
			getUserInfo();
		}
	}, [user.userUID, newFriendId, user.userInfo.firstName, history]);

	const pageHeader = loaded ? (
		<h1 className="user-add-as-friend-page-header">
			<a
				href={Firebase.pageGenerator.generateUserPage(
					newFriendId,
					userInfo.firstName
				)}
			>
				{userInfo.firstName}
			</a>
			<span>{' > Add as a Friend'}</span>
		</h1>
	) : null;

	const requestSentArea = loaded ? (
		<div className="user-add-as-friend-page-request-sent-area">
			<span>{`A friend request has been sent to ${userInfo.firstName}.`}</span>
			<span>
				After confirmation has been made, you will be notified by email.
			</span>
			<a
				className="ok-a"
				href={Firebase.pageGenerator.generateUserPage(
					newFriendId,
					userInfo.firstName
				)}
			>
				Ok
			</a>
		</div>
	) : null;

	const explanationSection = loaded ? (
		<div className="user-add-as-friend-page-explanation-section">
			<span className="black-span">
				Please only add people who you are genuinely interested in being friends
				with!
			</span>
			<span className="black-span">{`We will ask ${userInfo.firstName} to confirm you as a friend before the connection is made.`}</span>
			<button
				className="add-message-button"
				onClick={(_e) => setIsShowingMessageArea((previous) => !previous)}
			>
				add a message (optional) »{' '}
			</button>
			<textarea
				className={isShowingMessageArea ? 'message' : 'message hidden'}
				value={message}
				onChange={(e) => setMessage(e.target.value)}
			></textarea>
			<span className="grey-span">{`Submitting a friend request will cause you to start following ${userInfo.firstName} right away. You will see ${userInfo.pronouns} reviews and status updates on your home page, even before they accept your friend request.`}</span>
		</div>
	) : null;

	const bottomSection = loaded ? (
		<div className="user-add-as-friend-page-bottom-section">
			<button
				className="add-friend-button"
				onClick={async (_e) => {
					await Firebase.sendFriendRequest(
						user.userUID,
						newFriendId,
						message.length > 0 ? message : undefined
					);
					setIsRequestSent(true);
				}}
			>
				Add as a Friend
			</button>
			<a
				className="cancel-a"
				href={Firebase.pageGenerator.generateUserPage(
					newFriendId,
					userInfo.firstName
				)}
			>
				cancel
			</a>
		</div>
	) : null;

	const mainContent = (
		<div className="user-add-as-friend-page-main-content">
			{pageHeader}
			{!isRequestSent ? explanationSection : requestSentArea}
			{!isRequestSent ? bottomSection : null}
		</div>
	);

	return (
		<div className="user-add-as-friend-page">
			<TopBar />
			{mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default UserAddAsFriendPage;
