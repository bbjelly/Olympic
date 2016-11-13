# -*- coding: utf-8 -*-
try:
    import urllib.request as urllib2
except ImportError:
    import urllib2
from bs4 import BeautifulSoup
import json
import pdb
import unidecode
# from collections import OrderedDict

src_dir = '/Users/Sally/Desktop/olympics/'
urlProfile = [];
#any way to get the urlList without having a soup first?
url_base = "https://www.olympic.org/"

events = {"summer": {"athletics":["100m-men", "100m-women", "110m-hurdles-men", "100m-hurdles-women", "javelin-throw-men", "javelin-throw-women", "triple-jump-men", "triple-jump-women"], "swimming":["100m-freestyle-men", "100m-freestyle-women", "200m-butterfly-men", "200m-butterfly-women"], "weightlifting":["56kg-men", "53kg-women"], "rowing":["double-sculls-2x-men", "double-sculls-2x-women"]}, "winter":{"speed-skating":["1000m-men", "1000m-women" , "5000m-men", "5000m-women"]}} # later can be changed to scraping the names of the events
olympicRecords = {key:{event:[] for event in events[olympic][key]} for olympic in events for key in events[olympic].keys()}
for olympic in events.keys():
    for sport in events[olympic].keys():
        for event in events[olympic][sport]:
            url = "%s%s/%s"% (url_base, sport, event)
            try:
                page = urllib2.urlopen(url).read()
            except urllib2.error:
                print (url)
                pdb.set_trace()
            soup = BeautifulSoup(page, "html.parser")
            olympics = []
            for ref in soup.findAll('h2', {'itemprop':'name'}):
                # pdb.set_trace()
                olympicName = ref.find('a').contents[2].strip()
                olympics.append(olympicName)
            iOlympic = 0
            for table in soup.findAll("table") [0:10]:
                tbody = table.find("tbody")
                for tr in tbody.findAll("tr"):
                    entry = {}
                    entry['Olympic'] = olympics[iOlympic]
                    entry['medal'] = tr.find("div").get('class', None)[1]
                    if tr.find("span", {'class':'txt'}) is None:
                        entry['record'] = None
                    else:
                        entry['record'] = tr.find("span", {'class':'txt'}).contents[0]
                    if tr.find("img") is None:
                        entry['pic'] = None
                    else:
                        entry['pic'] = tr.find("img").get('srcset', None).split(', ')[0] # can get 2x picture
                    if tr.find("strong", {'class':'name'}) is None:
                        entry['name'] = tr.find('td', {'class':'col2'}).contents[0].strip()
                    else:
                        entry['name'] = unidecode.unidecode(tr.find("strong", {'class':'name'}).contents[0])
                    # if u'\xd6' in entry['name']:
                    #     entry['name'] = entry['name'].replace(u'\xd6', "OE")
                    if tr.find("span", {'itemprop':'nationality'}) is None:
                        entry['nationality'] = None
                    else:
                        entry['nationality'] = tr.find("span", {'itemprop':'nationality'}).contents[0]
                    splitEvent = event.split('-')
                    entry['gender'] = splitEvent[len(splitEvent)-1]
                    entry['OlympicSeason'] = olympic
                    olympicRecords[sport][event].append(entry)
                iOlympic +=1

with open(src_dir+'OlympicRecords.json', 'w') as outfile:
    try:
        json.dump(olympicRecords, outfile, ensure_ascii=False, indent=4)
    except UnicodeEncodeError:
        print("Unicode Error")
        pdb.set_trace()
