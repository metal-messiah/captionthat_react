/**
 * Created by Porter on 12/27/2017.
 */
import React, {Component} from 'react';

class Scoreboard extends Component {

    render() {
        //console.log(this.props.users)
        let scores = [];

        this.props.users.forEach((user) => {
            scores.push({score: user.score, alias: user.alias});
        })
        scores.sort((a, b) => {
            return a.score - b.score
        });
        scores.reverse();

        let displayClass = this.props.display ? "scoreboard" : "hidden";
        return (
            <div className={displayClass}>
                <div className="scoreboardTitle">Scoreboard</div>
                <ol>
                    {scores.map((score, i) => {
                        let avatarURL = `https://api.adorable.io/avatars/40/${score.alias}`;
                        return <li key={i}><img src={avatarURL} className="avatar"/>{score.alias} - {score.score}</li>;
                    })}
                </ol>
            </div>
        )
    }
}

export default Scoreboard;