from playwright.sync_api import sync_playwright
import sys

with sync_playwright() as p:
    browser = p.chromium.launch(headless=True)
    page = browser.new_page(viewport={'width': 1280, 'height': 800})

    errors = []
    page.on('console', lambda msg: errors.append({'type': msg.type, 'text': msg.text}))
    page.on('pageerror', lambda err: errors.append({'type': 'pageerror', 'text': str(err)}))

    try:
        page.goto('http://localhost:5173', timeout=10000)
        page.wait_for_timeout(3000)
        
        print('PAGE LOADED')
        print('URL:', page.url)
        print('TITLE:', page.title())

        body_text = page.inner_text('body')
        print('BODY TEXT (first 200):', body_text[:200])

        page.screenshot(path='screenshot.png', full_page=False)
        print('SCREENSHOT SAVED')

    except Exception as e:
        print('ERROR:', str(e))

    if errors:
        print('\nCONSOLE ERRORS:')
        for err in errors[:10]:
            print('  [{}] {}'.format(err['type'], err['text']))

    browser.close()
