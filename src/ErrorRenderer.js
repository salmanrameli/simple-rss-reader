import React from 'react';
import Error from './Error'

class ErrorRenderer extends React.Component {
	render() {
		return(
			<div className="row">
				<Error />
			</div>
		)
	}
}

export default ErrorRenderer