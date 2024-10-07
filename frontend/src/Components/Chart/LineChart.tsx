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

    // const { options } = LineChartProps;

    // const data = {
    //     labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    //     datasets: [
    //         {
    //             label: 'Dataset 1',
    //             data: [65, 59, 80, 81, 56, 55, 40],
    //             backgroundColor: 'rgba(255, 99, 132, 0.2)', // Background color
    //             borderColor: 'rgba(255, 99, 132, 1)',        // Line color
    //             borderWidth: 2,                              // Line width
    //             hoverBackgroundColor: 'rgba(255, 99, 132, 0.4)', // Hover state color
    //             hoverBorderColor: 'rgba(255, 99, 132, 1)',       // Hover state border color
    //             pointBackgroundColor: 'rgba(75, 192, 192, 1)',   // Point background color
    //             pointBorderColor: '#fff',                        // Point border color
    //             pointBorderWidth: 2,                             // Width of point border
    //             pointRadius: 5,                                  // Point radius
    //             fill: true,                                      // Fill area under the line
    //             lineTension: 0.4,                                // Line smoothness (0 = straight line)
    //         },
    //         {
    //             label: 'Dataset 2',
    //             data: [28, 48, 40, 19, 86, 27, 90],
    //             backgroundColor: 'rgba(54, 162, 235, 0.2)',
    //             borderColor: 'rgba(54, 162, 235, 1)',
    //             borderWidth: 2,
    //             pointBackgroundColor: 'rgba(54, 162, 235, 1)',
    //             pointBorderColor: '#fff',
    //             pointRadius: 5,
    //             fill: false,
    //             lineTension: 0,   // Line with no curvature
    //         },
    //     ],
    // };

    // const options = {
    //     responsive: true,           
    //     maintainAspectRatio: true,  
    // layout: {
    //     padding: {                 
    //         left: 10,
    //         right: 20,
    //         top: 30,
    //         bottom: 10,
    //     },
    // },
    //     scales: {
    //         x: {                           
    //             beginAtZero: true,
    //             ticks: {
    //                 color: 'rgba(75, 192, 192, 1)',
    //             },
    //             grid: {                          
    //                 display: false,
    //             },
    //         },
    //         y: {                      
    //             beginAtZero: true,
    //             ticks: {
    //                 color: 'rgba(54, 162, 235, 1)', 
    //             },
    //             grid: {
    //                 display: true,                   
    //                 color: 'rgba(201, 203, 207, 0.2)',
    //             },
    //         },
    //     },
    //     legend: {
    //         display: true,             
    //         position: 'top',              
    //         labels: {
    //             fontColor: '#333',   
    //             fontSize: 14,            
    //         },
    //     },
    //     title: {
    //         display: true,              
    //         text: 'Customized Line Chart', 
    //         fontSize: 20,                
    //         fontColor: '#333',          
    //     },
    //     tooltips: {
    //         enabled: true,              
    //         mode: 'index',            
    //         intersect: false,             
    //         backgroundColor: 'rgba(0,0,0,0.8)', 
    //         titleFontColor: '#fff',     
    //         bodyFontColor: '#fff',       
    //     },
    //     animation: {
    //         duration: 1500,               
    //         easing: 'easeOutBounce',      
    //     },
    // };

    if (data) {
        return (
            <Line options={options} data={data} />
            // <Line
            //     data={{
            //         labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
            //         datasets: [
            //             {
            //                 label: 'Sales',
            //                 data: [65, 59, 80, 81, 56, 55, 40],
            //                 fill: false,
            //                 borderColor: 'rgba(75, 192, 192, 1)',
            //                 tension: 0.1,
            //             },
            //         ],
            //     }}
            //     options={{
            //         responsive: true,
            //         plugins: {
            //             legend: {
            //                 position: 'top',
            //             },
            //             title: {
            //                 display: true,
            //                 text: 'Monthly Sales Data',
            //             },
            //         },
            //         scales: {
            //             y: {
            //                 beginAtZero: true,
            //             },
            //         },
            //     }}
            // />
        )
    }

}

export default LineChart