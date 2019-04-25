const { BrowserWindow } = require('electron')

module.exports = {
	openSetting: () => {
		// if(settingWindow) {
		// 	settingWindow.focus()

		// 	return
		// }

		let settingWindow = new BrowserWindow({
			width: 640, 
			height: 480,
			'minHeight': 640,
	    	'minWidth': 480,
	    	resizable: false,
	    	title: ''
		})

		settingWindow.webContents.once('dom-ready', () => {
			console.log('preparing to send')
			setTimeout(() => {
				settingWindow.webContents.send('ready')
			}, 3000)
			console.log('sent!')
		})

		settingWindow.loadURL('file://' + __dirname + '/../public/setting.html')

		// settingWindow.on('closed', function() {
		// 	settingWindow = null;
		// })
	}
}