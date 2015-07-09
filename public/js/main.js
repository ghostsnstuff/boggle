(function () {
  'use strict';

  var DICE = [
    'aaafrs', 'aaeeee', 'aafirs', 'adennn', 'aeeeem',
    'aeegmu', 'aegmnn', 'afirsy', 'bjkqxz', 'ccenst',
    'ceiilt', 'ceilpt', 'ceipst', 'ddhnot', 'dhhlor',
    'dhlnor', 'dhlnor', 'eiiitt', 'emottt', 'ensssu',
    'fiprsy', 'gorrvw', 'iprrry', 'nootuw', 'ooottu'
  ];

  var POINT_SCALE = {
    1: 0,
    2: 0,
    3: 1,
    4: 1,
    5: 2,
    6: 3,
    7: 5,
    8: 11
  };

  var N = 5;

  var diceFaces = genRandomDiceValues(DICE);
  var board = genRandomBoardValues(diceFaces);

  var adjacencyMatrix = genAdjacencyMatrix(board);
  var adjacencyList = genAdjacencyList(adjacencyMatrix);

  var selectedLetters = [];
  var wordsUsed = [];
  var DICT = {};


  // UI entry point
  $(document).ready(function onReady () {
    var boardSrc, boardTemplate;

    Handlebars.registerHelper('toUpperCase', function toUpperCase (str) {
      return str.toUpperCase();
    });

    boardSrc = $('#dice').html();
    boardTemplate = Handlebars.compile(boardSrc);

    $('#boggle-board').append(boardTemplate(adjacencyList));

    renderScoreBoard(wordsUsed, 0);

    // Select dice handler
    $('.dice-container').click(selectDiceHandler);

    // Submit word handler
    $('button').click(submitWordHandler);

    // New game handler
    $('#btn-new-game').click(newGameHandler);

    // Question handler
    $('#btn-question').click(questionHandler);

    $.get('../words.txt', function (txt) {
      txt.split('\n').forEach(function each (word) {
        DICT[word] = true;
      });
    })
  });


  /**
   * Core gameplay logic
   * Tests for dice adjacency and manages state w/ respect to user input
   * @param {Object} event
   */
  function selectDiceHandler (event) {
    var vertex = Number($(this).children().attr('data-id'));
    var prevLetter = selectedLetters[selectedLetters.length-1];

    if (prevLetter && vertex === prevLetter.vertex) {
      selectedLetters.pop();
      $(this).removeClass('selected');
    } else if (!selectedLetters.length) {
      selectedLetters.push(adjacencyList[vertex]);
      $(this).addClass('selected');
    } else {
      var adjVertices = prevLetter.connections
        .map(function onMap (connection) {
          return connection.vertex;
        });

      var slVertices = selectedLetters
        .map(function onMap (vertex) {
          return vertex.vertex;
        });

      if (adjVertices.indexOf(vertex) !== -1 && slVertices.indexOf(vertex) === -1) {
        selectedLetters.push(adjacencyList[vertex]);
        $(this).addClass('selected');
      }
    }

    var currentWord = selectedLetters
      .map(function onMap (letter) {
        return letter.value;
      })
      .join('')
      .toUpperCase();

    $('#current-word-value').text(currentWord);
  }


  /**
   * Handles word submission and updates scoreboard
   * @param {Object} event
   */
  function submitWordHandler (event) {
    var currentWord, points, totalPoints;

    currentWord = $('#current-word-value').text();

    if (!currentWord.length) {
      event.preventDefault();
    } else if (DICT[currentWord.toLowerCase()]) {
      points = currentWord.length >= 8 ? 11 : POINT_SCALE[currentWord.length];
      totalPoints = Number($('#total-points').text()) + points;

      wordsUsed.push({ word: currentWord, points: points });

      renderScoreBoard(wordsUsed, totalPoints);

      $('.selected').each(function onEach (idx, el) {
        selectedLetters = [];
        $(el).removeClass('selected');
      });

      $('#current-word-value').text('');
    } else {
      alert('Invalid Word: ' + currentWord);
    }
  }


  /**
   * Renders scoreboard template
   * @param {Array}  selectedWords
   * @param {Number} totalPoints
   */
  function renderScoreBoard (selectedWords, totalPoints) {
    var sbSrc, sbTemplate;

    sbSrc = $('#word-points').html();
    sbTemplate = Handlebars.compile(sbSrc);

    $('#score-board').html(sbTemplate(selectedWords));
    $('#total-points').text(totalPoints);
  }

  // Reload page
  function newGameHandler () {
    document.location.reload();
  }

  // Question mark animation thingy
  function questionHandler () {
    $('#btn-question').addClass('hide');
    $('#btn-mario-qmark').removeClass('hide');

    setTimeout(function onTimeout () {
      $('#btn-question').removeClass('hide');
      $('#btn-mario-qmark').addClass('hide');
    }, 3000);
  }


  /**
   * Random number generator
   * @param  {Number} min
   * @param  {Number} max
   * @return {Number}
   */
  function genRandomNumber (min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }


  /**
   * Randomly selects dice face value
   * @param  {Array} dice
   * @return {Array}
   */
  function genRandomDiceValues (dice) {
    return dice.map(function onMap (die) {
      var idx = genRandomNumber(0, N);
      return die[idx];
    });
  }


  // Fisher-Yates: http://en.wikipedia.org/wiki/Fisher%E2%80%93Yates_shuffle#The_modern_algorithm
  function genRandomBoardValues (dice) {
    var _dice = dice;

    for (var i = _dice.length - 1; i > 0; i--) {
      var j = genRandomNumber(0, i);
      var temp = _dice[i];
      _dice[i] = _dice[j];
      _dice[j] = temp;
    }

    return _dice;
  }


  /**
   * Construct adjacency matrix (undirected graph)
   * @param  {Array} nodes
   * @return {Array}
   */
  function genAdjacencyMatrix (nodes) {
    var adjacencyMatrix = [], row = [], idx = 0;

    for (var i = 0; i < nodes.length; i++) {
      var node = { vertex: idx++, value: nodes[i] };

      if (i !== 0 && (i % N) === 0) {
        adjacencyMatrix.push(row);
        row = [];
      } else if (i === nodes.length - 1) {
        adjacencyMatrix.push(row);
      }

      row.push(node);
    }

    return adjacencyMatrix;
  }


  /**
   * Construct adjacency list (undirected graph)
   * @param  {Array} matrix
   * @return {Array}
   */
  function genAdjacencyList (matrix) {
    var adjacencyList = [];

    for (var i = 0; i < N; i++) {
      for (var j = 0; j < N; j++) {
        var connections = [];

        // Right edge
        if (j < N - 1) {
          connections.push(matrix[i][j+1]);
        }

        // Left edge
        if (j > 0) {
          connections.push(matrix[i][j-1]);
        }

        // Top edge
        if (i > 0) {
          connections.push(matrix[i-1][j]);
        }

        // Bottom edge
        if (i < N - 1) {
          connections.push(matrix[i+1][j]);
        }

        // Topleft edge
        if (i > 0 && j > 0) {
          connections.push(matrix[i-1][j-1]);
        }

        // Topright edge
        if (i > 0 && j < N - 1) {
          connections.push(matrix[i-1][j+1]);
        }

        // Bottomleft edge
        if (j > 0 && i < N - 1) {
          connections.push(matrix[i+1][j-1]);
        }

        // Bottomright edge
        if (i < N - 1 && j < N - 1) {
          connections.push(matrix[i+1][j+1]);
        }

        matrix[i][j].connections = connections;

        adjacencyList.push(matrix[i][j]);
      }
    }

    return adjacencyList;
  }

}());
