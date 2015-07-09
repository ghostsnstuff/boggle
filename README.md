Boggle
======

Environment
-----------

To run this project, you'll need Node.js installed. The application has been tested with v0.10.35, v0.11.15, and v0.12.0.

To install the application dependencies, run:

    npm install

To start the application, run:

    npm start

A web server will start on port 8000. You can change the port by passing a `PORT` environment variable, for example:

    PORT=8080 npm start

Project
----------

A browser-based version of the game Boggle. If you're not familiar with Boggle, it's a word game where you try to make words from adjacent letters in a grid of letters. The longer the word, the more points you score.

The functionality is implemented according to the following specification:

### I. Game Grid

When the page loads, the game UI is displayed, including a 5-by-5 grid of the Boggle dice.

* The page displays a 5-by-5 grid of dice from the following list:

        aaafrs
        aaeeee
        aafirs
        adennn
        aeeeem
        aeegmu
        aegmnn
        afirsy
        bjkqxz
        ccenst
        ceiilt
        ceilpt
        ceipst
        ddhnot
        dhhlor
        dhlnor
        dhlnor
        eiiitt
        emottt
        ensssu
        fiprsy
        gorrvw
        iprrry
        nootuw
        ooottu

    (Each row in this list corresponds to a die, with each letter being one face of the die. For example, the first row represents a single die with the six faces "a", "a", "a", "f", "r", and "s".)

* Each die is displayed in a random position in the grid.
* A "Current Word" section shows the current word being built.
* A "Score" table shows all the words played, their point value, and the total score for the session.

### II. Core Gameplay

Gameplay involves clicking on dice one by one to build up a word. You can only click on dice that are adjacent to your last selected die and that are not already selected; you cannot wrap around the game board, but you can select dice diagonally adjacent to the last selected die.

* Clicking any die when no dice are currently selected selects that die.
* Selecting a die changes its color and adds its letter to the "Current Word" display.
* Clicking on a non-selected die adjacent to the last selected die (diagonals included) additionally selects that die.
* The most recently selected die can be unselected by clicking on it, which removes its letter from the "Current Word" display.
* This process can be repeated to un-select all selected dice by clicking them in reverse order.
* Clicking the "Submit Word" button adds the word to the "Score" list along with its point value and updates the total score.
* Submitting a word deselects all currently selected dice.

### III. Scoring

Point values for words scored in Boggle are determined by the length of the word submitted.

* Words already submitted score no points (and do not appear in the score list a second time).
* Submitted words are scored as follows based on the length of the word:
    * 1-2 letters: 0 points
    * 3-4 letters: 1 point
    * 5 letters: 2 points
    * 6 letters: 3 points
    * 7 letters: 5 points
    * 8 or more letters: 11 points
