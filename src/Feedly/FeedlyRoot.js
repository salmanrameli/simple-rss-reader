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
			case 'refresh':
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
				<div className="row frameless-padding" style={{ backgroundColor: '#202429', paddingRight: '15px', paddingLeft: '15px' }}>
					<div className="col-md-12 no-padding-right no-padding-left">
						<div id="desktop-app-toolbar">
							<NavLink to="/News" id="newsButton" className="toolbar-button push-pull-button" activeClassName="bg-primary" style={{ color: 'white' }} title="Feeds">
								<button className="button-component" type="button" title="Feeds">
									<div className="text">
										<NavLink to="/News" id="newsButton" activeClassName="menu-active" style={{ color: 'white' }} title="Feeds">
											<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path style={{ fill: 'white' }} d="M6.503 20.752c0 1.794-1.456 3.248-3.251 3.248-1.796 0-3.252-1.454-3.252-3.248 0-1.794 1.456-3.248 3.252-3.248 1.795.001 3.251 1.454 3.251 3.248zm-6.503-12.572v4.811c6.05.062 10.96 4.966 11.022 11.009h4.817c-.062-8.71-7.118-15.758-15.839-15.82zm0-3.368c10.58.046 19.152 8.594 19.183 19.188h4.817c-.03-13.231-10.755-23.954-24-24v4.812z"/></svg>
										</NavLink>
									</div>
								</button>
							</NavLink>
							<div className={`toolbar-button push-pull-button`}>
								<button className="button-component" type="button" onClick={(e) => this.handleOnclick(e, "refresh")} title="Refresh">
									<div className="text">
										<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path style={{ fill: 'white' }} d="M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.06-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z"/></svg>
									</div>
								</button>
							</div>
							<NavLink to="/FeedlySetting" id="settingButton" className="toolbar-button push-pull-button" activeClassName="bg-primary" style={{ color: 'white' }} title="Application Setting">
								<button className="button-component" type="button" title="Application Setting">
									<div className="text">
										<NavLink to="/FeedlySetting" id="settingButton" activeClassName="menu-active" style={{ color: 'white' }} title="Application Setting">
											<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path style={{ fill: 'white' }} d="M4.5.257l3.771 3.771c.409 1.889-2.33 4.66-4.242 4.242l-3.771-3.77c-.172.584-.258 1.188-.258 1.792 0 1.602.607 3.202 1.83 4.426 1.351 1.351 3.164 1.958 4.931 1.821.933-.072 1.852.269 2.514.931l9.662 9.662c.578.578 1.337.868 2.097.868 1.661 0 3.001-1.364 2.966-3.03-.016-.737-.306-1.47-.868-2.033l-9.662-9.663c-.662-.661-1.002-1.581-.931-2.514.137-1.767-.471-3.58-1.82-4.93-1.225-1.224-2.825-1.83-4.428-1.83-.603 0-1.207.086-1.791.257zm17.5 20.743c0 .553-.447 1-1 1-.553 0-1-.448-1-1s.447-1 1-1 1 .447 1 1z"/></svg>
										</NavLink>
									</div>
								</button>
							</NavLink>
							<div className={`toolbar-button push-pull-button ml-auto ${this.state.isUnreadOnly === true ? "active" : ""}`}>
								<button className="button-component" type="button" onClick={(e) => this.handleOnclick(e, "unread")}>
									<div className="text">
										<a style={{ color: 'white' }}><b>UNREAD</b></a>
									</div>
								</button>
							</div>
							<div className={`toolbar-button push-pull-button ${this.state.isUnreadOnly === true ? "" : "active"}`}>
								<button className="button-component" type="button" onClick={(e) => this.handleOnclick(e, "all")}>
									<div className="text">
										<a style={{ color: 'white' }}><b>ALL</b></a>
									</div>
								</button>
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