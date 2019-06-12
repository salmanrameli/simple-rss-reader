import React, { Component } from 'react';
import ReactHtmlParser from 'react-html-parser';
import img from './icon.png'

const { ipcRenderer } = window.require('electron')

class Article extends Component {
	constructor(props) {
		super(props);

		this.state = {
			title: props.title,
			author: props.author,
			date: props.date,
			story: props.story,
			link: props.link,
			display: 'loading',
		};

		this.handleClick = this.handleClick.bind(this)
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			title: nextProps.title,
			author: nextProps.author,
			date: nextProps.date,
			story: nextProps.story,
			link: nextProps.link,
			display: 'loaded'
		});

		if(nextProps.story) {
			this.setState({
				display: 'block'
			});
		}
	}

	handleClick(link) {
		ipcRenderer.send('hello', link)
	}

	render() {
		return (
			this.state.display === 'block' ?
				<div className="col-md-9 no-padding-left no-padding-right scrollable">
					<div className="col-md-12">
						<div className="pb-2 mt-4 mb-2 border-bottom">
							<small>{this.state.author}</small>
							<h2>{this.state.title}</h2>
							<small>
								{this.state.date}<br></br>
								<a href="javascript:void(0);" onClick={() => this.handleClick(this.state.link)}>View article</a>
							</small>
						</div>
						<div className="row col-md-12 text-justify">
							{ReactHtmlParser(this.state.story)}
						</div>
					</div>
				</div>
				:
				<div className="col-md-9 centered">
					<img src={img} alt="Logo" className="centered-img" />
				</div>
			)
	}
}

export default Article;