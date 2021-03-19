import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { formatDistance } from 'date-fns';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';
import '../styles/Dashboard/NotificationsPage.css';

const NotificationsPage = () => {
	const history = useHistory();
	const [loaded, setLoaded] = useState(false);
	const [notifications, setNotifications] = useState([]);

	const user = JSON.parse(localStorage.getItem('userState'));

	useEffect(() => {
		const loadNotifications = async () => {
			setNotifications(
				await Firebase.getNotificationsForUser(user.userUID, history)
			);
			setLoaded(true);
		};
		loadNotifications();
	}, [user.userUID, history]);

	const pageHeader = (
		<h1 className="notifications-page-header">Notifications</h1>
	);

	const notificationList = loaded ? (
		<div className="notification-list">
			{notifications.map((notification, index) => {
				return (
					<div className="notification-card" key={index}>
						<a
							href={notification.anchorSrc}
							className="notification-image-wrapper"
						>
							<img src={notification.image} alt={notification.name} />
						</a>
						<div className="right-section">
							<span className="notification-span">
								{notification.name !== user.userInfo.firstName ? (
									<span>
										<strong>{notification.name}</strong>
										<span>
											{` ${notification.nonAnchorContent} `}
											<a
												href={notification.anchorSrc}
											>{` ${notification.content}`}</a>
										</span>
									</span>
								) : (
									<a
										href={notification.anchorSrc}
									>{`${notification.content}`}</a>
								)}
							</span>
							<span className="time-span">
								{formatDistance(notification.time, new Date(), {
									addSuffix: true,
								})}
							</span>
						</div>
					</div>
				);
			})}
		</div>
	) : null;

	return (
		<div className="notifications-page">
			<TopBar />
			{pageHeader}
			{notificationList}
			<HomePageFootBar />
		</div>
	);
};

export default NotificationsPage;
