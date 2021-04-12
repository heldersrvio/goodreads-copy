import React, { useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';

const UserBookshelfPage = ({ match }) => {
	const history = useHistory();
	const {
		params: { userId },
	} = match;
	const query = new URLSearchParams(useLocation().search);
	const shelf = query.get('shelf') !== null ? query.get('shelf') : 'all';
	const page = query.get('page') !== null ? query.get('page') : 1;
	const view = query.get('view') !== null ? query.get('view') : 'table';
	const [loaded, setLoaded] = useState(false);
	const [userInfo, setUserInfo] = useState({});
	/*
    userInfo: {
        firstName,
        profilePicture,
        shelves: [{
            name,
            books: [{
                id,
                cover,
                title,
                authorId,
                authorName,
                averageRating,
                dateAdded,
                datePublished,
                datePublishedEdition,
                dateRead,
                dateStarted,
                format,
                isbn,
                numberOfPages,
                numberOfRatings,
                position,
                rating,
                readCount,
                review,
                loggedInUserRating,
                loggedInUserHasInShelves,
            }],
        }]
    }
    */

	return (
		<div className="user-bookshelf-page">
			<TopBar />
			<HomePageFootBar />
		</div>
	);
};

export default UserBookshelfPage;
