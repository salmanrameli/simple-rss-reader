import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

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
				// pass the sub-routes down to keep nesting
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
						<div className="btn-group mr-2" role="group">
							<Link to="/News" className="btn btn-secondary btn-sm">
								News
							</Link>
							<Link to="/Setting" className="btn btn-secondary btn-sm">
								Setting
							</Link>
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