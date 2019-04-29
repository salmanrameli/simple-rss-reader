import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Root from './Root';

const render = (Component) => {
	ReactDOM.render(
		<Component />,
		document.getElementById('reactbody'),
	);
};

render(Root);

serviceWorker.unregister();
