import React, { useState } from 'react';
import { format } from 'date-fns'; 
import PropTypes from 'prop-types';
import '../styles/User/EditableBookshelfDateField.css';

const EditableBookshelfDateField = (props) => {
    const [year, setYear] = useState(props.initialDate !== undefined ? props.initialDate.getFullYear().toString() : '');
    const [month, setMonth] = useState(props.initialDate !== undefined ? props.initialDate.getMonth().toString() : '');
    const [day, setDay] = useState(props.initialDate !== undefined ? props.initialDate.getDate().toString() : '');
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const setDateToToday = () => {
        setYear((new Date()).getFullYear().toString());
        setMonth((new Date()).getMonth().toString());
        setDay((new Date()).getDate().toString());
    };

    return (
        <div className="editable-bookshelf-date-field">
            <span
                className={
                    props.initialDate === undefined ? 'no-date-span' : ''
                }
            >
                {props.initialDate !== undefined
                    ? format(props.initialDate, 'MMM dd, yyyy')
                    : 'not set'}
            </span>
            <button className="edit-button" onClick={(_e) => setIsPopupVisible((previous) => !previous)}>[edit]</button>
            {!isLoading ? <div className={isPopupVisible ? 'set-date-popup' : 'set-date-popup hidden'}>
                <div className="popup-top-section">
                    <select className="year-select" value={year} onChange={(e) => setYear(e.target.value)}>
                        <option value=""></option>
                        {Array(101)
							.fill(0)
							.map((_value, index) => (new Date().getFullYear() - 100 + (100 - index)).toString())
							.map((year, index) => {
								return (
									<option value={year} key={index}>
										{year}
									</option>
								);
							})}
                    </select>
                    <select className="month-select" value={month} onChange={(e) => setMonth(e.target.value)}>
                        <option value=""></option>
                        <option value="0">January</option>
                        <option value="1">February</option>
                        <option value="2">March</option>
                        <option value="3">April</option>
                        <option value="4">May</option>
                        <option value="5">June</option>
                        <option value="6">July</option>
                        <option value="7">August</option>
                        <option value="8">September</option>
                        <option value="9">October</option>
                        <option value="10">November</option>
                        <option value="11">December</option>
                    </select>
                    <select className="day-select" value={day} onChange={(e) => setDay(e.target.value)}>
                        <option value=""></option>
						{Array(31)
							.fill(0)
							.map((_value, index) => (
								<option key={index} value={(index + 1).toString()}>
									{index + 1}
								</option>
							))}
                    </select>
                    <button className="set-to-today-button" onClick={(_e) => setDateToToday()}>set to today</button>
                </div>
                <div className="popup-bottom-section">
                    <div className="left-section">
                        <button className="save-button" onClick={(_e) => {
                            setIsLoading(true);
                            if (year.length > 0 && month.length > 0 && day.length > 0) {
                                props.save(new Date(parseInt(year), parseInt(month), parseInt(day)));
                            }
                            setIsLoading(false);
                        }}>Save</button>
                        <button className="cancel-button" onClick={(_e) => setIsPopupVisible(false)}>cancel</button>
                    </div>
                    <button className="cancel-button" onClick={(_e) => setIsPopupVisible(false)}>close</button>
                </div>
            </div> : 
            <div className="editable-bookshelf-date-field">
                <img
                    className="saving-date-spinner"
                    src="https://s.gr-assets.com/assets/loading-trans-ced157046184c3bc7c180ffbfc6825a4.gif"
                    alt="loading"
                />
                <span className="saving-span">saving...</span>
            </div>
            }
        </div>
    );
};

EditableBookshelfDateField.propTypes = {
    initialDate: PropTypes.objectOf(Date),
    save: PropTypes.func,
};

export default EditableBookshelfDateField;