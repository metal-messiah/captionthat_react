/**
 * Created by Porter on 12/27/2017.
 */
import React, {Component} from 'react';

const Timer = (props) => {
    let display = props.display ? "timer" : "hidden";
    return (
        <div className={display}>{props.timer}</div>
    )
};

export default Timer;