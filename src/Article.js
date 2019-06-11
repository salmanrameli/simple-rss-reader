import React, { Component } from 'react';
import ReactHtmlParser from 'react-html-parser';

class Article extends Component {
	constructor(props) {
		super(props);

		this.state = {
			title: props.title,
			author: props.author,
			date: props.date,
			story: props.story,
			display: 'loading',
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			title: nextProps.title,
			author: nextProps.author,
			date: nextProps.date,
			story: nextProps.story,
			display: 'loaded'
		});

		if(nextProps.story) {
			this.setState({
				display: 'block'
			});
		}
	}

	render() {
		return (
			this.state.display === 'block' ?
				<div className="col-md-9 no-padding-left no-padding-right scrollable">
					<div className="col-md-12">
						<div className="pb-2 mt-4 mb-2 border-bottom">
							<small>{this.state.author}</small>
							<h2>{this.state.title}</h2>
							<small>{this.state.date}</small>
						</div>
						<div className="row col-md-12 text-justify">
							{ReactHtmlParser(this.state.story)}
						</div>
					</div>
				</div>
				:
				<div className="col-md-9 centered">
					<h1 style={{ color: 'lightgray' }}>Article will be shown here</h1>
				</div>
			)
	}
}

export default Article;