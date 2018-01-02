import React, {Component} from 'react';
import socketIOClient from "socket.io-client";
import {ToastContainer, ToastStore} from 'react-toasts';
import axios from 'axios';
import './App.css';
import SignIn from './components/SignInComponent';
import Header from './components/Header';
import Round from './components/Round';
import Timer from './components/Timer';
import ImageView from './components/ImageView';
import Scoreboard from './components/Scoreboard';
import Cards from './components/Cards';
import Submissions from './components/Submissions';
import HelpText from './components/HelpText';

let debug = false;


let endpoint;
if (debug) {
    endpoint = "http://localhost:3001"
}
else {
    endpoint = "https://captionthat.herokuapp.com"
}

class App extends Component {
    constructor() {
        super();
        //"https://captionthat.herokuapp.com",
        this.state = {
            alias: "",
            endpoint: endpoint,
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
            socket: null,
            gamerooms: [],
            currentGameroom: "",
            currentGameroomUsers: []
        };

        this.handleGameroom = this.handleGameroom.bind(this);
        this.handleExistingGameroom = this.handleExistingGameroom.bind(this);
        this.getExistingGames = this.getExistingGames.bind(this);
    }

    handleGameroom(e, data, gameroom) {
        e.preventDefault()
        let name = data.replace(/\W/g, '').toLowerCase();
        if (gameroom) {
            //join the game with a player alias

            const socket = socketIOClient(`${endpoint}/${gameroom}`);
            this.setState({socket: socket});
            socket.on("data", data => {
                //console.log(data);
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
                    currentCaptions: data.currentCaptions,
                    currentGameroomUsers: data.users.map(user=>user.alias)
                })
            });

            socket.emit("alias", name)

            socket.on("alias", (data) => {
                console.log(data);


                if (data.success) {
                    axios.get(`${this.state.endpoint}/api/game/${gameroom}`).then(response => {
                        let users = response.data.users;
                        this.setState({
                            currentGameroomUsers: users
                        })
                    })
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
                    ToastStore.error("Alias is already taken", 5000);
                }
            })

            socket.on("winner", (data) => {
                ToastStore.info(data, 5000);
            })

            socket.on("end", (data) => {
                ToastStore.error("Game has ended", 5000);
                setTimeout(function () {
                    window.location.reload(true);
                }, 5000)

            })


        }
        else {
            //make a new game
            axios.post(`${this.state.endpoint}/api/game`, {name: name})
                .then(response => {
                    if (response.data.success) {
                        this.setState({
                            currentGameroom: response.data.gameroom,
                            gamerooms: response.data.gamerooms
                        })
                    }
                    else {
                        ToastStore.error(response.data.msg.replace(/\r?\n|\r/g, " "), 5000);
                    }


                });
        }
    }

    handleExistingGameroom(e) {
        let currentGameroom = e.target.innerHTML;
        axios.get(`${this.state.endpoint}/api/game/${currentGameroom}`).then(response => {
            let users = response.data.users;
            this.setState({
                currentGameroom: currentGameroom,
                currentGameroomUsers: users
            })
        })

    }

    getExistingGames() {
        axios.get(`${this.state.endpoint}/api/game`)
            .then(response => {
                console.log(response)
                if (response.data.success) {
                    this.setState({
                        gamerooms: response.data.gamerooms
                    })
                }
                else {
                    ToastStore.warning(response.data.msg, 5000);
                }


            });
    }

    componentDidMount() {
        //console.log("axios get game rooms from " + `${this.state.endpoint}/api/game`);
        this.getExistingGames();
        setInterval(() => {
            if (this.state.showSignin) {
                this.getExistingGames();
            }
        }, 10000)
        const {endpoint} = this.state;

    }

    render() {
        let roundMsg;
        if (this.state.round !== 0) {
            roundMsg = "Round " + this.state.round;
        }
        else {
            roundMsg = "Waiting For 1 More Player";
        }
        console.log(this.state.alias)
        let aliasIndex = this.state.users.findIndex((user) => user.alias === this.state.alias);
        let me;

        if (aliasIndex != -1) {
            me = this.state.users[aliasIndex];
        }
        else {
            me = false;
        }
        console.log(me);
        let canSubmit = me ? me.canSubmit : false;
        let cards = me ? me.cards : [];
        let canVote = me ? me.canVote : false;
        let submissions = this.state.currentCaptions || [];
        let cardTitle = this.state.roundType == "answer" ? "Submit a Caption" : "Vote For Your Favorite";
        //let currentCaption = me ? me.currentCaption : "";
        //console.log(this.state.endpoint)
        return (
            <div className="App">
                <SignIn currentGameroom={this.state.currentGameroom} handleGameroom={this.handleGameroom}
                        handleExistingGameroom={this.handleExistingGameroom}
                        gamerooms={this.state.gamerooms} url={window.location.href}
                        show={this.state.showSignin}
                        msg={this.state.signinMsg} socket={this.state.socket}/>
                <Header currentGameroom={this.state.currentGameroom}
                        currentGameroomUsers={this.state.currentGameroomUsers}/>
                <Round round={roundMsg}/>
                <Timer display={this.state.isRunning} timer={this.state.timer}></Timer>
                <div className="centerContent">
                    <ImageView endpoint={this.state.endpoint} display={this.state.isRunning}
                               currentImage={this.state.currentImage}/>
                    <HelpText html={cardTitle} display={this.state.isRunning} className="cardsTitle"/>
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
