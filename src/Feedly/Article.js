import React, { Component } from 'react';
import { css } from '@emotion/core';
import ReactHtmlParser from 'react-html-parser';
import { BarLoader } from 'react-spinners';

const { shell } = window.require('electron')
const WebView = require('react-electron-web-view');

const override = css`
	display: block;
	margin-left: auto;
  	margin-right: auto;
	width: 15%;
`;

class Article extends Component {
	constructor(props) {
		super(props);

		this.state = {
			title: props.title,
			author: props.author,
			date: props.date,
			story: props.story,
			link: props.link,
			display: 'init',
			url: '',
			isLoading: false
		};

		this.handleClick = this.handleClick.bind(this)
		this.openInBrowser = this.openInBrowser.bind(this)
		this.showArticle = this.showArticle.bind(this)
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			title: nextProps.title,
			author: nextProps.author,
			date: nextProps.date,
			story: nextProps.story,
			link: nextProps.link,
			display: 'init'
		});

		if(nextProps.story) {
			this.setState({
				isLoading: true
			});

			setTimeout(() => {
				this.showArticle()
			}, 2000)
		}
	}

	showArticle() {
		this.setState({
			display: 'loaded'
		});
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
			this.state.display === 'loaded' ?
				<div className="col-md-9 no-padding-left no-padding-right scrollable">
					<div className="col-md-12">
						<div className="pb-2 mt-4 mb-2 border-bottom">
							<h2>{this.state.title}</h2>
							<div className="btn-group" role="group" aria-label="options">
								<button type="button" className="btn btn-sm btn-link disabled">By {this.state.author} on {this.state.date}</button>
								<button type="button" className="btn btn-sm btn-link" onClick={() => this.handleClick(this.state.link)}>View Article</button>
								<button type="button" className="btn btn-sm btn-link" onClick={() => this.openInBrowser(this.state.link)}>Open in Browser</button>
							</div>
						</div>
						<div className="row col-md-12 text-justify">
							{ReactHtmlParser(this.state.story)}
							<br></br>
							<br></br>
							<br></br>
						</div>
					</div>
				</div>
				:
				this.state.display === 'webview' ?
					<WebView src = {this.state.url} className = 'webview' />
					:
					<div className="col-md-9 centered">
						<div className="centered-img">
							<BarLoader css={override} color={'#36D7B7'} sizeUnit={"px"} size={15} loading={this.state.isLoading} />
							<h1 style={{ 'color': 'lightgrey', 'text-align': 'center'}}>Article will be shown here</h1>
						</div>
					</div>
			)
	}
}

export default Article;