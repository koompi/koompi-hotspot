import React from "react";
import { Column } from "@ant-design/charts";

const BarChart = () => {
  var data = [
    {
      type: "Sunday",
      values: [76, 100],
    },
    {
      type: "Monday",
      values: [56, 108],
    },
    {
      type: "Tuesday",
      values: [38, 129],
    },
    {
      type: "Wednesday",
      values: [58, 155],
    },
    {
      type: "Thurday",
      values: [45, 120],
    },
    {
      type: "Friday",
      values: [23, 99],
    },
    {
      type: "Saturday",
      values: [18, 56],
    },
  ];
  var config = {
    data: data,
    xField: "type",
    yField: "values",
    isRange: true,
    label: {
      position: "middle",
      layout: [{ type: "adjust-color" }],
    },
  };
  return (
    <React.Fragment>
      <Column {...config} />
    </React.Fragment>
  );
};

export default BarChart;
