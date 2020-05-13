import React from 'react';
import styled from 'styled-components';
import Stream from './Stream.js';


class Room extends React.Component {
  constructor(props) {
    super(props);
    this.onRemoveClick = this.onRemoveClick.bind(this);

  } // JSON array passed into props as props.streams, room name passed as props.identifier

  onRemoveClick(event) {
    event.preventDefault();
    this.props.onRemoveClick(this.props.identifier);
  }

  render() {
    return <div class="roomDiv">
      <h3 class="roomTitle">{this.props.identifier}</h3>
      {this.props.streams.map((stream) => (
        <Stream key={stream.name} name={stream.name} streamLink={stream.streamLink}
        muteFunction={this.props.muteFunction}/>
      ))}
      <br/><input type="button" onClick={this.onRemoveClick} value="Remove"></input>
    </div>;
  }
}

export default Room;