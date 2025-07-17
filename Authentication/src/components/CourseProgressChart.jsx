"use client";

import React, { useEffect, useState, useContext } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function CourseProgressChart() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-[300px] flex items-center justify-center">
        Loading chart...
      </div>
    );
  }

  const isDarkMode = "dark";

  const progressData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    datasets: [
      {
        label: "Course Completion %",
        data: [20, 35, 40, 50, 65, 70, 85],
        borderColor: "#3b82f6",
        backgroundColor: "rgba(59, 130, 246, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#3b82f6",
        pointBorderWidth: 2,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top",
        labels: {
          boxWidth: 10,
          usePointStyle: true,
          pointStyle: "circle",
          color: isDarkMode ? "#e2e8f0" : "#475569",
        },
      },
      tooltip: {
        mode: "index",
        intersect: false,
        backgroundColor: isDarkMode
          ? "rgba(30, 41, 59, 0.8)"
          : "rgba(17, 24, 39, 0.8)",
        padding: 10,
        cornerRadius: 4,
        titleFont: {
          size: 14,
        },
        bodyFont: {
          size: 13,
        },
        callbacks: {
          label: (context) => `${context.dataset.label}: ${context.parsed.y}%`,
        },
      },
    },
    scales: {
      y: {
        min: 0,
        max: 100,
        grid: {
          color: isDarkMode
            ? "rgba(71, 85, 105, 0.3)"
            : "rgba(226, 232, 240, 0.5)",
        },
        ticks: {
          callback: (value) => value + "%",
          font: {
            size: 11,
          },
          color: isDarkMode ? "#cbd5e1" : "#64748b",
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          font: {
            size: 11,
          },
          color: isDarkMode ? "#cbd5e1" : "#64748b",
        },
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
  };

  return (
    <div className="h-[300px]">
      <Line data={progressData} options={options} />
    </div>
  );
}

