import React from 'react';
import styled from 'styled-components';
import streamData from "./streamInfo.json";

const DEFAULT_VALUE = "default";

class PatientMonitor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {dropdownList: streamData.rooms,  
      roomObjs: []
      //streamData.rooms.map((room) => {<Room streams=room.streams roomNumber=room.identifier>})
    };
  }

  render() {
    return (<div>
    <RoomDropdown options={this.state.dropdownList} changeHandler={this.handleChange}/>
    </div>);
  }

  handleChange(value) {
    console.log(value);
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
  }
  
  render() {
    let confirmation;
    if (this.state.value == DEFAULT_VALUE){
      confirmation = "";  
    }
    else {
      confirmation = <p>{this.state.value + " added!"}</p>;
    }

    return <div><select value={DEFAULT_VALUE} onChange={this.onChange}>
    <option value={DEFAULT_VALUE}>---</option>
      {this.props.options.map(option => (
        <option value={option.identifier}>{option.identifier}</option>
      ))}
    </select>
    {confirmation}</div>;
  }
}

export default PatientMonitor;