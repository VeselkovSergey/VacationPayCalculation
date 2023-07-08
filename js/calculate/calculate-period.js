let periodSwitcher = document.querySelector(".period-switcher")
let exceptDates = document.querySelector(".except-dates")
let btnExcept = document.querySelector(".calculate-period__add-except")

let exceptDatesStartCounter = 1
let exceptDatesEndCounter = 1


periodSwitcher.addEventListener("change", function () {
  let calculatePeriodContent = document.querySelector(".calculate-period")

  if (this.checked) {
    calculatePeriodContent.style.display = "block"
    calculatePeriodContent.classList.add("has-expected-dates")
  } else {
    calculatePeriodContent.style.display = "none"
    btnNext.removeAttribute("disabled")
    calculatePeriodContent.classList.remove("has-expected-dates")
  }

  checkAndSetCountValidDays()
})

btnExcept.addEventListener("click", function () {
  exceptDatesStartCounter++
  exceptDatesEndCounter++

  let exceptDates = this.closest(".calculate-period").querySelector(".except-dates")
  let exceptDatesWrapper = document.createElement("div")
  let exceptField =
    `<label class="except-dates__field">
      Начало периода
      <input class="vacation__input except-data" type="text" placeholder="ДД/ММ/ГГГГ" data-except-start='${"val_" + exceptDatesStartCounter}'>
    </label>
    <label class="except-dates__field">
      Конец периода
      <input class="vacation__input except-data" type="text" placeholder="ДД/ММ/ГГГГ" data-except-end='${"val_" + exceptDatesEndCounter}'>
    </label>
    <button class="except-dates__hide-fields"></button>
  `

  exceptDatesWrapper.classList.add("except-dates__wrapper")
  exceptDatesWrapper.innerHTML = exceptField
  exceptDates.append(exceptDatesWrapper)

  $(function () {
    $(".except-data").datepicker({
      changeMonth: true,
      changeYear: true,
      minDate: parseDate(startDateInputBillingPeriod.val()),
      maxDate: parseDate(endDateInputBillingPeriod.val()),
      onSelect: function (dateText) {
        checkAndSetCountValidDays()
      },
    })
  })

  checkAndSetCountValidDays()

})

exceptDates.addEventListener("click", function (evt) {
  if (evt.target.classList.contains("except-dates__hide-fields")) {
    let exceptWrapper = evt.target.closest(".except-dates__wrapper")

    exceptWrapper.remove()
    exceptDatesStartCounter--
    exceptDatesEndCounter--

    checkAndSetCountValidDays()
  }
})

function checkAndSetCountValidDays() {

  btnNext.setAttribute("disabled", "true")

  let isValid = true

  let expectDays = 0
  let workedDays = 0
  let countMonthInExpectDays = 0

  let workedDaysInFullPeriod = 0
  let countMonthInFullPeriod = 0

  if (startDateInputBillingPeriod.val() && endDateInputBillingPeriod.val()) {
    const countDays = datediff(parseDate(startDateInputBillingPeriod.val()), parseDate(endDateInputBillingPeriod.val()))
    if (countDays <= 0) {
      startDateInputBillingPeriod.addClass("not-valid")
      endDateInputBillingPeriod.addClass("not-valid")
      isValid = false
    } else {
      startDateInputBillingPeriod.removeClass("not-valid")
      endDateInputBillingPeriod.removeClass("not-valid")
      isValid = true

      const {
        validDays,
        countMonth: count,
      } = getValidDaysInPeriod(startDateInputBillingPeriod.val(), endDateInputBillingPeriod.val())
      workedDaysInFullPeriod = validDays
      countMonthInFullPeriod = count
    }
  } else {
    isValid = false
  }

  if (periodSwitcher.checked) {
    $(".except-data[data-except-start]").each(function () {

      const startDateEl = this
      const endDateEl = this.closest(".except-dates__wrapper").querySelector(".except-data[data-except-end]")

      const startDate = startDateEl.value
      const endDate = endDateEl.value

      if (!startDate || !endDate) {
        isValid = false
      }

      const countDays = datediff(parseDate(startDate), parseDate(endDate))
      if (countDays <= 0) {
        startDateEl.classList.add("not-valid")
        endDateEl.classList.add("not-valid")
        isValid = false
        return
      } else {
        startDateEl.classList.remove("not-valid")
        endDateEl.classList.remove("not-valid")
      }

      let query = []

      // проверяем только вышестоящие периоды
      for (let i = 1; i < Number(this.dataset.exceptStart.match(/\d+/)[0]); i++) {
        query.push(`.except-data[data-except-start="val_${i}"]`)
      }

      $(query.join(", ")).each(function () {

        let startDateForCheck = this.value
        let endDateElForCheck = this.closest(".except-dates__wrapper").querySelector(".except-data[data-except-end]").value // получаем дату конца в первом исключении дат


        if (startDate && endDate && startDateForCheck && endDateElForCheck) {

          const startDateIsNotValid = checkDateBetweenDates(startDateForCheck, endDateElForCheck, startDate)
          const endDateIsNotValid = checkDateBetweenDates(startDateForCheck, endDateElForCheck, endDate)

          if (startDateIsNotValid) {
            isValid = false
            startDateEl.classList.add("not-valid")
          } else {
            startDateEl.classList.remove("not-valid")
          }

          if (endDateIsNotValid) {
            isValid = false
            endDateEl.classList.add("not-valid")
          } else {
            endDateEl.classList.remove("not-valid")
          }
        }

      })

      if (startDate && endDate) {
        const {validDays, countMonth, notValidDays} = getValidDaysInPeriod(startDate, endDate)
        expectDays += validDays
        workedDays += notValidDays
        countMonthInExpectDays += countMonth
      }

    })
  }

  if (!isValid) {
    return null
  }

  // const totalDays = workedDaysInFullPeriod - (29.3 * countMonthInExpectDays)
  const totalMonths = countMonthInFullPeriod - countMonthInExpectDays
  // const res = setCountDaysInputBillingPeriod(totalDays, totalMonths, workedDays)
  setWagePeriods(startDateInputBillingPeriod.val(), totalMonths)

  calculate()

  btnNext.removeAttribute("disabled")

  return {countMonthInFullPeriod}

}

