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

const FormItem = Form.Item;
const getValue = obj =>
  Object.keys(obj)
    .map(key => obj[key])
    .join(',');

const CreateForm = Form.create()(props => {
  const { modalVisible, form, handleAdd, handleModalVisible } = props;
  const okHandle = () => {
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      form.resetFields();
      handleAdd(fieldsValue);
    });
  };
  return (
    <Modal
      title="新增个股"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="个股">
        {form.getFieldDecorator('code', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="数量">
        {form.getFieldDecorator('amount', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});

@connect(({ rule, loading }) => ({
  rule,
  loading: loading.models.rule,
}))

export default class Portfolio extends PureComponent {
  state = {
    modalVisible: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'rule/fetch',
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
      type: 'rule/fetch',
      payload: params,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;

    if (!selectedRows) return;

    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'rule/remove',
          payload: {
            no: selectedRows.map(row => row.no).join(','),
          },
          callback: () => {
            this.setState({
              selectedRows: [],
            });
          },
        });
        break;
      default:
        break;
    }
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
        type: 'rule/fetch',
        payload: values,
      });
    });
  };

  handleModalVisible = flag => {
    this.setState({
      modalVisible: !!flag,
    });
  };

  handleAdd = fields => {
    this.props.dispatch({
      type: 'rule/add',
      payload: {
        description: fields.desc,
      },
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
  };

  render() {
    // console.log(this.props);
    console.log(this.props.rule.data.list);
    console.log(this.props.rule.data.market_value);
    const Info = ({ title, value, bordered }) => (
      <div className={styles.headerInfo}>
        <span>{title}</span>
        <p>{value}</p>
        {bordered && <em />}
      </div>
    );
    const { rule: { data }, loading } = this.props;
    const { selectedRows, modalVisible} = this.state;
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

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout title="组合">
        <Card bordered={false}>
          <Row>
            <Col sm={8} xs={24}>
              <Info title="总资产" value={this.props.rule.data.total} bordered />
            </Col>
            <Col sm={8} xs={24}>
              <Info title="市值" value={this.props.rule.data.market_value} bordered />
            </Col>
            <Col sm={8} xs={24}>
              <Info title="现金" value={this.props.rule.data.cash} bordered />
            </Col>
            <Col sm={8} xs={24}>
              <Info title="仓位(%)" value={this.props.rule.data.position_ratio} />
            </Col>
            <Col sm={8} xs={24}>
              <Info title="成本" value={this.props.rule.data.cost} />
            </Col>
            <Col sm={8} xs={24}>
              <Info title="净资产" value={this.props.rule.data.net_asset} bordered />
            </Col>
            <Col sm={8} xs={24}>
              <Info title="盈利" value={this.props.rule.data.profit} />
            </Col>
            <Col sm={8} xs={24}>
              <Info title="盈利率(%)" value={this.props.rule.data.profit_ratio} />
            </Col>
            <Col sm={8} xs={24}>
              <Info title="当日盈利" value={this.props.rule.data.profit_today} />
            </Col>
            <Col sm={8} xs={24}>
              <Info title="当日盈利(%)" value={this.props.rule.data.profit_ratio_today} />
            </Col>
            <Col sm={8} xs={24}>
              <Info title="招商成本(当年)" value={this.props.rule.data.cost_zs} />
            </Col>
            <Col sm={8} xs={24}>
              <Info title="华泰1成本(当年)" value={this.props.rule.data.cost_ht1} />
            </Col>
            <Col sm={8} xs={24}>
              <Info title="华泰2成本(当年)" value={this.props.rule.data.cost_ht2} />
            </Col>
            <Col sm={8} xs={24}>
              <Info title="融资" value={this.props.rule.data.financing} />
            </Col>
            <Col sm={8} xs={24}>
              <Info title="杠杆(%)" value={this.props.rule.data.lever} />
            </Col>
          </Row>
        </Card>

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
        <CreateForm {...parentMethods} modalVisible={modalVisible} />
      </PageHeaderLayout>
    );
  }
}
