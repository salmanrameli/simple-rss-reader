import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';

import News from './News'
import SettingRenderer from './settingRenderer'
import LoginRenderer from './LoginRenderer'

const routes = [
    {
        path: "/News",
        component: News
    },
    {
        path: "/Setting",
        component: SettingRenderer
	},
	{
		path: "/Feedly",
		component: LoginRenderer
	}
];

function RouteWithSubRoutes(route) {
	return (
		<Route
			path={route.path}
			render={props => (
				<route.component {...props} routes={route.routes} />
			)}
		/>
	);
}

class Root extends Component {
	render() {
		return (
			<Router>
				<div className="row frameless-padding draggable" style={{ backgroundColor: '#202429' }}>
					<div className="col-md-12 no-padding-right no-padding-left border-bottom">
						<div className="btn-toolbar toolbar-padding" role="toolbar" aria-label="Button Toolbar">
							<div className="btn-group mr-2" role="group" id="button-group">
								<NavLink to="/News" className="btn btn-outline-light btn-sm" id="newsButton" activeClassName="active">
									<i className="far fa-newspaper"></i> Feeds
								</NavLink>
								<NavLink to="/Setting" className="btn btn-outline-light btn-sm" id="settingButton" activeClassName="active">
									<i className="fa fa-wrench"></i>
								</NavLink>
								<NavLink to="/Feedly" className="btn btn-outline-light btn-sm" id="loginButton" activeClassName="active">
									<i class="fas fa-rss-square"></i> Login to Feedly
								</NavLink>
							</div>
						</div>
					</div>
				</div>
	
				{ routes.map((route, i) => (
					<RouteWithSubRoutes key={i} {...route} />
				))}
	
				<div className="row background">
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

export default Root