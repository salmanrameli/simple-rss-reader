import React, { Component } from 'react';
import Axios from 'axios';
import {getUserId, getAuthCode} from './UserDetails'
import {getProfile, getStream, getEntry, markAsRead} from './Constants'


class Lists extends Component {
	constructor(props) {
		super(props)

		this.state = {
			lists : this.props.lists,
			activeLink: ''
		}

		this.handleClick = this.handleClick.bind(this)
		this.markAsRead = this.markAsRead.bind(this)
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			lists: nextProps.lists
		});
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
						<div className="card-body" onClick={() => this.handleClick(item.canonicalUrl, item.id)}>
							<h6>{item.title}</h6>
							<p className="badge badge-info">{item.author}</p>
						</div>
					</div>
				))}
			</div>
		);
	}
}

export default Lists;