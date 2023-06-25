<?php

echo '<pre>';
echo 'git pull start' . PHP_EOL;
echo shell_exec('git pull');
echo 'git pull complete' . PHP_EOL;
echo '</pre>';