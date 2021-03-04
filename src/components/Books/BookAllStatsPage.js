import React, { useEffect, useState } from 'react';
import Firebase from '../../Firebase';
import LinearChart from './LinearChart';
import ColumnChart from './ColumnChart';
import AreaChart from './AreaChart';
import BarChart from './BarChart';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import '../styles/Books/BookAllStatsPage.css';

const BookAllStatsPage = ({ bookId }) => {
	const [bookInfo, setBookInfo] = useState({ title: '', cover: '' });
	const [loaded, setLoaded] = useState(false);
	const [chartType, setChartType] = useState('LineChart');

	const user = JSON.parse(localStorage.getItem('userState'));

	useEffect(() => {
		const getBookInfo = async () => {
			const bookObj = await Firebase.queryBookById(user.userUID, bookId);
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
				href={Firebase.pageGenerator.generateBookStatsPageForEdition(bookId)}
			>{`Just This Editon ${
				bookInfo.ISBN !== undefined ? `ISBN ${bookInfo.ISBN}` : ''
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
					value={chartType}
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

	return (
		<div className="book-all-stats-page">
			<TopBar />
			<div className="book-all-stats-page-main-content">
				{title}
				{pageSelectionArea}
				{chartArea}
			</div>
			<HomePageFootBar />
		</div>
	);
};

export default BookAllStatsPage;
