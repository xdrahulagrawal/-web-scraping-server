import express from "express";
import axios from "axios";
import puppeteer from "puppeteer";

const app = express();

app.get('/scrape', async (req, res) => {
    try {
        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        await page.goto('https://www.w3schools.com/js/default.asp');
        await page.waitForSelector('h2');
        const scrapedData = await scrapeContent(page);
        await browser.close();
        res.json(scrapedData);
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

async function scrapeContent(page) {
    try {
        const scrapedData = [];
        const pElementsInitial = await page.evaluate(() => {
            const pTags = Array.from(document.querySelectorAll('h2'));
            return pTags.map(p => p.textContent);
        });

        scrapedData.push(...pElementsInitial);
        return scrapedData;
    } catch (error) {
        console.error('An error occurred during scraping:', error);
        return [];
    }
}

const PORT = 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});


