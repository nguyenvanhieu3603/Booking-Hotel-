<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'vendor/autoload.php';
require 'vendor/phpmailer/phpmailer/src/Exception.php';
require 'vendor/phpmailer/phpmailer/src/PHPMailer.php';
require 'vendor/phpmailer/phpmailer/src/SMTP.php';

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
        $this->mailer->Username   = 'supermanenderdragon@gmail.com';
        $this->mailer->Password   = 'gfkq qwdq ykkg iecv';
        $this->mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $this->mailer->Port       = 587;
        
        $this->mailer->setFrom('supermanenderdragon@gmail.com', 'He Thong Dat Phong Khach San');
        $this->mailer->isHTML(true);
    }
    
    public function sendOTP($toEmail, $otpCode)
    {
        try {
            $this->mailer->addAddress($toEmail);
            $this->mailer->Subject = 'Xac Thuc OTP';
            $this->mailer->Body    = "Mã OTP của bạn là: <b>$otpCode</b>. Mã có hiệu lực trong 5 phút.";
            
            $this->mailer->send();
            return true;
        } catch (Exception $e) {
            error_log("Không thể gửi email OTP. Lỗi: {$this->mailer->ErrorInfo}");
            return false;
        }
    }
    
    public function sendWelcomeEmail($toEmail, $fullName)
    {
        try {
            $this->mailer->addAddress($toEmail);
            $this->mailer->Subject = 'Chao Mung Ban Den Voi He Thong Dat Phong';
            $this->mailer->Body    = "Xin chào $fullName,<br><br>Cảm ơn bạn đã đăng ký tài khoản!";
            
            $this->mailer->send();
            return true;
        } catch (Exception $e) {
            error_log("Không thể gửi email chào mừng. Lỗi: {$this->mailer->ErrorInfo}");
            return false;
        }
    }
    
    public function sendResetPasswordEmail($toEmail, $resetLink)
    {
        try {
            $this->mailer->addAddress($toEmail);
            $this->mailer->Subject = 'Dat Lai Mat Khau';
            $this->mailer->Body    = "Xin chào,<br><br>Nhấp vào liên kết sau để đặt lại mật khẩu của bạn: <a href='$resetLink'>$resetLink</a><br>Liên kết này có hiệu lực trong 15 phút.";
            
            $this->mailer->send();
            return true;
        } catch (Exception $e) {
            error_log("Không thể gửi email đặt lại mật khẩu. Lỗi: {$this->mailer->ErrorInfo}");
            return false;
        }
    }
}
?>