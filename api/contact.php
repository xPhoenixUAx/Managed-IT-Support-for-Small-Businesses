<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');

function respond(int $status, array $payload): never
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE);
    exit;
}

function loadSiteConfig(string $path): array
{
    $source = file_get_contents($path);
    if ($source === false || !preg_match('/window\.SITE_CONFIG\s*=\s*(\{.*\})\s*;\s*$/s', $source, $matches)) {
        respond(500, ['ok' => false, 'error' => 'Site configuration is unavailable.']);
    }

    $config = json_decode($matches[1], true);
    if (!is_array($config)) respond(500, ['ok' => false, 'error' => 'Site configuration is invalid.']);
    return $config;
}

$siteConfig = loadSiteConfig(__DIR__ . '/../config/config.js');

if (($_SERVER['REQUEST_METHOD'] ?? '') !== 'POST') {
    header('Allow: POST');
    respond(405, ['ok' => false, 'error' => 'Method not allowed.']);
}

if ((int) ($_SERVER['CONTENT_LENGTH'] ?? 0) > 65536) {
    respond(413, ['ok' => false, 'error' => 'The submitted request is too large.']);
}

$contentType = strtolower($_SERVER['CONTENT_TYPE'] ?? '');
if (str_contains($contentType, 'application/json')) {
    $payload = json_decode((string) file_get_contents('php://input'), true);
    if (!is_array($payload)) respond(400, ['ok' => false, 'error' => 'Please submit the form again.']);
} else {
    $payload = $_POST;
}

function clean(mixed $value, int $max = 5000): string
{
    if (!is_string($value)) return '';
    $value = trim(strip_tags($value));
    return function_exists('mb_substr') ? mb_substr($value, 0, $max) : substr($value, 0, $max);
}

if (clean($payload['companyWebsite'] ?? '') !== '') respond(200, ['ok' => true]);

$name = clean($payload['name'] ?? '', 120);
$email = clean($payload['email'] ?? '', 180);
$company = clean($payload['company'] ?? '', 180);
$inquiryType = clean($payload['inquiryType'] ?? '', 180);
$message = clean($payload['message'] ?? '', 5000);
$consent = clean($payload['consent'] ?? '', 30);
$allowedInquiryTypes = array_merge(
    $siteConfig['forms']['serviceTypes'] ?? [],
    $siteConfig['forms']['inquiryTypes'] ?? []
);

if (
    $name === '' ||
    !filter_var($email, FILTER_VALIDATE_EMAIL) ||
    $company === '' ||
    !in_array($inquiryType, $allowedInquiryTypes, true) ||
    (function_exists('mb_strlen') ? mb_strlen($message) : strlen($message)) < 10 ||
    $consent !== 'agreed'
) {
    respond(400, ['ok' => false, 'error' => 'Please complete every required field with valid information.']);
}

$recipient = $siteConfig['contact']['email'];
$fromEmail = $siteConfig['forms']['fromEmail'];
if (!filter_var($recipient, FILTER_VALIDATE_EMAIL) || !filter_var($fromEmail, FILTER_VALIDATE_EMAIL)) {
    respond(500, ['ok' => false, 'error' => 'Email delivery is not configured correctly.']);
}

$companyForSubject = preg_replace('/[\r\n]+/', ' ', $company) ?? $company;
$subject = sprintf('[%s] %s - %s', $siteConfig['brand']['siteName'], $inquiryType, $companyForSubject);
$body = implode("\r\n", [
    'New website request for ' . $siteConfig['brand']['companyName'],
    '',
    'Name: ' . $name,
    'Business email: ' . $email,
    'Company: ' . $company,
    'Request type: ' . $inquiryType,
    '',
    'Message:',
    $message,
]);

$headers = [
    'From: ' . $siteConfig['brand']['siteName'] . ' Website <' . $fromEmail . '>',
    'Reply-To: ' . $email,
    'MIME-Version: 1.0',
    'Content-Type: text/plain; charset=UTF-8',
    'X-Mailer: PHP/' . PHP_VERSION,
];

$encodedSubject = '=?UTF-8?B?' . base64_encode($subject) . '?=';
$sent = @mail($recipient, $encodedSubject, $body, implode("\r\n", $headers));

if (!$sent) {
    respond(500, ['ok' => false, 'error' => 'The message could not be delivered. Please email ' . $recipient . ' directly.']);
}

respond(200, ['ok' => true]);
