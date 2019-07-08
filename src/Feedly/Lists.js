import React, { Component } from 'react';

class Lists extends Component {
	constructor(props) {
		super(props)

		this.state = {
			lists : this.props.lists,
			activeLink: ''
		}

		this.handleClick = this.handleClick.bind(this);
	}

	componentWillReceiveProps(nextProps) {
		this.setState({
			lists: nextProps.lists
		});
	}

	handleClick = (link, id) => {
		this.props.loadStory(link, id);

		this.setState({
			activeLink: id
		})
	}
	
	render() {
		return (
			<div className="col-md-3 scrollable no-padding-right no-padding-left">
				{this.state.lists.map((item) => (
					<div className={`card list-group-item ${this.state.activeLink === item.id ? 'active' : ''}`} key={item.id}>
						<div className="card-body" onClick={() => this.handleClick(item.alternate.href, item.id)}>
							<h6>{item.title}</h6>
							<p className="badge badge-info">{item.author}</p>
						</div>
					</div>
				))}
			</div>
		);
	}
}

export default Lists;