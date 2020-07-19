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
					<div className="col-md-12 no-padding-right no-padding-left draggable">
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
							<NavLink to="/FeedlySetting" id="settingButton" className="toolbar-button push-pull-button" activeClassName="bg-primary" style={{ color: 'white' }} title="Application Setting">
								<button className="button-component" type="button" title="Application Setting">
									<div className="text">
										<NavLink to="/FeedlySetting" id="settingButton" activeClassName="menu-active" style={{ color: 'white' }} title="Application Setting">
											<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path style={{ fill: 'white' }} d="M17 12.645v-2.289c-1.17-.417-1.907-.533-2.28-1.431-.373-.9.07-1.512.6-2.625l-1.618-1.619c-1.105.525-1.723.974-2.626.6-.9-.374-1.017-1.117-1.431-2.281h-2.29c-.412 1.158-.53 1.907-1.431 2.28h-.001c-.9.374-1.51-.07-2.625-.6l-1.617 1.619c.527 1.11.973 1.724.6 2.625-.375.901-1.123 1.019-2.281 1.431v2.289c1.155.412 1.907.531 2.28 1.431.376.908-.081 1.534-.6 2.625l1.618 1.619c1.107-.525 1.724-.974 2.625-.6h.001c.9.373 1.018 1.118 1.431 2.28h2.289c.412-1.158.53-1.905 1.437-2.282h.001c.894-.372 1.501.071 2.619.602l1.618-1.619c-.525-1.107-.974-1.723-.601-2.625.374-.899 1.126-1.019 2.282-1.43zm-8.5 1.689c-1.564 0-2.833-1.269-2.833-2.834s1.269-2.834 2.833-2.834 2.833 1.269 2.833 2.834-1.269 2.834-2.833 2.834zm15.5 4.205v-1.077c-.55-.196-.897-.251-1.073-.673-.176-.424.033-.711.282-1.236l-.762-.762c-.52.248-.811.458-1.235.283-.424-.175-.479-.525-.674-1.073h-1.076c-.194.545-.25.897-.674 1.073-.424.176-.711-.033-1.235-.283l-.762.762c.248.523.458.812.282 1.236-.176.424-.528.479-1.073.673v1.077c.544.193.897.25 1.073.673.177.427-.038.722-.282 1.236l.762.762c.521-.248.812-.458 1.235-.283.424.175.479.526.674 1.073h1.076c.194-.545.25-.897.676-1.074h.001c.421-.175.706.034 1.232.284l.762-.762c-.247-.521-.458-.812-.282-1.235s.529-.481 1.073-.674zm-4 .794c-.736 0-1.333-.597-1.333-1.333s.597-1.333 1.333-1.333 1.333.597 1.333 1.333-.597 1.333-1.333 1.333z"/></svg>
										</NavLink>
									</div>
								</button>
							</NavLink>
							<div className={`toolbar-button push-pull-button ml-auto ${this.state.isUnreadOnly === true ? "active" : ""}`}>
								<button className="button-component" type="button" onClick={(e) => this.handleOnclick(e, "unread")}>
									<div className="text">
										<a style={{ color: 'white' }}>Unread</a>
									</div>
								</button>
							</div>
							<div className={`toolbar-button push-pull-button ${this.state.isUnreadOnly === true ? "" : "active"}`}>
								<button className="button-component" type="button" onClick={(e) => this.handleOnclick(e, "all")}>
									<div className="text">
										<a style={{ color: 'white' }}>All</a>
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