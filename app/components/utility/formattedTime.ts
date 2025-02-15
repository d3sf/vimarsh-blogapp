interface TimeValue {
    timevalue: string | number | Date;
}

export const formattedDate = (timevalue: TimeValue['timevalue']): string => {
    return new Date(timevalue)
        .toLocaleDateString("en-US", {
            month: "short",
            day: "2-digit",
            year: "numeric",
        })
        .replace(",", "");
}

export const formattedMonthYear = (timevalue: TimeValue['timevalue']): string => {
    return new Date(timevalue)
        .toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
        })
        .replace(",", "");
}