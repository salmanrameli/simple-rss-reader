import React from 'react';

const { shell } = window.require('electron')
const path = require('path')
const fs = window.require('fs');
const remote = window.require('electron').remote;
const app = remote.app;
const applicationDataPath = path.join(app.getPath('appData'), app.getName())
const file = path.join(app.getPath('userData'), "urlfeed.json")

class Setting extends React.Component {
	constructor(props) {
		super(props)

		this.state = {
			urlFeeds: [],
			url: '',
		}

		this.displayFeedUrls = this.displayFeedUrls.bind(this)

		this.handleUrlEntered = this.handleUrlEntered.bind(this)
		this.handleSubmit = this.handleSubmit.bind(this)

		this.saveNewFeedUrl = this.saveNewFeedUrl.bind(this)
		this.deleteFeedUrl = this.deleteFeedUrl.bind(this)
		this.checkAppDataExists = this.checkAppDataExists.bind(this)
		this.createJsonFile = this.createJsonFile.bind(this)
		this.findJsonFile = this.findJsonFile.bind(this)
		this.openInBrowser = this.openInBrowser.bind(this)
	}

	componentDidMount() {
		this.displayFeedUrls();
	}

	handleUrlEntered = (e) => {
		this.setState({
			url: e.target.value
		})
	}

	handleSubmit = (e) => {
		e.preventDefault()

		if(e.target.newUrlFeed.value !== '') {
			this.saveNewFeedUrl(e.target.newUrlFeed.value)
		}

		this.displayFeedUrls()
	}

	saveNewFeedUrl = (url) => {
		let data = JSON.parse(fs.readFileSync(file))
		let https = "https://"
        let https_url

        if(url.substring(0, 8) !== "https://") {
            if(url.substring(0, 7) === "http://") {
                let url_substring = url.substr(7)

                https_url = https.concat(url_substring)
            } else {
                https_url = https.concat(url)
            }
        } else {
            https_url = url
        }

		let newFeed = {
			url: https_url
		}

		data.feeds.push(newFeed)

		const json = JSON.stringify(data, null, 2)

		fs.writeFileSync(file, json, 'utf8', function(error) {
			if(error) {
				console.log(error)
			}
		})

		this.setState({
			url: ''
		})
	}

	deleteFeedUrl = (e, url) => {
		e.preventDefault()

		let data = JSON.parse(fs.readFileSync(file))
		let feeds = data.feeds

		data.feeds = feeds.filter((feed) => {
			return feed.url !== url
		})

		fs.writeFileSync(file, JSON.stringify(data, null, 2));

		this.displayFeedUrls()
	}

	checkAppDataExists() {
		if(!fs.existsSync(applicationDataPath)) {
			fs.mkdir(applicationDataPath)

			console.log("folder creation succeed")
		}
	}

	createJsonFile() {
		const data = {
			feeds: []
		}

		fs.writeFileSync(file, JSON.stringify(data), function(error) {
			if(error) 
				console.log("data creation failed")
			else 
				console.log("data creation succeed")
		})
	}

	findJsonFile() {
		let urls = JSON.parse(fs.readFileSync(file))
		let array = []

		for(let i in urls.feeds) {
			array.push(urls.feeds[i].url)
		}

		this.setState({
			urlFeeds: array
		})
	}

	displayFeedUrls= () => {
		this.checkAppDataExists()

		try {
			fs.readFileSync(file)
		} catch (error) {
			console.log("file not found")

			this.createJsonFile()
		} finally {
			this.findJsonFile()
		}
	}

	openInBrowser(url) {
		shell.openExternal(url)
	}

	render() {
		return (
			<div className="col-md-12 scrollable with-padding">
				<div className="pb-2 mt-4 mb-2">
					<h1>Setting</h1>
				</div>
				<div className="card">
					<div className="card-body">
						<form id="newFeedForm" onSubmit={(e) => this.handleSubmit(e)}>
							<div className="form-group row">
								<label className="col-form-label col-sm-1" htmlFor="newUrlFeed">Url:</label>
								<div className="col-sm-9">
									<input className="form-control" type="text" name="newUrlFeed" placeholder="https://www.example.com/rss.xml" value={this.state.url} onChange={(e) => this.handleUrlEntered(e)} />
								</div>
								<div className="col-sm-2">
									<button className="btn btn-success btn-block" type="submit"><i className="fa fa-plus"></i> Add Feed</button>
								</div>
							</div>
						</form>
					</div>
				</div>
				<br></br>
				<div className="card">
					<div className="card-body">
						<div className="pb-1 mb-1">
								<h4>Feeds you're subscribing to:</h4>
						</div>
						<table className="table">
							<tbody>
								{this.state.urlFeeds.map((url) => (
									<tr>
										<td className="align-middle">
											<a href="javascript:void(0);" 
												onClick={() => this.openInBrowser(url)}><span class="align-middle">{url}</span>
											</a>
											<button className="btn btn-danger float-right" 
													onClick={(e) => this.deleteFeedUrl(e, url)}>
														<i className="fa fa-trash-o"></i> Delete
												</button>
										</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		)
	}
}

export default Setting