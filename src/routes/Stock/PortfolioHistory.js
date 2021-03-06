import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import PortfolioChart from 'components/Charts/Finance/PortfolioChart';
import styles from './Portfolio.less';

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
export default class PortfolioHistory extends Component {

  componentDidMount() {
    this.props.dispatch({
      type: 'chart/fetch',
    });
  }

  componentWillUnmount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'chart/clear',
    });
  }

  render() {
    const {  loading } = this.props;

    return (
      <Fragment>
        <Card
          loading={loading}
          className={styles.offlineCard}
          bordered={false}
          bodyStyle={{ padding: '0 0 32px 0' }}
          style={{ marginTop: 32 }}
        >
          <div style={{ padding: '0 24px' }}>
            <PortfolioChart />
          </div>
        </Card>
      </Fragment>
    );
  }
}
