import React from 'react';
import styled from 'styled-components';
import Stream from './Stream.js';


const RoomDiv = styled.div`
  display: inline-block;
  background-color: aliceblue;
  width: 46vw;
  margin: 5px;
  padding: 1vw;
`;

class Room extends React.Component {
  constructor(props) {
    super(props);
    this.onRemoveClick = this.onRemoveClick.bind(this);
    this.streamProxy = this.streamProxy.bind(this);
    this.componentWillUnmount = this.componentWillUnmount(this);
  } // JSON array passed into props as props.streams, room name passed as props.identifier

  onRemoveClick(event) {
    event.preventDefault();
    var mediaElement;
    for (let i=0; i < this.props.streams.length; i++) {
      mediaElement = document.getElementById("audio_" + this.props.streams[i].name);
      mediaElement.removeAttribute("src");
      mediaElement.load();

      mediaElement = document.getElementById("audio2_" + this.props.streams[i].name);
      mediaElement.removeAttribute("src");
      mediaElement.load();
    }
    this.props.onRemoveClick(this.props.identifier);
  }

  streamProxy(stream) {
    return stream.streamLink + "_" + this.props.addCounter;
  }

  componentDidMount () {
    console.log("mounted");
  }

  componentWillUnmount(){
    console.log("unmounted");
    

  }

  render() {
    console.log("render");
    return <RoomDiv>
      <h3 class="roomTitle">{this.props.identifier}</h3>
      {this.props.streams.map((stream) => (
        <Stream key={stream.name} name={stream.name} streamLink={stream.streamLink/*this.streamProxy(stream)*/} /*Uncomment left for proxy*/
        muteFunction={this.props.muteFunction}/>
      ))}
      <br/><input type="button" onClick={this.onRemoveClick} value="Remove"></input>
    </RoomDiv>;
  }
}

export default Room;