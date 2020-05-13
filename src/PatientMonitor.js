import React from 'react';
import styled from 'styled-components';
import streamData from "./streamInfo.json";
import Room from "./Room.js";

const DEFAULT_VALUE = "default";

var confirmationMessage = "Welcome to Patient Monitoring System.";

class PatientMonitor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {dropdownList: streamData.rooms.map((room) => room.identifier),  
      roomObjs: [],
      forceUpdate: true
      //streamData.rooms.map((room) => {<Room streams=room.streams roomNumber=room.identifier>})
    };
    this.handleChange = this.handleChange.bind(this);
    this.onRoomRemove = this.onRoomRemove.bind(this);
  }

  render() {
    return (<div>
    <RoomDropdown options={this.state.dropdownList} changeHandler={this.handleChange}/>
    <p>{confirmationMessage}</p>
    {this.state.roomObjs.map(room => (
      <div>
      <p> {room.identifier}: </p>
      <Room key={room.identifier} identifier={room.identifier} streams={room.streams} onRemoveClick={this.onRoomRemove}/>
      </div>
    ))}
    </div>);
  }

  handleChange(value) {
    console.log(value);
    this.state.roomObjs.push(streamData.rooms[streamData.rooms.map(room => room.identifier).indexOf(value)]);
    this.state.dropdownList.splice(this.state.dropdownList.indexOf(value), 1);
    this.setState({forceUpdate: !this.state.forceUpdate});
  }

  onRoomRemove(roomIdentifier) {
    this.state.dropdownList.push(roomIdentifier);
    this.state.roomObjs.splice(this.state.roomObjs.findIndex((room) => (room.identifier == roomIdentifier)), 1);
    this.setState({forceUpdate: !this.state.forceUpdate});
    confirmationMessage = roomIdentifier + " removed!";
  }
}

class RoomDropdown extends React.Component {

  constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.state = {value: DEFAULT_VALUE};
  }

  onChange (event) {
    event.preventDefault();
    this.props.changeHandler(event.target.value);
    this.setState({value: event.target.value});
    if(this.state.value != DEFAULT_VALUE) {
      confirmationMessage = this.state.value + " added!";
    }
  }
  
  render() {
    return <div><label htmlFor="roomSelector">Rooms: </label><select id="roomSelector" value={DEFAULT_VALUE} onChange={this.onChange}>
    <option value={DEFAULT_VALUE}>---</option>
      {this.props.options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
    </div>;
  }
}

export default PatientMonitor;