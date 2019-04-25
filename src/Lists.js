import React, { Component } from 'react';

class Lists extends Component {
	constructor(props) {
		super(props)

		this.state = {
			lists : this.props.lists,
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
				<div class="card">
					<ul class="list-group list-group-flush">
					{this.state.lists.map((item) => (
						<li class="list-group-item" key={item.link} onClick={() => this.handleClick(item.link)}>
							{item.title} <br></br> 
							<span class="badge badge-info">{item.author}</span>
						</li>
					))}
					</ul>
				</div>
			</div>
		);
	}
}

export default Lists;