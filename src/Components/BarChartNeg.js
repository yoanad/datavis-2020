import React, { Component } from "react";
import * as d3 from "d3";
import "./BarChartNeg.css";

class BarChartNeg extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isHidden: this.props.isHidden
    };

    this.sample = this.props.sample;
    this.id = this.props.id;
    this.drawChart = this.drawChart.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.isHidden !== prevProps.isHidden) {
      this.setState({
        isHidden: this.props.isHidden
      });
    }
  }

  componentDidMount() {
    this.drawChart();
  }

  drawChart() {
    var margin = 100;
    var width = 1400 - 2 * margin;
    var height = 900 - 2 * margin;
	
	//add svg with margin !important
  //this is svg is actually group
  const svg = d3.select(`#${this.id}`);

  const chart = svg
  	.append("g")  //add group to leave margin for axis
    .attr("transform", `translate(${margin}, ${margin})`);

	// var svg = d3.select("container").append("svg")
	// 			.attr("width",width+margin.left+margin.right)
	// 			.attr("height",height+margin.top+margin.bottom)
	// 			.append("g")  //add group to leave margin for axis
	// 			.attr("transform","translate("+margin.left+","+margin.top+")");
	
	var dataset = [4,2,-6,13,4,8,-23,19,10,-12,2,15];
	var maxHeight=d3.max(dataset,function(d){return Math.abs(d)});
	var minHeight=d3.min(dataset,function(d){return Math.abs(d)})
	
	//set y scale
	var yScale = d3.scaleLinear().rangeRound([0,height]).domain([maxHeight,-maxHeight]);//show negative
	//add x axis
	var xScale = d3.scaleBand().rangeRound([0,width]).padding(0.1);//scaleBand is used for  bar chart
	xScale.domain([0,1,2,3,4,5,6,7,8,9,10,11]);//value in this array must be unique
	/*if domain is specified, sets the domain to the specified array of values. The first element in domain will be mapped to the first band, the second domain value to the second band, and so on. Domain values are stored internally in a map from stringified value to index; the resulting index is then used to determine the band. Thus, a band scale’s values must be coercible to a string, and the stringified version of the domain value uniquely identifies the corresponding band. If domain is not specified, this method returns the current domain.*/
	
	var barpadding = 2;
	var bars = chart.selectAll("rect").data(dataset).enter().append("rect");
	bars.attr("x",function(d,i){
			  return xScale(i);//i*(width/dataset.length);
			  })
	.attr("y",function(d){
		if(d<0){
			return height/2;
		}
		else{
			return yScale(d);	
		}
		
	})//for bottom to top
	.attr("width", xScale.bandwidth()/*width/dataset.length-barpadding*/)
	.attr("height", function(d){
		return height/2 -yScale(Math.abs(d));
	});
	bars.attr("fill",function(d){
		if(d>=0){
			return "green";
		}
		else{
			return "orange";
		}
	});
	
	//add tag to every bar
	var tags = chart.selectAll("text").data(dataset).enter().append("text").text(function(d){
		return d;
	});
	tags.attr("x",function(d,i){
			  return xScale(i)+8;
			  })
	.attr("y",function(d){
		if(d>=0){
			return yScale(d)+12;
		}
		else{
			return height-yScale(Math.abs(d))-2;
		}
	})//for bottom to top
	.attr("fill","white");
	
	//add x and y axis
	var yAxis = d3.axisLeft(yScale);
	chart.append("g").call(yAxis);
	

	var xAxis = d3.axisBottom(xScale);/*.tickFormat("");remove tick label*/
	chart.append("g").call(xAxis).attr("transform", "translate(0,"+height/2+")");
	
	//add label for x axis and y axis
	chart.append("text").text("Y Label")
		.attr("x",0-height/2)
		.attr("y",0-margin/2)
		.attr("dy","1em")
      	.style("text-anchor", "middle")
		.attr("transform","rotate(-90)");
	svg.append("text").text("X Label")
		.attr("x",width/2)
		.attr("y",height+margin/2)
      	.style("text-anchor", "middle");
  }

  render() {
    return (
      <div className={this.state.isHidden ? 'is-hidden container' : 'container'}>
        <svg viewBox="0 0 1400 1000" id={this.id}></svg>
      </div>
    );
  }
}

export default BarChartNeg;
