const calculatePremium = document.querySelector(".calculate-premium")
const calculateSupplement = document.querySelector(".calculate-supplement")
const btnsBonus = document.querySelectorAll(".bonus-type__btn")
const bonusType = document.querySelector(".bonus-type")
const SELECT_PREMIUM = document.querySelector(".select-premium")
const SELECT_SUPPLEMENT = document.querySelector(".select-supplement")

btnsBonus.forEach(btn => {
  btn.addEventListener("click", function () {
    SELECT_PREMIUM.style.display = "none"
    SELECT_SUPPLEMENT.style.display = "none"
    if (this.classList.contains("bonus-type-premium")) {
      SELECT_PREMIUM.style.display = "block"
    } else if (this.classList.contains("bonus-type-supplement")) {
      SELECT_SUPPLEMENT.style.display = "block"
    }
  })
})

SELECT_PREMIUM.addEventListener("change", function () {
  this.style.display = "none"


  if (this.value === "last-year") {

    const premiumTemplateLastYear = document.querySelector("#premium-template__last-year")
    let lastYearContent = premiumTemplateLastYear.content.cloneNode(true)

    calculatePremium.append(lastYearContent)

    document.body.querySelector("select.select-premium option[value=\"last-year\"]").setAttribute("disabled", "true")

  } else if (this.value === "half-year") {

    const premiumTemplateHalfYear = document.querySelector("#premium-template__half-year")
    let halfYearContent = premiumTemplateHalfYear.content.cloneNode(true)

    calculatePremium.append(halfYearContent)

    if (calculatePremium.querySelectorAll(".premium__half-year").length === 2) {
      document.body.querySelector("select.select-premium option[value=\"half-year\"]").setAttribute("disabled", "true")
    }

  } else if (this.value === "quarter-year") {

    const premiumTemplateQuarterYear = document.querySelector("#premium-template__quarter-year")
    let halfYearContent = premiumTemplateQuarterYear.content.cloneNode(true)

    calculatePremium.append(halfYearContent)

    if (calculatePremium.querySelectorAll(".premium__quarter-year").length === 4) {
      document.body.querySelector("select.select-premium option[value=\"quarter-year\"]").setAttribute("disabled", "true")
    }

  } else if (this.value === "monthly") {

    const premiumTemplateMonthly = document.querySelector("#premium-template__monthly")
    let monthlyContent = premiumTemplateMonthly.content.cloneNode(true)

    calculatePremium.append(monthlyContent)

    if (calculatePremium.querySelectorAll(".premium__monthly").length === 12) {
      document.body.querySelector("select.select-premium option[value=\"monthly\"]").setAttribute("disabled", "true")
    }

  } else if (this.value === "other-production") {

    const premiumTemplateOther = document.querySelector("#premium-template__other-production")
    let otherProductionContent = premiumTemplateOther.content.cloneNode(true)

    calculatePremium.append(otherProductionContent)
  }

  this.value = "default"

  $(function () {
    $(".calculate__bonus-premium .input-data.month-accrual").datepicker({
      changeMonth: true,
      changeYear: true,
      minDate: parseDate(startDateInputBillingPeriod.val()),
      maxDate: parseDate(endDateInputBillingPeriod.val()),
      onSelect: function (dateText) {
        checkPremiumInputs()
      },
    })
  })

  $(function () {
    $(".calculate__bonus-premium .input-data:not(.month-accrual)").datepicker({
      changeMonth: true,
      changeYear: true,
      minDate: parseDate(`01.01.${startDateInputBillingPeriod.val().split(".")[2]}`),
      maxDate: parseDate(endDateInputBillingPeriod.val()),
      onSelect: function (dateText) {
        checkPremiumInputs()
      },
    })
  })
})

