let wageSwitcher = document.querySelector('.wage-switcher__checkbox');
let wageData = document.querySelector('.wage-data');
let btnAddChange = document.querySelector('.wage-data__add-change');
let ChangeDatesStartCounter = 1;

wageSwitcher.addEventListener('change', function() {
  let wageContent = document.querySelector('.calculate-wage__content');
  
  if(this.checked) {
    wageContent.style.display = 'flex'
  } else {
    wageContent.style.display = 'none'
  }
})

// 
btnAddChange.addEventListener('click', function () {
  ChangeDatesStartCounter++;

  let wageData = this.closest('.wage-data');
  let wageDataWrapper = document.createElement('div')
  let wageField = 
  `<div class="wage-data__wrapper">
      <span class="wage-data__caption">Дата изменения</span>
      <label class="wage-data__label wage-field wage-field--data">
        <input class="wage-field__input wage-date" type="text" placeholder="ДД.ММ.ГГГГ" data-wage-start="${'val_' + ChangeDatesStartCounter}">
      </label>
    </div>

    <div class="wage-data__wrapper">
      <span class="wage-data__caption">Новый оклад</span>
      <label class="wage-data__label wage-field">
        <input class="wage-field__input" type="text" placeholder="0,00">
      </label>
    </div>
    <button class="wage-data__hide-fields"></button>`

  wageDataWrapper.classList.add('wage-data__change');
  wageDataWrapper.innerHTML = wageField
  wageData.append(wageDataWrapper)

  $(function () {
    $(".wage-date").datepicker({
      changeMonth: true,
      changeYear: true,
      minDate: new Date("2022-01-01"),
      yearRange: "2022:2023"
    })
  });
  
})

wageData.addEventListener('click', function (evt) {
  if(evt.target.classList.contains('wage-data__hide-fields')) {
    let wageWrapper = evt.target.closest('.wage-data__change');

    wageWrapper.remove();
    ChangeDatesStartCounter--;
  }
})