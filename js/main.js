let holidays = [
  "01.01.XXXX",
  "02.01.XXXX",
  "03.01.XXXX",
  "04.01.XXXX",
  "05.01.XXXX",
  "06.01.XXXX",
  "07.01.XXXX",
  "08.01.XXXX",
  "23.02.XXXX",
  "08.03.XXXX",
  "01.05.XXXX",
  "09.05.XXXX",
  "12.06.XXXX",
  "04.11.XXXX",
]

// сделаем все года с 1970 по 2100 с праздничными днями
function getHolidays() {
  let holidaysAllYears = []
  for (let i = 1970; i <= 2100; i++) {
    holidays.map((holiday) => {
      holidaysAllYears.push(holiday.replace('XXXX', `${i}`))
    })
  }
  return holidaysAllYears
}

let stepCounter = 0

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

let btnNext = document.querySelector(".step-buttons__next")
let btnPrev = document.querySelector(".step-buttons__prev")
let stepItem = document.querySelectorAll(".step__item")
let navElem = document.querySelectorAll(".navigation__elem")

const startDateInputVacation = $("body > section > ul.calculate__step-list.step > li:nth-child(1) > div.step__data.vacation > label:nth-child(1) > input")
const endDateInputVacation = $("body > section > ul.calculate__step-list.step > li:nth-child(1) > div.step__data.vacation > label:nth-child(2) > input")
const countDaysInputVacation = $("body > section > ul.calculate__step-list.step > li:nth-child(1) > div.step__data.vacation > label:nth-child(3) > div > input")
const includeHolidaysElement = $("body > section > ul.calculate__step-list.step > li:nth-child(1) > div.step__data.vacation > label:nth-child(3) > div > span.include-holidays")
const includeHolidaysDaysElement = $("body > section > ul.calculate__step-list.step > li:nth-child(1) > div.step__data.vacation > label:nth-child(3) > div > span > span.include-holidays--day")

const startDateInputBillingPeriod = $("body > section > ul.calculate__step-list.step > li:nth-child(2) > div.step__data.vacation > label:nth-child(1) > input")
const endDateInputBillingPeriod = $("body > section > ul.calculate__step-list.step > li:nth-child(2) > div.step__data.vacation > label:nth-child(2) > input")
const countDaysInputBillingPeriod = $("body > section > ul.calculate__step-list.step > li:nth-child(2) > div.step__data.vacation > label:nth-child(3) > input")
const countDaysSpanBillingPeriod = $(".countDaysSpanBillingPeriod")
const countMonthSpanBillingPeriod = $(".countMonthSpanBillingPeriod")
const averageCountDaysSpanBillingPeriod = $(".averageCountDaysSpanBillingPeriod")
const calculateExample = $(".except-help__example")

const resultCalculate__example = $(".result-calculate__example")
const resultCalculate__salary = $(".result-calculate__salary")
const resultCalculate__day = $(".result-calculate__day")
const resultCalculate__averageIncome = $(".result-calculate__average-income")
const resultCalculate__vacation = $(".result-calculate__vacation")
const tableResultBody = $(".calculate__result-table.table-result tbody")

const salaryDateTextElement = $("body > section > ul.calculate__step-list.step > li:nth-child(3) > div.step__item-salary > div.step__data.salary-data > div > span > span")

const downloadResultButtonEl = document.body.querySelector('.calculate__btn-result')
downloadResultButtonEl.addEventListener('click', async () => {

  let params = new URLSearchParams();
  params.set('data', JSON.stringify(resultObject));

  await fetch("./dataToDocx.php", {
    method: 'POST',
    body: params
  }).then((response) => {
    response.text().then((link) => {
      function download(filename, link) {
        const element = document.createElement("a")
        element.setAttribute("href", "./" + link)
        element.setAttribute("download", filename)

        element.style.display = "none"
        document.body.appendChild(element)

        element.click()

        document.body.removeChild(element)
      }

      download("Отпускные.docx", link)
    })
  })
})

// button support
let stepList = document.querySelector(".step")

function datediff(first, second) {
  return Math.round((second - first) / (1000 * 60 * 60 * 24) + 1)
}

function parseDate(str) {
  let mdy = str.split(".")
  return new Date(mdy[2], mdy[1] - 1, mdy[0])
}

function dateToStr(date) {
  let day = date.getDate()
  day = day < 10 ? "0" + day : day
  let month = date.getMonth() + 1
  month = month < 10 ? "0" + month : month
  return `${day}.${month}.${date.getFullYear()}`
}

function checkDateBetweenDates(startDate, endDate, checkDate) {
  let d1 = startDate.split(".")
  let d2 = endDate.split(".")
  let c = checkDate.split(".")

  let from = new Date(d1[2], parseInt(d1[1]) - 1, d1[0])  // -1 because months are from 0 to 11
  let to = new Date(d2[2], parseInt(d2[1]) - 1, d2[0])
  let check = new Date(c[2], parseInt(c[1]) - 1, c[0])

  return check >= from && check <= to
}

function dateConvertToString(date) {
  const day = date.getDate()
  const month = date.getMonth() + 1
  return `${day < 10 ? "0" + day : day}.${month < 10 ? "0" + month : month}.${date.getFullYear()}`
}

function dateConvertToObject(date) {
  if (typeof date === "string") {
    date = parseDate(date)
  }
  return {
    day: date.getDate(),
    month: date.getMonth() + 1,
    year: date.getFullYear(),
  }
}

function addDayIfHoliday(startDate, countDays, startCountDays = null) {
  countDays = parseInt(countDays)
  if (startCountDays === null) {
    startCountDays = countDays
  }
  let calcEndDate = parseDate(startDate).addDays((countDays - 1))

  let includeHolidays = 0
  getHolidays().map(holiday => {
    if (checkDateBetweenDates(startDate, dateConvertToString(calcEndDate), holiday)) {
      includeHolidays++
    }
  })

  if (includeHolidays > 0 && (countDays !== (startCountDays + includeHolidays))) {
    return addDayIfHoliday(startDate, countDays + 1, startCountDays)
  }

  return {
    calcEndDate,
    includeHolidays,
  }
}