SELECT_SUPPLEMENT.addEventListener("change", function () {
  this.style.display = "none"
  bonusType.style.display = "flex"

  if (this.value === "supplement") {

    const supplementTemplateSupplement = document.querySelector("#supplement-template__supplement")
    let supplementContent = supplementTemplateSupplement.content.cloneNode(true)

    calculateSupplement.append(supplementContent)
  } else if (this.value === "other-payments") {

    const supplementTemplatePayments = document.querySelector("#supplement-template__other-payments")
    let paymentsContent = supplementTemplatePayments.content.cloneNode(true)

    calculateSupplement.append(paymentsContent)
  }

  this.value = "default"

  $(function () {
    $(".calculate__bonus-supplement .input-data").datepicker({
      changeMonth: true,
      changeYear: true,
      minDate: parseDate(`01.01.${startDateInputBillingPeriod.val().split(".")[2]}`),
      maxDate: parseDate(endDateInputBillingPeriod.val()),
      onSelect: function (dateText) {
        checkPremiumInputs()
      },
    })
  })
})

document.body.querySelector(".calculate__bonus-premium").addEventListener("click", (evt) => {
  if (evt.target.classList.contains("premium-data__hide-fields")) {
    let exceptWrapper = evt.target.closest(".calculate-premium__content")

    exceptWrapper.remove()

    if (evt.target.closest(".premium__last-year")) {
      document.body.querySelector("select.select-premium option[value=\"last-year\"]").removeAttribute("disabled")
    }

    if (evt.target.closest(".premium__half-year")) {
      document.body.querySelector("select.select-premium option[value=\"half-year\"]").removeAttribute("disabled")
    }

    if (evt.target.closest(".premium__quarter-year")) {
      document.body.querySelector("select.select-premium option[value=\"quarter-year\"]").removeAttribute("disabled")
    }

    if (evt.target.closest(".premium__monthly")) {
      document.body.querySelector("select.select-premium option[value=\"monthly\"]").removeAttribute("disabled")
    }

  }
})

document.body.querySelector(".calculate__bonus-supplement").addEventListener("click", (evt) => {
  if (evt.target.classList.contains("premium-data__hide-fields")) {
    let exceptWrapper = evt.target.closest(".calculate-supplement__content")

    exceptWrapper.remove()
  }
})

document.body.addEventListener("click", checkPremiumInputs)

document.body.addEventListener("input", checkPremiumInputs)

document.body.addEventListener("change", checkPremiumInputs)

function checkPremiumInputs() {
  if (stepCounter !== 3) {
    return
  }

  // если не было индексации, то нужно выключить галочки
  if (!wasIndexing()) {
    document.body.querySelector('.calculate__bonus-premium').classList.add('without-indexing')
    document.body.querySelector('.calculate__bonus-supplement').classList.add('without-indexing')
  }

  let premiumIsValid = checkCrossDate(calculatePremium, ".premium__last-year .input-data")
    && checkCrossDate(calculatePremium, ".premium__half-year > .premium-data__wrapper .input-data")
    && checkCrossDate(calculatePremium, ".premium__quarter-year > .premium-data__wrapper .input-data")
    && checkCrossDate(calculatePremium, ".premium__monthly .input-data")
    && checkCrossDate(calculatePremium, ".premium__other-production .input-data")

  let supplementIsValid = checkCrossDate(calculateSupplement, ".supplement__supplement .input-data")
    && checkCrossDate(calculateSupplement, ".supplement__other-payments .input-data")

  document.body.querySelectorAll(".calculate__bonus-premium input:not([type='checkbox'])").forEach((input) => {
    if (!input.value) {
      premiumIsValid = false
    } else {
      if (input.classList.contains('input-data')) {
        input.dataset.date = input.value
        input.dataset.firstDateMonth = dateToStr(getFirstDayOnMonthByDate(parseDate(input.value)))
      }
    }
  })

  document.body.querySelectorAll(".calculate__bonus-supplement input:not([type='checkbox'])").forEach((input) => {
    if (!input.value) {
      supplementIsValid = false
    } else {
      if (input.classList.contains('input-data')) {
        input.dataset.date = input.value
        input.dataset.firstDateMonth = dateToStr(getFirstDayOnMonthByDate(parseDate(input.value)))
      }
    }
  })

  if (premiumIsValid && supplementIsValid) {
    btnNext.removeAttribute("disabled")
  } else {
    btnNext.setAttribute("disabled", "true")
  }
}
