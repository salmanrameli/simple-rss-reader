const electron = require('electron')
const {app, BrowserWindow} = require('electron')

function createWindow () {
	let screenSize = electron.screen.getPrimaryDisplay().size;   
	// Create the browser window.     
	win = new BrowserWindow({
		width: 1280, 
		height: 800,
		'minHeight': 600,
    	'minWidth': 960,
	}) 
	       
	// and load the index.html of the app.     
	win.loadURL('http://localhost:3000/')
}      

app.on('ready', () => {
	createWindow()

	//win.webContents.openDevTools()
})