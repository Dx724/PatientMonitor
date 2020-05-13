import React from 'react';
import styled from 'styled-components';
import streamData from "./streamInfo.json";
import Room from "./Room.js";
import RoomDropdown from "./RoomDropdown.js";

const DEFAULT_VALUE = "default"; //Also in RoomDropdown.js

var confirmationMessage = "Welcome to Patient Monitoring System.";

class PatientMonitor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {dropdownList: streamData.rooms.map((room) => room.identifier),  
      roomObjs: [],
      forceUpdate: true
      //streamData.rooms.map((room) => {<Room streams=room.streams roomNumber=room.identifier>})
    };
    this.onRoomAdd = this.onRoomAdd.bind(this);
    this.onRoomRemove = this.onRoomRemove.bind(this);
  }

  render() {
    return (<div>
    <RoomDropdown options={this.state.dropdownList} changeHandler={this.onRoomAdd}/>
    <p>{confirmationMessage}</p>
    {this.state.roomObjs.map(room => (
      <div>
      <p> {room.identifier}: </p>
      <Room key={room.identifier} identifier={room.identifier} streams={room.streams} onRemoveClick={this.onRoomRemove}/>
      </div>
    ))}
    </div>);
  }

  onRoomAdd(value) {
    console.log(value);
    this.state.roomObjs.push(streamData.rooms[streamData.rooms.map(room => room.identifier).indexOf(value)]);
    this.state.dropdownList.splice(this.state.dropdownList.indexOf(value), 1);
    this.setState({forceUpdate: !this.state.forceUpdate});
    if(value !== DEFAULT_VALUE) {
      confirmationMessage = value + " added!";
    }
  }

  onRoomRemove(roomIdentifier) {
    this.state.dropdownList.push(roomIdentifier);
    this.state.roomObjs.splice(this.state.roomObjs.findIndex((room) => (room.identifier === roomIdentifier)), 1);
    this.setState({forceUpdate: !this.state.forceUpdate});
    confirmationMessage = roomIdentifier + " removed!";
  }
}

export default PatientMonitor;