import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import Axios from 'axios';
import Root from './Root';
import FeedlyRoot from './Feedly/FeedlyRoot'
import Login from './Login'
import { getAuthCode } from './Feedly/UserDetails'
import { getProfile } from './Feedly/Constants'

const { ipcRenderer } = window.require('electron')

const render = (Component) => {
	ReactDOM.render(
		<Component />,
		document.getElementById('reactbody'),
	);
};

ipcRenderer.send('asynchronous-message', 'ping')

ipcRenderer.on('asynchronous-reply', (event, reply) => {
	switch(reply) {
		case 'not integrated':
			render(Root)
			break
		case 'integrated':
			const authCode = getAuthCode()
			
			Axios({
				method: 'get',
				url: getProfile(),
				responseType: 'application/json',
				headers: {
					'Authorization': `OAuth ${authCode}`
				}
			}).then((response) => {
				if(response.status === 200)
					render(FeedlyRoot)
				else
					render(Login)
			}).catch(function(error) {
				console.log(error)
			})
			break
		default:
			render(Login)
			break
	}
})


serviceWorker.unregister();
