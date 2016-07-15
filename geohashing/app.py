from flask import Flask
from flask import render_template, request
import numpy.random as rand
import time

app = Flask(__name__)

@app.route('/')
def hello_world():
    times = ['16:49', '19:21', '02:21', '10:03', '21:59', '16:51'] # For reference
    adj_times = ['4:49', '7:21', '2:21', '10:03', '9:59', '4:51']
    is_pm = [True, True, False, False, True, True]
    locations = ['Cambridge, MA', 'Eureka, Canada', 'Alexandria, Egypt', 'Honolulu, HI', 'Paris, France', 'Santiago, Chile']
    dates = ['09/17/2015', '04/07/2010', '02/06/2004', '08/01/2007', '04/23/2003', '08/08/2012']
    x = rand.randint(0, len(times))
    return render_template('index.html', time=adj_times[x], pm=is_pm[x], loc=locations[x], date=dates[x])

@app.route('/answer', methods=['POST'])
def answer():
    loc = request.form['loc']
    valid_locs = ["42.19702,-71.59781", "79.71341,-85.14546", "31.86541,29.46147", "21.37220,157.17055", "48.98947,2.53996", "-33.36566,-70.03743"]
    time.sleep(1)
    if loc in valid_locs:
        return "The answer is 9bbcb44e53e8469db2b7f03d01996225"
    else:
        return ":("