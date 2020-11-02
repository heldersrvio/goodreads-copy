import React, { useState, useEffect } from 'react';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import Firebase from './Firebase';
import firebase from 'firebase/app';
import 'firebase/auth';
import './styles/App.css';

const App = () => {
	const [loading, setLoading] = useState(true);
	const [userUID, setUserUID] = useState(null);
	const [userInfo, setUserInfo] = useState({});

	useEffect(() => {
		const updateUserInfo = async () => {
			if (userUID !== null) {
				await Firebase.modifyUserInfo(userUID, setUserInfo);
				setLoading(false);
			}
		};

		updateUserInfo();
	}, [userUID]);

	firebase.auth().onAuthStateChanged((user) => {
		if (user !== null) {
			setUserUID(user.uid);
		} else {
			setUserUID(null);
		}
	});

	const FirstPage = (props) => {
		if (props.isLoggedIn && !props.loading) {
			return <Dashboard userUID={userUID} userInfo={userInfo} />;
		}
		return <HomePage />;
	};

	return (
		<div className="App">
			<FirstPage isLoggedIn={userUID !== null} loading={loading} />
		</div>
	);
};

export default App;
