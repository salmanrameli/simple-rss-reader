import React, { Component } from 'react';
import Axios from 'axios';
import { getAuthCode } from './UserDetails'
import { markers } from './Constants'
import bg from '../bg.jpg'
import bg2 from '../bg2.png'

const { ipcRenderer } = window.require('electron')
const { shell } = window.require('electron')
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
			isUnreadOnly: ''
		}

		this.stringToBool = this.stringToBool.bind(this)
		this.removeEntryFromFeed = this.removeEntryFromFeed.bind(this)
		this.removeUnreadEntryBadge = this.removeUnreadEntryBadge.bind(this)
		this.markAsRead = this.markAsRead.bind(this)
		this.handleMarkAsRead = this.handleMarkAsRead.bind(this)
		this.handleMarkAsUnread = this.handleMarkAsUnread.bind(this)
		this.handleRemoveEntryFromFeed = this.handleRemoveEntryFromFeed.bind(this)
		this.openInBrowser = this.openInBrowser.bind(this)
	}

	componentDidMount() {
		this.setState({
			oldId: '',
			oldReadId: '',
			isUnreadOnly: store.get('isUnreadOnly', false)
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

	async markAsRead(id, flag) {
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
		}).then(response => {
			let isUnreadOnly = this.stringToBool(this.state.isUnreadOnly)

			if(isUnreadOnly) {
				if(flag) {
					let oldId = this.state.oldId

					if(oldId === '') {
						this.setState({
							oldId: id
						})
					}
			
					if(oldId !== id) {
						this.removeEntryFromFeed(oldId)
		
						this.setState({
							oldId: id
						})
					}
				} else {
					this.removeUnreadEntryBadge(id)
					this.removeEntryFromFeed(id)
				}
			} else {
				this.removeUnreadEntryBadge(id)
			}

			return this.props.markAsRead(id)
		}).catch(error => console.log(error))
	}

	async markAsUnread(id) {
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
		}).then(response => {
			let oldReadId = this.state.oldReadId
	
			if(oldReadId === '') {
				this.setState({
					oldReadId: id
				})
			}
	
			if(oldReadId !== id) {
				return this.props.markAsUnread(id)
			}
		}).catch(error => console.log(error))
	}

	handleMarkAsRead = (event, link, id, flag, isUnread) => {
		if(isUnread === true)
			ipcRenderer.send('decrease-unread-count')

		if(flag) {
			this.props.loadStory(link, id);

			this.setState({
				activeLink: id
			})
		}

		this.markAsRead(id, flag)
	}

	handleRemoveEntryFromFeed(id) {
		this.removeEntryFromFeed(id)
	}

	handleMarkAsUnread = (event, id) => {
		ipcRenderer.send('increase-unread-count')

		this.markAsUnread(id)
	}

	openInBrowser(url) {
		shell.openExternal(url)
	}
	
	render() {
		return (
			<div className="col-md-3 scrollable no-padding-right no-padding-left" >
				{this.state.lists.map((item, index) => (
					<div className={`list-group-item ${this.state.activeLink === item.id ? 'text-white bg-primary' : 'text-dark'}`} key={item.id} >
						<div className="card" style={ this.state.activeLink === item.id ? {} : {backgroundImage: index % 2 === 0 ? `url(${bg})`: `url(${bg2})`, backgroundRepeat: 'repeat'} }>
							<div className={`card-body ${this.state.activeLink === item.id ? "text-white bg-primary" : item.unread === true ? 'text-dark' : 'text-secondary'}`} onClick={(e) => this.handleMarkAsRead(e, item.canonicalUrl, item.id, true, item.unread)} >
								<div style={ this.state.activeLink === item.id ? {color: 'white', padding: '15px'} : {color: 'black', padding: '15px', backgroundColor: 'white', border: '1px solid black', opacity: 1} }>
									<small>{item.origin.title}</small>
									<h6>{item.title}</h6>
									<p className="badge badge-light">{item.author}</p>&nbsp;
									{item.unread === true ? 
										<p className="badge badge-success">Unread Entry</p>
										:
										""
									}
								</div>
							</div>
							{item.unread === true ? 
								<div className="card-footer">
									<div className="btn-group" role="group">
										<button type="button" className="btn btn-light btn-sm text-dark" onClick={(e) => this.handleMarkAsRead(e, item.canonicalUrl, item.id, false, true)}>Mark as Read</button>
										<button type="button" className="btn btn-light btn-sm text-dark" onClick={() => this.openInBrowser(item.canonicalUrl)}>Open in Browser</button>
									</div>
								</div>
								: 
								<div className="card-footer">
									<div className="btn-group" role="group">
										<button type="button" className="btn btn-light btn-sm text-dark" onClick={(e) => this.handleMarkAsUnread(e, item.id)}>Mark as Unread</button>
										<button type="button" className="btn btn-light btn-sm text-dark" onClick={() => this.openInBrowser(item.canonicalUrl)}>Open in Browser</button>
									</div>
								</div>
							}
						</div>
					</div>
				))}
			</div>
		);
	}
}

export default Lists;