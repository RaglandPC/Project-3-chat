import React, { Component } from 'react'
import Chatkit from '@pusher/chatkit'
import MessageList from './components/MessageList'
import SendMessageForm from './components/SendMessageForm'
import TypingIndicator from './components/TypingIndicator'
import WhosOnlineList from './components/WhosOnlineList'

class ChatScreen extends Component {
    constructor(props) {
        super(props)
        this.state = {
            currentUser: {},
            currentRoom: {},
            messages: [],
            usersWhoAreTyping: [],
        }
        this.sendMessage = this.sendMessage.bind(this)
        this.sendTypingEvent = this.sendTypingEvent.bind(this)
    }

    sendTypingEvent() {
        this.state.currentUser
            .isTypingIn({ roomId: this.state.currentRoom.id })
            .catch(error => console.error('error', error))
    }

    sendMessage(text) {
        this.state.currentUser.sendMessage({
            text,
            roomId: this.state.currentRoom.id,
        })
    }

    componentDidMount() {
        const chatManager = new Chatkit.ChatManager({
            instanceLocator: 'v1:us1:efa350e4-decd-4981-8da2-309dab33612f',
            userId: this.props.currentUsername,
            tokenProvider: new Chatkit.TokenProvider({
                url: 'http://localhost:3001/authenticate',
            }),
        })

        chatManager
            .connect()
            .then(currentUser => {
                this.setState({ currentUser })
                return currentUser.subscribeToRoom({
                    roomId: 11441771,
                    messageLimit: 100,
                    hooks: {
                        onNewMessage: message => {
                            this.setState({
                                messages: [...this.state.messages, message],
                            })
                        },
                        onUserStartedTyping: user => {
                            this.setState({
                                usersWhoAreTyping: [...this.state.usersWhoAreTyping, user.name],
                            })
                        },
                        onUserStoppedTyping: user => {
                            this.setState({
                                usersWhoAreTyping: this.state.usersWhoAreTyping.filter(
                                    username => username !== user.name
                                ),
                            })
                        },
                        onUserCameOnline: () => this.forceUpdate(),
                        onUserWentOffline: () => this.forceUpdate(),
                        onUserJoined: () => this.forceUpdate(),
                    },
                })
            })
            .then(currentRoom => {
                this.setState({ currentRoom })
            })
            .catch(error => console.error('error', error))
    }

    render() {
        const styles = {
            container: {
                height: '100wh',
                display: 'flex',
                flexDirection: 'column',
            },
            chatContainer: {
                display: 'flex',
                flex: 1,
            },
            whosOnlineListContainer: {
                width: '300px',
                flex: 'none',
                padding: 20,
                backgroundColor: '#2c303b',
                color: 'white',
            },
            chatListContainer: {
                padding: 20,
                width: '85%',
                display: 'flex',
                flexDirection: 'column',
            },
        }

        return (
            <div style={styles.container}>
                <div style={styles.chatContainer}>
                    <aside style={styles.whosOnlineListContainer}>
                        <WhosOnlineList
                            currentUser={this.state.currentUser}
                            users={this.state.currentRoom.users}
                        />
                    </aside>
                    <section style={styles.chatListContainer}>
                        <MessageList
                            messages={this.state.messages}
                            style={styles.chatList}
                        />
                        <TypingIndicator usersWhoAreTyping={this.state.usersWhoAreTyping} />
                        <SendMessageForm 
                            onSubmit={this.sendMessage}
                            onChange={this.sendTypingEvent}
                         />
                    </section>
                </div>
            </div>
        )
    }
}

export default ChatScreen


//We will need a way to create rooms for each event that a user is tied to
//We will need a way to tie the many events to the single user
//We will need a way to authorize users to events they are invited to