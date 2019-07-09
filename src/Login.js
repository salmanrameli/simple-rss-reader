import React, { Component } from 'react';

const Store = window.require('electron-store');
const store = new Store();
const { ipcRenderer } = window.require('electron')

class Login extends Component {
    constructor(props) {
        super(props)

        this.state = {
            integrateWithFeedly: '',
            userId: '',
            authCode: ''
        }

        this.stringToBool = this.stringToBool.bind(this)
        this.handleFeedlyIntegration = this.handleFeedlyIntegration.bind(this)
        this.handleIntegrateWithFeedlyChange = this.handleIntegrateWithFeedlyChange.bind(this)
        this.handleUserIdOnChange = this.handleUserIdOnChange.bind(this)
        this.handleAuthCodeOnChange = this.handleAuthCodeOnChange.bind(this)
    }

    stringToBool(val) {
        return (val + '').toLowerCase() === 'true';
      }

    componentDidMount() {
        this.setState({
            integrateWithFeedly: store.get('integrateWithFeedly', false),
            userId: store.get('userId', ''),
            authCode: store.get('authCode', '')
        })
    }

    handleFeedlyIntegration(event) {        
        event.preventDefault()

        let integrateWithFeedly = this.stringToBool(event.target.feedlyIntegration.value)

        store.set('integrateWithFeedly', integrateWithFeedly)

        if(integrateWithFeedly) {
            let userId = event.target.userId.value
            let authorizationCode = event.target.authorizationCode.value

            store.set('userId', userId)
            store.set('authCode', authorizationCode)
        }

        ipcRenderer.send('feedly-integration', 'feedly integration')
    }

    handleIntegrateWithFeedlyChange(event) {
        let val = event.target.value

        this.setState({
            integrateWithFeedly: this.stringToBool(val)
        })

        this.render()
    }

    handleUserIdOnChange(event) {
        this.setState({
            userId: event.target.userId.value
        })
    }

    handleAuthCodeOnChange(event) {
        this.setState({
            authCode: event.target.authCode.value
        })
    }

    render() {
        return (
            <div className="row align-items-center full-size">
                <div className="col-md-8 offset-md-2">
                    <form id="windowSizeSetting" onSubmit={this.handleFeedlyIntegration}>
                        <div className="form-group">
                            <input className="form-check-input" type="radio" name="feedlyIntegration" id="feedlyIntegrationFalse" value="false" checked={this.state.integrateWithFeedly === false} onChange={this.handleIntegrateWithFeedlyChange} />
                            <label className="form-check-label" htmlFor="feedlyIntegrationFalse">Don't integrate with Feedly</label>
                        </div>
                        <div className="form-group">
                            <input className="form-check-input" type="radio" name="feedlyIntegration" id="feedlyIntegrationTrue" value="true" checked={this.state.integrateWithFeedly === true} onChange={this.handleIntegrateWithFeedlyChange} />
                            <label className="form-check-label" htmlFor="feedlyIntegrationTrue">Yes, with this credentials:</label>
                            <br></br>
                            <br></br>
                            {this.state.integrateWithFeedly ? 
                                <div className="card card-body bg-light">
                                    <label for="userId">User ID</label>
                                    <input type="text" className="form-control" id="userId" name="userId" onChange={e => this.handleUserIdOnChange(e)} value={this.state.userId}></input>
                                    <br></br>
                                    <label for="authorizationCode">Authorization Code</label>
                                    <textarea rows="5" type="text" className="form-control" id="authorizationCode" name="authorizationCode" onChange={e => this.handleAuthCodeOnChange(e)} value={this.state.authCode}></textarea>
                                </div>
                            :
                                <div className="card card-body bg-light">
                                    <label for="userId">User ID</label>
                                    <input type="text" className="form-control" id="userId" disabled></input>
                                    <br></br>
                                    <label for="authorizationCode">Authorization Code</label>
                                    <textarea rows="5" type="text" className="form-control" id="authorizationCode" disabled></textarea>
                                </div>
                            }                                
                        </div>
                        <button type="submit" className="btn btn-primary">Save</button>
                    </form>
                </div>
            </div>
        )
    }
}

export default Login