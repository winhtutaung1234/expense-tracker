import { Data } from "../../Types/Props/LineChart";
import { Transaction } from "../../Types/Transaction";

export const getChartData = (transactions: Transaction[], filter: string, categories?: string[]): Data => {
    const timePeriod = getTimePeriod(filter);
    const labels = getLabels(filter, timePeriod);

    const start = Date.parse(timePeriod[0]);
    const end = Date.parse(timePeriod[timePeriod.length - 1]);

    const filteredTransactions = transactions.filter(({ created_at }) => {
        const transactionDate = Date.parse(created_at.split('T')[0]);
        return transactionDate >= start && transactionDate <= end;
    });

    const data: Data = {
        labels: labels,
        datasets: []
    };

    const initializeDataSetTemplate = () =>
        timePeriod.reduce((acc, date) => ({ ...acc, [date]: 0 }), {});

    const aggregateTransactions = (transactions: Transaction[], dataSetTemplate: { [key: string]: number }) =>
        transactions.reduce((dataSet, { created_at, amount }) => {
            const date = created_at.split('T')[0];
            dataSet[date] = (dataSet[date] || 0) + parseFloat(amount);
            return dataSet;
        }, { ...dataSetTemplate });

    const incomeTransactions = filteredTransactions.filter(t => t.transaction_type !== "expense");
    const expenseTransactions = filteredTransactions.filter(t => t.transaction_type !== "income");

    const incomeDataSet = aggregateTransactions(incomeTransactions, initializeDataSetTemplate());
    const expenseDataSet = aggregateTransactions(expenseTransactions, initializeDataSetTemplate());

    data.datasets.push({
        label: "Total Income",
        data: Object.values(incomeDataSet),
        borderColor: "#05CE73",
    });
    data.datasets.push({
        label: "Total Expense",
        data: Object.values(expenseDataSet),
        borderColor: "#FF5649",
    });

    if (categories) {
        categories.forEach((category) => {
            const categoryTransactions = filteredTransactions.filter(t => t.category.name === category);

            const categoryIncomeTransactions = categoryTransactions.filter(t => t.transaction_type !== "expense");
            const categoryExpenseTransactions = categoryTransactions.filter(t => t.transaction_type !== "income");

            const categoryIncomeDataSet = aggregateTransactions(categoryIncomeTransactions, initializeDataSetTemplate());
            const categoryExpenseDataSet = aggregateTransactions(categoryExpenseTransactions, initializeDataSetTemplate());

            data.datasets.push({
                label: `${category} Income`,
                data: Object.values(categoryIncomeDataSet),
                borderColor: "#05CE73",
                hidden: true
            });
            data.datasets.push({
                label: `${category} Expense`,
                data: Object.values(categoryExpenseDataSet),
                borderColor: "#FF5649",
                hidden: true
            });
        });
    }

    return data;
};


const getTimePeriod = (filter: string) => {
    switch (filter) {
        case "last_week":
            return getLastWeekDates();
        case "this_week":
        default:
            return getThisWeekDates();
    }
};

const getLabels = (filter: string, timePeriod: any[]): string[] => {
    let labels: string[] = [];
    if (filter.includes('week')) {
        timePeriod.forEach((time) => {
            const date = new Date(time);
            labels.push(getDayName(date.getDay()));
        })
    }
    else if (filter.includes('month')) {

    }

    return labels;
}

const getLastWeekDates = () => {
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay();

    const lastSunday = new Date(currentDate.setDate(currentDate.getDate() - (dayOfWeek === 0 ? 7 : dayOfWeek)));
    const lastMonday = new Date(lastSunday);
    lastMonday.setDate(lastSunday.getDate() - 6);

    return getWeekFromMonday(lastMonday);
};

const getThisWeekDates = () => {
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay();

    const monday = new Date(currentDate.setDate(currentDate.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1)));

    return getWeekFromMonday(monday);
};

const getWeekFromMonday = (monday: Date) => {
    const week = [];
    for (let i = 0; i < 7; i++) {
        const date = new Date(monday);
        date.setDate(monday.getDate() + i);
        week.push(date.toISOString().split('T')[0]);
    }
    return week;
};



const getDayName = (number: number) => {
    let name;
    switch (number) {
        case 0:
            name = "Sunday";
            break;
        case 1:
            name = "Monday";
            break;
        case 2:
            name = "Tuesday";
            break;
        case 3:
            name = "Wednesday";
            break;
        case 4:
            name = "Thursday";
            break;
        case 5:
            name = "Friday";
            break;
        case 6:
            name = "Saturday";
            break;
        case 0:
            name = "Sunday";
            break;
        default:
            name = "Sunday";
    }
    return name;
}