let btnNext = document.querySelector('.step-buttons__next');
let btnPrev = document.querySelector('.step-buttons__prev');
let stepItem = document.querySelectorAll('.step__item');
let navElem = document.querySelectorAll('.navigation__elem');
let stepCounter = 0;

const monthsByIndex = [
    "январь",
    "февраль",
    "март",
    "апрель",
    "май",
    "июнь",
    "июль",
    "август",
    "сентябрь",
    "октябрь",
    "ноябрь",
    "декабрь",
]


const startDateInputVacation = $("body > section > ul.calculate__step-list.step > li:nth-child(1) > div.step__data.vacation > label:nth-child(1) > input")
const endDateInputVacation = $("body > section > ul.calculate__step-list.step > li:nth-child(1) > div.step__data.vacation > label:nth-child(2) > input")
const countDaysInputVacation = $("body > section > ul.calculate__step-list.step > li:nth-child(1) > div.step__data.vacation > label:nth-child(3) > div > input")
const includeHolidaysElement = $("body > section > ul.calculate__step-list.step > li:nth-child(1) > div.step__data.vacation > label:nth-child(3) > div > span.include-holidays")
const includeHolidaysDaysElement = $("body > section > ul.calculate__step-list.step > li:nth-child(1) > div.step__data.vacation > label:nth-child(3) > div > span > span.include-holidays--day")

const startDateInputBillingPeriod = $("body > section > ul.calculate__step-list.step > li:nth-child(2) > div.step__data.vacation > label:nth-child(1) > input")
const endDateInputBillingPeriod = $("body > section > ul.calculate__step-list.step > li:nth-child(2) > div.step__data.vacation > label:nth-child(2) > input")
const countDaysInputBillingPeriod = $("body > section > ul.calculate__step-list.step > li:nth-child(2) > div.step__data.vacation > label:nth-child(3) > input")

const salaryDateTextElement = $("body > section > ul.calculate__step-list.step > li:nth-child(3) > div.step__item-salary > div.step__data.salary-data > div > span > span")

let holidays = [
    '10.06.2023',
    '20.06.2023'
]

btnNext.addEventListener('click', function () {


    for (let i = 0; i < stepItem.length; i++) {
        stepItem[i].style.display = 'none'
        navElem[i].classList.remove('navigation__elem--active');
    }

    stepCounter++

    if (stepCounter === stepItem.length - 2) {
        this.classList.remove('step-buttons__next--arrow')
        this.textContent = 'Рассчитать отпускные'
    } else if (stepCounter === stepItem.length - 1) {
        document.querySelector('.step-buttons').style.display = 'none'
    }

    stepItem[stepCounter].style.display = 'block';
    navElem[stepCounter].classList.add('navigation__elem--active');

    if (stepCounter > 0) {
        btnPrev.style.display = 'flex'
    } else {
        btnPrev.style.display = 'none'
    }

    if ([2].includes(stepCounter)) {
        if (stepCounter === 2) {
            if (salaryAmountInputElement.value && selectSalary.value === "salary") {
                btnNext.removeAttribute('disabled')
            } else {
                // btnNext.setAttribute('disabled', "true")
            }
        }
    }

})

btnPrev.addEventListener('click', function () {

    for (let i = 0; i < stepItem.length; i++) {
        stepItem[i].style.display = 'none'
        navElem[i].classList.remove('navigation__elem--active');
    }

    stepCounter--
    stepItem[stepCounter].style.display = 'block';
    navElem[stepCounter].classList.add('navigation__elem--active');

    if (stepCounter < 1) {
        btnPrev.style.display = 'none'
    } else if (stepCounter <= 2) {
        btnNext.textContent = 'Продолжить'
        btnNext.classList.add('step-buttons__next--arrow')
    }

    btnNext.removeAttribute('disabled')

})

$(function () {
    $(".input-data").datepicker({
        changeMonth: true,
        changeYear: true,
        // minDate: new Date("2023-01-01"),
        // yearRange: "1900:2100",
    })
});


// button support
let stepList = document.querySelector('.step');

stepList.addEventListener('click', function (e) {
    if (e.target.classList.contains('support__button')) {
        let answers = this.querySelectorAll('.support__answer');
        [...answers].forEach(answer => answer.style.display = 'none');

        e.target.parentElement.querySelector('.support__answer').style.display = 'block'
    }
    if (e.target.classList.contains('support__answer-close')) {
        e.target.parentElement.style.display = 'none'
    }
})

function datediff(first, second) {
    return Math.round((second - first) / (1000 * 60 * 60 * 24) + 1);
}

function parseDate(str) {
    let mdy = str.split('.');
    return new Date(mdy[2], mdy[1] - 1, mdy[0]);
}

function checkDateBetweenDates(startDate, endDate, checkDate) {
    let d1 = startDate.split(".");
    let d2 = endDate.split(".");
    let c = checkDate.split(".");

    let from = new Date(d1[2], parseInt(d1[1]) - 1, d1[0]);  // -1 because months are from 0 to 11
    let to = new Date(d2[2], parseInt(d2[1]) - 1, d2[0]);
    let check = new Date(c[2], parseInt(c[1]) - 1, c[0]);

    return check >= from && check <= to
}

function dateConvertToString(date) {
    const day = date.getDate()
    const month = date.getMonth() + 1
    return `${day < 10 ? '0' + day : day}.${month < 10 ? '0' + month : month}.${date.getFullYear()}`
}

function dateConvertToObject(date) {
    if (typeof date === 'string') {
        date = parseDate(date)
    }
    return {
        day: date.getDate(),
        month: date.getMonth() + 1,
        year: date.getFullYear()
    }
}

