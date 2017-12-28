/**
 * Created by Porter on 12/27/2017.
 */
import React, {Component} from 'react';

class Timer extends Component {

    render() {
        let display = this.props.display ? "timer" : "hidden";

        return (
            <div className={display}>{this.props.timer}</div>
        )
    }
}

export default Timer;