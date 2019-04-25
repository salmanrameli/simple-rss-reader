import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';
import Root from './Root';

//ReactDOM.render(<App />, document.getElementById('root'));
//ReactDOM.render(<Lists />, document.getElementById('lists'));

const render = (Component) => {
	ReactDOM.render(
		<Component />,
		document.getElementById('reactbody'),
	);
};

render(Root);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
