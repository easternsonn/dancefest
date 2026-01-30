<?php
/**
 * Form Submission Handler for Dance Festival Website
 * Handles form data validation and email sending with MP3 attachment
 */

// Enable error reporting for debugging (disable in production)
error_reporting(E_ALL);
ini_set('display_errors', 0);
ini_set('log_errors', 1);

// Set response headers
header('Content-Type: application/json; charset=utf-8');

// Allow CORS if needed (remove in production if not required)
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

// ====================================
// CONFIGURATION
// ====================================

// Email configuration
define('RECIPIENT_EMAIL', 'your-email@example.com'); // CHANGE THIS to your email
define('FROM_EMAIL', 'noreply@artportal.ru');
define('FROM_NAME', 'Арт-портал');
define('SUBJECT', 'Новая заявка на участие в фестивале');

// File upload configuration
define('MAX_FILE_SIZE', 50 * 1024 * 1024); // 50MB
define('ALLOWED_EXTENSIONS', ['mp3']);
define('ALLOWED_MIME_TYPES', ['audio/mpeg', 'audio/mp3']);

// ====================================
// HELPER FUNCTIONS
// ====================================

/**
 * Send JSON response
 */
function sendResponse($success, $message, $data = []) {
    echo json_encode([
        'success' => $success,
        'message' => $message,
        'data' => $data
    ]);
    exit;
}

/**
 * Validate and sanitize input
 */
function validateInput($data) {
    $data = trim($data);
    $data = stripslashes($data);
    $data = htmlspecialchars($data);
    return $data;
}

/**
 * Validate email format
 */
function isValidEmail($email) {
    return filter_var($email, FILTER_VALIDATE_EMAIL) !== false;
}

/**
 * Validate phone number (Russian format)
 */
function isValidPhone($phone) {
    $cleanPhone = preg_replace('/\D/', '', $phone);
    return strlen($cleanPhone) >= 10 && strlen($cleanPhone) <= 11;
}

/**
 * Validate uploaded file
 */
function validateFile($file) {
    // Check if file was uploaded
    if (!isset($file) || $file['error'] === UPLOAD_ERR_NO_FILE) {
        return ['valid' => false, 'message' => 'Файл не был загружен'];
    }
    
    // Check for upload errors
    if ($file['error'] !== UPLOAD_ERR_OK) {
        return ['valid' => false, 'message' => 'Ошибка при загрузке файла'];
    }
    
    // Check file size
    if ($file['size'] > MAX_FILE_SIZE) {
        return ['valid' => false, 'message' => 'Размер файла превышает 50MB'];
    }
    
    // Check file extension
    $fileExtension = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    if (!in_array($fileExtension, ALLOWED_EXTENSIONS)) {
        return ['valid' => false, 'message' => 'Разрешены только MP3 файлы'];
    }
    
    // Check MIME type
    $finfo = finfo_open(FILEINFO_MIME_TYPE);
    $mimeType = finfo_file($finfo, $file['tmp_name']);
    finfo_close($finfo);
    
    if (!in_array($mimeType, ALLOWED_MIME_TYPES)) {
        return ['valid' => false, 'message' => 'Неверный тип файла. Требуется MP3'];
    }
    
    return ['valid' => true];
}

// ====================================
// MAIN PROCESSING
// ====================================

// Check if request method is POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    sendResponse(false, 'Метод запроса должен быть POST');
}

// Get and validate form data
$name = isset($_POST['name']) ? validateInput($_POST['name']) : '';
$email = isset($_POST['email']) ? validateInput($_POST['email']) : '';
$phone = isset($_POST['phone']) ? validateInput($_POST['phone']) : '';
$project = isset($_POST['project']) ? validateInput($_POST['project']) : '';
$message = isset($_POST['message']) ? validateInput($_POST['message']) : '';

// Validation
$errors = [];

if (empty($name) || strlen($name) < 2) {
    $errors[] = 'Имя должно содержать минимум 2 символа';
}

if (empty($email) || !isValidEmail($email)) {
    $errors[] = 'Введите корректный email адрес';
}

if (empty($phone) || !isValidPhone($phone)) {
    $errors[] = 'Введите корректный номер телефона';
}

if (empty($project)) {
    $errors[] = 'Выберите проект';
}

// Validate file
$fileValidation = validateFile($_FILES['mp3file']);
if (!$fileValidation['valid']) {
    $errors[] = $fileValidation['message'];
}

// If there are validation errors, return them
if (!empty($errors)) {
    sendResponse(false, implode('. ', $errors));
}

// Get project name
$projectNames = [
    'korni' => 'Корни',
    'escalera' => 'Escalera',
    'mango' => 'Mango Fest',
    'futurum' => 'Futurum'
];
$projectName = isset($projectNames[$project]) ? $projectNames[$project] : $project;

// ====================================
// PREPARE EMAIL
// ====================================

// Generate unique boundary for multipart email
$boundary = md5(time());

// Email headers
$headers = "From: " . FROM_NAME . " <" . FROM_EMAIL . ">\r\n";
$headers .= "Reply-To: " . $email . "\r\n";
$headers .= "MIME-Version: 1.0\r\n";
$headers .= "Content-Type: multipart/mixed; boundary=\"{$boundary}\"\r\n";

