import {getProfile, getStream, getEntry} from './Constants'
import {getUserId, getAuthCode} from './UserDetails'
import Axios from 'axios';

const authCode = getAuthCode()
const userId = getUserId()

export default async function getFeedFeedly() {
    await Axios({
		method: 'get',
		url: getStream(userId, false),
		responseType: 'application/json',
		headers: {
			'Authorization': `OAuth ${authCode}`
		}
	}).then(function(response) {
		console.log(response.data)
	}).catch(function(error) {
		console.log(error)
	})
}