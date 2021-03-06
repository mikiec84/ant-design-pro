import React, { PureComponent} from 'react';
import { connect } from 'dva';
import {
  Card,
  Button,
  Form,
  Modal,
  Input,
  Dropdown,
  Menu,
  Icon,
  message,
  DatePicker,
} from 'antd';
import StandardTable from 'components/StandardTable';
import PageHeaderLayout from '../../layouts/PageHeaderLayout';

import styles from './Portfolio.less';

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
      title="新增分红"
      visible={modalVisible}
      onOk={okHandle}
      onCancel={() => handleModalVisible()}
    >
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="日期">
        {form.getFieldDecorator('date', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<DatePicker />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="分红金额">
        {form.getFieldDecorator('money', {
          rules: [{ required: true, message: 'Please input some description...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
      <FormItem labelCol={{ span: 5 }} wrapperCol={{ span: 15 }} label="备注">
        {form.getFieldDecorator('description', {
          rules: [{ required: false, message: 'Please input some description...' }],
        })(<Input placeholder="请输入" />)}
      </FormItem>
    </Modal>
  );
});
// #5 must define here to connect model data
@connect(({ dividend, loading }) => ({
  dividend,
  loading: loading.models.dividend,
}))

export default class Dividend extends PureComponent {
  state = {
    modalVisible: false,
    expandForm: false,
    selectedRows: [],
    formValues: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dividend/fetch',
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
      type: 'dividend/fetch',
      payload: params,
    });
  };

  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    dispatch({
      type: 'dividend/fetch',
      payload: {},
    });
  };

  toggleForm = () => {
    this.setState({
      expandForm: !this.state.expandForm,
    });
  };

  handleMenuClick = e => {
    const { dispatch } = this.props;
    const { selectedRows } = this.state;
    if (!selectedRows) return;
    switch (e.key) {
      case 'remove':
        dispatch({
          type: 'dividend/remove',
          payload: {
            id: selectedRows.map(row => row.id).join(','),
          },
          callback: () => {
            dispatch({
              type: 'dividend/fetch',
              payload: {},
            });
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
        type: 'dividend/fetch',
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
      type: 'dividend/add',
      payload: {
        date: fields.date,
        money: fields.money,
        description: fields.description,
      },
    });

    message.success('添加成功');
    this.setState({
      modalVisible: false,
    });
    // TODO 刷新还是有点问题
    this.props.dispatch({
      type: 'dividend/fetch',
      payload: {},
    });

  };

  renderForm() {
    return this.state.expandForm ? this.renderAdvancedForm() : this.renderSimpleForm();
  }

  render() {
    console.log("render***");
    // console.log(this.props);
    // console.log(this.props.dividend.data.list);
    // #5
    const { dividend: { data }, loading } = this.props;
    const { selectedRows, modalVisible} = this.state;
    const columns = [
      {
        title: '日期',
        dataIndex: 'date',
      },
      {
        title: '金额',
        dataIndex: 'money',
      },
      {
        title: '备注',
        dataIndex: 'description',
      },
    ];

    const menu = (
      <Menu onClick={this.handleMenuClick} selectedKeys={[]}>
        <Menu.Item key="remove">删除</Menu.Item>
        <Menu.Item key="approval">批量审批</Menu.Item>
      </Menu>
    );

    const parentMethods = {
      handleAdd: this.handleAdd,
      handleModalVisible: this.handleModalVisible,
    };

    return (
      <PageHeaderLayout title="分红">

        <Card bordered={false}>
          <div className={styles.tableList}>
            <div className={styles.tableListOperator}>
              <Button icon="plus" type="primary" onClick={() => this.handleModalVisible(true)}>
                新建
              </Button>
              {selectedRows.length > 0 && (
                <span>
                  <Button>批量操作</Button>
                  <Dropdown overlay={menu}>
                    <Button>
                      更多操作 <Icon type="down" />
                    </Button>
                  </Dropdown>
                </span>
              )}
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
