import React, { Component } from 'react';
import Engagement from '../Engagement';

const { clipboard } = window.require('electron')
const { shell } = window.require('electron')

class CardSmWhite extends Component {
    constructor(props) {
        super(props)

        this.state = {
            item: '',
            activeLink: ''
        }

        this.handleMarkAsRead = this.handleMarkAsRead.bind(this)
        this.handleMarkAsUnread = this.handleMarkAsUnread.bind(this)
        this.copyUrl = this.copyUrl.bind(this)
        this.openInBrowser = this.openInBrowser.bind(this)
    }

    static getDerivedStateFromProps(props, state) {
		return {
            item: props.item,
            activeLink: props.activeLink
		}
    }

    handleMarkAsRead(event, link, id, flag, isUnread, openArticle, icon) {
        return this.props.handleMarkAsRead(event, link, id, flag, isUnread, openArticle, icon)
    }

    handleMarkAsUnread(event, id, openArticle) {
        return this.props.handleMarkAsUnread(event, id, openArticle)
    }

    copyUrl(url) {
		clipboard.writeText(url, 'url');
	}

	async openInBrowser(url) {
		shell.openExternal(url)
    }

    render() {
        return (
            <div className={`card cursor-pointer px-1 pb-0 pt-5 ${this.state.activeLink === this.state.item.id ? "text-white bg-primary" : this.state.item.unread === true ? 'text-dark' : 'text-secondary'}`}>
                <div className="mb-0 p-0 card-body">
                    <div onClick={(e) => this.handleMarkAsRead(e, this.state.item.canonicalUrl, this.state.item.id, true, this.state.item.unread, true, this.state.item.webfeeds ? this.state.item.webfeeds.wordmark !== undefined ? this.state.item.webfeeds.wordmark : this.state.item.webfeeds.logo !== undefined ? this.state.item.webfeeds.logo : null : null)}>
                        <div className="title" title="Article's website origin">
                            <div className="detail-box">
                                {this.state.item.webfeeds !== undefined ?
                                    this.state.item.webfeeds.wordmark !== undefined ?
                                        <img src={this.state.item.webfeeds.wordmark} alt={this.state.item.origin.title} className="article-origin-logo" />
                                        :
                                        this.state.item.webfeeds.logo !== undefined ?
                                            <img src={this.state.item.webfeeds.logo} alt={this.state.item.origin.title} className="article-origin-logo" />
                                            :
                                            this.state.item.origin.title
                                    :
                                    this.state.item.origin.title
                                }
                            </div>
                            {this.state.item.unread === true ?
                                <div>
                                    <hr className="barrier" />
                                    <span>Unread entry</span>
                                </div>
                                :
                                ""
                            }
                        </div>
                        <div className="engagement mb-2" title="Engagement metric shows how popular the article with Feedly readers">
                            <div className="detail-box">
                                <Engagement engagement={this.state.item.engagement} />
                                &nbsp; {this.state.item.engagement}
                            </div>
                        </div>
                        <h2 className="pt-3 pl-1 pr-5">
                            {this.state.item.memes !== undefined ? 
                                <p className="memes-label">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="36" height="24" viewBox="0 0 24 24">
                                        <path className={`${this.state.activeLink === this.state.item.id ? "fill-white" : "fill-black"}`} d="M24 3.875l-6 1.221 1.716 1.708-5.351 5.358-3.001-3.002-7.336 7.242 1.41 1.418 5.922-5.834 2.991 2.993 6.781-6.762 1.667 1.66 1.201-6.002zm0 16.125v2h-24v-20h2v18h22z"/>
                                    </svg>
                                    &nbsp; {this.state.item.memes[0].label}
                                </p>
                                : 
                                ""
                            }
                            {this.state.item.title}
                            <br />
                            <span className={`publish-date ${this.state.activeLink === this.state.item.id ? "text-white" : "text-dark"}`}>{this.state.item.publishedDate}&nbsp;&nbsp;/&nbsp;&nbsp;{this.state.item.publishedTimeDiff}</span>
                        </h2>
                    </div>
                    <footer>
                        <div className="row">
                            <div className="col-12 col-md-7">
                                <div className="desc blockquote-footer" title={this.state.item.author}>{this.state.item.author}</div>
                            </div>
                            <div className="col-12 col-md-5 mx-0">
                                <div className="desc float-right pl-0">
                                    <div className="actions float-right mr-2">
                                        {this.state.item.unread === true ?
                                            <button type="button" onClick={(e) => this.handleMarkAsRead(e, this.state.item.canonicalUrl, this.state.item.id, false, true, false, this.state.item.webfeeds ? this.state.item.webfeeds.wordmark !== undefined ? this.state.item.webfeeds.wordmark : this.state.item.webfeeds.logo !== undefined ? this.state.item.webfeeds.logo : null : null)} title="Mark article as read" className="btn btn-link pl-2 no-focus checkmark-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                    <path className={`${this.state.activeLink === this.state.item.id ? "fill-white" : "fill-black"}`} d="M20.285 2l-11.285 11.567-5.286-5.011-3.714 3.716 9 8.728 15-15.285z"/>
                                                </svg>
                                            </button>
                                            :	
                                            <button type="button" onClick={(e) => this.handleMarkAsUnread(e, this.state.item.id, false)} title="Mark article as unread" className="btn btn-link pl-2 crossmark-icon">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                    <path className={`${this.state.activeLink === this.state.item.id ? "fill-white" : "fill-black"}`} d="M24 20.188l-8.315-8.209 8.2-8.282-3.697-3.697-8.212 8.318-8.31-8.203-3.666 3.666 8.321 8.24-8.206 8.313 3.666 3.666 8.237-8.318 8.285 8.203z" />
                                                </svg>
                                            </button>
                                        }
                                        <button type="button" onClick={() => this.openInBrowser(this.state.item.canonicalUrl)} title="Open article in browser" className="btn btn-link pl-2 no-focus browser-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                <path className={`${this.state.activeLink === this.state.item.id ? "fill-white" : "fill-black"}`} d="M2.897 4.181c2.43-2.828 5.763-4.181 9.072-4.181 4.288 0 8.535 2.273 10.717 6.554-2.722.001-6.984 0-9.293 0-1.674.001-2.755-.037-3.926.579-1.376.724-2.415 2.067-2.777 3.644l-3.793-6.596zm5.11 7.819c0 2.2 1.789 3.99 3.988 3.99s3.988-1.79 3.988-3.99-1.789-3.991-3.988-3.991-3.988 1.791-3.988 3.991zm5.536 5.223c-2.238.666-4.858-.073-6.293-2.549-1.095-1.891-3.989-6.933-5.305-9.225-1.33 2.04-1.945 4.294-1.945 6.507 0 5.448 3.726 10.65 9.673 11.818l3.87-6.551zm2.158-9.214c1.864 1.734 2.271 4.542 1.007 6.719-.951 1.641-3.988 6.766-5.46 9.248 7.189.443 12.752-5.36 12.752-11.972 0-1.313-.22-2.66-.69-3.995h-7.609z"/>
                                            </svg>
                                        </button>
                                        <button type="button" onClick={() => this.copyUrl(this.state.item.canonicalUrl)} title="Copy URL address" className="btn btn-link pl-2 no-focus url-icon">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                                                <path className={`${this.state.activeLink === this.state.item.id ? "fill-white" : "fill-black"}`} d="M6.188 8.719c.439-.439.926-.801 1.444-1.087 2.887-1.591 6.589-.745 8.445 2.069l-2.246 2.245c-.644-1.469-2.243-2.305-3.834-1.949-.599.134-1.168.433-1.633.898l-4.304 4.306c-1.307 1.307-1.307 3.433 0 4.74 1.307 1.307 3.433 1.307 4.74 0l1.327-1.327c1.207.479 2.501.67 3.779.575l-2.929 2.929c-2.511 2.511-6.582 2.511-9.093 0s-2.511-6.582 0-9.093l4.304-4.306zm6.836-6.836l-2.929 2.929c1.277-.096 2.572.096 3.779.574l1.326-1.326c1.307-1.307 3.433-1.307 4.74 0 1.307 1.307 1.307 3.433 0 4.74l-4.305 4.305c-1.311 1.311-3.44 1.3-4.74 0-.303-.303-.564-.68-.727-1.051l-2.246 2.245c.236.358.481.667.796.982.812.812 1.846 1.417 3.036 1.704 1.542.371 3.194.166 4.613-.617.518-.286 1.005-.648 1.444-1.087l4.304-4.305c2.512-2.511 2.512-6.582.001-9.093-2.511-2.51-6.581-2.51-9.092 0z"/>
                                            </svg>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </div>
        )
    }
}

export default CardSmWhite