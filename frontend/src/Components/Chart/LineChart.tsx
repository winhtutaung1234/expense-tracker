import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
} from "chart.js"
import { Line } from "react-chartjs-2"

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const LineChart = () => {

    const options = {};

    const data = {
        labels: [
            "Monday",
            "Tuesday",
            "Wednesday",
            "Thursday",
            "Friday",
            "Saturday",
            "Sunday"
        ],
        datasets: [
            {
                label: "Income",
                data: [3000, 5000, 4000, 3000, 5500, 8000, 4500],
                borderColor: "#05CE73"
            },
            {
                label: "Expense",
                data: [1000, 4000, 3500, 4500, 1500, 6000, 3000],
                borderColor: "#FF5649"
            },
        ]
    };

    return (
        <Line options={options} data={data} />
    )
}

export default LineChart