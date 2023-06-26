let selectSalary = document.querySelector(".select-salary")
let calculateSalaryContainer = document.querySelector(".calculate-salary")
let salarySwitcher = document.querySelector(".salary-switcher__checkbox")
let calculateSalaryAddExceptButton = document.querySelector(".calculate-salary__add-except")
let salaryAmountInputElement = document.querySelector("body > section > ul.calculate__step-list.step > li:nth-child(3) > div.step__item-salary > div.step__data.salary-data > div > label > input")

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
      <input class="salary-field__input" type="text" placeholder="0,00">
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

  const salaryItemsContainer = document.body.querySelector(".calculate-salary__content")
  salaryItemsContainer.append(salaryItemContainerEl)

  $(".calculate-salary__item .input-data").datepicker("destroy")
  $(".calculate-salary__item .input-data").datepicker({
    changeMonth: true,
    changeYear: true,
    minDate: parseDate(startDateInputBillingPeriod.val()),
    maxDate: parseDate(endDateInputBillingPeriod.val()),
    onSelect: function(dateText) {
      checkCrossDate(salaryItemsContainer, ".calculate-salary__item .input-data")
    },
  })
})

calculateSalaryContainer.addEventListener("click", (evt) => {
  if (evt.target.classList.contains("salary-data__hide-fields")) {
    let exceptWrapper = evt.target.closest(".calculate-salary__item")
    exceptWrapper.remove()
  }
})


salarySwitcher.addEventListener("change", function () {
  let salaryContent = document.querySelector(".calculate-salary")

  if (this.checked) {
    salaryContent.style.display = "block"
  } else {
    salaryContent.style.display = "none"
  }

  checkForOpenNextBtn()
})

salaryAmountInputElement.addEventListener("input", function () {
  checkForOpenNextBtn()
})

function checkForOpenNextBtn() {
  btnNext.setAttribute("disabled", "true")

  if (selectSalary.value === "wage") {

  } else if (selectSalary.value === "salary") {
    if (salaryAmountInputElement.value) {
      if (!salarySwitcher.checked) {
        btnNext.removeAttribute("disabled")
      }
    }
  }
}

function checkCrossDate(container, queryDateInput) {
  container.querySelectorAll(queryDateInput).forEach((date, key) => {
    let isValid = true
    container.querySelectorAll(queryDateInput).forEach((checkDate, key2) => {
      if (date.value && checkDate.value) {
        if (key !== key2 && checkDateBetweenDates(date.value, date.value, checkDate.value)) {
          isValid = false
        }
      }
    })
    if (!isValid) {
      date.classList.add("not-valid")
    } else {
      date.classList.remove("not-valid")
    }
  })
}