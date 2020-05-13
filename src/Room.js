import React from 'react';
import styled from 'styled-components';
import Stream from './Stream.js';

const RoomContainer = styled.div`
  background-color: purple;
`;


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
    return <RoomContainer>
      {this.props.streams.map((stream) => (
        <Stream key={stream.name} name={stream.name} streamLink={stream.streamLink}/>
      ))}
      <input type="button" onClick={this.onRemoveClick} value="Remove"></input>
    </RoomContainer>;
  }
}

export default Room;