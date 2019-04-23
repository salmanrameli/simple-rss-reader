const { Menu, dialog, BrowserWindow } = require('electron');
const electron = require('electron');
const app = electron.app

let openSetting = require('./settingWindow')

let settingWindow = null;

const template = [
	{
		label: 'File',
		submenu: [{
			label: 'App Menu Demo',
			click: function(item, focusedWindow) {
				if(focusedWindow) {
					const options = {
						type: 'info',
						title: 'Application Menu Demo',
						buttons: ['Ok'],
						message: 'The result of me lollygagging'
					}
					dialog.showMessageBox(focusedWindow, options, function() {})
				}
			}
		}, {
			label: 'Setting',
			click() {
				openSetting.openSetting(settingWindow)
			}
		}]
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
			{ role: 'pasteandmatchstyle' },
			{ role: 'delete' },
			{ role: 'selectall' }
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
		role: 'window',
		submenu: [
			{ role: 'minimize' },
			{ role: 'close' }
		]
	},
	{
		role: 'help',
		submenu: [
			{
				label: 'Learn More',
				click () { require('electron').shell.openExternal('https://electronjs.org') }
			}
		]
	}
]

if (process.platform === 'darwin') {
	template.unshift({
		label: app.getName(),
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
	})

	template[2].submenu.push(
		{ type: 'separator' },
		{
			label: 'Speech',
			submenu: [
				{ role: 'startspeaking' },
				{ role: 'stopspeaking' }
			]
		}
	)

	template[4].submenu = [
		{ role: 'close' },
		{ role: 'minimize' },
		{ role: 'zoom' },
		{ type: 'separator' },
		{ role: 'front' }
	]
}

require('./settingWindow')

const menu = Menu.buildFromTemplate(template)

Menu.setApplicationMenu(menu)