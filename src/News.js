import React, { Component } from 'react';
import Lists from './Lists';
import Article from './Article';
import {getFeed} from './getFeed'

const Promise = require('bluebird')
const jsonfile = window.require('jsonfile')
const file = 'urlfeed.json'

let date = require('date-and-time');

class News extends Component {
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
	}

	start() {
		let feeds = []

		jsonfile.readFile(file).then((result) => {
			for(let i in result.feeds) {
				feeds.push(result.feeds[i].url)
			}

			Promise.map(feeds, (url) => getFeed(url), {concurrency: 4}).then((feeds) => {
				let merged = [].concat.apply([], feeds)

				for(let i in merged) {
					merged[i].date = date.format(merged[i].date, 'YYYY/MM/DD HH:mm:ss')
				}

				merged.sort(function(a, b) {
					return new Date(b.date) - new Date(a.date);
				})
	
				this.setState({
					lists: merged
				})
			})
		})
	}

	updateStory(link) {
		this.state.lists.filter(story => {
			if(story.link === link) {
				this.setState({
					active_story: story.description
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
					story = {this.state.active_story}
				/>
			</div>
		)
	}
}

export default News;