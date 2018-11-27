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
        Rock: "Rock",
        Paper: "Paper",
        Scissor: "Scissor"
    }


    $("form").submit(function (e) {
        playingState = PlayingState.Watching;
        e.preventDefault();
        playerName = $("#user").val();
        console.log(playerName);
        waitingToJoin();
    });

    var waitingToJoin = function () {
        // Listen on "online" location for player 0 
        gameRef.child("player0/online").on("value", function (snapshot) {
            var value = snapshot.val();
            if (value === null && playingState === PlayingState.Watching) {
                tryingToJoin(0);
            };
        });

        // Listen on "online" location for player 1
        this.gameRef.child("player1/online").on("value", function (snapshot) {
            var value = snapshot.val();
            if (value === null && playingState === PlayingState.Watching) {
                tryingToJoin(1);
            };
        });
    };

    var tryingToJoin = function (playerNum) {
        //Set player to join a slot in the game
        playingState = PlayingState.Joining;
        gameRef.child("player" + playerNum + "/online").transaction(function (snapshot) {
            if (snapshot === null) {
                return true;
            } else {
                return; //>abort! didn't get in.
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

        //If Player One disconnects from the game. Clear our "online" status so somebody else can join.
        gameRef.child("player0").child("online").onDisconnect().remove();

        //If Player Two disconnects from the game. Clear our "online" status so somebody else can join.
        gameRef.child("player1").child("online").onDisconnect().remove();

        //Control the players
        playerOneRef = gameRef.child('player0/online');
        playerTwoRef = gameRef.child('player1/online');

        playerOneRef.on("value", function (playerOneSnapshot) {
            if (playerOneSnapshot.val() !== null) {

                player_one_name = playerOneSnapshot.val().Name;
                player_one_wins = playerOneSnapshot.val().Wins;
                player_one_loses = playerOneSnapshot.val().Loses;
                player_one_choice = playerOneSnapshot.val().Choice;
                //Remove submit button, text label, and replace "waiting for player one"
                //with the players name
                $("#submit-btn").remove();
                $("#user").remove();
                $("#player-one-text").empty();
                $("#player-one-text").append("Welcome " + player_one_name + " You Are Player 1");

                //*****Create a div to display info for Player One*****//
                //Create the div to display player one name
                var plNameText = $("<h4>");
                plNameText.text(player_one_name);
                $("#p1-name-text").html(plNameText);

                //Create the div to display player one rock text
                var plRockText = $("<a href='#'>");
                plRockText.text("ROCK");
                $("#p1-rock-text").html(plRockText);

                //Create the div to display player one paper text
                var p1PaperText = $("<a href='#'>");
                p1PaperText.text("PAPER");
                $("#p1-paper-text").html(p1PaperText);

                //Create the div to display player on scissor text
                var p1ScissorText = $("<a href='#'>");
                p1ScissorText.text("SCISSOR");
                $("#p1-scissor-text").html(p1ScissorText);

                //Create the div to display player one wins
                var p1NumWins = $("<h4>");
                p1NumWins.text("Wins: ");
                p1NumWins.append("<span class='p1Wins'>" + player_one_wins + '</span>');
                $("#p1-wins-text").html(p1NumWins);

                //Create the div to display player one loses
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
                //*****Create the div to display info for Player Two*****//
                //Create the div to display Player Two Name
                var p2NameText = $("<h4>");
                p2NameText.text(player_two_name);
                $("#p2-name-text").html(p2NameText);

                //Create the div to display player two Rock Element
                var p2RockText = $("<a href='#'>");
                p2RockText.text("ROCK");
                $("#p2-rock-text").html(p2RockText);

                //Create the div to display player two Paper Element
                var p2PaperText = $("<a href='#'>");
                p2PaperText.text("PAPER");
                $("#p2-paper-text").html(p2PaperText);

                //Create the div to display player two Scissor Element
                var p2ScissorText = $("<a href='#'>");
                p2ScissorText.text("SCISSOR");
                $("#p2-scissor-text").html(p2ScissorText);

                //Create the div to display player two Number of Wins Element
                var p2NumWins = $("<h4>");
                p2NumWins.text("Wins: ");
                p2NumWins.append("<span class='p2Wins'>" + player_two_wins + '</span>');
                $("#p2-wins-text").html(p2NumWins);

                //Create the div to display player two Number of Loses Element
                var p2NumLoses = $("<h4>");
                p2NumLoses.text("Loses: ");
                p2NumLoses.append("<span class='p2Loses'>" + player_two_loses + '</span>');
                $("#p2-loses-text").html(p2NumLoses);


                /*var b = $("<h4>");
                b.text("Player Two, please wait while Player One makes a selection");
                $('#player-two-choice').html(b);*/
            };
        });
    }

    //*****Player One Click Events*****//
    $('#p1-rock-text').on("click", function (e) {
        e.preventDefault();
        player_one_choice = PlayerChoice.Rock;
        startPlaying();
    });

    $('#p1-paper-text').on("click", function (e) {
        e.preventDefault();
        player_one_choice = PlayerChoice.Paper;
        startPlaying();
    });

    $('#p1-scissor-text').on("click", function (e) {
        e.preventDefault();
        player_one_choice = PlayerChoice.Scissor;
        startPlaying();
    });

    //*****Player Two Click Event*****??
    $('#p2-rock-text').on("click", function (e) {
        e.preventDefault();
        player_two_choice = PlayerChoice.Rock;
        startPlaying();
    });

    $('#p2-paper-text').on("click", function (e) {
        e.preventDefault();
        player_two_choice = PlayerChoice.Paper;
        startPlaying();
    });

    $('#p2-scissor-text').on("click", function (e) {
        e.preventDefault();
        player_two_choice = PlayerChoice.Scissor;
        startPlaying();
    });


    var startPlaying = function () {
        //Control the players
        playerOneRef = gameRef.child('player0/online');
        playerTwoRef = gameRef.child('player1/online');

        //If Player One choose Rock
        if (player_one_choice === PlayerChoice.Rock) {
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

        //If Player One choose Paper
        if (player_one_choice === PlayerChoice.Paper) {
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

        //If Player One choose Scissor
        if (player_one_choice === PlayerChoice.Scissor) {
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

        //If Plyer Two choose Rock
        if (player_two_choice === PlayerChoice.Rock) {
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

        //If Player Two choose Paper
        if (player_two_choice === PlayerChoice.Paper) {
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

        //If Player Two choose Scissor 
        if (player_two_choice === PlayerChoice.Scissor) {
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

        //check if both players have made a selection, call calculateWinner()
        if (player_one_choice !== "" && player_two_choice !== "") {
            calculateWinner();
        }

    };// end playerTwoStartPlaying


    var calculateWinner = function () {
        if (player_one_choice === "Rock" && player_two_choice === "Scissor") {
            //Player One Wins and Player Two Loses
            player_one_wins++;
            player_two_loses++;
            playerOneWins();
        };

        if (player_one_choice === "Rock" && player_two_choice === "Paper") {
            //Player One Loses and Player Two Wins
            player_one_loses++;
            player_two_wins++;
            playerTwoWins();
        };

        if (player_one_choice === "Rock" && player_two_choice === "Rock") {
            //No one wins 
            showNoWinners();
        };

        if (player_one_choice === "Paper" && player_two_choice === "Rock") {
            //Player One Wins and Player Two Loses
            player_one_wins++;
            player_two_loses++;
            playerOneWins();
        };

        if (player_one_choice === "Paper" && player_two_choice === "Paper") {
            //No one wins... 
            showNoWinners();
        };

        if (player_one_choice === "Paper" && player_two_choice === "Scissor") {
            //Player One Loses and Player Two Wins
            player_one_loses++;
            player_two_wins++;
            playerTwoWins();
        };

        if (player_one_choice === "Scissor" && player_two_choice === "Scissor") {
            //No one wins... 
            showNoWinners();
        };

        if (player_one_choice === "Scissor" && player_two_choice === "Paper") {
            //Player One Wins and Player Two Loses
            player_one_wins++;
            player_two_loses++;
            playerOneWins();
        };

        if (player_one_choice === "Scissor" && player_two_choice === "Rock") {
            //Player One Loses and Player Two Wins
            player_one_loses++;
            player_two_wins++;
            playerTwoWins();
        };

    };

    var playerOneWins = function () {
        //Control the players
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
        //Control the players
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
        p1ChoiceTag.text("Player One, You Choose ");
        p1ChoiceTag.append("<span class='p1ChoiceTag'>" + player_one_choice + '</span>')
        $('#player-one-choice').append(p1ChoiceTag);

        var p2ChoiceTag = $("<h4>");
        p2ChoiceTag.text("Player Two, You choose ");
        p2ChoiceTag.append("<span class='p2ChoiceTag'>" + player_two_choice + '</span>')
        $('#player-two-choice').append(p2ChoiceTag);

        var winnerTag = $("<h4>");
        winnerTag.text("The Winner is Player One!");
        $('#winner').append(winnerTag);

        //setTimeout Function to remove 
        setTimeout(function () {
            $('#player-one-choice').empty();
            $('#player-two-choice').empty();
            $('#winner').empty();
            reStartGame();
        }, 3000);
    };

    var showPlayerTwoWon = function () {
        var p1ChoiceTag = $("<h4>");
        p1ChoiceTag.text("Player One, You Choose ");
        p1ChoiceTag.append("<span class='p1ChoiceTag'>" + player_one_choice + '</span>')
        $('#player-one-choice').append(p1ChoiceTag);

        var p2ChoiceTag = $("<h4>");
        p2ChoiceTag.text("Player Two, You choose ");
        p2ChoiceTag.append("<span class='p2ChoiceTag'>" + player_two_choice + '</span>')
        $('#player-two-choice').append(p2ChoiceTag);

        var winnerTag = $("<h4>");
        winnerTag.text("The Winner is Player Two!");
        $('#winner').append(winnerTag);

        //setTimeout Function to remove 
        setTimeout(function () {
            $('#player-one-choice').empty();
            $('#player-two-choice').empty();
            $('#winner').empty();
            reStartGame();
        }, 3000);
    };

    var showNoWinners = function () {
        var p1ChoiceTag = $("<h4>");
        p1ChoiceTag.text("Player One, You Choose ");
        p1ChoiceTag.append("<span class='p1ChoiceTag'>" + player_one_choice + '</span>')
        $('#player-one-choice').append(p1ChoiceTag);

        var p2ChoiceTag = $("<h4>");
        p2ChoiceTag.text("Player Two, You choose ");
        p2ChoiceTag.append("<span class='p2ChoiceTag'>" + player_two_choice + '</span>')
        $('#player-two-choice').append(p2ChoiceTag);

        var winnerTag = $("<h4>");
        winnerTag.text("It is a tie... There are no winners!");
        $('#winner').append(winnerTag);

        //setTimeout Function to remove 
        setTimeout(function () {
            $('#player-one-choice').empty();
            $('#player-two-choice').empty();
            $('#winner').empty();
            reStartGame();
        }, 3000);
    };

    var reStartGame = function () {
        $('#p1-rock-text').show();
        $('#p1-paper-text').show();
        $('#p1-scissor-text').show();

        $('#p2-rock-text').show();
        $('#p2-paper-text').show();
        $('#p2-scissor-text').show();

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

        //Clear message input
        msg.val("");

        return false;
    });

    //Database listening function for chat
    gameRef.child('chat').on('child_added', function (snapshot) {
        if (snapshot.val()) {
            showChats(snapshot);
        };
    });


}); //end .ready() 
