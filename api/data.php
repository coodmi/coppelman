<?php
header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST');
header('Access-Control-Allow-Headers: Content-Type');

$dataFile = __DIR__ . '/db.json';

// Initialize db if not exists
if (!file_exists($dataFile)) {
    file_put_contents($dataFile, json_encode([
        'posts'      => [],
        'categories' => ['Golf','Polo & Equestrian','Wine','Farm & Village','Museum by Ando','The Land'],
        'people'     => ['Adrian Zecha','Nacho Figueras','Jonathan Breene','Ignacio Ramos Sr.','Howard Backen','Ignacio Ramos Jr.','Tom Doak','Jean-Michel Gathy','Tadao Ando','Kerry Hill'],
        'password'   => 'admin123',
    ]));
}

$db = json_decode(file_get_contents($dataFile), true);

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $key = $_GET['key'] ?? 'all';
    if ($key === 'all') {
        echo json_encode($db);
    } else {
        echo json_encode($db[$key] ?? null);
    }
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $body = json_decode(file_get_contents('php://input'), true);
    $key  = $body['key']  ?? null;
    $data = $body['data'] ?? null;

    if (!$key || !array_key_exists($key, $db)) {
        http_response_code(400);
        echo json_encode(['error' => 'Invalid key']);
        exit;
    }

    $db[$key] = $data;
    file_put_contents($dataFile, json_encode($db));
    echo json_encode(['ok' => true]);
    exit;
}

http_response_code(405);
echo json_encode(['error' => 'Method not allowed']);
