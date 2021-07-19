import React from "react";
import { Pie } from "@ant-design/charts";

const PieChart = (props) => {
  var data = [
    {
      type: "Users",
      value: 50,
    },
    {
      type: "In plan",
      value: 20,
    },
    {
      type: "Actives",
      value: 30,
    },
  ];
  var config = {
    appendPadding: 5,
    data: data,
    angleField: "value",
    colorField: "type",
    radius: 0.9,
    label: {
      type: "inner",
      offset: "-30%",
      content: function content(_ref) {
        var percent = _ref.percent;
        return "".concat(percent * 100, "%");
      },
      style: {
        fontSize: 14,
        textAlign: "center",
      },
    },
    state: {
      active: {
        style: {
          lineWidth: 0,
          fillOpacity: 0.65,
        },
      },
    },
    legend: { position: "bottom" },
    interactions: [{ type: "element-selected" }, { type: "element-active" }],
  };
  return (
    <React.Fragment>
      <Pie {...config} />
    </React.Fragment>
  );
};

export default PieChart;
