import React, { Component } from "react";
import './App.css';
import BarChart from './Components/BarChart';
import AnyIllnessSample from './Helpers/sample-any-illness';
import SpecificIllnessSample from './Helpers/sample-specific-illness';
import 'typeface-roboto';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import BarChartNeg from "./Components/BarChartNeg";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      activeIdx: 0,
    }

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, newValue) {
    this.setState({
      activeIdx: newValue
    })
  }

  render() {
    return(
      <div className="App">
        <Typography variant="h2" component="h2">
          Built using ReactJS, d3 & github pages.
        </Typography>
        <Tabs
          value={this.state.activeIdx}
          indicatorColor="primary"
          textColor="primary"
          onChange={this.handleChange}
          aria-label="vis tabs" >
          <Tab label="Visualization 1" />
          <Tab label="Visualization 2" />
        </Tabs>
        <BarChartNeg  value={this.state.activeIdx}
                      index={0}
                      id="brexit"
                      isHidden={this.state.activeIdx !== 0 }></BarChartNeg>
        <BarChart title="12 month prevalence of any mental illness (all U.S. adults)"
                      group="Adult groups"
                      value={this.state.activeIdx}
                      index={1}
                      isHidden={this.state.activeIdx !== 1 }
                      sample={AnyIllnessSample}
                      scale={40}
                      id="any-illness"></BarChart>
        <BarChart title="12 month prevalence of common mental illnesses (all U.S. adults)"
                    value={this.state.activeIdx}
                    index={1}
                    isHidden={this.state.activeIdx !== 1}
                    group="Illnesses"
                    sample={SpecificIllnessSample}
                    scale={20}
                    id="specific-illness"></BarChart>
      </div>
    );
  }
}

export default App;
