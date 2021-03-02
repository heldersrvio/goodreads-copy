import firebase from 'firebase/app';
import React, { useEffect, useState } from 'react';
import Firebase from '../../Firebase';
import { format, eachDayOfInterval, isSameDay, subDays } from 'date-fns';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';

const BookAllStatsPage = ({ bookId }) => {
	const [bookInfo, setBookInfo] = useState({ title: '', cover: '' });
	const [statusUpdates, setStatusUpdates] = useState([]);
	const [loaded, setLoaded] = useState(false);
	const [chartType, setChartType] = useState('LineChart');
	const [clickCircle, setClickCircle] = useState(null);
	const [hoverCircle, setHoverCircle] = useState(null);
	const [toolTip, setToolTip] = useState(null);

	const user = JSON.parse(localStorage.getItem('userState'));

	// TODO: Set up tooltips properly, fix table position, styling

	useEffect(() => {
		const getBookInfo = async () => {
			//const bookObj = await Firebase.queryBookById(user.userUID, bookId);
			//const statusUpdateObjs = await Firebase.queryStatusUpdatesForRootBook(bookId);
			const statusUpdateObjs = [
				{
					action: 'add-book',
					shelf: 'read',
					user: 'abc',
					book: bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2020, 9, 11)),
				},
				{
					action: 'add-book',
					shelf: 'to-read',
					user: 'abc',
					book: bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2020, 9, 11)),
				},
				{
					action: 'add-book',
					shelf: 'read',
					user: 'abc',
					book: bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2020, 9, 11)),
				},
				{
					action: 'add-book',
					shelf: 'to-read',
					user: 'abc',
					book: bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2020, 9, 11)),
				},
				{
					action: 'add-book',
					shelf: 'read',
					user: 'abc',
					book: bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2020, 9, 12)),
				},
				{
					action: 'add-book',
					shelf: 'read',
					user: 'abc',
					book: bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2020, 9, 12)),
				},
				{
					action: 'add-book',
					shelf: 'to-read',
					user: 'abc',
					book: bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2020, 9, 12)),
				},
				{
					action: 'add-book',
					shelf: 'read',
					user: 'abc',
					book: bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2020, 9, 12)),
				},
				{
					action: 'add-book',
					shelf: 'to-read',
					user: 'abc',
					book: bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2020, 9, 12)),
				},
				{
					action: 'add-book',
					shelf: 'read',
					user: 'abc',
					book: bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2020, 9, 12)),
				},
				{
					action: 'add-book',
					shelf: 'to-read',
					user: 'abc',
					book: bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2020, 9, 12)),
				},
				{
					action: 'add-book',
					shelf: 'read',
					user: 'abc',
					book: bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2020, 9, 12)),
				},
				{
					action: 'add-book',
					shelf: 'to-read',
					user: 'abc',
					book: bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2020, 9, 13)),
				},
				{
					action: 'add-book',
					shelf: 'read',
					user: 'abc',
					book: bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2020, 9, 13)),
				},
				{
					action: 'add-book',
					shelf: 'to-read',
					user: 'abc',
					book: bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2020, 9, 13)),
				},
				{
					action: 'add-book',
					shelf: 'read',
					user: 'abc',
					book: bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2020, 9, 13)),
				},
				{
					action: 'add-book',
					shelf: 'read',
					user: 'abc',
					book: bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2020, 9, 13)),
				},
				{
					action: 'add-book',
					shelf: 'to-read',
					user: 'abc',
					book: bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2020, 9, 13)),
				},
				{
					action: 'add-book',
					shelf: 'read',
					user: 'abc',
					book: bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2020, 9, 13)),
				},
				{
					action: 'add-book',
					shelf: 'to-read',
					user: 'abc',
					book: bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2020, 9, 13)),
				},
				{
					action: 'add-book',
					shelf: 'read',
					user: 'abc',
					book: bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2020, 9, 13)),
				},
				{
					action: 'add-book',
					shelf: 'to-read',
					user: 'abc',
					book: bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2020, 9, 13)),
				},
				{
					action: 'add-book',
					shelf: 'read',
					user: 'abc',
					book: bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2020, 9, 13)),
				},
				{
					action: 'add-book',
					shelf: 'to-read',
					user: 'abc',
					book: bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2020, 9, 14)),
				},
				{
					action: 'add-book',
					shelf: 'read',
					user: 'abc',
					book: bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2020, 9, 14)),
				},
			];
			setStatusUpdates(statusUpdateObjs);
			const bookObj = JSON.parse(localStorage.getItem(`${bookId}Obj`));
			setBookInfo(bookObj);
			setLoaded(true);
		};
		getBookInfo();
	}, [bookId, user.userUID]);

	const interval = { start: subDays(new Date(), 170), end: new Date() };
	const addedUpdatesNumbers = loaded
		? eachDayOfInterval(interval).map(
				(date) =>
					statusUpdates.filter(
						(update) =>
							update.action === 'add-book' &&
							isSameDay(update.date.toDate(), date)
					).length
		  )
		: [];

	const ratingsUpdatesNumbers = loaded
		? eachDayOfInterval(interval).map(
				(date) =>
					statusUpdates.filter(
						(update) =>
							update.action === 'rate-book' &&
							isSameDay(update.date.toDate(), date)
					).length
		  )
		: [];
	const reviewsUpdateNumbers = loaded
		? eachDayOfInterval(interval).map(
				(date) =>
					statusUpdates.filter(
						(update) =>
							update.action === 'review-book' &&
							isSameDay(update.date.toDate(), date)
					).length
		  )
		: [];
	const toReadUpdatesNumbers = loaded
		? eachDayOfInterval(interval).map(
				(date) =>
					statusUpdates.filter(
						(update) =>
							update.action === 'add-book' &&
							update.shelf === 'to-read' &&
							isSameDay(update.date.toDate(), date)
					).length
		  )
		: [];
	const maximumDailyUpdates = loaded
		? Math.max(
				Math.max(...addedUpdatesNumbers),
				Math.max(...ratingsUpdatesNumbers),
				Math.max(...reviewsUpdateNumbers),
				Math.max(...toReadUpdatesNumbers)
		  )
		: 0;
	const chartUnit = maximumDailyUpdates !== 0 ? 279 / maximumDailyUpdates : 0;

	const addedPathDefinitionCoordinates = loaded
		? eachDayOfInterval(interval).map((date, index) => {
				const updatesNumber = statusUpdates.filter(
					(update) =>
						update.action === 'add-book' &&
						isSameDay(update.date.toDate(), date)
				).length;
				return [57.1 + 3.2 * index, 289.5 - chartUnit * updatesNumber];
		  })
		: [];

	const ratingsPathDefinitionCoordinates = loaded
		? eachDayOfInterval(interval).map((date, index) => {
				const updatesNumber = statusUpdates.filter(
					(update) =>
						update.action === 'rate-book' &&
						isSameDay(update.date.toDate(), date)
				).length;
				return [57.1 + 3.2 * index, 289.5 - chartUnit * updatesNumber];
		  })
		: [];

	const reviewsPathDefinitionCoordinates = loaded
		? eachDayOfInterval(interval).map((date, index) => {
				const updatesNumber = statusUpdates.filter(
					(update) =>
						update.action === 'review-book' &&
						isSameDay(update.date.toDate(), date)
				).length;
				return [57.1 + 3.2 * index, 289.5 - chartUnit * updatesNumber];
		  })
		: [];

	const toReadPathDefinitionCoordinates = loaded
		? eachDayOfInterval(interval).map((date, index) => {
				const updatesNumber = statusUpdates.filter(
					(update) =>
						update.action === 'add-book' &&
						update.shelf === 'to-read' &&
						isSameDay(update.date.toDate(), date)
				).length;
				return [57.1 + 3.2 * index, 289.5 - chartUnit * updatesNumber];
		  })
		: [];

	const addedPathDefinition = addedPathDefinitionCoordinates.reduce(
		(previous, current, currentIndex) => {
			if (currentIndex === 0) {
				return 'M ' + current[0] + ', ' + current[1] + '\n';
			} else {
				return previous + 'L ' + current[0] + ', ' + current[1] + '\n';
			}
		},
		''
	);

	const ratingsPathDefinition = ratingsPathDefinitionCoordinates.reduce(
		(previous, current, currentIndex) => {
			if (currentIndex === 0) {
				return 'M ' + current[0] + ', ' + current[1] + '\n';
			} else {
				return previous + 'L ' + current[0] + ', ' + current[1] + '\n';
			}
		},
		''
	);

	const reviewsPathDefinition = reviewsPathDefinitionCoordinates.reduce(
		(previous, current, currentIndex) => {
			if (currentIndex === 0) {
				return 'M ' + current[0] + ', ' + current[1] + '\n';
			} else {
				return previous + 'L ' + current[0] + ', ' + current[1] + '\n';
			}
		},
		''
	);

	const toReadPathDefinition = toReadPathDefinitionCoordinates.reduce(
		(previous, current, currentIndex) => {
			if (currentIndex === 0) {
				return 'M ' + current[0] + ', ' + current[1] + '\n';
			} else {
				return previous + 'L ' + current[0] + ', ' + current[1] + '\n';
			}
		},
		''
	);

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
				bookInfo.ISBN !== undefined ? `ISBN ${bookInfo.ISBN}` : ''
			}`}</a>
		</div>
	) : null;

	const chart = loaded ? (
		<div className="chart">
			<div className="chart-table">
				<svg
					width="620"
					height="400"
					onMouseOver={(e) => {
						const point = document.querySelector('svg').createSVGPoint();
						point.x = e.clientX;
						point.y = e.clientY;
						const location = point.matrixTransform(
							document.querySelector('svg').getScreenCTM().inverse()
						);
						const matchingAddedPathCoordinates = addedPathDefinitionCoordinates.filter(
							(coordinates) =>
								Math.abs(coordinates[0] - location.x) <= 5 &&
								Math.abs(coordinates[1] - location.y) <= 5
						);
						const matchingRatingsPathCoordinates = ratingsPathDefinitionCoordinates.filter(
							(coordinates) =>
								Math.abs(coordinates[0] - location.x) <= 5 &&
								Math.abs(coordinates[1] - location.y) <= 5
						);
						const matchingReviewsPathCoordinates = reviewsPathDefinitionCoordinates.filter(
							(coordinates) =>
								Math.abs(coordinates[0] - location.x) <= 5 &&
								Math.abs(coordinates[1] - location.y) <= 5
						);
						const matchingToReadPathCoordinates = toReadPathDefinitionCoordinates.filter(
							(coordinates) =>
								Math.abs(coordinates[0] - location.x) <= 5 &&
								Math.abs(coordinates[1] - location.y) <= 5
						);
						if (
							!(
								clickCircle !== null &&
								Math.abs(
									document
										.getElementsByClassName('click-circle-inside')[0]
										.getAttribute('cx') - location.x
								) <= 5 &&
								Math.abs(
									document
										.getElementsByClassName('click-circle-inside')[0]
										.getAttribute('cy') - location.y
								)
							) &&
							(matchingAddedPathCoordinates.length > 0 ||
								matchingRatingsPathCoordinates.length > 0 ||
								matchingReviewsPathCoordinates.length > 0 ||
								matchingToReadPathCoordinates.length > 0)
						) {
							const color =
								matchingAddedPathCoordinates.length > 0
									? '#3366cc'
									: matchingRatingsPathCoordinates.length > 0
									? '#dc3912'
									: matchingReviewsPathCoordinates.length > 0
									? '#ff9900'
									: '#109618';
							const coordinates =
								matchingAddedPathCoordinates.length > 0
									? matchingAddedPathCoordinates
									: matchingRatingsPathCoordinates.length > 0
									? matchingRatingsPathCoordinates
									: matchingReviewsPathCoordinates.length > 0
									? matchingReviewsPathCoordinates
									: matchingToReadPathCoordinates;
							const newHoverCircle = (
								<g>
									<circle
										cx={coordinates[0][0]}
										cy={coordinates[0][1]}
										r="4.5"
										stroke="#000000"
										strokeWidth="1"
										strokeOpacity="0.25"
										fillOpacity="1"
										fill="none"
									></circle>
									<circle
										cx={coordinates[0][0]}
										cy={coordinates[0][1]}
										r="5.5"
										stroke="#000000"
										strokeWidth="1"
										strokeOpacity="0.1"
										fillOpacity="1"
										fill="none"
									></circle>
									<circle
										cx={coordinates[0][0]}
										cy={coordinates[0][1]}
										r="6.5"
										stroke="#000000"
										strokeWidth="1"
										strokeOpacity="0.05"
										fillOpacity="1"
										fill="none"
									></circle>
									<circle
										cx={coordinates[0][0]}
										cy={coordinates[0][1]}
										r="4"
										stroke="none"
										strokeWidth="0"
										fill={color}
									></circle>
								</g>
							);
							setHoverCircle(newHoverCircle);
							const newToolTip = (
								<g class="chart-tooltip">
									<path
										d="M278.5,166.5A1,1,0,0,1,277.5,165.5L277.5,121.5A1,1,0,0,1,278.5,120.5L358.5,120.5A1,1,0,0,1,359.5,121.5L359.5,165.5A1,1,0,0,1,358.5,166.5L331.5,166.5L305.60526315789474,179.98L318.5,166.5Z"
										stroke="#cccccc"
										strokeWidth="1"
										fill="#ffffff"
										filter={`url(/book/stats?id=${bookId}#abstract-renderer-id-2`}
									></path>
									<g>
										<text
											textAnchor="start"
											x="285"
											y="139.05"
											fontFamily="Arial"
											fontSize="13"
											fontWeight="bold"
											stroke="none"
											strokeWidth="0"
											fill="#000000"
										>
											2020-11-27
										</text>
									</g>
									<g>
										<text
											textAnchor="start"
											x="285"
											y="156.05"
											fontFamily="Arial"
											fontSize="13"
											stroke="none"
											strokeWidth="0"
											fill="#000000"
										>
											ratings:
										</text>
										<text
											textAnchor="start"
											x="332"
											y="156.05"
											fontFamily="Arial"
											fontSize="13"
											fontWeight="bold"
											stroke="none"
											stroke-width="0"
											fill="#000000"
										>
											95
										</text>
									</g>
								</g>
							);
							setToolTip(newToolTip);
						} else {
							setHoverCircle(null);
							setToolTip(null);
						}
					}}
					onClick={(e) => {
						const point = document.querySelector('svg').createSVGPoint();
						point.x = e.clientX;
						point.y = e.clientY;
						const location = point.matrixTransform(
							document.querySelector('svg').getScreenCTM().inverse()
						);
						const matchingAddedPathCoordinates = addedPathDefinitionCoordinates.filter(
							(coordinates) =>
								Math.abs(coordinates[0] - location.x) <= 5 &&
								Math.abs(coordinates[1] - location.y) <= 5
						);
						const matchingRatingsPathCoordinates = ratingsPathDefinitionCoordinates.filter(
							(coordinates) =>
								Math.abs(coordinates[0] - location.x) <= 5 &&
								Math.abs(coordinates[1] - location.y) <= 5
						);
						const matchingReviewsPathCoordinates = reviewsPathDefinitionCoordinates.filter(
							(coordinates) =>
								Math.abs(coordinates[0] - location.x) <= 5 &&
								Math.abs(coordinates[1] - location.y) <= 5
						);
						const matchingToReadPathCoordinates = toReadPathDefinitionCoordinates.filter(
							(coordinates) =>
								Math.abs(coordinates[0] - location.x) <= 5 &&
								Math.abs(coordinates[1] - location.y) <= 5
						);
						if (
							matchingAddedPathCoordinates.length > 0 ||
							matchingRatingsPathCoordinates.length > 0 ||
							matchingReviewsPathCoordinates.length > 0 ||
							matchingToReadPathCoordinates.length > 0
						) {
							const color =
								matchingAddedPathCoordinates.length > 0
									? '#3366cc'
									: matchingRatingsPathCoordinates.length > 0
									? '#dc3912'
									: matchingReviewsPathCoordinates.length > 0
									? '#ff9900'
									: '#109618';
							const coordinates =
								matchingAddedPathCoordinates.length > 0
									? matchingAddedPathCoordinates
									: matchingRatingsPathCoordinates.length > 0
									? matchingRatingsPathCoordinates
									: matchingReviewsPathCoordinates.length > 0
									? matchingReviewsPathCoordinates
									: matchingToReadPathCoordinates;
							const newClickCircle = (
								<g>
									<circle
										cx={coordinates[0][0]}
										cy={coordinates[0][1]}
										r="6.5"
										stroke={color}
										strokeWidth="1"
										fill="#ffffff"
									></circle>
									<circle
										className="click-circle-inside"
										cx={coordinates[0][0]}
										cy={coordinates[0][1]}
										r="4"
										stroke="none"
										strokeWidth="0"
										fill={color}
									></circle>
								</g>
							);
							setHoverCircle(null);
							setClickCircle(newClickCircle);
						}
					}}
				>
					<defs id="abstract-renderer-id-0">
						<clipPath id="abstract-renderer-id-1">
							<rect x="55" y="10" width="550" height="280"></rect>
						</clipPath>
						<filter id="abstract-renderer-id-2">
							<feGaussianBlur
								in="SourceAlpha"
								stdDeviation="2"
							></feGaussianBlur>
							<feOffset dx="1" dy="1"></feOffset>
							<feComponentTransfer>
								<feFuncA type="linear" slope="0.1"></feFuncA>
							</feComponentTransfer>
							<feMerge>
								<feMergeNode></feMergeNode>
								<feMergeNode in="SourceGraphic"></feMergeNode>
							</feMerge>
						</filter>
					</defs>
					<rect
						x="0"
						y="0"
						width="620"
						height="400"
						stroke="none"
						strokeWidth="0"
						fill="#ffffff"
					></rect>
					<g>
						<rect
							x="156"
							y="365"
							width="347"
							height="13"
							stroke="none"
							strokeWidth="0"
							fillOpacity="0"
							fill="#ffffff"
						></rect>
						<g>
							<rect
								x="156"
								y="365"
								width="67"
								height="13"
								stroke="none"
								strokeWidth="0"
								fillOpacity="0"
								fill="#ffffff"
							></rect>
							<g>
								<text
									textAnchor="start"
									x="187"
									y="376.05"
									fontFamily="Arial"
									fontSize="13"
									stroke="none"
									strokeWidth="0"
									fill="#222222"
								>
									added
								</text>
							</g>
							<path
								d="M156,371.5L182,371.5"
								stroke="#3366cc"
								strokeWidth="2"
								fillOpacity="1"
								fill="none"
							></path>
						</g>
						<g>
							<rect
								x="244"
								y="365"
								width="70"
								height="13"
								stroke="none"
								strokeWidth="0"
								fillOpacity="0"
								fill="#ffffff"
							></rect>
							<g>
								<text
									textAnchor="start"
									x="275"
									y="376.05"
									fontFamily="Arial"
									fontSize="13"
									stroke="none"
									strokeWidth="0"
									fill="#222222"
								>
									ratings
								</text>
							</g>
							<path
								d="M244,371.5L270,371.5"
								stroke="#dc3912"
								strokeWidth="2"
								fillOpacity="1"
								fill="none"
							></path>
						</g>
						<g>
							<rect
								x="335"
								y="365"
								width="75"
								height="13"
								stroke="none"
								strokeWidth="0"
								fillOpacity="0"
								fill="#ffffff"
							></rect>
							<g>
								<text
									textAnchor="start"
									x="366"
									y="376.05"
									fontFamily="Arial"
									fontSize="13"
									stroke="none"
									strokeWidth="0"
									fill="#222222"
								>
									reviews
								</text>
							</g>
							<path
								d="M335,371.5L361,371.5"
								stroke="#ff9900"
								strokeWidth="2"
								fillOpacity="1"
								fill="none"
							></path>
						</g>
						<g>
							<rect
								x="431"
								y="365"
								width="72"
								height="13"
								stroke="none"
								strokeWidth="0"
								fillOpacity="0"
								fill="#ffffff"
							></rect>
							<g>
								<text
									textAnchor="start"
									x="462"
									y="376.05"
									fontFamily="Arial"
									fontSize="13"
									stroke="none"
									strokeWidth="0"
									fill="#222222"
								>
									to-read
								</text>
							</g>
							<path
								d="M431,371.5L457,371.5"
								stroke="#109618"
								strokeWidth="2"
								fillOpacity="1"
								fill="none"
							></path>
						</g>
					</g>
					<g>
						<rect
							x="55"
							y="10"
							width="550"
							height="280"
							stroke="none"
							strokeWidth="0"
							fillOpacity="0"
							fill="#ffffff"
						></rect>
						<g
							clipPath={`url(/book/stats?id=${bookId}#abstract-renderer-id-1)`}
						>
							<g>
								<rect
									x="55"
									y="289"
									width="550"
									height="1"
									stroke="none"
									strokeWidth="0"
									fill="#cccccc"
								></rect>
								<rect
									x="55"
									y="233"
									width="550"
									height="1"
									stroke="none"
									strokeWidth="0"
									fill="#cccccc"
								></rect>
								<rect
									x="55"
									y="177"
									width="550"
									height="1"
									stroke="none"
									strokeWidth="0"
									fill="#cccccc"
								></rect>
								<rect
									x="55"
									y="122"
									width="550"
									height="1"
									stroke="none"
									strokeWidth="0"
									fill="#cccccc"
								></rect>
								<rect
									x="55"
									y="66"
									width="550"
									height="1"
									stroke="none"
									strokeWidth="0"
									fill="#cccccc"
								></rect>
								<rect
									x="55"
									y="10"
									width="550"
									height="1"
									stroke="none"
									strokeWidth="0"
									fill="#cccccc"
								></rect>
								<rect
									x="55"
									y="261"
									width="550"
									height="1"
									stroke="none"
									strokeWidth="0"
									fill="#ebebeb"
								></rect>
								<rect
									x="55"
									y="205"
									width="550"
									height="1"
									stroke="none"
									strokeWidth="0"
									fill="#ebebeb"
								></rect>
								<rect
									x="55"
									y="150"
									width="550"
									height="1"
									stroke="none"
									strokeWidth="0"
									fill="#ebebeb"
								></rect>
								<rect
									x="55"
									y="94"
									width="550"
									height="1"
									stroke="none"
									strokeWidth="0"
									fill="#ebebeb"
								></rect>
								<rect
									x="55"
									y="38"
									width="550"
									height="1"
									stroke="none"
									strokeWidth="0"
									fill="#ebebeb"
								></rect>
							</g>
							<g>
								<rect
									x="55"
									y="289"
									width="550"
									height="1"
									stroke="none"
									strokeWidth="0"
									fill="#333333"
								></rect>
							</g>
							<g>
								<path
									d={addedPathDefinition}
									stroke="#3366cc"
									strokeWidth="2"
									fillOpacity="1"
									fill="none"
								></path>
								<path
									d={ratingsPathDefinition}
									stroke="#dc3912"
									strokeWidth="2"
									fillOpacity="1"
									fill="none"
								></path>
								<path
									d={reviewsPathDefinition}
									stroke="#ff9900"
									strokeWidth="2"
									fillOpacity="1"
									fill="none"
								></path>
								<path
									d={toReadPathDefinition}
									stroke="#109618"
									strokeWidth="2"
									fillOpacity="1"
									fill="none"
								></path>
							</g>
						</g>
						<g>
							{clickCircle}
							{hoverCircle}
						</g>
						<g>
							{eachDayOfInterval(interval)
								.filter((date, index) => index % 10 === 0)
								.map((date, index) => {
									return (
										<g key={index}>
											<text
												textAnchor="end"
												x={59.38 + 32.1 * index}
												y="308.44"
												fontFamily="Arial"
												fontSize="13"
												transform={`rotate(-30 ${59.38 + 32.1 * index} 308.44)`}
												stroke="none"
												strokeWidth="0"
												fill="#222222"
											>
												{format(date, 'yyyy-MM-dd')}
											</text>
										</g>
									);
								})}
							<g>
								<text
									textAnchor="end"
									x="42"
									y="294.05"
									fontFamily="Arial"
									fontSize="13"
									stroke="none"
									strokeWidth="0"
									fill="#444444"
								>
									0
								</text>
							</g>
							<g>
								<text
									textAnchor="end"
									x="42"
									y="238.25"
									fontFamily="Arial"
									fontSize="13"
									stroke="none"
									strokeWidth="0"
									fill="#444444"
								>
									{maximumDailyUpdates !== 1
										? Math.round(maximumDailyUpdates / 5)
										: Math.round(maximumDailyUpdates / 5, 1)}
								</text>
							</g>
							<g>
								<text
									textAnchor="end"
									x="42"
									y="182.45"
									fontFamily="Arial"
									fontSize="13"
									stroke="none"
									strokeWidth="0"
									fill="#444444"
								>
									{maximumDailyUpdates !== 1
										? Math.round((maximumDailyUpdates * 2) / 5)
										: Math.round((maximumDailyUpdates * 2) / 5, 1)}
								</text>
							</g>
							<g>
								<text
									textAnchor="end"
									x="42"
									y="126.65"
									fontFamily="Arial"
									fontSize="13"
									stroke="none"
									strokeWidth="0"
									fill="#444444"
								>
									{maximumDailyUpdates !== 1
										? Math.round((maximumDailyUpdates * 3) / 5)
										: Math.round((maximumDailyUpdates * 3) / 5, 1)}
								</text>
							</g>
							<g>
								<text
									textAnchor="end"
									x="42"
									y="70.85"
									fontFamily="Arial"
									fontSize="13"
									stroke="none"
									strokeWidth="0"
									fill="#444444"
								>
									{maximumDailyUpdates !== 1
										? Math.round((maximumDailyUpdates * 4) / 5)
										: Math.round((maximumDailyUpdates * 4) / 5, 1)}
								</text>
							</g>
							<g>
								<text
									textAnchor="end"
									x="42"
									y="15.05"
									fontFamily="Arial"
									fontSize="13"
									stroke="none"
									strokeWidth="0"
									fill="#444444"
								>
									{maximumDailyUpdates}
								</text>
							</g>
						</g>
					</g>
					<g>{toolTip}</g>
				</svg>
				<table>
					<thead>
						<tr>
							<th>date</th>
							<th>added</th>
							<th>ratings</th>
							<th>reviews</th>
							<th>to-read</th>
						</tr>
					</thead>
					<tbody>
						{eachDayOfInterval(interval).map((date, index) => {
							return (
								<tr key={index}>
									<td>{format(date, 'yyyy-MM-dd')}</td>
									<td>
										{
											statusUpdates.filter(
												(update) =>
													update.date === date && update.action === 'add-book'
											).length
										}
									</td>
									<td>
										{
											statusUpdates.filter(
												(update) =>
													update.date === date && update.action === 'rate-book'
											).length
										}
									</td>
									<td>
										{
											statusUpdates.filter(
												(update) =>
													update.date === date && update.action === 'add-review'
											).length
										}
									</td>
									<td>
										{
											statusUpdates.filter(
												(update) =>
													update.date === date &&
													update.action === 'add-book' &&
													update.shelf === 'to-read'
											).length
										}
									</td>
								</tr>
							);
						})}
					</tbody>
				</table>
			</div>
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
			{chart}
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
