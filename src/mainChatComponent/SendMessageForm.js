import React, { Component } from 'react'
import { Button, TextInput } from 'react-desktop/macOs'

class SendMessageForm extends Component {
  state = {
    text: ''
  }

  onSubmit = e => {
    e.preventDefault()
    this.props.onSend(this.state.text)
    this.setState({ text: '' })
    // if (this.state.text !== undefined || '') {
    //   this.sendNotif(this.state.text)
    // }
  }

  onChange = e => {
    this.setState({ text: e.target.value })
    if (this.props.onChange) {
      this.props.onChange()
    }
  }

  // replyReciever = (reply) => {
  //   console.log('reply',reply)
  //   const replyMessage = reply.message
  //   this.props.onSend(replyMessage)
  // }

  // sendNotif = (msg) => {
  //   if(window.notifier){
  //     console.log('consuming');
  //     window.notifier.notifierFunction(msg, this.replyReciever);
  //   }
  // }

  render() {
    return (
      <div className="send-message-form-container">
        <form onSubmit={this.onSubmit} className="send-message-form">
          <TextInput
            type="text"
            onChange={this.onChange}
            value={this.state.text}
            className="message-input"
          />
          <Button id="notify" color="blue" type="submit">
            Send
          </Button>
        </form>
      </div>
    )
  }
}

export default SendMessageForm
