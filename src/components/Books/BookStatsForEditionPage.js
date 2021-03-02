import React, { useEffect, useState } from 'react';
import Firebase from '../../Firebase';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';

const BookStatsForEditionPage = ({ bookId }) => {
	const [bookInfo, setBookInfo] = useState({ title: '', cover: '' });
	const [statusUpdates, setStatusUpdates] = useState([]);
	const [loaded, setLoaded] = useState(false);
	const [chartType, setChartType] = useState('LineChart');

	const user = JSON.parse(localStorage.getItem('userState'));

	useEffect(() => {
		const getBookInfo = async () => {
			//const bookObj = await Firebase.queryBookById(user.userUID, bookId);
			const statusUpdateObjs = await Firebase.queryStatusUpdatesForBook(bookId);
			setStatusUpdates(statusUpdateObjs);
			const bookObj = JSON.parse(localStorage.getItem(`${bookId}Obj`));
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
				href={Firebase.pageGenerator.generateBookStatsPage(
					bookId,
					bookInfo.title
				)}
			>{`All ${bookInfo.otherEditionsPages.length + 1} Editions`}</a>
			<span className="just-this-edition-page-span">{`Just This Editon ${
				bookInfo.ISBN !== undefined ? `ISBN ${bookInfo.ISBN}` : ''
			}`}</span>
		</div>
	) : null;

	const editionDescriptionArea = loaded ? (
		<div className="edition-description-area">
			<img src={bookInfo.cover} alt={bookInfo.title}></img>
			<span>{`Stats for: ${bookInfo.title}${
				bookInfo.series !== undefined
					? ` (${bookInfo.series.name}, #${bookInfo.seriesInstance})`
					: ''
			}${bookInfo.type !== undefined ? ` (${bookInfo.type})` : ''}${
				bookInfo.ISBN !== undefined ? ` - ${bookInfo.ISBN}` : ''
			}`}</span>
		</div>
	) : null;

	const chartArea = loaded ? (
		<div className="chart-area">
			<form className="chart-type-form">
				<label htmlFor="chart-type">Chart type</label>
				<select
					name="chart-type"
					className="chart-type-select"
					onChange={(e) => {
						setChartType(e.target.value);
					}}
				>
					<option value="ColumnChart" selected={chartType === 'ColumnChart'}>
						ColumnChart
					</option>
					<option value="LineChart" selected={chartType === 'LineChart'}>
						LineChart
					</option>
					<option value="AreaChart" selected={chartType === 'AreaChart'}>
						AreaChart
					</option>
					<option value="BarChart" selected={chartType === 'BarChart'}>
						BarChart
					</option>
				</select>
			</form>
			{/* Chart goes here */}
		</div>
	) : null;

	const bottomSection = loaded ? (
		<div className="book-stats-for-edition-page-bottom-section">
			<button className="stats-breakdown-button">
				Click here for breakdown
			</button>
			<span>
				Note: This data corresponds to the date users most recently updated this
				book in their shelves.
			</span>
		</div>
	) : null;

	const leftSection = (
		<div className="book-stats-for-edition-page-left-section">
			{title}
			{pageSelectionArea}
			{editionDescriptionArea}
			{chartArea}
			{bottomSection}
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
									src={bookInfo.otherEditionsCovers[index]}
									alt={bookInfo.otherEditionsTitles[index]}
								></img>
							</div>
							<div className="middle-section">
								<a href={editionPage}>{`${bookInfo.otherEditionsTitles[index]}${
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
			{leftSection}
			{rightSection}
			<HomePageFootBar />
		</div>
	);
};

export default BookStatsForEditionPage;