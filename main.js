const {app, BrowserWindow, Menu, dialog} = require('electron')
const path = require('path')
const isDev = require("electron-is-dev");
const { ipcMain } = require('electron')

let win = null
let child = null
let modal = null

function createWindow () {	
	win = new BrowserWindow({
		width: 1280, 
		height: 800,
		'minHeight': 600,
		'minWidth': 960,
		show: false
	})

	const menu = Menu.buildFromTemplate(menubar)
	Menu.setApplicationMenu(menu)
	       
	win.loadURL(
		isDev ? "http://localhost:3000" : `file://${path.join(__dirname, '/build/index.html')}`
	)

	win.once('ready-to-show', () => {
		win.show()
	})
	  
	win.on('closed', function () {
		win = null
	})
}

app.on('ready', createWindow)

app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') app.quit()
})
  
app.on('activate', function () {
	if (win === null) createWindow()
})

ipcMain.on('hello', (event, arg) => {
	if(child === null) {
		child = new BrowserWindow({ 
			parent: win,
			width: 1024, 
			height: 768,
			show: false
		})

		modal = new BrowserWindow({
			parent: win,
			width: 350, 
			height: 70,
			modal: true,
			show: false
		})

		modal.loadFile('./public/loading.html')
		modal.show()

		child.loadURL(arg)

		child.once('ready-to-show', () => {
			child.show()
			modal.hide()
			modal = null
		})
		  
		child.on('closed', function () {
			child = null
		})
	} else {
		child.loadURL(arg)

		modal.loadFile('./public/loading.html')
		modal.show()

		child.once('ready-to-show', () => {
			child.show()
			modal.hide()
			modal = null
		})
		  
		child.on('closed', function () {
			child = null
		})
	}
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
		{ label: 'Return Home', click() { win.loadURL(isDev ? "http://localhost:3000" : `file://${path.join(__dirname, '/build/index.html')}`) } },
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
	  role: 'help',
	  submenu: [
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