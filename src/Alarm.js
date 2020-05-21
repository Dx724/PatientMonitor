import React from 'react';
import styled from 'styled-components';

const Blinker = styled.span`
  height: 20px;
  width: 20px;
  background-color: ${props => props.alarm ? "red" : "#bbb"};
  border-radius: 50%;
  display: inline-block;
`;

const AlarmDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 10px;
  margin-top: 14px;
  margin-left: 3px;
  text-align: center;
`;

const FrequencyText = styled.p`
  margin-top: 2px;
  margin-bottom: 0;
`;

const AlarmTimeout = 0.5 * 1000;
const decibelThreshold = 200;

class Alarm extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      alarmHeard: false
    }

    this.stopped = false;
    this.alarmTimer = null;

    this.componentDidMount = this.componentDidMount.bind(this);
    this.checkForAlarm = this.checkForAlarm.bind(this);
    this.analyze = this.analyze.bind(this);
    this.stop = this.stop.bind(this);
  }

  componentDidMount() {
    this.checkForAlarm();
  }

  checkForAlarm() {
    if (!this.stopped) {
      window.requestAnimationFrame(this.checkForAlarm);

      var arrayLength = Math.min(this.props.canvasHeight + 5 + 4, this.props.analyser.frequencyBinCount);
      var audioData = new Uint8Array(arrayLength);
      this.props.analyser.getByteFrequencyData(audioData);
      this.analyze(audioData);
    }
  }

  analyze(audioData) {
    if (audioData.length > 23) { //Depends on fftSize
      var alarm = false;
      for (let i = 20; i < 24; i++) {
        alarm = audioData[i] >= decibelThreshold ? true : alarm;
      }

      if (alarm) {
        clearTimeout(this.alarmTimer);
        this.setState({ alarmHeard: true });
        this.alarmTimer = setTimeout(() => {
          console.log("timeout");
          this.setState({ alarmHeard: false });
        }, AlarmTimeout);
      }
    }
  }

  stop() {
    this.stopped = true;
    clearTimeout(this.alarmTimer);
  }

  render() {
    return (
      <AlarmDiv>
        <Blinker alarm={this.state.alarmHeard} />
        <FrequencyText>1kHz</FrequencyText>
      </AlarmDiv>
    );
  }
}

export default Alarm;