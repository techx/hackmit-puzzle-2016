function number_to_permutation(num) {
  var elems = [];
  var result = [];
  var num_teams = window.teams.length;
  var i;
  for (i = 0; i < num_teams; i++) {
    elems.push(i);
    result.push(0);
  }
  var m = num;
  for (i = 0; i < num_teams; i++) {
    var index = m % (num_teams - i);
    m = Math.floor(m/(num_teams - i));
    result[i] = elems[index];
    elems[index] = elems[num_teams - i - 1];
  }
  return result;
}

function permutation_to_teams(permutation) {
  var result = [];
  for (var i = 0; i < permutation.length; i++) {
    result.push(window.teams[permutation[i]]);
  }
  return result;
}

function draw_plot(options, functions) {
  var div = document.createElement('div');
  div.className = 'plotContainer';
  var h3 = document.createElement('h3');
  h3.innerText = options.title;
  div.appendChild(h3);

  var plot = xkcdplot(options);
  plot(div);
  var xmin = (options.xmin === undefined) ? -5 : options.xmin;
  var xmax = (options.xmin === undefined) ? 5 : options.xmax;
  functions.forEach(function(func_def) {
    var f = func_def['f'];
    var data = d3.range(xmin, xmax, (xmax - xmin) / 100).map(function (d) {
      return {x: d, y: f(d)};
    });
    plot.plot(data, {
      stroke: func_def['stroke'] || 'blue'
    });
    extra = (xmax - xmin) * 0.05;
    plot.xlim([xmin - extra, xmax + extra]).draw();
  });
  var p = document.createElement('p')
  p.innerText = options.description || '';
  div.appendChild(p);
  document.getElementById('statisticsContainer').appendChild(div);
}

function add_winners(ranking_number) {
  var rankings = permutation_to_teams(number_to_permutation(ranking_number));
  $('#winners').empty();
  for (var i = 0; i < rankings.length; i++) {
    $('<li>' + rankings[i] + '</li>').appendTo('#winners');
  }
}

function createTable(element, tableData) {
  var table = document.createElement('table');
  table.className = 'table table-striped';
  var tableBody = document.createElement('tbody');

  var firstRow = true;

  tableData.forEach(function(rowData) {
    var row = document.createElement('tr');

    rowData.forEach(function(cellData) {
      var cell = (firstRow) ? document.createElement('th') : document.createElement('td');
      cell.appendChild(document.createTextNode(cellData));
      row.appendChild(cell);
    });

    firstRow = false;

    tableBody.appendChild(row);
  });

  table.appendChild(tableBody);
  element.appendChild(table);
}

function getRandonNumber(nums) {
  // return 4; // chosen by fair dice roll.
  //           // guaranteed to be random.
  return nums.shift() / Math.pow(2, 52);
}

function create_winrate_table(nums) {
  var result = [['Team Name', 'Wins', 'Losses', 'Batting Average', 'Field Goals', 'Strikes', 'Laps']];

  window.teams.forEach(function(team) {
    var row = [];
    row.push(team);
    var games_played = 150;
    var wins = nums.shift() % 151;
    row.push(wins);
    row.push(games_played - wins);
    row.push(Math.round(1000*getRandonNumber(nums)));
    row.push(nums.shift() % 101);
    row.push(nums.shift() % 11);
    row.push(nums.shift() % 91);
    result.push(row);
  });

  createTable(document.getElementById('winrateContainer'), result);
}

function get_random_name(nums) {
  var first_names = ['Kylee', 'Kiesha', 'Arturo', 'Lacy', 'Marry', 'Mistie', 'Rico', 'Mac', 'Thanh', 'William', 'Carson', 'Delena', 'Bernardo', 'Jamison', 'Fransisca', 'Brett', 'Marcene', 'Kimberli', 'Emelina', 'Andera'];
  var last_names = ['Borjas', 'Notaro', 'Pernell', 'Colangelo', 'Sweat', 'Tatman', 'Newton', 'Acker', 'Mcnish', 'Antle', 'Cress', 'Zerr', 'Schlater', 'Mcmillon', 'Neu', 'Blakeney', 'Lusher', 'Riffe', 'Jaeger', 'Shamblin'];
  return first_names[nums.shift() % first_names.length] + ' ' + last_names[nums.shift() % last_names.length];
}

$(document).ready(function() {
  $.ajax({
    url: window.location.pathname + '/xorshift128plus',
    method: 'GET',
    dataType: 'json',
    cache: false,
    success: function(nums) {
      add_winners(nums.shift());
      create_winrate_table(nums);
      var rand1 = getRandonNumber(nums);
      var rand2 = getRandonNumber(nums);
      var f = function(num) { return -Math.exp(-num*rand1) + 1 + Math.sin(num*1/Math.sqrt(rand2))*rand2; };
      draw_plot({
        xmin: 0,
        xmax: 3,
        xlabel: 'Season',
        ylabel: 'Batting Average',
        title: "A Summary of " + get_random_name(nums) + "'s Batting Average over the Season",
        description: "The top player for the " + window.teams[nums.shift() % window.teams.length]
      }, [{
        f: f
      }]);
      var rand3 = getRandonNumber(nums);
      var rand4 = getRandonNumber(nums);
      var coolf = (rand3 < 0.5) ? Math.sin : Math.cos;
      var f2 = function(num) { return coolf(num*rand4*3.1415)*num + rand3; };
      draw_plot({
        xmin: -3,
        xmax: 3,
        xlabel: 'idk tbh',
        ylabel: 'Mood',
        title: get_random_name(nums) + "'s Mood",
        description: "The top player for the " + window.teams[nums.shift() % window.teams.length]
      }, [{
        f: f2,
        stroke: 'red'
      }]);
      var rand5 = getRandonNumber(nums);
      var rand6 = getRandonNumber(nums);
      var f3 = function(num) { return Math.pow(num, 1/rand5) + Math.cos(num*10)/10 };
      draw_plot({
        xmin: 0,
        xmax: 1.5,
        xlabel: 'Growth',
        ylabel: 'Revenue',
        title: 'Revenue vs growth over time',
      }, [{
        f: f3,
        stroke: 'purple'
      }, {
        f: function(n) { return Math.sqrt(f3(n)+rand6); },
        stroke: 'orange'
      }]);
    }
  });

  $( "#predictions" ).sortable({
    stop: function(e, ui) {
      var result = [];
      var $predictions = $('#predictions li');
      for (var i = 0; i < $predictions.length; i++) {
        var $prediction = $($predictions.get(i));
        result.push(parseInt($prediction.data('value'), 10));
      }
      console.log(result);
      $("#predictionInput").val(JSON.stringify(result));
    }
  });
});
