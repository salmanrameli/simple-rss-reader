const electron = require('electron')
const {app, BrowserWindow, Menu, dialog} = require('electron')

function createWindow () {	
	win = new BrowserWindow({
		width: 1280, 
		height: 800,
		'minHeight': 600,
		'minWidth': 960,
		titleBarStyle: 'hidden'
	}) 
	       
	win.loadURL('http://localhost:3000/')
}

app.on('ready', () => {
	require('./src/menu')

	createWindow()
})