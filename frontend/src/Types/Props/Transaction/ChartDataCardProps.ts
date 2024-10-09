import { TransactionChartCategoryFilter } from "../../Transaction"
import { Data, Dataset } from "../LineChart";

type ChartDataCardProps = {
    index: number;
    data: Dataset[];
    setData: React.Dispatch<React.SetStateAction<Data>>;
    chartCategory: TransactionChartCategoryFilter;
    setAddedChartCategories: React.Dispatch<React.SetStateAction<TransactionChartCategoryFilter[]>>;
}

export default ChartDataCardProps