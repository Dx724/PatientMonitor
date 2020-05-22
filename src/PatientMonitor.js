import React from 'react';
import styled from 'styled-components';
import { Snackbar, Button, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, IconButton } from '@material-ui/core';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import MuiAlert from '@material-ui/lab/Alert';
import { detect } from 'detect-browser';
import streamData from "./streamInfo.json";
import Room from "./Room.js";
import RoomDropdown from "./RoomDropdown.js";
import ColumbiaLogo from "./resources/Columbia_University_Logo-white.png";

const PageContainer = styled.div`
  position: relative;
  min-height: 100vh;
`;

const ContainerDiv = styled.div`
  text-align: center;
  padding-bottom: 9vh;
`;

const DropdownMenuDiv = styled.div`
  margin-bottom: 18px;
`;

const HeaderDiv = styled.div`
  display: flex;
  margin: 0;
  justify-content: center;
  align-items: flex-start;
`;

const InstructionDiv = styled.div`
  margin-left: auto;
  margin-right: 8px;
  margin-top: 8px;
  @media only screen and (max-width: 992px) {
    margin-right: 4px;
    margin-top: 4px;
  }
`;

const TitleDiv = styled.div`
  text-align: center;
  width: 40vw;
  margin-left: 30vw;
`;

const Title = styled.h2`
  margin-top: 19px;
  margin-bottom: 6px;
`;

const RefreshButton = styled.input`
  background: none;
  border: none;
  color: white;
  text-decoration: underline;
  font-size: 0.875rem;
  font-weight: 500;
  padding: 0;
  cursor: pointer;
`;

const Footer = styled.div`
  position: absolute;
  bottom: 0;
  display: flex;
  background-color: #022169;
  width: 100%;
  height: 7vh;
  justify-content: flex-end;
  align-items: center;
`;

const Logo = styled.img`
  height: 4vh;
  width: auto;
  padding-right: 5px;
`;

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const mutePeriod = 15 * 1000;
const initialRefreshPeriod = 60 * 60 * 1000;
const refreshInterval = 60 * 60 * 1000;

const InstructionText = "Use the select menu to add rooms. Clicking the volume indicator will mute all " +
  "other streams for 15 seconds. Clicking it again during the 15 second period will unmute all streams. " +
  "The toggle turns the background noise filter on and off.";

//var soloTimeout = null;

