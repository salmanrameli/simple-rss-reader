import React, { Component } from 'react';
import Axios from 'axios';
import {getUserId, getAuthCode} from './UserDetails'
import {getProfile, getStream, getEntry, markAsRead} from './Constants'

const Store = window.require('electron-store');
const store = new Store();

class Lists extends Component {
	constructor(props) {
		super(props)

		this.state = {
			lists : this.props.lists,
			activeLink: '',
			oldId: ''
		}

		this.stringToBool = this.stringToBool.bind(this)
		this.handleClick = this.handleClick.bind(this)
		this.removeEntryFromFeed = this.removeEntryFromFeed.bind(this)
		this.markAsRead = this.markAsRead.bind(this)
	}

	componentDidMount() {
		this.setState({
			oldId: ''
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
		let oldId = this.state.oldId

		if(this.state.oldId === '') {
			this.setState({
				oldId: id
			})
		}

		if(oldId !== id) {
			this.setState({
				lists: this.state.lists.filter(function(entry) { 
					return entry.id !== oldId 
				})
			});

			this.setState({
				oldId: id
			})
		}
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
		}).then(response => {}).catch(error => console.log(error))

		let isUnreadOnly = this.stringToBool(store.get('isUnreadOnly', false))

		if(isUnreadOnly)
			this.removeEntryFromFeed(id)
	}

	handleClick = (link, id) => {
		this.props.loadStory(link, id);

		this.setState({
			activeLink: id
		})

		this.markAsRead(id)
	}
	
	render() {
		return (
			<div className="col-md-3 scrollable no-padding-right no-padding-left">
				{this.state.lists.map((item) => (
					<div className={`card list-group-item ${this.state.activeLink === item.id ? 'active' : ''}`} key={item.id}>
						{item.unread === true ? 
							<div className="card-body" onClick={() => this.handleClick(item.canonicalUrl, item.id)}>
								<h6>{item.title}</h6>
								<p className="badge badge-light">{item.author}</p>&nbsp;
								<p className="badge badge-success">Unread Entry</p>
							</div>
							:
							<div className="card-body text-secondary" onClick={() => this.handleClick(item.canonicalUrl, item.id)}>
								<h6>{item.title}</h6>
								<p className="badge badge-light">{item.author}</p>
							</div>
						}
					</div>
				))}
			</div>
		);
	}
}

export default Lists;