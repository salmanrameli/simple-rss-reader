import React, { Component } from 'react';
import Lists from './Lists';
import Article from './Article';
import {getFeed} from './getFeed'

const Promise = require('bluebird')
const jsonfile = window.require('jsonfile')
const file = 'urlfeed.json'

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
			console.log(result)

			for(let i in result.feeds) {
				feeds.push(result.feeds[i].url)
			}

			Promise.map(feeds, (url) => getFeed(url), {concurrency: 4}).then((feeds) => {
				let merged = [].concat.apply([], feeds)
	
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

export default News;