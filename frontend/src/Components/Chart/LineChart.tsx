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
import { ChartProps } from "../../Types/Props/LineChart";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const LineChart = (LineChartProps: ChartProps) => {

    const { options, data } = LineChartProps;

    if (data) {
        return (
            <Line options={options} data={data} />
        )
    }

}

export default LineChart