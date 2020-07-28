import React, { Component } from 'react';
import ReactHtmlParser from 'react-html-parser';
import { css } from '@emotion/core';
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

			this.showArticle()
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

	async openInBrowser(url) {
		await shell.openExternal(url)
	}

	render() {
		return (
			this.state.display === 'loaded' ?
				<div className="col-md-9 no-padding-left no-padding-right scrollable pt-3 pr-3 pb-3 pl-3 font-monospace">
					<div className="col-md-12 border-gradient">
						<div className="pb-2 mt-4 mb-2">
							<h2 className="clear-before article-title mb-3">
								{this.state.title}<br></br>
								<span className="article-subtitle">
									By {this.state.author} on {this.state.date}.&nbsp;
									<button type="button" title="View Article" className="article-action-button no-focus" onClick={() => this.handleClick(this.state.link)}>
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
											<path d="M22 6v16h-20v-16h20zm2-6h-24v24h24v-24zm-3 7h-18v14h18v-14z"/>
											</svg>
									</button>
									&nbsp;
									<button type="button" title="Open in Browser" className="article-action-button no-focus" onClick={() => this.openInBrowser(this.state.link)}>
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
											<path d="M2.897 4.181c2.43-2.828 5.763-4.181 9.072-4.181 4.288 0 8.535 2.273 10.717 6.554-2.722.001-6.984 0-9.293 0-1.674.001-2.755-.037-3.926.579-1.376.724-2.415 2.067-2.777 3.644l-3.793-6.596zm5.11 7.819c0 2.2 1.789 3.99 3.988 3.99s3.988-1.79 3.988-3.99-1.789-3.991-3.988-3.991-3.988 1.791-3.988 3.991zm5.536 5.223c-2.238.666-4.858-.073-6.293-2.549-1.095-1.891-3.989-6.933-5.305-9.225-1.33 2.04-1.945 4.294-1.945 6.507 0 5.448 3.726 10.65 9.673 11.818l3.87-6.551zm2.158-9.214c1.864 1.734 2.271 4.542 1.007 6.719-.951 1.641-3.988 6.766-5.46 9.248 7.189.443 12.752-5.36 12.752-11.972 0-1.313-.22-2.66-.69-3.995h-7.609z"/>
										</svg>
									</button>
								</span>
							</h2>
						</div>
						<div className="row col-md-12 text-justify mb-3 pr-4 pl-4 news-content">
							{ReactHtmlParser(this.state.story)}
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
							<h1 style={{ 'color': 'lightgrey', 'textAlign': 'center'}}>Article will be shown here</h1>
						</div>
					</div>
			)
	}
}

export default Article;