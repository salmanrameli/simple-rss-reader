import React, { Component } from 'react';
import Axios from 'axios';
import { getAuthCode } from './UserDetails'
import { markers } from './Constants'

const { ipcRenderer } = window.require('electron')
const { shell } = window.require('electron')
const { clipboard } = window.require('electron')
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
			articleMarkedAsUnread: false
		}

		this.stringToBool = this.stringToBool.bind(this)
		this.removeEntryFromFeed = this.removeEntryFromFeed.bind(this)
		this.removeUnreadEntryBadge = this.removeUnreadEntryBadge.bind(this)
		this.markAsRead = this.markAsRead.bind(this)
		this.handleMarkAsRead = this.handleMarkAsRead.bind(this)
		this.handleMarkAsUnread = this.handleMarkAsUnread.bind(this)
		this.copyUrl = this.copyUrl.bind(this)
		this.openInBrowser = this.openInBrowser.bind(this)
	}

	componentDidMount() {
		this.setState({
			oldId: '',
			oldReadId: '',
			isUnreadOnly: store.get('isUnreadOnly', false),
			articleMarkedAsUnread: false
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
			return this.props.markAsUnread(id)
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

	handleMarkAsUnread = (event, id) => {
		ipcRenderer.send('increase-unread-count')

		this.setState({
			articleMarkedAsUnread: true
		})

		this.markAsUnread(id)
	}

	copyUrl(url) {
		clipboard.writeText(url, 'url');
	}

	async openInBrowser(url) {
		await shell.openExternal(url)
	}
	
	render() {
		return (
			<div className="col-md-3 scrollable no-padding-right no-padding-left" >
				{this.state.lists.map(item => (
					<div className={`list-group-item`} key={item.id} >
						<div className={`card ${this.state.activeLink === item.id ? "text-white bg-primary" : item.unread === true ? 'text-dark' : 'text-secondary'}`} onClick={(e) => this.handleMarkAsRead(e, item.canonicalUrl, item.id, true, item.unread)}>
							<div className={`${item.indexKey % 10 === 0 ? 'vw1' : 
												item.indexKey % 10 === 1 ? 'vw2' : 
												item.indexKey % 10 === 2 ? 'vw3' : 
												item.indexKey % 10 === 3 ? 'vw4' :
												item.indexKey % 10 === 4 ? 'vw5' :
												item.indexKey % 10 === 5 ? 'vw6' :
												item.indexKey % 10 === 6 ? 'vw7' : 
												item.indexKey % 10 === 7 ? 'vw8' :
												item.indexKey % 10 === 8 ? 'vw9' : 'vw10'}`}>
								<div style={ this.state.activeLink === item.id ? {color: 'white'} : {color: 'black', opacity: 1} } className="cursor-pointer">
									<header>
										<h2><span>{item.title}</span></h2>
										<div className="title">
											<div className="detail-box">
												{item.origin.title}
											</div>
											{item.unread === true ?
												<span className="text-unread-entry">Unread entry</span>
												:
												""
											}
										</div>
									</header>
									<div className="row">
										<div className="col-6">
											<div className="desc">{item.author}</div>
										</div>
										<div className="col-6">
											<div className="desc">
												{item.unread === true ?
													<div className="actions float-right">
														<button type="button" onClick={(e) => this.handleMarkAsRead(e, item.canonicalUrl, item.id, false, true)} title="Mark article as read" className="pl-2">
															<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
																<path d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
															</svg>
														</button>
														<button type="button" onClick={() => this.openInBrowser(item.canonicalUrl)} title="Open article in browser" className="pl-2">
															<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
																<path d="M2.897 4.181c2.43-2.828 5.763-4.181 9.072-4.181 4.288 0 8.535 2.273 10.717 6.554-2.722.001-6.984 0-9.293 0-1.674.001-2.755-.037-3.926.579-1.376.724-2.415 2.067-2.777 3.644l-3.793-6.596zm5.11 7.819c0 2.2 1.789 3.99 3.988 3.99s3.988-1.79 3.988-3.99-1.789-3.991-3.988-3.991-3.988 1.791-3.988 3.991zm5.536 5.223c-2.238.666-4.858-.073-6.293-2.549-1.095-1.891-3.989-6.933-5.305-9.225-1.33 2.04-1.945 4.294-1.945 6.507 0 5.448 3.726 10.65 9.673 11.818l3.87-6.551zm2.158-9.214c1.864 1.734 2.271 4.542 1.007 6.719-.951 1.641-3.988 6.766-5.46 9.248 7.189.443 12.752-5.36 12.752-11.972 0-1.313-.22-2.66-.69-3.995h-7.609z"/>
															</svg>
														</button>
														<button type="button" onClick={() => this.copyUrl(item.canonicalUrl)} title="Copy URL address" className="pl-2">
															<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
																<path d="M22 6v16h-16v-16h16zm2-2h-20v20h20v-20zm-24 17v-21h21v2h-19v19h-2z"/>
															</svg>
														</button>
													</div>
													:
													<div className="actions float-right">
														<button type="button" onClick={(e) => this.handleMarkAsUnread(e, item.id)} title="Mark article as unread" className="pl-2">
														<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
															<path d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z"/>
														</svg>
														</button>
														<button type="button" onClick={() => this.openInBrowser(item.canonicalUrl)} title="Open article in browser" className="pl-2">
															<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
																<path d="M2.897 4.181c2.43-2.828 5.763-4.181 9.072-4.181 4.288 0 8.535 2.273 10.717 6.554-2.722.001-6.984 0-9.293 0-1.674.001-2.755-.037-3.926.579-1.376.724-2.415 2.067-2.777 3.644l-3.793-6.596zm5.11 7.819c0 2.2 1.789 3.99 3.988 3.99s3.988-1.79 3.988-3.99-1.789-3.991-3.988-3.991-3.988 1.791-3.988 3.991zm5.536 5.223c-2.238.666-4.858-.073-6.293-2.549-1.095-1.891-3.989-6.933-5.305-9.225-1.33 2.04-1.945 4.294-1.945 6.507 0 5.448 3.726 10.65 9.673 11.818l3.87-6.551zm2.158-9.214c1.864 1.734 2.271 4.542 1.007 6.719-.951 1.641-3.988 6.766-5.46 9.248 7.189.443 12.752-5.36 12.752-11.972 0-1.313-.22-2.66-.69-3.995h-7.609z"/>
															</svg>
														</button>
														<button type="button" onClick={() => this.copyUrl(item.canonicalUrl)} title="Copy URL address" className="pl-2">
															<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
																<path d="M22 6v16h-16v-16h16zm2-2h-20v20h20v-20zm-24 17v-21h21v2h-19v19h-2z"/>
															</svg>
														</button>
													</div>
												}
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
				))}
			</div>
		);
	}
}

export default Lists;