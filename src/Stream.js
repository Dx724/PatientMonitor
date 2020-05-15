import React from 'react';
import styled from 'styled-components';
import AudioSpectrum from "react-audio-spectrum";
import Audio from './Audio.js';

const SoloButton = styled.input`
	background-color:#768d87;
	border-radius:42px;
	border:1px solid #566963;
	display:inline-block;
	cursor:pointer;
	color:#ffffff;
	font-family:Arial;
	font-size:17px;
	padding:7px 7px;
	text-decoration:none;
	text-shadow:0px 1px 0px #2b665e;
&:active {
	position:relative;
	top:1px;
  background-color: red;
}
`;

var mediaElement;

class Stream extends React.Component {
  constructor(props) {
    super(props);
    var AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();

    this.onSoloClick = this.onSoloClick.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount(this);
  }

  componentDidMount() {
    // Initialize an audio context
    const audioElement = document.getElementById("audio_" + this.props.name);
    const audioStream = this.audioCtx.createMediaElementSource(audioElement);
    audioStream.connect(this.audioCtx.destination);
    if (this.audioCtx.state === 'suspended') {
		  this.audioCtx.resume();
	  }
    console.log("stream mounted");
  }

  componentWillUnmount() {
    //this.audioCtx.close();
    console.log("stream unmounted");
  }

  onSoloClick(event) {
    event.preventDefault();
    this.props.muteFunction();
    document.getElementById("audio_" + this.props.name).muted = false;
  }

  render() {
    console.log("stream rendered");
    return <div class="streamDiv">
          <SoloButton type="button" value="Solo" onClick={this.onSoloClick}/>
          <p class="streamTitle">{this.props.name} 🔊</p>
          <audio crossOrigin="anonymous" class="stream" id={"audio_" + this.props.name} autoPlay>
            <source src={this.props.streamLink}></source>
          </audio>

        </div>;
  }
}

export default Stream;