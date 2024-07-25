<?php

$curl = curl_init();

curl_setopt_array($curl, array(
    'CURLOPT_URL' => 'https://tarian-test.com/api/v1/session_connect/',
    'CURLOPT_RETURNTRANSFER' => true,
    'CURLOPT_ENCODING' => '',
    'CURLOPT_MAXREDIRS' => 10,
    'CURLOPT_TIMEOUT' => 0,
    'CURLOPT_FOLLOWLOCATION' => true,
    'CURLOPT_HTTP_VERSION' => CURL_HTTP_VERSION_1_1,
    'CURLOPT_CUSTOMREQUEST' => 'POST',
    'CURLOPT_POSTFIELDS' => json_encode(["username" => "Prescriptions", "password": "Password1"]),
    'CURLOPT_HTTPHEADER' => array(
        'Content-Type: application/json'
    ),
));

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
    echo "cURL Error #:" . $err;
} else {
    echo "<textarea>" . $response . "</textarea>";
}

?>
