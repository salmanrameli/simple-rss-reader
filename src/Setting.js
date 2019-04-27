import React from 'react';

const fs = window.require('fs');

let ROOT_APP_PATH = fs.realpathSync('.');

let jalopnik = 'https://jalopnik.com/rss'
let gizmodo = 'https://gizmodo.com/rss'
let file = 'urlfeed.json'
 
let feed = {
	name: "jalopnik",
	url: "https://jalopnik.com/rss"
}

let feed2 = {
	name: "gizmodo",
	url: "https://gizmodo.com/rss"
}

class Setting extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			urlFeeds: []
		}

		this.start = this.start.bind(this)
		this.writeFile = this.writeFile.bind(this)
	}

	componentDidMount() {
		this.start()
	}

	start = () => {
		// this.writeFile();
		this.readFile();
	}

	writeFile = () => {
		let data = JSON.parse(fs.readFileSync(file))

		data.feeds.push(feed)

		const json = JSON.stringify(data, null, 2)

		fs.writeFile(file, json, 'utf8', function(error) {
			if(error) {
				console.log(error)
			}
		})
	}

	readFile = () => {
		let data = JSON.parse(fs.readFileSync(file))

		for(let i in data.feeds) {
			console.log(data.feeds[i].url)
		}
	}

	render() {
		return (
			<div className="col-md-12 scrollable with-padding">
				<div className="card">
					<div className="card-header">
						Setting
					</div>
					<div className="card-body">
						<ul>
							{this.state.urlFeeds.map((url) => (
								<li>{url}</li>
							))}
						</ul>
						<form id="newFeedForm">
							<div className="form-group">
								<label className="control-label" htmlFor="add-url">Url Feed</label>
								<input className="form-control" type="text" name="add-url" placeholder="www.example.com/rss.xml" />
							</div>

							<button className="btn btn-primary">Add Feed</button>
						</form>
					</div>
				</div>
			</div>
		)
	}
}

export default Setting