/**
 * Created by Porter on 12/27/2017.
 */
import React, {Component} from 'react';
import {ToastStore} from 'react-toasts';

class Cards extends Component {
    constructor(props) {
        super(props);
        this.state = {caption: ''};

        this.handleSelection = this.handleSelection.bind(this);
    }

    handleSelection(card) {
        console.log(card);
        this.setState({
            caption: card.card
        })
        this.props.socket.emit("caption", card.card)

        let remainingTime = this.props.timer * 1000;
        ToastStore.info(`Submitted '${card.card}'`, remainingTime);
        //this.setState({alias: e.target.innerHTML});
    }

    render() {
        let display = this.props.display ? "cards" : "hidden";
        return (

                <div className={display}>
                    {this.props.cards.map((card, i) => {
                        return <div key={i} className="card" onClick={() => {
                            this.handleSelection({card})
                        }}>{card}</div>
                    })}
                </div>

        )
    }
}

export default Cards;