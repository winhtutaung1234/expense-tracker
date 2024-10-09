import { Category } from "../../Types/Category";
import { Data } from "../../Types/Props/LineChart";
import { Transaction, TransactionChartCategoryFilter } from "../../Types/Transaction";

export const getChartData = (transactions: Transaction[], allCategories: Category[], filter: string, categories?: TransactionChartCategoryFilter[]): Data => {
    const timePeriod = getTimePeriod(filter);
    const labels = getLabels(filter, timePeriod);

    const start = Date.parse(timePeriod[0]);
    const end = Date.parse(timePeriod[timePeriod.length - 1]);

    const filteredTransactions = transactions.filter(({ date }) => {
        const transactionDate = Date.parse(date.split('T')[0]);
        return transactionDate >= start && transactionDate <= end;
    });

    const data: Data = {
        labels: labels,
        datasets: []
    };

    const initializeDataSetTemplate = () =>
        timePeriod.reduce((acc, date) => ({ ...acc, [date]: 0 }), {});

    const aggregateTransactions = (transactions: Transaction[], dataSetTemplate: { [key: string]: number }) =>
        transactions.reduce((dataSet, { date, amount, conversion }) => {
            const dateKey = date.split('T')[0];
            let amountToBeAdded;
            if (conversion) {
                amountToBeAdded = parseFloat(conversion.converted_amount);
            } else {
                amountToBeAdded = parseFloat(amount);
            }
            dataSet[dateKey] = (dataSet[dateKey] || 0) + amountToBeAdded;
            return dataSet;
        }, { ...dataSetTemplate });


    categories?.forEach((category) => {
        let categoryFilteredTransactions = filteredTransactions;
        let name = allCategories.find(c => c.id === category.category_id)?.name ?? "Total"
        if (category.category_id) {
            categoryFilteredTransactions = filteredTransactions.filter(t => t.category_id === category.category_id);
        }

        const incomeTransactions = categoryFilteredTransactions.filter(t => t.transaction_type !== "expense");
        const expenseTransactions = categoryFilteredTransactions.filter(t => t.transaction_type !== "income");

        const incomeDataSet = aggregateTransactions(incomeTransactions, initializeDataSetTemplate());
        const expenseDataSet = aggregateTransactions(expenseTransactions, initializeDataSetTemplate());

        data.datasets.push({
            label: `${name} Income`,
            data: Object.values(incomeDataSet),
            borderColor: category.income_color,
        });
        data.datasets.push({
            label: `${name} Expense`,
            data: Object.values(expenseDataSet),
            borderColor: category.expense_color,
        });
    })
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

export const parseDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2); 

    return `${year}-${month}-${day}`;
};