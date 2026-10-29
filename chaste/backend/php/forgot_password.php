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

final class ForgotPasswordResponse extends RuntimeException
{
    public function __construct(public int $status, public array $payload)
    {
        parent::__construct();
    }
}

function respond(int $status, array $payload): void
{
    throw new ForgotPasswordResponse($status, $payload);
}

$status = 200;
$payload = [];

try {
    if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
        respond(200, ['success' => true]);
    }

    if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
        respond(405, ['error' => 'Method not allowed.']);
    }

    require __DIR__ . '/db_connect.php';

    $data = json_decode(file_get_contents('php://input'), true);
    if (!is_array($data) && !empty($_POST)) {
        $data = $_POST;
    }
    if (!is_array($data)) {
        respond(400, ['error' => 'Request body must be valid JSON.']);
    }

    $email = strtolower(trim((string) ($data['email'] ?? '')));
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        respond(422, ['error' => 'Enter a valid email address.']);
    }

    $statement = $pdo->prepare(
        'SELECT security_question FROM chaste_app_login_db WHERE email = :email'
    );
    $statement->execute(['email' => $email]);
    $user = $statement->fetch();

    if (!$user) {
        respond(404, ['error' => 'No account was found for that email address.']);
    }

    respond(200, ['security_question' => $user['security_question']]);
} catch (ForgotPasswordResponse $response) {
    $status = $response->status;
    $payload = $response->payload;
} catch (Throwable $error) {
    $status = 500;
    $payload = ['error' => $error->getMessage()];
}

if (ob_get_level() > 0) {
    ob_clean();
}
http_response_code($status);
echo json_encode($payload);