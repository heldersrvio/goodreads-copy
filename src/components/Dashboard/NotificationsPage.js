import React, { useState, useEffect } from 'react';
import { formatDistance } from 'date-fns';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';

const NotificationsPage = () => {
	const [loaded, setLoaded] = useState(false);
	const [notifications, setNotifications] = useState([]);

	const user = JSON.parse(localStorage.getItem('userState'));

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
								{formatDistance(notification.time.toDate(), new Date(), {
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
