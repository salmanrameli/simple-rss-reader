import React from 'react';
// const { React } = window.require('react');
// const { ReactDOM } = window.require('react-dom');
// const { ipcRenderer } = window.require('electron');

class Setting extends React.Component {
	render() {
		return (
			<div className="col-md-12 scrollable with-padding">
				<div className="card">
					<div className="card-header">
						Setting
					</div>
					<div className="card-body">
						<form>
							<div class="form-group">
								<label for="exampleInputEmail1">Email address</label>
								<input type="email" class="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" />
								<small id="emailHelp" class="form-text text-muted">We'll never share your email with anyone else.</small>
							</div>
							<div class="form-group">
								<label for="exampleInputPassword1">Password</label>
								<input type="password" class="form-control" id="exampleInputPassword1" placeholder="Password" />
							</div>
							<button type="submit" class="btn btn-primary">Submit</button>
						</form>
					</div>
				</div>
			</div>
		)
	}
}

export default Setting