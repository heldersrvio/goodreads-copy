import firebase from 'firebase/app';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { format, eachDayOfInterval, isSameDay, subDays } from 'date-fns';

const ColumnChart = (props) => {
	const [statusUpdates, setStatusUpdates] = useState([]);
	const [loaded, setLoaded] = useState(false);
	const [toolTip, setToolTip] = useState(null);
	const [hoveredAddedColumns, setHoveredAddedColumns] = useState(
		Array(171).fill(false)
	);
	const [hoveredRatingsColumns, setHoveredRatingsColumns] = useState(
		Array(171).fill(false)
	);
	const [hoveredReviewsColumns, setHoveredReviewsColumns] = useState(
		Array(171).fill(false)
	);
	const [hoveredToReadColumns, setHoveredToReadColumns] = useState(
		Array(171).fill(false)
	);
	const [tableVisible, setTableVisible] = useState(false);

	const interval = { start: subDays(new Date(), 170), end: new Date() };

	useEffect(() => {
		const getStatusInfo = async () => {
			//const statusUpdateObjs = await Firebase.queryStatusUpdatesForRootBook(bookId);
			const statusUpdateObjs = [
				{
					action: 'add-book',
					shelf: 'read',
					user: 'abc',
					book: props.bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2021, 1, 28)),
				},
				{
					action: 'add-book',
					shelf: 'to-read',
					user: 'abc',
					book: props.bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2021, 1, 28)),
				},
				{
					action: 'add-book',
					shelf: 'read',
					user: 'abc',
					book: props.bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2021, 1, 28)),
				},
				{
					action: 'add-book',
					shelf: 'to-read',
					user: 'abc',
					book: props.bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2021, 1, 28)),
				},
				{
					action: 'add-book',
					shelf: 'read',
					user: 'abc',
					book: props.bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2021, 2, 1)),
				},
				{
					action: 'add-book',
					shelf: 'read',
					user: 'abc',
					book: props.bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2021, 2, 1)),
				},
				{
					action: 'add-book',
					shelf: 'to-read',
					user: 'abc',
					book: props.bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2021, 2, 1)),
				},
				{
					action: 'add-book',
					shelf: 'read',
					user: 'abc',
					book: props.bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2021, 2, 1)),
				},
				{
					action: 'add-book',
					shelf: 'to-read',
					user: 'abc',
					book: props.bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2021, 2, 1)),
				},
				{
					action: 'add-book',
					shelf: 'read',
					user: 'abc',
					book: props.bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2021, 2, 1)),
				},
				{
					action: 'add-book',
					shelf: 'to-read',
					user: 'abc',
					book: props.bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2021, 2, 1)),
				},
				{
					action: 'add-book',
					shelf: 'read',
					user: 'abc',
					book: props.bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2021, 2, 1)),
				},
				{
					action: 'add-book',
					shelf: 'to-read',
					user: 'abc',
					book: props.bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2021, 2, 2)),
				},
				{
					action: 'add-book',
					shelf: 'read',
					user: 'abc',
					book: props.bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2021, 2, 2)),
				},
				{
					action: 'add-book',
					shelf: 'to-read',
					user: 'abc',
					book: props.bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2021, 2, 2)),
				},
				{
					action: 'add-book',
					shelf: 'read',
					user: 'abc',
					book: props.bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2021, 2, 2)),
				},
				{
					action: 'add-book',
					shelf: 'read',
					user: 'abc',
					book: props.bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2021, 2, 2)),
				},
				{
					action: 'add-book',
					shelf: 'to-read',
					user: 'abc',
					book: props.bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2021, 2, 2)),
				},
				{
					action: 'add-book',
					shelf: 'read',
					user: 'abc',
					book: props.bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2021, 2, 2)),
				},
				{
					action: 'add-book',
					shelf: 'to-read',
					user: 'abc',
					book: props.bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2021, 2, 2)),
				},
				{
					action: 'add-book',
					shelf: 'read',
					user: 'abc',
					book: props.bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2021, 2, 2)),
				},
				{
					action: 'add-book',
					shelf: 'to-read',
					user: 'abc',
					book: props.bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2021, 2, 2)),
				},
				{
					action: 'add-book',
					shelf: 'read',
					user: 'abc',
					book: props.bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2021, 2, 2)),
				},
				{
					action: 'add-book',
					shelf: 'to-read',
					user: 'abc',
					book: props.bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2020, 9, 14)),
				},
				{
					action: 'add-book',
					shelf: 'read',
					user: 'abc',
					book: props.bookId,
					date: firebase.firestore.Timestamp.fromDate(new Date(2020, 9, 14)),
				},
			];
			setStatusUpdates(statusUpdateObjs);
			setLoaded(true);
		};
		getStatusInfo();
	}, [props.bookId]);

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
	const reviewsUpdatesNumbers = loaded
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
				Math.max(...reviewsUpdatesNumbers),
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
				return [58.1 + 3.2 * index, 289.5 - chartUnit * updatesNumber];
		  })
		: [];

	const reviewsPathDefinitionCoordinates = loaded
		? eachDayOfInterval(interval).map((date, index) => {
				const updatesNumber = statusUpdates.filter(
					(update) =>
						update.action === 'review-book' &&
						isSameDay(update.date.toDate(), date)
				).length;
				return [59.1 + 3.2 * index, 289.5 - chartUnit * updatesNumber];
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
				return [60.1 + 3.2 * index, 289.5 - chartUnit * updatesNumber];
		  })
		: [];

	const svgMouseOverHandler = (e) => {
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
			const action =
				matchingAddedPathCoordinates.length > 0
					? 'added'
					: matchingRatingsPathCoordinates.length > 0
					? 'ratings'
					: matchingReviewsPathCoordinates.length > 0
					? 'reviews'
					: 'to-read';
			const coordinates =
				matchingAddedPathCoordinates.length > 0
					? matchingAddedPathCoordinates
					: matchingRatingsPathCoordinates.length > 0
					? matchingRatingsPathCoordinates
					: matchingReviewsPathCoordinates.length > 0
					? matchingReviewsPathCoordinates
					: matchingToReadPathCoordinates;
			const date = eachDayOfInterval(interval)[
				Math.round((coordinates[0][0] - 57.1) / 3.2)
			];
			const valueForDate =
				matchingAddedPathCoordinates.length > 0
					? addedUpdatesNumbers[Math.round((coordinates[0][0] - 57.1) / 3.2)]
					: matchingRatingsPathCoordinates.length > 0
					? ratingsUpdatesNumbers[Math.round((coordinates[0][0] - 57.1) / 3.2)]
					: matchingReviewsPathCoordinates.length > 0
					? reviewsUpdatesNumbers[Math.round((coordinates[0][0] - 57.1) / 3.2)]
					: toReadUpdatesNumbers[Math.round((coordinates[0][0] - 57.1) / 3.2)];
			const newToolTip = (
				<g className="chart-tooltip">
					<path
						d={
							coordinates[0][0] + 54.13 < 606 && coordinates[0][1] - 59.5 > 9
								? `
							M ${coordinates[0][0] - 27.87}, ${coordinates[0][1] - 13.5}
							A 1, 1, 0, 0, 1, ${coordinates[0][0] - 28.87}, ${coordinates[0][1] - 14.5}
							L ${coordinates[0][0] - 28.87}, ${coordinates[0][1] - 58.5}
							A 1, 1, 0, 0, 1, ${coordinates[0][0] - 27.87}, ${coordinates[0][1] - 59.5}
							L ${coordinates[0][0] + 53.13}, ${coordinates[0][1] - 59.5}
							A 1, 1, 0, 0, 1, ${coordinates[0][0] + 54.13}, ${coordinates[0][1] - 58.5}
							L ${coordinates[0][0] + 54.13}, ${coordinates[0][1] - 14.5}
							A 1, 1, 0, 0, 1, ${coordinates[0][0] + 53.13}, ${coordinates[0][1] - 13.5}
							L ${coordinates[0][0] + 25.13}, ${coordinates[0][1] - 13.5}
							L ${coordinates[0][0]}, ${coordinates[0][1]}
							L ${coordinates[0][0] + 12.13}, ${coordinates[0][1] - 13.5}
							Z
						`
								: coordinates[0][0] + 54.13 < 606
								? `
							M ${coordinates[0][0] - 32.26}, ${coordinates[0][1] + 85.73}
							A 1, 1, 0, 0, 1, ${coordinates[0][0] - 33.26}, ${coordinates[0][1] + 84.73}
							L ${coordinates[0][0] - 33.26}, ${coordinates[0][1] + 40.73}
							A 1, 1, 0, 0, 1, ${coordinates[0][0] - 32.26}, ${coordinates[0][1] + 39.73}
							L ${coordinates[0][0] + 12.74}, ${coordinates[0][1] + 39.73}
							L ${coordinates[0][0]}, ${coordinates[0][1]}
							L ${coordinates[0][0] + 25.74}, ${coordinates[0][1] + 39.73}
							L ${coordinates[0][0] + 58.74}, ${coordinates[0][1] + 39.73}
							A 1, 1, 0, 0, 1, ${coordinates[0][0] + 59.74}, ${coordinates[0][1] + 40.73}
							L ${coordinates[0][0] + 59.74}, ${coordinates[0][1] + 84.73}
							A 1, 1, 0, 0, 1, ${coordinates[0][0] + 58.74}, ${coordinates[0][1] + 85.73}
							Z	
						`
								: coordinates[0][1] - 59.5 > 9
								? `
							M ${coordinates[0][0] - 62.612}, ${coordinates[0][1] - 13.5}
							A 1, 1, 0, 0, 1, ${coordinates[0][0] - 63.612}, ${coordinates[0][1] - 14.5}
							L ${coordinates[0][0] - 63.612}, ${coordinates[0][1] - 58.5}
							A 1, 1, 0, 0, 1, ${coordinates[0][0] - 62.612}, ${coordinates[0][1] - 59.5}
							L ${coordinates[0][0] + 18.388}, ${coordinates[0][1] - 59.5}
							A 1, 1, 0, 0, 1, ${coordinates[0][0] + 19.388}, ${coordinates[0][1] - 58.5}
							L ${coordinates[0][0] + 19.388}, ${coordinates[0][1] - 14.5}
							A 1, 1, 0, 0, 1, ${coordinates[0][0] + 18.388}, ${coordinates[0][1] - 13.5}
							L ${coordinates[0][0] - 26.312}, ${coordinates[0][1] - 13.5}
							L ${coordinates[0][0]}, ${coordinates[0][1]}
							L ${coordinates[0][0] - 13.742}, ${coordinates[0][1] - 13.5}
							Z
						`
								: `
							M ${coordinates[0][0] - 53.34}, ${coordinates[0][1] + 58.5}
							A 1, 1, 0, 0, 1, ${coordinates[0][0] - 54.34}, ${coordinates[0][1] + 57.5}
							L ${coordinates[0][0] - 54.34}, ${coordinates[0][1] + 13.5}
							A 1, 1, 0, 0, 1, ${coordinates[0][0] - 53.34}, ${coordinates[0][1] + 12.5}
							L ${coordinates[0][0] - 26.34}, ${coordinates[0][1] + 12.5}
							L ${coordinates[0][0]}, ${coordinates[0][1]}
							L ${coordinates[0][0] - 13.34}, ${coordinates[0][1] + 12.5}
							L ${coordinates[0][0] + 27.66}, ${coordinates[0][1] + 12.5}
							A 1, 1, 0, 0, 1, ${coordinates[0][0] + 28.66}, ${coordinates[0][1] + 13.5}
							L ${coordinates[0][0] + 28.66}, ${coordinates[0][1] + 57.5}
							A 1, 1, 0, 0, 1, ${coordinates[0][0] + 27.66}, ${coordinates[0][1] + 58.5}
							Z
						`
						}
						stroke="#cccccc"
						strokeWidth="1"
						fill="#ffffff"
						filter={`url(/book/stats?id=${props.bookId}#abstract-renderer-id-2`}
					></path>
					<g>
						<text
							textAnchor="start"
							x={
								coordinates[0][0] + 54.13 < 606
									? coordinates[0][0] - 21.37
									: coordinates[0][1] - 59.5 > 9
									? coordinates[0][0] - 56.612
									: coordinates[0][0] - 46.84
							}
							y={
								coordinates[0][1] - 59.5 > 9
									? coordinates[0][1] - 40.95
									: coordinates[0][0] + 54.13 < 606
									? coordinates[0][1] + 58.73
									: coordinates[0][1] + 31.05
							}
							fontFamily="Arial"
							fontSize="13"
							fontWeight="bold"
							stroke="none"
							strokeWidth="0"
							fill="#000000"
						>
							{format(date, 'yyyy-MM-dd')}
						</text>
					</g>
					<g>
						<text
							textAnchor="start"
							x={
								coordinates[0][0] + 54.13 < 606
									? coordinates[0][0] - 21.37
									: coordinates[0][1] - 59.5 > 9
									? coordinates[0][0] - 56.612
									: coordinates[0][0] - 46.84
							}
							y={
								coordinates[0][1] - 59.5 > 9
									? coordinates[0][1] - 23.95
									: coordinates[0][0] + 54.13 < 606
									? coordinates[0][1] + 75.73
									: coordinates[0][1] + 48.05
							}
							fontFamily="Arial"
							fontSize="13"
							stroke="none"
							strokeWidth="0"
							fill="#000000"
						>
							{`${action}:`}
						</text>
						<text
							textAnchor="start"
							x={
								coordinates[0][0] + 54.13 < 606
									? coordinates[0][0] + 27.63
									: coordinates[0][1] - 59.5 > 9
									? coordinates[0][0] - 7.112
									: coordinates[0][0] + 3.34
							}
							y={
								coordinates[0][1] - 59.5 > 9
									? coordinates[0][1] - 23.95
									: coordinates[0][0] + 54.13 < 606
									? coordinates[0][1] + 75.73
									: coordinates[0][1] + 48.05
							}
							fontFamily="Arial"
							fontSize="13"
							fontWeight="bold"
							stroke="none"
							strokeWidth="0"
							fill="#000000"
						>
							{valueForDate}
						</text>
					</g>
				</g>
			);
			setToolTip(newToolTip);
		} else {
			setToolTip(null);
		}
	};

	const svg = (
		<svg width="620" height="400" onMouseOver={svgMouseOverHandler}>
			<defs id="abstract-renderer-id-0">
				<clipPath id="abstract-renderer-id-1">
					<rect x="55" y="10" width="550" height="280"></rect>
				</clipPath>
				<filter id="abstract-renderer-id-2">
					<feGaussianBlur in="SourceAlpha" stdDeviation="2"></feGaussianBlur>
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
				<g
					onMouseOver={(_e) =>
						setHoveredAddedColumns((previous) =>
							previous.map((_value, i) => true)
						)
					}
					onMouseLeave={(_e) =>
						setHoveredAddedColumns((previous) =>
							previous.map((_value, i) => false)
						)
					}
				>
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
					<rect
						x="156"
						y="365"
						width="26"
						height="13"
						stroke="none"
						strokeWidth="0"
						fill="#3366cc"
					></rect>
				</g>
				<g
					onMouseOver={(_e) =>
						setHoveredRatingsColumns((previous) =>
							previous.map((_value, i) => true)
						)
					}
					onMouseLeave={(_e) =>
						setHoveredRatingsColumns((previous) =>
							previous.map((_value, i) => false)
						)
					}
				>
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
					<rect
						x="244"
						y="365"
						width="26"
						height="13"
						stroke="none"
						strokeWidth="0"
						fill="#dc3912"
					></rect>
				</g>
				<g
					onMouseOver={(_e) =>
						setHoveredReviewsColumns((previous) =>
							previous.map((_value, i) => true)
						)
					}
					onMouseLeave={(_e) =>
						setHoveredReviewsColumns((previous) =>
							previous.map((_value, i) => false)
						)
					}
				>
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
					<rect
						x="335"
						y="365"
						width="26"
						height="13"
						stroke="none"
						strokeWidth="0"
						fill="#ff9900"
					></rect>
				</g>
				<g
					onMouseOver={(_e) =>
						setHoveredToReadColumns((previous) =>
							previous.map((_value, i) => true)
						)
					}
					onMouseLeave={(_e) =>
						setHoveredToReadColumns((previous) =>
							previous.map((_value, i) => false)
						)
					}
				>
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
					<rect
						x="431"
						y="365"
						width="26"
						height="13"
						stroke="none"
						strokeWidth="0"
						fill="#109618"
					></rect>
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
					clipPath={`url(/book/stats?id=${props.bookId}#abstract-renderer-id-1)`}
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
						{addedUpdatesNumbers.map((quantity, index) => {
							if (hoveredAddedColumns[index]) {
								return (
									<g
										onMouseLeave={(_e) =>
											setHoveredAddedColumns((previous) =>
												previous.map((value, i) =>
													i === index ? false : value
												)
											)
										}
										key={index}
									>
										<rect
											x={57.5 + 3.2 * index}
											y={289.5 - quantity * chartUnit}
											width="0.5"
											height={quantity * chartUnit}
											stroke="none"
											strokeWidth="0"
											fill="#3366cc"
										></rect>
										<rect
											x={57 + 3.2 * index}
											y={289 - quantity * chartUnit}
											width="1.5"
											height={quantity * chartUnit + 1}
											stroke="#000000"
											strokeWidth="1"
											strokeOpacity="0.3"
											fillOpacity="1"
											fill="none"
										></rect>
										<rect
											x={56 + 3.2 * index}
											y={288 - quantity * chartUnit}
											width="3.5"
											height={quantity * chartUnit + 3}
											stroke="#000000"
											strokeWidth="1"
											strokeOpacity="0.15"
											fillOpacity="1"
											fill="none"
										></rect>
										<rect
											x={55 + 3.2 * index}
											y={287 - quantity * chartUnit}
											width="5.5"
											height={quantity * chartUnit + 5}
											stroke="#000000"
											strokeWidth="1"
											strokeOpacity="0.05"
											fillOpacity="1"
											fill="none"
										></rect>
									</g>
								);
							}
							return (
								<rect
									onMouseOver={(_e) =>
										setHoveredAddedColumns((previous) =>
											previous.map((_value, i) => i === index)
										)
									}
									x={57.5 + 3.2 * index}
									y={289.5 - quantity * chartUnit}
									width="0.5"
									height={quantity * chartUnit}
									stroke="none"
									strokeWidth="0"
									fill="#3366cc"
									key={index}
								></rect>
							);
						})}
						{ratingsUpdatesNumbers.map((quantity, index) => {
							if (hoveredRatingsColumns[index]) {
								return (
									<g
										onMouseLeave={(_e) =>
											setHoveredRatingsColumns((previous) =>
												previous.map((value, i) =>
													i === index ? false : value
												)
											)
										}
										key={index * 2}
									>
										<rect
											x={58.5 + 3.2 * index}
											y={289.5 - quantity * chartUnit}
											width="0.5"
											height={quantity * chartUnit}
											stroke="none"
											strokeWidth="0"
											fill="#dc3912"
										></rect>
										<rect
											x={58 + 3.2 * index}
											y={289 - quantity * chartUnit}
											width="1.5"
											height={quantity * chartUnit + 1}
											stroke="#000000"
											strokeWidth="1"
											strokeOpacity="0.3"
											fillOpacity="1"
											fill="none"
										></rect>
										<rect
											x={57 + 3.2 * index}
											y={288 - quantity * chartUnit}
											width="3.5"
											height={quantity * chartUnit + 3}
											stroke="#000000"
											strokeWidth="1"
											strokeOpacity="0.15"
											fillOpacity="1"
											fill="none"
										></rect>
										<rect
											x={56 + 3.2 * index}
											y={287 - quantity * chartUnit}
											width="5.5"
											height={quantity * chartUnit + 5}
											stroke="#000000"
											strokeWidth="1"
											strokeOpacity="0.05"
											fillOpacity="1"
											fill="none"
										></rect>
									</g>
								);
							}
							return (
								<rect
									onMouseOver={(_e) =>
										setHoveredRatingsColumns((previous) =>
											previous.map((_value, i) => i === index)
										)
									}
									x={58.5 + 3.2 * index}
									y={289.5 - quantity * chartUnit}
									width="0.5"
									height={quantity * chartUnit}
									stroke="none"
									strokeWidth="0"
									fill="#dc3912"
									key={index * 2}
								></rect>
							);
						})}
						{reviewsUpdatesNumbers.map((quantity, index) => {
							if (hoveredReviewsColumns[index]) {
								return (
									<g
										onMouseLeave={(_e) =>
											setHoveredReviewsColumns((previous) =>
												previous.map((value, i) =>
													i === index ? false : value
												)
											)
										}
										key={index * 3}
									>
										<rect
											x={59.5 + 3.2 * index}
											y={289.5 - quantity * chartUnit}
											width="0.5"
											height={quantity * chartUnit}
											stroke="none"
											strokeWidth="0"
											fill="#ff9900"
										></rect>
										<rect
											x={59 + 3.2 * index}
											y={289 - quantity * chartUnit}
											width="1.5"
											height={quantity * chartUnit + 1}
											stroke="#000000"
											strokeWidth="1"
											strokeOpacity="0.3"
											fillOpacity="1"
											fill="none"
										></rect>
										<rect
											x={58 + 3.2 * index}
											y={288 - quantity * chartUnit}
											width="3.5"
											height={quantity * chartUnit + 3}
											stroke="#000000"
											strokeWidth="1"
											strokeOpacity="0.15"
											fillOpacity="1"
											fill="none"
										></rect>
										<rect
											x={57 + 3.2 * index}
											y={287 - quantity * chartUnit}
											width="5.5"
											height={quantity * chartUnit + 5}
											stroke="#000000"
											strokeWidth="1"
											strokeOpacity="0.05"
											fillOpacity="1"
											fill="none"
										></rect>
									</g>
								);
							}
							return (
								<rect
									onMouseOver={(_e) =>
										setHoveredReviewsColumns((previous) =>
											previous.map((_value, i) => i === index)
										)
									}
									x={59.5 + 3.2 * index}
									y={289.5 - quantity * chartUnit}
									width="0.5"
									height={quantity * chartUnit}
									stroke="none"
									strokeWidth="0"
									fill="#ff9900"
									key={index * 3}
								></rect>
							);
						})}
						{toReadUpdatesNumbers.map((quantity, index) => {
							if (hoveredToReadColumns[index]) {
								return (
									<g
										onMouseLeave={(_e) =>
											setHoveredToReadColumns((previous) =>
												previous.map((value, i) =>
													i === index ? false : value
												)
											)
										}
										key={index * 4}
									>
										<rect
											x={60.5 + 3.2 * index}
											y={289.5 - quantity * chartUnit}
											width="0.5"
											height={quantity * chartUnit}
											stroke="none"
											strokeWidth="0"
											fill="#109618"
										></rect>
										<rect
											x={60 + 3.2 * index}
											y={289 - quantity * chartUnit}
											width="1.5"
											height={quantity * chartUnit + 1}
											stroke="#000000"
											strokeWidth="1"
											strokeOpacity="0.3"
											fillOpacity="1"
											fill="none"
										></rect>
										<rect
											x={59 + 3.2 * index}
											y={288 - quantity * chartUnit}
											width="3.5"
											height={quantity * chartUnit + 3}
											stroke="#000000"
											strokeWidth="1"
											strokeOpacity="0.15"
											fillOpacity="1"
											fill="none"
										></rect>
										<rect
											x={58 + 3.2 * index}
											y={287 - quantity * chartUnit}
											width="5.5"
											height={quantity * chartUnit + 5}
											stroke="#000000"
											strokeWidth="1"
											strokeOpacity="0.05"
											fillOpacity="1"
											fill="none"
										></rect>
									</g>
								);
							}
							return (
								<rect
									onMouseOver={(_e) =>
										setHoveredToReadColumns((previous) =>
											previous.map((_value, i) => i === index)
										)
									}
									x={60.5 + 3.2 * index}
									y={289.5 - quantity * chartUnit}
									width="0.5"
									height={quantity * chartUnit}
									stroke="none"
									strokeWidth="0"
									fill="#109618"
									key={index * 4}
								></rect>
							);
						})}
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
				</g>
				<g></g>
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
	);

	const table = (
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
											isSameDay(update.date.toDate(), date) &&
											update.action === 'add-book'
									).length
								}
							</td>
							<td>
								{
									statusUpdates.filter(
										(update) =>
											isSameDay(update.date.toDate(), date) &&
											update.action === 'rate-book'
									).length
								}
							</td>
							<td>
								{
									statusUpdates.filter(
										(update) =>
											isSameDay(update.date.toDate(), date) &&
											update.action === 'add-review'
									).length
								}
							</td>
							<td>
								{
									statusUpdates.filter(
										(update) =>
											isSameDay(update.date.toDate(), date) &&
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
	);

	const bottomSection = loaded ? (
		<div className="book-all-stats-page-bottom-section">
			<button
				className="stats-breakdown-button"
				onClick={(_e) => setTableVisible((previous) => !previous)}
			>
				Click here for breakdown
			</button>
			<div className="chart-table">{tableVisible ? table : null}</div>
			<span>
				Note: This data corresponds to the date users most recently updated this
				book in their shelves.
			</span>
		</div>
	) : null;

	return loaded ? (
		<div className="chart">
			{svg}
			{bottomSection}
		</div>
	) : null;
};

ColumnChart.propTypes = {
	bookId: PropTypes.string,
};

export default ColumnChart;
