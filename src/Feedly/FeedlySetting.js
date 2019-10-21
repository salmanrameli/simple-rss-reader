import React, { Component } from 'react'
import { getCategories } from './Constants'
import { getAuthCode } from './UserDetails'
import Axios from 'axios'
import bg from './bg2.png'

const Store = window.require('electron-store')
const store = new Store()
const { ipcRenderer } = window.require('electron')

class FeedlySetting extends Component {
    constructor(props) {
        super(props)

        this.state = {
            categories: [],
            activeCategory: ''
        }

        this.stringToBool = this.stringToBool.bind(this)
        this.logout = this.logout.bind(this)
        this.getFeedlyCategories = this.getFeedlyCategories.bind(this)
        this.handleCategoryToStreamChange = this.handleCategoryToStreamChange.bind(this)
    }

    stringToBool(val) {
        return (val + '').toLowerCase() === 'true';
      }

    componentDidMount() {
        this.getFeedlyCategories()
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
			}
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

    handleCategoryToStreamChange(e) {
        this.setState({
            activeCategory: e.target.value
        })

        store.set('activeCategory', e.target.value)
    }

    render() {
        return (
            <div className="row full-size">
                <div className="col-md-12" style={{ backgroundImage: `url(${bg})`, backgroundRepeat: 'repeat' }}>
                    <div className="row" style={{padding: '50px 30px 50px 30px'}}>
                        <div className="col-md-12">
                            <div className="card-columns">
                                <div className="card">
                                    <div className="card-header">
                                        <h5>Your categories to stream:</h5>
                                    </div>
                                    <div className="card-body overflow-auto">
                                        <div className="overflow-auto p-3 mb-3 mb-md-0 mr-md-3 bg-light" style={{maxHeight: '100px'}}>
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
                                </div>
                                <div className="card card-body">
                                    <form onSubmit={this.logout}>
                                        <button type="submit" className="btn btn-outline-danger btn-block">Logout from Feedly &nbsp;<i class="fas fa-sign-out-alt"></i></button>
                                    </form>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default FeedlySetting