const reducer = (() => {
	const userReducer = (state = {}, action) => {
		switch (action.type) {
			case 'LOGIN':
				return { ...action.data };
			case 'SIGN_OUT':
				return {
					userUID: null,
					userInfo: {},
				};
			default:
				return state;
		}
	};

	const login = (userUID, userInfo) => {
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