class PatientMonitor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dropdownList: streamData.rooms.map((room) => room.identifier),
      roomObjs: [],
      forceUpdate: true,
      snackbarOpen: false,
      refreshOpen: false,
      snackPack: [],
      messageInfo: undefined,
      instructionOpen: false
    };

    const browser = detect();
    this.notSupportedOpen = false;

    if (browser.name === 'safari' || browser.name === 'ios') {
      this.notSupportedOpen = true;
      console.log("Safari is not supporeted");
    }

    this.roomAddCounter = new Map();
    this.soloTimeout = null;

    for (var i = 0; i < this.state.dropdownList.length; i++) {
      this.roomAddCounter.set(this.state.dropdownList[i], 10000);
    }

    var AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();

    this.incrementRoomAddCounter = this.incrementRoomAddCounter.bind(this);
    this.onRoomAdd = this.onRoomAdd.bind(this);
    this.onRoomRemove = this.onRoomRemove.bind(this);
    this.muteTemp = this.muteTemp.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentDidUpdate = this.componentDidUpdate.bind(this);
    this.handleSnackbarExited = this.handleSnackbarExited.bind(this);
    this.handleSnackbarClose = this.handleSnackbarClose.bind(this);
    this.handleRefreshSnackbarClose = this.handleRefreshSnackbarClose.bind(this);
    this.onRefreshClick = this.onRefreshClick.bind(this);
    this.onInstructionClick = this.onInstructionClick.bind(this);
    this.handleInstructionClose = this.handleInstructionClose.bind(this);
  }

  incrementRoomAddCounter(roomIdentifier) {
    this.roomAddCounter.set(roomIdentifier, this.roomAddCounter.get(roomIdentifier) + 1);
  }

  onRoomAdd(roomIdentifier) {
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

    clearTimeout(this.soloTimeout);

    if (mute) {
      this.soloTimeout = setTimeout(() => {
        for (let stream of document.getElementsByClassName("stream")) {
          stream.muted = false;
        }
      }, mutePeriod);
    }
  }

  componentDidMount() {
    setTimeout(() => {
      setInterval(() => {
        this.setState({ refreshOpen: true });
      }, initialRefreshPeriod);

      this.setState({ refreshOpen: true })
    }, refreshInterval);
  }

  componentDidUpdate() {
    if (this.state.snackPack.length && !this.state.messageInfo) {
      this.setState({
        messageInfo: { ...this.state.snackPack[0] },
        snackPack: this.state.snackPack.slice(1),
        snackbarOpen: true
      });
    }
    else if (this.state.snackPack.length && this.state.messageInfo && this.state.snackbarsnackbarOpen) {
      this.setState({ snackbarOpen: false });
    }
  }

  handleSnackbarExited() {
    this.setState({ messageInfo: undefined });
  }

  handleSnackbarClose(event, reason) {
    this.setState({ snackbarOpen: false });
  };

  handleRefreshSnackbarClose(event, reason) {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({ refreshOpen: false });
  };

  onRefreshClick(event) {
    event.preventDefault();
    window.location.reload();
  }

  onInstructionClick(event) {
    event.preventDefault();
    this.setState({ instructionOpen: true });
  }

  handleInstructionClose() {
    this.setState({ instructionOpen: false });
  }

  render() {
    let instructionDialog = (
      <Dialog onClose={this.handleInstructionClose} open={this.state.instructionOpen}
        aria-labelledby="instruction-dialog-title">
        <DialogTitle id="instruction-dialog-title">Instructions</DialogTitle>
        <DialogContent>
          <DialogContentText id="instruction-dialog-description">
            {InstructionText}
            <br />
            <br />
              We recommend using Firefox.
            </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button autoFocus onClick={this.handleInstructionClose} color="primary" style={{ color: '#1976d2' }}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    );

    let notSupportedDialog = (
      <Dialog open={this.notSupportedOpen} aria-labelledby="notSupported-dialog-title" disableBackdropClick={true} disableEscapeKeyDown={true}>
        <DialogTitle id="notSupported-dialog-title">Not Supported</DialogTitle>
        <DialogContent>
          <DialogContentText id="notSupported-dialog-description">
            Unfortunately, Safari is not supported at this time. Please switch to Firefox or Google Chrome.
          </DialogContentText>
        </DialogContent>
      </Dialog>
    );

    let notificationSnackbar = (
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
    );

    let refreshSnackbar = (
      <Snackbar
        key="refreshSnackbar"
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        open={this.state.refreshOpen}
        onClose={this.handleRefreshSnackbarClose}
      >
        <Alert onClose={this.handleRefreshSnackbarClose} severity="warning">
          {"Please "}
          <RefreshButton type="button" value="refresh" onClick={this.onRefreshClick} />
          {" for improved performance."}
        </Alert>
      </Snackbar>
    );

    return (
      <PageContainer>
        {notSupportedDialog}
        <HeaderDiv>
          <TitleDiv>
            <Title>Alarm Monitoring System</Title>
          </TitleDiv>
          <InstructionDiv>
            <IconButton aria-label="info" onClick={this.onInstructionClick} style={{ color: '#1976d2' }} size='small' >
              <InfoOutlinedIcon style={{ fontSize: '30px' }} />
            </IconButton>
          </InstructionDiv>
          {instructionDialog}
        </HeaderDiv>

        <ContainerDiv>
          <DropdownMenuDiv>
            <RoomDropdown options={this.state.dropdownList} changeHandler={this.onRoomAdd} />
          </DropdownMenuDiv>
          {this.state.roomObjs.map(room => (
            <Room key={room.identifier} identifier={room.identifier} streams={room.streams}
              addCounter={this.roomAddCounter.get(room.identifier)} onRemoveClick={this.onRoomRemove}
              muteFunction={this.muteTemp} audioContext={this.audioCtx} />
          ))}

          {notificationSnackbar}
          {refreshSnackbar}
        </ContainerDiv>

        <Footer>
          <Logo src={ColumbiaLogo} alt="Columbia Logo" />
        </Footer>

      </PageContainer>
    );
  }
}

export default PatientMonitor;