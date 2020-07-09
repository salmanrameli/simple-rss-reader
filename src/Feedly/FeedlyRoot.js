import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';

import News from './News'
import FeedlySettingRenderer from './FeedlySettingRenderer'

const { ipcRenderer } = window.require('electron')
const Store = window.require('electron-store');
const store = new Store(); 

class FeedlyRoot extends Component {
	constructor(props) {
		super(props)

		this.state = {
			isUnreadOnly: ''
		}

		this.RouteWithSubRoutes = this.RouteWithSubRoutes.bind(this)
		this.handleOnclick = this.handleOnclick.bind(this)
	}

	componentDidMount() {
		this.setState({
			isUnreadOnly: store.get('isUnreadOnly')
		})
	}

	routes = [
		{
			path: "/News",
			component: News
		},
		{
			path: "/FeedlySetting",
			component: FeedlySettingRenderer
		}
	];

	RouteWithSubRoutes(route) {
		return (
			<Route
				path={route.path}
				render={props => (
					<route.component {...props} routes={route.routes} />
				)}
			/>
		);
	}

	handleOnclick(event, arg) {
		switch(arg) {
			case 'unread':
				store.set('isUnreadOnly', true)

				this.setState({
					isUnreadOnly: store.get('isUnreadOnly')
				})

				ipcRenderer.send('refresh')

				break
			case 'all':
				store.set('isUnreadOnly', false)

				this.setState({
					isUnreadOnly: store.get('isUnreadOnly')
				})

				ipcRenderer.send('refresh')

				break
			default:
				store.set('isUnreadOnly', false)

				this.setState({
					isUnreadOnly: store.get('isUnreadOnly')
				})

				ipcRenderer.send('refresh')

				break
		}
	}

	render() {
		return (
			<Router>
				<div className="row frameless-padding draggable" style={{ backgroundColor: '#202429', paddingRight: '15px', paddingLeft: '15px' }}>
					<div className="col-md-12 no-padding-right no-padding-left border-bottom">
						<div className="toolbar-padding">
							<div className="btn-group mr-2" role="group" id="button-group">
								<NavLink to="/News" className="btn btn-outline-light btn-sm" id="newsButton" activeClassName="active">
									<i className="far fa-newspaper"></i> Feeds
								</NavLink>
								<NavLink to="/FeedlySetting" className="btn btn-outline-light btn-sm" id="settingButton" activeClassName="active">
									<i className="fa fa-wrench"></i>
								</NavLink>
							</div>
							<div className="btn-group mr-2 float-right" role="group" id="button-group-2">
								<button type="button" className={`btn btn-outline-light btn-sm ${this.state.isUnreadOnly === true ? "active" : ""}`} onClick={(e) => this.handleOnclick(e, "unread")}>Unread</button>
								<button type="button" className={`btn btn-outline-light btn-sm  ${this.state.isUnreadOnly === true ? "" : "active"}`} onClick={(e) => this.handleOnclick(e, "all")}>All</button>
							</div>
						</div>
					</div>
				</div>
	
				{this.routes.map((route, i) => (
					<this.RouteWithSubRoutes key={i} {...route} />
				))}
	
				<div className="row background" style={{ paddingRight: '15px', paddingLeft: '15px' }}>
					<div className="col-md-12" style={{ height: '100vh' }}>
						<blockquote className="working-center-image blockquote text-center">
							<h1 style={{color: 'black'}} className="lead">Reading furnishes the mind only with materials of knowledge;<br></br>it is thinking that makes what we read ours.</h1>
							<footer className="blockquote-footer"><cite title="Source Title">John Locke</cite></footer>
						</blockquote>
					</div>
				</div>
			</Router>
		);
	}	
}

export default FeedlyRoot