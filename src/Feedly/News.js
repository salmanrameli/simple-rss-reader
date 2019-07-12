import React, { Component } from 'react';
import Lists from './Lists';
import Article from './Article';
import { getUserId, getAuthCode } from './UserDetails'
import { getStream, getUnreadCount } from './Constants'
import Axios from 'axios';

const { ipcRenderer } = window.require('electron')
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

		this.start = this.start.bind(this)
		this.getUnreadCount = this.getUnreadCount.bind(this)
		this.updateStory = this.updateStory.bind(this)
		this.removeUnreadEntryBadge = this.removeUnreadEntryBadge.bind(this)
		this.removeItem = this.removeItem.bind(this)
	}

	componentDidMount() {
		this.start()

		this.getUnreadCount()
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
				lists: merged.map(entry => {
					return {
						...entry,
						articleIsUnread: true
					}
				})
			})		
		}).catch(function(error) {
			console.log(error)
		})
	}

	getUnreadCount() {
		const authCode = getAuthCode()

		Axios({
			method: 'get',
			url: getUnreadCount(),
			responseType: 'application/json',
			headers: {
				'Authorization': `OAuth ${authCode}`
			}
		}).then((response) => {
			let userId = getUserId()

			let unreadCount = response.data.unreadcounts.filter(function(item) { return item.id === `user/${userId}/category/global.all` })

			ipcRenderer.send('unread-count', unreadCount[0].count)
		}).catch(function(error) {
			console.log(error)
		})

		this.setState({
			lists: this.state.lists.map(entry => {
				return {
					...entry,
					articleIsUnread: true
				}
			})
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

	removeItem(id) {
		this.setState({
			lists: this.state.lists.filter(function(entry) {
				return entry.id !== id 
			})
		});
	}

	removeUnreadEntryBadge(id) {
		let array = this.state.lists

		for(let i in array) {
			if(array[i].id === String(id)) {
				if(array[i].unread === true) {
					array[i].unread = false
				}
			}
		}

		this.setState({
			lists: array
		})
	}

	render() {
		return(
			<div className="row">
				<Lists 
					lists = {this.state.lists}
					loadStory = {this.updateStory}
					onRemove = {this.removeItem}
					removeUnreadEntryBadge = {this.removeUnreadEntryBadge}
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