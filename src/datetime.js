// data from expression controls
var progress = effect("Progress")("Slider");
var should_render = effect("Enabled")("Checkbox");

var difference = end_date.getTime() - start_date.getTime();
var step = (progress * difference) / 100;

function pad(val, len) {
    return new String(val).padStart(len, "0");
}

function ampm(hour) {
    return hour < 12 ? "AM" : "PM";
}

function twelve(hour) {
    return hour > 12 ? hour - 12 : hour;
}

function render(dt, txt) {
    let year = dt.getFullYear();
    let month = dt.getMonth();
    let date = dt.getDate();
    let day = dt.getDay();
    let hour = dt.getHours();
    let minute = dt.getMinutes();
    let second = dt.getSeconds();

    return new String(txt)
        .replaceAll("%a", days_abbr[day])
        .replaceAll("%A", days[date])
        .replaceAll("%b", months_abbr[month])
        .replaceAll("%B", months[month])
        .replaceAll("%c", dt.toLocaleString())
        .replaceAll("%d", pad(date, 2))
        .replaceAll("%H", pad(hour, 2))
        .replaceAll("%I", pad(twelve(hour), 2))
        .replaceAll("%j", "not implemented")
        .replaceAll("%m", pad(month, 2))
        .replaceAll("%M", pad(minute, 2))
        .replaceAll("%p", ampm(hour))
        .replaceAll("%S", pad(second, 2))
        .replaceAll("%U", "not implemented")
        .replaceAll("%w", day)
        .replaceAll("%W", "not implemented")
        .replaceAll("%x", dt.toLocaleDateString())
        .replaceAll("%X", dt.toLocaleTimeString())
        .replaceAll("%y", new String(year).substring(2, 4))
        .replaceAll("%Y", year)
        .replaceAll("%Z", "not implemented");
}

function conditional(bool, val1, val2) {
    return bool ? val1 : val2;
}

var months = [
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
var months_abbr = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
];

var days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
];

var days_abbr = ["Mon", "Tues", "Wed", "Thurs", "Fri", "Sat", "Sun"];

if (uppercase) {
    months = months.map((m) => m.toUpperCase());
    months_abbr = months_abbr.map((m) => m.toUpperCase());
    days = days.map((m) => m.toUpperCase());
    days_abbr = days_abbr.map((m) => m.toUpperCase());
}

var ms = start_date.getTime() + step;
var d = new Date(0);
d.setTime(ms);

text.sourceText =
    should_render == 1
        ? render(d, text.sourceText)
        : new String(text.sourceText);
