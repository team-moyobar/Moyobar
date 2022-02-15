import { max, merge } from "lodash";
import ReactApexChart from "react-apexcharts";
// material
import { Card, CardHeader, Box } from "@mui/material";
//
import BaseOptionChart from "./BaseOptionChart";

// ----------------------------------------------------------------------

export default function Chart({ logs, usernickname }) {
  let columnDate = [];

  for (let i = 0; i < logs.length; i++) {
    columnDate.push(logs[i]["date"]);
  }

  let columnTime = [];

  for (let i = 0; i < logs.length; i++) {
    columnTime.push(logs[i]["elapsed_time"]);
  }

  let columnCount = [];

  for (let i = 0; i < logs.length; i++) {
    columnCount.push(logs[i]["count"]);
  }

  console.log(columnCount);
  console.log(columnTime);
  console.log(columnDate);
  console.log(logs);
  const CHART_DATA = [
    {
      name: `모인시간(분)`,
      type: "column",
      data: columnTime.reverse(),
    },
    {
      name: "모인횟수(번)",
      type: "area",
      data: columnCount.reverse(),
    },
  ];

  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: [0, 2, 3] },
    plotOptions: { bar: { columnWidth: "20%", borderRadius: 5 } },
    fill: { type: ["solid", "gradient", "solid"] },
    labels: columnDate.reverse(),
    xaxis: { type: "datetime" },
    yaxis: [
      {
        max: 100,
        title: {
          text: "모인시간(분)",
        },
      },
      {
        max: 20,
        opposite: true,
        title: {
          text: "모인횟수(번)",
        },
      },
    ],
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== "undefined") {
            return `${y.toFixed(0)} `;
          }
          return y;
        },
      },
    },
  });

  return (
    <div>
      <h1>모여바에서 얼마나 모였을까요?</h1>
      <Card>
        <CardHeader />
        <Box sx={{ p: 3, pb: 1 }} dir="ltr">
          <ReactApexChart
            type="line"
            series={CHART_DATA}
            options={chartOptions}
            height={400}
          />
        </Box>
      </Card>
    </div>
  );
}
