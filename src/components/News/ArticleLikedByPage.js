import React, { useState, useEffect } from 'react';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';

const ArticleLikedByPage = ({ match }) => {
	const {
		params: { articleId },
	} = match;
	const [loaded, setLoaded] = useState(false);
	const [page, setPage] = useState(1);
	const [users, setUsers] = useState([]);
	/*
    users: [{
        id,
        name,
        profilePicture,
        numberOfBooks,
        numberOfFriends,
    }]
    */
};

export default ArticleLikedByPage;
