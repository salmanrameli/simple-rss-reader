const {app, BrowserWindow, Menu} = require('electron')
const path = require('path')
const isDev = require("electron-is-dev");
const ipcMain = require('electron').ipcMain
const Store = require('electron-store');
const store = new Store();

let win = null
let winWidth = null
let winHeight = null
let loginWindow = null
let winWasResized = false

let integrateWithFeedly = stringToBool(store.get('integrateWithFeedly', false))
let unreadCount

function createWindow () {
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

	// win.setIcon(path.resolve(`${__dirname}/assets/icon.png`))

	const menu = Menu.buildFromTemplate(menubar)
	Menu.setApplicationMenu(menu)

	unreadCount = 0
	       
	win.loadURL(
		isDev ? "http://localhost:8080" : `file://${path.join(__dirname, '/build/index.html')}`
	)

	win.once('ready-to-show', () => {
		win.show()
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

app.on('ready', createWindow)

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit()
})
  
app.on('activate', function () {
	if (win === null) createWindow()
})

ipcMain.on('asynchronous-message', (event, arg) => {
	let integrationState = store.get('integrateWithFeedly')

	switch(integrationState) {
		case false:
			event.sender.send('asynchronous-reply', 'not integrated')
			break
		case true:
			event.sender.send('asynchronous-reply', 'integrated')
			break
		default:
			event.sender.send('asynchronous-reply', 'init')
			break
	}
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
	  label: 'help',
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