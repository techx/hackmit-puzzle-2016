import json
import os
import struct

from flask import Flask, jsonify, request, render_template, flash, send_from_directory
from flask_sqlalchemy import SQLAlchemy
from hashlib import sha256 as hash_

DB_PATH = 'sports-commentary.sqlitedb'

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + DB_PATH
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

NUM_TEAMS = 18  # smallest number factorial greater than 2^52
PRECISION = 52


def get_random_64_bit():
    return struct.unpack('Q', os.urandom(8))[0]


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True)
    state0 = db.Column(db.String(24))
    state1 = db.Column(db.String(24))

    @classmethod
    def get_or_create_from_username(cls, username):
        user = User.query.filter(User.username == username).one_or_none()
        if user is None:
            user = User(username)
            db.session.add(user)
            db.session.commit()
        return user

    @property
    def state(self):
        return (long(self.state0), long(self.state1))

    @state.setter
    def state(self, value):
        self.state0, self.state1 = str(value[0]), str(value[1])

    def __init__(self, username):
        self.username = username
        self.state0 = str(get_random_64_bit())
        self.state1 = str(get_random_64_bit())

    def __repr__(self):
        return '<User %r, state=(%s, %s)>' % (self.username, self.state0, self.state1)


if not os.path.isfile(DB_PATH):
    db.create_all()
    print "Creating database for the first time..."


def get_next_xorshift(state):
    # Thanks https://github.com/douggard/XorShift128Plus/blob/master/xs128p.py
    s1 = state[0] & ((1 << 64) - 1)
    s0 = state[1] & ((1 << 64) - 1)
    s1 ^= (s1 << 23) & ((1 << 64) - 1)
    s1 ^= (s1 >> 17) & ((1 << 64) - 1)
    s1 ^= s0 & ((1 << 64) - 1)
    s1 ^= (s0 >> 26) & ((1 << 64) - 1)
    state0 = state[1] & ((1 << 64) - 1)
    state1 = s1 & ((1 << 64) - 1)
    generated = (state0 + state1) & ((1 << 64) - 1)

    return (state0, state1), generated & ((1 << PRECISION) - 1)  # (only PRECISION bits here)


def permutation_from_number(k):
    # Thanks http://antoinecomeau.blogspot.ca/2014/07/mapping-between-permutations-and.html
    elems = range(NUM_TEAMS)
    result = [0]*NUM_TEAMS
    m = k
    for i in range(NUM_TEAMS):
        index = m % (NUM_TEAMS - i)
        m = m/(NUM_TEAMS - i)
        result[i] = elems[index]
        elems[index] = elems[NUM_TEAMS - i - 1]
    return result


def number_from_permutation(permutation):
    assert len(permutation) == NUM_TEAMS
    pos = range(NUM_TEAMS)
    elems = range(NUM_TEAMS)
    k = 0
    m = 1
    for i in range(NUM_TEAMS-1):
        k += m * pos[permutation[i]]
        m *= (NUM_TEAMS - i)
        pos[elems[NUM_TEAMS - i - 1]] = pos[permutation[i]]
        elems[pos[permutation[i]]] = elems[NUM_TEAMS - i - 1]
    return k


def get_next_n_xorshift(state, n):
    result = []
    for i in range(n):
        state, new_rand = get_next_xorshift(state)
        result.append(new_rand)
    return state, result


def check_solution(username):
    user_permutation = json.loads(request.form['predictions'])
    if not isinstance(user_permutation, list):
        return False
    if len(user_permutation) != NUM_TEAMS:
        return False
    user = User.get_or_create_from_username(username)
    _, k = get_next_xorshift(user.state)
    correct = permutation_from_number(k)
    is_correct = True
    for num1, num2 in zip(correct, user_permutation):
        if num1 != num2:
            is_correct = False
    return is_correct


def secret_code(username):
    base = 'thisisacoolsecret3456345keythatnoonewillguess3409582043svnsfduvla07348tsdfgsdh544927859||||'
    h = hash_()
    h.update(base + username.lower())
    return h.hexdigest()


@app.route('/<username>/xorshift128plus', methods=['GET'])
def get_next_xorshift_api(username):
    user = User.get_or_create_from_username(username)
    user.state, nums = get_next_n_xorshift(user.state, 200)
    db.session.commit()
    return jsonify(nums)


@app.route('/favicon.ico', methods=['GET', 'POST'])
def favicon():
    return send_from_directory('static', 'favicon.ico')


@app.route('/<username>', methods=['GET', 'POST'])
def user_home(username):
    got_it_wrong = False
    if request.method == 'POST':
        if check_solution(username):
            return 'Congrats! You guessed the perfect bracket. Your code is ' + secret_code(username)
        else:
            got_it_wrong = True
    return render_template('betting.html', got_it_wrong=got_it_wrong)


@app.route('/')
def homepage():
    return render_template('index.html')

if __name__ == "__main__":
    app.run(debug=True)
