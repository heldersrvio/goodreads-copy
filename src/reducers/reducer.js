const reducer = (() => {
	const userReducer = (state = {}, action) => {
		switch (action.type) {
			case 'LOGIN':
				localStorage.setItem('userState', JSON.stringify({ ...action.data }));
				return { ...action.data };
			case 'SIGN_OUT':
				localStorage.setItem(
					'userState',
					JSON.stringify({
						userUID: null,
						userInfo: {},
					})
				);
				return {
					userUID: null,
					userInfo: {},
				};
			default:
				return state;
		}
	};

	const login = (userUID, userInfo) => {
		if (userUID === undefined || userInfo === undefined) {
			return signOut();
		}
		return {
			type: 'LOGIN',
			data: {
				userUID,
				userInfo,
			},
		};
	};

	const signOut = () => {
		return {
			type: 'SIGN_OUT',
		};
	};

	return {
		userReducer,
		login,
		signOut,
	};
})();

export default reducer;
