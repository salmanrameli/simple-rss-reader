import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import Axios from 'axios';
import FeedlyRoot from './Feedly/FeedlyRoot'
import Error from './Error'
import Root from './Root';
import Login from './Login'
import { getAuthCode } from './Feedly/UserDetails'
import { getProfile } from './Feedly/Constants'

const { ipcRenderer } = window.require('electron')

let errorCode = ''
let errorMessage = ''

const render = (Component) => {
	ReactDOM.render(
		<Component errorCode = {errorCode} errorMessage = {errorMessage}/>,
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
				switch(response.status) {
					case 200: 
						render(FeedlyRoot) 
						break
					default: 
						render(Login)
						break
				}
			}).catch(function(error) {
				console.log(error.response)
				errorCode = error.response.status
				errorMessage = error.response.data.errorMessage

				switch(error.response.status) {
					case 401:
						render(Login)
						break
					case 429:
						render(Error)
						break
					default:
						render(Login)
						break
				}
				console.log(error.response.status + " " + error.response.statusText) // 429 Too Many Requests
			})
			break
		default:
			render(Login)
			break
	}
})


serviceWorker.unregister();
