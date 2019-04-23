const { BrowserWindow } = require('electron')

module.exports = {
	openSetting: (settingWindow) => {
		if(settingWindow) {
			settingWindow.focus()

			return
		}

		settingWindow = new BrowserWindow({
			width: 640, 
			height: 480,
			'minHeight': 640,
	    	'minWidth': 480,
	    	resizable: false,
	    	title: ''
		})

		settingWindow.loadURL('file://' + __dirname + '/../public/setting.html')

		settingWindow.on('closed', function() {
			settingWindow = null;
		})
	}
}