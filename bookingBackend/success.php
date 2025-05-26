<?php

// Load environment variables
require '../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$clientId = 'Aaur_-imPxAmNApzZlpXH8pLXp1iN5mrtPmWZ2-PVXsJg-PWN7BzQ4jHiFpUpztEeVeasMBs1imtkRb4';
$clientSecret = 'EEpZI-NkO6rJHQJz8rVmPwcjlalHS_aL-qOdJ7q49BRy7Y2Y-w7NwIyNWg1cEJZsvlrLVzvHA48uuyZP';

if (!isset($_GET['token'])) {
    die('Payment token is missing.');
}

$token = $_GET['token'];

// Capture the order
$cUrlHandel = curl_init();
curl_setopt($cUrlHandel, CURLOPT_URL, "https://api-m.sandbox.paypal.com/v2/checkout/orders/" . $token . "/capture");
curl_setopt($cUrlHandel, CURLOPT_HTTPHEADER, [
    "Content-Type: application/json",
    "Authorization: Bearer " . getAccessToken($clientId, $clientSecret)
]);
curl_setopt($cUrlHandel, CURLOPT_POST, true);
curl_setopt($cUrlHandel, CURLOPT_RETURNTRANSFER, true);

$response = curl_exec($cUrlHandel);
curl_close($cUrlHandel);

$order = json_decode($response);

if (isset($order->status) && $order->status === 'COMPLETED') {
    echo "<h1>Payment Successful</h1>";
    echo "<p>Thank you for your payment. Your transaction ID is: " . $order->id . "</p>";
} else {
    echo "<h1>Payment Failed</h1>";
    echo "<p>There was an issue with your payment. Please try again.</p>";
}

function getAccessToken($clientId, $clientSecret) {
    $cUrlHandel = curl_init();
    curl_setopt($cUrlHandel, CURLOPT_URL, "https://api-m.sandbox.paypal.com/v1/oauth2/token");
    curl_setopt($cUrlHandel, CURLOPT_HTTPHEADER, [
        "Accept: application/json",
        "Accept-Language: en_US"
    ]);
    curl_setopt($cUrlHandel, CURLOPT_USERPWD, $clientId . ":" . $clientSecret);
    curl_setopt($cUrlHandel, CURLOPT_POSTFIELDS, "grant_type=client_credentials");
    curl_setopt($cUrlHandel, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($cUrlHandel);
    curl_close($cUrlHandel);

    return json_decode($response)->access_token;
}