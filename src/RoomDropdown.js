import React from 'react';
import styled from 'styled-components';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

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

  onChange (event) {
    event.preventDefault();
    this.props.changeHandler(event.target.value);
    this.setState({
      open: true,
      value: event.target.value
    });
  }

  handleClose (event, reason){
    this.setState({open: false});
  };

  //Use NativeSelect for mobile
  
  render() {
    return( 
      <div>
        <FormControl style={{minWidth: 120}}>
          <InputLabel /*htmlFor="roomSelector"*/ id="select-label">Rooms </InputLabel>
          <Select id="roomSelector" labelId="select-label" value={''} onChange={this.onChange}>
            {this.props.options.map(option => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </div>
    );
  }
}

export default RoomDropdown;