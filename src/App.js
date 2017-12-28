import React, {Component} from 'react';
import socketIOClient from "socket.io-client";
import {ToastContainer, ToastStore} from 'react-toasts';
import './App.css';
import SignIn from './components/SignInComponent';
import Header from './components/Header';
import Round from './components/Round';
import Timer from './components/Timer';
import ImageView from './components/ImageView';
import Scoreboard from './components/Scoreboard';
import Cards from './components/Cards';
import Submissions from './components/Submissions';

class App extends Component {
    constructor() {
        super();
        //"https://captionthat.herokuapp.com",
        this.state = {
            alias: "",
            endpoint: "http://localhost:3001",
            roundLimit: 10,
            timeLimit: 30,
            timer: 30,
            round: 0,
            roundType: null, // answer or judging
            currentRound: [],
            currentImage: null,
            users: [],
            isRunning: false,
            currentCaptions: [],
            showImage: false,
            showTimer: false,
            showSubmissions: false,
            showCards: false,
            showType: false,
            showSignin: true,
            signinMsg: "",
            socket: null
        };
    }

    componentDidMount() {
        const {endpoint} = this.state;
        const socket = socketIOClient(endpoint);
        this.setState({socket: socket});
        socket.on("data", data => {
            console.log(data);
            this.setState({
                roundLimit: data.roundLimit,
                timeLimit: data.timeLimit,
                timer: data.timer,
                round: data.round,
                roundType: data.roundType, // answer or judging
                currentRound: data.currentRound,
                currentImage: data.currentImage,
                users: data.users,
                isRunning: data.isRunning,
                currentCaptions: data.currentCaptions
            })
        });

        socket.on("alias", (data) => {
            console.log(data);
            if (data.success) {
                this.setState({
                    showImage: true,
                    showTimer: true,
                    showSubmissions: true,
                    showCards: true,
                    showType: true,
                    showSignin: false,
                    alias: data.alias
                })
            }
            else {
                this.setState({
                    showImage: false,
                    showTimer: false,
                    showSubmissions: false,
                    showCards: false,
                    showType: false,
                    showSignin: true,
                    signinMsg: "Alias is already taken",
                    alias: data.alias
                })
            }
        })

        socket.on("winner", (data) => {
            ToastStore.info(data, 5000);
        })
    }

    render() {
        let roundMsg;
        if (this.state.round !== 0) {
            roundMsg = "Round " + this.state.round;
        }
        else {
            roundMsg = "Waiting For 1 More Player";
        }
        let aliasIndex = this.state.users.findIndex((user) => user.alias === this.state.alias);
        let me;
        if (aliasIndex != -1){
            me = this.state.users[aliasIndex];
        }
        else{
           me = false;
        }
        let canSubmit = me ? me.canSubmit : false;
        let cards = me ? me.cards : [];
        let canVote = me ? me.canVote : false;
        let submissions = this.state.currentCaptions || [];
        //let currentCaption = me ? me.currentCaption : "";
        return (
            <div className="App">
                <SignIn show={this.state.showSignin} msg={this.state.signinMsg} socket={this.state.socket}/>
                <Header/>
                <Round round={roundMsg}/>
                <Timer display={this.state.isRunning} timer={this.state.timer}></Timer>
                <div className="centerContent">
                    <ImageView endpoint={this.state.endpoint} display={this.state.isRunning}
                               currentImage={this.state.currentImage}/>
                    <Scoreboard users={this.state.users} display={this.state.isRunning}/>

                </div>
                <Cards timer={this.state.timer} type={this.state.roundType} socket={this.state.socket}
                       display={canSubmit} cards={cards}/>
                <Submissions timer={this.state.timer} type={this.state.roundType} socket={this.state.socket}
                             display={canVote} cards={submissions} me={me}/>
                <ToastContainer style={"bottom right"} store={ToastStore}/>
            </div>
        );
    }
}

export default App;
