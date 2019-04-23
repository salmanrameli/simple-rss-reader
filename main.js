const electron = require('electron')
const {app, BrowserWindow, Menu, dialog} = require('electron')

function createWindow () {
	let screenSize = electron.screen.getPrimaryDisplay().size;   
	
	win = new BrowserWindow({
		width: 1280, 
		height: 800,
		'minHeight': 600,
    	'minWidth': 960,
	}) 
	       
	win.loadURL('http://localhost:3000/')
}

app.on('ready', () => {
	require('./src/menu')

	createWindow()
})