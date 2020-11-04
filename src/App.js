import React, { useState } from 'react';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import Firebase from './Firebase';
import firebase from 'firebase/app';
import 'firebase/auth';
import { useSelector, useDispatch } from 'react-redux';
import reducer from './reducers/reducer';
import './styles/App.css';

const App = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state);

	const [loading, setLoading] = useState(true);

	const login = async (userUID) => {
		const newUserInfo = await Firebase.modifyUserInfo(userUID);
		dispatch(reducer.login(userUID, newUserInfo));
		setLoading(false);
	};

	const signOut = async () => {
		dispatch(reducer.signOut());
	};

	const FirstPage = (props) => {
		if (props.isLoggedIn && !props.loading) {
			return <Dashboard />;
		}
		return <HomePage />;
	};

	firebase.auth().onAuthStateChanged((newUser) => {
		if (newUser !== null && user.userUID !== newUser.uid) {
			login(newUser.uid);
		} else if (newUser === null && user.userUID !== null) {
			signOut();
		}
	});

	return (
		<div className="App">
			<FirstPage isLoggedIn={user.userUID !== null} loading={loading} />
		</div>
	);
};

export default App;
