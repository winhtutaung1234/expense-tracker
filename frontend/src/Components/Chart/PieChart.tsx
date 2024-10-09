import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
    Title,
} from "chart.js";
import { Pie } from "react-chartjs-2";
import { ChartProps, Data } from "../../Types/Props/LineChart";
import { useEffect, useState } from "react";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const PieChart = (PieChartProps: ChartProps) => {
    const { options, data } = PieChartProps;

    const [modifiedData, setModifiedData] = useState<Data>({
        labels: [],
        datasets: [],
    });


    useEffect(() => {
        if (data && data.datasets.length > 0 && data.labels.length > 0) {
            setModifiedData({
                ...data,
                datasets: data.datasets.map((dataset) => ({
                    ...dataset,
                    backgroundColor: backgroundColors.slice(0, dataset.data.length),
                    borderColor: borderColors.slice(0, dataset.data.length),
                }))
            });
        }
    }, [data]);

    const backgroundColors = [
        'rgba(255, 99, 132, 0.6)',   // Light Red
        'rgba(54, 162, 235, 0.6)',   // Light Blue
        'rgba(255, 206, 86, 0.6)',   // Light Yellow
        'rgba(75, 192, 192, 0.6)',   // Light Teal
        'rgba(153, 102, 255, 0.6)',  // Light Purple
        'rgba(255, 159, 64, 0.6)',   // Light Orange
        'rgba(201, 203, 207, 0.6)',  // Light Grey
        'rgba(123, 239, 178, 0.6)',  // Light Green
        'rgba(255, 105, 180, 0.6)',  // Light Pink
        'rgba(72, 209, 204, 0.6)',   // Light Cyan
        'rgba(238, 130, 238, 0.6)',  // Light Violet
        'rgba(144, 238, 144, 0.6)',  // Light Lime
    ];

    const borderColors = [
        'rgba(255, 99, 132, 1)',   // Red
        'rgba(54, 162, 235, 1)',   // Blue
        'rgba(255, 206, 86, 1)',   // Yellow
        'rgba(75, 192, 192, 1)',   // Teal
        'rgba(153, 102, 255, 1)',  // Purple
        'rgba(255, 159, 64, 1)',   // Orange
        'rgba(201, 203, 207, 1)',  // Grey
        'rgba(123, 239, 178, 1)',  // Green
        'rgba(255, 105, 180, 1)',  // Pink
        'rgba(72, 209, 204, 1)',   // Cyan
        'rgba(238, 130, 238, 1)',  // Violet
        'rgba(144, 238, 144, 1)',  // Lime
    ];

    if (modifiedData) {
        return <Pie options={options} data={modifiedData} />;
    }

    return null;
};

export default PieChart;
