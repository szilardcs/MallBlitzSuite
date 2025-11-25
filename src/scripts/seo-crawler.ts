import {chromium} from '@playwright/test';
import {SEOCrawler} from '../utils/SEOCrawler';
import dotenv from 'dotenv';

dotenv.config();

async function main() {
    console.log('🚀 Starting SEO Crawler...\n');

    // Parse command line arguments
    const args = process.argv.slice(2);
    const getArg = (name: string, defaultValue: string) => {
        const arg = args.find(a => a.startsWith(`--${name}=`));
        return arg ? arg.split('=')[1] : defaultValue;
    };

    const startUrl = getArg('url', process.env.CRAWLER_BASE_URL || 'https://yourwebsite.com');
    const maxPages = parseInt(getArg('max-pages', '150'));
    const outputDir = getArg('output', './seo-reports');
    const outputFormat = getArg('format', 'both') as 'json' | 'csv' | 'both';

    // Launch browser
    const browser = await chromium.launch({headless: true});

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

// Run if called directly
if (require.main === module) {
    main();
}