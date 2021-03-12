import React, { useState, useEffect } from 'react';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';
import '../styles/Books/BookTriviaPage.css';

const BookTriviaPage = ({ match }) => {
	const {
		params: { bookTriviaPageId },
	} = match;
	const [loaded, setLoaded] = useState(false);
	const [bookInfo, setBookInfo] = useState({});
	const [page, setPage] = useState(1);
	const bookId = bookTriviaPageId.split('.')[0];
	const title = bookTriviaPageId.split('.')[1].replace(/_/g, ' ');

	useEffect(() => {
		const getBookInfo = async () => {
			setBookInfo(await Firebase.getBookInfoForTriviaPage(bookId));
			setLoaded(true);
		};
		getBookInfo();
	}, [bookId]);

	const pageHeader = loaded ? (
		<h1 className="book-trivia-page-header">
			{bookInfo.series === undefined
				? `Trivia about ${title}`
				: `Trivia about ${title} (${bookInfo.series}, #${bookInfo.seriesInstance})`}
		</h1>
	) : null;

	const bookPageAnchor = (
		<a
			className="back-to-book-page-a"
			href={Firebase.pageGenerator.generateBookPage(bookId, title)}
		>
			back to book page »
		</a>
	);

	const quizzesSection = loaded ? (
		<div className="book-trivia-page-quizzes-section">
			<span className="book-trivia-page-quizzes-title">QUIZZES</span>
			<div className="book-trivia-page-quizzes-other-quizzes">
				<span>
					<a href={Firebase.pageGenerator.generateCreateQuizPage()}>
						create a quiz
					</a>{' '}
					or{' '}
					<a href={Firebase.pageGenerator.generateQuizzesPage()}>
						see other quizzes
					</a>
				</span>
			</div>
			<div className="quiz-questions">
				{bookInfo.quizQuestions
					.filter((_question, index) => {
						return index < page * 30 && index >= (page - 1) * 30;
					})
					.map((question, index) => {
						return (
							<div className="quiz-question" key={index}>
								<div className="quiz-question-top-section">
									<a
										className="quiz-title"
										href={Firebase.pageGenerator.generateQuizPage(
											question.quizId,
											question.quizName
										)}
									>
										{question.quizName}
									</a>
									<span className="quiz-author-span">
										by{' '}
										<a
											href={Firebase.pageGenerator.generateUserPage(
												question.creatorId,
												question.creatorFirstName
											)}
										>
											{question.creatorFirstName}
										</a>
									</span>
								</div>
								<div className="quiz-question-middle-section">
									<span className="question">
										{question.book === undefined
											? question.question
											: `${question.question} ${question.book}`}
									</span>
									<div className="quiz-number-of-questions-and-rating">
										<span>{`${question.numberOfQuestions} questions`}</span>
										<div className="quiz-rating">
											<div
												className={
													question.rating >= 1
														? 'static-star small full'
														: question.rating >= 0.5
														? 'static-star small almost-full'
														: question.rating > 0
														? 'static-star small almost-empty'
														: 'static-star small empty'
												}
											></div>
											<div
												className={
													question.rating >= 2
														? 'static-star small full'
														: question.rating >= 1.5
														? 'static-star small almost-full'
														: question.rating > 1
														? 'static-star small almost-empty'
														: 'static-star small empty'
												}
											></div>
											<div
												className={
													question.rating >= 3
														? 'static-star small full'
														: question.rating >= 2.5
														? 'static-star small almost-full'
														: question.rating > 2
														? 'static-star small almost-empty'
														: 'static-star small empty'
												}
											></div>
											<div
												className={
													question.rating >= 4
														? 'static-star small full'
														: question.rating >= 3.5
														? 'static-star small almost-full'
														: question.rating > 3
														? 'static-star small almost-empty'
														: 'static-star small empty'
												}
											></div>
											<div
												className={
													question.rating >= 5
														? 'static-star small full'
														: question.rating >= 4.5
														? 'static-star small almost-full'
														: question.rating > 4
														? 'static-star small almost-empty'
														: 'static-star small empty'
												}
											></div>
										</div>
									</div>
								</div>
								<div className="quiz-question-bottom-section">
									<span>
										{`${question.numberOfUsersWhoTookQuiz} people took this quiz | `}
										<a
											href={Firebase.pageGenerator.generateQuizPage(
												question.quizId,
												question.quizName
											)}
										>
											take this quiz
										</a>
									</span>
								</div>
							</div>
						);
					})}
			</div>
			{Math.ceil(bookInfo.quizQuestions.length / 30) > 1 ? (
				<div className="page-navigation-section">
					<button
						onClick={(_e) => setPage((previous) => previous - 1)}
						disabled={page === 1}
					>
						« previous
					</button>
					{Array.from(
						{
							length: Math.ceil(bookInfo.quizQuestions.length / 30),
						},
						(_x, i) => i + 1
					).map((number) => {
						return (
							<button
								key={number}
								onClick={(_e) => setPage(number)}
								disabled={page === number}
							>
								{page !== number ? number : <i>{number}</i>}
							</button>
						);
					})}
					<button
						onClick={(_e) => setPage((previous) => previous + 1)}
						disabled={page === Math.ceil(bookInfo.quizQuestions.length / 30)}
					>
						next »
					</button>
				</div>
			) : null}
		</div>
	) : null;

	const mainContent = (
		<div className="book-trivia-page-main-content">
			{pageHeader}
			{bookPageAnchor}
			{quizzesSection}
		</div>
	);

	return (
		<div className="book-trivia-page">
			<TopBar />
			{mainContent}
			<HomePageFootBar />
		</div>
	);
};

export default BookTriviaPage;