// Email body (text part)
$emailBody = "--{$boundary}\r\n";
$emailBody .= "Content-Type: text/html; charset=utf-8\r\n";
$emailBody .= "Content-Transfer-Encoding: 8bit\r\n\r\n";

$emailBody .= "<!DOCTYPE html>\r\n";
$emailBody .= "<html>\r\n";
$emailBody .= "<head>\r\n";
$emailBody .= "<meta charset='utf-8'>\r\n";
$emailBody .= "<style>\r\n";
$emailBody .= "body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }\r\n";
$emailBody .= ".container { max-width: 600px; margin: 0 auto; padding: 20px; }\r\n";
$emailBody .= ".header { background: #9c27b0; color: white; padding: 20px; border-radius: 8px 8px 0 0; }\r\n";
$emailBody .= ".content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }\r\n";
$emailBody .= ".field { margin-bottom: 15px; }\r\n";
$emailBody .= ".label { font-weight: bold; color: #9c27b0; }\r\n";
$emailBody .= ".value { margin-top: 5px; }\r\n";
$emailBody .= ".footer { text-align: center; margin-top: 20px; font-size: 12px; color: #999; }\r\n";
$emailBody .= "</style>\r\n";
$emailBody .= "</head>\r\n";
$emailBody .= "<body>\r\n";
$emailBody .= "<div class='container'>\r\n";
$emailBody .= "<div class='header'>\r\n";
$emailBody .= "<h2>Новая заявка на участие</h2>\r\n";
$emailBody .= "</div>\r\n";
$emailBody .= "<div class='content'>\r\n";

$emailBody .= "<div class='field'>\r\n";
$emailBody .= "<div class='label'>Имя:</div>\r\n";
$emailBody .= "<div class='value'>" . htmlspecialchars($name) . "</div>\r\n";
$emailBody .= "</div>\r\n";

$emailBody .= "<div class='field'>\r\n";
$emailBody .= "<div class='label'>Email:</div>\r\n";
$emailBody .= "<div class='value'><a href='mailto:" . htmlspecialchars($email) . "'>" . htmlspecialchars($email) . "</a></div>\r\n";
$emailBody .= "</div>\r\n";

$emailBody .= "<div class='field'>\r\n";
$emailBody .= "<div class='label'>Телефон:</div>\r\n";
$emailBody .= "<div class='value'>" . htmlspecialchars($phone) . "</div>\r\n";
$emailBody .= "</div>\r\n";

$emailBody .= "<div class='field'>\r\n";
$emailBody .= "<div class='label'>Проект:</div>\r\n";
$emailBody .= "<div class='value'>" . htmlspecialchars($projectName) . "</div>\r\n";
$emailBody .= "</div>\r\n";

if (!empty($message)) {
    $emailBody .= "<div class='field'>\r\n";
    $emailBody .= "<div class='label'>Сообщение:</div>\r\n";
    $emailBody .= "<div class='value'>" . nl2br(htmlspecialchars($message)) . "</div>\r\n";
    $emailBody .= "</div>\r\n";
}

$emailBody .= "<div class='field'>\r\n";
$emailBody .= "<div class='label'>Музыкальный файл:</div>\r\n";
$emailBody .= "<div class='value'>См. прикрепленный файл: " . htmlspecialchars($_FILES['mp3file']['name']) . "</div>\r\n";
$emailBody .= "</div>\r\n";

$emailBody .= "</div>\r\n";
$emailBody .= "<div class='footer'>\r\n";
$emailBody .= "<p>Это сообщение было отправлено с сайта Арт-портал</p>\r\n";
$emailBody .= "<p>Дата: " . date('d.m.Y H:i:s') . "</p>\r\n";
$emailBody .= "</div>\r\n";
$emailBody .= "</div>\r\n";
$emailBody .= "</body>\r\n";
$emailBody .= "</html>\r\n\r\n";

// ====================================
// ATTACH MP3 FILE
// ====================================

$file = $_FILES['mp3file'];
$fileName = $file['name'];
$fileTmpPath = $file['tmp_name'];

// Read file content
$fileContent = file_get_contents($fileTmpPath);
$fileContentEncoded = chunk_split(base64_encode($fileContent));

// Add attachment to email
$emailBody .= "--{$boundary}\r\n";
$emailBody .= "Content-Type: audio/mpeg; name=\"{$fileName}\"\r\n";
$emailBody .= "Content-Transfer-Encoding: base64\r\n";
$emailBody .= "Content-Disposition: attachment; filename=\"{$fileName}\"\r\n\r\n";
$emailBody .= $fileContentEncoded . "\r\n";
$emailBody .= "--{$boundary}--";

// ====================================
// SEND EMAIL
// ====================================

$mailSent = mail(RECIPIENT_EMAIL, SUBJECT, $emailBody, $headers);

if ($mailSent) {
    // Log success (optional)
    error_log("Form submitted successfully from: " . $email);
    
    sendResponse(true, 'Заявка успешно отправлена!', [
        'name' => $name,
        'email' => $email
    ]);
} else {
    // Log error
    error_log("Failed to send email for submission from: " . $email);
    
    sendResponse(false, 'Не удалось отправить заявку. Пожалуйста, попробуйте позже.');
}
?>
