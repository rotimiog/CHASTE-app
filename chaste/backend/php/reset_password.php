<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
$allowedOrigins = array_map('trim', explode(',', getenv('FRONTEND_ORIGINS') ?: 'http://localhost:5173,http://localhost:5174,http://localhost:3000'));
$requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
header('Vary: Origin');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if (in_array($requestOrigin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $requestOrigin);
    header('Access-Control-Allow-Credentials: true');
}

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    echo json_encode(['success' => true]);
    exit;
}

require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['error' => 'Method not allowed.']);
}

$data = request_data();
if (!$data && $_POST) {
    $data = $_POST;
}

$email = strtolower(trim((string) ($data['email'] ?? '')));
$securityAnswer = strtolower(trim((string) ($data['security_answer'] ?? '')));
$newPassword = (string) ($data['new_password'] ?? '');

if (!filter_var($email, FILTER_VALIDATE_EMAIL) || $securityAnswer === '' || strlen($newPassword) < 8) {
    respond(422, ['error' => 'Enter a valid email, security answer, and new password of at least 8 characters.']);
}

$pdo = database();
$statement = $pdo->prepare(
    'SELECT id, security_answer FROM chaste_app_login_db WHERE email = :email'
);
$statement->execute(['email' => $email]);
$user = $statement->fetch();

if (!$user || !password_verify($securityAnswer, $user['security_answer'])) {
    respond(401, ['error' => 'The email or security answer is incorrect.']);
}

$update = $pdo->prepare(
    'UPDATE chaste_app_login_db SET password_hash = :password_hash WHERE id = :id'
);
$update->execute([
    'password_hash' => password_hash($newPassword, PASSWORD_DEFAULT),
    'id' => $user['id'],
]);

respond(200, ['message' => 'Password reset successful.']);