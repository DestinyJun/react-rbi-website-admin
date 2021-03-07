/**
 * desc：  路由守卫
 * author：DestinyJun
 * date：  2020/4/21 19:55
 */
import React from 'react';
import {Redirect, Route} from "react-router-dom";
import {getObject} from "../service/sessionStorage";

const isLoading = getObject('token');

export function Auth({children, ...rest}) {
  console.log(children);
  return (
    <Route  {...rest} render={({location}) => {
      return isLoading ? (children) : (
        <Redirect to={{pathname: "/login", state: {from: location}}}/>
      )
    }}
    />
  )
}
