import React from 'react';
import styled from 'styled-components';
//import AudioSpectrum from "react-audio-spectrum";
import Spectrogram from './spectrogram';
import Switch from '@material-ui/core/Switch';
import IconButton from '@material-ui/core/IconButton';
import VolumeUpRoundedIcon from '@material-ui/icons/VolumeUpRounded';
import VolumeOffRoundedIcon from '@material-ui/icons/VolumeOffRounded';
import Tooltip from '@material-ui/core/Tooltip';
import { withStyles } from '@material-ui/core/styles';
import TimerButton from './TimerButton.js'
import chroma from "chroma-js";

const StreamDiv = styled.div`
  background-color: lightsteelblue;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin: 5px;
  padding: 5px;
  border: 3px solid white;
  width: calc(100% - 30px);
`;

const StreamTitleDiv = styled.div`
  display: flex;
  width: 200px;
  height: 25px;
  justify-content: center;
  align-items: center;
`;

const StreamTitle = styled.b`
  display: inline-block;
  margin-left: 5px;
  margin-right: 5px;
`;

const SpectogramCanvas = styled.canvas`
  border-radius: 4px;
`;

const AudioStream = styled.audio`
  display: none;
`;

const ToggleDiv = styled.div`
  position: relative;
`;

const BlueSwitch = withStyles({
  colorPrimary: '#1976d2',
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
    this.state = {
      toggleValue: true,
      solo: false,
      muted: false
    };

    this.audioCtx = this.props.audioContext;
    this.audioElement = null;
    this.spectro = null;

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
    this.cleanUp = this.cleanUp.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
    this.componentWillUnmount = this.componentWillUnmount(this);
  }

  componentDidMount() {
    // Initialize an audio context
    this.audioElement = document.getElementById("audio_" + this.props.name);

    this.audioElement.addEventListener('volumechange', () => {
      if (this.audioElement.muted) {
        if (this.state.solo) {
          this.setState({ solo: false });
        }
        this.setState({ muted: true });
      }
      else {
        this.setState({ muted: false });
      }

    }, false);

    this.audioStream = this.audioCtx.createMediaElementSource(this.audioElement);

    this.spectro = Spectrogram(document.getElementById("audio_canvas_" + this.props.name), {
      canvas: {
        width: 300,
        height: 80
      },
      audio: {
        enable: true
      },
      colors: function (steps) {
        var baseColors = [[0, 0, 255, 1], [0, 255, 255, 1], [0, 255, 0, 1], [255, 255, 0, 1], [255, 0, 0, 1]];
        var positions = [0, 0.15, 0.30, 0.50, 0.75];

        var scale = new chroma.scale(baseColors, positions)
          .domain([0, steps]);

        var colors = [];

        for (var i = 0; i < steps; ++i) {
          var color = scale(i);
          colors.push(color.hex());
        }

        return colors;
      }
    });


    var analyser = this.audioCtx.createAnalyser();
    analyser.smoothingTimeConstant = 0;
    analyser.fftSize = 1024;

    this.audioStream.connect(this.bandpassFilter);
    this.bandpassFilter.connect(this.gainNode);
    this.gainNode.connect(analyser);
    this.gainNode.connect(this.audioCtx.destination);

    this.spectro.connectSource(analyser, this.audioCtx);
    this.spectro.start();

    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    console.log("stream mounted");
  }

  componentWillUnmount() {
    //this.audioCtx.close();
    console.log("stream unmounted");
  }

  cleanUp() {
    clearTimeout(soloTimeout);
    this.spectro.forceStop();
    this.audioElement.removeAttribute("src");
    this.audioElement.load();
  }

  onSoloClick(event) {
    event.preventDefault();

    if (!this.state.solo) {
      this.props.muteFunction(true);
      document.getElementById("audio_" + this.props.name).muted = false;
      this.setState({ solo: true, muted: false });
      var self = this;

      clearTimeout(soloTimeout);
      soloTimeout = setTimeout(() => {
        self.setState({ solo: false });
      }, 15 * 1000);
    }
    else {
      clearTimeout(soloTimeout);
      this.setState({ solo: false, muted: false });
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

    if (this.state.solo) {
      soloButton = <TimerButton onClick={this.onSoloClick} />;
    }
    else {
      if (this.state.muted) {
        icon = <VolumeOffRoundedIcon fontSize='large' style={{ fill: "black" }} />;
      }
      else {
        icon = <VolumeUpRoundedIcon fontSize='large' style={{ fill: "black" }} />;
      }
      soloButton = <IconButton type="button" onClick={this.onSoloClick} size='small'>
        <Tooltip title={"Mute others"} arrow>
          {icon}
        </Tooltip>
      </IconButton>;
    }

    return (
      <StreamDiv>
        {soloButton}
        <StreamTitleDiv>
          <StreamTitle>{this.props.name + " "}
            <span role="img" aria-label="volume-emoji"> 🔊 </span>
          </StreamTitle>
        </StreamTitleDiv>
        <SpectogramCanvas id={"audio_canvas_" + this.props.name} />
        <AudioStream crossOrigin="anonymous" className="stream" id={"audio_" + this.props.name} 
          autoPlay src={this.props.streamLink} 
        />

        <Tooltip title="Noise Filter" arrow>
          <ToggleDiv>
            <BlueSwitch id={"checkbox_" + this.props.name} type="checkbox" onChange={this.onToggleChange}
              defaultChecked={true} value={this.state.toggleValue} color="primary" />
          </ToggleDiv>
        </Tooltip>
      </StreamDiv>
    );
  }
}

export default Stream;