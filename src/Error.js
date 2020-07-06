import React from 'react';

class Error extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="row align-items-center full-size">
                <div id="error">
                    <div id="box"></div>
                    <h3>Whoops</h3>
                    <p>We're having problems <span>connecting to the internet</span> right now</p>
                    <p>Please try again later</p>
                    {this.props.errorCode === '' ? 
                        ''
                    : 
                        <p>The error is {this.props.errorCode}: {this.props.errorMessage}</p>
                    }
                </div>
            </div>
        )
    }
}

export default Error