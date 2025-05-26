<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<?php

// Load environment variables
require '../vendor/autoload.php';
$dotenv = Dotenv\Dotenv::createImmutable(__DIR__);
$dotenv->load();

$clientId = $_ENV['PAYPAL_CLIENT_ID'];
$clientSecret = $_ENV['PAYPAL_CLIENT_SECRET'];

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

echo "<pre>";
print_r($response); // Debug: Print the raw response
echo "</pre>";


$token = json_decode($response)->access_token;
?>

<body>
    <!-- create order -->
    <?php

    $accessToken = $token; // Replace with the token from Step 1

    $orderData = [
        "intent" => "CAPTURE",
        "purchase_units" => [
            [
                "amount" => [
                    "currency_code" => "USD",
                    "value" => "10.00" // Payment amount
                ]
            ]
        ],
        "application_context" => [
            "cancel_url" => "https://localhost/cancel.php", // Cancel URL
            "return_url" => "http://localhost:3000/main/success.php" // Success URL
        ]
    ];

    $cUrlHandel = curl_init();
    curl_setopt($cUrlHandel, CURLOPT_URL, "https://api-m.sandbox.paypal.com/v2/checkout/orders");
    curl_setopt($cUrlHandel, CURLOPT_HTTPHEADER, [
        "Content-Type: application/json",
        "Authorization: Bearer " . $accessToken
    ]);
    curl_setopt($cUrlHandel, CURLOPT_POST, true);
    curl_setopt($cUrlHandel, CURLOPT_POSTFIELDS, json_encode($orderData));
    curl_setopt($cUrlHandel, CURLOPT_RETURNTRANSFER, true);

    $response = curl_exec($cUrlHandel);
    curl_close($cUrlHandel);

echo "<pre>";
print_r($response); // Print the raw response for debugging
echo "</pre>";

    $order = json_decode($response);
    foreach ($order->links as $link) {
        if ($link->rel === 'approve') {
            header("Location: " . $link->href);
            exit;
        }
    }
    ?>
</body>

</html>