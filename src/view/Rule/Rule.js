/**
 * desc：  权限管理
 * author：DestinyJun
 * date：  2020/4/21 17:01
 */
import React, {Component} from 'react';
import './Rule.scss';
import {Button, Table} from "antd";
import {post} from "../../service/Interceptor";
import {RuleApi} from "../../service/Apis";

export class Rule extends Component {
  constructor(props) {
    super(props);
    this.state = {
      rule_list: []
    };
    this.rule_column = [
      {
        title: '权限名称',
        dataIndex: 'rule_name',
      },
      {
        title: '权限标识名称',
        dataIndex: 'action_name',
      },
      {
        title: '权限标识编码',
        dataIndex: 'action_code',
      },
      {
        title: '创建时间',
        dataIndex: 'create_time',
      }
    ]
  }
  componentDidMount() {
    post(RuleApi.GET_RULE_TREE, {})
      .then(res => {
        this.setState({
          rule_list: [...res.data]
        })
      })
      .catch(err =>{
        console.log(err);
      })
  }

  onChange = (selectedRowKeys, selectedRows) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  };
  onSelect = (record, selected, selectedRows) => {
    console.log(record, selected, selectedRows);
  };
  onSelectAll = (selected, selectedRows, changeRows) => {
    console.log(selected, selectedRows, changeRows);
  };
  render() {
    return (
      <div className={'rule'}>
        <h2 className="rule-title">权限管理</h2>
        <div className="rule-btn">
          <Button type={'primary'}>权限添加</Button>
        </div>
        <div className="rule-table">
          {
            this.state.rule_list.length>0 &&  <Table
              columns={this.rule_column}
              pagination={false}
              scroll={{ y: '63vh' }}
              rowSelection={{
                onChange: this.onChange
              }}
              dataSource={this.state.rule_list}
            />
          }
        </div>
      </div>
    );
  }
}
