import { merge } from 'lodash';
import ReactApexChart from 'react-apexcharts';
// material
import { Card, CardHeader, Box } from '@mui/material';
//
import BaseOptionChart from './BaseOptionChart';
import { useEffect } from 'react';
import { getToken } from '../../routes/auth/Login';
import axios from "axios";

// ----------------------------------------------------------------------

const CHART_DATA = [
  {
    name: 'Team A',
    type: 'column',
    data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30]
  },
  {
    name: 'Team B',
    type: 'area',
    data: [44, 55, 41, 67, 22, 43, 21, 41, 56, 27, 43]
  },
  {
    name: 'Team C',
    type: 'line',
    data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39]
  }
];


export default function Chart() {
  const chartOptions = merge(BaseOptionChart(), {
    stroke: { width: [0, 2, 3] },
    plotOptions: { bar: { columnWidth: '20%', borderRadius: 4 } },
    fill: { type: ['solid', 'gradient', 'solid'] },
    labels: [
      '2022-01-01',
      '2022-01-02',
      '2022-01-03',
      '2022-01-04',
      // '05/01/2022',
      // '06/01/2022',
      // '07/01/2022',
      // '08/01/2022',
      // '09/01/2022',
      // '10/01/2022',
      // '11/01/2022'
    ],
    xaxis: { type: 'datetime' },
    yaxis: { max: 100},
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (y) => {
          if (typeof y !== 'undefined') {
            return `${y.toFixed(0)} visits`;
          }
          return y;
        }
      }
    }
  });
const handleLogLoad = () => {
  const TOKEN = getToken("jwtToken");
  const config = {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  };

  axios
  .get(`/users/users/logs`, config)
  .then((res) => {
    console.log(res.data);
  })
  .catch((err) => {
    console.log(err);
    console.log("fail...");
  });

}

  useEffect(() => {
    handleLogLoad();
  }, []);

  return (
    <Card>
      <CardHeader title="Website Visits" subheader="(+43%) than last year" />
      <Box sx={{ p: 3, pb: 1 }} dir="ltr">
        <ReactApexChart type="line" series={CHART_DATA} options={chartOptions} height={500} />
      </Box>
    </Card>
  );
}