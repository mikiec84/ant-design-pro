import React, { PureComponent} from 'react';
import { connect } from 'dva';
import {
  Card,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Portfolio.less';
// import { message } from 'antd/lib/index';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

// #5 must define here to connect model data
@connect(({ magic, loading }) => ({
  magic,
  loading: loading.models.magic,
}))

export default class Magic extends PureComponent {
  state = {
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'magic/fetch',
    });
  }

  handleStandardTableChange = (pagination, filtersArg, sorter) => {
    const { dispatch } = this.props;
    const { formValues } = this.state;

    const filters = Object.keys(filtersArg).reduce((obj, key) => {
      const newObj = { ...obj };
      newObj[key] = getValue(filtersArg[key]);
      return newObj;
    }, {});

    const params = {
      currentPage: pagination.current,
      pageSize: pagination.pageSize,
      ...formValues,
      ...filters,
    };
    if (sorter.field) {
      params.sorter = `${sorter.field}_${sorter.order}`;
    }

    dispatch({
      type: 'magic/fetch',
      payload: params,
    });
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });
  };

  handleSearch = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      if (err) return;

      const values = {
        ...fieldsValue,
        updatedAt: fieldsValue.updatedAt && fieldsValue.updatedAt.valueOf(),
      };

      this.setState({
        formValues: values,
      });

      dispatch({
        type: 'magic/fetch',
        payload: values,
      });
    });
  };


  render() {
    // #5
    const { magic: { data }, loading } = this.props;
    const { selectedRows} = this.state;
    const columns = [
      {
        title: '代码',
        dataIndex: 'code',
      },
      {
        title: 'PB',
        dataIndex: 'pb',
      },
      {
        title: 'PB Order',
        dataIndex: 'pb_order',
      },
      {
        title: 'PE',
        dataIndex: 'pe',
      },
      {
        title: 'PE Order',
        dataIndex: 'pe_order',
      },
      {
        title: 'Magic Order',
        dataIndex: 'magic_order',
      },
    ];

    return (
      <PageHeaderLayout title="神奇公式">

        <Card bordered={false}>
          <div className={styles.tableList}>
            <StandardTable
              selectedRows={selectedRows}
              loading={loading}
              data={data}
              columns={columns}
              onSelectRow={this.handleSelectRows}
              onChange={this.handleStandardTableChange}
            />
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
