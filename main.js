const { app, BrowserWindow, Menu } = require('electron')
const Axios = require('axios');
const path = require('path')
const isDev = require("electron-is-dev");
const ipcMain = require('electron').ipcMain
const Store = require('electron-store');
const store = new Store();

let win = null
let loginWindow = null
let loadingWindow = null
let errorWindow = null

let winWidth = null
let winHeight = null
let winWasResized = false

let unreadCount

let integrateWithFeedly = stringToBool(store.get('integrateWithFeedly', false))

function init() {
	createLoadingWindow(createWindow)
}

function createWindow() {
	winWidth = store.get('winWidth')
	winHeight = store.get('winHeight')

	if(winWidth === undefined && winHeight === undefined) {
		winWidth = 1280
		winHeight = 800
	} else {
		winWidth = parseInt(store.get('winWidth'), 10)
		winHeight = parseInt(store.get('winHeight'), 10) 
	}

	win = new BrowserWindow({
		width: winWidth, 
		height: winHeight,
		'minWidth': 960,
		'minHeight': 600,
		show: false,
		titleBarStyle: 'hidden',
		icon: path.resolve(`${__dirname}/assets/icon.png`),
		webPreferences: {
			webviewTag: true,
			nodeIntegration: true
		}
	})

	const menu = Menu.buildFromTemplate(menubar)
	Menu.setApplicationMenu(menu)

	unreadCount = 0
	       
	win.loadURL(
		isDev ? "http://localhost:8080" : `file://${path.join(__dirname, '/build/index.html')}`
	)

	win.once('ready-to-show', () => {
		win.show()

		loadingWindow.hide()
		loadingWindow.close()
	})
	  
	win.on('closed', function () {
		if(winWasResized) {
			store.set('winWidth', winWidth)
			store.set('winHeight', winHeight)
		}

		win = null
	})

	win.on('resize', function() {
		winWasResized = true

		let size = win.getSize()
		winWidth = size[0]
		winHeight = size[1]
	})
}

function createLoadingWindow(callback) {
	loadingWindow = new BrowserWindow({
		width: 250, 
		height: 250,
		frame: false,
		titleBarStyle: 'hidden',
		center: true,
		closable: false,
		maximizable: false,
		minimizable: false,
	});

	loadingWindow.loadURL(
		isDev ? `file://${path.join(__dirname, '/public/loading.html')}` : `file://${path.join(__dirname, '/build/loading.html')}`
	)

	loadingWindow.show()

	const authCode = store.get('authCode')

	Axios({
		method: 'get',
		url: `https://dog.ceo/api/breeds/image/random`,
		responseType: 'application/json',
		timeout: 10000,
	}).then(response => {
		createWindow()
	}).catch(function(error) {
		createErrorWindow()
	})
}

function createErrorWindow() {
	errorWindow = new BrowserWindow({
		width: 800, 
		height: 275,
		frame: false,
		titleBarStyle: 'hidden',
		center: true,
		maximizable: false,
		minimizable: false,
		resizable: false
	});

	errorWindow.loadURL(
		isDev ? `file://${path.join(__dirname, '/public/error.html')}` : `file://${path.join(__dirname, '/build/error.html')}`
		
	)

	errorWindow.show()

	loadingWindow.hide()
	loadingWindow.close()

	errorWindow.on('closed', function () {
		errorWindow = null
	})
}

function createLoginWindow() {
	loginWindow = new BrowserWindow({
		width: 960, 
		height: 640,
	});

	loginWindow.loadURL("https://feedly.com/v3/auth/dev")

	loginWindow.on('closed', function () {
		loginWindow = null
	})
}

function stringToBool(val) {
	return (val + '').toLowerCase() === 'true';
}

function setBadge(num) {
	if(process.platform === 'darwin') {
		let dock = app.dock
	
		if(integrateWithFeedly)
			dock.setBadge('' + num)
		else
			dock.setBadge('')
	}
}

app.on('ready', init)

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit()
})
  
app.on('activate', function () {
	if (loadingWindow === null) createLoadingWindow()
})

ipcMain.on('feedly-integration', (event, arg) => {
	app.relaunch()

	app.exit(0)
})

ipcMain.on('refresh', (event, arg) => {
	app.relaunch()
	
	app.exit(0)
})

ipcMain.on('unread-count', (event, arg) => {
	unreadCount = arg

	setBadge(unreadCount)
})

ipcMain.on('reset-unread-count', (event, arg) => {
	if(process.platform === 'darwin') {
		let dock = app.dock
	
		dock.setBadge('')
	}
})

ipcMain.on('increase-unread-count', (event, arg) => {
	setBadge(++unreadCount)
})

ipcMain.on('decrease-unread-count', (event, arg) => {
	setBadge(--unreadCount)
})

let menubar = [
	...(process.platform === 'darwin' ? [{
	  label: "Simple RSS Reader",
	  submenu: [
		{ role: 'about' },      
		{ type: 'separator' },
		{ role: 'services' },
		{ type: 'separator' },
		{ role: 'hide' },
		{ role: 'hideothers' },
		{ role: 'unhide' },
		{ type: 'separator' },
		{ role: 'quit' }
	  ]
	}] : []),
	{
	  label: 'File',
	  submenu: [
		{ label: 'Open Feedly Sign-In Window', click() { createLoginWindow() } },
		{ type: 'separator' },
		{ label: 'Return Home', click() { win.loadURL(isDev ? "http://localhost:8080" : `file://${path.join(__dirname, '/build/index.html')}`) } },
		{ type: 'separator' },
		process.platform === 'darwin' ? 
		{ role: 'close' } : { role: 'quit' }
	  ]
	},
	{
	  label: 'Edit',
	  submenu: [
		{ role: 'undo' },
		{ role: 'redo' },
		{ type: 'separator' },
		{ role: 'cut' },
		{ role: 'copy' },
		{ role: 'paste' },
		...(process.platform === 'darwin' ? [
		  { role: 'pasteAndMatchStyle' },
		  { role: 'delete' },
		  { role: 'selectAll' },
		  { type: 'separator' },
		  {
			label: 'Speech',
			submenu: [
			  { role: 'startspeaking' },
			  { role: 'stopspeaking' }
			]
		  }
		] : [
		  { role: 'delete' },
		  { type: 'separator' },
		  { role: 'selectAll' }
		])
	  ]
	},
	{
	  label: 'View',
	  submenu: [
		{ role: 'reload' },
		{ role: 'forcereload' },
		{ role: 'toggledevtools' },
		{ type: 'separator' },
		{ role: 'resetzoom' },
		{ role: 'zoomin' },
		{ role: 'zoomout' },
		{ type: 'separator' },
		{ role: 'togglefullscreen' }
	  ]
	},
	{
	  label: 'Window',
	  submenu: [
		{ role: 'minimize' },
		{ role: 'zoom' },
		...(process.platform === 'darwin' ? [
		  { type: 'separator' },
		  { role: 'front' },
		  { type: 'separator' },
		  { role: 'window' }
		] : [
		  { role: 'close' }
		])
	  ]
	},
	{
	  label: 'Help',
	  submenu: [
		{ role: 'about' },
		{
		  label: 'Learn More',
		  click: async () => {
			const { shell } = require('electron')
			await shell.openExternal('https://electronjs.org')
		  }
		}
	  ]
	}
]