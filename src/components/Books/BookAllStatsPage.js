import React, { useEffect, useState } from 'react';
import Firebase from '../../Firebase';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';

const BookAllStatsPage = ({ match }) => {
	const {
		params: { bookId },
	} = match;
	const [bookInfo, setBookInfo] = useState({ title: '', cover: '' });
	const [loaded, setLoaded] = useState(false);
	const [chartType, setChartType] = useState('LineChart');

	const user = JSON.parse(localStorage.getItem('userState'));

	useEffect(() => {
		const getBookInfo = async () => {
			let bookId = '';
			let i = 0;
			while (i < bookId.length) {
				if (bookId[i] !== '.') {
					bookId += bookId[i];
				} else {
					break;
				}
				i++;
			}
			const bookObj = await Firebase.queryBookById(user.userUID, bookId);
			localStorage.setItem(`${bookId}Obj`, JSON.stringify(bookObj));
			setBookInfo(bookObj);
			setLoaded(true);
		};
		getBookInfo();
	}, [bookId, user.userUID]);

	const title = loaded ? (
		<span className="book-all-stats-page-title">
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
			<span className="all-editions-page-span">{`All ${
				bookInfo.otherEditionsPages.length + 1
			} Editions`}</span>
			<a
				className="just-this-edition-page-a"
				href={Firebase.pageGenerator.generateBookStatsPageForEdition(
					bookId,
					bookInfo.title
				)}
			>{`Just This Editon ${
				bookInfo.ISBN !== undefined ? `ISBN ${bookInfo.ISBN}` : null
			}`}</a>
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
		<div className="book-all-stats-page-bottom-section">
			<button className="stats-breakdown-button">
				Click here for breakdown
			</button>
			<span>
				Note: This data corresponds to the date users most recently updated this
				book in their shelves.
			</span>
		</div>
	) : null;

	return (
		<div className="book-all-stats-page">
			<TopBar />
			{title}
			{pageSelectionArea}
			{chartArea}
			{bottomSection}
			<HomePageFootBar />
		</div>
	);
};

export default BookAllStatsPage;
