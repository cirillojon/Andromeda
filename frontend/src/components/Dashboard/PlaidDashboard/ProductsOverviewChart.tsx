import React from "react";
import { Pie } from "react-chartjs-2";
import "chart.js/auto";

const ProductsOverviewChart = ({ data }: { data: any }) => {
  const availableProducts = data.item.available_products.length;
  const billedProducts = data.item.billed_products.length;

  const chartData = {
    labels: ["Available Products", "Billed Products"],
    datasets: [
      {
        data: [availableProducts, billedProducts],
        backgroundColor: ["#36A2EB", "#FF6384"],
      },
    ],
  };

  const options = {
    maintainAspectRatio: false,
  };

  return (
    <div style={{ width: "200px", height: "200px" }}>
      <Pie data={chartData} options={options} />
    </div>
  );
};

export default ProductsOverviewChart;
