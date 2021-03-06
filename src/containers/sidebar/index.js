import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from 'connected-react-router'

import SideBar from '../../components/sidebar';

class SideBarContainter extends Component {

  pushRoute = (route) => {
    this.props.dispatch(push(route))
    if (this.props.onLinkClick) {
      // Callback to close the sidebar
      this.props.onLinkClick();
    }
  };

  render() {
    return (
      <SideBar pushRoute={this.pushRoute} />
    );
  }
}

const mapStateToProps = (state, ownProps) => {
  return {};
}

SideBarContainter = connect(mapStateToProps)(SideBarContainter);

export default SideBarContainter;