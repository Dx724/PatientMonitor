import React from 'react';
import styled from 'styled-components';
import AudioSpectrum from "react-audio-spectrum";

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
&:hover {

}
&:active {
	position:relative;
	top:1px;
}
`;

class Stream extends React.Component {
  constructor(props) {
    super(props);
    this.onSoloClick = this.onSoloClick.bind(this);
  }

  onSoloClick(event) {
    event.preventDefault();
    this.props.muteFunction();
    document.getElementById("audio_" + this.props.name).muted = false;
  }

  render() {
    return <div class="streamDiv">
          <SoloButton type="button" value="Solo" onClick={this.onSoloClick}/>
          <p class="streamTitle">{this.props.name} 🔊</p>
          <audio crossOrigin="anonymous" class="stream" id={"audio_" + this.props.name} autoPlay>
            <source src={this.props.streamLink}></source>
          </audio>
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
          />
        </div>;
  }
}

export default Stream;