# tests/e2e_browser_test.py
"""End‑to‑end browser test for CampusFind using Playwright.

The test covers two main user journeys:
1. **Student flow** – registers a temporary student account, logs in, searches for items, reports a found item, views matches, claims an item and verifies the claim appears in "My Claims".
2. **Admin flow** – logs in with the seeded admin credentials, opens the admin dashboard, checks the analytics page and reviews a pending claim.

Run with:
```bash
pytest -s backend/tests/e2e_browser_test.py
```
"""

import asyncio
import uuid
from pathlib import Path

# pyrefly: ignore [missing-import]
import pytest
from playwright.async_api import async_playwright, Page

BASE_URL = "http://localhost:5173"
ADMIN_EMAIL = "admin@campusfind.edu"
ADMIN_PASSWORD = "admin123"

SELECTOR_REGISTER_LINK = "text=Register"
SELECTOR_LOGIN_LINK = "text=Login"
SELECTOR_EMAIL_INPUT = "input[type='email']"
SELECTOR_PASSWORD_INPUT = "input[type='password']"
SELECTOR_NAME_INPUT = "input[name=\"name\"]"
SELECTOR_SUBMIT_BUTTON = "button[type=\"submit\"]"
SELECTOR_NAV_DASHBOARD = "text=Dashboard"
SELECTOR_NAV_SEARCH = "text=Search"
SELECTOR_NAV_MY_CLAIMS = "text=My Claims"
SELECTOR_NAV_ADMIN_DASH = "text=Admin Dashboard"
SELECTOR_REPORT_ITEM_BUTTON = "text=Report Item"
SELECTOR_ITEM_NAME_INPUT = "input[name=\"item_name\"]"
SELECTOR_ITEM_CATEGORY_SELECT = "select[name=\"category\"]"
SELECTOR_ITEM_LOCATION_INPUT = "input[name=\"location\"]"
SELECTOR_ITEM_DESCRIPTION_TEXTAREA = "textarea[name=\"description\"]"
SELECTOR_SUBMIT_REPORT = "button:has-text(\"Report\")"
SELECTOR_MATCHES_TAB = "text=Matches"
SELECTOR_CLAIM_BUTTON = "button:has-text(\"Claim\")"
SELECTOR_ADMIN_ANALYTICS_TAB = "text=Analytics"
SELECTOR_ADMIN_CLAIMS_TAB = "text=Claims"
SELECTOR_APPROVE_BUTTON = "button:has-text(\"Approve\")"
SELECTOR_REJECT_BUTTON = "button:has-text(\"Reject\")"

async def fill_login(page: Page, email: str, password: str):
    await page.goto(f"{BASE_URL}/login")
    await page.wait_for_load_state('domcontentloaded')
    await page.wait_for_selector(SELECTOR_EMAIL_INPUT)
    await page.fill(SELECTOR_EMAIL_INPUT, email)
    await page.wait_for_selector(SELECTOR_PASSWORD_INPUT)
    await page.fill(SELECTOR_PASSWORD_INPUT, password)
    await page.click(SELECTOR_SUBMIT_BUTTON)
    await page.wait_for_url("**/dashboard**")

async def fill_register(page: Page, name: str, email: str, password: str):
    await page.goto(f"{BASE_URL}/register")
    await page.wait_for_selector(SELECTOR_NAME_INPUT)
    await page.fill(SELECTOR_NAME_INPUT, name)
    await page.wait_for_selector(SELECTOR_EMAIL_INPUT)
    await page.fill(SELECTOR_EMAIL_INPUT, email)
    await page.wait_for_selector(SELECTOR_PASSWORD_INPUT)
    await page.fill(SELECTOR_PASSWORD_INPUT, password)
    await page.click(SELECTOR_SUBMIT_BUTTON)
    await page.wait_for_url("**/dashboard**")

async def report_item(page: Page, name: str, category: str, location: str, description: str):
    await page.click(SELECTOR_REPORT_ITEM_BUTTON)
    await page.fill(SELECTOR_ITEM_NAME_INPUT, name)
    await page.select_option(SELECTOR_ITEM_CATEGORY_SELECT, category)
    await page.fill(SELECTOR_ITEM_LOCATION_INPUT, location)
    await page.fill(SELECTOR_ITEM_DESCRIPTION_TEXTAREA, description)
    await page.click(SELECTOR_SUBMIT_REPORT)
    await page.wait_for_timeout(2000)

async def claim_first_match(page: Page):
    await page.click(SELECTOR_MATCHES_TAB)
    await page.wait_for_selector(SELECTOR_CLAIM_BUTTON)
    await page.click(SELECTOR_CLAIM_BUTTON)
    await page.click("button:has-text(\"Confirm\")")
    await page.wait_for_timeout(1000)

@pytest.mark.asyncio
async def test_student_flow():
    async with async_playwright() as p:
        await asyncio.sleep(1)
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()
        uid = uuid.uuid4().hex[:8]
        name = f"Student {uid}"
        email = f"{uid}@example.com"
        password = "Passw0rd!"
        await fill_register(page, name, email, password)
        await report_item(
            page,
            name="Lost Wallet",
            category="Personal Items",
            location="Library",
            description="Black leather wallet found near the entrance.",
        )
        await claim_first_match(page)
        await page.click(SELECTOR_NAV_MY_CLAIMS)
        await page.wait_for_selector("text=Lost Wallet")
        assert await page.is_visible("text=Lost Wallet")
        await context.close()
        await browser.close()

@pytest.mark.asyncio
async def test_admin_flow():
    async with async_playwright() as p:
        await asyncio.sleep(1)
        browser = await p.chromium.launch(headless=False)
        context = await browser.new_context()
        page = await context.new_page()
        await fill_login(page, ADMIN_EMAIL, ADMIN_PASSWORD)
        await page.click(SELECTOR_NAV_ADMIN_DASH)
        await page.wait_for_url("**/admin**")
        await page.click(SELECTOR_ADMIN_ANALYTICS_TAB)
        await page.wait_for_selector("text=Analytics Overview")
        await page.click(SELECTOR_ADMIN_CLAIMS_TAB)
        await page.wait_for_selector(SELECTOR_APPROVE_BUTTON)
        await page.click(SELECTOR_APPROVE_BUTTON)
        await page.wait_for_selector("text=Claim approved")
        await context.close()
        await browser.close()

if __name__ == "__main__":
    asyncio.run(test_student_flow())
    asyncio.run(test_admin_flow())
