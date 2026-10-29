<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
$allowedOrigins = array_map('trim', explode(',', getenv('FRONTEND_ORIGINS') ?: 'http://localhost:5173,http://localhost:5174,http://localhost:3000,http://127.0.0.1:5173'));
$requestOrigin = $_SERVER['HTTP_ORIGIN'] ?? '';
header('Vary: Origin');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
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

require __DIR__ . '/bootstrap.php';
session_start();

$userId = (int) ($_SESSION['user_id'] ?? 0);
if ($userId < 1) {
    respond(401, ['error' => 'Please sign in to manage recovery settings.']);
}

$pdo = database();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $statement = $pdo->prepare(
        'SELECT CASE WHEN security_question IS NOT NULL AND security_question <> "" '
        . 'AND security_answer IS NOT NULL AND security_answer <> "" '
        . 'THEN security_question ELSE NULL END AS security_question '
        . 'FROM chaste_app_login_db WHERE id = :id'
    );
    $statement->execute(['id' => $userId]);
    $user = $statement->fetch();

    if (!$user) {
        respond(404, ['error' => 'Account not found.']);
    }

    respond(200, ['security_question' => $user['security_question']]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    respond(405, ['error' => 'Method not allowed.']);
}

$data = request_data();
$question = trim((string) ($data['security_question'] ?? ''));
$answer = strtolower(trim((string) ($data['security_answer'] ?? '')));
$allowedQuestions = [
    'What was the name of your first school?',
    'What city were you born in?',
    'What was the name of your first pet?',
];

if (!in_array($question, $allowedQuestions, true) || $answer === '') {
    respond(422, ['error' => 'Choose a valid security question and enter its answer.']);
}

$statement = $pdo->prepare(
    'UPDATE chaste_app_login_db '
    . 'SET security_question = :question, security_answer = :answer '
    . 'WHERE id = :id AND (security_question IS NULL OR security_question = "" '
    . 'OR security_answer IS NULL OR security_answer = "")'
);
$statement->execute([
    'question' => $question,
    'answer' => password_hash($answer, PASSWORD_DEFAULT),
    'id' => $userId,
]);

if ($statement->rowCount() !== 1) {
    respond(409, ['error' => 'Recovery settings are already configured for this account.']);
}

respond(200, ['security_question' => $question]);