Date.prototype.addDays = function (d) {
  return new Date(this.valueOf() + 864E5 * d)
}

Date.prototype.removeDays = function (d) {
  return new Date(this.valueOf() - 864E5 * d)
}


// Date.prototype.addDays = function(days) {
//   var date = new Date(this.valueOf());
//   date.setDate(date.getDate() + days);
//   return date;
// }
// var date = new Date();
// console.log(date.addDays(5));

function getLastDayOnMonthByDate(date, endOfDay = false) {
  const t = date
  return new Date(t.getFullYear(), t.getMonth() + 1, 0, endOfDay ? 23 : 0, endOfDay ? 59 : 0, endOfDay ? 59 : 0)
}

function getCountDaysInMonthByDate(date) {
  return getLastDayOnMonthByDate(date).getDate()
}

function getFirstDayOnMonthByDate(date) {
  const t = date
  return new Date(t.getFullYear(), t.getMonth(), 1, 0, 0, 0)
}

function setAfterChangeVacationPeriod(startDate, endDate) {
  setBillingPeriod(startDate)
  setWagePeriods(startDateInputBillingPeriod.val(), 12)
}

function setBillingPeriod(startDate) {
  const startDateObject = dateConvertToObject(startDate)
  const startDateBillingPeriod = getFirstDayOnMonthByDate(parseDate(`1.${startDateObject.month}.${startDateObject.year - 1}`))
  const endDateBillingPeriod = getLastDayOnMonthByDate(parseDate(`${startDateObject.day}.${startDateObject.month - 1}.${startDateObject.year}`))

  $(".billing-period .vacation__input").datepicker("option", {
    changeMonth: true,
    changeYear: true,
    minDate: startDateBillingPeriod,
    maxDate: endDateBillingPeriod,
    onSelect: function (dateText) {
      setIntervalForRelationToBillingPeriod()
      checkAndSetCountValidDays()
    },
  })

  startDateInputBillingPeriod.datepicker("setDate", startDateBillingPeriod)
  endDateInputBillingPeriod.datepicker("setDate", endDateBillingPeriod)
  calculate()
  // setCountDaysInputBillingPeriod(351.6, 12, null)
  countDaysInputBillingPeriod.attr("disabled", true)
  salaryDateTextElement.html(`${monthsByIndex[startDateObject.month - 1]} ${startDateObject.year - (startDateObject.month - 1 === 11 ? 2 : 1)}`)

  setIntervalForRelationToBillingPeriod()
}

function setCountDaysInputBillingPeriod(days, countMonth, daysInNotFullMonth) {
  countDaysSpanBillingPeriod.html(days)
  countMonthSpanBillingPeriod.each(function () {
    this.innerHTML = countMonth
  })

  const totalDays = parseFloat((countMonth ? (Number(days) / Number(countMonth)) : 0).toFixed(4))

  let daysLocal = 0
  let monthLocal = 0
  let daysLocal2 = 0

  if (daysInNotFullMonth) {
    daysLocal = parseFloat((days + daysInNotFullMonth).toFixed(4))
    monthLocal = countMonth + Math.floor(daysInNotFullMonth / 29.3)
    daysLocal2 = daysInNotFullMonth - (Math.floor(daysInNotFullMonth / 29.3)) * 29.3
    countDaysInputBillingPeriod.val(daysLocal)
    calculateExample.html(`${monthLocal} мес. х 29,3 дн. + ${parseFloat((daysLocal2).toFixed(4))} дн. = ${daysLocal} дн.`)
  } else {
    countDaysInputBillingPeriod.val(days)
    calculateExample.html(`${countMonth} мес. х 29,3 дн. = ${days} дн.`)
  }
  averageCountDaysSpanBillingPeriod.each(function () {
    this.innerHTML = totalDays
  })

  return {
    days,
    countMonth,
    daysInNotFullMonth,
    totalDays,
    daysLocal,
    monthLocal,
    daysLocal2,
  }
}

function setIntervalForRelationToBillingPeriod() {
  $(".except-data").datepicker("option", {
    changeMonth: true,
    changeYear: true,
    minDate: parseDate(startDateInputBillingPeriod.val()),
    maxDate: parseDate(endDateInputBillingPeriod.val()),
    onSelect: function (dateText) {
      checkAndSetCountValidDays()
    },
  })

  $(".calculate-salary__item .input-data, .wage-data__change .input-data").datepicker("option", {
    changeMonth: true,
    changeYear: true,
    minDate: parseDate(startDateInputBillingPeriod.val()),
    maxDate: parseDate(endDateInputVacation.val()),
    onSelect: function (dateText) {
      checkForOpenNextBtn()
    },
  })
}

function setWagePeriods(startDateString, totalMonth) {

  const startDate = parseDate(startDateString)

  document.querySelectorAll(".calculate-wage__table tr:not(:last-child)").forEach((periodContainer, key) => {
    periodContainer.classList.add("hide-row")
    periodContainer.querySelector(".wage-table__data-input").dataset.notUse = "true"
  })

  let localDate = new Date(startDate.getTime())
  for (let i = 0; i < totalMonth; i++) {
    let currentLocalDate = new Date(localDate.getTime())
    localDate = new Date(localDate.setMonth(localDate.getMonth() + 1))
    let localMonth = localDate.getMonth()
    localMonth = localMonth < 10 ? (localMonth === 0 ? 12 : "0" + localMonth) : localMonth
    let localYear = currentLocalDate.getFullYear()

    const periodContainer = document.querySelector(`.calculate-wage__table tr:nth-child(${i + 1})`)
    periodContainer.querySelector(".period-title").innerHTML = `${monthsByIndex[Number(localMonth) - 1]} ${localYear}`
    periodContainer.classList.remove("hide-row")

    const inputSalary = periodContainer.querySelector(".wage-table__data-input")
    inputSalary.dataset.date = `${localMonth}.${localYear}`
    inputSalary.dataset.notUse = "false"

  }
}

