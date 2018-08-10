import React, { Component } from 'react';
import Highcharts from 'highcharts';

class PortfolioChart extends Component {
  componentDidMount() {
    console.log('componentDidMount***');
    // remember the outer "this"
    const that = this;
    const url = 'http://localhost:8000/api/portfolio_history';
    // only works for CH and FF
    // let url = new URL(this.props.url);
    // let params = new URLSearchParams(url.search.slice(1));
    // console.log(params);
    // //Iterate the search parameters.
    //   for (let p of params) {
    //     console.log(p);
    //   }
    //   let code = params.get('code');
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
            text: `Finance chart over time Portfolio`,
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
                text: 'Total',
              },
            },
            {
              title: {
                text: 'Market',
              },
            },
            {
              title: {
                text: 'Net Asset',
              },
            },
            {
              title: {
                text: 'Cost',
              },
            },
            {
              title: {
                text: 'Financing',
              },
            },
            {
              title: {
                text: 'Position Ratio(%)',
              },
              opposite: true, // right-side y-axis
            },
            {
              title: {
                text: 'Lever(%)',
              },
              opposite: true, // right-side y-axis
            },
            {
              title: {
                text: 'Profit',
              },
            },
            {
              title: {
                text: 'Profit Ratio(%)',
              },
              opposite: true, // right-side y-axis
            },
            {
              title: {
                text: 'Profit Today',
              },
            },
            {
              title: {
                text: 'Profit Ratio Today(%)',
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
              name: 'Total',
              data: data.total,
              color: 'blue',
              visible: false,
            },
            {
              type: 'line',
              name: 'Market',
              yAxis: 1,
              data: data.market,
              color: 'black',
              visible: false,
            },
            {
              type: 'line',
              name: 'Net Asset',
              yAxis: 1,
              data: data.net_asset,
              visible: true,
            },
            {
              type: 'line',
              name: 'Cost',
              yAxis: 1,
              data: data.cost,
              visible: false,
            },
            {
              type: 'line',
              name: 'Financing',
              yAxis: 1,
              data: data.financing,
              visible: false,
            },
            {
              type: 'line',
              name: 'Position Ratio(%)',
              yAxis: 2,
              data: data.position_ratio,
              visible: false,
            },
            {
              type: 'line',
              name: 'Lever(%)',
              yAxis: 2,
              data: data.lever,
              visible: false,
            },
            {
              type: 'line',
              name: 'Profit',
              yAxis: 1,
              data: data.profit,
              visible: true,
            },
            {
              type: 'line',
              name: 'Profit Ratio(%)',
              yAxis: 2,
              data: data.profit_ratio,
              visible: true,
            },
            {
              type: 'line',
              name: 'Profit Today',
              yAxis: 1,
              data: data.profit_today,
              visible: false,
            },
            {
              type: 'line',
              name: 'Profit Ratio Today(%)',
              yAxis: 2,
              data: data.profit_ratio_today,
              visible: false,
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

export default PortfolioChart;
