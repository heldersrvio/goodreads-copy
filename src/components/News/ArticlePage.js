import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { format } from 'date-fns';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';
import '../styles/News/ArticlePage.css';

const ArticlePage = ({ match }) => {
	const history = useHistory();
	const {
		params: { articlePageId },
	} = match;
	const articleId = articlePageId.split('-')[0];
	const articleTitle = articlePageId
		.split('-')
		.slice(1)
		.map((string) =>
			string.length === 1
				? string.toUpperCase()
				: string[0].toUpperCase() + string.slice(1)
		)
		.join(' ');
	const [loaded, setLoaded] = useState(false);
	const [articleInfo, setArticleInfo] = useState({});
	const [savingLike, setSavingLike] = useState(false);
	/*
    articleInfo: {
        authorName,
        date,
        likes,
        image,
        content,
    }
    */

	const user = JSON.parse(localStorage.getItem('userState'));

	useEffect(() => {
		const getArticleInfo = async () => {
			setArticleInfo(await Firebase.getInfoForArticle(articleId));
			setLoaded(true);
		};
		getArticleInfo();
	}, [articleId]);

	const pageHeader = loaded ? (
		<div className="article-page-header">
			<a
				className="news-and-interviews-a"
				href={Firebase.pageGenerator.generateNewsPage()}
			>
				<span>News and Interviews</span>
				<div className="icon-side-arrow"></div>
			</a>
			<h1>{articleTitle}</h1>
			<span className="authorship-and-date">{`Posted by ${
				articleInfo.authorName
			} on ${format(articleInfo.date, 'MMMM dd, yyyy')}`}</span>
		</div>
	) : null;

	const topLikesArea = loaded ? (
		<div className="article-page-top-likes-area">
			<a
				href={Firebase.pageGenerator.generateArticleLikesPage(articleId)}
			>{`${articleInfo.likes.length} likes`}</a>
		</div>
	) : null;

	const articleContentSection = loaded ? (
		<div className="article-page-article-content-section">
			<img src={articleInfo.image} alt={articleTitle} />
			{articleInfo.content.split('\\n').map((paragraph, index) => {
				return <p key={index}>{paragraph}</p>;
			})}
		</div>
	) : null;

	const bottomLikesArea = loaded ? (
		<div className="article-page-bottom-likes-area">
			{savingLike ? (
				<img
					className="loading-spinner"
					src={
						'data:image/gif;base64,R0lGODlhEAAQAPMPAJmSa8XBq%2BLg1baxltPQwKihgJGJX%2FHw6724oPf39czIta%2BpiqCZddrYypKKYf%2F%2F%2FyH%2FC05FVFNDQVBFMi4wAwEAAAAh%2BQQFCgAPACwAAAAAEAAQAEAEcPDJlygadUq1OtFTIoqLoSSGMwxH1krH8RyF0BCHIlPaYTAJh6G1CyUahaIkE1IAFsrEQaCcBWSEz0PAnBwYLcOQ15MpTMJYd1ZyUDXSDGelBY0qIkFg%2FZoEGAQJCjoxDRRvIQMBD1kzgSAgAgKQDxEAIfkEBQoADwAsAAAAAA8AEAAABF3wyfkCkonOJZk8QKNJxcM4piGMEsEAhMFNA%2FwAhWUYWSYNj8JhIhiyZqxHAxEIrJIPwgCBeEI%2FhJFv0lgANYmDT7EQERqHtFGsQRwEjYRVE8jCJXMMIXN%2FGJNpIxEAIfkEBQoADwAsAAAAABAADwAABFrwyfmIolgiuVhKRSY5w9MlZZZUT9M10yFIQQEXi6KEh2IYBw0gJTkQfobZRIBYLQ0XiUBHCGKckkZgK%2Bq2vBiEAtslBGYCwecjcioO8MeBTCHM4glrBia3kiMAIfkEBQoADwAsAAAAABAAEAAABFzwySkJvTKkN5YcAvYUAech2CYBQheiySEpiLwEBOElFqAGpIfqIWCIHiWKrJbYEBoNEQIAcIByBNkFYegWKKHLYXxQHRSW40SQfYzVQklC0BweBbIm3C23w%2FUYEQAh%2BQQFCgAIACwAAAAAEAAOAAAERRDJiUKgWA5pDM%2Fc1iEAKAVeR5DYAAiIUVheNWrGhtUrpWOFyYFABBU6hpLlkgEga5IDRiDL9CjUjhSxNSEzXewvappEAAAh%2BQQFCgAOACwAAAAAEAAQAAAEa9DJ6YSg2KUmVZDBkSUBpyiOwojZgRznAaCU0IgKYQVFxSyShEAhSEwSh4GjwJIcOJTEgpCoIg8HI4YwGCwUWKyWQmAwAIgo5lAgYK6UpwQYzFolAEPSARhnGgZKDlBqEwwGFyNrBm4Zjn4RACH5BAUKAA8ALAAAAAAQABAAAARc8Mn5zqFYCkkIz9zVeMQCSkoyPkuDWcnTCBaBSMstHXSGAANM4oJBNBLIZCzTQCCCSlBjUSgETpPBcYndPBBcTADBeCRuhRPAoHhceaDEmkiMOwwXh%2BuUGBTCEhEAIfkEBQoADgAsAQABAA8ADwAABFnQySOFkE3qWq9A2%2BZdyOUkp3ZQThM4x6Ak9IGGQfFu96aYoaAgQMwENZ%2BB7ChJlIKJVfPAcOw2BoNCsagqHAufIcBgEBzf0CF7AAAShWPDcHGjGECVZnCMAAAh%2BQQFCgAPACwAAAAAEAAQAAAEXfDJ%2BVKiWN53jhQbdlwdR4RU4nWJ4mFWbAmNpBAZTCB4jhEvH%2BWgKAonh4Cy9mEIMK7hwmDoTRYAhcZhKHgYhAZi8SAwEBLC01Yo1HrBCSPRfgwcPse3ICHnNko5EQAh%2BQQFCgAOACwAAAEAEAAPAAAEWtDJ6VKSh2pppdha922ZdpTECE6NIlxUSakOAtwI2OxCYfwLEIHgSpwIAJmEsHK8JglEgSlh1BKMRcOhGDgHAUlDRhgsBIAtTFNwmB2B9kZgdSyCNeVGoQBFAAAh%2BQQFCgAPACwAAAEAEAAPAAAEWvDJSV%2BqeKZTD8fHRRmGkpyolAifQBrfdLBVYDSdKDF89gjAw8ABAAQywMYn0VhgcJWBJCZRIKCPwuO4GAAJCEmAIBFIyI0A4qD1AZzqB8EJoiMGp6PvTMZEAAAh%2BQQFCgAPACwAAAEADwAPAAAEWvBJAY68%2BArDspeD0XxS9xyG4R3JaRLjlbAY4QhZKynFsiie2eEQYBiBuSGrJRh4cLLAA%2BBpKKBOICIwbBBOsNMEIFBIEZaHTl1APMyPRmB9cb%2Bljy8pHsNEAAA7'
					}
					alt="Loading"
				/>
			) : (
				<button
					onClick={async (_e) => {
						setSavingLike(true);
						await Firebase.likeUnlikeArticle(user.userUID, articleId, history);
						setSavingLike(false);
						setArticleInfo((previous) => {
							return {
								...previous,
								likes: previous.likes.includes(user.userUID)
									? previous.likes.filter((user) => user !== user.userUID)
									: previous.likes.concat(user.userUID),
							};
						});
					}}
				>
					{articleInfo.likes.includes(user.userUID) ? 'Unlike' : 'Like'}
				</button>
			)}
			<span className="separator">·</span>
			<a
				href={Firebase.pageGenerator.generateArticleLikesPage(articleId)}
			>{`${articleInfo.likes.length} likes`}</a>
		</div>
	) : null;

	const mainContent = (
		<div className="article-page-main-content">
			{pageHeader}
			{topLikesArea}
			{articleContentSection}
			{bottomLikesArea}
		</div>
	);

	return (
		<div className="article-page">
			<TopBar />
			{mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default ArticlePage;
