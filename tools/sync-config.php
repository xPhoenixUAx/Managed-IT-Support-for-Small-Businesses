<?php
declare(strict_types=1);

if (PHP_SAPI !== 'cli') {
    http_response_code(404);
    exit;
}

const GENERATED_NOTICE = ' Generated from config/config.js by tools/sync-config.php. Do not edit shared values in this file. ';

function fail(string $message): never
{
    fwrite(STDERR, $message . PHP_EOL);
    exit(1);
}

function loadConfig(string $path): array
{
    $source = file_get_contents($path);
    if ($source === false || !preg_match('/window\.SITE_CONFIG\s*=\s*(\{.*\})\s*;\s*$/s', $source, $matches)) {
        fail('Unable to read the JSON-compatible object from config/config.js.');
    }
    $config = json_decode($matches[1], true);
    if (!is_array($config)) fail('config/config.js contains invalid JSON-compatible data.');
    return $config;
}

function nodeList(DOMXPath $xpath, string $query, ?DOMNode $context = null): array
{
    $result = $xpath->query($query, $context);
    return $result === false ? [] : iterator_to_array($result);
}

function firstNode(DOMXPath $xpath, string $query, ?DOMNode $context = null): ?DOMNode
{
    $result = $xpath->query($query, $context);
    return $result === false ? null : $result->item(0);
}

function classQuery(string $className): string
{
    return "contains(concat(' ', normalize-space(@class), ' '), ' {$className} ')";
}

function hasClass(DOMElement $element, string $className): bool
{
    return in_array($className, preg_split('/\s+/', trim($element->getAttribute('class'))) ?: [], true);
}

function setText(DOMNode $node, string $value): void
{
    while ($node->firstChild !== null) $node->removeChild($node->firstChild);
    $node->appendChild($node->ownerDocument->createTextNode($value));
}

function setLeadingText(DOMElement $element, string $value): void
{
    foreach (iterator_to_array($element->childNodes) as $child) {
        if ($child->nodeType === XML_TEXT_NODE) $element->removeChild($child);
    }
    if ($element->firstChild === null) {
        $element->appendChild($element->ownerDocument->createTextNode($value));
        return;
    }
    $element->insertBefore($element->ownerDocument->createTextNode($value . ' '), $element->firstChild);
}

function setEmailLink(DOMElement $element, string $email): void
{
    $icon = null;
    foreach (iterator_to_array($element->childNodes) as $child) {
        if ($child instanceof DOMElement && ($child->getAttribute('aria-hidden') === 'true' || hasClass($child, 'icon-glyph'))) {
            $icon = $child;
            break;
        }
    }
    while ($element->firstChild !== null) $element->removeChild($element->firstChild);
    if ($icon !== null) {
        $element->appendChild($icon);
        $element->appendChild($element->ownerDocument->createTextNode(' ' . $email));
    } else {
        $element->appendChild($element->ownerDocument->createTextNode($email));
    }
}

function normalizeRoute(string $value): string
{
    $path = parse_url($value, PHP_URL_PATH);
    $path = is_string($path) ? $path : $value;
    $normalized = '/' . trim(str_replace('\\', '/', $path), '/');
    return $normalized === '/' ? '/' : rtrim($normalized, '/');
}

function routeForFile(string $file, string $root): string
{
    $relative = str_replace('\\', '/', substr($file, strlen($root) + 1));
    if ($relative === 'index.html') return '/';
    return normalizeRoute('/' . substr($relative, 0, -strlen('/index.html')));
}

function normalizedFilePath(string $path): string
{
    $segments = [];
    $path = str_replace('\\', '/', $path);
    $prefix = preg_match('/^[A-Za-z]:/', $path, $matches) ? strtoupper($matches[0]) : '';
    if ($prefix !== '') $path = substr($path, 2);
    foreach (explode('/', $path) as $segment) {
        if ($segment === '' || $segment === '.') continue;
        if ($segment === '..') array_pop($segments);
        else $segments[] = $segment;
    }
    return ($prefix !== '' ? $prefix . '/' : '/') . implode('/', $segments);
}

