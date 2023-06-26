import scrapy


class TripadvisorSpider(scrapy.Spider):
    name = "tripadvisor"
    allowed_domains = ["www.tripadvisor.com"]
    start_urls = ["https://www.tripadvisor.com/Attractions-g293925-Activities-oa0-Ho_Chi_Minh_City.html"]

    def parse(self, response):
        attractions = response.css("section[data-automation='WebPresentation_SingleFlexCardSection']")
        for attraction in attractions:
            link = attraction.css("a::attr(href)").get()
            yield response.follow(link, callback=self.parse_attraction)

    def parse_attraction(self, response):
        title = response.css("h1[data-automation='mainH1']::text").get()
        yield {
            'Title': title,
        }
        print(title)
