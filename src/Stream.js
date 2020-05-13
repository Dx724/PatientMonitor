import React from 'react';
import styled from 'styled-components';

class Stream extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return <div>
          <p>{this.props.name}</p>
          <video autoPlay>
            <source src={this.props.streamLink}></source>
          </video>
        </div>;
  }
}

export default Stream;