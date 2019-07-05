import React, { Component } from 'react';
import Lists from './Lists';
import Article from './Article';
import { getFeed } from './getFeed'
import test from './getFeedFeedly'

const Promise = require('bluebird')
const date = require('date-and-time');
const path = require('path')
const fs = window.require('fs');
const remote = window.require('electron').remote;
const app = remote.app;
const applicationDataPath = path.join(app.getPath('appData'), app.getName())
const file = path.join(app.getPath('userData'), "urlfeed.json")

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
		this.checkAppDataExists = this.checkAppDataExists.bind(this)
		this.createJsonFile = this.createJsonFile.bind(this)
	}

	checkAppDataExists() {
		if(!fs.existsSync(applicationDataPath)) {
			fs.mkdir(applicationDataPath)

			console.log("folder creation succeed")
		}
	}

	createJsonFile() {
		const data = {
			feeds: []
		}

		fs.writeFileSync(file, JSON.stringify(data), function(error) {
			if(error) 
				console.log("data creation failed")
			else 
				console.log("data creation succeed")
		})
	}

	componentDidMount() {
		this.checkAppDataExists()

		try {
			fs.readFileSync(file)
		} catch (error) {
			console.log("file not found")

			this.createJsonFile()
		} finally {
			this.start()
		}
	}

	start() {
		let urls = JSON.parse(fs.readFileSync(file))
		let feeds = []

		for(let i in urls.feeds) {
			feeds.push(urls.feeds[i].url)
		}

		test()

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