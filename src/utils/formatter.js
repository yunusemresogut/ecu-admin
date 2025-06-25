export function formatCurrency(value) {
    const number = parseFloat(value);

    if (isNaN(number)) return value;

    return new Intl.NumberFormat("tr-TR", {
        style: "currency",
        currency: "TRY",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
    })
        .format(number)
        .replace("₺", "")
        .trim();
}

export function dateFormatter(date) {
    return new Date(date).toLocaleString('tr-TR', {
        // weekday: 'long',
        month: 'long',
        day: 'numeric',
        year: 'numeric',
    });
}

export function dateFormatterTime(date) {
    return new Date(date).toLocaleString('tr-TR', {
        month: 'long',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}