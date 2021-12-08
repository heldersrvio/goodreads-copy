import React, { useState, useEffect } from 'react';
import Firebase from '../../Firebase';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';

const UserYearInBooksPage = ({ match }) => {
    const {
        params: { year, userId }
    } = match;

    const overallStatsSection = {

    };

    const bookStatsSection = {

    };

    const myBooks = {

    };

    const mainContent = {
        overallStatsSection,
        bookStatsSection,
        myBooks,
    };

    return (
		<div className="user-year-in-books-page">
			<TopBar />
            {mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default UserYearInBooksPage;