import React from 'react';
import styled from 'styled-components';

class Stream extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div class="streamDiv">
          <p>{this.props.name} <span role="img">🔊</span></p>
          <video class="stream" autoPlay>
            <source src={this.props.streamLink}></source>
          </video>
        </div>;
  }
}

export default Stream;