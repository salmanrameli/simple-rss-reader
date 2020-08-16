<p align="center">
  <img src="https://raw.githubusercontent.com/salmanrameli/simple-rss-reader/master/assets/icon_1024x1024x32.png" height="256">
  <h1 align="center">Simple RSS Reader</h1>
</p>


This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Partial Support for Feedly using developer access token
* All articles from all the feeds the user subscribes to
* Option to show unread entries only or all entries
* Mark as read / mark as unread on chosen entry
* Auto mark as read on opened entry
* Choose which category to stream

Click [here](https://feedly.com/v3/auth/dev) to get Feedly developer access token.

*Please note that developer access token is only valid for a month and limited to just 250 API requests per day. After that you have to generate new access token.*

## Screenshots
#### Feedly Mode
![Feedly Login](https://raw.githubusercontent.com/salmanrameli/simple-rss-reader/master/Feedly%20Login.png)

![Feedly Article](https://raw.githubusercontent.com/salmanrameli/simple-rss-reader/master/Feedly%20Article.png)

![Feedly All Entry](https://raw.githubusercontent.com/salmanrameli/simple-rss-reader/master/Feedly%20All.png)

![Feedly Setting](https://raw.githubusercontent.com/salmanrameli/simple-rss-reader/master/Feedly%20Setting.png)

#### RSS Mode

![Article](https://raw.githubusercontent.com/salmanrameli/simple-rss-reader/master/Article.png)

![Setting](https://raw.githubusercontent.com/salmanrameli/simple-rss-reader/master/Setting.png)

## Available Scripts

In the project directory, you can run:

### `npm install` for the first time.
then run
### `yarn start` to start application in development mode.

The electron application will reload if you make edits.<br>
You will also see any lint errors in the console.

### run `yarn build` to build application for distribution – currently only for MacOS and Debian-based Linux distribution.
