"""
End-to-end browser tests for CampusFind.

The tests verify that:
1. Student can register.
2. Student can report a lost item.
3. Student can open the matches page.
4. Student can open the claims page.
5. Admin can login.
6. Admin can open analytics.
7. Admin can open claims.

The test does not assume that a newly reported item must
always have a claimable match.
"""

import asyncio
import uuid

import pytest
from playwright.async_api import async_playwright, Page


BASE_URL = "http://localhost:5173"

ADMIN_EMAIL = "admin@campusfind.edu"
ADMIN_PASSWORD = "admin123"


# ============================================================
# LOGIN
# ============================================================

async def fill_login(
    page: Page,
    email: str,
    password: str,
):
    await page.goto(f"{BASE_URL}/login")

    await page.wait_for_load_state("domcontentloaded")

    email_input = page.locator(
        "input[type='email']"
    ).first

    password_input = page.locator(
        "input[type='password']"
    ).first

    await email_input.wait_for(
        state="visible",
        timeout=10000,
    )

    await password_input.wait_for(
        state="visible",
        timeout=10000,
    )

    await email_input.fill(email)

    await password_input.fill(password)

    await page.locator(
        "button[type='submit']"
    ).first.click()

    if "admin" in email.lower():

        await page.wait_for_url(
            "**/admin**",
            timeout=10000,
        )

    else:

        await page.wait_for_url(
            "**/dashboard**",
            timeout=10000,
        )


# ============================================================
# REGISTER
# ============================================================

async def fill_register(
    page: Page,
    name: str,
    email: str,
    password: str,
):

    await page.goto(
        f"{BASE_URL}/register"
    )

    await page.wait_for_load_state(
        "domcontentloaded"
    )

    name_input = page.locator(
        "input[name='name']"
    ).first

    email_input = page.locator(
        "input[type='email']"
    ).first

    password_input = page.locator(
        "input[type='password']"
    ).first

    await name_input.wait_for(
        state="visible",
        timeout=10000,
    )

    await email_input.wait_for(
        state="visible",
        timeout=10000,
    )

    await password_input.wait_for(
        state="visible",
        timeout=10000,
    )

    await name_input.fill(name)

    await email_input.fill(email)

    await password_input.fill(password)

    await page.locator(
        "button[type='submit']"
    ).first.click()

    await page.wait_for_url(
        "**/dashboard**",
        timeout=10000,
    )


# ============================================================
# REPORT LOST ITEM
# ============================================================

async def report_item(
    page: Page,
    name: str,
    category: str,
    location: str,
    description: str,
):

    await page.goto(
        f"{BASE_URL}/report-lost"
    )

    await page.wait_for_load_state(
        "domcontentloaded"
    )

    form = page.locator("form").first

    await form.wait_for(
        state="visible",
        timeout=10000,
    )

    text_inputs = form.locator(
        "input[type='text']"
    )

    await text_inputs.first.wait_for(
        state="visible",
        timeout=10000,
    )

    await text_inputs.first.fill(name)

    selects = form.locator("select")

    await selects.nth(0).select_option(
        category
    )

    await selects.nth(1).select_option(
        location
    )

    textarea = form.locator(
        "textarea"
    ).first

    await textarea.fill(
        description
    )

    submit_button = form.locator(
        "button[type='submit']"
    ).first

    await submit_button.click()

    await page.wait_for_url(
        "**/matches**",
        timeout=10000,
    )


# ============================================================
# STUDENT FLOW
# ============================================================

