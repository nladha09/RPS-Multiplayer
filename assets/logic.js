$(document).ready(function () {
    gameRef = firebase.database().ref().child('Players');

    // initialize Variables
    var numPlayers = 2;
    var playerName = "";
    var playerWins = 0;
    var playerLoses = 0;
    var playerChoice = "";
    //var playerChoice = "";
    var playingState = "";

    var player_one_name = "";
    var player_one_wins = 0;
    var player_one_loses = 0;
    var player_one_choice = "";

    var player_two_name = "";
    var player_two_wins = 0;
    var player_two_loses = 0;
    var player_two_choice = "";


    // creating object to manage users joining the game
    PlayingState = {
        Watching: 0,
        Joining: 1,
        Playing: 2
    };

    PlayerChoice = {
        shield: "shield",
        fire: "fire",
        sword: "sword"
    }


    $("form").submit(function (e) {
        playingState = PlayingState.Watching;
        e.preventDefault();
        playerName = $("#user").val();
        console.log(playerName);
        waitingToJoin();
    });

    var waitingToJoin = function () {
        // listen on "online" location for player 0 
        gameRef.child("player0/online").on("value", function (snapshot) {
            var value = snapshot.val();
            if (value === null && playingState === PlayingState.Watching) {
                tryingToJoin(0);
            };
        });

        // listen on "online" location for player 1
        this.gameRef.child("player1/online").on("value", function (snapshot) {
            var value = snapshot.val();
            if (value === null && playingState === PlayingState.Watching) {
                tryingToJoin(1);
            };
        });
    };

    var tryingToJoin = function (playerNum) {
        // set player to join a slot in the game
        playingState = PlayingState.Joining;
        gameRef.child("player" + playerNum + "/online").transaction(function (snapshot) {
            if (snapshot === null) {
                return true;
            } else {
                return; // >abort! didn't get in.
            }
        }, function (error, committed) {
            if (committed) {
                playingState = PlayingState.Playing;
                syncToFirebase(playerNum);
            } else {
                playState = PlayingState.Watching;
            };
        });
    };

    var syncToFirebase = function (playerNum) {
        var p1_pick = "";
        var p2_pick = "";

        gameRef.child('player' + playerNum + '/online').set({
            Name: playerName,
            Wins: playerWins,
            Loses: playerLoses,
            Choice: playerChoice
        });

        // if Player One disconnects from the game. Clear our "online" status so somebody else can join.
        gameRef.child("player0").child("online").onDisconnect().remove();

        // if Player Two disconnects from the game. Clear our "online" status so somebody else can join.
        gameRef.child("player1").child("online").onDisconnect().remove();

        // control the players
        playerOneRef = gameRef.child('player0/online');
        playerTwoRef = gameRef.child('player1/online');

        playerOneRef.on("value", function (playerOneSnapshot) {
            if (playerOneSnapshot.val() !== null) {

                player_one_name = playerOneSnapshot.val().Name;
                player_one_wins = playerOneSnapshot.val().Wins;
                player_one_loses = playerOneSnapshot.val().Loses;
                player_one_choice = playerOneSnapshot.val().Choice;
                // remove submit button, text label, and replace "waiting for player one"
                // with the players name
                $("#submit-btn").remove();
                $("#user").remove();
                $("#player-one-text").empty();
                $("#player-one-text").append("Welcome " + player_one_name + " You Are Player 1");

                //***** create a div to display info for Player One *****//
                // create the div to display player one name
                var plNameText = $("<h4>");
                plNameText.text(player_one_name);
                $("#p1-name-text").html(plNameText);

                // create the div to display player one shield text
                var plshieldText = $("<a href='#'>");
                plshieldText.text("shield");
                $("#p1-shield-text").html(plshieldText);

                // create the div to display player one fire text
                var p1fireText = $("<a href='#'>");
                p1fireText.text("fire");
                $("#p1-fire-text").html(p1fireText);

                // create the div to display player on sword text
                var p1swordText = $("<a href='#'>");
                p1swordText.text("sword");
                $("#p1-sword-text").html(p1swordText);

                // create the div to display player one wins
                var p1NumWins = $("<h4>");
                p1NumWins.text("Wins: ");
                p1NumWins.append("<span class='p1Wins'>" + player_one_wins + '</span>');
                $("#p1-wins-text").html(p1NumWins);

                // create the div to display player one loses
                var p1NumLoses = $("<h4>");
                p1NumLoses.text("Loses: ");
                p1NumLoses.append("<span class='p1Loses'>" + player_one_loses + '</span>');
                $("#p1-loses-text").html(p1NumLoses);


            };
        });


        playerTwoRef.on("value", function (playerTwoSnapshot) {
            if (playerTwoSnapshot.val() !== null) {
                player_two_name = playerTwoSnapshot.val().Name;
                player_two_wins = playerTwoSnapshot.val().Wins;
                player_two_loses = playerTwoSnapshot.val().Loses;
                player_two_choice = playerTwoSnapshot.val().Choice;

                $("#submit-btn").remove();
                $("#user").remove();
                $("#player-two-text").empty();
                $("#player-two-text").append("Welcome " + player_two_name + " You Are Player 2");
                //***** create the div to display info for Player Two *****//
                // create the div to display Player Two Name
                var p2NameText = $("<h4>");
                p2NameText.text(player_two_name);
                $("#p2-name-text").html(p2NameText);

                // create the div to display player two shield Element
                var p2shieldText = $("<a href='#'>");
                p2shieldText.text("shield");
                $("#p2-shield-text").html(p2shieldText);

                // create the div to display player two fire Element
                var p2fireText = $("<a href='#'>");
                p2fireText.text("fire");
                $("#p2-fire-text").html(p2fireText);

                // create the div to display player two sword Element
                var p2swordText = $("<a href='#'>");
                p2swordText.text("sword");
                $("#p2-sword-text").html(p2swordText);

                // create the div to display player two Number of Wins Element
                var p2NumWins = $("<h4>");
                p2NumWins.text("Wins: ");
                p2NumWins.append("<span class='p2Wins'>" + player_two_wins + '</span>');
                $("#p2-wins-text").html(p2NumWins);

                // create the div to display player two Number of Loses Element
                var p2NumLoses = $("<h4>");
                p2NumLoses.text("Loses: ");
                p2NumLoses.append("<span class='p2Loses'>" + player_two_loses + '</span>');
                $("#p2-loses-text").html(p2NumLoses);


                var wait = $("<h4>");
                wait.text("Player Two, please wait while Player One makes a selection");
                $('#player-two-choice').html(wait);
            };
        });
    }

    //*****Player One Click Events*****//
    $('#p1-shield-text').on("click", function (e) {
        e.preventDefault();
        player_one_choice = PlayerChoice.shield;
        startPlaying();
    });

    $('#p1-fire-text').on("click", function (e) {
        e.preventDefault();
        player_one_choice = PlayerChoice.fire;
        startPlaying();
    });

    $('#p1-sword-text').on("click", function (e) {
        e.preventDefault();
        player_one_choice = PlayerChoice.sword;
        startPlaying();
    });

    //*****Player Two Click Event*****??
    $('#p2-shield-text').on("click", function (e) {
        e.preventDefault();
        player_two_choice = PlayerChoice.shield;
        startPlaying();
    });

    $('#p2-fire-text').on("click", function (e) {
        e.preventDefault();
        player_two_choice = PlayerChoice.fire;
        startPlaying();
    });

    $('#p2-sword-text').on("click", function (e) {
        e.preventDefault();
        player_two_choice = PlayerChoice.sword;
        startPlaying();
    });


    var startPlaying = function () {
        // control the players
        playerOneRef = gameRef.child('player0/online');
        playerTwoRef = gameRef.child('player1/online');

        // if Player One chose shield
        if (player_one_choice === PlayerChoice.shield) {
            console.log(player_one_choice);

            playerOneRef.child('Choice').transaction(function (dataOneSnapshot) {
                dataOneSnapshot = player_one_choice;
                return dataOneSnapshot;
            });

            playerOneRef.on("value", function (playerOneSnapshot) {
                var value = playerOneSnapshot.val().Choice;
                console.log(value);
            });
        };

        // if Player One chose fire
        if (player_one_choice === PlayerChoice.fire) {
            console.log(player_one_choice);

            playerOneRef.child('Choice').transaction(function (dataOneSnapshot) {
                dataOneSnapshot = player_one_choice;
                return dataOneSnapshot;
            });

            playerOneRef.on("value", function (playerOneSnapshot) {
                var value = playerOneSnapshot.val().Choice;
                console.log(value);
            });
        };

        // if Player One chose sword
        if (player_one_choice === PlayerChoice.sword) {
            console.log(player_one_choice);

            playerOneRef.child('Choice').transaction(function (dataOneSnapshot) {
                dataOneSnapshot = player_one_choice;
                return dataOneSnapshot;
            });

            playerOneRef.on("value", function (playerOneSnapshot) {
                var value = playerOneSnapshot.val().Choice;
                console.log(value);
            });
        };

        // if Player Two chose shield
        if (player_two_choice === PlayerChoice.shield) {
            console.log(player_two_choice);

            playerTwoRef.child('Choice').transaction(function (dataTwoSnapshot) {
                dataTwoSnapshot = player_two_choice;
                return dataTwoSnapshot;
            });

            playerTwoRef.on("value", function (playerTwoSnapshot) {
                var value = playerTwoSnapshot.val().Choice;
                console.log(value);
            });
        };

        // if Player Two chose fire
        if (player_two_choice === PlayerChoice.fire) {
            console.log(player_two_choice);

            playerTwoRef.child('Choice').transaction(function (dataTwoSnapshot) {
                dataTwoSnapshot = player_two_choice;
                return dataTwoSnapshot;
            });

            playerTwoRef.on("value", function (playerTwoSnapshot) {
                var value = playerTwoSnapshot.val().Choice;
                console.log(value);
            });
        };

        // if Player Two chose sword 
        if (player_two_choice === PlayerChoice.sword) {
            console.log(player_two_choice);

            playerTwoRef.child('Choice').transaction(function (dataTwoSnapshot) {
                dataTwoSnapshot = player_two_choice;
                return dataTwoSnapshot;
            });

            playerTwoRef.on("value", function (playerTwoSnapshot) {
                var value = playerTwoSnapshot.val().Choice;
                console.log(value);
            });
        };

        // check if both players have made a selection, call calculateWinner()
        if (player_one_choice !== "" && player_two_choice !== "") {
            calculateWinner();
        }

    };// end playerTwoStartPlaying


    var calculateWinner = function () {
        if (player_one_choice === "shield" && player_two_choice === "sword") {
            // player One Wins and Player Two Loses
            player_one_wins++;
            player_two_loses++;
            playerOneWins();
        };

        if (player_one_choice === "shield" && player_two_choice === "fire") {
            // player One Loses and Player Two Wins
            player_one_loses++;
            player_two_wins++;
            playerTwoWins();
        };

        if (player_one_choice === "shield" && player_two_choice === "shield") {
            // no one wins 
            showNoWinners();
        };

        if (player_one_choice === "fire" && player_two_choice === "shield") {
            // player One Wins and Player Two Loses
            player_one_wins++;
            player_two_loses++;
            playerOneWins();
        };

        if (player_one_choice === "fire" && player_two_choice === "fire") {
            // no one wins... 
            showNoWinners();
        };

        if (player_one_choice === "fire" && player_two_choice === "sword") {
            // player One Loses and Player Two Wins
            player_one_loses++;
            player_two_wins++;
            playerTwoWins();
        };

        if (player_one_choice === "sword" && player_two_choice === "sword") {
            // no one wins... 
            showNoWinners();
        };

        if (player_one_choice === "sword" && player_two_choice === "fire") {
            // player One Wins and Player Two Loses
            player_one_wins++;
            player_two_loses++;
            playerOneWins();
        };

        if (player_one_choice === "sword" && player_two_choice === "shield") {
            // player One Loses and Player Two Wins
            player_one_loses++;
            player_two_wins++;
            playerTwoWins();
        };

    };

    var playerOneWins = function () {
        // control the players
        playerOneRef = gameRef.child('player0/online');
        playerTwoRef = gameRef.child('player1/online');

        playerOneRef.child('Wins').transaction(function (dataWinSnapshot) {
            dataWinSnapshot = player_one_wins;
            return dataWinSnapshot;
        });

        playerTwoRef.child('Loses').transaction(function (dataLoseSnapshot) {
            dataLoseSnapshot = player_two_loses;
            return dataLoseSnapshot;
        });

        showPlayerOneWon();
    };

    var playerTwoWins = function () {
        // control the players
        playerOneRef = gameRef.child('player0/online');
        playerTwoRef = gameRef.child('player1/online');

        playerOneRef.child('Loses').transaction(function (dataLoseSnapshot) {
            dataLoseSnapshot = player_one_loses;
            return dataLoseSnapshot;
        });

        playerTwoRef.child('Wins').transaction(function (dataWinSnapshot) {
            dataWinSnapshot = player_two_wins;
            return dataWinSnapshot;
        });

        showPlayerTwoWon();
    };

    var showPlayerOneWon = function () {
        var p1ChoiceTag = $("<h4>");
        p1ChoiceTag.text("Player One Chose ");
        p1ChoiceTag.append("<span class='p1ChoiceTag'>" + player_one_choice + '</span>')
        $('#player-one-choice').append(p1ChoiceTag);

        var p2ChoiceTag = $("<h4>");
        p2ChoiceTag.text("Player Two Chose ");
        p2ChoiceTag.append("<span class='p2ChoiceTag'>" + player_two_choice + '</span>')
        $('#player-two-choice').append(p2ChoiceTag);

        var winnerTag = $("<h4>");
        winnerTag.text("The Winner is Player One!");
        $('#winner').append(winnerTag);

        // setTimeout Function to remove 
        setTimeout(function () {
            $('#player-one-choice').empty();
            $('#player-two-choice').empty();
            $('#winner').empty();
            reStartGame();
        }, 3000);
    };

    var showPlayerTwoWon = function () {
        var p1ChoiceTag = $("<h4>");
        p1ChoiceTag.text("Player One Chose");
        p1ChoiceTag.append("<span class='p1ChoiceTag'>" + player_one_choice + '</span>')
        $('#player-one-choice').append(p1ChoiceTag);

        var p2ChoiceTag = $("<h4>");
        p2ChoiceTag.text("Player Two Chose ");
        p2ChoiceTag.append("<span class='p2ChoiceTag'>" + player_two_choice + '</span>')
        $('#player-two-choice').append(p2ChoiceTag);

        var winnerTag = $("<h4>");
        winnerTag.text("The Winner is Player Two!");
        $('#winner').append(winnerTag);

        // setTimeout Function to remove 
        setTimeout(function () {
            $('#player-one-choice').empty();
            $('#player-two-choice').empty();
            $('#winner').empty();
            reStartGame();
        }, 3000);
    };

    var showNoWinners = function () {
        var p1ChoiceTag = $("<h4>");
        p1ChoiceTag.text("Player One Chose ");
        p1ChoiceTag.append("<span class='p1ChoiceTag'>" + player_one_choice + '</span>')
        $('#player-one-choice').append(p1ChoiceTag);

        var p2ChoiceTag = $("<h4>");
        p2ChoiceTag.text("Player Two Chose ");
        p2ChoiceTag.append("<span class='p2ChoiceTag'>" + player_two_choice + '</span>')
        $('#player-two-choice').append(p2ChoiceTag);

        var winnerTag = $("<h4>");
        winnerTag.text("It is a tie... There are no winners!");
        $('#winner').append(winnerTag);

        // setTimeout Function to remove 
        setTimeout(function () {
            $('#player-one-choice').empty();
            $('#player-two-choice').empty();
            $('#winner').empty();
            reStartGame();
        }, 3000);
    };

    var reStartGame = function () {
        $('#p1-shield-text').show();
        $('#p1-fire-text').show();
        $('#p1-sword-text').show();

        $('#p2-shield-text').show();
        $('#p2-fire-text').show();
        $('#p2-sword-text').show();

        player_one_choice = "";
        player_two_choice = "";

        playerOneRef.child('Choice').transaction(function (dataOneSnapshot) {
            dataOneSnapshot = player_one_choice;
            return dataOneSnapshot;
        });

        playerTwoRef.child('Choice').transaction(function (dataTwoSnapshot) {
            dataTwoSnapshot = player_two_choice;
            return dataTwoSnapshot;
        });

    };


    //********** CHAT **********/

    //submitting a chat
    var showChats = function (snapshot) {
        var chatMsg = snapshot.val();

        // Only show messages sent in the last 30 minutes
        if (Date.now() - chatMsg.timestamp < 1800000) {
            var messageDiv = $('<div class="message">');
            messageDiv.html('<span class="sender">' + chatMsg.sender + '</span>: ' + chatMsg.message);
            $('#chatbox').append(messageDiv);
        };
    };

    $('#chat-btn').on('click', function () {
        var msg = $('#message');
        var chatObj = {
            message: msg.val(),
            sender: playerName,
            timestamp: firebase.database.ServerValue.TIMESTAMP
        };

        gameRef.child('chat').push(chatObj);

        // clear message input
        msg.val("");

        return false;
    });

    // database listening function for chat
    gameRef.child('chat').on('child_added', function (snapshot) {
        if (snapshot.val()) {
            showChats(snapshot);
        };
    });


}); //end .ready() 
