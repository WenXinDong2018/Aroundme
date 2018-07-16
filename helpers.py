import feedparser
import urllib.parse
import twitter
from weather import Weather, Unit
import json
from urllib.request import urlopen
from urllib.parse import urlencode

global country
global city

def lookup():
    """Look up articles for geo"""
#//feed = feedparser.parse(f"https://elcomercio.pe/feed/peru")

    # Check cache
    try:
        if city in lookup.cache:
            return lookup.cache[city]
    except AttributeError:
        lookup.cache = {}

    # Replace special characters
    escapedCity = urllib.parse.quote(city, safe="")
    escapedCountry = urllib.parse.quote(country, safe="")

    feed = feedparser.parse(f"https://news.google.com/news?q={escapedCity}+{escapedCountry}&output=rss")


    # Get feed from Google
    """
    if (escapedCountry =="peru"):
        feed = feedparser.parse(f"https://elcomercio.pe/feed/peru")
    elif (country =="United States"):
        feed = feedparser.parse(f"https://news.google.com/news/rss/local/section/geo/{escapedCity}")
        if not feed["items"]:
            feed = feedparser.parse("http://www.theonion.com/feeds/rss")
    else:
        if not feed["items"]:
            feed = feedparser.parse(f"https://news.google.com/news/rss/local/section/geo/{escapedCountry}")
        if not feed["items"]:
            feed = feedparser.parse(f"http://feeds.reuters.com/reuters/AFRICA{countryLower}News")
        if not feed["items"]:
            feed = feedparser.parse(f"http://www.oecd.org/{countryLower}/index.xml")
    """


    # If no items in feed, get feed from Onion
    if not feed["items"]:
        feed = feedparser.parse("http://www.theonion.com/feeds/rss")

    # Cache results
    lookup.cache[city] = [{"link": item["link"], "title": item["title"]} for item in feed["items"]]
    # Return results
    return lookup.cache[city]

"""Return list of the top ten trend in a specific location + name of the location"""
def getTrend(lat,lng):

    #Twitter API Info
    CONSUMER_KEY = '8FOSo3bUDpGJh4fLjxwZcFh8n'
    CONSUMER_SECRET = 'tLwgiMQtGPvYf94bEge7pkqVr8kNRZWsvvc8TExNNLNJ1vSz9u'
    ACCESS_TOKEN = '2824011827-vCbaYNwetDmPTdcgrPRJKLal3CTDC9MCkRah6Kj'
    ACCESS_TOKEN_SECRET = 'cUIs1LyyCKTmtmMlNkvMvrY75T7vteV1sM2wJQJzqVZjB'

    #service instance
    api = twitter.Api(consumer_key=CONSUMER_KEY,
    consumer_secret=CONSUMER_SECRET,
    access_token_key=ACCESS_TOKEN,
    access_token_secret=ACCESS_TOKEN_SECRET)
    #print(api.VerifyCredentials())

    #add GetClosestWoeid to api instance
    api.GetClosestWoeid = GetClosestWoeid.__get__(api)

    #closest woeid and the name of the corresponding location
    woeidAndName = api.GetClosestWoeid(lat, lng)
    #search is an array of trend objects. trend has name and url attributes
    search = api.GetTrendsWoeid(woeidAndName[0])

    # Cache results
    result = [{"url": item.url, "name": item.name} for item in search]

    return [result,woeidAndName[1]]

"""Find weather of a specific location with lat and lng"""
def getWeather(lat,lng):
    global country
    global city
    #id = 'dj0yJmk9bWViNGhPUkoxS1JSJmQ9WVdrOWJIQkJhekZCTjJrbWNHbzlNQS0tJnM9Y29uc3VtZXJzZWNyZXQmeD0wNw--'
    #secret="0c8d22abb5f59e21a17b49c1594d88c0fe4051c8"

    baseurl = "https://query.yahooapis.com/v1/public/yql?"
    #yql_query = "select wind from weather.forecast where woeid=2460286"

    woeid="select * from weather.forecast where woeid in (SELECT woeid FROM geo.places WHERE text='("+ str(lat) + "," + str(lng)+")')"

    yql_url = baseurl + urlencode({'q':woeid}) + "&format=json"
    result = urlopen(yql_url).read()
    data = json.loads(result)

    #temp, text, date
    current = data['query']['results']['channel']['item']['condition']
    #currentTemp = data['query']['results']['channel']['item']['condition']['temp']
    #currentText = data['query']['results']['channel']['item']['condition']['text']
    #currentDate = data['query']['results']['channel']['item']['condition']['date']

    #day, high, low, text
    forecast = data['query']['results']['channel']['item']['forecast'][:3]

    location = data['query']['results']['channel']['location']

    city = data['query']['results']['channel']['location']['city']
    country = data['query']['results']['channel']['location']['country']
    #print(city,country)
    return [current,forecast,location]


"""Returns the locations that Twitter has trending topic information for, closest to a specified location"""
"""returns [woeid,name]"""
def GetClosestWoeid(self,lat,lng):

    #https://api.twitter.com/1.1/trends/closest.json?lat=37.781157&long=-122.400612831116
    url = 'https://api.twitter.com/1.1/trends/closest.json'
    parameters = {'lat':lat,'long':lng}

    resp = self._RequestUrl(url, verb='GET', data=parameters)
    data = self._ParseAndCheckTwitter(resp.content.decode('utf-8'))



    return [data[0]['woeid'],data[0]['name']]

#getWeather(42.35843, -71.05977)
#lookup()