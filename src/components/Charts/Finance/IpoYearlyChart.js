import React, { Component } from 'react';
import Highcharts from 'highcharts';

class IpoYearlyChart extends Component {
  componentDidMount() {
    console.log('componentDidMount***');
    // remember the outer "this"
    const that = this;
    const url = 'http://localhost:8000/api/ipo_yearly';
    fetch(url)
      .then(response => {
        return response.json();
      })
      .then(data => {
        console.log(data);
        const options2 = {
          chart: {
            zoomType: 'x',
          },
          title: {
            text: `Finance chart over time IPO`,
          },
          subtitle: {
            text:
              document.ontouchstart === undefined
                ? 'Click and drag in the plot area to zoom in'
                : 'Pinch the chart to zoom in',
          },
          xAxis: {
            type: 'datetime',
          },
          yAxis: [
            {
              title: {
                text: 'IPO',
              },
            },
            {
              title: {
                text: 'Financing',
              },
              opposite: true, // right-side y-axis
            },
          ],
          legend: {
            layout: 'vertical',
            align: 'left',
            x: 80,
            verticalAlign: 'top',
            y: 55,
            floating: true,
            backgroundColor:
              (Highcharts.theme && Highcharts.theme.legendBackgroundColor) || '#FFFFFF',
          },
          plotOptions: {
            area: {
              fillColor: {
                linearGradient: {
                  x1: 0,
                  y1: 0,
                  x2: 0,
                  y2: 1,
                },
                stops: [
                  [0, Highcharts.getOptions().colors[0]],
                  [
                    1,
                    Highcharts.Color(Highcharts.getOptions().colors[0])
                      .setOpacity(0)
                      .get('rgba'),
                  ],
                ],
              },
              marker: {
                radius: 2,
              },
              lineWidth: 1,
              states: {
                hover: {
                  lineWidth: 1,
                },
              },
              threshold: null,
            },
            series: {
              turboThreshold: 5000, // set it to a larger threshold, it is by default to render 1000 points
            },
          },
          series: [
            {
              type: 'line',
              name: 'IPO',
              data: data.total,
              color: 'blue',
            },
            {
              type: 'line',
              name: 'Financing',
              yAxis: 1,
              data: data.financing,
              color: 'black',
            },
          ],
        };
        that.setState({ options: options2 });
        console.log(that.state.options);
        // create highcharts chart
        that.chart = new Highcharts[that.props.type || 'Chart'](that.chartEl, that.state.options);
      })
      .catch(error => {
        console.log(error);
      });
  }

  componentWillUnmount() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  render() {
    console.log(`render***`);
    // Use the `ref` callback to store a reference to the text input DOM
    //     // element in an instance field (for example, this.chartEl).
    return (
      <div>
        <div ref={el => (this.chartEl = el)} />
      </div>
    );
  }
}

export default IpoYearlyChart;