function routeForHref(string $href, string $htmlFile, string $root, array $routes): ?string
{
    if ($href === '' || str_starts_with($href, '#') || preg_match('/^(?:mailto:|tel:|data:|javascript:)/i', $href)) return null;
    if (preg_match('/^[a-z][a-z0-9+.-]*:/i', $href)) return null;
    $path = parse_url($href, PHP_URL_PATH);
    if (!is_string($path) || $path === '') return null;
    if (str_starts_with($path, '/')) {
        $candidate = normalizeRoute($path);
        if (array_key_exists($candidate, $routes)) return $candidate;
        foreach ($routes as $route => $destination) {
            if (normalizeRoute((string) $destination) === $candidate) return normalizeRoute((string) $route);
        }
        return null;
    }
    $target = normalizedFilePath(dirname($htmlFile) . '/' . rawurldecode($path));
    $normalizedRoot = rtrim(normalizedFilePath($root), '/');
    if (!str_starts_with(strtolower($target), strtolower($normalizedRoot . '/'))) return null;
    $relative = substr($target, strlen($normalizedRoot) + 1);
    if ($relative === 'index.html') return '/';
    if (!str_ends_with($relative, '/index.html')) return null;
    return normalizeRoute('/' . substr($relative, 0, -strlen('/index.html')));
}

function hrefSuffix(string $href): string
{
    $suffix = '';
    $query = parse_url($href, PHP_URL_QUERY);
    $fragment = parse_url($href, PHP_URL_FRAGMENT);
    if (is_string($query) && $query !== '') $suffix .= '?' . $query;
    if (is_string($fragment) && $fragment !== '') $suffix .= '#' . $fragment;
    return $suffix;
}

function absoluteSiteUrl(string $website, string $destination): string
{
    if (preg_match('/^https?:\/\//i', $destination)) return $destination;
    return rtrim($website, '/') . '/' . ltrim($destination, '/');
}

function directLabelSpan(DOMXPath $xpath, DOMElement $container): ?DOMElement
{
    foreach (nodeList($xpath, './span', $container) as $span) {
        if ($span instanceof DOMElement && !hasClass($span, 'icon-glyph')) return $span;
    }
    return null;
}

function labelForField(DOMXPath $xpath, DOMElement $field): ?DOMElement
{
    $parent = $field->parentNode;
    while ($parent instanceof DOMElement && strtolower($parent->tagName) !== 'label') $parent = $parent->parentNode;
    if (!$parent instanceof DOMElement) return null;
    $label = firstNode($xpath, './span[1]', $parent);
    return $label instanceof DOMElement ? $label : null;
}

function replaceConfiguredNames(DOMXPath $xpath, string $oldSiteName, string $oldCompanyName, string $siteName, string $companyName): void
{
    $companyToken = '[[CONFIG_COMPANY_NAME]]';
    $replace = static function (string $value) use ($oldSiteName, $oldCompanyName, $siteName, $companyName, $companyToken): string {
        if ($oldCompanyName !== '') $value = str_replace($oldCompanyName, $companyToken, $value);
        if ($oldSiteName !== '') $value = str_replace($oldSiteName, $siteName, $value);
        return str_replace($companyToken, $companyName, $value);
    };
    foreach (nodeList($xpath, '//text()[not(ancestor::script) and not(ancestor::style) and not(ancestor::textarea)]') as $node) {
        $node->nodeValue = $replace((string) $node->nodeValue);
    }
    foreach (nodeList($xpath, '//*[@content or @aria-label or @title or @alt]') as $element) {
        if (!$element instanceof DOMElement) continue;
        foreach (['content', 'aria-label', 'title', 'alt'] as $attribute) {
            if ($element->hasAttribute($attribute)) $element->setAttribute($attribute, $replace($element->getAttribute($attribute)));
        }
    }
}

