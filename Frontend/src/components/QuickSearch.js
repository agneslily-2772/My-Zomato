import React, { Component } from 'react'
import { withRouter } from 'react-router-dom'

class QuickSearch extends Component {
    handleClick = () => {
        this.props.history.push(`/filter?mealType=${this.props.title}&mealTypeId=${this.props.mealType}`);
    }
    render() {
        return (
            <React.Fragment>
                <div className="qs-box" onClick={this.handleClick} style={{ cursor: 'pointer' }}>
                    <div className="qs-box-container">
                        <img className="qs-image" src={this.props.imgSrc} alt="breakfast" />
                        <h4 className="qs-box-heading">{this.props.title}</h4>
                        <p className="qs-box-desc">{this.props.description}</p>
                    </div>
                </div>
            </React.Fragment>
        )
    }
}
export default withRouter(QuickSearch);