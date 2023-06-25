let periodSwitcher = document.querySelector(".period-switcher")
let exceptDates = document.querySelector(".except-dates")
let btnExcept = document.querySelector(".calculate-period__add-except")

let exceptDatesStartCounter = 1
let exceptDatesEndCounter = 1


periodSwitcher.addEventListener("change", function () {
  let calculatePeriodContent = document.querySelector(".calculate-period")

  if (this.checked) {
    calculatePeriodContent.style.display = "block"
    getCountValidDays()
  } else {
    calculatePeriodContent.style.display = "none"
    btnNext.removeAttribute("disabled")
  }
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
        getCountValidDays()
      },
    })
  })

  getCountValidDays()

})

exceptDates.addEventListener("click", function (evt) {
  if (evt.target.classList.contains("except-dates__hide-fields")) {
    let exceptWrapper = evt.target.closest(".except-dates__wrapper")

    exceptWrapper.remove()
    exceptDatesStartCounter--
    exceptDatesEndCounter--

    getCountValidDays()
  }
})

function getCountValidDays() {

  btnNext.setAttribute('disabled', "true")

  let isValid = true

  let workedDays = 0
  let countMonth = 0

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
      let endDateElForCheck = this.closest(".except-dates__wrapper").querySelector(".except-data[data-except-end]").value


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
      const {validDays, countMonth: count} = getValidDaysInPeriod(startDate, endDate)
      workedDays += validDays
      countMonth += count
    }

  })

  const total = Number(((12 - countMonth) * 29.3 + Number(workedDays)).toFixed(4))

  if (!isValid) {
    return null
  }

  btnNext.removeAttribute("disabled")

  return total


}

function getValidDaysInPeriod(startDate, endDate) {
  const countDays = datediff(parseDate(startDate), parseDate(endDate))

  let daysInMonth = getCountDaysInMonthByDate(parseDate(startDate))

  const countMonth = parseDate(endDate).getMonth() - parseDate(startDate).getMonth() + 1

  if (parseDate(startDate).getMonth() !== parseDate(endDate).getMonth()) {
    daysInMonth = 0
    for (let i = 1; i <= countMonth; i++) {
      const days = getCountDaysInMonthByDate(new Date(parseDate(startDate).getFullYear(), parseDate(startDate).getMonth() + i, 0, 0, 0, 0))
      daysInMonth += days
    }
  }

  const validDays = Number((29.3 * countMonth / daysInMonth * (daysInMonth - countDays)).toFixed(4))
  // const total = ((12 - countMonth) * 29.3 + Number(validDays)).toFixed(4)
  return {
    validDays,
    countMonth,
  }
}



