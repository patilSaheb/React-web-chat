import React, { Component } from 'react'
import { ChatManager, TokenProvider } from '@pusher/chatkit'
import MessageList from './MessageList'
import SendMessageForm from './SendMessageForm'
import OnlineList from './OnlineList'
import * as secrets from '../config.json'
import { Flag } from 'react-preloading-component';

class Chat extends Component {
    state = {
        currentUser: null,
        currentRoom: {},
        messages: [],
        loading: true,
    }

    componentDidMount() {
        const chatkit = new ChatManager({
            instanceLocator: secrets.instanceLocator,
            userId: this.props.currentId,
            tokenProvider: new TokenProvider({
                url: secrets.url
            })
        })

        chatkit
            .connect()
            .then(currentUser => {
                this.setState({ currentUser })
                console.log('You are connected.')
                return currentUser.subscribeToRoom({
                    roomId: secrets.roomId, // Replace with YOUR ROOM ID
                    messageLimit: 100,
                    hooks: {
                        onNewMessage: message => {
                            this.setState({
                                messages: [...this.state.messages, message]
                            })
                        },
                        onUserCameOnline: () => this.forceUpdate(),
                        onUserWentOffline: () => this.forceUpdate(),
                        onUserJoined: () => this.forceUpdate()
                    }
                })
            })
            .then(currentRoom => {
                this.setState({
                    currentRoom,
                    loading: false
                })
            })
            .catch(error => console.error('error', error))
    }

    onSend = text => {
        this.state.currentUser.sendMessage({
            text,
            roomId: this.state.currentRoom.id
        })
    }

    onFileSend = file => {
        console.log(file)
        this.state.currentUser.sendMessage({
            text: file.name,
            roomId: this.state.currentRoom.id,
            attachment: {
                file: file,
                name: Date.now()+file.name
              }
            })
            .then(messageId => {
              console.log(`Added message to ${this.state.currentRoom.id} ${messageId}`)
            })
            .catch(err => {
              console.log(`Error adding message to ${this.state.currentRoom.id}: ${err}`)
            })
    }

    filterDeleted = () => {
        const messageList = (this.state.messages).filter((i) => {
            return (i.senderId).includes(".deleted.") === false;
        })
        return messageList
    }

    render() {
        if (this.state.loading === false) {
            return (
                <div className="wrapper">
                    <div>
                        <OnlineList
                            currentUser={this.state.currentUser}
                            users={this.state.currentRoom.users}
                        />
                    </div>
                    <div className="chat">
                        <MessageList
                            currentUser={this.state.currentUser}
                            room={this.state.currentRoom}
                            messages={this.filterDeleted()}
                            users={this.state.currentRoom.users}
                            instantReply={this.onSend}
                        />
                        <SendMessageForm currentUser={this.state.currentUser} onFileSend={this.onFileSend} onSend={this.onSend} />
                    </div>
                </div>
            )
        } else {
            return (
                <div className="wrapper">
                    <Flag color="#F8FAFD" size={10} />
                </div>                
            )
        }

    }
}

export default Chat