/**
 * Created by Porter on 12/27/2017.
 */
/**
 * Created by Porter on 12/27/2017.
 */
import React, {Component} from 'react';
import {ToastStore} from 'react-toasts';

class Submissions extends Component {
    constructor(props) {
        super(props);
        this.state = {caption: ''};

        this.handleSelection = this.handleSelection.bind(this);
    }

    handleSelection(card) {
        console.log(card);
        this.setState({
            caption: card.card.alias
        })
        this.props.socket.emit("vote", card.card.alias);

        let remainingTime = this.props.timer * 1000;
        ToastStore.info(`Voted For '${card.card.alias}'`, remainingTime);
        //this.setState({alias: e.target.innerHTML});
    }

    render() {
        let display = this.props.display ? "cards" : "hidden";
        return (
            <div className={display}>
                {this.props.cards.map((card, i) => {
                    if (card.alias) {
                        if (card.alias !== this.props.me.alias)
                            return <div key={i} className="card" onClick={() => {
                                this.handleSelection({card})
                            }}>{card.caption}</div>
                    }
                })}
            </div>
        )
    }
}

export default Submissions;