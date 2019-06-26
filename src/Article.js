import React, { Component } from 'react';
import ReactHtmlParser from 'react-html-parser';
import img from './icon.png'

const { shell } = window.require('electron')
const WebView = require('react-electron-web-view');

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
			url: ''
		};

		this.handleClick = this.handleClick.bind(this)
		this.openInBrowser = this.openInBrowser.bind(this)
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

	handleClick(url) {
		this.setState({
			display: 'webview',
			url: url
		});
	}

	openInBrowser(url) {
		shell.openExternal(url)
	}

	render() {
		return (
			this.state.display === 'block' ?
				<div className="col-md-9 no-padding-left no-padding-right scrollable">
					<div className="col-md-12">
						<div className="pb-2 mt-4 mb-2 border-bottom">
							<small>{this.state.author}</small>
							<h2>{this.state.title}</h2>
							<div className="btn-group" role="group" aria-label="options">
								<button type="button" className="btn btn-sm btn-link disabled">{this.state.date}</button>
								<button type="button" className="btn btn-sm btn-link" onClick={() => this.handleClick(this.state.link)}>View Article</button>
								<button type="button" className="btn btn-sm btn-link" onClick={() => this.openInBrowser(this.state.link)}>Open in Browser</button>
							</div>
						</div>
						<div className="row col-md-12 text-justify">
							{ReactHtmlParser(this.state.story)}
						</div>
					</div>
				</div>
				:
				this.state.display === 'webview' ?
					<WebView src = {this.state.url} className = 'webview' />
					:
					<div className="col-md-9 centered">
						<img src={img} alt="Logo" className="centered-img" />
					</div>
			)
	}
}

export default Article;