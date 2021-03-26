import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';
import '../styles/News/NewsPage.css';

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

	useEffect(() => {
		const getNewsInfo = () => {
			setNews([
				{
					id: '123',
					image: 'https://images.gr-assets.com/blogs/1615830014p8/2018.jpg',
					type: 'article',
					title: '6 Great Books Hitting Shelves This Week',
					date: new Date(2021, 2, 23),
					numberOfLikes: 35,
					content:
						"Need another excuse to treat yourself to a new book this week? We've got you covered with the buzziest new releases of the day.\nTo create our list, we focused on the books Goodreads members can't wait to read, which we measure by how many times a book has been added to Want to Read shelves. All these top titles are now available in the United States! Which ones catch your eye?",
					featured: false,
				},
				{
					id: '123',
					image: 'https://images.gr-assets.com/blogs/1613756101p8/2052.jpg',
					type: 'article',
					title: '33 Sexy Spring Romances to Seduce You',
					date: new Date(2021, 2, 17),
					numberOfLikes: 105,
					content:
						"Whether your pleasure is headstrong historical heroines, foodie love stories, or old friends realizing they want to bang, spring's new romances offer plenty of provocative plots to fall for.\nTo guide you to your next racy read, we've peeked ahead at Goodreads members' Want to Read shelves and early reader reviews to bring you this list of 33 highly anticipated romances publishing in the next few months.",
					featured: false,
				},
				{
					id: '123',
					image:
						'https://images.gr-assets.com/interviews/1613692582p8/1541.jpg',
					type: 'interview',
					title:
						"The Debut Novel 'Of Women and Salt' Explores the Force of History",
					date: new Date(2021, 2, 1),
					numberOfLikes: 21,
					content:
						'Of Women and Salt, the debut novel by Gabriela Garcia, has the feel of a sweeping family saga that’s hard to reconcile with the fact that it’s only about 200 pages long.\nThe novel even begins with a family tree, diagramming five generations of Cuban and Cuban American women, starting with Maria Isabel in rural Cuba in 1866 and ending with Jeanette in modern-day Miami. The generations are bound by calamity: men who treat them badly, political violence and oppression, and more contemporary struggles like addiction and the hardships of modern immigration.',
					featured: false,
				},
				{
					id: '123',
					image: 'https://images.gr-assets.com/blogs/1613753047p8/2039.jpg',
					type: 'article',
					title: "Jeff VanderMeer's Climate Fiction Reading List",
					date: new Date(2021, 2, 16),
					numberOfLikes: 137,
					content:
						"Bestselling author Jeff VanderMeer is perhaps best known for his creepy sci-fi thriller Annihilation, which was made into a movie and kicked off the beloved Southern Reach trilogy. His latest novel, Hummingbird Salamander, publishes in the U.S. on April 6 and promises readers a thriller of dark conspiracy, endangered species, and the possible end of all things. Here, he's picked some of his favorite examples of climate fiction, from the plausible to the out-of-this-world.",
					featured: false,
				},
				{
					id: '123',
					image:
						'https://images.gr-assets.com/interviews/1613693416p8/1542.jpg',
					type: 'interview',
					title: 'YA Debut Is an Ojibwe Murder Mystery Ten Years in the Making',
					date: new Date(2021, 2, 1),
					numberOfLikes: 63,
					content:
						"Angeline Boulley set out over a decade ago to write the story she wanted to read as a young Ojibwe teenager. The result is Firekeeper's Daughter, a novel that’s part crime fiction, part coming-of-age tale, and equally thrilling, visceral, and heartrending.",
					featured: false,
				},
				{
					id: '123',
					image: 'https://images.gr-assets.com/blogs/1613413008p8/2012.jpg',
					type: 'article',
					title: "Meet the Authors of Spring's Biggest Mysteries",
					date: new Date(2021, 2, 2),
					numberOfLikes: 131,
					content:
						"If you ask us, it's always the perfect time to lose yourself in a page-turning mystery. To help you sleuth out a new read, we asked the authors of seven of this spring's most anticipated mysteries and thrillers to tell you about their new books and share their best recommendations for the perfect whodunit.",
					featured: true,
				},
				{
					id: '123',
					image:
						'https://images.gr-assets.com/interviews/1613692495p8/1537.jpg',
					type: 'interview',
					title: 'Kazuo Ishiguro: A Dystopian Book in Dystopian Times',
					date: new Date(2021, 2, 2),
					numberOfLikes: 363,
					content: `Kazuo Ishiguro insists he’s an optimist about technology.\n“I'm not one of these people who thinks it's going to come and destroy us,” he said in a recent interview. He rattled off a list of promising breakthroughs in artificial intelligence and genetics.\nStill, it’s a surprising take from the author of Never Let Me Go, a deeply disturbing novel about human cloning.`,
					featured: true,
				},
				{
					id: '123',
					image: 'https://images.gr-assets.com/blogs/1615577697p8/2017.jpg',
					type: 'article',
					title: '6 Great Books Hitting Shelves This Week',
					date: new Date(2021, 2, 16),
					numberOfLikes: 56,
					content:
						"Need another excuse to treat yourself to a new book this week? We've got you covered with the buzziest new releases of the day.",
					featured: false,
				},
			]);
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
							return <span key={index}>{number}</span>;
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
