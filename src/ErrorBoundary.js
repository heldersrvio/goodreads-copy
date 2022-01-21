import React from 'react';
import ErrorPage from './components/Error/ErrorPage';

export default class ErrorBoundary extends React.Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false, error: '', info: '', stack: '' };
	}

	static getDerivedStateFromError(error) {
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		this.setState({ error, info: errorInfo, stack: error.stack });
	}

	render() {
		if (this.state.hasError) {
			return <ErrorPage></ErrorPage>;
		}

		return this.props.children;
	}
}
