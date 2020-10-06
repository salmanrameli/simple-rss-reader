import React, { Component } from 'react';
import Lists from './Lists';
import Article from '../Article';
import { getUserId, getAuthCode } from './UserDetails'
import { getStream, getUnreadCount } from './Constants'
import Axios from 'axios';

const { ipcRenderer } = window.require('electron')

class News extends Component {
	constructor(props) {
		super(props)

		this.state = {
			lists: [],
			story_title: '',
			story_author: '',
			story_date: '',
			story_link: '',
			active_story: '',
			icon: ''
		}

		this.start = this.start.bind(this)
		this.calculateTimeDiff = this.calculateTimeDiff.bind(this)
		this.getUnreadCount = this.getUnreadCount.bind(this)
		this.updateStory = this.updateStory.bind(this)
		this.removeUnreadEntryBadge = this.removeUnreadEntryBadge.bind(this)
		this.removeItem = this.removeItem.bind(this)
		this.markAsUnread = this.markAsUnread.bind(this)
		this.markAsRead = this.markAsRead.bind(this)
	}

	componentDidMount() {
		this.start()
	}

	calculateTimeDiff(publishedTime) {
		var d = Math.abs(publishedTime - Date.now()) / 1000;                       // delta
		var r = {};                                                                // result
		var s = {                                                                  // structure
			year: 31536000,
			month: 2592000,
			week: 604800, // uncomment row to ignore
			day: 86400,   // feel free to add your own row
			hour: 3600,
			minute: 60,
			second: 1
		};

		Object.keys(s).forEach(function(key){
			r[key] = Math.floor(d / s[key]);
			d -= r[key] * s[key];
		});

		if(r.day > 0) {
			if(r.day === 1) return r.day + " day ago"
			else return r.day + " days ago"
		} else if(r.hour > 0) {
			if(r.hour === 1) return r.hour + " hour ago"
			else return r.hour + " hours ago"
		} else {
			if(r.minute === 1) return r.minute + " minute ago"
			else return r.minute + " minutes ago"
		}
	}

	start() {
		const authCode = getAuthCode()

		Axios({
			method: 'get',
			url: getStream(),
			responseType: 'application/json',
			headers: {
				'Authorization': `OAuth ${authCode}`
			},
			timeout: 10000
		}).then((response) => {
			let merged = [].concat.apply([], response.data.items)
			let randomNumber = Math.floor((Math.random() * 30) + 1)

			this.setState({
				lists: merged.map((entry, index) => {
					let publishedDate = new Date(entry.published)
					let publishedTimeDiff = this.calculateTimeDiff(publishedDate)
					publishedDate = publishedDate.toLocaleString('en-GB', { year: 'numeric', month: 'long', day: 'numeric' })

					return {
						...entry,
						articleIsUnread: true,
						publishedDate: publishedDate,
						publishedTimeDiff: publishedTimeDiff,
						indexKey: parseInt(index + randomNumber, 10)
					}
				})
			})
			
			this.getUnreadCount()
		}).catch(function(error) {
			console.log(error)

			alert(error)
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
			},
			timeout: 10000
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

	updateStory(link, id, icon) {
		this.state.lists.filter(story => {
			let publishedDate = new Date(story.published)
			publishedDate = publishedDate.toLocaleString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

			if(story.id === id) {
				if(story.content && story.content.content) {
					this.setState({
						story_title: story.title,
						story_author: story.author,
						story_date: publishedDate,
						active_story: story.content.content,
						story_link: link,
						icon: icon
					});
				} else if(story.summary && story.summary.content) {
					this.setState({
						story_title: story.title,
						story_author: story.author,
						story_date: publishedDate,
						active_story: story.summary.content,
						story_link: link,
						icon: icon
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

	markAsUnread(id) {
		let array = this.state.lists

		for(let i in array) {
			if(array[i].id === String(id)) {
				if(array[i].unread === false) {
					array[i].unread = true
				}
			}
		}

		this.setState({
			lists: array
		})
	}

	markAsRead(id) {
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
			<div style={{ paddingRight: '15px', paddingLeft: '15px'}}>
				{this.state.lists.length > 0 ? 
					<div className="row" style={{ backgroundColor: '#080808' }}>
						<Lists 
							lists = {this.state.lists}
							loadStory = {this.updateStory}
							onRemove = {this.removeItem}
							removeUnreadEntryBadge = {this.removeUnreadEntryBadge}
							markAsUnread = {this.markAsUnread}
							markAsRead = {this.markAsRead}
						/>
						<Article 
							title = {this.state.story_title}
							author = {this.state.story_author}
							date = {this.state.story_date}
							story = {this.state.active_story}
							link = {this.state.story_link}
							icon = {this.state.icon}
						/>
					</div>
					:
					<div className="row">
						<div className="col-12" style={{ height: '100vh' }}>
							<div className="no-articles-left">
								<h1 style={{ 'color': 'lightgrey', 'textAlign': 'center'}}>There are no unread articles left</h1>
							</div>
						</div>
					</div>
				}
			</div>
		)
	}
}

export default News;