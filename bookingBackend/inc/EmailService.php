<?php
require_once PROJECT_ROOT_PATH . "inc/vendor/autoload.php";
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

class EmailService
{
    private $mailer;

    public function __construct()
    {
        $this->mailer = new PHPMailer(true);
        $this->mailer->isSMTP();
        $this->mailer->Host = 'smtp.gmail.com';
        $this->mailer->SMTPAuth = true;
        $this->mailer->Username = 'supermanenderdragon@gmail.com';
        $this->mailer->Password = 'gfkq qwdq ykkg iecv';
        $this->mailer->SMTPSecure = PHPMailer::ENCRYPTION_STARTTLS;
        $this->mailer->Port = 587;
        $this->mailer->setFrom('supermanenderdragon@gmail.com', 'Hotel Booking System');
        $this->mailer->CharSet = 'UTF-8'; // Hỗ trợ tiếng Việt có dấu
    }

    public function sendOTP($toEmail, $otpCode)
    {
        try {
            $this->mailer->addAddress($toEmail);
            $this->mailer->isHTML(true);
            $this->mailer->Subject = 'Ma OTP cua ban';
            $this->mailer->Body = "Mã OTP của bạn là <b>$otpCode</b>. Mã này có hiệu lực trong 5 phút.";
            $this->mailer->send();
            return true;
        } catch (Exception $e) {
            error_log("Failed to send OTP email: {$this->mailer->ErrorInfo}");
            return false;
        }
    }

    public function sendWelcomeEmail($toEmail, $fullName)
    {
        try {
            $this->mailer->addAddress($toEmail);
            $this->mailer->isHTML(true);
            $this->mailer->Subject = 'Chao mung den voi he thong dat phong';
            $this->mailer->Body = "Kính gửi $fullName,<br>Chào mừng bạn đến với Hệ thống Đặt phòng Khách sạn! Chúng tôi rất vui được chào đón bạn.";
            $this->mailer->send();
            return true;
        } catch (Exception $e) {
            error_log("Failed to send welcome email: {$this->mailer->ErrorInfo}");
            return false;
        }
    }

    public function sendResetPasswordEmail($toEmail, $resetLink)
    {
        try {
            $this->mailer->addAddress($toEmail);
            $this->mailer->isHTML(true);
            $this->mailer->Subject = 'Dat lai mat khau';
            $this->mailer->Body = "Nhấn <a href='$resetLink'>vào đây</a> để đặt lại mật khẩu của bạn. Liên kết này có hiệu lực trong 15 phút.";
            $this->mailer->send();
            return true;
        } catch (Exception $e) {
            error_log("Failed to send reset password email: {$this->mailer->ErrorInfo}");
            return false;
        }
    }

    public function sendBookingConfirmation($toEmail, $fullName, $hotelName, $roomName, $checkInDate, $checkOutDate, $totalPrice)
    {
        try {
            $this->mailer->addAddress($toEmail);
            $this->mailer->isHTML(true);
            $this->mailer->Subject = 'Xac nhan dat phong';
            $this->mailer->Body = "Kính gửi $fullName,<br>
                Đặt phòng của bạn tại <b>$hotelName</b> đã được xác nhận.<br>
                Phòng: $roomName<br>
                Ngày nhận phòng: $checkInDate<br>
                Ngày trả phòng: $checkOutDate<br>
                Tổng giá: " . number_format($totalPrice, 2) . " VND<br>
                Cảm ơn bạn đã lựa chọn dịch vụ của chúng tôi!";
            $this->mailer->send();
            return true;
        } catch (Exception $e) {
            error_log("Failed to send booking confirmation email: {$this->mailer->ErrorInfo}");
            return false;
        }
    }

    public function sendBookingCancellation($toEmail, $fullName, $hotelName, $roomName, $checkInDate)
    {
        try {
            $this->mailer->addAddress($toEmail);
            $this->mailer->isHTML(true);
            $this->mailer->Subject = 'Huy dat phong';
            $this->mailer->Body = "Kính gửi $fullName,<br>
                Đặt phòng của bạn tại <b>$hotelName</b> cho phòng <b>$roomName</b> vào ngày $checkInDate đã bị hủy.<br>
                Nếu bạn có bất kỳ câu hỏi nào, vui lòng liên hệ với bộ phận hỗ trợ.";
            $this->mailer->send();
            return true;
        } catch (Exception $e) {
            error_log("Failed to send booking cancellation email: {$this->mailer->ErrorInfo}");
            return false;
        }
    }

    public function sendPaymentConfirmation($toEmail, $fullName, $hotelName, $amount, $paymentMethod)
    {
        try {
            $this->mailer->addAddress($toEmail);
            $this->mailer->isHTML(true);
            $this->mailer->Subject = 'Xac nhan thanh toan';
            $this->mailer->Body = "Kính gửi $fullName,<br>
                Thanh toán của bạn với số tiền " . number_format($amount, 2) . " VND cho <b>$hotelName</b> qua $paymentMethod đã được ghi nhận.<br>
                Cảm ơn bạn đã thanh toán!";
            $this->mailer->send();
            return true;
        } catch (Exception $e) {
            error_log("Failed to send payment confirmation email: {$this->mailer->ErrorInfo}");
            return false;
        }
    }
}