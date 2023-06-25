const calculatePremium = document.querySelector('.calculate-premium');
const calculateSupplement = document.querySelector('.calculate-supplement');
const btnsBonus = document.querySelectorAll('.bonus-type__btn');
const bonusType = document.querySelector('.bonus-type');
const SELECT_PREMIUM = document.querySelector('.select-premium');
const SELECT_SUPPLEMENT = document.querySelector('.select-supplement');

btnsBonus.forEach(btn => {
  btn.addEventListener('click', function() {
    SELECT_PREMIUM.style.display = 'none'
    SELECT_SUPPLEMENT.style.display = 'none'
    if(this.classList.contains('bonus-type-premium')) {
      SELECT_PREMIUM.style.display = 'block'
    }else if(this.classList.contains('bonus-type-supplement')) {
      SELECT_SUPPLEMENT.style.display = 'block'
    }
  })
})

SELECT_PREMIUM.addEventListener('change', function() {
  this.style.display = 'none'

  
  if(this.value === 'last-year') {

    const premiumTemplateLastYear = document.querySelector('#premium-template__last-yaer');
    let lastYearContent = premiumTemplateLastYear.content.cloneNode(true);

    calculatePremium.append(lastYearContent);

  } else if(this.value === 'half-year') {

    const premiumTemplateHalfYear = document.querySelector('#premium-template__half-yaer');
    let halfYearContent = premiumTemplateHalfYear.content.cloneNode(true);
    
    calculatePremium.append(halfYearContent);

  } else if(this.value === 'montly') {

    const premiumTemplateMontly = document.querySelector('#premium-template__montly');
    let montlyContent = premiumTemplateMontly.content.cloneNode(true);

    calculatePremium.append(montlyContent);
  } else if(this.value === 'other-production') {
    
    const premiumTemplateOther = document.querySelector('#premium-template__other-production');
    let otherProductionContent = premiumTemplateOther.content.cloneNode(true);

    calculatePremium.append(otherProductionContent);
  }

  this.value = 'default'

  $(function () {
    $(".input-data").datepicker({
      changeMonth: true,
      changeYear: true,
      minDate: new Date("2023-01-01"),
      yearRange: "2023:2024"
    })
  });
})

SELECT_SUPPLEMENT.addEventListener('change', function() {
  this.style.display = 'none'
  bonusType.style.display = 'flex'
  
  if(this.value === 'supplement') {

    const supplementTemplateSupplement = document.querySelector('#supplement-template__supplement');
    let supplementContent = supplementTemplateSupplement.content.cloneNode(true);

    calculateSupplement.append(supplementContent);
  }else if(this.value === 'other-payments') {

    const supplementTemplatePayments = document.querySelector('#supplement-template__other-payments');
    let paymentsContent = supplementTemplatePayments.content.cloneNode(true);
    
    calculateSupplement.append(paymentsContent);
  }

  this.value = 'default'

  $(function () {
    $(".input-data").datepicker({
      changeMonth: true,
      changeYear: true,
      minDate: new Date("2023-01-01"),
      yearRange: "2023:2024"
    })
  });
})

document.body.querySelector('.calculate__bonus-premium').addEventListener("click", (evt) => {
  if (evt.target.classList.contains("premium-data__hide-fields")) {
    let exceptWrapper = evt.target.closest(".calculate-premium__content")

    exceptWrapper.remove()
  }
})

document.body.querySelector('.calculate__bonus-supplement').addEventListener("click", (evt) => {
  if (evt.target.classList.contains("premium-data__hide-fields")) {
    let exceptWrapper = evt.target.closest(".calculate-supplement__content")

    exceptWrapper.remove()
  }
})
