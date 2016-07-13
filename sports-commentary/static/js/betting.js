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

$(document).ready(function() {
  $.ajax({
    url: window.location.pathname + '/xorshift128plus',
    method: 'GET',
    dataType: 'json',
    cache: false,
    success: function(nums) {
      var rankings = permutation_to_teams(number_to_permutation(nums[0]));
      $('#winners').empty();
      for (var i = 0; i < rankings.length; i++) {
        $('<li>' + rankings[i] + '</li>').appendTo('#winners');
      }
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
