<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php'; // Load Composer's autoloader
require 'vendor/phpmailer/phpmailer/src/Exception.php';
require 'vendor/phpmailer/phpmailer/src/PHPMailer.php';

class EmailService
{
    private $mailer;
    
    public function __construct()
    {
        $this->mailer = new PHPMailer(true);
        
        // Server settings
        $this->mailer->isSMTP();
        $this->mailer->Host       = 'smtp.gmail.com';
        $this->mailer->SMTPAuth   = true;
        $this->mailer->Username   = 'supermanenderdragon@gmail.com'; // Thay bằng email của bạn
        $this->mailer->Password   = 'gfkq qwdq ykkg iecv';    // Sử dụng App Password nếu bật 2FA
        $this->mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $this->mailer->Port       = 587;
        
        $this->mailer->setFrom('your_email@gmail.com', 'Hotel Booking System');
        $this->mailer->isHTML(true);
    }
    
    public function sendOTP($toEmail, $otpCode)
    {
        try {
            $this->mailer->addAddress($toEmail);
            $this->mailer->Subject = 'Xac thuc OTP cho tai khoan';
            $this->mailer->Body    = "Ma OTP cua ban la: <b>$otpCode</b>. Ma co hieu luc trong 5 phut.";
            
            $this->mailer->send();
            return true;
        } catch (Exception $e) {
            error_log("Email could not be sent. Mailer Error: {$this->mailer->ErrorInfo}");
            return false;
        }
    }
    
    public function sendWelcomeEmail($toEmail, $fullName)
    {
        try {
            $this->mailer->addAddress($toEmail);
            $this->mailer->Subject = 'Chao mung den voi he thong dat phong';
            $this->mailer->Body    = "Xin chao $fullName,<br><br>Cam on ban da dang ky tai khoan!";
            
            $this->mailer->send();
            return true;
        } catch (Exception $e) {
            error_log("Welcome email could not be sent. Error: {$this->mailer->ErrorInfo}");
            return false;
        }
    }
}