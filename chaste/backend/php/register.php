<?php
declare(strict_types=1);

$allowedOrigins = array_map('trim', explode(',', getenv('FRONTEND_ORIGINS') ?: 'http://localhost:5173,http://localhost:5174,http://localhost:3000'));
$requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
header('Content-Type: application/json; charset=utf-8');
header('Vary: Origin');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
if (in_array($requestOrigin, $allowedOrigins, true)) {
    header('Access-Control-Allow-Origin: ' . $requestOrigin);
    header('Access-Control-Allow-Credentials: true');
}

if (($_SERVER['REQUEST_METHOD'] ?? '') === 'OPTIONS') {
    http_response_code(200);
    echo json_encode(['success' => true]);
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed.']);
    exit;
}

require __DIR__ . '/bootstrap.php';

$data = request_data();
if (!$data && $_POST) {
    $data = $_POST;
}

$name = trim((string) ($data['name'] ?? ''));
$email = strtolower(trim((string) ($data['email'] ?? '')));
$password = (string) ($data['password'] ?? '');
$securityQuestion = trim((string) ($data['security_question'] ?? ''));
$securityAnswer = strtolower(trim((string) ($data['security_answer'] ?? '')));
$allowedSecurityQuestions = [
    'What was the name of your first school?',
    'What city were you born in?',
    'What was the name of your first pet?',
];

if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || strlen($password) < 8
    || !in_array($securityQuestion, $allowedSecurityQuestions, true) || $securityAnswer === '') {
    respond(422, ['error' => 'Enter a name, valid email, password of at least 8 characters, security question, and answer.']);
}

$pdo = database();

$existingUser = $pdo->prepare('SELECT 1 FROM chaste_app_login_db WHERE email = :email LIMIT 1');
$existingUser->execute(['email' => $email]);
if ($existingUser->fetchColumn()) {
    respond(409, ['error' => 'This email is already registered. Please log in.']);
}

try {
    $statement = $pdo->prepare(
        'INSERT INTO chaste_app_login_db (name, email, password_hash, security_question, security_answer) '
        . 'VALUES (:name, :email, :password_hash, :security_question, :security_answer)'
    );
    $statement->execute([
        'name' => $name,
        'email' => $email,
        'password_hash' => password_hash($password, PASSWORD_DEFAULT),
        'security_question' => $securityQuestion,
        'security_answer' => password_hash($securityAnswer, PASSWORD_DEFAULT),
    ]);
} catch (PDOException $error) {
    $isDuplicateEmail = $error->getCode() === '23000'
        && isset($error->errorInfo[1])
        && (int) $error->errorInfo[1] === 1062;
    if ($isDuplicateEmail) {
        respond(409, ['error' => 'This email is already registered. Please log in.']);
    }

    respond(500, ['error' => 'Unable to create your account. Please try again.']);
}

$user = [
    'id' => (int) $pdo->lastInsertId(),
    'name' => $name,
    'email' => $email,
    'security_question' => $securityQuestion,
];
start_user_session();
session_regenerate_id(true);
$_SESSION['user_id'] = $user['id'];

respond(201, ['user' => $user]);