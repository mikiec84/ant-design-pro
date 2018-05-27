import React, { Component, Fragment } from 'react';
import { connect } from 'dva';
import { Card } from 'antd';
import FinanceChart from 'components/Charts/Finance/FinanceChart';
import { getTimeDistance } from '../../utils/utils';
import styles from './Industry.less';

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
export default class Industry extends Component {
  state = {
    salesType: 'all',
    currentTabKey: '',
    rangePickerValue: getTimeDistance('year'),
  };

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
    const { chart, loading } = this.props;

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
            <FinanceChart chartType="sw" code="801150" />
          </div>
        </Card>
      </Fragment>
    );
  }
}
