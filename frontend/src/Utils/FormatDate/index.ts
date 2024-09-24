export const formatDateWithSuffix = (value: string | Date): string => {
    let date = new Date(value);  // Create a Date object
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    let month = monthNames[date.getMonth()];  // Get the month name
    let day = date.getDate();  // Get the day of the month
    let year = date.getFullYear();  // Get the full year

    // Helper function to get the ordinal suffix
    const getOrdinalSuffix = (day: number) => {
        if (day > 3 && day < 21) return 'th';  // Handle 11th to 20th
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    let dayWithSuffix = `${day}${getOrdinalSuffix(day)}`;  // Add the suffix to the day

    return `${month} ${dayWithSuffix}, ${year}`;  // Return formatted date string
};