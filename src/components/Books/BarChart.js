import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { format, eachDayOfInterval, isSameDay, subDays } from 'date-fns';
import Firebase from '../../Firebase';

const BarChart = (props) => {
	const [statusUpdates, setStatusUpdates] = useState([]);
	const [loaded, setLoaded] = useState(false);
	const [toolTip, setToolTip] = useState(null);
	const [hoveredAddedBars, setHoveredAddedBars] = useState(
		Array(171).fill(false)
	);
	const [hoveredRatingsBars, setHoveredRatingsBars] = useState(
		Array(171).fill(false)
	);
	const [hoveredReviewsBars, setHoveredReviewsBars] = useState(
		Array(171).fill(false)
	);
	const [hoveredToReadBars, setHoveredToReadBars] = useState(
		Array(171).fill(false)
	);
	const [tableVisible, setTableVisible] = useState(false);

	const interval = { start: subDays(new Date(), 170), end: new Date() };

	useEffect(() => {
		const getStatusInfo = async () => {
			const statusUpdateObjs = props.allEditions
				? await Firebase.queryStatusUpdatesForRootBook(props.bookId)
				: await Firebase.queryStatusUpdatesForBook(props.bookId);
			setStatusUpdates(statusUpdateObjs);
			setLoaded(true);
		};
		getStatusInfo();
	}, [props.bookId, props.allEditions]);

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
	const chartUnit = maximumDailyUpdates !== 0 ? 608 / maximumDailyUpdates : 0;

	const addedPathDefinitionCoordinates = loaded
		? eachDayOfInterval(interval).map((date, index) => {
				const updatesNumber = statusUpdates.filter(
					(update) =>
						update.action === 'add-book' &&
						isSameDay(update.date.toDate(), date)
				).length;
				return [56 + chartUnit * updatesNumber, 10.5 + 2 * index];
		  })
		: [];

	const ratingsPathDefinitionCoordinates = loaded
		? eachDayOfInterval(interval).map((date, index) => {
				const updatesNumber = statusUpdates.filter(
					(update) =>
						update.action === 'rate-book' &&
						isSameDay(update.date.toDate(), date)
				).length;
				return [56 + chartUnit * updatesNumber, 11.5 + 2 * index];
		  })
		: [];

	const reviewsPathDefinitionCoordinates = loaded
		? eachDayOfInterval(interval).map((date, index) => {
				const updatesNumber = statusUpdates.filter(
					(update) =>
						update.action === 'review-book' &&
						isSameDay(update.date.toDate(), date)
				).length;
				return [56 + chartUnit * updatesNumber, 12.5 + 2 * index];
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
				return [56 + chartUnit * updatesNumber, 13.5 + 2 * index];
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
			const offsetValue =
				matchingAddedPathCoordinates.length > 0
					? 10.5
					: matchingRatingsPathCoordinates.length > 0
					? 11.5
					: matchingReviewsPathCoordinates.length > 0
					? 12.5
					: 13.5;
			const date = eachDayOfInterval(interval)[
				Math.round((coordinates[0][1] - offsetValue) / 2)
			];
			const valueForDate =
				matchingAddedPathCoordinates.length > 0
					? addedUpdatesNumbers[
							Math.round((coordinates[0][1] - offsetValue) / 2)
					  ]
					: matchingRatingsPathCoordinates.length > 0
					? ratingsUpdatesNumbers[
							Math.round((coordinates[0][1] - offsetValue) / 2)
					  ]
					: matchingReviewsPathCoordinates.length > 0
					? reviewsUpdatesNumbers[
							Math.round((coordinates[0][1] - offsetValue) / 2)
					  ]
					: toReadUpdatesNumbers[
							Math.round((coordinates[0][1] - offsetValue) / 2)
					  ];
			const newToolTip = (
				<g className="chart-tooltip">
					<path
						d={
							coordinates[0][0] + 54.13 < 606 && coordinates[0][1] - 59.5 > 9
								? `
                            M ${coordinates[0][0] - 27.87}, ${
										coordinates[0][1] - 13.5
								  }
                            A 1, 1, 0, 0, 1, ${coordinates[0][0] - 28.87}, ${
										coordinates[0][1] - 14.5
								  }
                            L ${coordinates[0][0] - 28.87}, ${
										coordinates[0][1] - 58.5
								  }
                            A 1, 1, 0, 0, 1, ${coordinates[0][0] - 27.87}, ${
										coordinates[0][1] - 59.5
								  }
                            L ${coordinates[0][0] + 53.13}, ${
										coordinates[0][1] - 59.5
								  }
                            A 1, 1, 0, 0, 1, ${coordinates[0][0] + 54.13}, ${
										coordinates[0][1] - 58.5
								  }
                            L ${coordinates[0][0] + 54.13}, ${
										coordinates[0][1] - 14.5
								  }
                            A 1, 1, 0, 0, 1, ${coordinates[0][0] + 53.13}, ${
										coordinates[0][1] - 13.5
								  }
                            L ${coordinates[0][0] + 25.13}, ${
										coordinates[0][1] - 13.5
								  }
                            L ${coordinates[0][0]}, ${coordinates[0][1]}
                            L ${coordinates[0][0] + 12.13}, ${
										coordinates[0][1] - 13.5
								  }
                            Z
                        `
								: coordinates[0][0] + 54.13 < 606
								? `
                            M ${coordinates[0][0] - 32.26}, ${
										coordinates[0][1] + 85.73
								  }
                            A 1, 1, 0, 0, 1, ${coordinates[0][0] - 33.26}, ${
										coordinates[0][1] + 84.73
								  }
                            L ${coordinates[0][0] - 33.26}, ${
										coordinates[0][1] + 40.73
								  }
                            A 1, 1, 0, 0, 1, ${coordinates[0][0] - 32.26}, ${
										coordinates[0][1] + 39.73
								  }
                            L ${coordinates[0][0] + 12.74}, ${
										coordinates[0][1] + 39.73
								  }
                            L ${coordinates[0][0]}, ${coordinates[0][1]}
                            L ${coordinates[0][0] + 25.74}, ${
										coordinates[0][1] + 39.73
								  }
                            L ${coordinates[0][0] + 58.74}, ${
										coordinates[0][1] + 39.73
								  }
                            A 1, 1, 0, 0, 1, ${coordinates[0][0] + 59.74}, ${
										coordinates[0][1] + 40.73
								  }
                            L ${coordinates[0][0] + 59.74}, ${
										coordinates[0][1] + 84.73
								  }
                            A 1, 1, 0, 0, 1, ${coordinates[0][0] + 58.74}, ${
										coordinates[0][1] + 85.73
								  }
                            Z	
                        `
								: coordinates[0][1] - 59.5 > 9
								? `
                            M ${coordinates[0][0] - 62.612}, ${
										coordinates[0][1] - 13.5
								  }
                            A 1, 1, 0, 0, 1, ${coordinates[0][0] - 63.612}, ${
										coordinates[0][1] - 14.5
								  }
                            L ${coordinates[0][0] - 63.612}, ${
										coordinates[0][1] - 58.5
								  }
                            A 1, 1, 0, 0, 1, ${coordinates[0][0] - 62.612}, ${
										coordinates[0][1] - 59.5
								  }
                            L ${coordinates[0][0] + 18.388}, ${
										coordinates[0][1] - 59.5
								  }
                            A 1, 1, 0, 0, 1, ${coordinates[0][0] + 19.388}, ${
										coordinates[0][1] - 58.5
								  }
                            L ${coordinates[0][0] + 19.388}, ${
										coordinates[0][1] - 14.5
								  }
                            A 1, 1, 0, 0, 1, ${coordinates[0][0] + 18.388}, ${
										coordinates[0][1] - 13.5
								  }
                            L ${coordinates[0][0] - 26.312}, ${
										coordinates[0][1] - 13.5
								  }
                            L ${coordinates[0][0]}, ${coordinates[0][1]}
                            L ${coordinates[0][0] - 13.742}, ${
										coordinates[0][1] - 13.5
								  }
                            Z
                        `
								: `
                            M ${coordinates[0][0] - 53.34}, ${
										coordinates[0][1] + 58.5
								  }
                            A 1, 1, 0, 0, 1, ${coordinates[0][0] - 54.34}, ${
										coordinates[0][1] + 57.5
								  }
                            L ${coordinates[0][0] - 54.34}, ${
										coordinates[0][1] + 13.5
								  }
                            A 1, 1, 0, 0, 1, ${coordinates[0][0] - 53.34}, ${
										coordinates[0][1] + 12.5
								  }
                            L ${coordinates[0][0] - 26.34}, ${
										coordinates[0][1] + 12.5
								  }
                            L ${coordinates[0][0]}, ${coordinates[0][1]}
                            L ${coordinates[0][0] - 13.34}, ${
										coordinates[0][1] + 12.5
								  }
                            L ${coordinates[0][0] + 27.66}, ${
										coordinates[0][1] + 12.5
								  }
                            A 1, 1, 0, 0, 1, ${coordinates[0][0] + 28.66}, ${
										coordinates[0][1] + 13.5
								  }
                            L ${coordinates[0][0] + 28.66}, ${
										coordinates[0][1] + 57.5
								  }
                            A 1, 1, 0, 0, 1, ${coordinates[0][0] + 27.66}, ${
										coordinates[0][1] + 58.5
								  }
                            Z
                        `
						}
						stroke="#cccccc"
						strokeWidth="1"
						fill="#ffffff"
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
						setHoveredAddedBars((previous) => previous.map((_value, i) => true))
					}
					onMouseLeave={(_e) =>
						setHoveredAddedBars((previous) =>
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
						setHoveredRatingsBars((previous) =>
							previous.map((_value, i) => true)
						)
					}
					onMouseLeave={(_e) =>
						setHoveredRatingsBars((previous) =>
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
						setHoveredReviewsBars((previous) =>
							previous.map((_value, i) => true)
						)
					}
					onMouseLeave={(_e) =>
						setHoveredReviewsBars((previous) =>
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
						setHoveredToReadBars((previous) =>
							previous.map((_value, i) => true)
						)
					}
					onMouseLeave={(_e) =>
						setHoveredToReadBars((previous) =>
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
							y="10"
							width="1"
							height="280"
							stroke="none"
							strokeWidth="0"
							fill="#cccccc"
						></rect>
						<rect
							x="147"
							y="10"
							width="1"
							height="280"
							stroke="none"
							strokeWidth="0"
							fill="#cccccc"
						></rect>
						<rect
							x="238"
							y="10"
							width="1"
							height="280"
							stroke="none"
							strokeWidth="0"
							fill="#cccccc"
						></rect>
						<rect
							x="330"
							y="10"
							width="1"
							height="280"
							stroke="none"
							strokeWidth="0"
							fill="#cccccc"
						></rect>
						<rect
							x="421"
							y="10"
							width="1"
							height="280"
							stroke="none"
							strokeWidth="0"
							fill="#cccccc"
						></rect>
						<rect
							x="513"
							y="10"
							width="1"
							height="280"
							stroke="none"
							strokeWidth="0"
							fill="#cccccc"
						></rect>
						<rect
							x="604"
							y="10"
							width="1"
							height="280"
							stroke="none"
							strokeWidth="0"
							fill="#cccccc"
						></rect>
						<rect
							x="101"
							y="10"
							width="1"
							height="280"
							stroke="none"
							strokeWidth="0"
							fill="#ebebeb"
						></rect>
						<rect
							x="192"
							y="10"
							width="1"
							height="280"
							stroke="none"
							strokeWidth="0"
							fill="#ebebeb"
						></rect>
						<rect
							x="284"
							y="10"
							width="1"
							height="280"
							stroke="none"
							strokeWidth="0"
							fill="#ebebeb"
						></rect>
						<rect
							x="375"
							y="10"
							width="1"
							height="280"
							stroke="none"
							strokeWidth="0"
							fill="#ebebeb"
						></rect>
						<rect
							x="467"
							y="10"
							width="1"
							height="280"
							stroke="none"
							strokeWidth="0"
							fill="#ebebeb"
						></rect>
						<rect
							x="558"
							y="10"
							width="1"
							height="280"
							stroke="none"
							strokeWidth="0"
							fill="#ebebeb"
						></rect>
					</g>
					<g>
						{addedUpdatesNumbers.map((quantity, index) => {
							if (hoveredAddedBars[index]) {
								return (
									<g
										onMouseLeave={(_e) =>
											setHoveredAddedBars((previous) =>
												previous.map((value, i) =>
													i === index ? false : value
												)
											)
										}
										key={index}
									>
										<rect
											x="56"
											y={10.5 + 2 * index}
											width={quantity * chartUnit}
											height="0.5"
											stroke="none"
											strokeWidth="0"
											fill="#3366cc"
										></rect>
										<rect
											x="55.5"
											y={10 + 2 * index}
											width={quantity * chartUnit + 1}
											height="1.5"
											stroke="#000000"
											strokeWidth="1"
											strokeOpacity="0.3"
											fillOpacity="1"
											fill="none"
										></rect>
										<rect
											x="54.5"
											y={9 + 2 * index}
											width={quantity * chartUnit + 3}
											height="3.5"
											stroke="#000000"
											strokeWidth="1"
											strokeOpacity="0.15"
											fillOpacity="1"
											fill="none"
										></rect>
										<rect
											x="53.5"
											y={8 + 2 * index}
											width={quantity * chartUnit + 5}
											height="5.5"
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
										setHoveredAddedBars((previous) =>
											previous.map((_value, i) => i === index)
										)
									}
									x="56"
									y={10.5 + 2 * index}
									width={quantity * chartUnit}
									height="0.5"
									stroke="none"
									strokeWidth="0"
									fill="#3366cc"
									key={index}
								></rect>
							);
						})}
						{ratingsUpdatesNumbers.map((quantity, index) => {
							if (hoveredRatingsBars[index]) {
								return (
									<g
										onMouseLeave={(_e) =>
											setHoveredRatingsBars((previous) =>
												previous.map((value, i) =>
													i === index ? false : value
												)
											)
										}
										key={index * 2}
									>
										<rect
											x="56"
											y={11.5 + 2 * index}
											width={quantity * chartUnit}
											height="0.5"
											stroke="none"
											strokeWidth="0"
											fill="#dc3912"
										></rect>
										<rect
											x="55.5"
											y={11 + 2 * index}
											width={quantity * chartUnit + 1}
											height="1.5"
											stroke="#000000"
											strokeWidth="1"
											strokeOpacity="0.3"
											fillOpacity="1"
											fill="none"
										></rect>
										<rect
											x="54.5"
											y={10 + 2 * index}
											width={quantity * chartUnit + 3}
											height="3.5"
											stroke="#000000"
											strokeWidth="1"
											strokeOpacity="0.15"
											fillOpacity="1"
											fill="none"
										></rect>
										<rect
											x="53.5"
											y={9 + 2 * index}
											width={quantity * chartUnit + 5}
											height="5.5"
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
										setHoveredRatingsBars((previous) =>
											previous.map((_value, i) => i === index)
										)
									}
									x="56"
									y={11.5 + 2 * index}
									width={quantity * chartUnit}
									height="0.5"
									stroke="none"
									strokeWidth="0"
									fill="#dc3912"
									key={index * 2}
								></rect>
							);
						})}
						{reviewsUpdatesNumbers.map((quantity, index) => {
							if (hoveredReviewsBars[index]) {
								return (
									<g
										onMouseLeave={(_e) =>
											setHoveredReviewsBars((previous) =>
												previous.map((value, i) =>
													i === index ? false : value
												)
											)
										}
										key={index * 3}
									>
										<rect
											x="56"
											y={12.5 + 2 * index}
											width={quantity * chartUnit}
											height="0.5"
											stroke="none"
											strokeWidth="0"
											fill="#ff9900"
										></rect>
										<rect
											x="55.5"
											y={12 + 2 * index}
											width={quantity * chartUnit + 1}
											height="1.5"
											stroke="#000000"
											strokeWidth="1"
											strokeOpacity="0.3"
											fillOpacity="1"
											fill="none"
										></rect>
										<rect
											x="54.5"
											y={11 + 2 * index}
											width={quantity * chartUnit + 3}
											height="3.5"
											stroke="#000000"
											strokeWidth="1"
											strokeOpacity="0.15"
											fillOpacity="1"
											fill="none"
										></rect>
										<rect
											x="53.5"
											y={10 + 2 * index}
											width={quantity * chartUnit + 5}
											height="5.5"
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
										setHoveredReviewsBars((previous) =>
											previous.map((_value, i) => i === index)
										)
									}
									x="56"
									y={12.5 + 2 * index}
									width={quantity * chartUnit}
									height="0.5"
									stroke="none"
									strokeWidth="0"
									fill="#ff9900"
									key={index * 3}
								></rect>
							);
						})}
						{toReadUpdatesNumbers.map((quantity, index) => {
							if (hoveredToReadBars[index]) {
								return (
									<g
										onMouseLeave={(_e) =>
											setHoveredToReadBars((previous) =>
												previous.map((value, i) =>
													i === index ? false : value
												)
											)
										}
										key={index * 4}
									>
										<rect
											x="56"
											y={13.5 + 2 * index}
											width={quantity * chartUnit}
											height="0.5"
											stroke="none"
											strokeWidth="0"
											fill="#109618"
										></rect>
										<rect
											x="55.5"
											y={13 + 2 * index}
											width={quantity * chartUnit + 1}
											height="1.5"
											stroke="#000000"
											strokeWidth="1"
											strokeOpacity="0.3"
											fillOpacity="1"
											fill="none"
										></rect>
										<rect
											x="54.5"
											y={12 + 2 * index}
											width={quantity * chartUnit + 3}
											height="3.5"
											stroke="#000000"
											strokeWidth="1"
											strokeOpacity="0.15"
											fillOpacity="1"
											fill="none"
										></rect>
										<rect
											x="53.5"
											y={11 + 2 * index}
											width={quantity * chartUnit + 5}
											height="5.5"
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
										setHoveredToReadBars((previous) =>
											previous.map((_value, i) => i === index)
										)
									}
									x="56"
									y={13.5 + 2 * index}
									width={quantity * chartUnit}
									height="0.5"
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
							y="10"
							width="1"
							height="280"
							stroke="none"
							strokeWidth="0"
							fill="#333333"
						></rect>
					</g>
				</g>
				<g></g>
				<g>
					<g>
						<text
							textAnchor="middle"
							x="55.5"
							y="309.05"
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
							textAnchor="middle"
							x="147"
							y="309.05"
							fontFamily="Arial"
							fontSize="13"
							stroke="none"
							strokeWidth="0"
							fill="#444444"
						>
							{maximumDailyUpdates !== 1
								? Math.round(maximumDailyUpdates / 6)
								: Math.round(maximumDailyUpdates / 6, 1)}
						</text>
					</g>
					<g>
						<text
							textAnchor="middle"
							x="238.5"
							y="309.05"
							fontFamily="Arial"
							fontSize="13"
							stroke="none"
							strokeWidth="0"
							fill="#444444"
						>
							{maximumDailyUpdates !== 1
								? Math.round((maximumDailyUpdates * 2) / 6)
								: Math.round((maximumDailyUpdates * 2) / 6, 1)}
						</text>
					</g>
					<g>
						<text
							textAnchor="middle"
							x="330"
							y="309.05"
							fontFamily="Arial"
							fontSize="13"
							stroke="none"
							strokeWidth="0"
							fill="#444444"
						>
							{maximumDailyUpdates !== 1
								? Math.round((maximumDailyUpdates * 3) / 6)
								: Math.round((maximumDailyUpdates * 3) / 6, 1)}
						</text>
					</g>
					<g>
						<text
							textAnchor="middle"
							x="421.5"
							y="309.05"
							fontFamily="Arial"
							fontSize="13"
							stroke="none"
							strokeWidth="0"
							fill="#444444"
						>
							{maximumDailyUpdates !== 1
								? Math.round((maximumDailyUpdates * 4) / 6)
								: Math.round((maximumDailyUpdates * 4) / 6, 1)}
						</text>
					</g>
					<g>
						<text
							textAnchor="middle"
							x="513"
							y="309.05"
							fontFamily="Arial"
							fontSize="13"
							stroke="none"
							strokeWidth="0"
							fill="#444444"
						>
							{maximumDailyUpdates !== 1
								? Math.round((maximumDailyUpdates * 5) / 6)
								: Math.round((maximumDailyUpdates * 5) / 6, 1)}
						</text>
					</g>
					<g>
						<text
							textAnchor="middle"
							x="604.5"
							y="309.05"
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
					<th colSpan="2">books added</th>
				</tr>
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
		<div className="book-stats-page-bottom-section">
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

BarChart.propTypes = {
	bookId: PropTypes.string,
	allEditions: PropTypes.bool,
};

export default BarChart;
