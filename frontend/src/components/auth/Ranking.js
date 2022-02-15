import { merge } from "lodash";
import ReactApexChart from "react-apexcharts";
// material
import { Box, Card, CardHeader } from "@mui/material";
// utils
import numeral from "numeral";
//
import BaseOptionChart from "./BaseOptionChart";

// ----------------------------------------------------------------------

export function fNumber(number) {
  return numeral(number).format();
}

export default function Ranking({ ranking, MyScore }) {
  console.log(ranking);

  let player = [];

  for (let i = 0; i < ranking.length; i++) {
    player.push(`${ranking[i]["nickname"]}`);
  }
  let score = [];

  for (let i = 0; i < ranking.length; i++) {
    score.push(ranking[i]["score"]);
  }

  score.push(MyScore.score);

  console.log(player);
  console.log(score);
  const CHART_DATA = [{ data: score }];

  const chartOptions = merge(BaseOptionChart(), {
    tooltip: {
      marker: { show: false },
      y: {
        formatter: (seriesName) => fNumber(seriesName),
        title: {
          formatter: (seriesName) => "포인트",
        },
      },
    },
    plotOptions: {
      bar: { horizontal: true, barHeight: "80%", borderRadius: 2 },
    },
    xaxis: {
      categories: player,
    },
  });

  return (
    <Card>
      <CardHeader title="🥇 모여바 TOP 10" />
      <Box sx={{ mx: 3 }} dir="ltr">
        <ReactApexChart
          type="bar"
          series={CHART_DATA}
          options={chartOptions}
          height={364}
        />
      </Box>
    </Card>
  );
}
