let selectSalary = document.querySelector(".select-salary")
let calculateSalaryContainer = document.querySelector(".calculate-salary")
let salarySwitcher = document.querySelector(".salary-switcher__checkbox")
let calculateSalaryAddExceptButton = document.querySelector(".calculate-salary__add-except")
let salaryAmountInputElement = $(".salary-field__input[type='number']")
const salaryItemsContainer = document.body.querySelector(".calculate-salary__content")

selectSalary.addEventListener("change", function () {
  let itemSalary = document.querySelector(".step__item-salary")
  let itemWage = document.querySelector(".step__item-wage")

  if (this.value === "wage") {
    itemSalary.style.display = "none"
    itemWage.style.display = "block"
  } else if (this.value === "salary") {
    itemSalary.style.display = "block"
    itemWage.style.display = "none"
  }

  checkForOpenNextBtn()
})

calculateSalaryAddExceptButton.addEventListener("click", () => {

  const salaryItemContainerEl = document.createElement("div")

  const salaryItemContainer = `
  <div class="salary-data__wrapper">
    <span class="salary-data__caption">Дата изменения</span>
    <label class="salary-data__label salary-field salary-field--data">
      <input class="salary-field__input input-data" type="text" placeholder="ДД.ММ.ГГГГ">
    </label>
  </div>

  <div class="salary-data__wrapper">
    <span class="salary-data__caption">Новый оклад</span>
    <label class="salary-data__label salary-field">
      <input class="salary-field__input salary-data" type="number" placeholder="0,00">
    </label>
  </div>

  <button class="salary-data__hide-fields"></button>

  <div class="salary-data__wrapper">
    <label class="calculate-salary__index index-switcher">
      <input class="visually-hidden index-switcher__checkbox" type="checkbox">
      <span class="index-switcher__label"></span>
      Оклад изменился в рамках повышения в целом по компании или отделу
    </label>


    <div class="index-switcher__support support">
      <button class="support__button"></button>
      <p class="support__answer support__answer--index">Правила пересчета при изменении оклада.
        При повышении зарплаты в организации в целом или в подразделении заработок до повышения расчетчик пересчитает на коэффициент индексации. Тогда работник получит отпускные исходя из своего текущего, то есть нового оклада. Если зарплата выросла только у этого работника, выплаты до повышения расчетчик пересчитывать не будет. <button class="support__answer-close"></button></p>
    </div>
  </div>
  `

  salaryItemContainerEl.classList.add("calculate-salary__item")
  salaryItemContainerEl.innerHTML = salaryItemContainer

  salaryItemsContainer.append(salaryItemContainerEl)

  $(".calculate-salary__item .input-data").datepicker("destroy")
  $(".calculate-salary__item .input-data").datepicker({
    changeMonth: true,
    changeYear: true,
    minDate: parseDate(startDateInputBillingPeriod.val()),
    maxDate: parseDate(endDateInputVacation.val()),
    onSelect: function (dateText) {
      checkForOpenNextBtn()
    },
  })
})

calculateSalaryContainer.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("salary-data__hide-fields")) {
    let exceptWrapper = evt.target.closest(".calculate-salary__item")
    exceptWrapper.remove()
    checkForOpenNextBtn()
  }
})


salarySwitcher.addEventListener("change", function () {
  let salaryContent = document.querySelector(".calculate-salary")

  if (this.checked) {
    salaryContent.style.display = "block"
    salaryContent.classList.add('has-change-salary')
  } else {
    salaryContent.style.display = "none"
    salaryContent.classList.remove('has-change-salary')
  }

})

document.body.addEventListener("input", (evn) => {
  if (evn.target.closest(".step__item-salary, .step__item-wage")) {
    checkForOpenNextBtn()
  }
})

document.body.addEventListener("click", (evn) => {
  if (evn.target.closest(".step__item-salary, .step__item-wage")) {
    checkForOpenNextBtn()
  }
})

document.body.addEventListener("change", (evn) => {
  if (evn.target.closest(".step__item-salary, .step__item-wage")) {
    checkForOpenNextBtn()
  }
})

function checkForOpenNextBtn() {
  btnNext.setAttribute("disabled", "true")

  let isValid = true

  if (selectSalary.value === "wage") {

    if (!wageSwitcher.checked) {
      document.body.querySelectorAll(".calculate-wage__table input:not([type='checkbox'])").forEach((input) => {
        if (!input.value && input.dataset.notUse !== 'true') {
          isValid = false
        }
      })
    } else if (wageSwitcher.checked) {
      document.body.querySelectorAll(".calculate-wage input:not([type='checkbox'])").forEach((input) => {
        if (!input.value) {
          isValid = false
        } else {
          const dateInput = input.closest('.wage-data__change')?.querySelector('.wage-field__input.input-data')
          const salaryInput = input.closest('.wage-data__change')?.querySelector('.wage-field__input.salary-data')
          if (dateInput && salaryInput) {
            salaryInput.dataset.date = dateInput.value
          }
        }
      })
      if (!checkCrossDate(wageData, ".wage-data__change .input-data")) {
        isValid = false
      }
    }

  } else if (selectSalary.value === "salary") {

    if (!salaryAmountInputElement.val() && !salarySwitcher.checked) {
      isValid = false
    } else {
      if (salarySwitcher.checked) {
        document.body.querySelectorAll(".step__item-salary input:not([type='checkbox'])").forEach((input) => {
          if (!input.value) {
            isValid = false
          } else {
            const dateInput = input.closest('.calculate-salary__item')?.querySelector('.salary-field__input.input-data')
            const salaryInput = input.closest('.calculate-salary__item')?.querySelector('.salary-field__input.salary-data')
            if (dateInput && salaryInput) {
              salaryInput.dataset.date = dateInput.value
            }
          }
        })
        if (!checkCrossDate(salaryItemsContainer, ".calculate-salary__item .input-data")) {
          isValid = false
        }
      }
    }
  }

  if (!isValid) {
    return
  }

  btnNext.removeAttribute("disabled")
}

function checkCrossDate(container, queryDateInput) {
  let isValid = true
  container.querySelectorAll(queryDateInput).forEach((date, key) => {
    let isValidLocal = true
    container.querySelectorAll(queryDateInput).forEach((checkDate, key2) => {
      if (date.value && date.value.length === 10 && checkDate.value && checkDate.value.length === 10) {
        if ((key !== key2 && checkDateBetweenDates(date.value, date.value, checkDate.value))) {
          isValidLocal = false
          isValid = false
        }

      } else {
        isValid = false
      }
    })
    if (!isValidLocal) {
      date.classList.add("not-valid")
    } else {
      date.classList.remove("not-valid")
    }
  })

  return isValid
}

const wasIndexing = () => {
  return (selectSalary.value === "salary" && salarySwitcher.checked) || (selectSalary.value === "wage" && wageSwitcher.checked)
}