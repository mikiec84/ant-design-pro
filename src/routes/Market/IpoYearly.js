import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import IpoChart from 'components/Charts/Finance/IpoYearlyChart';
import styles from './Industry.less';

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
export default class IpoYearly extends Component {

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
            <IpoChart />
          </div>
        </Card>
      </Fragment>
    );
  }
}
