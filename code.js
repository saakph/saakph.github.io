// Extract Elements
let initialButton = document.querySelector("#show-input");
let startGameSection = document.querySelector("#start-game-section");
let userInputSection = document.querySelector("#user-input-section");
let inputLabel = document.querySelector("#user-input-label");
let userInput = document.querySelector("#user-input");
let userInputHeader = document.querySelector("#user-input-header");
let startGameButton = document.querySelector("#start-game");
let currentPlayerHeader = document.querySelector("#show-players-header");
let mainGameSection = document.querySelector("#main-game-section");
let pairsAmount = document.querySelector("#pattern-length");
let mainCardDiv = document.querySelector("#card-div");
let turnDisplay = document.querySelector("#turn-display");
let scoreboard = document.querySelector("#scoreboard");
let difficultyDisplay = document.querySelector("#difficulty-header");
let winHeader = document.querySelector("#win-display");
let resetButton = document.querySelector("#reset-game-button");

// Create Variables & Initialize
let cardsFlipped = 0;
let flippedCardValues = [];
let cardsCorrect = [];
let gameStarted = false;
let playerCount = 0;
let players = [];
let points = [];
let patternList = ["♔", "♕", "♖", "♗", "♘", "♙", "♚", "♛", "♜", "♝", "♞", "♟"]; // theme: chess
let allCards = [];
let pattern = [];
let shownCardsIndex = [];
let shownCards = [];
let turnCount = 0;
let playerIndex;
let cardHeight = 152;
let cardWidth = 100;
let cardMargin = 5;
let slideCards = [];

startGameButton.disabled = true;
userInputSection.style.display = "none";
mainGameSection.style.display = "none";
winHeader.style.display = "none";
resetButton.style.display = "none";
startGameButton.style.color = "#686868";

// User Input Events
pairsAmount.addEventListener("keydown", function allowEnter(event) {
    
    // Get key
    let key = event.key;

    // Decipher
    if(players.length >= 2 && key === "Enter"){

        // Begin Game if user presses enter on the pattern length input
        runGame();
    }

});

userInput.addEventListener("keydown", function addPlayer(event) {
    
    // Check which key was pressed
    let key = event.key;
    let player = userInput.value;
    
    // Decipher
    if(key === "Enter"){
        
        // Add to list
        if(players.length < 7 && player != "" && player.length <= 10){
            players.push(player);
            points.push(0);
            
            // Recursion and change display
            playerCount++;
            inputLabel.textContent = "Enter Player " + (playerCount + 1) + "'s Name: ";
            currentPlayerHeader.textContent = "Current Players: " + players[0];
            userInput.value = "";
            
            for(let player = 1; player < players.length; player++){
                currentPlayerHeader.textContent += ", " + players[player];
            }
            userInputHeader.textContent = "You need between 2-7 players to begin the game. Click enter to submit each name. ";
            
        } 
        
        // Max amount of players has been met
        if(players.length == 7){
            inputLabel.textContent = "The max player limit has been met. ";
            userInputHeader.textContent = "Adjust other settings as necessary and begin the game. ";
            
        } 
        
        // Invalid input/no input
        if(player == "" && players.length < 7){
            userInputHeader.textContent = "Please enter a valid input. ";
            
        }
        
        // Name has too many characters
        if(player.length > 10 && players.length < 7){
            userInputHeader.textContent = "Sorry, but that is too long. Please enter a name with 10 or less characters. ";
            
        }
        
    }
    
    // Allow user to play game if there are at least 2 players
    if(players.length > 1){
        startGameButton.disabled = false;
        startGameButton.style.color = "#d1c2b2";
    }
    
});



/* Functions */

// Function to show difficulty level
function adjustDifficulty(){
    
    // Extract
    let amount = pairsAmount.value;

    // Change header based on value
    if(amount >= 5){
        difficultyDisplay.textContent = "Difficulty: Easy";
    }

    if(amount > 7){
        difficultyDisplay.textContent = "Difficulty: Medium";
    } 
    
    if(amount > 10){
        difficultyDisplay.textContent = "Difficulty: Hard";
    }
}

// Function to show user input section
function showInput(){

    // Change displays
    userInputSection.style.display = "block";
    startGameSection.style.display = "none";
    startGameButton.style.display = "block";

    // Focus on user input
    userInput.focus();
}

// Function to run game
function runGame(){
    
    // Hide
    startGameSection.style.display = "none";
    startGameButton.style.opacity = "0%";
    userInputSection.style.display = "none";
    mainGameSection.style.display = "flex";
    turnDisplay.style.display = "block";
    gameStarted = true;

    // Initialize turns
    switchTurns();

    // Generate Pattern
    generatePattern();

    // Create Cards
    createCards();

    // Initialize Scoreboard
    initializeScores();

}