function renderPage(string $file, string $root, array $config): string
{
    $source = file_get_contents($file);
    if ($source === false) fail('Unable to read ' . $file);
    $dom = new DOMDocument('1.0', 'UTF-8');
    $dom->preserveWhiteSpace = true;
    $dom->formatOutput = false;
    $previous = libxml_use_internal_errors(true);
    $loaded = $dom->loadHTML('<?xml encoding="UTF-8">' . $source, LIBXML_HTML_NODEFDTD);
    libxml_clear_errors();
    libxml_use_internal_errors($previous);
    if (!$loaded) fail('Unable to parse ' . $file);
    foreach (iterator_to_array($dom->childNodes) as $child) {
        if ($child->nodeType === XML_PI_NODE) $dom->removeChild($child);
    }
    $xpath = new DOMXPath($dom);
    $brand = $config['brand'];
    $contact = $config['contact'];
    $navigation = $config['navigation'];
    $forms = $config['forms'];
    $footer = $config['footer'];
    $ui = $config['ui'];
    $routes = [];
    foreach ($navigation['routes'] as $route => $destination) $routes[normalizeRoute((string) $route)] = (string) $destination;

    $relativeFile = str_replace('\\', '/', substr($file, strlen($root) + 1));
    $relativeDirectory = dirname($relativeFile);
    $pageDepth = $relativeDirectory === '.' ? 0 : substr_count($relativeDirectory, '/') + 1;
    $configScriptSrc = str_repeat('../', $pageDepth) . 'config/config.js';
    foreach (nodeList($xpath, "//script[contains(@src, 'config.js')]") as $script) {
        if ($script instanceof DOMElement) $script->setAttribute('src', $configScriptSrc);
    }

    $siteNode = firstNode($xpath, "//*[" . classQuery('brand-copy') . "]/strong[1]");
    $oldSiteName = $siteNode !== null ? trim($siteNode->textContent) : '';
    $footerCompanyLine = firstNode($xpath, "//*[" . classQuery('footer-bottom') . "]/p[1]");
    $oldCompanyName = $footerCompanyLine !== null ? trim(explode('·', $footerCompanyLine->textContent)[0]) : '';
    replaceConfiguredNames($xpath, $oldSiteName, $oldCompanyName, $brand['siteName'], $brand['companyName']);

    foreach (nodeList($xpath, "//*[" . classQuery('brand-mark') . "]") as $node) setText($node, $brand['shortMark']);
    foreach (nodeList($xpath, "//*[" . classQuery('brand-copy') . "]/strong") as $node) setText($node, $brand['siteName']);
    foreach (nodeList($xpath, "//*[" . classQuery('brand-copy') . "]/small") as $node) setText($node, $brand['tagline']);
    foreach (nodeList($xpath, "//a[" . classQuery('brand') . "]") as $node) {
        if ($node instanceof DOMElement) $node->setAttribute('aria-label', $brand['siteName'] . ' home');
    }

    $pageRoute = routeForFile($file, $root);
    $destination = $routes[$pageRoute] ?? ($pageRoute === '/' ? '/' : $pageRoute . '/');
    $canonical = firstNode($xpath, "//link[@rel='canonical']");
    if ($canonical instanceof DOMElement) $canonical->setAttribute('href', absoluteSiteUrl($contact['website'], $destination));
    $socialImage = firstNode($xpath, "//meta[@property='og:image']");
    if ($socialImage instanceof DOMElement) $socialImage->setAttribute('content', rtrim($contact['website'], '/') . '/og.png');

    foreach (nodeList($xpath, '//a[@href]') as $anchor) {
        if (!$anchor instanceof DOMElement) continue;
        $route = routeForHref($anchor->getAttribute('href'), $file, $root, $routes);
        if ($route !== null && isset($routes[$route])) $anchor->setAttribute('href', $routes[$route] . hrefSuffix($anchor->getAttribute('href')));
    }

    $primaryLabelByRoute = [];
    foreach (array_merge($navigation['primary'], $navigation['legal']) as $item) {
        $primaryLabelByRoute[normalizeRoute((string) $item['route'])] = (string) $item['label'];
    }
    $serviceLabelByRoute = [];
    foreach ($navigation['serviceLinks'] as $item) {
        $serviceLabelByRoute[normalizeRoute((string) $item['route'])] = (string) $item['label'];
    }
    $navigationGroups = [
      [$primaryLabelByRoute, [
        "//nav[" . classQuery('desktop-nav') . "]//a",
        "//*[@id='mobile-menu']/nav/a",
        "//*[" . classQuery('footer-column') . " and not(" . classQuery('footer-services') . ") and not(" . classQuery('footer-contact') . ")]//a",
      ]],
      [$serviceLabelByRoute, [
        "//*[" . classQuery('dropdown-panel') . "]//a",
        "//*[" . classQuery('mobile-services') . "]//a",
        "//*[" . classQuery('footer-services') . "]//a",
      ]],
      [array_merge($primaryLabelByRoute, $serviceLabelByRoute), [
        "//nav[" . classQuery('breadcrumbs') . "]//a",
      ]],
    ];
    foreach ($navigationGroups as [$labelByRoute, $queries]) {
        foreach ($queries as $query) {
            foreach (nodeList($xpath, $query) as $anchor) {
                if (!$anchor instanceof DOMElement) continue;
                $route = routeForHref($anchor->getAttribute('href'), $file, $root, $routes);
                if ($route !== null && isset($labelByRoute[$route])) setLeadingText($anchor, $labelByRoute[$route]);
            }
        }
    }
    $servicesLabel = $primaryLabelByRoute['/services'] ?? 'Services';
    foreach (nodeList($xpath, "//*[" . classQuery('mobile-services-toggle') . "]") as $node) {
        if ($node instanceof DOMElement) setLeadingText($node, $servicesLabel);
    }

    foreach (nodeList($xpath, "//a[starts-with(@href, 'mailto:')]") as $link) {
        if (!$link instanceof DOMElement) continue;
        $link->setAttribute('href', 'mailto:' . $contact['email']);
        setEmailLink($link, $contact['email']);
    }
    foreach (nodeList($xpath, "//*[" . classQuery('footer-brand') . "]/p[not(" . classQuery('service-area') . ")]") as $node) setText($node, $footer['text']);
    foreach (nodeList($xpath, "//*[" . classQuery('service-area') . "]") as $node) setText($node, $footer['serviceArea']);
    foreach (nodeList($xpath, "//*[" . classQuery('footer-column') . " and not(" . classQuery('footer-services') . ") and not(" . classQuery('footer-contact') . ")]/h2") as $node) setText($node, $footer['exploreTitle']);
    foreach (nodeList($xpath, "//*[" . classQuery('footer-services') . "]/h2") as $node) setText($node, $footer['servicesTitle']);
    foreach (nodeList($xpath, "//*[" . classQuery('footer-contact') . "]/h2") as $node) setText($node, $footer['contactTitle']);
    foreach (nodeList($xpath, "//*[" . classQuery('footer-contact') . "]/p/span[not(" . classQuery('icon-glyph') . ")]") as $node) setText($node, $contact['address']);
    foreach (nodeList($xpath, '//*[@data-config-address]') as $node) setText($node, $contact['address']);
    foreach (nodeList($xpath, '//*[@data-config-website-label]') as $node) setText($node, $contact['websiteLabel']);
    foreach (nodeList($xpath, "//*[" . classQuery('footer-contact') . " or " . classQuery('contact-info-card') . "]//a[starts-with(@href, 'http')]") as $link) {
        if (!$link instanceof DOMElement) continue;
        $link->setAttribute('href', $contact['website']);
        setLeadingText($link, $contact['websiteLabel']);
    }

    foreach (nodeList($xpath, "//*[" . classQuery('contact-info-card') . "]") as $card) {
        if (!$card instanceof DOMElement) continue;
        $label = directLabelSpan($xpath, $card);
        $mail = firstNode($xpath, ".//a[starts-with(@href, 'mailto:')]", $card);
        $website = firstNode($xpath, ".//a[starts-with(@href, 'http')]", $card);
        if ($mail !== null) {
            if ($label !== null) setText($label, $contact['emailLabel']);
        } elseif ($website !== null) {
            if ($label !== null) setText($label, $contact['websiteTitle']);
        } else {
            if ($label !== null) setText($label, $contact['addressLabel']);
            $address = firstNode($xpath, './p[1]', $card);
            $companyId = firstNode($xpath, './small[1]', $card);
            if ($address !== null) setText($address, $contact['address']);
            if ($companyId !== null) setText($companyId, $contact['companyIdLabel'] . ' ' . $contact['companyId']);
        }
    }

    $footerLines = nodeList($xpath, "//*[" . classQuery('footer-bottom') . "]/p");
    if (isset($footerLines[0])) setText($footerLines[0], $brand['companyName'] . ' · ' . $contact['address'] . ' · ' . $contact['companyIdLabel'] . ' ' . $contact['companyId']);
    if (isset($footerLines[1])) setText($footerLines[1], '© ' . date('Y') . ' ' . $brand['siteName'] . '. ' . $footer['copyright']);

    foreach (nodeList($xpath, '//*[@data-collaboration-title]') as $node) setText($node, $config['collaboration']['title']);
    foreach (nodeList($xpath, '//*[@data-collaboration-text]') as $node) setText($node, $config['collaboration']['text']);

    $variables = ['{email}' => $contact['email'], '{siteName}' => $brand['siteName']];
    $template = static fn(string $value): string => strtr($value, $variables);
    foreach (nodeList($xpath, '//form[@data-contact-form]') as $form) {
        if (!$form instanceof DOMElement) continue;
        $form->setAttribute('action', $forms['endpoint']);
        $fields = [
            'name' => [$forms['fields']['nameLabel'], $forms['fields']['namePlaceholder']],
            'email' => [$forms['fields']['emailLabel'], $forms['fields']['emailPlaceholder']],
            'company' => [$forms['fields']['companyLabel'], $forms['fields']['companyPlaceholder']],
            'inquiryType' => [$forms['fields']['inquiryLabel'], ''],
            'message' => [$forms['fields']['messageLabel'], $forms['fields']['messagePlaceholder']],
        ];
        foreach ($fields as $name => [$labelText, $placeholder]) {
            $field = firstNode($xpath, ".//*[@name='{$name}']", $form);
            if (!$field instanceof DOMElement) continue;
            $label = labelForField($xpath, $field);
            if ($label !== null) setText($label, $labelText);
            if ($placeholder !== '') $field->setAttribute('placeholder', $placeholder);
        }
        $select = firstNode($xpath, ".//select[@name='inquiryType']", $form);
        if ($select instanceof DOMElement) {
            $selectedValue = '';
            $selectedOption = firstNode($xpath, ".//option[@selected][1]", $select);
            if ($selectedOption instanceof DOMElement) $selectedValue = $selectedOption->getAttribute('value');
            if (!in_array($selectedValue, $forms['serviceTypes'], true)) {
                $pageHeading = firstNode($xpath, '//main//h1[1]');
                $pageService = $pageHeading !== null ? trim($pageHeading->textContent) : '';
                if (in_array($pageService, $forms['serviceTypes'], true)) $selectedValue = $pageService;
            }
            while ($select->firstChild !== null) $select->removeChild($select->firstChild);
            $placeholder = $dom->createElement('option');
            $placeholder->setAttribute('value', '');
            $placeholder->setAttribute('disabled', '');
            if (!in_array($selectedValue, array_merge($forms['serviceTypes'], $forms['inquiryTypes']), true)) {
                $placeholder->setAttribute('selected', '');
            }
            setText($placeholder, $forms['selectPlaceholder']);
            $select->appendChild($placeholder);
            if (in_array($selectedValue, $forms['serviceTypes'], true)) {
                $serviceOption = $dom->createElement('option');
                $serviceOption->setAttribute('value', $selectedValue);
                $serviceOption->setAttribute('selected', '');
                setText($serviceOption, $selectedValue);
                $select->appendChild($serviceOption);
            }
            foreach ($forms['inquiryTypes'] as $type) {
                $option = $dom->createElement('option');
                $option->setAttribute('value', $type);
                if ($type === $selectedValue) $option->setAttribute('selected', '');
                setText($option, $type);
                $select->appendChild($option);
            }
        }
        $consent = firstNode($xpath, ".//*[" . classQuery('consent') . "]/span", $form);
        if ($consent !== null) setText($consent, $template($forms['consentLabel']));
        $note = firstNode($xpath, ".//*[" . classQuery('form-note') . "]", $form);
        if ($note !== null) setText($note, $template($forms['formNote']));
        $submit = firstNode($xpath, ".//button[@type='submit']", $form);
        if ($submit !== null) setText($submit, $forms['submitLabel']);
    }

    foreach (nodeList($xpath, '//*[@data-success-modal]') as $modal) {
        if (!$modal instanceof DOMElement) continue;
        $title = firstNode($xpath, './/h2[1]', $modal);
        $message = firstNode($xpath, './/h2[1]/following-sibling::p[1]', $modal);
        $delivered = firstNode($xpath, ".//*[" . classQuery('modal-email') . "]", $modal);
        $eyebrow = firstNode($xpath, ".//*[" . classQuery('eyebrow') . "]", $modal);
        $close = firstNode($xpath, ".//*[" . classQuery('modal-close') . "]", $modal);
        $done = firstNode($xpath, ".//button[@data-modal-close and " . classQuery('button') . "]", $modal);
        if ($title !== null) setText($title, $forms['successTitle']);
        if ($message !== null) setText($message, $template($forms['successIntro']) . ' ' . $forms['successMessage']);
        if ($delivered !== null) setText($delivered, $template($forms['successDelivery']));
        if ($eyebrow !== null) setText($eyebrow, $forms['modalEyebrow']);
        if ($close instanceof DOMElement) $close->setAttribute('aria-label', $forms['modalCloseLabel']);
        if ($done !== null) setText($done, $forms['modalDoneLabel']);
    }

    foreach (nodeList($xpath, "//*[" . classQuery('header-contact') . "]//small | //*[" . classQuery('mobile-contact') . "]/span[1]") as $node) setText($node, $ui['emailSupportLabel']);
    foreach (nodeList($xpath, "//*[" . classQuery('mobile-contact') . "]/a[" . classQuery('button') . "]") as $node) setText($node, $ui['requestSupportLabel']);
    foreach (nodeList($xpath, "//*[" . classQuery('footer-contact') . "]/a[" . classQuery('button') . "]") as $node) setText($node, $ui['sendRequestLabel']);
    foreach (nodeList($xpath, "//*[" . classQuery('service-contact-line') . "]/span[not(" . classQuery('icon-glyph') . ")]") as $node) setText($node, $ui['questionsBeforeLabel']);
    foreach (nodeList($xpath, '//*[@data-menu-toggle]') as $node) {
        if ($node instanceof DOMElement) $node->setAttribute('aria-label', $ui['openMenuLabel']);
    }

    foreach (iterator_to_array($dom->childNodes) as $child) {
        if ($child->nodeType === XML_COMMENT_NODE && str_contains((string) $child->nodeValue, 'Generated from ')) {
            $dom->removeChild($child);
        }
    }
    if ($dom->documentElement !== null) $dom->insertBefore($dom->createComment(GENERATED_NOTICE), $dom->documentElement);

    $output = $dom->saveHTML();
    if ($output === false) fail('Unable to serialize ' . $file);
    $output = str_replace("\r\n", "\n", $output);
    return str_replace('--><html', "-->\n<html", $output);
}

