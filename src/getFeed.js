import FeedParser from 'feedparser'
import axios from 'axios'
import stringToStream from 'string-to-stream'

let CORS_URL = 'https://cors-anywhere.herokuapp.com/'

export async function getFeed(url) {
	var feedparser = new FeedParser();

	try {
		const response = await axios.get(`${CORS_URL}${url}`, {
			responseType: 'stream',
			crossDomain: true
		}, {
			headers: {
				'Access-Control-Allow-Origin': '*',
				'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
				'Origin': 'http://localhost:3000'
			}
		});

		stringToStream(response.data).pipe(feedparser);

		var promise = new Promise((resolve, reject) => {
			const items = [];

			feedparser.on('readable', function () {
				const stream = this;
				let item;
				while ((item = stream.read())) {
					items.push(item);
				}
			});

			feedparser.on('end', () => {
				resolve(items);
			});

			feedparser.on('error', err => {
				reject(err);
			});
		});

		try {
			const feed = await Promise.all([promise]);
			return feed[0];
		} catch (err) {
			throw err;
		}
	} catch (e) {
		throw new Error();
	}
}