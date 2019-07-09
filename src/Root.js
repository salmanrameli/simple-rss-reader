import React, { Component } from 'react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';

import News from './News'
import SettingRenderer from './settingRenderer'
import LoginRenderer from './LoginRenderer'
import img from './icon.png'

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
				<div className="row">
					<div className="col-md-12 no-padding-right no-padding-left border-bottom">
						<div className="btn-toolbar toolbar-padding" role="toolbar" aria-label="Button Toolbar">
							<div className="btn-group mr-2" role="group" id="button-group">
								<NavLink to="/News" className="btn btn-outline-primary btn-sm" id="newsButton" activeClassName="active">
									<i className="far fa-newspaper"></i> Feeds
								</NavLink>
								<NavLink to="/Setting" className="btn btn-outline-primary btn-sm" id="settingButton" activeClassName="active">
									<i className="fa fa-wrench"></i>
								</NavLink>
								<NavLink to="/Feedly" className="btn btn-outline-primary btn-sm" id="loginButton" activeClassName="active">
									<i class="fas fa-rss-square"></i> Login to Feedly
								</NavLink>
							</div>
						</div>
					</div>
				</div>
	
				{ routes.map((route, i) => (
					<RouteWithSubRoutes key={i} {...route} />
				))}
	
				<div className="row">
					<div className="col-md-12" style={{ height: '100vh' }}>
						<img src={img} alt="Logo" className="working-center-image" style={{ height: '512px', width: '512px' }}/>
					</div>
				</div>
			</Router>
	
		);
	}	
}

export default Root