import React, { Component } from 'react'
import QuickSearch from './QuickSearch'

export default class QuickSearches extends Component {
    render() {
        const { mealtypes } = this.props;
        return (
            <React.Fragment>
                <div className="bottomSection">
                    <h2 className="qs-heading">Quick Searches</h2>
                    <h4 className="qs-subheading">Discover restaurants by type of meal</h4>
                    {
                        mealtypes.map((item, index) => {
                            return <QuickSearch key={index} imgSrc={require("../" + item.image).default} title={item.name} description={item.content} mealType={item.meal_type} />
                        })
                    }
                </div>
            </React.Fragment>
        )
    }
}