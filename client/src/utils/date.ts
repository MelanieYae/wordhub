import moment from "moment";

// format date to simple date string
export function formatDate(date: Date) {
    return moment(date).calendar()
}