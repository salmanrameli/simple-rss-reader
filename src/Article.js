import React, { Component } from 'react';
import { BarLoader } from 'react-spinners';
const WebView = require('react-electron-web-view');

class Article extends Component {
	constructor(props) {
		super(props);

		this.state = {
			url: props.url,
			display: 'none',
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			url: nextProps.url,
			display: 'none'
		});

		if(nextProps.url) {
			setTimeout(() => {
				this.setState({
					display: 'block'
				});
			}, 4000)
		}
	}

	render() {
		return (
			<div className="col-md-9 no-padding-left no-padding-right">
				{
				this.state.display === 'block' ?
					<WebView 
						src = {this.state.url}
						className = 'full-size'
						style = {{
							'min-height' : '92vh',
							'min-width' : '100vh',
						}}
					/>
					:
					<div className = 'centered'>
						<BarLoader color = {'#36D7B7'} loading = {true} />
					</div>
				}
			</div>
		)
	}
}

export default Article;