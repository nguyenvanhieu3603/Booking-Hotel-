<?php

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require '../vendor/autoload.php'; // Load Composer's autoloader
require '../vendor/phpmailer/phpmailer/src/Exception.php';
require '../vendor/phpmailer/phpmailer/src/PHPMailer.php';

function sendMail($to, $subject, $otp)
{
    $mail = new PHPMailer(true);
    try {
        //Server settings
        $mail->isSMTP();                                            // Send using SMTP
        $mail->Host       = 'smtp.gmail.com';                     // Set the SMTP server to send through
        $mail->SMTPAuth   = true;                                   // Enable SMTP authentication
        $mail->Username   = 'supermanenderdragon@gmail.com';
        $mail->Password   = 'vlah oeas jjan extu';                                   // SMTP password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;         // Enable TLS encryption; `PHPMailer::ENCRYPTION_SMTPS` encouraged
        $mail->Port       = 587;                                    // TCP port to connect to

        $mail->setFrom('supermanenderdragon@gmail.com', 'OTP');
        $mail->addAddress($to, 'OTP');     // Nguoi nhan

        $mail->isHTML(true);
        $mail->Subject = $subject;
        $mail->Body    = "Mã OTP của bạn là: <b>$otp</b>";
        $mail->send();
        error_log('Email sent successfully to ' . $to); // Thong bao thanh cong
        echo 'Message has been sent';
    } catch (Exception $e) {
        echo "Message could not be sent. Mailer Error: {$mail->ErrorInfo}";
    }
}
