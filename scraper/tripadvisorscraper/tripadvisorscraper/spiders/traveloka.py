import scrapy

changeLocationButton = "h4[class='css-4rbku5 css-901oao css-bfa6kz r-1y8hqrq r-t1w4ow r-1b43r93 r-b88u0q r-1cwl3u0 r-fdjqy7']"
locationPopup = "div[class='css-1dbjc4n r-6koalj r-eqz5dr']"


class TravelokaSpider(scrapy.Spider):
    name = "traveloka"
    allowed_domains = ["traveloka.com"]
    start_urls = ["https://www.traveloka.com/en-au/activities"]

    def start_requests(self):
        urls = ["https://www.traveloka.com/en-au/activities"]
        for url in urls:
            yield scrapy.Request(url, meta=dict(
            playwright = True,
            playwright_include_page = True, 
            errback=self.errback,
        ))

    async def parse(self, response):
        page = response.meta["playwright_page"]
        await page.wait_for_selector(changeLocationButton, timeout=100)
        await page.click(changeLocationButton)
        await page.wait_for_selector(locationPopup, timeout=100)

        countries = await page.query_selector_all("div[class='css-1dbjc4n r-d23pfw']")
        for country in countries:
            pass

    async def errback(self, failure):
        page = failure.request.meta["playwright_page"]
        await page.close()
