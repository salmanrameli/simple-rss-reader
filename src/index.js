import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import Axios from 'axios';
import FeedlyRoot from './Feedly/FeedlyRoot'
import Error from './Error'
import Root from './Root';
import Login from './Login'
import { getAuthCode, getFeedlyIntegration } from './Feedly/UserDetails'
import { getProfile } from './Feedly/Constants'

let errorCode = ''
let errorMessage = ''

const render = (Component) => {
	ReactDOM.render(
		<Component errorCode = {errorCode} errorMessage = {errorMessage}/>,
		document.getElementById('reactbody'),
	);
};

const feedlyIntegration = getFeedlyIntegration()

switch(feedlyIntegration) {
	case false:
		render(Root)
		break
	case true:
		const authCode = getAuthCode()
		
		Axios({
			method: 'get',
			url: getProfile(),
			responseType: 'application/json',
			headers: {
				'Authorization': `OAuth ${authCode}`
			},
			timeout: 30000,
		}).then((response) => {
			switch(response.status) {
				case 200: 
					render(FeedlyRoot)
					break
				default: 
					render(Login)
					break
			}
		}).catch(function(error) {
			if(typeof error.response !== "undefined") {
				errorCode = error.response.status
				errorMessage = error.response.data.errorMessage
	
				switch(error.response.status) {
					case 401:
						render(Login)
						break
					case 429: //too many requests
						render(Error)
						break
					default:
						render(Error)
						break
				}
			} else {
				render(Error)
			}
		})

		break
	default:
		render(Login)
		break
}

serviceWorker.unregister();
