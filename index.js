var b=[['','',''],['','',''],['','','']];
var winningCombinations = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
var player = 'o', opponent = 'x';
var compTurn = false;
var i = 2;
var xCount = 0;
var oCount = 0;
var playerType = 'HUMAN';

$(document).ready(function() {

    $("#popup").show();
    $("#overlay").show();

    /*var scaledHeight = Math.floor($(window).height() * 0.25);
    $(".gameSquare").height(scaledHeight);
    $("canvas").width(scaledHeight);*/

    $(".playAgain").click(function playAgain(){
        clearAllCanvasElements();
        b=[['','',''],['','',''],['','','']];
        i = 2;
        document.getElementById("result").innerHTML = "";
        $("#overlay").hide('slow');
    });

    $(".reset").click(function reset(){
        clearAllCanvasElements();
        b=[['','',''],['','',''],['','','']];
        i = 2;
        $("#header").hide('slow');
        $("#popup").show('slow');
        $("#overlay").show('slow');
        document.getElementById("xCount").innerHTML = 0;
        document.getElementById("oCount").innerHTML = 0;
        document.getElementById("result").innerHTML = "";

        xCount = 0;
        oCount = 0;

        playerType = "HUMAN";
        compTurn = false;
    })

    $("td").click(function enableHumanMove() {
        
        var row_index = $(this).parent().index();
        var col_index = $(this).index();
        if(b[row_index][col_index] == "") {
            var locationOfMove = $(this).index("td");
            var canvas = document.getElementsByTagName("canvas")[locationOfMove];
            var context = canvas.getContext("2d");
            canvas.width = canvas.height;
            
            if(playerType == "AI")
                compTurn = true;
            
            if(compTurn) {
                drawX(canvas, context);
                b[row_index][col_index] = 'x';
            } else {
                if(i % 2 == 0){
                    drawX(canvas, context);
                    b[row_index][col_index] = 'x';
                } else {
                    drawO(canvas,context);
                    b[row_index][col_index] = 'o';
                }

                i++;
            }
            
            scanForWinningCombo();

            

        } else {
            alert("Please select another position");
        }
    });
});

    function begin(players){
        
        playerType = players;

        $("#popup").hide('slow');
        $("#overlay").hide('slow');
        $("#header").show('slow');
        
    }
    
    function drawX(canvas, context) {
        var position1 = canvas.width * 0.25;
        var position2 = canvas.width * 0.75;
        
        context.beginPath();
        context.moveTo(position1, position1);
        context.lineTo(position2, position2);
        context.moveTo(position2, position1);
        context.lineTo(position1, position2);
        context.lineWidth=5;
        context.strokeStyle = "#fff";
        context.stroke();
    }

    function drawO(canvas,context) {
        var x = canvas.width * 0.5;
        var radius = canvas.height * 0.25;
        var startAngle = 6.25;
        for (var i = 6.25; i > 0; i = i - 0.05) {
            setTimeout(function () {
                context.beginPath();
                context.arc(x, x, radius, startAngle, (2 * Math.PI));
                context.lineWidth=5;
                context.strokeStyle = "#fff";
                context.stroke();
                context.closePath();
                startAngle = startAngle - 0.1;
            }, i * 150);
        }
    }

    function evaluate(b){
        for (var row = 0; row<3; row++) {
            if (b[row][0]==b[row][1] && b[row][1]==b[row][2]) {
                if (b[row][0]=='x')
                    return -10;
                else if (b[row][0]=='o')
                    return +10;
            }
        }

        // Checking for Columns for X or O victory.
        for (var col = 0; col<3; col++){
            if (b[0][col]==b[1][col] && b[1][col]==b[2][col]){
                if (b[0][col]=='x')
                    return -10;
                else if (b[0][col]=='o')
                    return +10;
            }
        }
        // Checking for Diagonals for X or O victory.
        if (b[0][0]==b[1][1] && b[1][1]==b[2][2]) {
            if (b[0][0]=='x')
                return -10;
            else if (b[0][0]=='o')
                return +10;
        }
        if (b[0][2]==b[1][1] && b[1][1]==b[2][0])
        {
            if (b[0][2]=='x')
                return -10;
            else if (b[0][2]=='o')
                return +10;
        }
        // Else if none of them have won then return 0
        return 0;
    }

    function minimax(b, depth, isMax)    {
        var score = evaluate(b);
        // If Maximizer has won the game return his/her evaluated score
        if (score == 10)
            return score;
        // If Minimizer has won the game return his/her evaluated score
        if (score == -10)
            return score;
        // If there are no more moves and no winner then it is a tie
        if (isMovesLeft(b)==false)
            return 0;
        // If this maximizer's move
        if (isMax) {
            var best = -1000;
            // Traverse all cells
            for (var i = 0; i<3; i++) {
                for (var j = 0; j<3; j++) {
                    // Check if cell is empty
                    if (b[i][j]=='') {
                        // Make the move
                        b[i][j] = player;
                        // Call minimax recursively and choose the maximum value
                        best = Math.max( best,minimax(b, depth+1, !isMax) );
                        // Undo the move
                        b[i][j] = '';
                    }
                }
            }
            return best;
        } else {
            var best = 1000;
            // Traverse all cells
            for (var i = 0; i<3; i++){
                for (var j = 0; j<3; j++) {
                    // Check if cell is empty
                    if (b[i][j]=='') {
                        // Make the move
                        b[i][j] = opponent;
                        // Call minimax recursively and choose the minimum value
                        best = Math.min(best, minimax(b, depth+1, !isMax));
                        // Undo the move
                        b[i][j] = '';
                    }
                }
            }
            return best;
        }
    }

    function isMovesLeft(b)
    {
        for (var i = 0; i<3; i++)
        for (var j = 0; j<3; j++)
        if (b[i][j]=='')
            return true;
        return false;
    }

    function findBestMove(b)    {
        var bestVal = -1000;
        var bestMove={
            row : -1,
            col : -1
        };
        // Traverse all cells, evalutae minimax function for all empty cells. And return the cell with optimal value.
        for (var i = 0; i<3; i++){
            for (var j = 0; j<3; j++){
                // Check if celll is empty
                if (b[i][j]=='') {
                    // Make the move
                    b[i][j] = player;
                    // compute evaluation function for this move.
                    var moveVal = minimax(b, 0, false);
                    // Undo the move
                    b[i][j] = '';
                    // If the value of the current move is more than the best value, then update best
                    if (moveVal > bestVal)
                    {
                        bestMove.row = i;
                        bestMove.col = j;
                        bestVal = moveVal;
                    }
                }
            }
        }
        return bestMove;
    }

    function scanForWinningCombo() {
        var check = checkForWinners(b);
        if(check!=0){
            if(check==10){
                oCount++;
                document.getElementById("oCount").innerHTML = oCount;
                document.getElementById("result").innerHTML = "O WINS";
                $("#overlay").show();
            }else{
                xCount++;
                document.getElementById("xCount").innerHTML = xCount;
                document.getElementById("result").innerHTML = "X WINS";
                $("#overlay").show();
            }
        }else{
            if(compTurn){
                setTimeout(makeComputerMove(), 400);
            }
        }
        if(isMovesLeft(b) == false){
            document.getElementById("result").innerHTML = "It's a Tie!";
            $("#overlay").show('slow');
        }
    }

    function makeComputerMove(){
        var location=findBestMove(b);
        var loc=-1;
        if(location.row != -1 && location.col != -1){
            b[location.row][location.col] = 'o';
            for(var i=0;i<=location.row;i++){
                for(var j=0;j<3;j++){
                    if(i==location.row && j==location.col){
                        loc++;
                        break;
                    }else{
                        loc++;
                    }
                }
            }
            var canvas = document.getElementsByTagName("canvas")[loc];
            var context = canvas.getContext("2d");
            canvas.width = canvas.height;
            drawO(canvas,context);
            compTurn=false;
            scanForWinningCombo();
        }
        

    }

    function clearAllCanvasElements() {
        for (var i = 0; i < 9; i++) {
            var canvas = document.getElementsByTagName("canvas")[i];
            var context = canvas.getContext("2d");
            context.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

function checkForWinners(b){
    for (var row = 0; row<3; row++) {
        if (b[row][0] == b[row][1] && b[row][1] == b[row][2]) {
            if (b[row][0] == 'x') {
                drawHorizontalLine(row);
                return -10;
            }
            else if (b[row][0] == 'o') {
                drawHorizontalLine(row);
                return +10;
            }
        }
    }

    // Checking for Columns for X or O victory.
    for (var col = 0; col<3; col++){
        if (b[0][col]==b[1][col] && b[1][col]==b[2][col]){
            if (b[0][col]=='x') {
                drawVerticalLine(col);
                return -10;
            }
            else if (b[0][col]=='o') {
                drawVerticalLine(col);
                return +10;
            }
        }
    }
    // Checking for Diagonals for X or O victory.
    if (b[0][0]==b[1][1] && b[1][1]==b[2][2]) {
        if (b[0][0]=='x'){
            drawLeftDiagonal();
            return -10;
        }
        else if (b[0][0]=='o'){
            drawLeftDiagonal();
            return +10;
        }
    }
    if (b[0][2]==b[1][1] && b[1][1]==b[2][0])
    {
        if (b[0][2]=='x'){
            drawRightDiagonal();
            return -10;
        }
        else if (b[0][2]=='o'){
            drawRightDiagonal();
            return +10;
        }
    }
    // Else if none of them have won then return 0
    return 0;
}

    function drawHorizontalLine(row){
        setTimeout(function (){
            if(row==0){
                var canvas = document.getElementsByTagName("canvas")[0];
                var context = canvas.getContext("2d");
                context.moveTo(0,canvas.height*0.5);
                context.lineTo(canvas.width,canvas.height*0.5);
                context.stroke();
                var canvas = document.getElementsByTagName("canvas")[1];
                var context = canvas.getContext("2d");
                context.moveTo(0,canvas.height*0.5);
                context.lineTo(canvas.width,canvas.height*0.5);
                context.stroke();
                var canvas = document.getElementsByTagName("canvas")[2];
                var context = canvas.getContext("2d");
                context.moveTo(0,canvas.height*0.5);
                context.lineTo(canvas.width,canvas.height*0.5);
                context.stroke();
            }else if(row==1){
                var canvas = document.getElementsByTagName("canvas")[3];
                var context = canvas.getContext("2d");
                context.moveTo(0,canvas.height*0.5);
                context.lineTo(canvas.width,canvas.height*0.5);
                context.stroke();
                var canvas = document.getElementsByTagName("canvas")[4];
                var context = canvas.getContext("2d");
                context.moveTo(0,canvas.height*0.5);
                context.lineTo(canvas.width,canvas.height*0.5);
                context.stroke();
                var canvas = document.getElementsByTagName("canvas")[5];
                var context = canvas.getContext("2d");
                context.moveTo(0,canvas.height*0.5);
                context.lineTo(canvas.width,canvas.height*0.5);
                context.stroke();
            } else {
                var canvas = document.getElementsByTagName("canvas")[6];
                var context = canvas.getContext("2d");
                context.moveTo(0, canvas.height * 0.5);
                context.lineTo(canvas.width, canvas.height * 0.5);
                context.stroke();
                var canvas = document.getElementsByTagName("canvas")[7];
                var context = canvas.getContext("2d");
                context.moveTo(0, canvas.height * 0.5);
                context.lineTo(canvas.width, canvas.height * 0.5);
                context.stroke();
                var canvas = document.getElementsByTagName("canvas")[8];
                var context = canvas.getContext("2d");
                context.moveTo(0, canvas.height * 0.5);
                context.lineTo(canvas.width, canvas.height * 0.5);
                context.stroke();
            }
        },400);
    }

    function drawVerticalLine(col){
        setTimeout(function (){
            if(col==0){
                var canvas = document.getElementsByTagName("canvas")[0];
                var context = canvas.getContext("2d");
                context.moveTo(0,canvas.height*0.5);
                context.lineTo(canvas.width,canvas.height*0.5);
                context.stroke();
                var canvas = document.getElementsByTagName("canvas")[3];
                var context = canvas.getContext("2d");
                context.moveTo(0,canvas.height*0.5);
                context.lineTo(canvas.width,canvas.height*0.5);
                context.stroke();
                var canvas = document.getElementsByTagName("canvas")[6];
                var context = canvas.getContext("2d");
                context.moveTo(0,canvas.height*0.5);
                context.lineTo(canvas.width,canvas.height*0.5);
                context.stroke();
            }else if(col==1){
                var canvas = document.getElementsByTagName("canvas")[2];
                var context = canvas.getContext("2d");
                context.moveTo(0,canvas.height*0.5);
                context.lineTo(canvas.width,canvas.height*0.5);
                context.stroke();
                var canvas = document.getElementsByTagName("canvas")[4];
                var context = canvas.getContext("2d");
                context.moveTo(0,canvas.height*0.5);
                context.lineTo(canvas.width,canvas.height*0.5);
                context.stroke();
                var canvas = document.getElementsByTagName("canvas")[7];
                var context = canvas.getContext("2d");
                context.moveTo(0,canvas.height*0.5);
                context.lineTo(canvas.width,canvas.height*0.5);
                context.stroke();
            } else {
                var canvas = document.getElementsByTagName("canvas")[2];
                var context = canvas.getContext("2d");
                context.moveTo(0, canvas.height * 0.5);
                context.lineTo(canvas.width, canvas.height * 0.5);
                context.stroke();
                var canvas = document.getElementsByTagName("canvas")[5];
                var context = canvas.getContext("2d");
                context.moveTo(0, canvas.height * 0.5);
                context.lineTo(canvas.width, canvas.height * 0.5);
                context.stroke();
                var canvas = document.getElementsByTagName("canvas")[8];
                var context = canvas.getContext("2d");
                context.moveTo(0, canvas.height * 0.5);
                context.lineTo(canvas.width, canvas.height * 0.5);
                context.stroke();
            }
        },400);
    }

    function drawLeftDiagonal() {
        setTimeout(function (){
            var canvas = document.getElementsByTagName("canvas")[0];
            var context = canvas.getContext("2d");
            context.moveTo(0,0);
            context.lineTo(canvas.width,canvas.height);
            context.stroke();
            var canvas = document.getElementsByTagName("canvas")[4];
            var context = canvas.getContext("2d");
            context.moveTo(0,0);
            context.lineTo(canvas.width,canvas.height);
            context.stroke();
            var canvas = document.getElementsByTagName("canvas")[8];
            var context = canvas.getContext("2d");
            context.moveTo(0,0);
            context.lineTo(canvas.width,canvas.height);
            context.stroke();},400);
    }

    function drawRightDiagonal() {
        setTimeout(function (){
            var canvas = document.getElementsByTagName("canvas")[2];
            var context = canvas.getContext("2d");
            context.moveTo(canvas.width,0);
            context.lineTo(0,canvas.height);
            context.stroke();
            var canvas = document.getElementsByTagName("canvas")[4];
            var context = canvas.getContext("2d");
            context.moveTo(canvas.width,0);
            context.lineTo(0,canvas.height);
            context.stroke();
            var canvas = document.getElementsByTagName("canvas")[6];
            var context = canvas.getContext("2d");
            context.moveTo(canvas.width,0);
            context.lineTo(0,canvas.height);
            context.stroke();
        },400);
    }