$root = dirname(__DIR__);
$config = loadConfig($root . '/config/config.js');
$checkOnly = in_array('--check', $argv, true);
$iterator = new RecursiveIteratorIterator(new RecursiveDirectoryIterator($root, FilesystemIterator::SKIP_DOTS));
$files = [];
foreach ($iterator as $item) {
    if (!$item->isFile() || $item->getFilename() !== 'index.html') continue;
    if (str_contains(str_replace('\\', '/', $item->getPathname()), '/.git/')) continue;
    $files[] = $item->getPathname();
}
sort($files);
$changed = [];
foreach ($files as $file) {
    $current = str_replace("\r\n", "\n", (string) file_get_contents($file));
    $rendered = renderPage($file, $root, $config);
    if ($rendered === $current) continue;
    $changed[] = str_replace('\\', '/', substr($file, strlen($root) + 1));
    if (!$checkOnly && file_put_contents($file, $rendered) === false) fail('Unable to write ' . $file);
}

if ($checkOnly && $changed !== []) {
    fwrite(STDERR, "Generated HTML is out of sync with config/config.js:\n- " . implode("\n- ", $changed) . PHP_EOL);
    exit(1);
}

echo $checkOnly
    ? 'All ' . count($files) . " HTML pages are synchronized with config/config.js.\n"
    : 'Synchronized ' . count($files) . ' HTML pages; updated ' . count($changed) . ".\n";
