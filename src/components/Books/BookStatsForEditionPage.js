import React, { useEffect, useState } from 'react';
import Firebase from '../../Firebase';
import LinearChart from './LinearChart';
import ColumnChart from './ColumnChart';
import AreaChart from './AreaChart';
import BarChart from './BarChart';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import '../styles/Books/BookStatsForEditionPage.css';
import { trackPromise } from 'react-promise-tracker';

const BookStatsForEditionPage = ({ bookId }) => {
	const [bookInfo, setBookInfo] = useState({ title: '', cover: '' });
	const [loaded, setLoaded] = useState(false);
	const [chartType, setChartType] = useState('LineChart');

	const user = JSON.parse(localStorage.getItem('userState'));

	useEffect(() => {
		const getBookInfo = async () => {
			const bookObj = await trackPromise(
				Firebase.queryBookById(user.userUID, bookId)
			);
			setBookInfo(bookObj);
			setLoaded(true);
		};
		getBookInfo();
	}, [bookId, user.userUID]);

	const title = loaded ? (
		<span className="book-stats-for-edition-page-title">
			<a href={Firebase.pageGenerator.generateBookPage(bookId, bookInfo.title)}>
				{bookInfo.series !== undefined
					? `${bookInfo.title} (${bookInfo.series.name}, #${bookInfo.seriesInstance})`
					: `${bookInfo.title}`}
			</a>
			{' > Stats'}
		</span>
	) : null;

	const pageSelectionArea = loaded ? (
		<div className="page-selection-area">
			<a
				className="all-editions-page-a"
				href={Firebase.pageGenerator.generateBookStatsPage(bookId)}
			>{`All ${bookInfo.otherEditionsPages.length + 1} Editions`}</a>
			<span className="just-this-edition-page-span">{`Just This Editon ${
				bookInfo.ISBN !== undefined ? `ISBN ${bookInfo.ISBN}` : ''
			}`}</span>
		</div>
	) : null;

	const editionDescriptionArea = loaded ? (
		<div className="edition-description-area">
			<img
				src={
					bookInfo.cover !== undefined
						? bookInfo.cover
						: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png'
				}
				alt={bookInfo.title}
			></img>
			<span>
				<span>Stats for: </span>
				<a
					href={Firebase.pageGenerator.generateBookPage(bookId, bookInfo.title)}
				>{`${bookInfo.title}${
					bookInfo.series !== undefined
						? ` (${bookInfo.series.name}, #${bookInfo.seriesInstance})`
						: ''
				}`}</a>
				<span>{`${bookInfo.type !== undefined ? ` (${bookInfo.type})` : ''}${
					bookInfo.ISBN !== undefined ? ` - ${bookInfo.ISBN}` : ''
				}`}</span>
			</span>
		</div>
	) : null;

	const chartArea = loaded ? (
		<div className="chart-area">
			<form className="chart-type-form">
				<label htmlFor="chart-type">Chart type</label>
				<select
					name="chart-type"
					className="chart-type-select"
					value={chartType}
					onChange={(e) => {
						setChartType(e.target.value);
					}}
				>
					<option value="ColumnChart">ColumnChart</option>
					<option value="LineChart">LineChart</option>
					<option value="AreaChart">AreaChart</option>
					<option value="BarChart">BarChart</option>
				</select>
			</form>
			{chartType === 'ColumnChart' ? (
				<ColumnChart bookId={bookId} />
			) : chartType === 'AreaChart' ? (
				<AreaChart bookId={bookId} />
			) : chartType === 'BarChart' ? (
				<BarChart bookId={bookId} />
			) : (
				<LinearChart bookId={bookId} />
			)}
		</div>
	) : null;

	const leftSection = (
		<div className="book-stats-for-edition-page-left-section">
			{title}
			{pageSelectionArea}
			{editionDescriptionArea}
			{chartArea}
		</div>
	);

	const rightSection = loaded ? (
		<div className="book-stats-for-edition-page-right-section">
			<span>STATS FOR OTHER EDITIONS</span>
			<div className="edition-list">
				{bookInfo.otherEditionsPages.map((editionPage, index) => {
					return (
						<div className="edition-card" key={index}>
							<div className="left-section">
								<img
									src={
										bookInfo.otherEditionsCovers[index] !== undefined
											? bookInfo.otherEditionsCovers[index]
											: 'https://s.gr-assets.com/assets/nophoto/book/111x148-bcc042a9c91a29c1d680899eff700a03.png'
									}
									alt={bookInfo.otherEditionsTitles[index]}
								></img>
								<div className="middle-section">
									<a href={editionPage}>{`${
										bookInfo.otherEditionsTitles[index]
									}${
										bookInfo.series !== undefined
											? ` (${bookInfo.series.name}, #${bookInfo.seriesInstance})`
											: ''
									}`}</a>
									<span>{`ISBN: ${
										bookInfo.otherEditionsISBNs[index] !== undefined
											? bookInfo.otherEditionsISBNs[index]
											: ''
									}`}</span>
								</div>
							</div>
							<div className="right-section">
								<span>{`${bookInfo.otherEditionsAddedBy[index]} people added`}</span>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	) : null;

	return (
		<div className="book-stats-for-edition-page">
			<TopBar />
			<div className="book-stats-for-edition-page-main-content">
				{leftSection}
				{rightSection}
			</div>
			<HomePageFootBar />
		</div>
	);
};

export default BookStatsForEditionPage;
