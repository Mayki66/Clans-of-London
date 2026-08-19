import asyncio
import json
import os
import re
from playwright.async_api import async_playwright

async def scrape():
    os.makedirs('scratch', exist_ok=True)
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        context = await browser.new_context(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        )
        page = await context.new_page()
        
        print("Navigating to https://vtm.paradoxwikis.com/CoL_cardlist ...")
        await page.goto("https://vtm.paradoxwikis.com/CoL_cardlist", timeout=60000, wait_until="domcontentloaded")
        
        print("Waiting for cloudflare or table...")
        # Wait up to 30s for the table to appear
        try:
            await page.wait_for_selector("table.wikitable, table.sortable, table", timeout=30000)
            print("Table found on page!")
        except Exception as e:
            print("Timeout waiting for table selector, continuing to inspect content:", e)
        
        # Give JS a moment to execute
        await page.wait_for_timeout(5000)
        
        content = await page.content()
        with open("scratch/scraped_page.html", "w", encoding="utf-8") as f:
            f.write(content)
        print("Saved raw HTML to scratch/scraped_page.html (length: ", len(content), ")")
        
        # Evaluate all tables on page
        tables_data = await page.evaluate('''() => {
            const results = [];
            const tables = document.querySelectorAll('table');
            tables.forEach((table, tIdx) => {
                const rows = [];
                const trs = table.querySelectorAll('tr');
                trs.forEach((tr) => {
                    const cells = [];
                    const ths_tds = tr.querySelectorAll('th, td');
                    ths_tds.forEach((cell) => {
                        cells.push({
                            text: cell.innerText.trim(),
                            html: cell.innerHTML.trim()
                        });
                    });
                    if (cells.length > 0) rows.push(cells);
                });
                if (rows.length > 0) {
                    results.push({
                        tableIndex: tIdx,
                        rowCount: rows.length,
                        rows: rows
                    });
                }
            });
            return results;
        }''')
        
        print(f"Found {len(tables_data)} tables on page.")
        with open("scratch/tables_data.json", "w", encoding="utf-8") as f:
            json.dump(tables_data, f, indent=2, ensure_ascii=False)
            
        await browser.close()
        print("Scraping finished!")

if __name__ == "__main__":
    asyncio.run(scrape())
