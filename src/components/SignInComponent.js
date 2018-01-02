/**
 * Created by Porter on 12/27/2017.
 */
import React, {Component} from 'react';

class SignIn extends Component {

    constructor(props) {
        super(props);
        console.log("CONSTRUCTOR")
        this.state = {
            alias: ''
        };
//console.log(this.state)
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        this.setState({alias: e.target.value});
    }


    componentWillReceiveProps() {
        //console.log(this.props.gamerooms);
    }


    componentDidMount() {
        //console.log("MOUNT")
        // to do -- get axios call to get list of games and return if no url param
    }

    render() {
        //console.log(this.props.endpoint)
        let displayClass = this.props.show ? "modal" : "hidden";
        let buttonText, placeholderText, showGamerooms;
        if (this.props.currentGameroom) {
            buttonText = "Join Game";
            placeholderText = "Enter Nickname";
            showGamerooms = "hidden"
        }
        else {
            buttonText = "Create Game";
            placeholderText = "Enter Gameroom Name";
            showGamerooms = "gamerooms"
        }


        //console.log(this.props.gamerooms)

        return (
            <div className={displayClass}>
                <form onSubmit={
                    (e) => {
                        this.setState({alias: ""})
                        this.props.handleGameroom(e, this.state.alias, this.props.currentGameroom)
                    }
                }>
                    <input className="alias" placeholder={placeholderText} value={this.state.alias}
                           onChange={this.handleChange} required></input>
                    <button type="submit" className="submitAlias"> {buttonText}</button>
                    <div className="help">How to Play
                        <hr>Make a game, or join an existing one. Create a temporary username and join the fun!
                            A random picture will be shown, and you will be given four random caption cards. You may
                            pick one card each round to best represent the mood of the picture. At the end of the round.
                            each player will get to vote for their favorite. The player with the most points after 10
                            rounds wins the game. Have fun!
                    </div>
                </form>
                <div className="gameroomsWrapper">
                    <div className="gamerooms">
                        <div className="gameroomsTitle">Join Existing Game</div>
                        {this.props.gamerooms.map((gameroom, i) => {
                            let gameroomClass = this.props.currentGameroom == gameroom ? "gameroom active" : "gameroom"
                            return <div className={gameroomClass} key={i} onClick={(e) => {
                                this.setState({alias: ""})
                                this.props.handleExistingGameroom(e)
                            }}>{gameroom}</div>
                        })}
                    </div>
                </div>
            </div>
    )
    }
    }

    export default SignIn;