function getProfile() {
    return `https://cloud.feedly.com/v3/profile`
}

function getStream(userId, isUnreadOnly) {
    return `https://cloud.feedly.com/v3/streams/contents?streamId=user/${userId}/category/global.all&unreadOnly=${isUnreadOnly}`
}

function getEntry(entryId) {
    let url = encodeURIComponent(entryId)
    
    return `https://cloud.feedly.com/v3/entries/entriesId=${url}`
}

export {getProfile, getStream, getEntry}