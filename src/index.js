import React from 'react';
import ReactDOM from 'react-dom';
import * as serviceWorker from './serviceWorker';
import Root from './Root';
import FeedlyRoot from './Feedly/FeedlyRoot'
import Login from './Login'

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
			render(FeedlyRoot)
			break
		default:
			render(Login)
			break
	}
})


serviceWorker.unregister();
