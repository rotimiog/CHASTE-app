<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
ob_start();
ini_set('display_errors', '0');
error_reporting(E_ALL);
set_error_handler(static function (int $severity, string $message, string $file, int $line): bool {
    if (!(error_reporting() & $severity)) {
        return false;
    }
    throw new ErrorException($message, 0, $severity, $file, $line);
});

$allowedOrigins = array_map('trim', explode(',', getenv('FRONTEND_ORIGINS') ?: 'http://localhost:5173,http://localhost:5174,http://localhost:3000'));
$requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
header('Vary: Origin');
header('Access-Control-Allow-Methods: POST, GET, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if (in_array($requestOrigin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $requestOrigin);
    header('Access-Control-Allow-Credentials: true');
}

function login_json_response(int $status, array $payload): void
{
    if (ob_get_level() > 0) {
        ob_clean();
    }
    http_response_code($status);
    echo json_encode($payload, JSON_INVALID_UTF8_SUBSTITUTE);
    exit;
}

try {
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        login_json_response(200, ['success' => true]);
    }

    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        login_json_response(405, ['error' => 'Method not allowed.']);
    }

    require __DIR__ . '/bootstrap.php';

    $data = request_data();
    if (!$data && $_POST) {
        $data = $_POST;
    }

    $email = strtolower(trim((string) ($data['email'] ?? $data['username'] ?? '')));
    $password = (string) ($data['password'] ?? '');

    if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '') {
        login_json_response(422, ['error' => 'Enter a valid email and password.']);
    }

    $statement = database()->prepare('SELECT id, name, email, password_hash, security_question FROM chaste_app_login_db WHERE email = :email');
    $statement->execute(['email' => $email]);
    $user = $statement->fetch();

    if (!$user || !password_verify($password, $user['password_hash'])) {
        login_json_response(401, ['error' => 'Invalid credentials']);
    }

    start_user_session();
    session_regenerate_id(true);
    $_SESSION['user_id'] = (int) $user['id'];

    login_json_response(200, [
        'success' => true,
        'message' => 'Login successful',
        'user' => [
            'id' => (int) $user['id'],
            'name' => $user['name'],
            'email' => $user['email'],
            'security_question' => $user['security_question'],
        ],
    ]);
} catch (Throwable $error) {
    login_json_response(500, ['error' => $error->getMessage()]);
}