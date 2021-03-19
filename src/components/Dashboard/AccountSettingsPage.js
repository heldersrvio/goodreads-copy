import React, { useState, useEffect } from 'react';
import TopBar from '../Global/TopBar';
import HomePageFootBar from '../Authentication/HomePageFootBar';
import Firebase from '../../Firebase';

const AccountSettingsPage = () => {
	const [loaded, setLoaded] = useState(false);
	const [tab, setTab] = useState('Profile');
};

export default AccountSettingsPage;