function setPropsOnVacationPeriod(startDateInputVacation, endDateInputVacation, countDaysInputVacation, countDaysValue = null) {

  startDateInputVacation.removeClass("not-valid")
  endDateInputVacation.removeClass("not-valid")
  countDaysInputVacation.removeClass("not-valid")
  includeHolidaysElement.removeClass("--active")
  btnNext.removeAttribute("disabled")

  if ((startDateInputVacation.val() && endDateInputVacation.val()) || (startDateInputVacation.val() && countDaysValue)) {

    if (startDateInputVacation.val() && countDaysValue > 0) {

      const {
        calcEndDate,
        includeHolidays,
      } = addDayIfHoliday(startDateInputVacation.val(), countDaysInputVacation.val())

      if (includeHolidays > 0) {
        includeHolidaysDaysElement.html(includeHolidays)
        includeHolidaysElement.addClass("--active")
      }

      if ((countDaysValue - includeHolidays) > 0) {
        endDateInputVacation.datepicker("setDate", calcEndDate)
        countDaysInputVacation.val(countDaysValue)
        setAfterChangeVacationPeriod(startDateInputVacation.val(), endDateInputVacation.val())
        return
      } else {
        console.error("Not use vacations")
      }

    } else if (startDateInputVacation.val() && endDateInputVacation.val()) {
      const countDaysLocal = datediff(parseDate(startDateInputVacation.val()), parseDate(endDateInputVacation.val()))
      if (countDaysLocal > 0) {
        let includeHolidays = 0
        getHolidays().map(holiday => {
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
          setAfterChangeVacationPeriod(startDateInputVacation.val(), endDateInputVacation.val())
          return
        } else {
          console.error("Not use vacations")
        }
      }
    }

    startDateInputVacation.addClass("not-valid")
    endDateInputVacation.addClass("not-valid")
    countDaysInputVacation.addClass("not-valid")
  }

  btnNext.setAttribute("disabled", "true")
}

function splitPeriodOnMonth(startDate, endDate) {

  const countDays = datediff(startDate, endDate)

  const monthWithDays = {}

  let localStartDate = startDate

  for (let i = 1; i <= countDays; i++) {

    const dateStr = dateToStr(getFirstDayOnMonthByDate(localStartDate))
    if (!monthWithDays[dateStr]) {
      monthWithDays[dateStr] = {startPeriodOnMonth: dateToStr(localStartDate)}
    }

    monthWithDays[dateStr].endPeriodOnMonth = dateToStr(localStartDate)

    localStartDate = localStartDate.addDays(1)
  }

  return monthWithDays
}

async function calculate() {

  const {
    validDays,
    countMonth: countMonthInFullPeriod,
  } = getValidDaysInPeriod(startDateInputBillingPeriod.val(), endDateInputBillingPeriod.val())

  // начало расчетного периода
  const startDateBillingPeriod = parseDate(startDateInputBillingPeriod.val())
  const endDateBillingPeriod = parseDate(endDateInputBillingPeriod.val())

  let countVacationsDays = countDaysInputVacation.val()

  tableResultBody.html("")


  // if (true || selectSalary.value === "salary"/* && !salarySwitcher.checked*/) {
  // if (true || calculatePremium.children.length === 0 && calculateSupplement.children.length === 0) {

  const excludedWorkedDays = {}
  const excludedPeriods = {}
  const countExcludedDays = {}

  // получаем рабочие дни с бэка
  let workedDaysFromBackEnd = await getWorkedDaysByDates(getFirstDayOnMonthByDate(parseDate(startDateInputBillingPeriod.val())), getLastDayOnMonthByDate(parseDate(endDateInputBillingPeriod.val())))

  // бежим по исключениям (если включена галка (has-expected-dates))
  document.body.querySelectorAll(".calculate-period.has-expected-dates .except-dates__wrapper").forEach((exceptDates) => {
    const startExpectDateEl = exceptDates.querySelector(".except-data[data-except-start]")
    const endExpectDateEl = exceptDates.querySelector(".except-data[data-except-end]")

    const startExpectDate = parseDate(startExpectDateEl.value)
    const endExpectDate = parseDate(endExpectDateEl.value)

    const excludedDatesByMonth = splitPeriodOnMonth(startExpectDate, endExpectDate)

    Object.keys(excludedDatesByMonth).forEach((firstNumberInMonth) => {


      if (!excludedWorkedDays[firstNumberInMonth]) {
        excludedWorkedDays[firstNumberInMonth] = 0
      }

      if (!countExcludedDays[firstNumberInMonth]) {
        countExcludedDays[firstNumberInMonth] = 0
      }

      if (!excludedPeriods[firstNumberInMonth]) {
        excludedPeriods[firstNumberInMonth] = []
      }

      const startPeriodOnMonth = excludedDatesByMonth[firstNumberInMonth].startPeriodOnMonth
      const endPeriodOnMonth = excludedDatesByMonth[firstNumberInMonth].endPeriodOnMonth
      const workedDays = getCountWorkedDaysByDates(parseDate(startPeriodOnMonth), parseDate(endPeriodOnMonth), workedDaysFromBackEnd)

      excludedWorkedDays[firstNumberInMonth] += workedDays

      countExcludedDays[firstNumberInMonth] += datediff(parseDate(startPeriodOnMonth), parseDate(endPeriodOnMonth))

      excludedPeriods[firstNumberInMonth].push({
        startPeriod: startPeriodOnMonth,
        endPeriod: endPeriodOnMonth,
      })
    })
  })


  const supplementByPeriods = {}
  let totalSupplementByPeriods = 0
  // бежим по всем доп. выплатам
  document.body.querySelectorAll(".calculate__bonus-supplement .supplement-data--supplemen").forEach((supplementDates) => {
    const startDateEl = supplementDates.querySelector(".input-data.start-date")
    const endDateEl = supplementDates.querySelector(".input-data.end-date")
    const valueEl = supplementDates.querySelector(".premium-field__input.premium-sum")

    const startDate = parseDate(startDateEl.value)
    const endDate = parseDate(endDateEl.value)
    const value = Number(valueEl.value)

    const splitDatesByMonth = splitPeriodOnMonth(startDate, endDate)

    Object.keys(splitDatesByMonth).forEach((firstNumberInMonth) => {

      if (!supplementByPeriods[firstNumberInMonth]) {
        supplementByPeriods[firstNumberInMonth] = 0
      }

      const startPeriodOnMonth = splitDatesByMonth[firstNumberInMonth].startPeriodOnMonth
      const endPeriodOnMonth = splitDatesByMonth[firstNumberInMonth].endPeriodOnMonth
      const workedDaysOnMonth = getCountWorkedDaysByDates(getFirstDayOnMonthByDate(parseDate(startPeriodOnMonth)), getLastDayOnMonthByDate(parseDate(endPeriodOnMonth)), workedDaysFromBackEnd)
      const workedDaysOnPeriod = getCountWorkedDaysByDates(parseDate(startPeriodOnMonth), parseDate(endPeriodOnMonth), workedDaysFromBackEnd)

      supplementByPeriods[firstNumberInMonth] += (value / workedDaysOnMonth * workedDaysOnPeriod)
      totalSupplementByPeriods += supplementByPeriods[firstNumberInMonth]
    })
  })

  let totalCalendarDaysInBullingPeriod = 0
  let countFullMonth = 0

  let totalWorkedDaysInBullingPeriod = 0
  let totalWorkedDaysInBullingPeriodWithExcludedDays = 0

  const textDetail = []

  const workedDaysInMonths = {}
  const workedDaysInMonthsByPeriods = {}
  const countDaysInMonth = {}
  const countDaysInMonthByPeriods = {}

  const monthForIteration = new Date(startDateBillingPeriod.getTime())

  // бежим по всем месяцам расчетного периода
  for (let i = 0; i < countMonthInFullPeriod; i++) {

    const humanNextMonth = monthForIteration.getMonth() + 1 // следующий месяц

    const nextDate = new Date(monthForIteration.setMonth(humanNextMonth))

    const startDateInPeriod = i === 0 ? startDateBillingPeriod : new Date(`${humanNextMonth}.01.${humanNextMonth === 12 ? nextDate.getFullYear() - 1 : nextDate.getFullYear()}`)  // возможно не чало месяца (05.02.2022) - ставим на 1 число месяца

    const startDateYear = startDateInPeriod.getFullYear()

    const startDateInMonth = new Date(`${humanNextMonth}.01.${startDateYear}`)

    const endDateInMonth = getLastDayOnMonthByDate(startDateInMonth)

    // итерируемый месяц может быть последним в расчетном периоде, поэтому возьмем дату конца расчетного периода
    const endDateInPeriod = countMonthInFullPeriod !== (i + 1) ? endDateInMonth : endDateBillingPeriod

    //получаем количетсво рабочих дней в месяце
    //получаем количество рабочих дней в периоде с начала до конца (период мог начаться с 10 числа месяца)
    const countWorkedDaysInPeriod = getCountWorkedDaysByDates(startDateInPeriod, endDateInPeriod, workedDaysFromBackEnd)
    const countWorkedDaysInMonth = getCountWorkedDaysByDates(startDateInMonth, endDateInMonth, workedDaysFromBackEnd)

    if (!workedDaysInMonths[dateToStr(startDateInMonth)]) {
      workedDaysInMonths[dateToStr(startDateInMonth)] = 0
    }

    const countWithoutExcludedDays = countWorkedDaysInPeriod - (excludedWorkedDays[dateToStr(startDateInMonth)] || 0)

    workedDaysInMonthsByPeriods[dateToStr(startDateInMonth)] = countWithoutExcludedDays
    workedDaysInMonths[dateToStr(startDateInMonth)] = countWorkedDaysInMonth

    totalWorkedDaysInBullingPeriodWithExcludedDays += countWithoutExcludedDays
    totalWorkedDaysInBullingPeriod += countWorkedDaysInMonth

    countDaysInMonth[dateToStr(startDateInMonth)] = datediff(startDateInMonth, endDateInMonth)
    countDaysInMonthByPeriods[dateToStr(startDateInMonth)] = datediff(startDateInPeriod, endDateInPeriod)

    if (
      datediff(startDateInMonth, endDateInMonth) === datediff(startDateInPeriod, endDateInPeriod)
      && !countExcludedDays[dateToStr(startDateInMonth)]
    ) {
      totalCalendarDaysInBullingPeriod += 29.3
      countFullMonth++
    } else /*if (datediff(startDateInMonth, endDateInMonth) !== (countExcludedDays[dateToStr(startDateInMonth)] || 0))*/ {
      totalCalendarDaysInBullingPeriod += 29.3 / datediff(startDateInMonth, endDateInMonth) * (datediff(startDateInPeriod, endDateInPeriod) - (countExcludedDays[dateToStr(startDateInMonth)] || 0))
      textDetail.push(`( 29.3 дн. / ${datediff(startDateInMonth, endDateInMonth)} дн. x ( ${datediff(startDateInPeriod, endDateInPeriod)} дн.` + (countExcludedDays[dateToStr(startDateInMonth)] ? ` - ${countExcludedDays[dateToStr(startDateInMonth)]} дн. )` : " )") + " )")
    }
  }

  totalCalendarDaysInBullingPeriod = Number(totalCalendarDaysInBullingPeriod.toFixed(4))

  // годовая, полгодовые и квартальные премии и прочие производственные
  const premiums = []
  let premiumYearEl = document.body.querySelector(".calculate-premium .premium__last-year .premium-field__input")
  let premiumYearDateEl = premiumYearEl?.closest(".premium__last-year").querySelector(".premium-field__input.input-data.month-accrual")
  let premiumYear = premiumYearEl?.value ? Number(premiumYearEl?.value) : 0
  const yearPremiumWithExcludedDays = premiumYear / totalWorkedDaysInBullingPeriod * totalWorkedDaysInBullingPeriodWithExcludedDays
  if (premiumYearDateEl) {
    premiums.push({
      date: premiumYearDateEl.value,
      value: yearPremiumWithExcludedDays,
      type: "Годовая премия",
    })
  }

  let premiumsHalfYear = 0
  document.body.querySelectorAll(".calculate-premium .premium__half-year .premium-field__input.premium-sum").forEach((premiumHalfYearEl) => {
    const startPeriodEl = premiumHalfYearEl.closest(".premium__half-year").querySelector(".premium-data__wrapper-period .start-period")
    const endPeriodEl = premiumHalfYearEl.closest(".premium__half-year").querySelector(".premium-data__wrapper-period .end-period")
    const premiumDateEl = premiumHalfYearEl.closest(".premium__half-year").querySelector(".premium-field__input.input-data.month-accrual")

    const startDate = parseDate(startPeriodEl.value)
    const endDate = parseDate(endPeriodEl.value)

    const datesByMonth = splitPeriodOnMonth(startDate, endDate)

    let reCalculate = false
    Object.keys(datesByMonth).forEach((firstNumberInMonth) => {
      if (excludedPeriods.hasOwnProperty(firstNumberInMonth)) {
        reCalculate = true
      }
    })

    let premiumHalfYear = Number(premiumHalfYearEl.value)
    if (reCalculate) {
      premiumHalfYear = Number(premiumHalfYearEl.value) / totalWorkedDaysInBullingPeriod * totalWorkedDaysInBullingPeriodWithExcludedDays
    }
    premiumsHalfYear += premiumHalfYear

    premiums.push({
      date: premiumDateEl.value,
      value: premiumHalfYear,
      type: "Полугодовая премия",
    })

  })

  let premiumsQuarterYear = 0
  document.body.querySelectorAll(".calculate-premium .premium__quarter-year .premium-field__input.premium-sum").forEach((premiumQuarterYearEl) => {
    const startPeriodEl = premiumQuarterYearEl.closest(".premium__quarter-year").querySelector(".premium-data__wrapper-period .start-period")
    const endPeriodEl = premiumQuarterYearEl.closest(".premium__quarter-year").querySelector(".premium-data__wrapper-period .end-period")
    const premiumDateEl = premiumQuarterYearEl.closest(".premium__quarter-year").querySelector(".premium-field__input.input-data.month-accrual")

    const startDate = parseDate(startPeriodEl.value)
    const endDate = parseDate(endPeriodEl.value)

    const datesByMonth = splitPeriodOnMonth(startDate, endDate)

    let reCalculate = false
    Object.keys(datesByMonth).forEach((firstNumberInMonth) => {
      if (excludedPeriods.hasOwnProperty(firstNumberInMonth)) {
        reCalculate = true
      }
    })

    let premiumQuarterYear = Number(premiumQuarterYearEl.value)
    if (reCalculate) {
      premiumQuarterYear = Number(premiumQuarterYearEl.value) / totalWorkedDaysInBullingPeriod * totalWorkedDaysInBullingPeriodWithExcludedDays
    }

    premiumsQuarterYear += premiumQuarterYear

    premiums.push({
      date: premiumDateEl.value,
      value: premiumQuarterYear,
      type: "Квартальная премия",
    })

  })

  let monthlyOtherPremium = 0
  document.body.querySelectorAll(`.calculate__bonus-premium .calculate-premium .premium__other-production`).forEach((monthlyOtherPremiumEl) => {
    const dateEl = monthlyOtherPremiumEl.querySelector('.premium-field__input.input-data.month-accrual')
    const premiumDate = dateEl.dataset.date

    const valueEl = monthlyOtherPremiumEl.querySelector('.premium-field__input.premium-sum')
    const value = Number(valueEl.value)

    monthlyOtherPremium += value

    premiums.push({
      date: premiumDate,
      value: value,
      type: "Прочие производственные",
    })
  })


  // бежим по каждому дню расчетного периода
  const countDays = datediff(startDateBillingPeriod, endDateBillingPeriod)

  let localStartDate = endDateBillingPeriod

  let monthlySalary = Number(salaryAmountInputElement.val())

  if (selectSalary.value === "salary" && document.body.querySelector(".calculate-salary.has-change-salary .calculate-salary__item:last-child .salary-field__input.salary-data")?.value) {
    monthlySalary = Number(document.body.querySelector(".calculate-salary.has-change-salary .calculate-salary__item:last-child .salary-field__input.salary-data")?.value)
  } else if (selectSalary.value === "wage" && wageSwitcher.checked) {
    monthlySalary = Number(document.body.querySelector(`.calculate-wage__content.has-change-salary .wage-data__change:last-child .wage-field__input.salary-data`)?.value)
  }

  let lastIndexingSalary = 0
  let isIndexing = false

  let lastIndexingMonthlyPremium = 0
  let isIndexingMonthlyPremium = false

  let lastIndexingMonthlySupplement = 0
  let isIndexingMonthlySupplement = false

  const salaryEveryDay = {}
  const salaryPerMonths = {}

  let totalSalary = 0

  for (let i = countDays; i >= 1; i--) {

    const dateStr = dateToStr(localStartDate)

    let newSalaryEl = null
    let newSalary = 0

    // оклад
    if (selectSalary.value === "salary") {
      newSalaryEl = document.body.querySelector(`.calculate-salary.has-change-salary .salary-field__input.salary-data[data-date="${dateStr}"]`)
      newSalary = newSalaryEl ? Number(newSalaryEl.value) : 0

      if (!isIndexing && newSalaryEl?.closest(".calculate-salary__item").querySelector(".index-switcher__checkbox").checked) {
        isIndexing = true
        lastIndexingSalary = newSalary
      }

      // сдельная
    } else if (selectSalary.value === "wage") {
      const salaryEl = document.body.querySelector(`.calculate-wage tr:not(.hide-row) .wage-table__data-input[data-date="${(localStartDate.getMonth() + 1) < 10 ? "0" + (localStartDate.getMonth() + 1) : localStartDate.getMonth() + 1}.${localStartDate.getFullYear()}"]`)
      monthlySalary = salaryEl ? Number(salaryEl.value) : 0

      newSalaryEl = document.body.querySelector(`.calculate-wage__content.has-change-salary .wage-field__input.salary-data[data-date="${dateStr}"]`)
      newSalary = newSalaryEl ? Number(newSalaryEl.value) : 0

      if (!isIndexing && wageSwitcher.checked && newSalary) {
        isIndexing = true
        lastIndexingSalary = newSalary
      }
    }

    // месячные премии индексируемые
    const monthlyPremiumDateEl = document.body.querySelector(`.calculate__bonus-premium .calculate-premium .premium__monthly .month-accrual[data-first-date-month="${dateToStr(getFirstDayOnMonthByDate(localStartDate))}"]`)

    const monthlyPremiumEl = monthlyPremiumDateEl?.closest(".premium__monthly").querySelector(".premium-field__input.premium-sum")
    const monthlyPremium = monthlyPremiumEl ? Number(monthlyPremiumEl?.value) : 0

    const monthlyPremiumIsIndexingEl = monthlyPremiumDateEl?.closest(".premium__monthly").querySelector(".monthly-switcher__checkbox")

    if (!isIndexingMonthlyPremium && monthlyPremiumIsIndexingEl?.checked) {
      isIndexingMonthlyPremium = true
      lastIndexingMonthlyPremium = monthlyPremium
    }

    // прочие месячные надбавки индексируемые
    const monthlySupplementDateEl = document.body.querySelector(`.calculate__bonus-supplement .calculate-supplement .supplement__other-payments .month-accrual[data-first-date-month="${dateToStr(getFirstDayOnMonthByDate(localStartDate))}"]`)

    const monthlySupplementEl = monthlySupplementDateEl?.closest(".supplement__other-payments").querySelector(".premium-field__input.premium-sum")
    const monthlySupplement = monthlySupplementEl ? Number(monthlySupplementEl?.value) : 0

    const monthlySupplementIsIndexingEl = monthlySupplementDateEl?.closest(".supplement__other-payments").querySelector(".payment-switcher__checkbox")

    if (!isIndexingMonthlySupplement && monthlySupplementIsIndexingEl?.checked) {
      isIndexingMonthlySupplement = true
      lastIndexingMonthlySupplement = monthlySupplement
    }

    let coefficientIndexing = "-"
    if (isIndexing && lastIndexingSalary !== monthlySalary) {
      coefficientIndexing = lastIndexingSalary / monthlySalary
      if (isIndexingMonthlyPremium && monthlyPremium) {
        coefficientIndexing = (lastIndexingSalary + lastIndexingMonthlyPremium) / (monthlySalary + monthlyPremium)
      }

      if (isIndexingMonthlySupplement && monthlySupplement) {
        coefficientIndexing = (lastIndexingSalary + lastIndexingMonthlyPremium + lastIndexingMonthlySupplement) / (monthlySalary + monthlyPremium + monthlySupplement)
      }
    }

    const monthlySalaryAfterIndexing = lastIndexingSalary !== monthlySalary ? lastIndexingSalary : 0
    const monthlyPremiumAfterIndexing = lastIndexingSalary !== monthlySalary && monthlyPremium ? lastIndexingMonthlyPremium : 0
    const monthlySupplementAfterIndexing = lastIndexingSalary !== monthlySalary && monthlySupplement ? lastIndexingMonthlySupplement : 0

    let isNotCalculate = !!excludedPeriods[dateToStr(getFirstDayOnMonthByDate(localStartDate))] && !!excludedPeriods[dateToStr(getFirstDayOnMonthByDate(localStartDate))].find((period) => {
      return checkDateBetweenDates(period.startPeriod, period.endPeriod, dateStr)
    })

    salaryEveryDay[dateStr] = {

      monthlySalary: monthlySalary,
      monthlySalaryAfterIndexing: monthlySalaryAfterIndexing,

      monthlyPremium: monthlyPremium,
      monthlyPremiumAfterIndexing: monthlyPremiumAfterIndexing,
      monthlySupplementAfterIndexing: monthlySupplementAfterIndexing,

      coefficientIndexing: coefficientIndexing,

      monthlySalaryForWorkedDays: monthlySalary / workedDaysInMonths[dateToStr(getFirstDayOnMonthByDate(localStartDate))] * workedDaysInMonthsByPeriods[dateToStr(getFirstDayOnMonthByDate(localStartDate))],
      monthlySalaryForWorkedDaysAfterIndexing: monthlySalaryAfterIndexing / workedDaysInMonths[dateToStr(getFirstDayOnMonthByDate(localStartDate))] * workedDaysInMonthsByPeriods[dateToStr(getFirstDayOnMonthByDate(localStartDate))],

      salaryPerDayByWorkedDays: monthlySalary / workedDaysInMonths[dateToStr(getFirstDayOnMonthByDate(localStartDate))],
      salaryPerDayAfterIndexingByWorkedDays: monthlySalaryAfterIndexing / workedDaysInMonths[dateToStr(getFirstDayOnMonthByDate(localStartDate))],

      premiumPerDayByWorkedDays: monthlyPremium / workedDaysInMonths[dateToStr(getFirstDayOnMonthByDate(localStartDate))],
      premiumPerDayAfterIndexingByWorkedDays: monthlyPremiumAfterIndexing / workedDaysInMonths[dateToStr(getFirstDayOnMonthByDate(localStartDate))],

      supplementPerDayByWorkedDays: monthlySupplement / workedDaysInMonths[dateToStr(getFirstDayOnMonthByDate(localStartDate))],
      supplementPerDayAfterIndexingByWorkedDays: monthlySupplementAfterIndexing / workedDaysInMonths[dateToStr(getFirstDayOnMonthByDate(localStartDate))],

      countDaysInMonth: countDaysInMonth[dateToStr(getFirstDayOnMonthByDate(localStartDate))],
      countDaysInMonthByPeriod: countDaysInMonthByPeriods[dateToStr(getFirstDayOnMonthByDate(localStartDate))],

      salaryPerDay: monthlySalary / countDaysInMonth[dateToStr(getFirstDayOnMonthByDate(localStartDate))],
      salaryPerDayAfterIndexing: monthlySalaryAfterIndexing / countDaysInMonth[dateToStr(getFirstDayOnMonthByDate(localStartDate))],

      workedDaysInMonth: workedDaysInMonths[dateToStr(getFirstDayOnMonthByDate(localStartDate))],
      workedDaysInMonthByPeriod: workedDaysInMonthsByPeriods[dateToStr(getFirstDayOnMonthByDate(localStartDate))],

      isCalculate: !isNotCalculate,
      isWorkedDay: !!getCountWorkedDaysByDates(localStartDate, localStartDate, workedDaysFromBackEnd),
    }

    salaryPerMonths[dateToStr(getFirstDayOnMonthByDate(localStartDate))] = {

      monthlySalary: monthlySalary,
      monthlySalaryAfterIndexing: monthlySalaryAfterIndexing,
      monthlySalaryAfterIndexingForWorkedDays: monthlySalaryAfterIndexing / workedDaysInMonths[dateToStr(getFirstDayOnMonthByDate(localStartDate))] * workedDaysInMonthsByPeriods[dateToStr(getFirstDayOnMonthByDate(localStartDate))],
      monthlySalaryForWorkedDays: monthlySalary / workedDaysInMonths[dateToStr(getFirstDayOnMonthByDate(localStartDate))] * workedDaysInMonthsByPeriods[dateToStr(getFirstDayOnMonthByDate(localStartDate))],

      monthlyPremium: monthlyPremium,
      monthlyPremiumAfterIndexing: monthlyPremiumAfterIndexing,

      monthlySupplement: monthlySupplement,
      monthlySupplementAfterIndexing: monthlySupplementAfterIndexing,

      supplementByPeriods: supplementByPeriods[dateToStr(getFirstDayOnMonthByDate(localStartDate))] ? (supplementByPeriods[dateToStr(getFirstDayOnMonthByDate(localStartDate))] / workedDaysInMonths[dateToStr(getFirstDayOnMonthByDate(localStartDate))] * workedDaysInMonthsByPeriods[dateToStr(getFirstDayOnMonthByDate(localStartDate))]) : 0,

      coefficientIndexing: coefficientIndexing,
    }

    if (salaryEveryDay[dateStr].isCalculate && salaryEveryDay[dateStr].isWorkedDay) {
      totalSalary += (salaryEveryDay[dateStr].salaryPerDayAfterIndexingByWorkedDays || salaryEveryDay[dateStr].salaryPerDayByWorkedDays)
      totalSalary += (salaryEveryDay[dateStr].premiumPerDayAfterIndexingByWorkedDays || salaryEveryDay[dateStr].premiumPerDayByWorkedDays)
      totalSalary += (salaryEveryDay[dateStr].supplementPerDayAfterIndexingByWorkedDays || salaryEveryDay[dateStr].supplementPerDayByWorkedDays)
    }

    if (selectSalary.value === "salary" && newSalaryEl) {
      const prevSalary = newSalaryEl.closest(".calculate-salary__item").previousElementSibling?.querySelector(".salary-field__input.salary-data").value
      monthlySalary = prevSalary ? Number(prevSalary) : Number(salaryAmountInputElement.val())
    }

    localStartDate = localStartDate.removeDays(1)
  }

  calculateExample.html(`${countFullMonth} мес. x 29.3 дн.` + (textDetail.length ? (" + " + textDetail.join(" + ")) : "") + ` = ${totalCalendarDaysInBullingPeriod} дн.`)
  countMonthSpanBillingPeriod.html(countFullMonth)
  countDaysInputBillingPeriod.val(totalCalendarDaysInBullingPeriod)
  averageCountDaysSpanBillingPeriod.each(function () {
    this.innerHTML = (totalCalendarDaysInBullingPeriod / countFullMonth).toFixed(4)
  })


  totalSalary += Object.keys(salaryPerMonths).reduce((store, key) => {
    store += salaryPerMonths[key].supplementByPeriods
    return store
  }, 0)

  let totalSalaryWithPremium =
    totalSalary
    + yearPremiumWithExcludedDays
    + premiumsHalfYear
    + premiumsQuarterYear
    + monthlyOtherPremium

  const vacationPay = totalSalaryWithPremium / totalCalendarDaysInBullingPeriod * countVacationsDays

  let textTotalSalaryWithPremium = [
    rubFormatter.format(totalSalary),
  ]

  yearPremiumWithExcludedDays && textTotalSalaryWithPremium.push(rubFormatter.format(yearPremiumWithExcludedDays))
  premiumsHalfYear && textTotalSalaryWithPremium.push(rubFormatter.format(premiumsHalfYear))
  premiumsQuarterYear && textTotalSalaryWithPremium.push(rubFormatter.format(premiumsQuarterYear))
  monthlyOtherPremium && textTotalSalaryWithPremium.push(rubFormatter.format(monthlyOtherPremium))

  textTotalSalaryWithPremium = textTotalSalaryWithPremium.join(" + ")

  resultCalculate__example.html(`( ${textTotalSalaryWithPremium} ) / ${totalCalendarDaysInBullingPeriod} дн. x ${countVacationsDays} дн. = ${rubFormatter.format(vacationPay)}`)
  resultCalculate__salary.html(`${rubFormatter.format(totalSalaryWithPremium)} — заработок за расчетный период`)
  resultCalculate__day.html(`${totalCalendarDaysInBullingPeriod} дн. — количество календарных дней расчетного периода`)
  resultCalculate__averageIncome.html(`${rubFormatter.format(totalSalaryWithPremium)} / ${totalCalendarDaysInBullingPeriod} дн. — средний дневной заработок ( ${rubFormatter.format(totalSalaryWithPremium / totalCalendarDaysInBullingPeriod)} )`)
  resultCalculate__vacation.html(`${countVacationsDays} дн. — количество дней отпуска`)

  resultObject = {
    calculate: `( ${textTotalSalaryWithPremium} ) / ${totalCalendarDaysInBullingPeriod} дн. x ${countVacationsDays} дн. = ${rubFormatter.format(vacationPay)}`,
    salary: `${rubFormatter.format(totalSalaryWithPremium)} — заработок за расчетный период`,
    days: `${totalCalendarDaysInBullingPeriod} дн. — количество календарных дней расчетного периода`,
    averageIncome: `${rubFormatter.format(totalSalaryWithPremium)} / ${totalCalendarDaysInBullingPeriod} дн. — средний дневной заработок ( ${rubFormatter.format(totalSalaryWithPremium / totalCalendarDaysInBullingPeriod)} )`,
    vacation: `${countVacationsDays} дн. — количество дней отпуска`,
    countVacationsDays: countVacationsDays,
    vacationPay: rubFormatter.format(vacationPay),
    startVacation: startDateInputVacation.val(),
    perMonth: [],
  }

  Object.keys(salaryPerMonths).forEach((key) => {

    const salary = salaryPerMonths[key].monthlySalaryAfterIndexingForWorkedDays || salaryPerMonths[key].monthlySalaryForWorkedDays
    const monthlyPremium = salaryPerMonths[key].monthlyPremiumAfterIndexing || salaryPerMonths[key].monthlyPremium
    const monthlySupplement = salaryPerMonths[key].monthlySupplementAfterIndexing || salaryPerMonths[key].monthlySupplement
    const coefficientIndexing = salaryPerMonths?.[key]?.coefficientIndexing !== "-" ? Number(salaryPerMonths?.[key]?.coefficientIndexing)?.toFixed(4) : "-"
    const supplementByPeriods = salaryPerMonths[key].supplementByPeriods || 0

    let totalPremium = monthlyPremium

    premiums.map((premium) => {
      if (dateToStr(getFirstDayOnMonthByDate(parseDate(premium.date))) === key) {
        totalPremium += premium.value
      }
    })

    const dateObject = dateConvertToObject(key)
    const monthName = monthsByIndex[dateObject.month - 1]

    const tableTr = document.createElement("tr")
    tableTr.innerHTML = `
             <td><div style="display: flex;"><div>${monthName}</div> <div style="margin-left: auto; margin-right: 10px;">${dateObject.year}</div></div></td>
             <td>${rubFormatter.format(salary)}</td>
             <td>${coefficientIndexing}</td>
             <td>${rubFormatter.format(totalPremium)}</td>
             <td>${rubFormatter.format(supplementByPeriods)}</td>
             <td>${rubFormatter.format(monthlySupplement)}</td>
             <td>${rubFormatter.format(salary + totalPremium + supplementByPeriods + monthlySupplement)}</td>
             `
    tableResultBody.prepend(tableTr)

    resultObject.perMonth.push({
      monthName: monthName,
      year: dateObject.year,
      salary: rubFormatter.format(salary),
      coefficientIndexing: coefficientIndexing,
      totalPremium: rubFormatter.format(totalPremium),
      supplementByPeriods: rubFormatter.format(supplementByPeriods),
      monthlySupplement: rubFormatter.format(monthlySupplement),
      total: rubFormatter.format(salary + totalPremium + supplementByPeriods + monthlySupplement),
    })

  })

  // }
}

let resultObject = {}

const rubFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB",
  // These options are needed to round to whole numbers if that's what you want.
  //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
  //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
})

