import React from 'react';
import styled from 'styled-components';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import MenuItem from '@material-ui/core/MenuItem';
//import IconButton from '@material-ui/core/IconButton';
//import CloseIcon from '@material-ui/icons/Close';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

class RoomDropdown extends React.Component {
  
  constructor(props) {
        super(props);
        this.onChange = this.onChange.bind(this);
        this.handleClose = this.handleClose.bind(this);
        this.state = {open: false,
                      value: ''
        };
  }

  onChange (event) {
    event.preventDefault();
    this.props.changeHandler(event.target.value);
    this.setState({open: true,
                  value: event.target.value});
    this.setState({value: event.target.value});
  }

  handleClose (event, reason){
    this.setState({open: false});
  };
  
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

      <Snackbar 
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }} 
        open={this.state.open} autoHideDuration={6000} onClose={this.handleClose}
        /*message={"Successfully added " + this.state.value +"!"} 
        action={
            <IconButton size="small" aria-label="close" color="inherit" onClick={this.handleClose}>
              <CloseIcon fontSize="small" />
            </IconButton>
        }*/>
        <Alert onClose={this.handleClose} severity="success">
          Added {this.state.value}!
        </Alert>
      </Snackbar>
      
    </div>
    );
  }
}

export default RoomDropdown;

/*<Alert onClose={this.handleClose} severity="success">
          Added {this.state.value}!
        </Alert>
        </Snackbar>*/