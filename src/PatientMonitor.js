import React from 'react';
import styled from 'styled-components';
import streamData from "./streamInfo.json";
import Room from "./Room.js";
import RoomDropdown from "./RoomDropdown.js";

const DEFAULT_VALUE = "default"; //Also in RoomDropdown.js

const ContainerDiv = styled.div`
  text-align: center;
`;

var confirmationMessage = "Welcome to Patient Monitoring System.";

var soloTimeout = null;

var roomAddCounter = new Map();

class PatientMonitor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {dropdownList: streamData.rooms.map((room) => room.identifier),  
      roomObjs: [],
      forceUpdate: true
    };

    for (var i = 0; i < this.state.dropdownList.length; i++) {
      roomAddCounter.set(this.state.dropdownList[i], 10000);
    }

    this.onRoomAdd = this.onRoomAdd.bind(this);
    this.onRoomRemove = this.onRoomRemove.bind(this);
  }

  incrementRoomAddCounter(roomIdentifier) {
    roomAddCounter.set(roomIdentifier, roomAddCounter.get(roomIdentifier) + 1);
  }

  onRoomAdd(roomIdentifier) {
    console.log(roomIdentifier + " added");
    this.incrementRoomAddCounter(roomIdentifier);

    this.state.roomObjs.push(streamData.rooms[streamData.rooms.map(room => room.identifier).indexOf(roomIdentifier)]);
    this.state.dropdownList.splice(this.state.dropdownList.indexOf(roomIdentifier), 1);
    this.setState({forceUpdate: !this.state.forceUpdate});

    if(roomIdentifier !== DEFAULT_VALUE) {
      confirmationMessage = roomIdentifier + " added!";
    }
  }

  onRoomRemove(roomIdentifier) {
    console.log(roomIdentifier + " removed");
    this.state.dropdownList.push(roomIdentifier);
    this.state.roomObjs.splice(this.state.roomObjs.findIndex((room) => (room.identifier === roomIdentifier)), 1);
    this.setState({forceUpdate: !this.state.forceUpdate});
    confirmationMessage = roomIdentifier + " removed!";
  }

  muteTemp() {
    for (let stream of document.getElementsByClassName("stream")) {
      stream.muted = true;
    }
    clearTimeout(soloTimeout);
    soloTimeout = setTimeout(() => {
      for (let stream of document.getElementsByClassName("stream")) {
        stream.muted = false;
      }
    }, 15*1000);
  }

  render() {
    return (
    <ContainerDiv>
      <RoomDropdown options={this.state.dropdownList} changeHandler={this.onRoomAdd}/>
      <p>{confirmationMessage}</p>
      {this.state.roomObjs.map(room => (
        <Room key={room.identifier} identifier={room.identifier} streams={room.streams} addCounter={roomAddCounter.get(room.identifier)} onRemoveClick={this.onRoomRemove} muteFunction={this.muteTemp}/>
      ))}
    </ContainerDiv>);
  }
}

export default PatientMonitor;