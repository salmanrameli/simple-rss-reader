import FeedParser from 'feedparser'
import axios from 'axios'
import stringToStream from 'string-to-stream'

const urlTestFeed = "https://jalopnik.com/rss";

export function getFeed() {
		var feedparser = new FeedParser();

		return axios.get(`${'https://cors-anywhere.herokuapp.com/'}${urlTestFeed}`, {
			responseType: 'stream',
		}).then(response => {
	        stringToStream(response.data).pipe(feedparser)
		}).then(() => {
			var promise = new Promise((resolve, reject) => {
		        const items = []

		        feedparser.on('readable', function () {
					const stream = this
					let item

					while ((item = stream.read())) {
						items.push(item)
					}
		        })

		        feedparser.on('end', () => {
		        	resolve(items)
		        })

		        feedparser.on('error', err => {
		        	reject(err)
		        })
		    })

			return Promise.all([promise]).then(feed => {
				return feed[0]
			}).catch(err => {
				throw err
			})
		}).catch(e => {
			throw new Error()
		});
	}