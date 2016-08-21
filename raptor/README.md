Velociraptor Escape
===

Survive swarms of velociraptors by programming your way to escape in a mystery language.

Originally made for the [HackMIT](https://hackmit.org) 2016 Admissions Puzzle.

Big thanks to [xkcd](http://xkcd.com/) for inspiring the theme and allowing people to reproduce the xkcd aesthetic :)

## Gameplay

Velociraptor Escape challenges players to traverse a grid of moving obstacles by writing code in a language that they don't know. They don't know it because it was created for the purpose of this game, and the only way they can learn it is by analyzing how it's implemented!

## Levels

To clarify, levels consist of a list of snapshots of all of the obstacles' locations. There's some set of paths that, when traversed through time, arrive at the goal state from the start state without colliding with anything. The simplest solution is to hard-code a sequence of movements that produces one of those paths, but using the power of abstraction, there are always more elegant ways to express the same sequence.

An important aspect of this game, which as of v1.0.2 is not working as well as it should :(, is that it grades your program based on how much it's abstracted about the solution.

In addition to the obstacle sequences, each level also has associated with it two types of constraints: code constraints and compute constraints. The code constraints require that you've abstracted some minimal amount about the solution, and it will reject valid solutions that solve the problem too explicitly. The compute constraint limits how many computations the input program is allowed to perform to arrive at the movement sequence.

## Language

The language created for this game, [Raptor lang](https://github.com/turbomaze/raptor-lang), is parsed and interpreted in JavaScript. It's designed to be primarily functional in nature, supporting recursion, first-class functions, and partial application. The first part of the game involves reading through the source code (specifically the language's EBNF) to learn how to write it.

## Contributors

This project was a wild ride from start to finish. I (turbomaze) had the idea for it Thursday 7/7/16 (a week before the HackMIT puzzle deadline), and I realized I desperately needed help. I asked my friends, and they miraculously came to the rescue and contributed dozens of hours of dev work towards a project they had no reason to feel responsible for; most of them weren't even affiliated with HackMIT! I want to give a big shoutout to all the individuals who contributed to this project, enabling us to release it (roughly) on time :)

[Claire Nord](http://github.com/cmnord) -- consistently contributed to the project from the beginning (despite a 13-hour timezone difference), working on aspects of the game engine, front end design, and server verification.

[Patrick Insinger](http://github.com/patins) -- a real bro when it came to closing issues; totally owned the server and solved problems before we even realized we had them. Project would have flopped without him!

[Reb Weinberger](http://github.com/rweinberger) -- she's the reason you don't throw up when you look at velociraptor-escape. A css goddess, she put in late nights designing the look and feel of this game.

[Zareen Choudhury](http://github.com/zareenc) -- a true savior in those critical last moments prior to release, Zareen helped architect and detail the specifics of the game levels.

[Carlos Henriquez](http://github.com/mysticuno) -- from front-end features to misc bug fixes to implementing elegant solutions to the puzzle levels, Carlos offered his help wherever it was needed (which was a lot of places).

[Kyle Bridburg](http://github.com/kbridbur) -- Kyle was the first one to figure out how to efficiently design levels, writing code to automatically generate game levels (code is not in repository).

[Neena Dugar](http://github.com/thisisneena) -- even though I approached Neena for help on such short notice (and her being all the way in Germany!), she still found the time to implement essential game features.

[Jessie Wang](http://www.jessiewang.net/) -- Jessie set the precedent for a proper xkcd-inspired theme by producing quality image assets.

Dayna Erdmann -- Dayna used her expert animation skills to produce the SWEET (and gruesome) velociraptor animation that plays when users lose the game.

[Kimberli Zhong](http://github.com/kimberli) -- Kim joined towards the end of the project, helping us integrate with the rest of the HackMIT 2016 puzzles. Without her, no one could have played our game!

[Mac Liu](http://github.com/macliu) -- recruited late one night as he was brushing his teeth, Mac pioneered the node.js server, getting the ball rolling on that aspect of the app.

[Joe Zurier](http://math.mit.edu/~jazurier) -- as a math major, Joe contributed by inspiring some of the more interesting level designs. Unfortunately, we didn't have time to implement all of his ideas by the deadline, but we very well might in a future version!

## License

MIT License: http://igliu.mit-license.org/

