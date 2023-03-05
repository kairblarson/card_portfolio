import React, { useEffect, useState } from "react";
import Chart, { Legend, plugins } from "chart.js/auto";
import { Line } from "react-chartjs-2";

const LineChart = ({ priceHistory, dates }) => {

    const data = {
        labels: dates,
        datasets: [
            {
                label: "Price history",
                backgroundColor: "rgb(81, 129, 232)",
                borderColor: "rgb(81, 129, 232)",
                data: priceHistory,
            },
        ],
    };

    return (
        <div>
            <Line data={data} />
        </div>
    );
};

export default LineChart;
