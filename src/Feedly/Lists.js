import React, { Component } from 'react';
import Axios from 'axios';
import CardXl from './Card/CardXl'
import CardLg from './Card/CardLg'
import CardMd from './Card/CardMd'
import CardSmBlack from './Card/CardSmBlack'
import CardSmWhite from './Card/CardSmWhite'
import { getAuthCode } from './UserDetails'
import { markers } from './Constants'

const { ipcRenderer } = window.require('electron')
const Store = window.require('electron-store');
const store = new Store();

class Lists extends Component {
	constructor(props) {
		super(props)

		this.state = {
			lists : this.props.lists,
			activeLink: '',
			oldId: '',
			oldReadId: '',
			isUnreadOnly: '',
			articleMarkedAsUnread: false,
			isExpanded: true
		}

		this.stringToBool = this.stringToBool.bind(this)
		this.removeEntryFromFeed = this.removeEntryFromFeed.bind(this)
		this.removeUnreadEntryBadge = this.removeUnreadEntryBadge.bind(this)
		this.markAsRead = this.markAsRead.bind(this)
		this.handleMarkAsRead = this.handleMarkAsRead.bind(this)
		this.handleMarkAsUnread = this.handleMarkAsUnread.bind(this)
		this.setListViewMode = this.setListViewMode.bind(this)
		this.handleMaximizeButton = this.handleMaximizeButton.bind(this)
	}

	componentDidMount() {
		this.setState({
			oldId: '',
			oldReadId: '',
			isUnreadOnly: store.get('isUnreadOnly', false),
			articleMarkedAsUnread: false,
			isExpanded: true
		})
	}

	static getDerivedStateFromProps(props, state) {
		return {
			lists: props.lists,
			isExpanded: state.isExpanded
		}
	}

	stringToBool(val) {
		return (val + '').toLowerCase() === 'true';
	}

	removeEntryFromFeed(id) {
		return this.props.onRemove(id)
	}

	removeUnreadEntryBadge(id) {
		return this.props.removeUnreadEntryBadge(id)
	}

	async markAsRead(id, flag, isUnread, openArticle) {
		const authCode = getAuthCode()

		let arrayOfReadEntry = new Array(String(id))

		await Axios({
			method: 'post',
			url: markers(),
			data: {
				"action": "markAsRead",
				"type": "entries",
				"entryIds": arrayOfReadEntry
			},
			headers: {
				"Authorization": authCode,
				"Content-Type": "application/json"
			},
			timeout: 10000
		}).then(response => {
			if(isUnread === true) ipcRenderer.send('decrease-unread-count')

			let isUnreadOnly = this.stringToBool(this.state.isUnreadOnly)

			if(isUnreadOnly) {
				if(flag) {
					let oldId = this.state.oldId
					let articleMarkedAsUnread = this.state.articleMarkedAsUnread

					if(oldId === '') {
						this.setState({
							oldId: id
						})
					}
			
					if(id !== oldId) {
						if(articleMarkedAsUnread) {
							this.setState({
								articleMarkedAsUnread: false
							})
						} else {
							this.removeEntryFromFeed(oldId)
						}

						this.setState({
							oldId: id
						})

						return this.props.markAsRead(id)
					}
				} else {
					this.removeUnreadEntryBadge(id)
					this.removeEntryFromFeed(id)

					return this.props.markAsRead(id)
				}
			} else {
				this.removeUnreadEntryBadge(id)

				return this.props.markAsRead(id)
			}
		}).catch(error => console.log(error))
	}

	async markAsUnread(id, openArticle) {
		const authCode = getAuthCode()

		let arrayOfUnreadEntry = new Array(String(id))

		await Axios({
			method: 'post',
			url: markers(),
			data: {
				"action": "keepUnread",
				"type": "entries",
				"entryIds": arrayOfUnreadEntry
			},
			headers: {
				"Authorization": authCode,
				"Content-Type": "application/json"
			},
			timeout: 10000
		}).then(response => {
			ipcRenderer.send('increase-unread-count')

			this.setState({
				isExpanded: true
			})

			return this.props.markAsUnread(id)
		}).catch(error => console.log(error))
	}

	handleMarkAsRead = (event, link, id, flag, isUnread, openArticle, icon) => {
		if(flag && openArticle) {
			this.props.loadStory(link, id, icon);
	
			this.setState({
				activeLink: id,
				isExpanded: false
			})
		}

		this.markAsRead(id, flag, isUnread, openArticle)
	}

	handleMarkAsUnread = (event, id, openArticle) => {
		this.setState({
			articleMarkedAsUnread: true
		})

		this.markAsUnread(id, openArticle)
	}

	setListViewMode(openArticle) {
		let isExpanded = this.state.isExpanded

		if(isExpanded && !openArticle) {
			this.setState({
				isExpanded: true
			})
		} else {
			this.setState({
				isExpanded: false
			})
		}
	}

	handleMaximizeButton() {
		this.setState({
			isExpanded: true
		})
	}
	
	render() {
		return (
			<div className={`${this.state.isExpanded ? "col-md-12" : "col-md-3"} px-0 scrollable`}>
				<div className="grid-layout">
					{this.state.isExpanded ?
						""
						:
						<div className={"position-fixed button-expand"}>
							<button type="button" className="btn btn-link no-focus p-0" title="Maximize list" onClick={(e) => this.handleMaximizeButton()}>
								<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24">
									<path style={{ fill: 'white' }} d="M8.465 16.95l2.828 3.05h-7.293v-7.293l3.051 2.829 8.484-8.486-2.828-3.05h7.293v7.292l-3.051-2.828z"/>
								</svg>
							</button>
						</div>
					}
					{this.state.lists.map(item => (
						item.engagement >= 2500 ?
							<CardXl
								item = {item}
								activeLink = {this.state.activeLink}
								handleMarkAsRead = {this.handleMarkAsRead}
								handleMarkAsUnread = {this.handleMarkAsUnread}
							/>
							:
							item.engagement > 250 ?
								<CardLg
									item = {item}
									activeLink = {this.state.activeLink}
									handleMarkAsRead = {this.handleMarkAsRead}
									handleMarkAsUnread = {this.handleMarkAsUnread}
								/>
								:
								item.engagement > 100 ?
									<CardMd
										item = {item}
										activeLink = {this.state.activeLink}
										handleMarkAsRead = {this.handleMarkAsRead}
										handleMarkAsUnread = {this.handleMarkAsUnread}
									/>
									:
									item.indexKey % 2 === 0 ?
										<CardSmBlack
											item = {item}
											activeLink = {this.state.activeLink}
											handleMarkAsRead = {this.handleMarkAsRead}
											handleMarkAsUnread = {this.handleMarkAsUnread}
										/>
										:
										<CardSmWhite
											item = {item}
											activeLink = {this.state.activeLink}
											handleMarkAsRead = {this.handleMarkAsRead}
											handleMarkAsUnread = {this.handleMarkAsUnread}
										/>
					))}
				</div>
			</div>
		);
	}
}

export default Lists;