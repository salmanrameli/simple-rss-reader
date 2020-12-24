import {getUserId} from './UserDetails'

const isDev = window.require("electron-is-dev");
const Store = window.require('electron-store');
const store = new Store();

const cors = "http://192.168.100.7:8079/"

function getProfile() {
    if(isDev)
        return `${cors}https://cloud.feedly.com/v3/profile`
    else
        return `https://cloud.feedly.com/v3/profile`
}

function getStream() {
    let userId = getUserId()
    let isUnreadOnly = store.get('isUnreadOnly', false)
    let categoryToStream = store.get('activeCategory', 'all')
    let apiUrl = ''

    if(categoryToStream === "all")
        apiUrl = `https://cloud.feedly.com/v3/streams/contents?streamId=user/${userId}/category/global.all&unreadOnly=${isUnreadOnly}&count=180`
    else 
        apiUrl = `https://cloud.feedly.com/v3/streams/contents?streamId=${categoryToStream}&unreadOnly=${isUnreadOnly}&count=180`

    if(isDev)
        return `${cors}${apiUrl}`
    else
        return `${apiUrl}`
}

function getEntry(entryId) {
    let url = encodeURIComponent(entryId)
    
    if(isDev)
        return `${cors}https://cloud.feedly.com/v3/entries/entriesId=${url}`
    else
        return `https://cloud.feedly.com/v3/entries/entriesId=${url}`
}

function markers() {
    if(isDev)
        return `${cors}https://cloud.feedly.com/v3/markers`
    else
        return `https://cloud.feedly.com/v3/markers`
}

function getUnreadCount() {
    if(isDev)
        return `${cors}https://cloud.feedly.com/v3/markers/counts`
    else
        return `https://cloud.feedly.com/v3/markers/counts`
}

function getCategories() {
    if(isDev)
        return `${cors}https://cloud.feedly.com/v3/categories`
    else
        return `https://cloud.feedly.com/v3/categories`
}

export { getProfile, getStream, getEntry, markers, getUnreadCount, getCategories }