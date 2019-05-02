import React from 'react';
import { BrowserRouter as Router, Route, NavLink } from 'react-router-dom';

import News from './News'
import SettingRenderer from './settingRenderer'

const routes = [
    {
        path: "/News",
        component: News
    },
    {
        path: "/Setting",
        component: SettingRenderer
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

function Root() {
	return (
		<Router>
			<div className="row">
				<div className="col-md-12 no-padding-right no-padding-left border-bottom">
					<div className="btn-toolbar toolbar-padding" role="toolbar" aria-label="Button Toolbar">
						<div className="btn-group mr-2" role="group" id="button-group">
							<NavLink to="/News" className="btn btn-outline-primary btn-sm" id="newsButton" activeClassName="active">
							<i className="fa fa-newspaper-o"></i> Feeds
							</NavLink>
							<NavLink to="/Setting" className="btn btn-outline-primary btn-sm" id="settingButton" activeClassName="active">
							<i className="fa fa-wrench"></i>
							</NavLink>
						</div>
					</div>
				</div>
			</div>

			{ routes.map((route, i) => (
				<RouteWithSubRoutes key={i} {...route} />
			))}
		</Router>

	);
}

export default Root