/**
 * Created by Porter on 12/27/2017.
 */
import React, {Component} from 'react';

class SignIn extends Component {

    constructor(props) {
        super(props);
        this.state = {alias: ''};

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleChange(e) {
        this.setState({alias: e.target.value});
    }

    handleSubmit(e) {
        console.log("send alias to socket server")
        e.preventDefault();
        this.props.socket.emit("alias", this.state.alias)
    }

    render() {
        let displayClass = this.props.show ? "modal" : "hidden";
        return (
            <div className={displayClass}>
                <form onSubmit={this.handleSubmit}>
                    <input className="alias" placeholder="Enter Nickname" value={this.state.alias} onChange={this.handleChange}></input>
                    <button type="submit" className="submitAlias"> Join Game</button>
                    <div className="warning">{this.props.signinMsg}</div>
                </form>
            </div>
        )
    }
}

export default SignIn;