import React from 'react';


class Error extends React.Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <div className="row align-items-center full-size">
                <div className="col-md-8 offset-md-2">
                    <div class="card text-white bg-danger">
                        <div class="card-header">Error</div>
                        <div class="card-body">
                            <h5 class="card-title">HTTP Error {this.props.errorCode}: {this.props.errorMessage}</h5>
                            <p class="card-text">An error has happened when contacting Feedly server.</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Error