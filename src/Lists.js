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
			<div className="col-md-3 scrollable no-padding-right no-padding-left">
				<div className="card">
					<ul className="list-group list-group-flush">
					{this.state.lists.map((item) => (
						<span className="border-bottom">
							<li className="list-group-item" key={item.link} onClick={() => this.handleClick(item.link)}>
								{item.title} <br></br> 
								<span className="badge badge-info">{item.author}</span>
								{/* <br></br>
								<span className="badge badge-info">{item.pubdate.toString()}</span> */}
							</li>
						</span>
					))}
					</ul>
				</div>
			</div>
		);
	}
}

export default Lists;