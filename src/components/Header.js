/**
 * Created by Porter on 12/27/2017.
 */
import React, {Component} from 'react';

const Header = (props) => {
    let displayRoomName = props.currentGameroom ? "gameroomName" : "hidden";
    return (
        <div>
            <div className="logo">CaptionThat</div>
            <div className={displayRoomName}>{props.currentGameroom} - {props.currentGameroomUsers.length}
                Players
            </div>
        </div>
    )
}

export default Header;