document.body.addEventListener("input", (evn) => {
  if (evn.target.classList.contains("hasDatepicker")) {
    const value = evn.target.value.replaceAll(".", "")
    if (value.length >= 8) {
      evn.target.value = `${value[0]}${value[1]}.${value[2]}${value[3]}.${value[4]}${value[5]}${value[6]}${value[7]}`
    }
  }
})

stepList.addEventListener("click", function (e) {
  if (e.target.classList.contains("support__button")) {
    let answers = this.querySelectorAll(".support__answer");
    [...answers].forEach(answer => answer.style.display = "none")

    e.target.parentElement.querySelector(".support__answer").style.display = "block"
  }
  if (e.target.classList.contains("support__answer-close")) {
    e.target.parentElement.style.display = "none"
  }
})

btnNext.addEventListener("click", function () {


  for (let i = 0; i < stepItem.length; i++) {
    stepItem[i].style.display = "none"
    navElem[i].classList.remove("navigation__elem--active")
  }

  stepCounter++

  if (stepCounter === stepItem.length - 2) {
    this.classList.remove("step-buttons__next--arrow")
    this.textContent = "Рассчитать отпускные"
  } else if (stepCounter === stepItem.length - 1) {
    // document.querySelector(".step-buttons").style.display = "none"
  }

  stepItem[stepCounter].style.display = "block"
  navElem[stepCounter].classList.add("navigation__elem--active")

  if (stepCounter > 0) {
    btnPrev.style.display = "flex"
  } else {
    btnPrev.style.display = "none"
  }

  if ([2].includes(stepCounter)) {
    if (stepCounter === 2) {
      checkForOpenNextBtn()
    }
  }

  if (stepCounter === 4) {
    calculate()
  }

})