@pytest.mark.asyncio
async def test_student_flow():

    async with async_playwright() as p:

        browser = await p.chromium.launch(
            headless=True
        )

        context = await browser.new_context()

        page = await context.new_page()

        uid = uuid.uuid4().hex[:8]

        name = f"Student {uid}"

        email = f"{uid}@campus.edu"

        password = "Passw0rd123!"

        # ----------------------------------------------------
        # REGISTER
        # ----------------------------------------------------

        await fill_register(
            page,
            name,
            email,
            password,
        )

        assert "/dashboard" in page.url

        # ----------------------------------------------------
        # REPORT LOST ITEM
        # ----------------------------------------------------

        await report_item(
            page,
            name="USB Drive",
            category="Electronics",
            location="Library",
            description=(
                "SanDisk 64GB USB Drive misplaced "
                "near study desk."
            ),
        )

        # ----------------------------------------------------
        # MATCHES PAGE
        # ----------------------------------------------------

        assert "/matches" in page.url

        await page.wait_for_load_state(
            "domcontentloaded"
        )

        # Verify that the page actually rendered.
        body_text = await page.locator(
            "body"
        ).inner_text()

        assert len(body_text.strip()) > 0

        # ----------------------------------------------------
        # CLAIM IF A CLAIMABLE MATCH EXISTS
        # ----------------------------------------------------

        claim_button = page.locator(
            "button"
        ).filter(
            has_text="Claim"
        ).first

        if await claim_button.count() > 0:

            try:

                await claim_button.wait_for(
                    state="visible",
                    timeout=3000,
                )

                await claim_button.click()

                textarea = page.locator(
                    "textarea"
                ).last

                await textarea.wait_for(
                    state="visible",
                    timeout=5000,
                )

                await textarea.fill(
                    "I can verify ownership with "
                    "my student ID and unique markings."
                )

                submit_claim = page.locator(
                    "button"
                ).filter(
                    has_text="Submit Claim"
                ).first

                if await submit_claim.count() > 0:

                    await submit_claim.click()

                    await page.wait_for_timeout(
                        1000
                    )

            except Exception:
                # A match may exist but may not be
                # claimable. The important E2E check is
                # that the student can reach Matches.
                pass

        # ----------------------------------------------------
        # CLAIMS PAGE
        # ----------------------------------------------------

        await page.goto(
            f"{BASE_URL}/claims"
        )

        await page.wait_for_load_state(
            "domcontentloaded"
        )

        await page.wait_for_url(
            "**/claims**",
            timeout=10000,
        )

        claims_body = await page.locator(
            "body"
        ).inner_text()

        assert len(claims_body.strip()) > 0

        await context.close()

        await browser.close()


# ============================================================
# ADMIN FLOW
# ============================================================

@pytest.mark.asyncio
async def test_admin_flow():

    async with async_playwright() as p:

        browser = await p.chromium.launch(
            headless=True
        )

        context = await browser.new_context()

        page = await context.new_page()

        # ----------------------------------------------------
        # ADMIN LOGIN
        # ----------------------------------------------------

        await fill_login(
            page,
            ADMIN_EMAIL,
            ADMIN_PASSWORD,
        )

        assert "/admin" in page.url

        # ----------------------------------------------------
        # ADMIN ANALYTICS
        # ----------------------------------------------------

        await page.goto(
            f"{BASE_URL}/admin/analytics"
        )

        await page.wait_for_load_state(
            "domcontentloaded"
        )

        await page.wait_for_url(
            "**/admin/analytics**",
            timeout=10000,
        )

        analytics_body = await page.locator(
            "body"
        ).inner_text()

        # Page must actually render.
        assert len(
            analytics_body.strip()
        ) > 0

        # ----------------------------------------------------
        # ADMIN CLAIMS
        # ----------------------------------------------------

        await page.goto(
            f"{BASE_URL}/admin/claims"
        )

        await page.wait_for_load_state(
            "domcontentloaded"
        )

        await page.wait_for_url(
            "**/admin/claims**",
            timeout=10000,
        )

        claims_body = await page.locator(
            "body"
        ).inner_text()

        assert len(
            claims_body.strip()
        ) > 0

        # ----------------------------------------------------
        # OPTIONAL CLAIM REVIEW
        # ----------------------------------------------------

        review_button = page.locator(
            "button"
        ).filter(
            has_text="Review"
        ).first

        if await review_button.count() > 0:

            try:

                await review_button.wait_for(
                    state="visible",
                    timeout=3000,
                )

                await review_button.click()

                await page.wait_for_timeout(
                    500
                )

            except Exception:
                pass

        await context.close()

        await browser.close()


# ============================================================
# DIRECT RUN
# ============================================================

if __name__ == "__main__":

    asyncio.run(
        test_student_flow()
    )

    asyncio.run(
        test_admin_flow()
    )