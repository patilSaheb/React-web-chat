import React, { Component } from 'react'
import { Button, TextInput } from 'react-desktop/macOs'
import * as secrets from '../config.json'

class SendMessageForm extends Component {
  state = {
    text: ''
  }

  onSubmit = e => {
    e.preventDefault()
    this.props.onSend(this.state.text)
    this.setState({ text: '' })
  }

  onChange = e => {
    this.setState({ text: e.target.value })
    if (this.props.onChange) {
      this.props.onChange()
    }
  }

  onUpload = file => {
    if (file !== null || undefined) {
      this.props.onFileSend(file)
    }
  }

  onUsernameSubmitted = file => {
    fetch(`https://young-depths-31034.herokuapp.com/rooms/${secrets.roomId}/users/${this.props.currentUser}/files/${file}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form'
      },
      body: JSON.stringify({
        "resource_link": "",
        "type": "image"
      })
    })
      .then(response => response.json())
      .then(data => {
        this.setState({
          currentId: data.id,
          currentUsername: data.name,
          currentScreen: 'chat'
        })
      })
      .catch(error => {
        console.error('error', error)
      })
  }


  uploadHandler = e => {
    if (window.uploader) {
      console.log('yes')
      window.uploader.upload(this.onUpload);
    }
  }

  render() {
    return (
      <div className="send-message-form-container">
        <form onSubmit={this.onSubmit} className="send-message-form">
          <TextInput
            autoFocus
            type="text"
            onChange={this.onChange}
            value={this.state.text}
            className="message-input"
          />    
          <span title="upload image" className="container">
            +
            <input
            accept=".jpeg,.jpg,.png,.gif"
            className="component"
              type="file"
              onChange={e => {
                const file = e.target.files[0]
                console.log(file)
                this.onUpload(file)
              }}
            />
          </span>
          <Button id="notify" color="blue" type="submit">
            Send
          </Button>
        </form>
      </div>
    )
  }
}

export default SendMessageForm