// Function to initialize scoreboard
function initializeScores(){

    // Loop
    for(let index = 0; index < players.length; index++){

        // Create Element
        let container = document.createElement("div");
        let name = document.createElement("h4");
        let score = document.createElement("h4");

        // Change Properties
        score.classList = "scores";

        name.textContent = players[index];
        score.textContent = points[index];

        container.style.display = "flex";
        container.style.justifyContent = "space-between";

        // Append
        scoreboard.append(container);
        container.append(name);
        container.append(score);

    }
}

// Function to generate a random pattern
function generatePattern(){

    // Determine length
    let length = pairsAmount.value;

    // Loop and add to array
    for(let index = 0; index < length; index++){
        let item = patternList[index];

        // Push twice (due to pairs)
        pattern.push(item);
        pattern.push(item);
    }

    // Shuffle Pattern
    shuffle(pattern);

}

// Function to shuffle pattern
function shuffle(pattern){

    // Create Variables
    let number1 = pattern.length;
    let number2 = 0;
    let temporary;

    // Loop
    while(number1--){

        // Choose randomly
        number2 = Math.floor(Math.random() * (number1 + 1));

        // Swap using Fisher-Yates Shuffle
        temporary = pattern[number1];
        pattern[number1] = pattern[number2];
        pattern[number2] = temporary;

    }
}

// Function to create cards
function createCards(){

    // Determine how many to create
    let amount = pairsAmount.value * 2;

    // Loop
    for(let index = 0; index < amount; index++){
        
        // Create Element
        let perspectiveContainer = document.createElement("div");
        let cardContainer = document.createElement("div");
        let cardFront = document.createElement("div");
        let cardBack = document.createElement("div");

        // Set Properties //
        mainCardDiv.style.display = "flex";
        mainCardDiv.style.flexWrap = "wrap";
        mainCardDiv.style.width = "60vw";

        perspectiveContainer.style.perspective = "600px";
        perspectiveContainer.style.position = "absolute";
        cardBack.textContent = pattern[index];

        // Initialize location of cards
        perspectiveContainer.style.transform = "translateX(" + (mainCardDiv.clientWidth) + "px)";
        
        cardContainer.style.position = "relative";
        cardContainer.style.width = cardWidth + "px";
        cardContainer.style.height = cardHeight + "px";
        cardContainer.style.transformStyle = "preserve-3d";
        cardContainer.style.margin = "auto " + cardMargin + "px";
        cardContainer.classList = "cards";
        cardContainer.style.transition = "all 0.5s ease";
        cardContainer.style.border = "5px solid white"; 
        
        cardFront.style.position = "absolute";
        cardFront.style.width = "100%";
        cardFront.style.height = "100%";
        cardFront.style.backfaceVisibility = "hidden";
        cardFront.classList = "front";
        cardFront.style.backgroundColor = "white";
        
        cardBack.style.position = "absolute";
        cardBack.style.width = "100%";
        cardBack.style.height = "100%";
        cardBack.style.backfaceVisibility = "hidden";
        cardBack.style.transform = "rotateY(180deg)";
        cardBack.classList = "back";

        // Click Event for Flip
        cardContainer.addEventListener("click", function(){
            flipCard(cardContainer, index);
        });

        // Add
        mainCardDiv.append(perspectiveContainer);
        perspectiveContainer.append(cardContainer);
        cardContainer.append(cardFront);
        cardContainer.append(cardBack);
        
        // Add to arrays
        allCards.push(cardContainer);
        slideCards.push(perspectiveContainer);
        
    }
    
    // Slide animation
    setTimeout(cardSlide, 100);
}

// Function for cool slide animation :D
function cardSlide(){
    
    // Create Variables
    let count = slideCards.length - 1;
    let row = 0;
    let horizontal = 0;
    let vertical = cardHeight + cardMargin + cardMargin + 5;
    let zValue = 0;
    
    // Loop
    let animation = setInterval(() => {
        
        // Get current card
        let card = slideCards[count];
        
        // Check for wrap
        if(row == 0){
            card.style.transform = "translateX(" + horizontal + "px)";
            
        } else {
            card.style.transform = "translateX(" + horizontal + "px) translateY(" + vertical + "px)";
            card.style.zIndex = zValue;
        }
        
        // For smooth movement
        card.style.transition = "all 0.7s linear";
        
        // Recursion
        count--;
        horizontal = horizontal + (cardWidth + cardMargin);
        
        // Reset if horizontal is equal to width of container (row is full)
        if(horizontal >= (mainCardDiv.clientWidth - (cardWidth + cardMargin + cardMargin))){
            horizontal = 0;
            
            // Add to row and vertical transformation
            row++;
            vertical = (cardHeight + cardMargin + cardMargin + 5) * row;
            zValue++;
            
        }
        
        // End interval
        if(count == -1){
            clearInterval(animation);
        }

    }, 250);
}

