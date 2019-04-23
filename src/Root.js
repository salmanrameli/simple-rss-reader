import React, { Component } from 'react';
import Lists from './Lists';
import Article from './Article';
import axios from 'axios';
import stringToStream from 'string-to-stream'
import {getFeed} from './getFeed'

const FeedParser = require ("feedparser");
const request = require ("request");
const urlTestFeed = "https://www.engadget.com/rss.xml";
axios.defaults.adapter = require('axios/lib/adapters/http');

class Root extends Component {
	constructor(props) {
		super(props)

		this.state = {
			lists: [],
			active_story: ''
		}

		this.updateStory = this.updateStory.bind(this)
		this.start = this.start.bind(this)
	}

	componentDidMount() {
		this.start()

		//window.addEventListener('load', this.start)
	}

	start() {
		getFeed().then(items => {
			this.setState({
				lists: items
			})
		}).catch(errors => {
			console.log("errors: " + errors)
		})
	}

	updateStory(link) {
		this.state.lists.filter(story => {
			if(story.link === link) {
				this.setState({
					active_story: story.link
				});
			}
		});
	}

	render() {
		return(
			<div className="row">
				<Lists 
					lists = {this.state.lists}
					loadStory = {this.updateStory}
				/>
				<Article 
					url = {this.state.active_story}
				/>
			</div>
		)
	}
}

export default Root;