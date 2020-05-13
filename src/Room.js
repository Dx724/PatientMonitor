import React from 'react';
import styled from 'styled-components';

class Room extends React.Component {
  constructor(props) {
    super(props);
  } // JSON array passed into props as props.streams, room name passed as props.identifier

  render() {
    return <>
      {this.props.streams.map((stream) => (
        <p key={stream.name}>{stream.name}</p>
      ))}
    </>;
  }
}

export default Room;