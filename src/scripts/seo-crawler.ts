import { chromium } from '@playwright/test';
import { SEOCrawler } from '../utils/SEOCrawler';
import dotenv from 'dotenv';

dotenv.config();

async function main(): Promise<void> {
    console.log('🚀 Starting SEO Crawler...\n');

    const args = process.argv.slice(2);

    const getArg = (name: string, defaultValue: string): string => {
        const arg = args.find(a => a.startsWith(`--${name}=`));
        return arg?.split('=')[1] ?? defaultValue;
    };

    const baseUrl = process.env.CRAWLER_BASE_URL ?? 'https://yourwebsite.com';

    const startUrl = getArg('url', baseUrl);
    const maxPages = parseInt(getArg('max-pages', '150'), 10);
    const outputDir = getArg('output', './seo-reports');
    const outputFormat = getArg('format', 'both') as 'json' | 'csv' | 'both';

    const browser = await chromium.launch({ headless: true });

    try {
        const crawler = new SEOCrawler(browser, {
            startUrl,
            maxPages,
            outputDir,
            outputFormat,
            sameOriginOnly: true,
            excludePaths: ['/api', '/admin', '/login', '/register', '/cart', '/checkout'],
            timeout: 30000,
        });

        await crawler.crawl();

        console.log('\n✨ SEO audit completed successfully!');
        process.exit(0);

    } catch (error) {
        console.error('❌ Error running SEO crawler:', error);
        process.exit(1);

    } finally {
        await browser.close();
    }
}

if (require.main === module) {
    void main();
}
