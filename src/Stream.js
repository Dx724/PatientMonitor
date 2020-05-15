import React from 'react';
import styled from 'styled-components';
import AudioSpectrum from "react-audio-spectrum";
import Spectrogram from '../node_modules/spectrogram';
import chroma from "chroma-js";

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

const StreamTitle = styled.p`
  display: inline-block;
  margin-left: 10px;
  margin-right: 10px;
`;

const AudioStream = styled.audio`
  display: none;
`;

const ToggleDiv = styled.div`
  position: relative;
`;

const ToggleLabel = styled.label`
  position: absolute;
  top: 0;
  left: 0;
  width: 42px;
  height: 26px;
  border-radius: 15px;
  background: #bebebe;
  cursor: pointer;
  &::after {
    content: "";
    display: block;
    border-radius: 50%;
    width: 18px;
    height: 18px;
    margin: 3px;
    background: #ffffff;
    box-shadow: 1px 3px 3px 1px rgba(0, 0, 0, 0.2);
    transition: 0.2s;
  }
`;

const Toggle = styled.input`
  opacity: 0;
  z-index: 1;
  border-radius: 15px;
  width: 42px;
  height: 26px;
  &:checked + ${ToggleLabel} {
    background: #4fbe79;
    &::after {
      content: "";
      display: block;
      border-radius: 50%;
      width: 18px;
      height: 18px;
      margin-left: 21px;
      transition: 0.2s;
    }
  }
`;

class Stream extends React.Component {
  constructor(props) {
    super(props);
    this.state = {toggleValue: true};

    var AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();
    this.audioCtx2 = new AudioContext();

    var fStart = 750;
    var fEnd = 2800;
    var fCenter = (fStart + fEnd) / 2;
    var qFactor = fCenter / (fEnd - fStart);

    this.bandpassFilter = this.audioCtx.createBiquadFilter();
    this.bandpassFilter.type = "bandpass";
    this.bandpassFilter.frequency.value = fCenter;
    this.bandpassFilter.Q.value = qFactor;

    this.bandpassFilter2 = this.audioCtx2.createBiquadFilter();
    this.bandpassFilter2.type = "bandpass";
    this.bandpassFilter2.frequency.value = fCenter;
    this.bandpassFilter2.Q.value = qFactor;

    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.value = 1;

    this.gainNode2 = this.audioCtx2.createGain();
    this.gainNode2.gain.value = 1;

    this.onSoloClick = this.onSoloClick.bind(this);
    this.onToggleChange = this.onToggleChange.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount(this);
  }

  componentDidMount() {
    // Initialize an audio context
    const audioElement = document.getElementById("audio_" + this.props.name);
    const audioElement2 = document.getElementById("audio2_" + this.props.name);

    this.audioStream = this.audioCtx.createMediaElementSource(audioElement);
    this.audioStream2 = this.audioCtx2.createMediaElementSource(audioElement2);
  
    var spectrogram = require('spectrogram');
    var spectro = Spectrogram(document.getElementById("audio_canvas_" + this.props.name), {
      canvas: {
        width: 250,
        height: 60
      },
      audio: {
        enable: false
      },
      colors: function(steps) {
        var baseColors = [[0,0,255,1], [0,255,255,1], [0,255,0,1], [255,255,0,1], [ 255,0,0,1]];
        var positions = [0, 0.15, 0.30, 0.50, 0.75];
     
        var scale = new chroma.scale(baseColors, positions)
        .domain([0, steps]);
     
        var colors = [];
     
        for (var i = 0; i < steps; ++i) {
          var color = scale(i);
          colors.push(color.hex());
        }
     
        return colors;
      }});


    var analyser = this.audioCtx2.createAnalyser();
    analyser.smoothingTimeConstant = 0;
    analyser.fftSize = 2048;

    this.audioStream.connect(this.bandpassFilter);
    this.bandpassFilter.connect(this.gainNode);
    this.gainNode.connect(this.audioCtx.destination);

    this.audioStream2.connect(this.bandpassFilter2);
    this.bandpassFilter2.connect(this.gainNode2);
    this.gainNode2.connect(analyser);
    
    spectro.connectSource(analyser, this.audioCtx2);
    spectro.start();

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
    document.getElementById("audio2_" + this.props.name).muted = false;
  }

  onToggleChange(event) {
    this.setState({
      toggleValue: event.target.checked
    })
    this.toggleFilter(event.target.checked);
  }

  toggleFilter(filterOn) {
    if (filterOn) {
      this.audioStream.disconnect(this.gainNode);
      this.audioStream.connect(this.bandpassFilter);
      this.bandpassFilter.connect(this.gainNode);

      this.audioStream2.disconnect(this.gainNode2);
      this.audioStream2.connect(this.bandpassFilter2);
      this.bandpassFilter2.connect(this.gainNode2);
    }
    else {
      this.bandpassFilter.disconnect(this.gainNode);
      this.bandpassFilter2.disconnect(this.gainNode2);

      this.audioStream.disconnect(this.bandpassFilter);
      this.audioStream2.disconnect(this.bandpassFilter2);

      this.audioStream.connect(this.gainNode);
      this.audioStream2.connect(this.gainNode2);
    }
  }

  /*
  <AudioSpectrum
id={"audio-canvas_" + this.props.name}
height={35}
width={250}
audioId={"audio_" + this.props.name}
capColor={'white'}
capHeight={2}
meterWidth={1}
meterCount={256}
meterColor={[
{stop: 0, color: 'red'},
{stop: 0.5, color: '#0CD7FD'},
{stop: 1, color: 'red'}
]}
gap={0}
/>*/


  render() {
    console.log("stream rendered");
    return <div class="streamDiv">
          <SoloButton type="button" value="Solo" onClick={this.onSoloClick}/>
          <StreamTitle>{this.props.name} 🔊</StreamTitle>
          <canvas id={"audio_canvas_" + this.props.name}> </canvas>
          <audio crossOrigin="anonymous" class="stream" id={"audio_" + this.props.name} autoPlay>
            <source src={this.props.streamLink}></source>
          </audio>
          <audio crossOrigin="anonymous" class="fakestream" id={"audio2_" + this.props.name} autoPlay>
            <source src={this.props.streamLink}></source>
          </audio>

          <ToggleDiv>
            <Toggle id={"checkbox_" + this.props.name} type="checkbox" onChange={this.onToggleChange} 
            defaultChecked={true} value={this.state.toggleValue}/>
            <ToggleLabel htmlFor={"checkbox_" + this.props.name} />
          </ToggleDiv>

        </div>;
  }
}

export default Stream;