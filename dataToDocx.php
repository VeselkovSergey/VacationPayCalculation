<?php

$data = json_decode($_POST['data']);
print_r($data, $data->calculate);
$calculate = $data->calculate;
$vacationPay = $data->vacationPay;
$countVacationsDays = $data->countVacationsDays;
$startVacation = $data->startVacation;
$salary = $data->salary;
$days = $data->days;
$averageIncome = $data->averageIncome;
$vacation = $data->vacation;
$perMonth = $data->perMonth;

$text = "
<h3><b>Расчет отпускных</b></h3>
<div>Начало отпуска: $startVacation     Продолжительность: $countVacationsDays</div>
<h2><b>Сумма отпускных</b></h2>
<div>Работнику нужно начислить: $vacationPay</div>
<h2><b>Расчёт:</b></h2>
<div>$calculate</div>
<div>$salary</div>
<div>$days</div>
<div>$averageIncome</div>
<div>$vacation</div>
";

$text .= "
<table>
    <thead>
        <tr>
            <th>Месяц</th>
            <th>Зарплата</th>
            <th>Коэффициент индексации</th>
            <th>Премии</th>
            <th>Надбавки</th>
            <th>Прочие выплаты</th>
            <th>ИТОГО</th>
        </tr>
    </thead>
    <tbody>
";

foreach ($perMonth as $month) {
    $text .= "
<tr>
<td>$month->monthName $month->year</td>
<td>$month->salary</td>
<td>$month->coefficientIndexing</td>
<td>$month->totalPremium</td>
<td>$month->supplementByPeriods</td>
<td>$month->monthlySupplement</td>
<td>$month->total</td>
</tr>
";
}

$text .= "
    </tbody>
</table>";

$fileName = "Отпускные_".time().".docx";

require "vendor/autoload.php";
$pw = new \PhpOffice\PhpWord\PhpWord();
$section = $pw->addSection();
\PhpOffice\PhpWord\Shared\Html::addHtml($section, $text, false, false);
$pw->save($fileName, "Word2007");

echo $fileName;