import React from 'react';

class Error extends React.Component {
    render() {
        return (
            <div className="row align-items-center full-size">
                <div className="col-md-8 offset-md-2">
                    <div class="card text-white bg-danger">
                        <div class="card-header">Error</div>
                        <div class="card-body">
                            <h5 class="card-title">HTTP Error</h5>
                            <p class="card-text">An error has happened when contacting Feedly server. Please wait several minutes (or hours) before trying again.</p>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default Error