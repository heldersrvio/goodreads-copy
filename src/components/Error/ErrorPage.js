import React from 'react';
import Firebase from '../../Firebase';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import '../styles/Error/ErrorPage.css';

const ErrorPage = () => {
	const templates = [
		{
			message: 'We’re sorry, you seem to have stumbled on a bad link.',
			quote:
				'Two links diverged from a yellow page,\nAnd sorry I could not travel both\nAnd be one traveler, long I stood\nAnd looked down one as far as I could\nTo where it broke in the understroke;\n\nThen took the other, as just as fair\nAnd having perhaps the better claim,\nBecause it was grassy and wanted wear;\nThough as for that the passing there\nMay wear them really about the same,\n\nAnd both that page-load equally lay\nIn bits no click had colored black.',
			book: {
				cover:
					'https://s.gr-assets.com/assets/error_pages/not_found/frost_book-63a7b8d45d1a90d855083d4dea811026.png',
				title: 'The Road Not Taken',
			},
			author: {
				photo:
					'https://s.gr-assets.com/assets/error_pages/not_found/frost_author-5ca4ea23d1c35dd6db39c432abcff0cf.png',
				name: 'Robert Frost',
			},
		},
		{
			message:
				'Yarr, the page you requested can’t be charted on any known map.',
			quote:
				'“It would be a lot quicker than that if we could just sail straight there, but I was looking at the nautical charts, and there’s a dirty great sea serpent right in the middle of the ocean!\n\nFitzRoy frowned. “I think they just draw those on maps to add a bit of decoration. It doesn’t actually mean there’s a sea serpent there.”\n\nThe galley went rather quiet. A few of the pirate crew stared intently out of the portholes, embarrassed at their Captain’s mistake. But to everyone’s relief, instead of running somebody through, the Pirate Captain just narrowed his eyes thoughtfully.\n\n“That explains a lot,” he said. “I suppose it’s also why we’ve never glimpsed that giant compass in the corner of the Atlantic. I have to say, I’m a little disappointed.”',
			book: {
				cover:
					'https://s.gr-assets.com/assets/error_pages/not_found/pirates_book-ca3112b76cf166f6cf97f2ce19429386.png',
				title: 'The Pirates! In an Adventure with Scientists',
			},
			author: {
				photo:
					'https://s.gr-assets.com/assets/error_pages/not_found/pirates_author-9027bd4f549b8d0b01e23c2368fa42b3.png',
				name: 'Gideon Defoe',
			},
		},
		{
			message: "You've hit a bad link, but don't panic!",
			quote:
				'"I don’t know what I’m looking for.”\n"Why not?"\n"Because...because...I think it might be because if I knew\nI wouldn’t be able to look for them.”',
			book: {
				cover:
					'https://s.gr-assets.com/assets/error_pages/not_found/hitchhikers_book-0909ea93cabdeba89c38901ab3eadbf5.png',
				title: "The Hitchhiker's Guide to the Galaxy",
			},
			author: {
				photo:
					'https://s.gr-assets.com/assets/error_pages/not_found/hitchhikers_author-0cc7d6798db276033042fd2a1dd1b4ef.png',
				name: 'Douglas Adams',
			},
		},
	];
	const template = templates[Math.floor(Math.random() * 2)];

	return (
		<div className="error-page">
			<TopBar />
			<span className="error-page-message">{template.message}</span>
			<div className="middle-section">
				<div className="quote-section">
					<span className="quote-span">{template.quote}</span>
					<span className="quote-authorship-span">
						{`— ${template.author.name}, `}
						<i>{template.book.title}</i>
					</span>
				</div>
				<div className="book-and-author-section">
					<img src={template.book.cover} alt="Book" />
					<img
						className="author-picture"
						src={template.author.photo}
						alt={template.author.name}
					/>
				</div>
			</div>
			<a
				className="back-to-homepage-a goodreads-button"
				href={Firebase.pageGenerator.generateHomePage()}
			>
				Back to the Goodreads homepage
			</a>
			<HomePageFootBar />
		</div>
	);
};

export default ErrorPage;
