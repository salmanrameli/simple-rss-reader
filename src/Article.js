import React, { Component } from 'react';
import { BarLoader } from 'react-spinners';
import ReactHtmlParser from 'react-html-parser';

const WebView = require('react-electron-web-view');

class Article extends Component {
	constructor(props) {
		super(props);

		this.state = {
			story: props.story,
			display: 'none',
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			story: nextProps.story,
			display: 'none'
		});

		if(nextProps.story) {
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
					ReactHtmlParser(this.state.story)
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