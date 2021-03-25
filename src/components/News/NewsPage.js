import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';

const NewsPage = () => {
	const query = new URLSearchParams(useLocation().search);
	const contentType = query.get('content_type');
	const [loaded, setLoaded] = useState(false);
	const [news, setNews] = useState([]);
	/*
    news: [{
        id,
        image,
        type,
        title,
        date,
        numberOfLikes,
        content,
        featured,
    }]
    */

	const featuredArticle = loaded
		? news.filter((article) => article.featured)[0]
		: null;

	const pageHeader = (
		<a
			className="page-header-a"
			href={Firebase.pageGenerator.generateNewsPage()}
		>
			<h1>News and Interviews</h1>
		</a>
	);

	const browsingTypeContentArea = (
		<div className="browsing-type-content-area">
			<a
				className={
					contentType === 'all' || contentType === null
						? 'all-stories-a selected'
						: 'all-stories-a'
				}
				href={Firebase.pageGenerator.generateAllStoriesNewsPage()}
			>
				All Stories
			</a>
			<a
				className={
					contentType === 'articles' ? 'articles-a selected' : 'articles-a'
				}
				href={Firebase.pageGenerator.generateArticlesNewsPage()}
			>
				Articles
			</a>
			<a
				className={
					contentType === 'interviews'
						? 'interviews-a selected'
						: 'interviews-a'
				}
				href={Firebase.pageGenerator.generateInterviewsNewsPage()}
			>
				Interviews
			</a>
		</div>
	);

	const newsListSection = loaded ? (
		<div className="news-page-news-list-section">
			<div className="featured-article">
				{featuredArticle.image !== undefined ? (
					<a
						className="article-image-wrapper"
						href={Firebase.pageGenerator.generateArticlePage(
							featuredArticle.id,
							featuredArticle.title
						)}
					>
						<img src={featuredArticle.image} alt={featuredArticle.title} />
					</a>
				) : null}
				<div className="bottom-section">
					<div className="type-and-date">
						<span>{featuredArticle.type.toUpperCase()}</span>
						<a
							href={Firebase.pageGenerator.generateArticlePage(
								featuredArticle.id,
								featuredArticle.title
							)}
						>
							{format(featuredArticle.date, 'MMM dd')}
						</a>
					</div>
					<div className="title-and-content">
						<a
							className="article-title-a"
							href={Firebase.pageGenerator.generateArticlePage(
								featuredArticle.id,
								featuredArticle.title
							)}
						>
							{featuredArticle.title}
						</a>
						<span className="article-content-preview">
							{featuredArticle.content}
						</span>
						<a
							className="read-more-a"
							href={Firebase.pageGenerator.generateArticlePage(
								featuredArticle.id,
								featuredArticle.title
							)}
						>
							Read more
						</a>
					</div>
					<div className="likes-area">
						<a
							href={Firebase.pageGenerator.generateArticleLikesPage(
								featuredArticle.id
							)}
						>{`${featuredArticle.numberOfLikes} likes`}</a>
					</div>
				</div>
			</div>
			<div className="other-articles">
				{news
					.filter((article) => !article.featured)
					.map((article, index) => {
						return (
							<div className="article-card" key={index}>
								{article.image !== undefined ? (
									<a
										className="article-image-wrapper"
										href={Firebase.pageGenerator.generateArticlePage(
											article.id,
											article.title
										)}
									>
										<img src={article.image} alt={article.title} />
									</a>
								) : null}
								<div className="bottom-section">
									<div className="type-and-date">
										<span>{article.type.toUpperCase()}</span>
										<a
											href={Firebase.pageGenerator.generateArticlePage(
												article.id,
												article.title
											)}
										>
											{format(article.date, 'MMM dd')}
										</a>
									</div>
									<div className="title-and-content">
										<a
											className="article-title-a"
											href={Firebase.pageGenerator.generateArticlePage(
												article.id,
												article.title
											)}
										>
											{article.title}
										</a>
										<span className="article-content-preview">
											{article.content}
										</span>
										<a
											className="read-more-a"
											href={Firebase.pageGenerator.generateArticlePage(
												article.id,
												article.title
											)}
										>
											Read more
										</a>
									</div>
									<div className="likes-area">
										<a
											href={Firebase.pageGenerator.generateArticleLikesPage(
												article.id
											)}
										>{`${article.numberOfLikes} likes`}</a>
									</div>
								</div>
							</div>
						);
					})}
			</div>
		</div>
	) : null;

	return (
		<div className="news-page">
			<TopBar />
			<div className="news-page-main-content">
				{pageHeader}
				<div className="main-section">
					{browsingTypeContentArea}
					{newsListSection}
				</div>
			</div>
			<HomePageFootBar />
		</div>
	);
};

export default NewsPage;
