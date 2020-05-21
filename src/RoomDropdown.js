import React from 'react';
import { FormControl, Select, NativeSelect, InputLabel, MenuItem } from '@material-ui/core';
import { Desktop, MobileAndTablet } from "react-responsive-simple";

class RoomDropdown extends React.Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.state = {
      open: false,
      value: ''
    };
  }

  onChange(event) {
    event.preventDefault();
    this.props.changeHandler(event.target.value);
    this.setState({
      open: true,
      value: event.target.value
    });
  }

  handleClose(event, reason) {
    this.setState({ open: false });
  };

  render() {
    return (
      <>
        <Desktop>
            <FormControl style={{ minWidth: 120 }}>
              <InputLabel id="select-label">Rooms </InputLabel>
              <Select id="roomSelector" labelId="select-label" value={''} onChange={this.onChange}>
                {this.props.options.map(option => (
                  <MenuItem key={option} value={option}>{option}</MenuItem>
                ))}
              </Select>
            </FormControl>
        </Desktop>

        <MobileAndTablet>
            <FormControl style={{ minWidth: 120 }}>
              <InputLabel htmlFor="roomSelectorMobile" id="select-label-mobile">Rooms </InputLabel>
              <NativeSelect id="roomSelectorMobile" value={'default'} onChange={this.onChange}>
                <option value={'default'}>---</option>
                {this.props.options.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </NativeSelect>
            </FormControl>
        </MobileAndTablet>
      </>
    );
  }
}

export default RoomDropdown;