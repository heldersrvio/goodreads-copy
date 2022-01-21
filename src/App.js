import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import reducer from './reducers/reducer';
import HomePage from './components/Authentication/HomePage';
import Dashboard from './components/Dashboard/Dashboard';
import Firebase from './Firebase';
import firebase from 'firebase/app';
import 'firebase/auth';
import './styles/App.css';

const App = () => {
	const dispatch = useDispatch();
	const user = useSelector((state) => state);

	const [loading, setLoading] = useState(true);

	useEffect(() => {
		const login = async (userUID) => {
			const newUserInfo = await Firebase.modifyUserInfo(userUID);
			dispatch(reducer.login(userUID, newUserInfo));
			setLoading(false);
		};

		const signOut = async () => {
			dispatch(reducer.signOut());
		};

		firebase.auth().onAuthStateChanged((newUser) => {
			if (newUser !== null && user.userUID !== newUser.uid) {
				login(newUser.uid);
			} else if (newUser === null && user.userUID !== null) {
				signOut();
			}
		});
	}, [dispatch, user.userUID]);

	const FirstPage = (props) => {
		if (props.isLoggedIn && !props.loading) {
			return <Dashboard />;
		}
		return <HomePage />;
	};

	return (
		<div className="App">
			<FirstPage isLoggedIn={user.userUID !== null} loading={loading} />
		</div>
	);
};

export default App;
