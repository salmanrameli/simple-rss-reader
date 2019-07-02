import FeedParser from 'feedparser'
import axios from 'axios'
import stringToStream from 'string-to-stream'

const isDev = window.require("electron-is-dev");
const CORS_URL = 'https://cors-anywhere.herokuapp.com/'

export async function getFeed(url) {
	let feedparser = new FeedParser();
	let endpoint = null

	try {
		if(isDev) 
			endpoint = `${CORS_URL}${url}`
		else 
			endpoint = url
		
		const response = await axios.get(endpoint);

		stringToStream(response.data).pipe(feedparser);

		let promise = new Promise((resolve, reject) => {
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