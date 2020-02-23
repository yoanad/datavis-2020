import React, { Component } from "react";
import * as d3 from "d3";
import "./BarChartNeg.css";
import vis from "./vis1.svg";

class BarChartNeg extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isHidden: this.props.isHidden
    };
    this.id = this.props.id;
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isHidden !== prevProps.isHidden) {
      this.setState({
        isHidden: this.props.isHidden
      });
    }
  }

  render() {
    return (
      <div
        className={this.state.isHidden ? "is-hidden container" : "container"}
      >
        <img src={vis} />
      </div>
    );
  }
}

export default BarChartNeg;
