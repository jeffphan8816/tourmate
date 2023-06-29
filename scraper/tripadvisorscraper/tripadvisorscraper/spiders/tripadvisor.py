import scrapy
from scrapy.exceptions import ScrapyDeprecationWarning
from scrapy_playwright.page import PageMethod
from scrapy_splash import SplashRequest
import warnings
warnings.filterwarnings("ignore", category=ScrapyDeprecationWarning)


class TripadvisorSpider(scrapy.Spider):
    name = "tripadvisor"
    allowed_domains = ["www.tripadvisor.com"]
    start_urls = ["https://www.tripadvisor.com/Attractions-g293925-Activities-oa0-Ho_Chi_Minh_City.html"]
    # def start_requests(self):
    #     urls = ["https://www.tripadvisor.com/Attractions-g293925-Activities-oa0-Ho_Chi_Minh_City.html"]
    #     for url in urls:
    #         yield scrapy.Request(url=url, callback=self.parse)

    async def errback(self, failure):
        page = failure.request.meta["playwright_page"]
        await page.close()
    def parse(self, response):
        content_length = int(response.headers.get('Content-Length', 0))
        self.log(f"Data usage for {response.url}: {content_length} bytes")
        attractions = response.css("header[style='flex-direction:row']")
        print(len(attractions))
        for attraction in attractions:
            link = attraction.css("a::attr(href)").get()
            yield response.follow(
                link,
                callback=self.parse_attraction,
                # meta={
                #     "playwright": True,
                #     "playwright_include_page": True,
                #     'playwright_page_methods': [PageMethod('wait_for_selector', 'button[aria-label="Open Hours"]')],
                #     'errback': self.errback,
                # },
            )

        # next_page_url = response.css('a[data-smoke-attr="pagination-next-arrow"]::attr(href)').get()
        # yield response.follow(next_page_url, callback=self.parse)

    def parse_attraction(self, response):
        # page = response.meta["playwright_page"]
        # await page.close()
        # await page.click('button[aria-label="Open Hours"]')

        content_length = int(response.headers.get('Content-Length', 0))
        self.log(f"Data usage for {response.url}: {content_length} bytes")
        title = response.css("h1[data-automation='mainH1']::text").get()
        duration = response.css('div[class="biGQs _P fiohW ncFvv fOtGX"]+div._c::text').get()
        category = response.css("div[style='line-break:normal;cursor:auto']::text").get()
        url = response.url
        description = response.css('div._d.MJ > div > div.fIrGe._T.bgMZj > div::text').get()
        ratings = response.css('span[class="LEuOZ f"]::text').get()
        numberofreviews = response.css('span.KAVFZ::text').get()
        address = response.css('div.wgNTK>div>button>span::text').get()
        # splash:evaljs(javascript)
        # div_with_text = response.xpath('//div[contains(text(), "Open hours")]')
        # if div_with_text:
        #     other_divs = div_with_text.xpath('./following-sibling::div')
        #     for div in other_divs:
        #         print("i'm here")
        # print(div_with_text)
        opendays = response.css("div.XZfLa>span::text").getall()
        opentimes = response.css("div.XZfLa>div>div::text").getall()
        #     .xpath("./div[2]/div/div/div:nth-child(n+2)/div/div/text").getall()
        openhours = dict(zip(opendays, opentimes))
        yield {
            'Title': title,
            'Duration': duration,
            'Category': category,
            'URL': url,
            'Description': description,
            'Ratings': ratings,
            'Number of Reviews': numberofreviews,
            'Address': address,
            'Open Hours': openhours,
        }



