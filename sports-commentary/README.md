Sports Commentary Puzzle
========================

Based off of [the xkcd comic Sports](https://xkcd.com/904/).

Setup
-----

`pip install -r requirements.txt`

And then run `python app.py` once to initialize the DB.

Running
-------

`python app.py`

Running in Prod
---------------

`gunicorn -w 4 app:app`