function addDayIfHoliday(startDate, countDays, startCountDays = null) {
    countDays = parseInt(countDays)
    if (startCountDays === null) {
        startCountDays = countDays
    }
    let calcEndDate = parseDate(startDate).addDays((countDays - 1))

    let includeHolidays = 0
    holidays.map(holiday => {
        if (checkDateBetweenDates(startDate, dateConvertToString(calcEndDate), holiday)) {
            includeHolidays++
        }
    })

    if (includeHolidays > 0 && (countDays !== (startCountDays + includeHolidays))) {
        return addDayIfHoliday(startDate, countDays + 1, startCountDays)
    }

    return {
        calcEndDate,
        includeHolidays
    }
}

Date.prototype.addDays = function (d) {
    return new Date(this.valueOf() + 864E5 * d);
}

function getLastDayOnMonthByDate(date) {
    const t = date;
    return new Date(t.getFullYear(), t.getMonth() + 1, 0, 23, 59, 59)
}

function getCountDaysInMonthByDate(date) {
    return getLastDayOnMonthByDate(date).getDate()
}

function getFirstDayOnMonthByDate(date) {
    const t = date;
    return new Date(t.getFullYear(), t.getMonth() + 1, 1, 0, 0, 0)
}

function setAfterChangeVacationPeriod(startDate) {
    setBillingPeriod(startDate)
    setWagePeriods(startDate)
}

function setBillingPeriod(startDate) {
    const startDateObject = dateConvertToObject(startDate)
    const startDateBillingPeriod = getFirstDayOnMonthByDate(parseDate(`1.${startDateObject.month - 1}.${startDateObject.year - 1}`))
    const endDateBillingPeriod = getLastDayOnMonthByDate(parseDate(`${startDateObject.day}.${startDateObject.month - 1}.${startDateObject.year}`))
    startDateInputBillingPeriod.datepicker('setDate', startDateBillingPeriod)
    endDateInputBillingPeriod.datepicker('setDate', endDateBillingPeriod)
    countDaysInputBillingPeriod.val(29.3 * 12) // 351,6
    countDaysInputBillingPeriod.attr("disabled", true)
    salaryDateTextElement.html(`${monthsByIndex[startDateObject.month - 1]} ${startDateObject.year - (startDateObject.month - 1 === 11 ? 2 : 1)}`)

    $(".except-data").datepicker({
        changeMonth: true,
        changeYear: true,
        minDate: startDateBillingPeriod,
        maxDate: endDateBillingPeriod,
        onSelect: function(dateText) {
            getCountValidDays()
        },
    })
}

function setWagePeriods(startDate) {
    const startDateObject = dateConvertToObject(startDate)
    document.querySelectorAll('.calculate-wage__table .period-title').forEach((period, key) => {
        let index = startDateObject.month - 1 + key
        let year = startDateObject.year - 1
        if (index > 11) {
            index = index - 12
            year++
        }
        period.innerHTML = `${monthsByIndex[index]} ${year}`
    })
}

function setPropsOnVacationPeriod(startDateInputVacation, endDateInputVacation, countDaysInputVacation, countDaysValue = null) {

    startDateInputVacation.removeClass('not-valid')
    endDateInputVacation.removeClass('not-valid')
    countDaysInputVacation.removeClass('not-valid')
    includeHolidaysElement.removeClass("--active")
    btnNext.removeAttribute('disabled')

    if ((startDateInputVacation.val() && endDateInputVacation.val()) || (startDateInputVacation.val() && countDaysValue)) {

        if (startDateInputVacation.val() && countDaysValue > 0) {

            const {
                calcEndDate,
                includeHolidays
            } = addDayIfHoliday(startDateInputVacation.val(), countDaysInputVacation.val())

            if (includeHolidays > 0) {
                includeHolidaysDaysElement.html(includeHolidays)
                includeHolidaysElement.addClass("--active")
            }

            if ((countDaysValue - includeHolidays) > 0) {
                endDateInputVacation.datepicker('setDate', calcEndDate)
                countDaysInputVacation.val(countDaysValue)
                setAfterChangeVacationPeriod(startDateInputVacation.val())
                return
            } else {
                console.error("Not use vacations")
            }

        } else if (startDateInputVacation.val() && endDateInputVacation.val()) {
            const countDaysLocal = datediff(parseDate(startDateInputVacation.val()), parseDate(endDateInputVacation.val()))
            if (countDaysLocal > 0) {
                let includeHolidays = 0
                holidays.map(holiday => {
                    if (checkDateBetweenDates(startDateInputVacation.val(), endDateInputVacation.val(), holiday)) {
                        includeHolidays++
                    }
                })

                if (includeHolidays > 0) {
                    includeHolidaysDaysElement.html(includeHolidays)
                    includeHolidaysElement.addClass("--active")
                }

                if ((countDaysLocal - includeHolidays) > 0) {
                    countDaysInputVacation.val(countDaysLocal - includeHolidays)
                    setAfterChangeVacationPeriod(startDateInputVacation.val())
                    return
                } else {
                    console.error("Not use vacations")
                }
            }
        }

        startDateInputVacation.addClass('not-valid')
        endDateInputVacation.addClass('not-valid')
        countDaysInputVacation.addClass('not-valid')
    }

    // btnNext.setAttribute('disabled', "true")
}

startDateInputVacation.on("change", () => {
    setPropsOnVacationPeriod(startDateInputVacation, endDateInputVacation, countDaysInputVacation)
})

endDateInputVacation.on("change", () => {
    setPropsOnVacationPeriod(startDateInputVacation, endDateInputVacation, countDaysInputVacation)
})

countDaysInputVacation.on("input", () => {
    setPropsOnVacationPeriod(startDateInputVacation, endDateInputVacation, countDaysInputVacation, countDaysInputVacation.val())
})