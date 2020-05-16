import React from 'react';
import styled from 'styled-components';
//import AudioSpectrum from "react-audio-spectrum";
//import Spectrogram from '../node_modules/spectrogram';
import Spectrogram from './spectrogram';
import Switch from '@material-ui/core/Switch';
import IconButton from '@material-ui/core/IconButton';
import VolumeUpRoundedIcon from '@material-ui/icons/VolumeUpRounded';
import VolumeOffRoundedIcon from '@material-ui/icons/VolumeOffRounded';
import { withStyles } from '@material-ui/core/styles';
import TimerButton from './TimerButton.js'
import chroma from "chroma-js";

const StreamDiv = styled.div`
  background-color: lightsteelblue;
  display: flex;
  justify-content: space-around;
  align-items: center;
  margin: 5px;
  padding: 5px;
  border: 3px solid white;
  width: calc(100% - 30px);
`;

const StreamTitle = styled.p`
  display: inline-block;
  margin-left: 10px;
  margin-right: 10px;
`;

/*const AudioStream = styled.audio`
  display: none;
`;*/

const ToggleDiv = styled.div`
  position: relative;
`;

const BlueSwitch = withStyles({
  switchBase: {
    color: '#fafafa',
    '&$checked': {
      color: '#1976d2',
    },
    '&$checked + $track': {
      backgroundColor: '#1976d2',
    },
  },
  checked: {},
  track: {},
})(Switch);

var soloTimeout = null;

class Stream extends React.Component {
  constructor(props) {
    super(props);
    this.state = {toggleValue: true,
                  solo: false,
                  muted: false};

    var AudioContext = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AudioContext();

    var fStart = 750;
    var fEnd = 2800;
    var fCenter = (fStart + fEnd) / 2;
    var qFactor = fCenter / (fEnd - fStart);

    this.bandpassFilter = this.audioCtx.createBiquadFilter();
    this.bandpassFilter.type = "bandpass";
    this.bandpassFilter.frequency.value = fCenter;
    this.bandpassFilter.Q.value = qFactor;

    this.gainNode = this.audioCtx.createGain();
    this.gainNode.gain.value = 1;

    this.onSoloClick = this.onSoloClick.bind(this);
    this.onToggleChange = this.onToggleChange.bind(this);
    this.toggleFilter = this.toggleFilter.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount(this);
  }

  componentDidMount() {
    // Initialize an audio context
    const audioElement = document.getElementById("audio_" + this.props.name);

    audioElement.addEventListener('volumechange', () => {
      console.log("Audio event");
      if (audioElement.muted) {
        console.log(this.props.name + " audio event");
        if (this.state.solo) {
          this.setState({solo: false});
        }
        this.setState({muted: true});
      }
      else {
        this.setState({muted: false});
      }
      
    }, false);

    this.audioStream = this.audioCtx.createMediaElementSource(audioElement);
 
    var spectro = Spectrogram(document.getElementById("audio_canvas_" + this.props.name), {
      canvas: {
        width: 250,
        height: 60
      },
      audio: {
        enable: true
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


    var analyser = this.audioCtx.createAnalyser();
    analyser.smoothingTimeConstant = 0;
    analyser.fftSize = 2048;

    this.audioStream.connect(this.bandpassFilter);
    this.bandpassFilter.connect(this.gainNode);
    this.gainNode.connect(analyser);
    analyser.connect(this.audioCtx.destination);
    
    spectro.connectSource(analyser, this.audioCtx);
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

    if (!this.state.solo) {
      this.props.muteFunction(true);
      document.getElementById("audio_" + this.props.name).muted = false;
      this.setState({solo: true, muted: false});
      var self = this;
      
      clearTimeout(soloTimeout);
      soloTimeout = setTimeout(() => {
        self.setState({solo: false});
      }, 15*1000);
    }
    else {
      clearTimeout(soloTimeout);
      this.setState({solo: false, muted: false});
      this.props.muteFunction(false);
    }
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
    }
    else {
      this.bandpassFilter.disconnect(this.gainNode);
      this.audioStream.disconnect(this.bandpassFilter);
      this.audioStream.connect(this.gainNode);
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
    console.log(this.props.name + "stream rendered");
    let soloButton;
    let icon;

    if(this.state.solo) {
      soloButton = <TimerButton onClick={this.onSoloClick}/>;
    }
    else {
      if (this.state.muted) {
        icon = <VolumeOffRoundedIcon fontSize='large' style={{fill: "black"}}/>;
      }
      else {
        icon = <VolumeUpRoundedIcon fontSize='large' style={{fill: "black"}}/>;
      }
      soloButton = <IconButton type="button" onClick={this.onSoloClick}>
          {icon}
        </IconButton>;
    }

    return <StreamDiv>
          {soloButton}
          <StreamTitle>{this.props.name} 🔊</StreamTitle>
          <canvas id={"audio_canvas_" + this.props.name} style={{borderRadius: '4px'}}> </canvas>
          <audio style={{display: 'none'}} crossOrigin="anonymous" className="stream" id={"audio_" + this.props.name} autoPlay>
            <source src={this.props.streamLink}></source>
          </audio>

          <ToggleDiv>
            <BlueSwitch id={"checkbox_" + this.props.name} type="checkbox" onChange={this.onToggleChange} 
            defaultChecked={true} value={this.state.toggleValue} style={{colorPrimary: '#1976d2'}} color="primary"/>
          </ToggleDiv>

        </StreamDiv>;
  }
}

export default Stream;