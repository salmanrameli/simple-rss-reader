import React, { Component } from 'react';
import Lists from './Lists';
import Article from './Article';
import { getFeed } from './getFeed'

const fs = window.require('fs');
const Promise = require('bluebird')
const date = require('date-and-time');
const file = 'urlfeed.json'

class News extends Component {
	constructor(props) {
		super(props)

		this.state = {
			lists: [],
			story_title: '',
			story_author: '',
			story_date: '',
			story_link: '',
			active_story: ''
		}

		this.updateStory = this.updateStory.bind(this)
		this.start = this.start.bind(this)
	}

	componentDidMount() {
		this.start()
	}

	start() {
		let urls = JSON.parse(fs.readFileSync(file))
		let feeds = []

		for(let i in urls.feeds) {
			feeds.push(urls.feeds[i].url)
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
	}

	updateStory(link) {
		this.state.lists.filter(story => {
			if(story.link === link) {
				this.setState({
					story_title: story.title,
					story_author: story.author,
					story_date: story.date,
					active_story: story.description,
					story_link: story.link
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
					title = {this.state.story_title}
					author = {this.state.story_author}
					date = {this.state.story_date}
					story = {this.state.active_story}
					link = {this.state.story_link}
				/>
			</div>
		)
	}
}

export default News;