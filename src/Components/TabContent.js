import React, { Component } from "react";

class TabContent extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isHidden: this.props.isHidden
    };
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
      <div className={this.state.isHidden ? "is-hidden" : ""}>
      </div>
    );
  }
}

export default TabContent;
