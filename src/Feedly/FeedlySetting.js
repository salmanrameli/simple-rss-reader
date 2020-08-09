import React, { Component } from 'react'
import { getCategories } from './Constants'
import { getAuthCode } from './UserDetails'
import Axios from 'axios'

const Store = window.require('electron-store')
const store = new Store()
const { ipcRenderer } = window.require('electron')

class FeedlySetting extends Component {
    constructor(props) {
        super(props)

        this.state = {
            categories: [],
            activeCategory: '',
            winWidth: '',
            winHeight: '',
        }

        this.stringToBool = this.stringToBool.bind(this)
        this.logout = this.logout.bind(this)
        this.getFeedlyCategories = this.getFeedlyCategories.bind(this)
        this.handleWindowSizeSetting = this.handleWindowSizeSetting.bind(this)
        this.handleCategoryToStreamChange = this.handleCategoryToStreamChange.bind(this)
    }

    stringToBool(val) {
        return (val + '').toLowerCase() === 'true';
      }

    componentDidMount() {
        this.getFeedlyCategories()

        this.setState({
            winWidth: parseInt(store.get('winWidth', 1280)),
            winHeight: parseInt(store.get('winHeight', 800)),
        })

        ipcRenderer.send('reset-unread-count', 'null')
    }

    logout() {        
        store.set('integrateWithFeedly', false)

        ipcRenderer.send('feedly-integration', 'feedly integration')
    }

    async getFeedlyCategories() {
        const authCode = getAuthCode()

        await Axios({
			method: 'get',
			url: getCategories(),
			responseType: 'application/json',
			headers: {
				'Authorization': `OAuth ${authCode}`
            },
            timeout: 10000
		}).then((response) => {
            this.setState({
                categories: response.data
            })

            let activeCategory = store.get('activeCategory', 'all')
        
            this.setState({
                activeCategory: activeCategory
            })

		}).catch(function(error) {
			console.log(error)
		})
    }

    handleWindowSizeSetting(e) {
        let winWidth = e.target.width.value
        let winHeight = e.target.height.value

        store.set('winWidth', winWidth)
        store.set('winHeight', winHeight)
    }

    handleCategoryToStreamChange(e) {
        this.setState({
            activeCategory: e.target.value
        })

        store.set('activeCategory', e.target.value)
    }

    render() {
        return (
            <div className="row align-items-center full-size" style={{ minHeight: '100vh' }}>
                <div className="col-md-12" style={{ minHeight: '100vh'}}>
                    <div className="card">
                        <div className="bg-setting">
                            <header style={{ height: '100vh' }}>
                                <h2 style={{ fontSize: '4em', marginLeft: '15px' }}>
                                    <span>Application</span>
                                    <span>Setting</span>
                                </h2>
                                <div className="title">
                                    <form onSubmit={this.logout}>
                                        <button type="submit" className="btn btn-link text-white" style={{ padding: '3px' }}>
                                            LOGOUT&nbsp;&nbsp;
                                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style={{ paddingBottom: '4px' }}><path style={{ fill: 'white' }} d="M16 9v-4l8 7-8 7v-4h-8v-6h8zm-16-7v20h14v-2h-12v-16h12v-2h-14z"/></svg>
                                        </button>
                                    </form>
                                </div>
                                <div className="row ml-3 mr-3">
                                    <div className="col-6">
                                        <div className="card-feedly-setting">
                                            <p><b>Feedly categories to stream</b></p>
                                            <form>
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name="exampleRadios" id="all" value="all" checked={this.state.activeCategory === "all"} onChange={e => this.handleCategoryToStreamChange(e)} />
                                                    <label className="form-check-label" htmlFor="all">
                                                        All
                                                    </label>
                                                </div>
                                                {this.state.categories.map((category) => (
                                                <div className="form-check">
                                                    <input className="form-check-input" type="radio" name={category.label} id={category.id} value={category.id} checked={this.state.activeCategory === category.id} onChange={e => this.handleCategoryToStreamChange(e)} />
                                                    <label className="form-check-label" htmlFor={category.label}>
                                                        {category.label}
                                                    </label>
                                                </div>
                                                ))}
                                            </form>
                                        </div>
                                    </div>
                                    <div className="col-6">
                                        <div className="card-feedly-setting">
                                            <form id="windowSizeSetting" onSubmit={this.handleWindowSizeSetting}>
                                                <div className="form-row">
                                                    <div className="form-group col-md-6">
                                                        <label className="form-label" htmlFor="width">Window Width:</label>
                                                        <input className="form-control form-control-lg" type="text" name="width" placeholder={this.state.winWidth} />
                                                    </div>
                                                    <div className="form-group col-md-6">
                                                        <label className="form-label" htmlFor="height">Window Height:</label>
                                                        <input className="form-control form-control-lg" type="text" name="height" placeholder={this.state.winHeight} />
                                                    </div>
                                                    <div className="form-group col-12">
                                                        <p><b>Please reopen window to see the changes</b></p>
                                                    </div>
                                                    <button className="btn btn-outline-success btn-block" type="submit"><i className="fas fa-check"></i> Save</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>
                            </header>
                            <div className="pt-0 pr-3 pl-3">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default FeedlySetting