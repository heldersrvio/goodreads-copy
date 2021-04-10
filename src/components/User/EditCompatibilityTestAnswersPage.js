import React, { useState, useEffect, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';

const EditCompatibilityTestAnswersPage = () => {
	const history = useHistory();
	const [loaded, setLoaded] = useState(false);
	const [booksInfo, setBooksInfo] = useState({});
	const query = new URLSearchParams(useLocation().search);
	const userId = query.get('id');

	/*
    booksInfo: {
        popularBooks: [{
            id,
            title,
            cover,
        }],
        classicsBooks: [{
            id,
            title,
            cover,
        }],
        popularFictionBooks: [{
            id,
            title,
            cover,
        }],
        thrillersBooks: [{
            id,
            title,
            cover,
        }],
        nonFictionBooks: [{
            id,
            title,
            cover,
        }],
        fantasyBooks: [{
            id,
            title,
            cover,
        }],
        romanceBooks: [{
            id,
            title,
            cover,
        }],
        scienceFictionBooks: [{
            id,
            title,
            cover,
        }],
        womensFictionBooks: [{
            id,
            title,
            cover,
        }],
    }
    */

	const categoryTitles = [
		'POPULAR BOOKS',
		'CLASSICS BOOKS',
		'POPULAR FICTION BOOKS',
		'THRILLERS BOOKS',
		'NONFICTION BOOKS',
		'FANTASY BOOKS',
		'ROMANCE BOOKS',
		'SCIENCE FICTION BOOKS',
		"WOMEN'S FICTION BOOKS",
	];

	const popularBooksIds = useMemo(
		() => [
			'JdE1oE1zeZYOVU8PYyy7',
			'Fctu87S2XLy2RA5Wcr6H',
			'0Ahlt0lmj06b0rKaD7qJ',
			'24P8kxLmS4LmtcDSPkvl',
		],
		[]
	);
	const classicsBooksIds = useMemo(
		() => [
			'6490z4ij4qsGAIBoeBMK',
			'Djx2P7Egc9cJgfdwwF37',
			'H1xRvYEIDyk54H68QssS',
			'HfkmwYPOfQ4MtpLnLNlq',
		],
		[]
	);
	const popularFictionBooksIds = useMemo(
		() => ['JQBwpf6G3ND5pKXDYNlx', 'JdE1oE1zeZYOVU8PYyy7'],
		[]
	);
	const thrillersBooksIds = useMemo(
		() => [
			'VYSVKcKAKYwDq2PhV2cJ',
			'VncumXL1QTrVaGdhvM4O',
			'aJSCUT07kmUQqUlTegRv',
		],
		[]
	);
	const nonFictionBooksIds = useMemo(
		() => [
			'aJy9OMGHhUQ8GPZGRn6C',
			'bzRUzMqsdgjKD75Jxosn',
			'dDSxgc4Af87DFYEsiTxq',
			'e7wTYJTr4dSkJLaEXWEO',
		],
		[]
	);
	const fantasyBooksIds = useMemo(
		() => [
			'hx124Fx58u2xRqWUaxlv',
			'ljpqnZKAKgZSjbmrO6sF',
			'nSpJeOPwkgFKg45uc164',
			'oJ2euLQwJOn944VBu1tl',
		],
		[]
	);
	const romanceBooksIds = useMemo(
		() => ['pe83n32WlbIWRmYwyLiD', 'pttjrCHmNS16f2lhOU9e'],
		[]
	);
	const scienceFictionBooksIds = useMemo(
		() => [
			'qNejPAmYF2xlTdbnhH41',
			'qUe7SD2Jba5MbybZNUj5',
			'sBVe4XtgS9K0HldzfRBN',
		],
		[]
	);
	const womensFictionBooksIds = useMemo(
		() => [
			't8AF9o4IHodXuusb62ws',
			'uBI55trKgMJpRohAtxry',
			'unRbEhtsd1vcMxpSvDKI',
			'zCikj4mmQyZlyVNyP7cF',
		],
		[]
	);

	const topSection = (
		<div className="edit-compatibility-test-answers-page-main-content-top-section">
			<h1>Book Compatibility Test</h1>
			<span>Rate the books below and then click to get your report.</span>
			<a
				href={
					userId !== null
						? Firebase.pageGenerator.generateBookCompatibilityTestPage(userId)
						: Firebase.pageGenerator.generateInviteFriendsPage()
				}
			>
				Compare Results
			</a>
		</div>
	);

	const categoriesSection = loaded ? (
		<div className="edit-compatibility-test-answers-page-main-content-categories-section">
			<div className="categories">
				{Object.keys(booksInfo).map((key, index) => {
					<div className="category-books-list" key={index}>
						<span className="section-title"></span>
					</div>;
				})}
			</div>
		</div>
	) : null;

	return (
		<div className="edit-compatibility-test-answers-page">
			<TopBar />
			<div className="edit-compatibility-test-answers-page-main-section">
				{topSection}
			</div>
			<HomePageFootBar />
		</div>
	);
};

export default EditCompatibilityTestAnswersPage;
