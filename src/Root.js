import React from 'react';
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
				<route.component {...props} routes={route.routes} />
			)}
		/>
	);
}

function removeClass() {
	document.getElementById("newsButton").classList.remove("active")
	document.getElementById("settingButton").classList.remove("active")
}

function onNewsButtonClicked() {
	removeClass()

	document.getElementById("newsButton").classList.add("active")
}

function onSettingButtonClicked() {
	removeClass()

	document.getElementById("settingButton").classList.add("active")
}

function Root() {
	return (
		<Router>
			<div className="row">
				<div className="col-md-12 no-padding-right no-padding-left border-bottom">
					<div className="btn-toolbar toolbar-padding" role="toolbar" aria-label="Button Toolbar">
						<div className="btn-group mr-2" role="group" id="button-group">
							<Link to="/News" className="btn btn-outline-primary btn-sm" id="newsButton" onClick={onNewsButtonClicked}>
							<i className="fa fa-newspaper-o"></i> Feeds
							</Link>
							<Link to="/Setting" className="btn btn-outline-primary btn-sm" id="settingButton" onClick={onSettingButtonClicked}>
							<i className="fa fa-wrench"></i> Setting
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