btnPrev.addEventListener("click", function () {

  for (let i = 0; i < stepItem.length; i++) {
    stepItem[i].style.display = "none"
    navElem[i].classList.remove("navigation__elem--active")
  }

  stepCounter--
  stepItem[stepCounter].style.display = "block"
  navElem[stepCounter].classList.add("navigation__elem--active")

  if (stepCounter < 1) {
    btnPrev.style.display = "none"
  } else if (stepCounter <= 2) {
    btnNext.textContent = "Продолжить"
    btnNext.classList.add("step-buttons__next--arrow")
  }

  btnNext.removeAttribute("disabled")

})

startDateInputVacation.on("change", () => {
  setPropsOnVacationPeriod(startDateInputVacation, endDateInputVacation, countDaysInputVacation)
})

endDateInputVacation.on("change", () => {
  setPropsOnVacationPeriod(startDateInputVacation, endDateInputVacation, countDaysInputVacation)
})

countDaysInputVacation.on("input", () => {
  setPropsOnVacationPeriod(startDateInputVacation, endDateInputVacation, countDaysInputVacation, countDaysInputVacation.val())
})

$(function () {
  $(".input-data, .except-data").datepicker({
    changeMonth: true,
    changeYear: true,
    // minDate: new Date("2023-01-01"),
    // yearRange: "1900:2100",
  })
})