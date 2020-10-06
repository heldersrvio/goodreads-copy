import React, { useState } from 'react';
import PropTypes from 'prop-types';
import HomePageTopSection from './HomePageTopSection';

const HomePage = (props) => {
    return (
        <HomePageTopSection signIn={props.signIn} />
    );
};

HomePage.propTypes = {
    signIn: PropTypes.func,
};

export default HomePage;