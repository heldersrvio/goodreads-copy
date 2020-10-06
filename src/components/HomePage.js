import React, { useState } from 'react';
import PropTypes from 'prop-types';
import HomePageTopBar from './HomePageTopBar';

const HomePage = (props) => {
    return (
        <HomePageTopBar signIn={props.signIn} />
    );
};

HomePage.propTypes = {
    signIn: PropTypes.func,
};

export default HomePage;