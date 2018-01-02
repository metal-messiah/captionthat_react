/**
 * Created by Porter on 12/27/2017.
 */
import React, {Component} from 'react';

class Header extends Component {

    render() {
        let displayRoomName = this.props.currentGameroom ? "gameroomName" : "hidden";
        return (
            <div>
                <div className="logo" onClick={()=>{window.location.reload(true);}}>CaptionThat</div>
                <div className={displayRoomName}>{this.props.currentGameroom} - {this.props.currentGameroomUsers.length} Players</div>
            </div>
        )
    }
}

export default Header;