# Define here the models for your spider middleware
#
# See documentation in:
# https://docs.scrapy.org/en/latest/topics/spider-middleware.html

from scrapy import signals
import re
from htmlmin import minify
from urllib.parse import urlencode
from random import randint
import requests
# useful for handling different item types with a single interface
from itemadapter import is_item, ItemAdapter
from scrapy.exceptions import IgnoreRequest


class TripadvisorscraperSpiderMiddleware:
    # Not all methods need to be defined. If a method is not defined,
    # scrapy acts as if the spider middleware does not modify the
    # passed objects.

    @classmethod
    def from_crawler(cls, crawler):
        # This method is used by Scrapy to create your spiders.
        s = cls()
        crawler.signals.connect(s.spider_opened, signal=signals.spider_opened)
        return s

    def process_spider_input(self, response, spider):
        # Called for each response that goes through the spider
        # middleware and into the spider.

        # Should return None or raise an exception.
        return None

    def process_spider_output(self, response, result, spider):
        # Called with the results returned from the Spider, after
        # it has processed the response.

        # Must return an iterable of Request, or item objects.
        for i in result:
            yield i

    def process_spider_exception(self, response, exception, spider):
        # Called when a spider or process_spider_input() method
        # (from other spider middleware) raises an exception.

        # Should return either None or an iterable of Request or item objects.
        pass

    def process_start_requests(self, start_requests, spider):
        # Called with the start requests of the spider, and works
        # similarly to the process_spider_output() method, except
        # that it doesn’t have a response associated.

        # Must return only requests (not items).
        for r in start_requests:
            yield r

    def spider_opened(self, spider):
        spider.logger.info("Spider opened: %s" % spider.name)


class TripadvisorscraperDownloaderMiddleware:
    # Not all methods need to be defined. If a method is not defined,
    # scrapy acts as if the downloader middleware does not modify the
    # passed objects.

    @classmethod
    def from_crawler(cls, crawler):
        # This method is used by Scrapy to create your spiders.
        s = cls()
        crawler.signals.connect(s.spider_opened, signal=signals.spider_opened)
        return s

    def process_request(self, request, spider):
        # Called for each request that goes through the downloader
        # middleware.

        # Must either:
        # - return None: continue processing this request
        # - or return a Response object
        # - or return a Request object
        # - or raise IgnoreRequest: process_exception() methods of
        #   installed downloader middleware will be called
        return None

    def process_response(self, request, response, spider):
        # Called with the response returned from the downloader.

        # Must either;
        # - return a Response object
        # - return a Request object
        # - or raise IgnoreRequest
        return response

    def process_exception(self, request, exception, spider):
        # Called when a download handler or a process_request()
        # (from other downloader middleware) raises an exception.

        # Must either:
        # - return None: continue processing this exception
        # - return a Response object: stops process_exception() chain
        # - return a Request object: stops process_exception() chain
        pass

    def spider_opened(self, spider):
        spider.logger.info("Spider opened: %s" % spider.name)


class ExcludeExternalResourcesMiddleware:

    def process_response(self, request, response, spider):
        # Exclude external scripts
        response = response.replace(body=self.exclude_scripts(response.body))

        # Exclude external stylesheets
        response = response.replace(body=self.exclude_stylesheets(response.body))

        return response

    def process_request(self, request, spider):
        user_agent = request.headers.get('User-Agent', '').decode('utf-8')

        # Exclude images for non-browser requests
        if 'Mozilla' not in user_agent:
            return None

        content_type = request.headers.get('Content-Type', b'').decode('utf-8')

        # Exclude images based on content type
        if content_type.startswith('image/'):
            raise IgnoreRequest('Images are not allowed on this website.')

        return None

    def exclude_scripts(self, body):
        # Code to exclude external scripts from the response body
        # Implement your logic here to remove or modify script tags

        body = body.decode('utf-8')
        script_pattern = re.compile(r'<script.*?</script>', re.DOTALL)
        body = re.sub(script_pattern, '', body)

        return body

    def exclude_stylesheets(self, body):
        # Code to exclude external stylesheets from the response body
        # Implement your logic here to remove or modify link tags for stylesheets
        # Convert body to string
        body = body.decode('utf-8')
        # Define patterns to exclude
        patterns = [
            r'<link\s+href="https://static\.tacdn\.com/css2/webfonts/TripSans/TripSans-VF\.woff2[^>]+>',
            r'<link\s+rel="icon"\s+id="favicon"\s+href="https://static\.tacdn\.com/favicon\.ico[^>]+>',
            r'<link\s+rel="mask-icon"\s+sizes="any"\s+href="https://static\.tacdn\.com/img2/brand_refresh/application_icons/mask-icon\.svg[^>]+>',
            r'<link\s+rel="stylesheet"[^>]+>',
            r'<link\s+rel="preload"\s+as="style"[^>]+>',
            r'<link\s+rel="preload"\s+as="font"[^>]+>',
            r'<link\s+rel="preload"\s+as="script"[^>]+>',
            r'<link\s+rel="preload"\s+as="fetch"[^>]+>',
            r'<link\s+rel="preconnect"[^>]+>',
            r'<link\s+rel="dns-prefetch"[^>]+>',
            r'<link\s+rel="preconnect"\s+href="https://static\.tacdn\.com"[^>]+>',

        ]
        for pattern in patterns:
            body = re.sub(pattern, '', body)
        return body

class MinifyHtmlMiddleware:
    @classmethod
    def from_crawler(cls, crawler):
        middleware = cls()
        crawler.signals.connect(middleware.spider_opened, signal=signals.spider_opened)
        return middleware

    def process_response(self, request, response, spider):
        if response.status == 200 and response.headers['Content-Type'] == 'text/html':
            # Minify HTML content
            response = response.replace(body=minify(response.body.decode()))
        return response

    def spider_opened(self, spider):
        spider.logger.info('MinifyHtmlMiddleware enabled.')





class ScrapeOpsFakeUserAgentMiddleware:
    @classmethod
    def from_crawler(cls, crawler):
        return cls(crawler.settings)

    def __init__(self, settings):
        self.scrapeops_api_key = settings.get('SCRAPEOPS_API_KEY')
        self.scrapeops_endpoint = settings.get('SCRAPEOPS_FAKE_HEADERS_ENDPOINT',
                                               'http://headers.scrapeops.io/v1/browser-headers?')
        self.scrapeops_fake_headers_active = settings.get('SCRAPEOPS_FAKE_HEADERS_ENABLED', False)
        self.scrapeops_num_results = settings.get('SCRAPEOPS_NUM_RESULTS')
        self.headers_list = []
        self._get_headers_list()
        self._scrapeops_fake_headers_enabled()

    def _get_headers_list(self):
        payload = {'api_key': self.scrapeops_api_key}
        if self.scrapeops_num_results is not None:
            payload['num_results'] = self.scrapeops_num_results
        response = requests.get(self.scrapeops_endpoint, params=urlencode(payload))
        json_response = response.json()
        self.headers_list = json_response.get('result', [])

    def _get_random_header(self):
        random_index = randint(0, len(self.headers_list) - 1)
        return self.headers_list[random_index]

    def _scrapeops_fake_headers_enabled(self):
        if self.scrapeops_api_key is None or self.scrapeops_api_key == '' or self.scrapeops_fake_headers_active == False:
            self.scrapeops_fake_headers_active = False
        self.scrapeops_fake_headers_active = True

    def process_request(self, request, spider):
        random_header = self._get_random_header()
        for key, val in random_header.items():
            request.headers[key] = val