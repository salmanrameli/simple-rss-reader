import React, { Component } from 'react';
import Lists from './Lists';
import Article from './Article';
import {getAuthCode} from './UserDetails'
import {getProfile, getStream, getEntry, markAsRead} from './Constants'
import Axios from 'axios';

const date = require('date-and-time');

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
		const authCode = getAuthCode()

		Axios({
			method: 'get',
			url: getStream(),
			responseType: 'application/json',
			headers: {
				'Authorization': `OAuth ${authCode}`
			}
		}).then((response) => {
			let merged = [].concat.apply([], response.data.items)

			this.setState({
				lists: merged
			})		
		}).catch(function(error) {
			console.log(error)
		})
	}

	updateStory(link, id) {
		this.state.lists.filter(story => {
			let publishedDate = date.format(new Date(story.published), 'YYYY/MM/DD HH:mm:ss')

			if(story.id === id) {
				if(story.content && story.content.content) {
					this.setState({
						story_title: story.title,
						story_author: story.author,
						story_date: publishedDate,
						active_story: story.content.content,
						story_link: link
					});
				} else if(story.summary && story.summary.content) {
					this.setState({
						story_title: story.title,
						story_author: story.author,
						story_date: publishedDate,
						active_story: story.summary.content,
						story_link: link
					});
				}
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