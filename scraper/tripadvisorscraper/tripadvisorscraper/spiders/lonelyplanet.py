import scrapy


class LonelyplanetSpider(scrapy.Spider):
    name = "lonelyplanet"
    allowed_domains = ["www.lonelyplanet.com"]
    start_urls = ["https://www.lonelyplanet.com/sitemaps/destinations"]

    def parse(self, response):
        countries = response.css("div[class='py-6 border-t border-black-200']>ul>li")
        for country in countries:
            link = country.css("a::attr(href)").get()
            yield response.follow(link, callback=self.parse_country)

    def parse_country(self, response):
        country = response.css("div[class='md:inline-block md:pr-6']::text").get()
        cities = response.css("div[class='py-6 border-t border-black-200']>ul>li")
        cities_name = []
        for city in cities:
            city_name = city.css("a::text").get()
            cities_name.append(city_name)
        yield {
            "country": country,
            "cities": cities_name,
        }