import React from 'react';
import styled from 'styled-components';
import Button from '@material-ui/core/Button';
import CloseIcon from '@material-ui/icons/Close';
import Stream from './Stream.js';


const RoomDiv = styled.div`
  display: inline-block;
  background-color: aliceblue;
  width: 46vw;
  margin: 5px;
  padding: 1vw;
  @media only screen and (max-width: 992px) {
    width: 90vw;
    padding: 3vw;
  }
`;

const ButtonDiv = styled.div`
  margin-top: 18px;
`;

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.onRemoveClick = this.onRemoveClick.bind(this);
    this.streamProxy = this.streamProxy.bind(this);
    this.componentWillUnmount = this.componentWillUnmount(this);
    this.streamRefs = [];
  } // JSON array passed into props as props.streams, room name passed as props.identifier

  onRemoveClick(event) {
    event.preventDefault();
    for (let i = 0; i < this.streamRefs.length; i++) {
      if (this.streamRefs[i].cleanUp()) { // returns solo value of the stream
        this.props.muteFunction(false);
      }
    }
    this.props.onRemoveClick(this.props.identifier);
  }

  streamProxy(stream) {
    return stream.streamLink + "_" + this.props.addCounter;
  }

  componentDidMount() {
    //console.log("mounted");
  }

  componentWillUnmount() {
    //console.log("unmounted");
  }

  render() {
    //console.log("render");
    return (
      <RoomDiv>
        <h3 className="roomTitle">{this.props.identifier}</h3>
        {this.props.streams.map((stream, i) => (
          <Stream key={stream.name} name={stream.name} streamLink={stream.streamLink/*this.streamProxy(stream)*/} /*Uncomment left for proxy*/
            muteFunction={this.props.muteFunction} audioContext={this.props.audioContext}
            ref={ref => { this.streamRefs[i] = ref; }}
          />
        ))}
        <ButtonDiv>
          <Button variant="contained" color="primary" onClick={this.onRemoveClick} style={{ background: '#1976d2' }}
            startIcon={<CloseIcon fontSize="small" />}>
            Remove
          </Button>
        </ButtonDiv>
      </RoomDiv>
    );
  }
}

export default Room;