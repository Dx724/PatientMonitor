import React from 'react';
import styled from 'styled-components';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import streamData from "./streamInfo.json";
import Room from "./Room.js";
import RoomDropdown from "./RoomDropdown.js";

const ContainerDiv = styled.div`
  text-align: center;
`;

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const confirmationMessage = "Welcome to Patient Monitoring System.";

var soloTimeout = null;

class PatientMonitor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {dropdownList: streamData.rooms.map((room) => room.identifier),  
      roomObjs: [],
      forceUpdate: true,
      snackbarsnackbarOpen: false,
      snackPack: [],
      messageInfo: undefined
    };

    this.roomAddCounter = new Map();

    for (var i = 0; i < this.state.dropdownList.length; i++) {
      this.roomAddCounter.set(this.state.dropdownList[i], 10000);
    }

    this.onRoomAdd = this.onRoomAdd.bind(this);
    this.onRoomRemove = this.onRoomRemove.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    this.handleSnackbarExited = this.handleSnackbarExited.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
  }

  incrementRoomAddCounter(roomIdentifier) {
    this.roomAddCounter.set(roomIdentifier, this.roomAddCounter.get(roomIdentifier) + 1);
  }

  onRoomAdd(roomIdentifier) {
    console.log(roomIdentifier + " added");
    this.incrementRoomAddCounter(roomIdentifier);
    let message = roomIdentifier + " added!"
    this.state.roomObjs.push(streamData.rooms[streamData.rooms.map(room => room.identifier).indexOf(roomIdentifier)]);
    this.state.dropdownList.splice(this.state.dropdownList.indexOf(roomIdentifier), 1);
    this.state.snackPack.push({ message, key: new Date().getTime() });
    this.setState({
      forceUpdate: !this.state.forceUpdate,
    });
  }

  onRoomRemove(roomIdentifier) {
    console.log(roomIdentifier + " removed");
    let message = roomIdentifier + " removed!"
    this.state.dropdownList.push(roomIdentifier);
    this.state.roomObjs.splice(this.state.roomObjs.findIndex((room) => (room.identifier === roomIdentifier)), 1);
    this.state.snackPack.push({ message, key: new Date().getTime() });
    this.setState({
      forceUpdate: !this.state.forceUpdate
    });
  }

  muteTemp(mute) {
    for (let stream of document.getElementsByClassName("stream")) {
      stream.muted = mute;
    }

    clearTimeout(soloTimeout);

    if (mute) {
      soloTimeout = setTimeout(() => {
        for (let stream of document.getElementsByClassName("stream")) {
          stream.muted = false;
        }
      }, 15*1000);
    }
  }

  componentDidUpdate() {
    if (this.state.snackPack.length && !this.state.messageInfo) {
      this.setState({ 
        messageInfo: {...this.state.snackPack[0]},
        snackPack: this.state.snackPack.slice(1),
        snackbarOpen: true
      });
    }
    else if (this.state.snackPack.length && this.state.messageInfo && this.state.snackbarsnackbarOpen) {
      this.setState({snackbarOpen: false});
    }
  }

  handleSnackbarExited() {
    this.setState({messageInfo: undefined});
  }

  handleSnackbarClose(event, reason){ 
    this.setState({snackbarOpen: false});
  };

  render() {
    return (
      <ContainerDiv>
        <RoomDropdown options={this.state.dropdownList} changeHandler={this.onRoomAdd}/>
        <p>{confirmationMessage}</p>
        {this.state.roomObjs.map(room => (
          <Room key={room.identifier} identifier={room.identifier} streams={room.streams} addCounter={this.roomAddCounter.get(room.identifier)} onRemoveClick={this.onRoomRemove} muteFunction={this.muteTemp}/>
        ))}
        <Snackbar
          key={this.state.messageInfo ? this.state.messageInfo.key : undefined}
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }} 
          open={this.state.snackbarOpen}
          autoHideDuration={3000}
          onClose={this.handleSnackbarClose}
          onExited={this.handleSnackbarExited}
          >
            <Alert onClose={this.handleSnackbarClose} severity="success">
              {this.state.messageInfo ? this.state.messageInfo.message : undefined}
            </Alert>
          </Snackbar>
      </ContainerDiv>
    );
  }
}

export default PatientMonitor;