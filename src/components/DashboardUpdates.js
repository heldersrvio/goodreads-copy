import React from 'react';
import PropTypes from 'prop-types';

const DashboardUpdates = () => {
    //TODO: Everything
    return (
        <div id="dashboard-updates">
            <div id="dashboard-updates-top-bar">
                <h2 id="dashboard-shelf-updates-h2">UPDATES</h2>
                <button id="customize-updates-button">
                    <img src="https://www.goodreads.com/assets/gr/icons/settings_cog-2acb8771e16e7cf04aa082503f1be885.svg" alt="gear"></img>
                    <span>Customize</span>
                </button>
            </div>
            <div id="dashboard-updates-updates">
                {}
            </div>
        </div>
    );
};

DashboardUpdates.propTypes = {
    queryUpdates: PropTypes.func,
};

export default DashboardUpdates;