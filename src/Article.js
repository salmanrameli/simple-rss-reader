import React, { Component } from 'react';
import { BarLoader } from 'react-spinners';
import ReactHtmlParser from 'react-html-parser';

class Article extends Component {
	constructor(props) {
		super(props);

		this.state = {
			title: props.title,
			writer: props.writer,
			date: props.date,
			story: props.story,
			display: 'none',
		};
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			title: nextProps.title,
			writer: nextProps.writer,
			date: nextProps.date,
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
			<div className="col-md-9 no-padding-left no-padding-right scrollable">
				{
				this.state.display === 'block' ?
					<div className="col-md-12">
						<div className="pb-2 mt-4 mb-2 border-bottom">
							<small>{this.state.writer}</small>
							<h2>{this.state.title}</h2>
							<small>{this.state.date}</small>
						</div>
						<div className="row col-md-12 text-justify">
							{ReactHtmlParser(this.state.story)}
						</div>
					</div>
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