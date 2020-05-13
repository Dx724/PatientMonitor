import React from 'react';
import styled from 'styled-components';

const DEFAULT_VALUE = "default"; //Also in PatientMonitor.js

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
    return <div><label htmlFor="roomSelector">Rooms: </label><select id="roomSelector" value={DEFAULT_VALUE} onChange={this.onChange}>
    <option value={DEFAULT_VALUE}>---</option>
      {this.props.options.map(option => (
        <option key={option} value={option}>{option}</option>
      ))}
    </select>
    </div>;
  }
}

export default RoomDropdown;