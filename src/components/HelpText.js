/**
 * Created by Porter on 12/28/2017.
 */
import React, {Component} from 'react';

const HelpText = (props) => {
    //console.log(this.props.users)
    let displayClass = props.display ? "cardsTitle" : "hidden";
    return (
        <div className={displayClass}>
            {props.html}
        </div>
    )
}

export default HelpText;