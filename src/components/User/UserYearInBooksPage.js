import React, { useState, useEffect } from 'react';
import Firebase from '../../Firebase';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';

const UserYearInBooksPage = ({ match }) => {
    const {
        params: { year, userId }
    } = match;
    const numberYear = Number.parseInt(year);
    const isCurrentYear = (new Date()).getFullYear() === numberYear;
    const [books, setBooks] = useState([]);
    const [loaded, setLoaded] = useState(false);
    const user = JSON.parse(localStorage.getItem('userState'));

    useEffect(() => {
        const loadInfo = async () => {
            setBooks(await Firebase.getUserInfoForYearInBooksPage(userId));
            setLoaded(true);
        };

        loadInfo();
    }, [userId]);

    const overallStatsSection = (
        <div className="user-year-in-books-overall-stats">
            <div className="user-year-in-books-overall-stats-top">
                <a href={Firebase.pageGenerator.generateUserYearInBooksPage(numberYear - 1, userId)}>Go to previous year</a>
                {!isCurrentYear ? <a href={Firebase.pageGenerator.generateUserYearInBooksPage(numberYear + 1, userId)}>Go to next year</a> : null}
            </div>
            <div className="user-year-in-books-image-and-title">
                <span className="year-span">{year}</span>
                <img src="https://s.gr-assets.com/assets/yyib/hero_desktop_2021@2x-2075d93f13d7007160228ce5e23000a7.png" alt="Open book" />
                <h1>My <i>Year</i> in Books</h1>
            </div>
            <div className="bottom-section">
                <div className="top-half">
                    <span className="stat">
                        <span className="number">{books.reduce((previous, current) => previous + current.pageCount, 0)}</span> pages read
                    </span>
                    <a className="profile-a" href={Firebase.pageGenerator.generateUserPage(userId, user.userInfo.firstName !== undefined ? user.userInfo.firstName : '')}>
                        <img
							alt="profile"
							src={
								user.userInfo !== undefined &&
								user.userInfo.profileImage !== undefined
									? user.userInfo.profileImage
									: 'https://www.goodreads.com/assets/nophoto/user/u_60x60-267f0ca0ea48fd3acfd44b95afa64f01.png'
							}
						></img>
                    </a>
                    <span className="stat">
                        <span className="number">{books.length}</span> books read
                    </span>
                </div>
            </div>
        </div>
    );

    const bookStatsSection = (<div></div>);

    const myBooks = (<div></div>);

    const mainContent = loaded ? (
        <div className="user-year-in-books-page-main-content">
            {overallStatsSection}
            {bookStatsSection}
            {myBooks}
        </div>
    ) : null;

    return (
		<div className="user-year-in-books-page">
			<TopBar />
            {mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default UserYearInBooksPage;