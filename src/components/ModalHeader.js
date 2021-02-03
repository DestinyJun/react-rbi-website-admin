/**
 * desc：  模态框自定义头部组件
 * author：DestinyJun
 * date：  2021/2/3 10:09
 */
import React from 'react';
import './ModalHeader.scss';

export function ModalHeader(props) {
  return (
    <div className={'ModalHeader'}>
      <p>{props.title}</p>
    </div>
  );
}
ModalHeader.defaultProps = {
  title: '我是头部'
}
