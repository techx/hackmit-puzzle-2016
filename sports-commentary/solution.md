Solution
========

Part 1
------

When you first come to this site, you're presented with an XKCD-like page. Clicking around seems to do nothing, but the alt text of the image says "Would you like to play a game?".

If you look at the page source, there's a comment right below the image:

`tb gb fynfu tvguho hfreanzr`, which is `go to slash github username` if you use rot13, a common cipher.

Proceeding to `/Detry322` in my case (or your personal github username) reveals a page introducing the Grand Sportsball Competition, as well as the rankings for the winners for the last year.

Part 2
------

The page asks you to make a prediction on the rankings for the teams of the Grand Sportsball Competition for the next year.

How does the website determine last year's winners, anyways? It makes a get request to `/<username>/xorshift128plus`, from which it receives 10 numbers, presumably calculated using the [XorShift128+](https://en.wikipedia.org/wiki/Xorshift) method. The first of these numbers is used to generate a permutation of the teams, which represents their ranking.

That means all we have to do is predict the next random number from the xorshift128plus page! But first, some other obserations are needed. First off, there seems to be a common trope of dividing the random numbers by `2**52`. It's possible to notice by inspection, but the numbers returned from `xorshift128plus` never exceed this number. This is due to the limits of the Double Precision Floating Point specification. However, The XorShift128+ algorithm returns 64-bit random numbers. You can conclude that the top 12 bits are masked off.

Knowing that the random numbers are generated using `xorshift128plus` and that the top 12 bits are masked off is enough to solve this puzzle. Using an SMT solver, or any other method, you can predict the output of the XorShift128+ random number generator if you know the previous 3 or 4 values. (As a side note, this is a good lesson into why you shouldnt use a bad RNG for crypto purposes).

Using this method, you can predict the next random number generated, and then plug that number into `permutation_to_teams(number_to_permutation(number))` to get an ordered list of teams. Drag and drop the form at the bottom into this order to receive your code!


Walkthrough
===========

Open up `/<your username>` in Google Chrome and then open up the inspector. Go to network and then refresh the page.

Click on `xorshift128plus` and click Response. You should see something like this:

```[661335949750611,2751432643697738,...,2732415127845042,2161260890456069,253048408667729,910118680714203,3367741621612344]
```

Run `python solution.py` and paste in the last 5 or more numbers of the huge array. You'll get back a number (which is the next number to be returned by xorshift: ```<number>```

Back in the Chrome console, put in `permutation_to_teams(number_to_permutation(number));` and then drag the teams into that order.

You win!
