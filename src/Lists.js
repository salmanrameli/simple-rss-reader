import React, { Component } from 'react';

class Lists extends Component {
	constructor(props) {
		super(props)

		this.state = {
			lists : this.props.lists
		}

		this.handleClick = this.handleClick.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			lists: nextProps.lists
		});
	}

	handleClick = (link, e) => {
		this.props.loadStory(link);
	}
	
	render() {
		return (
			<div class="col-md-3 scrollable no-padding-right no-padding-left">
				{this.state.lists.map((item) => (
					<div className="card" key={item.link}>
						<div className="card-body">
							<h5 className="card-title">{item.title}</h5>
							<p className="card-text">{item.author}</p>
							<div className="btn-group">
								<button className="btn btn-primary btn-sm" onClick={() => this.handleClick(item.link)}>Details</button>
							</div>
						</div>
					</div>
				))}
			</div>
		);
	}
}

export default Lists;