function getValidDaysInPeriod(startDate, endDate) {

  const yearStartLocal = parseDate(startDate).getFullYear()
  const yearEndLocal = parseDate(endDate).getFullYear()
  const diffYear = yearEndLocal - yearStartLocal // 0 и больше

  const countDays = datediff(parseDate(startDate), parseDate(endDate))

  const countMonth = parseDate(endDate).getMonth() + (12 * diffYear) - parseDate(startDate).getMonth() + 1

  let daysInMonth = 0

  for (let j = 1; j <= countMonth; j++) {

    const yearLocal = yearStartLocal
    let monthLocal = parseDate(startDate).getMonth() + j

    let coef = 0

    if (monthLocal > 12) {
      monthLocal -= 12
      coef += 1
    }

    const calcDate = new Date(yearLocal + coef, monthLocal, 0, 0, 0, 0)

    const days = getCountDaysInMonthByDate(calcDate)
    daysInMonth += days
  }

  const validDays = parseFloat((29.3 * countMonth / daysInMonth * countDays).toFixed(4))
  const notValidDays = parseFloat((29.3 * countMonth - validDays).toFixed(4))

  return {
    validDays,
    countMonth,
    notValidDays,
  }
}

async function getWorkedDaysByDates(startDate, endDate) {

  const startDateDay = startDate.getDate() < 10 ? "0" + startDate.getDate() : startDate.getDate()
  const endDateDay = endDate.getDate() < 10 ? "0" + endDate.getDate() : endDate.getDate()

  const startGetMonth = startDate.getMonth() + 1
  const endGetMonth = endDate.getMonth() + 1
  const startDateMonth = startGetMonth < 10 ? (startGetMonth === 0 ? 12 : "0" + startGetMonth) : startGetMonth
  const endDateMonth = endGetMonth < 10 ? (endGetMonth === 0 ? 12 : "0" + endGetMonth) : endGetMonth

  const startDateForAPI = `${startDate.getFullYear()}${startDateMonth}${startDateDay}`
  const endDateForAPI = `${endDate.getFullYear()}${endDateMonth}${endDateDay}`

  return new Promise(async function (resolve, reject) {
    const response = await fetch(`./getWorkedDaysByDates.php?date1=${startDateForAPI}&date2=${endDateForAPI}`)
    resolve(await response.json())
  })
}

function getCountWorkedDaysByDates(startDate, endDate, workedDays) {
  const countDays = datediff(startDate, endDate)

  let localStartDate = new Date(startDate)

  let countWorkedDays = 0

  for (let i = 1; i <= countDays; i++) {

    countWorkedDays += workedDays[dateToStr(localStartDate)] ? 1 : 0

    localStartDate = localStartDate.addDays(1)
  }

  return countWorkedDays
}

async function checkOnWorkedDay(startDate) {

  const startDateDay = startDate.getDate() < 10 ? "0" + startDate.getDate() : startDate.getDate()

  const startGetMonth = startDate.getMonth() + 1
  const startDateMonth = startGetMonth < 10 ? (startGetMonth === 0 ? 12 : "0" + startGetMonth) : startGetMonth

  const startDateForAPI = `${startDate.getFullYear()}${startDateMonth}${startDateDay}`

  return new Promise(async function (resolve, reject) {
    const response = await fetch(`./checkOnWorkedDay.php?date=${startDateForAPI}`)
    resolve(Number(await response.text()))
  })
}
