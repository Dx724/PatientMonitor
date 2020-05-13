import React from 'react';
import styled from 'styled-components';

class Room extends React.Component {
  constructor(props) {
    super(props);
  } // JSON array passed into props as props.streams, room name passed as props.roomNumber

  render() {
    return <p>{props.streams}</p>;
  }
}

export default Room;