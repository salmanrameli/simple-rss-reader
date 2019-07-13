import React, { Component } from 'react';
import Axios from 'axios';
import { getAuthCode } from './UserDetails'
import { markAsRead } from './Constants'

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
			oldReadId: ''
		}

		this.stringToBool = this.stringToBool.bind(this)
		this.removeEntryFromFeed = this.removeEntryFromFeed.bind(this)
		this.removeUnreadEntryBadge = this.removeUnreadEntryBadge.bind(this)
		this.markAsRead = this.markAsRead.bind(this)
		this.handleMarkAsRead = this.handleMarkAsRead.bind(this)
		this.handleMarkAsUnread = this.handleMarkAsUnread.bind(this)
	}

	componentDidMount() {
		this.setState({
			oldId: '',
			oldReadId: ''
		})
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			lists: nextProps.lists
		});
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

	async markAsRead(id) {
		const authCode = getAuthCode()

		let arrayOfReadEntry = new Array(String(id))

		await Axios({
			method: 'post',
			url: markAsRead(),
			data: {
				"action": "markAsRead",
				"type": "entries",
				"entryIds": arrayOfReadEntry
			},
			headers: {
				"Authorization": authCode,
				"Content-Type": "application/json"
			},
		}).then(response => {
			let isUnreadOnly = this.stringToBool(store.get('isUnreadOnly', false))

			if(isUnreadOnly) {
				let oldId = this.state.oldId
	
				if(oldId === '') {
					this.setState({
						oldId: id
					})

					ipcRenderer.send('decrease-unread-count')
				}
		
				if(oldId !== id) {
					this.removeEntryFromFeed(oldId)
	
					this.setState({
						oldId: id
					})

					ipcRenderer.send('decrease-unread-count')
				}
			} else {
				this.removeUnreadEntryBadge(id)
			}
		}).catch(error => console.log(error))
	}

	async markAsUnread(id) {
		const authCode = getAuthCode()

		let arrayOfUnreadEntry = new Array(String(id))

		await Axios({
			method: 'post',
			url: markAsRead(),
			data: {
				"action": "keepUnread",
				"type": "entries",
				"entryIds": arrayOfUnreadEntry
			},
			headers: {
				"Authorization": authCode,
				"Content-Type": "application/json"
			},
		}).then(response => {
			let oldReadId = this.state.oldReadId
	
			if(oldReadId === '') {
				this.setState({
					oldReadId: id
				})
			}
	
			if(oldReadId !== id) {
				ipcRenderer.send('increase-unread-count')

				return this.props.markAsUnread(id)
			}
		}).catch(error => console.log(error))
	}

	handleMarkAsRead = (event, link, id, flag) => {
		event.preventDefault()

		this.props.loadStory(link, id);

		this.setState({
			activeLink: id
		})

		this.markAsRead(id)
	}

	handleMarkAsUnread = (event, id) => {
		event.preventDefault()

		this.markAsUnread(id)
	}
	
	render() {
		return (
			<div className="col-md-3 scrollable no-padding-right no-padding-left">
				{this.state.lists.map((item) => (
					<div className={`card list-group-item ${this.state.activeLink === item.id ? 'text-white bg-primary' : ''}`} key={item.id}>
						<div className={`card-body ${item.unread === true ? "text-dark" : this.state.activeLink === item.id ? 'text-white' : 'text-secondary'}`} onClick={(e) => this.handleMarkAsRead(e, item.canonicalUrl, item.id, 'read')}>
							<h6>{item.title}</h6>
							<p className="badge badge-light">{item.author}</p>&nbsp;
							{item.unread === true ? 
								<p className="badge badge-success">Unread Entry</p>
								:
								""
							}
						</div>
						{item.unread === true ? 
							""
							: 
							<div className="card-footer">
								<button type="button" className="btn btn-link btn-sm text-dark" onClick={(e) => this.handleMarkAsUnread(e, item.id)}>Mark as Unread</button>
							</div>
						}
					</div>
				))}
			</div>
		);
	}
}

export default Lists;