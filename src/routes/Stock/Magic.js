import React, { PureComponent} from 'react';
import { connect } from 'dva';
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Modal,
  Input,
  message,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Portfolio.less';
// import { message } from 'antd/lib/index';

const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');


@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
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
    console.log(this.props);
    const { rule: { data }, loading } = this.props;
    const { selectedRows} = this.state;
    const columns = [
      {
        title: '代码',
        dataIndex: 'code',
      },
      {
        title: '数量',
        dataIndex: 'amount',
      },
      {
        title: '实时',
        dataIndex: 'current',
      },
      {
        title: '市值',
        dataIndex: 'market',
      },
      {
        title: '比例(%)',
        dataIndex: 'ratio',
      },
      {
        title: '涨跌(%)',
        dataIndex: 'percentage',
      },
      {
        title: '变动',
        dataIndex: 'change',
      },
    ];

    return (
      <PageHeaderLayout title="神奇公式">

        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
            </div>
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
