import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';

const BookCompatibilityTestPage = () => {
	const history = useHistory();
	const query = new URLSearchParams(useLocation().search);
	const userId = query.get('id');

	const mainContent = (
		<div className="book-compatibility-test-page-main-content"></div>
	);

	return (
		<div className="book-compatibility-test-page">
			<TopBar />
			{mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default BookCompatibilityTestPage;
