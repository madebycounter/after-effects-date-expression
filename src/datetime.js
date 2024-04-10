const SECONDS_PER_MINUTE = 60;
const SECONDS_PER_HOUR = SECONDS_PER_MINUTE * 60;
const SECONDS_PER_DAY = 24 * SECONDS_PER_HOUR;

const DAYS_PER_YEAR = 365;
const DAYS_PER_LEAP_YEAR = DAYS_PER_YEAR + 1;

const AM_PM = ["AM", "PM"];

const EPOCH_MONTH = 1;
const EPOCH_YEAR = 1970;

const MONTH_NAMES = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
];

const DAY_NAMES = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

function getDayName(day) {
    return uppercase ? DAY_NAMES[day].toUpperCase() : DAY_NAMES[day];
}

function getMonthName(month) {
    return uppercase ? MONTH_NAMES[month].toUpperCase() : MONTH_NAMES[month];
}

function isLeapYear(year) {
    return year % 400 == 0 || (year % 4 == 0 && year % 100 != 0);
}

function mod(n, d) {
    return ((n % d) + d) % d;
}

function dayOfWeek(ts) {
    return mod(Math.floor(ts / 86400) + 4, 7);
}

function daysInYear(year) {
    return isLeapYear(year) ? DAYS_PER_LEAP_YEAR : DAYS_PER_YEAR;
}

function daysInMonth(year) {
    return [
        31,
        isLeapYear(year) ? 29 : 28,
        31,
        30,
        31,
        30,
        31,
        31,
        30,
        31,
        30,
        31,
    ];
}

function getDateTime(ts, tz) {
    ts = ts + tz * SECONDS_PER_HOUR;

    days = Math.floor(ts / SECONDS_PER_DAY);
    year = EPOCH_YEAR;

    while (days >= daysInYear(year)) {
        days -= daysInYear(year);
        year++;
    }

    daysPerMonth = daysInMonth(year);
    month = EPOCH_MONTH;

    while (days >= daysPerMonth[month - 1]) {
        days -= daysPerMonth[month - 1];
        month++;
    }

    remaining = ts % SECONDS_PER_DAY;

    date = days + 1;

    day = dayOfWeek(ts);
    hour = Math.floor(remaining / SECONDS_PER_HOUR);
    minute = Math.floor(remaining / SECONDS_PER_MINUTE) % SECONDS_PER_MINUTE;
    second = Math.floor(remaining % SECONDS_PER_MINUTE);

    dayName = getDayName(day);
    monthName = getMonthName(month - 1);

    amPm = AM_PM[hour >= 12 ? 1 : 0];
    hourTwelve = hour = ((hour + 11) % 12) + 1;

    return {
        year,
        month,
        date,
        day,
        hour,
        minute,
        second,
        dayName,
        monthName,
        amPm,
        hourTwelve,
    };
}

function interpolateTime(start, end, percent) {
    return start + (end - start) * percent;
}

function pad(val, len) {
    return new String(val).padStart(len, "0");
}

function abbr(str) {
    return str.substring(0, 3);
}

function render(ts, txt) {
    let dt = getDateTime(ts, -7);

    return new String(txt)
        .replaceAll("%a", abbr(dt.dayName))
        .replaceAll("%A", dt.dayName)
        .replaceAll("%b", abbr(dt.monthName))
        .replaceAll("%B", dt.month)
        .replaceAll("%c", "NA")
        .replaceAll("%d", pad(dt.date, 2))
        .replaceAll("%H", pad(dt.hour, 2))
        .replaceAll("%I", pad(dt.hourTwelve, 2))
        .replaceAll("%j", "NA")
        .replaceAll("%m", pad(dt.month, 2))
        .replaceAll("%M", pad(dt.minute, 2))
        .replaceAll("%p", dt.amPm)
        .replaceAll("%S", pad(dt.second, 2))
        .replaceAll("%U", "NA")
        .replaceAll("%w", dt.day)
        .replaceAll("%W", "NA")
        .replaceAll("%x", "NA")
        .replaceAll("%X", "NA")
        .replaceAll("%y", new String(dt.year).substring(2, 4))
        .replaceAll("%Y", dt.year)
        .replaceAll("%Z", "NA");
}

var progress = effect("Progress")("Slider");
var should_render = effect("Enabled")("Checkbox");

var dateTime =
    interpolateTime(start_date.getTime(), end_date.getTime(), progress / 100) /
    1000;

text.sourceText =
    should_render == 1
        ? render(dateTime, text.sourceText)
        : new String(text.sourceText);
