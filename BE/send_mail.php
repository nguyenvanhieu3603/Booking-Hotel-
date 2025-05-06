<?php

include("email.php");
session_start();

header("Content-Type: application/json; charset=UTF-8");

// Define cooldown period and max attempts
$cooldownPeriod = 60;
$maxAttempts = 5;

$response = ["success" => false, "message" => ""];

// Initialize resend attempts tracking
if (!isset($_SESSION['otp_resend_attempts'])) {
    $_SESSION['otp_resend_attempts'] = 0;
}

// Check cooldown timer
if (isset($_SESSION['last_otp_resend'])) {
    $timeSinceLastResend = time() - $_SESSION['last_otp_resend'];
    if ($timeSinceLastResend < $cooldownPeriod) {
        $remainingTime = $cooldownPeriod - $timeSinceLastResend;
        $response["message"] = "Vui lòng chờ $remainingTime giây trước khi gửi lại mã OTP.";
        echo json_encode($response, JSON_UNESCAPED_UNICODE);
        exit();
    }
}

// Check max attempts
if ($_SESSION['otp_resend_attempts'] >= $maxAttempts) {
    $response["message"] = "Bạn đã vượt quá số lần gửi lại OTP. Vui lòng thử lại sau.";
    echo json_encode($response,JSON_UNESCAPED_UNICODE);
    exit();
}


// Increase resend attempts count
$_SESSION['otp_resend_attempts']++;

// Generate and store OTP
$otp = rand(100000, 999999);
$_SESSION['otp'] = $otp;
$_SESSION['otp_expire'] = time() + 300; // 5 minutes expiration
$_SESSION['last_otp_resend'] = time();
$_SESSION['email'] = $_POST['email'];

// Send OTP via email
sendMail($_POST['email'], "OTP verify", $otp);

$response["success"] = true;
$response["message"] = "Mã OTP đã được gửi lại.";
echo json_encode($response,JSON_UNESCAPED_UNICODE);
?>