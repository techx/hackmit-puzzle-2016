function pathFilename(path) {
	var match = /\/([^\/]+)$/.exec(path);
	if (match) {
		return match[1];
	}
}

function getRandomInt(min, max) {
	// via https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Global_Objects/Math/random#Examples
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChoice(items) {
	return items[getRandomInt(0, items.length-1)];
}

var xkcd = {
	last: null,
	cache: {},
	base: 'https://dynamic.xkcd.com/api-0/jsonp/comic/',

	get: function(num, success, error) {
		if (num == null) {
			path = '';
		} else if (Number(num)) {
			path = String(num);
		} else {
			error(false);
			return false;
		}

		if (num in this.cache) {
			this.last = this.cache[num];
			success(this.cache[num]);
		} else {
			return $.ajax({
				url: this.base+path,
				dataType: 'jsonp',
				success: $.proxy(function(data) {
					this.last = this.cache[num] = data;
					success(data);
				}, this),
				error: error});
		}
	}
};

var xkcdDisplay = function(terminal, path) {
	function fail() {
		terminal.print($('<p>').addClass('error').text('display: unable to open image "'+path+'": No such file or directory.'));
		terminal.setWorking(false);
	}

	if (path) {
		path = String(path);
		num = Number(path.match(/^\d+/));
		filename = pathFilename(path);
	} else {
		num = xkcd.last.num;
	}

	terminal.setWorking(true);
    xkcd.get(num, function(data) {
        if (!filename || (filename == pathFilename(data.img.replace('http://', 'https://')))) {
            $('<img>')
                .hide()
                .load(function() {
                    terminal.print($('<h3>').text(data.num+": "+data.title));
                    $(this).fadeIn();

                    var comic = $(this);
                    if (data.link) {
                        comic = $('<a>').attr('href', data.link).append($(this));
                    }
                    terminal.print(comic);

                    terminal.setWorking(false);
                })
                .attr({src:data.img.replace('http://', 'https://'), alt:data.title, title:data.alt})
                .addClass('comic');
        } else {
            fail();
        }
    }, fail);
};

TerminalShell.commands['start'] = function(terminal) {
	terminal.setWorking(true);
	$.ajax({
		type: 'POST',
		url: '/puzzle/start',
		dataType: 'json',
		success: function(data) {
			if (data.message) {
				terminal.print(data.message);
			} else {
				terminal.print("Something went wrong... :|");
			}
			terminal.setWorking(false);
		},
		error: function(e) {
			terminal.print("Something went wrong... :|");
			terminal.setWorking(false);
		}
	});
};

TerminalShell.commands['list'] = function(terminal) {
	terminal.setWorking(true);
	$.ajax({
		type: 'GET',
		url: '/puzzle/list',
		dataType: 'json',
		success: function(data) {
			if (data.puzzleParts) {
				terminal.print('num | done | url');
				var p = data.puzzleParts;
				for (var i = 0; i < p.length; i++) {
					var msg = ' ';
					if (i < 10) {
						msg += ' ' + i.toString();
					} else {
						msg += i;
					}
					msg += ' | ';
					if (typeof p[i].completionTimestamp !== 'undefined') {
						msg += ' yes | ';
					} else {
						msg += '  no | ';
					}
					terminal.print($('<p>').html(msg + "<a href=\"" + p[i].url + "\">" + p[i].url + "</a>"));
				}
			} else {
				terminal.print("Something went wrong... :|");
			}
			terminal.setWorking(false);
		},
		error: function(e) {
			terminal.print("Something went wrong... :|");
			terminal.setWorking(false);
		}
	});
};

TerminalShell.commands['submit'] = function(terminal) {
	var argArray = Array.prototype.slice.call(arguments);
	argArray.shift(); // terminal
	var number = argArray.shift();
	if (typeof number === 'undefined') {
		terminal.print('puzzle number is required!');
		return;
	}
	if (!(/\d+/.test(number))) {
		terminal.print('puzzle number must be a number!');
		return;
	}
	var guess = argArray.join(' ');
	if (guess.length === 0) {
		terminal.print('guess is required!');
		return;
	}
	terminal.setWorking(true);
	$.ajax({
		type: 'POST',
		url: '/puzzle/guess',
		data: {
			puzzleNumber: number,
			guess: guess
		},
		success: function(data) {
			if (typeof data.message !== 'undefined') {
				terminal.print(data.message);
				if (data.message.indexOf('incident') !== -1 && getRandomInt(0, 5) < 1) {
					terminal.setWorking(true);
					setTimeout(function() {
						xkcdDisplay(terminal, 838);
						// ^ calls `terminal.setWorking(false)` when it's done
					}, 3000);
				} else {
					terminal.setWorking(false);
				}
			} else if (typeof data.correct !== 'undefined') {
				if (data.correct === true) {
					terminal.print('Correct!');
				} else {
					terminal.print(randomChoice([
						'Nope.',
						'Try again.',
					]));
				}
				terminal.setWorking(false);
			} else {
				terminal.print("Something went wrong... :|");
				terminal.setWorking(false);
			}
		},
		error: function(e) {
			terminal.print("Something went wrong... :|");
			terminal.setWorking(false);
		}
	});
};

TerminalShell.commands['finish'] = function(terminal, email) {
	terminal.setWorking(true);
	$.ajax({
		type: 'POST',
		url: '/puzzle/finish',
		data: {
			email: email
		},
		success: function(data) {
			if (typeof data.message !== 'undefined') {
				terminal.print(data.message);
			} else {
				console.log(data);
				terminal.print("Something went wrong... :|");
			}
			terminal.setWorking(false);
		},
		error: function(e) {
			terminal.print("Something went wrong... :|");
			terminal.setWorking(false);
		}
	});
};

TerminalShell.commands['sudo'] = function(terminal) {
	var cmd_args = Array.prototype.slice.call(arguments);
	cmd_args.shift(); // terminal
	if (cmd_args.join(' ') == 'make me a sandwich') {
		terminal.print('Okay.');
	} else {
		var cmd_name = cmd_args.shift();
		cmd_args.unshift(terminal);
		cmd_args.push('sudo');
		if (TerminalShell.commands.hasOwnProperty(cmd_name)) {
			this.sudo = true;
			this.commands[cmd_name].apply(this, cmd_args);
			delete this.sudo;
		} else if (!cmd_name) {
			terminal.print('sudo what?');
		} else {
			terminal.print('sudo: '+cmd_name+': command not found');
		}
	}
};

TerminalShell.filters.push(function (terminal, cmd) {
	if (/!!/.test(cmd)) {
		var newCommand = cmd.replace('!!', this.lastCommand);
		terminal.print(newCommand);
		return newCommand;
	} else {
		return cmd;
	}
});

// boy is this one going to be annoying
TerminalShell.filters.push(function (terminal, cmd) {
	if (getRandomInt(0, 10) < 1) {
		return '__segfault';
	} else {
		return cmd;
	}
});

TerminalShell.commands['__segfault'] = function(terminal) {
	terminal.print('Segmentation fault (core dumped)');
};

TerminalShell.commands['shutdown'] = TerminalShell.commands['poweroff'] = function(terminal) {
	if (this.sudo) {
		var user = window.currentUser;
		terminal.print('Broadcast message from ' + user + '@haxkcd');
		terminal.print();
		terminal.print('The system is going down for maintenance NOW!');
		return $('#screen').fadeOut();
	} else {
		terminal.print('Must be root.');
	}
};

TerminalShell.commands['logout'] =
TerminalShell.commands['exit'] =
TerminalShell.commands['quit'] = function(terminal) {
	terminal.print('Bye.');
	$('#prompt, #cursor').hide();
	terminal.promptActive = false;
};

TerminalShell.commands['restart'] = TerminalShell.commands['reboot'] = function(terminal) {
	if (this.sudo) {
		TerminalShell.commands['poweroff'](terminal).queue(function(next) {
			window.location.reload();
		});
	} else {
		terminal.print('Must be root.');
	}
};

function linkFile(url) {
	return {type:'dir', enter:function() {
		window.location = url;
	}};
}

Filesystem = {
	'credits.txt': {type:'file', read:function(terminal) {
		terminal.print('haxkcd was proudly built by:');
		// sort these in alphabetical order?
		terminal.print($('<p>').html('<a href="https://github.com/katexyu">Kate Yu</a>'));
		terminal.print($('<p>').html('<a href="https://github.com/anishathalye">Anish Athalye</a>'));
		terminal.print($('<p>').html('<a href="https://github.com/fertogo">Fernando Trujano</a>'));
		terminal.print($('<p>').html('<a href="https://github.com/detry322">Jack Serrino</a>'));
		terminal.print($('<p>').html('<a href="https://github.com/kimberli">Kimberli Zhong</a>'));
		terminal.print($('<p>').html('<a href="https://github.com/andrewilyas">Andrew Ilyas</a>'));
		terminal.print($('<p>').html('<a href="https://github.com/cmnord">Claire Nord</a>'));
		terminal.print($('<p>').html('<a href="https://github.com/turbomaze/">Anthony Liu</a>'));
		terminal.print($('<p>').html('<a href="https://github.com/stefren">Stef Ren</a>'));
	}},
	'welcome.txt': {type:'file', read:function(terminal) {
		terminal.print($('<h4>').text('Welcome to the haxkcd console.'));
		terminal.print();
		terminal.print('haxkcd comes with ABSOLUTELY NO WARRANTY, to the extent');
		terminal.print('permitted by applicable law.');
	}},
	'license.txt': {type:'file', read:function(terminal) {
		terminal.print($('<p>').html('Client-side logic for Wordpress CLI theme :: <a href="http://thrind.xamai.ca/">R. McFarland, 2006, 2007, 2008</a>'));
		terminal.print($('<p>').html('jQuery rewrite and overhaul :: <a href="http://www.chromakode.com/">Chromakode, 2010</a>'));
		terminal.print($('<p>').html('haxkcd :: <a href="https://hackmit.org/">HackMIT, 2016</a>'));
		terminal.print();
		$.each([
			'This program is free software; you can redistribute it and/or',
			'modify it under the terms of the GNU General Public License',
			'as published by the Free Software Foundation; either version 2',
			'of the License, or (at your option) any later version.',
			'',
			'This program is distributed in the hope that it will be useful,',
			'but WITHOUT ANY WARRANTY; without even the implied warranty of',
			'MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the',
			'GNU General Public License for more details.',
			'',
			'You should have received a copy of the GNU General Public License',
			'along with this program; if not, write to the Free Software',
			'Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.'
		], function(num, line) {
			terminal.print(line);
		});
	}}
};
Filesystem['hackmit'] = linkFile('https://hackmit.org');
Filesystem['register'] = linkFile('https://my.hackmit.org/');
TerminalShell.pwd = Filesystem;

TerminalShell.commands['cd'] = function(terminal, path) {
	if (path in this.pwd) {
		if (this.pwd[path].type == 'dir') {
			this.pwd[path].enter(terminal);
		} else if (this.pwd[path].type == 'file') {
			terminal.print('cd: '+path+': Not a directory');
		}
	} else {
		terminal.print('cd: '+path+': No such file or directory');
	}
};

TerminalShell.commands['ls'] = function(terminal, path) {
	var name_list = $('<ul>');
	$.each(this.pwd, function(name, obj) {
		if (obj.type == 'dir') {
			name += '/';
		}
		name_list.append($('<li>').text(name));
	});
	terminal.print(name_list);
};

TerminalShell.commands['cat'] = function(terminal, path) {
	if (path in this.pwd) {
		if (this.pwd[path].type == 'file') {
			this.pwd[path].read(terminal);
		} else if (this.pwd[path].type == 'dir') {
			terminal.print('cat: '+path+': Is a directory');
		}
	} else if (typeof path !== 'undefined') {
		terminal.print($('<p>').addClass('error').text('cat: "'+path+'": No such file or directory.'));
	} else {
		terminal.print('Meow!');
	}
};

TerminalShell.commands['rm'] = function(terminal, flags, path) {
	if (flags && flags[0] != '-') {
		path = flags;
	}
	if (!path) {
		terminal.print('rm: missing operand');
	} else if (path in this.pwd) {
		if (this.pwd[path].type == 'file') {
			delete this.pwd[path];
		} else if (this.pwd[path].type == 'dir') {
			if (/r/.test(flags)) {
				delete this.pwd[path];
			} else {
				terminal.print('rm: cannot remove '+path+': Is a directory');
			}
		}
	} else if (flags == '-rf' && path == '/') {
		if (this.sudo) {
			TerminalShell.commands = {};
		} else {
			terminal.print('rm: cannot remove /: Permission denied');
		}
	}
};

function oneLiner(terminal, msg, msgmap) {
	if (msgmap.hasOwnProperty(msg)) {
		terminal.print(msgmap[msg]);
		return true;
	} else {
		return false;
	}
}

TerminalShell.commands['man'] = function(terminal, what) {
	terminal.print('RTFM!');
};

TerminalShell.commands['find'] = function(terminal, what) {
	terminal.print('I can\'t find what you\'re looking for.');
};

TerminalShell.commands['dogemit'] = function(terminal, what) {
	terminal
	    .print($('<p>')
		.html('<a href="https://www.youtube.com/watch?v=sd4bqmP_460">much amuse</a>'));
};

// No peeking!
TerminalShell.commands['help'] = TerminalShell.commands['halp'] = function(terminal) {
	$.each([
		'  start                       - start the puzzle',
		'  list                        - list puzzles',
		'  submit <number> <guess>     - submit a solution for a puzzle',
		'  finish <your email address> - finish the puzzle',
		'  slack                       - get information on how to access the puzzle slack'
	], function(num, line) {
		terminal.print(line);
	});
};

TerminalShell.commands['slack'] = function(terminal) {
	terminal
	    .print($('<p>')
		.html('<a href="http://slack.haxkcd.com/">slack.haxkcd.com</a>'));
}

TerminalShell.fallback = function(terminal, cmd) {
	oneliners = {
		'catmit': 'That is so 2014.',
		'cry': 'Boo hoo.',
		'date': 'September 17, 2016',
		'hack': 'No hacking allowed!',
		'haxkcd': 'You didn\'t think it would be that easy, did you?',
		'moo': 'moo',
		'pls': 'no u',
		'pwd': '/you/are/trapped/here',
		'ssh': 'It\'s not secure enough!',
		'whoami': 'You are Richard Stallman.',
		'why': 'Why not?'
	};
	oneliners['emacs'] = 'You should really use vim.';
	oneliners['vi'] = oneliners['vim'] = 'You should really use emacs.';
	oneliners['hi'] = oneliners['hello'] = oneliners['hey'] = 'sup.';

	cmd = cmd.toLowerCase();
	if (!oneLiner(terminal, cmd, oneliners)) {
		if (cmd == "hint") {
			terminal.print(randomChoice([
 				'Here\'s a hint: QGXYVVWQ2',
 				'Use the source, Luke!',
				'There are cheat codes.',
				'No.',
 			]));
		} else if (cmd == "doge") {
			var modifier = randomChoice([
				'amaze',
				'many',
				'much',
				'so',
				'such',
				'very'
				]);
			var subject = randomChoice([
				'amuse',
				'cats',
				'confuse',
				'cry',
				'fun',
				'hacks',
				'hackmit',
				'laugh',
				'puzzle',
				'xkcd'
				]);
			terminal.print(modifier + " " + subject);
		} else {
			return false;
		}
	}
	return true;
};

var konamiCount = 0;
$(document).ready(function() {
	Terminal.promptActive = false;
	function noData() {
		Terminal.print($('<p>').addClass('error').text('Unable to load startup data. :-('));
		Terminal.promptActive = true;
	}
	$('#screen').bind('cli-load', function(e) {
		Terminal.runCommand('cat welcome.txt');
	});

	$(document).konami(function(){
		function shake(elems) {
			elems.css('position', 'relative');
			return window.setInterval(function() {
				elems.css({top:getRandomInt(-3, 3), left:getRandomInt(-3, 3)});
			}, 100);
		}

		if (konamiCount == 0) {
			$('#screen').css('text-transform', 'uppercase');
		} else if (konamiCount == 1) {
			$('#screen').css('text-shadow', 'gray 0 0 2px');
		} else if (konamiCount == 2) {
			$('#screen').css('text-shadow', 'orangered 0 0 10px');
		} else if (konamiCount == 3) {
			shake($('#screen'));
		}

		$('<div>')
			.height('100%').width('100%')
			.css({background:'white', position:'absolute', top:0, left:0})
			.appendTo($('body'))
			.show()
			.fadeOut(1000);

		if (Terminal.buffer.substring(Terminal.buffer.length-2) == 'ba') {
			Terminal.buffer = Terminal.buffer.substring(0, Terminal.buffer.length-2);
			Terminal.updateInputDisplay();
		}
		TerminalShell.sudo = true;
		konamiCount += 1;
	});
});
