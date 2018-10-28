import React, { Component } from 'react'
import {
  ListView,
  ListViewHeader,
  ListViewSection,
  ListViewRow,
  Text
} from 'react-desktop/macOs'

class MessageList extends Component {
  state = {
    className: '',
    lastUpdatedText: ''
  }

  componentDidMount() {
    if (this.props.messages !== [] || undefined) {
      this.setState({ className: "current-user-style" })
    }
  }

  // shouldComponentUpdate(nextProps) {
  //   const vitalPropsChange = this.props.messages !== nextProps.messages
  //   if (vitalPropsChange) {this.sendNotif(this.state.text)}
  //   return vitalPropsChange
  // }

  getSnapshotBeforeUpdate(prevProps) {
    // Capture the scroll position so we can adjust scroll later.
    if (prevProps.messages.length < this.props.messages.length) {
      let last = this.props.messages
      // const list = this.listRef.current;
      // return list.scrollHeight - list.scrollTop;
      this.sendNotif(last[last.length - 1].text)//extract the text from last item and send a notification
    }
    return null;
  }

  replyReciever = (reply) => {
    const replyMessage = reply.message
    this.props.instantReply(replyMessage)
  }

  sendNotif = (msg) => {
    if(window.notifier){
      window.notifier.notifyUser(msg, this.replyReciever);
    }
  }

  componentDidUpdate() {
    this.newData.scrollIntoView({ behavior: "smooth" })
  }

  render() {
    if (this.props.messages !== []) {
      return (
        <ListView className="chat-background">
          <ListViewHeader background="#F8FAFD" padding="0px 0px 0px 18px">
            <Text color="#414141" size="16" bold>
              {this.props.room.name}
            </Text>
          </ListViewHeader>
          <ListViewSection id="iScroll" >
            {this.props.messages.map((message, index) =>
              this.renderItem(message)
            )}
            <div ref={(ref) => this.newData = ref}></div>
          </ListViewSection>
        </ListView>
      )
    }
  }

  renderItem(message) {
    return (
      <ListViewRow key={message.id} className={(this.props.currentUser.id === message.senderId) ? "current-user-style" : "other-user-style"}>
        <Text color="#414141" size="14" bold>
          {message.senderId}:
        </Text>
        <Text color="#414141" size="14">
          {message.text}
        </Text>
      </ListViewRow>
    )
  }
}

export default MessageList