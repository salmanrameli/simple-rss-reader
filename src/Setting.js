import React from 'react';

const fs = window.require('fs');
const jsonfile = window.require('jsonfile')

let file = 'urlfeed.json'

class Setting extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			urlFeeds: [],
			url: '',
		}

		this.start = this.start.bind(this)
		this.saveNewFeedUrl = this.saveNewFeedUrl.bind(this)
		this.deleteFeedUrl = this.deleteFeedUrl.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)
		this.handleUrlEntered = this.handleUrlEntered.bind(this)
	}

	componentDidMount() {
		this.start()
	}

	start = () => {
		this.displayFeedUrls();
	}

	handleUrlEntered = (e) => {
		this.setState({
			url: e.target.value
		})
	}

	handleSubmit = (e) => {
		this.saveNewFeedUrl(e.target.newUrlFeed.value)
	}

	saveNewFeedUrl = (url) => {
		let data = JSON.parse(fs.readFileSync(file))

		let newFeed = {
			url: url
		}

		data.feeds.push(newFeed)

		const json = JSON.stringify(data, null, 2)

		fs.writeFile(file, json, 'utf8', function(error) {
			if(error) {
				console.log(error)
			}
		})
	}

	deleteFeedUrl = (url) => {
		let data = JSON.parse(fs.readFileSync(file))
		let feeds = data.feeds

		data.feeds = feeds.filter((feed) => {
			return feed.url !== url
		})

		fs.writeFileSync(file, JSON.stringify(data, null, 2));

		window.location.reload()
	}

	displayFeedUrls= () => {
		let array = []

		jsonfile.readFile(file).then((result) => {
			for(let i in result.feeds) {
				array.push(result.feeds[i].url)
			}

			this.setState({
				urlFeeds: array
			})
		})
	}

	render() {
		return (
			<div className="col-md-12 scrollable with-padding">
				<div className="page-header">
					<h1>Setting</h1>
					<br></br>
				</div>
				<div className="card">
					<div className="card-body">
						<div className="page-header">
							<h4>Add Feed</h4>
							<hr></hr>
						</div>
						<form id="newFeedForm" onSubmit={this.handleSubmit}>
							<div className="form-group row">
								<label className="col-form-label col-sm-1" htmlFor="newUrlFeed">Url:</label>
								<div className="col-sm-9">
									<input className="form-control" type="text" name="newUrlFeed" placeholder="https://www.example.com/rss.xml" value={this.state.url} onChange={(e) => this.handleUrlEntered(e)} />
								</div>
								<div className="col-sm-2">
									<button className="btn btn-success btn-block" type="submit"><i class="fa fa-plus"></i> Add Feed</button>
								</div>
							</div>
						</form>
					</div>
					<ul className="list-group list-group-flush">
						{this.state.urlFeeds.map((url) => (
							<li className="list-group-item" key={url}>
								{url}
								<button className="btn btn-danger float-right" onClick={() => this.deleteFeedUrl(url)}><i className="fa fa-trash-o"></i> Delete</button>
							</li>
						))}
					</ul>
				</div>
			</div>
		)
	}
}

export default Setting