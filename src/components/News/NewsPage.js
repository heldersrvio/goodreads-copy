import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';
import '../styles/News/NewsPage.css';
import { trackPromise } from 'react-promise-tracker';

const NewsPage = () => {
	const query = new URLSearchParams(useLocation().search);
	const contentType = query.get('content_type');
	const page = query.get('page') !== null ? parseInt(query.get('page')) : 1;
	const link =
		contentType === 'articles'
			? Firebase.pageGenerator.generateArticlesNewsPage() + '&'
			: contentType === 'interviews'
			? Firebase.pageGenerator.generateInterviewsNewsPage() + '&'
			: Firebase.pageGenerator.generateNewsPage() + '?';
	const [loaded, setLoaded] = useState(false);
	const [news, setNews] = useState([]);

	useEffect(() => {
		const getNewsInfo = async () => {
			setNews(await trackPromise(Firebase.getNews()));
			setLoaded(true);
		};
		getNewsInfo();
	}, []);

	const featuredArticle = loaded
		? news.filter(
				(article) =>
					!(contentType === 'articles' && article.type !== 'article') &&
					!(contentType === 'interviews' && article.type !== 'interview') &&
					article.featured
		  )[0]
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
			{page === 1 ? (
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
								{featuredArticle.content.slice(0, 137) + '...'}
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
			) : null}
			<div className="other-articles">
				{news
					.filter(
						(article, index) =>
							index < page * 10 &&
							index >= (page - 1) * 10 &&
							article !== featuredArticle &&
							!(contentType === 'articles' && article.type !== 'article') &&
							!(contentType === 'interviews' && article.type !== 'interview')
					)
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
											{article.content.slice(0, 107) + '...'}
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
			{Math.ceil(
				news.filter(
					(article) =>
						article.type === contentType ||
						contentType === 'all' ||
						contentType === null
				).length / 10
			) > 1 ? (
				<div className="page-navigation-section">
					{page === 1 ? (
						<span>« previous</span>
					) : (
						<a href={link + `page=${page - 1}`}>« previous</a>
					)}
					{Array.from(
						{
							length: Math.ceil(news.length / 10),
						},
						(_x, i) => i + 1
					).map((number, index) => {
						if (page === number) {
							return (
								<span key={index}>
									<em>{number}</em>
								</span>
							);
						}
						return (
							<a key={index} href={link + `page=${number}`}>
								{number}
							</a>
						);
					})}
					{page ===
					Math.ceil(
						news.filter(
							(article) =>
								article.type === contentType ||
								contentType === 'all' ||
								contentType === null
						).length / 10
					) ? (
						<span>next »</span>
					) : (
						<a href={link + `page=${page + 1}`}>next »</a>
					)}
				</div>
			) : null}
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
