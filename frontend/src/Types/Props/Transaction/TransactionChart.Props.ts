import { Data } from "../LineChart"

type TransactionChartProps = {
    selectedChartFilter: string,
    setSelectedChartFilter: React.Dispatch<React.SetStateAction<string>>,
    data: Data,
    setData: React.Dispatch<React.SetStateAction<Data>>
}

export default TransactionChartProps