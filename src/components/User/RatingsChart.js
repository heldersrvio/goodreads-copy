import React from 'react';
import PropTypes from 'prop-types';
import '../styles/User/RatingsChart.css';

const RatingsChart = (props) => {
	const ratingCount = Math.max(
		props.fiveRatings +
			props.fourRatings +
			props.threeRatings +
			props.twoRatings +
			props.oneRatings,
		1
	);
	const mostFrequentRating = Math.max(
		props.fiveRatings,
		props.fourRatings,
		props.threeRatings,
		props.twoRatings,
		props.oneRatings
	);

	return (
		<div className="ratings-chart">
			<button
				className="rating-chart-close-button"
				onClick={(_e) => props.closeChart()}
			>
				[close]
			</button>
			<table className="rating-distribution">
				<tbody>
					<tr>
						<th width="25" className="rating-and-star">
							<span>5</span>
							<div className="static-star small full"></div>
						</th>
						<td className="green-bar-container">
							<div
								className="green-bar"
								style={{
									width:
										ratingCount !== 0
											? (props.fiveRatings * 350) / mostFrequentRating
											: 0,
								}}
							></div>
						</td>
						<td width="90" className="rating-percentage-and-absolute">
							{`${
								ratingCount !== 0
									? Math.round((props.fiveRatings * 100) / ratingCount)
									: 0
							}% (${props.fiveRatings})`}
						</td>
					</tr>
					<tr>
						<th width="25" className="rating-and-star">
							<span>4</span>
							<div className="static-star small full"></div>
						</th>
						<td className="green-bar-container">
							<div
								className="green-bar"
								style={{
									width:
										ratingCount !== 0
											? (props.fourRatings * 350) / mostFrequentRating
											: 0,
								}}
							></div>
						</td>
						<td width="90" className="rating-percentage-and-absolute">
							{`${
								ratingCount !== 0
									? Math.round((props.fourRatings * 100) / ratingCount)
									: 0
							}% (${props.fourRatings})`}
						</td>
					</tr>
					<tr>
						<th width="25" className="rating-and-star">
							<span>3</span>
							<div className="static-star small full"></div>
						</th>
						<td className="green-bar-container">
							<div
								className="green-bar"
								style={{
									width:
										ratingCount !== 0
											? (props.threeRatings * 350) / mostFrequentRating
											: 0,
								}}
							></div>
						</td>
						<td width="90" className="rating-percentage-and-absolute">
							{`${
								ratingCount !== 0
									? Math.round((props.threeRatings * 100) / ratingCount)
									: 0
							}% (${props.threeRatings})`}
						</td>
					</tr>
					<tr>
						<th width="25" className="rating-and-star">
							<span>2</span>
							<div className="static-star small full"></div>
						</th>
						<td className="green-bar-container">
							<div
								className="green-bar"
								style={{
									width:
										ratingCount !== 0
											? (props.twoRatings * 350) / mostFrequentRating
											: 0,
								}}
							></div>
						</td>
						<td width="90" className="rating-percentage-and-absolute">
							{`${
								ratingCount !== 0
									? Math.round((props.twoRatings * 100) / ratingCount)
									: 0
							}% (${props.threeRatings})`}
						</td>
					</tr>
					<tr>
						<th width="25" className="rating-and-star">
							<span>1</span>
							<div className="static-star small full"></div>
						</th>
						<td className="green-bar-container">
							<div
								className="green-bar"
								style={{
									width:
										ratingCount !== 0
											? (props.oneRatings * 350) / mostFrequentRating
											: 0,
								}}
							></div>
						</td>
						<td width="90" className="rating-percentage-and-absolute">
							{`${
								ratingCount !== 0
									? Math.round((props.oneRatings * 100) / ratingCount)
									: 0
							}% (${props.oneRatings})`}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
	);
};

RatingsChart.propTypes = {
	fiveRatings: PropTypes.number,
	fourRatings: PropTypes.number,
	threeRatings: PropTypes.number,
	twoRatings: PropTypes.number,
	oneRatings: PropTypes.number,
	closeChart: PropTypes.func,
};

export default RatingsChart;