// Function to flip card
function flipCard(card, cardIndex){

    // Create Variable
    let match;

    // Prevent user from clicking the same card twice
    // (only push card into list if it is different)
    if(shownCardsIndex[0] != cardIndex && card.style.transform != "rotateY(180deg)"){
        shownCardsIndex.push(cardIndex);
        shownCards.push(card);
        
        // Prevent user from flipping over more than 2 cards
        if(shownCards.length <= 2){

            // Flip
            card.style.transform = "rotateY(180deg)";
        }
        
    }
    
    // Decipher
    if(shownCards.length == 2){

        // Check for match
        match = checkMatch();
        
        // Decipher
        if(!match){

            // Flip Card over after some time
            setTimeout(() => {
                shownCards[0].style.transform = "rotateY(0deg)";
                shownCards[1].style.transform = "rotateY(0deg)";
                shownCardsIndex = [];
                shownCards = [];
                
                // Switch Turns
                switchTurns();
                
            }, 1000);

        } else {
            shownCards = [];
            shownCardsIndex = [];
            
            // Add to score
            updateScore(playerIndex);

            // Check for win
            checkWin();
        }

    }
    
}

// Function to check for win
function checkWin(){

    // Create variable
    let flipped = 0;

    // Loop through all cards to check if they are all flipped
    for(let card of allCards){

        // Decipher
        if(card.style.transform == "rotateY(180deg)"){
            
            // Add to variable
            flipped++;

        }
    }

    // Check
    if(flipped == allCards.length){
        winScenario();
    }

}

// Function for win scenario
function winScenario(){

    // Get winner's name and score
    let name;
    let nameIndex = -1;
    let score = points[0];
    let tie = true;
    let tieIndex = [];

    // Loop through all points
    for(let index = 0; index < points.length; index++){

        let currentItem = points[index];

        // Decipher
        if(currentItem > score){
            
            // Change score and name index
            score = currentItem;
            nameIndex = index;
            tie = false;

        } else if(currentItem == score){

            // Tie
            tie = true;
            tieIndex.push(index);

        } 
        
    }

    // Get name based on high score
    if(!tie){
        name = players[nameIndex];
        
        // Display
        winHeader.style.display = "block";
        winHeader.textContent = name + " won with a total score of " + score + "! ";
        resetButton.style.display = "block";

    } else {

        // Get all names
        winHeader.textContent = players[tieIndex[0]];

        for(let index = 1; index < tieIndex.length; index++){

            // Adjust text
            if(index == (tieIndex.length - 1)){

                // Formatting
                if(tieIndex.length == 2){
                    winHeader.textContent += " and " + players[tieIndex[index]];

                } else {
                    winHeader.textContent += ", and " + players[tieIndex[index]];

                }
                
            } else {
                winHeader.textContent += ", and " + players[tieIndex[index]];

            }
        }

        // Change text
        winHeader.textContent += " won the game with a total score of " + score + "!";
        
        // Display
        winHeader.style.display = "block";
        resetButton.style.display = "block";

    }

}

// Function to update a player's score
function updateScore(index){

    // Get Current Score
    let current = points[index];

    // Add
    current++;

    // Change value
    points[index] = current;

    // Change display
    changeDisplay(index, current);

}

// Function to change scoreboard display
function changeDisplay(index, score){

    // Get element
    let allScores = document.querySelectorAll(".scores");
    let scoreElement = allScores[index];

    // Change value
    scoreElement.textContent = score;

}

// Function to switch player turns
function switchTurns(){

    // Get player name and turn
    playerIndex = turnCount % players.length;
    let name = players[playerIndex];

    // Display
    turnDisplay.textContent = "Round " + (turnCount + 1) + ": " + name + "'s Turn. ";
    
    // Recursion
    turnCount++;

}

// Function to check for a match
function checkMatch(){

    // Get Values
    let card1Index = shownCardsIndex[0];
    let card2Index = shownCardsIndex[1];
    let card1 = pattern[card1Index];
    let card2 = pattern[card2Index];

    // Determine
    if(card1 == card2){
        return true;

    } else {
        return false;
    }
    
}

// Function to reset game
function resetGame(){

    // Reset Scores
    for(let index = 0; index < players.length; index++){
        points[index] = 0;
    }

    // Remove all children
    scoreboard.innerHTML = "";
    let header = document.createElement("h2");
    header.textContent = "Scoreboard";
    scoreboard.append(header);
    initializeScores();

    // Remove all children
    mainCardDiv.innerHTML = "";

    // Shuffle Cards
    pattern = [];
    generatePattern();

    // Display cards
    createCards();

    // Reset Turns
    turnCount = 0;
    switchTurns();

    // Hide
    resetButton.style.display = "none";
    winHeader.textContent = "";
    winHeader.style.display = "none";

}