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
							<NavLink to="/Setting" id="settingButton" className="toolbar-button push-pull-button" activeClassName="bg-primary" style={{ color: 'white' }} title="Application Setting">
								<button className="button-component" type="button" title="Application Setting">
									<div className="text">
										<NavLink to="/Setting" id="settingButton" activeClassName="menu-active" style={{ color: 'white' }} title="Application Setting">
											<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path style={{ fill: 'white' }} d="M4.5.257l3.771 3.771c.409 1.889-2.33 4.66-4.242 4.242l-3.771-3.77c-.172.584-.258 1.188-.258 1.792 0 1.602.607 3.202 1.83 4.426 1.351 1.351 3.164 1.958 4.931 1.821.933-.072 1.852.269 2.514.931l9.662 9.662c.578.578 1.337.868 2.097.868 1.661 0 3.001-1.364 2.966-3.03-.016-.737-.306-1.47-.868-2.033l-9.662-9.663c-.662-.661-1.002-1.581-.931-2.514.137-1.767-.471-3.58-1.82-4.93-1.225-1.224-2.825-1.83-4.428-1.83-.603 0-1.207.086-1.791.257zm17.5 20.743c0 .553-.447 1-1 1-.553 0-1-.448-1-1s.447-1 1-1 1 .447 1 1z"/></svg>
										</NavLink>
									</div>
								</button>
							</NavLink>
							<NavLink to="/Feedly" id="loginButton" className="toolbar-button push-pull-button" activeClassName="bg-primary" style={{ color: 'white' }} title="Sign In to Feedly">
								<button className="button-component" type="button" title="Sign In to Feedly">
									<div className="text">
										<NavLink to="/Feedly" id="feedlyButton" activeClassName="menu-active" style={{ color: 'white' }} title="Sign In to Feedly">
											<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"><path style={{ fill: 'white' }} d="M19.5 15c-2.483 0-4.5 2.015-4.5 4.5s2.017 4.5 4.5 4.5 4.5-2.015 4.5-4.5-2.017-4.5-4.5-4.5zm2.5 5h-2v2h-1v-2h-2v-1h2v-2h1v2h2v1zm-7.18 4h-14.815l-.005-1.241c0-2.52.199-3.975 3.178-4.663 3.365-.777 6.688-1.473 5.09-4.418-4.733-8.729-1.35-13.678 3.732-13.678 6.751 0 7.506 7.595 3.64 13.679-1.292 2.031-2.64 3.63-2.64 5.821 0 1.747.696 3.331 1.82 4.5z"/></svg>
										</NavLink>
									</div>
								</button>
							</NavLink>
						</div>				
					</div>
				</div>
	
				{ routes.map((route, i) => (
					<RouteWithSubRoutes key={i} {...route} />
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

export default Root