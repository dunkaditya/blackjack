document.addEventListener('DOMContentLoaded', main);
const deck = [];
let cpu;
let player;
let game;
const cCards = [];
const pCards = [];
let currPlayerCard = 2;
let hiddenValue;

const bjVals = {'2':2,'3':3,'4':4,'5':5,'6':6,'7':7,'8':8,'9':9,'10':10,'J':10,'Q':10,'K':10,'A':11}
function main(){

    game = document.getElementsByClassName("game")[0];
    game.style.display = "none";

    const selector = '[type = "submit"]';
    const btn = document.querySelector(selector);
    btn.addEventListener('click',handleClick);

    // making our cpu cards element
    cpu = document.createElement("div"); 
    cpu.className = "cCards";

    // making our player cards element
    player = document.createElement("div"); 
    player.className = "pCards";

    const pScore = document.createElement("h1");
    const pText = document.createTextNode("");
    pScore.appendChild(pText);
    pScore.id = "pscore";

    const cScore = document.createElement("h1");
    const cText = document.createTextNode("Computer Hand - Total: ???");
    cScore.appendChild(cText);
    cScore.id = "cscore";

    const win = document.createElement("h1");
    const wText = document.createTextNode("");
    win.id = "winner";
    win.appendChild(wText);

    game.appendChild(cScore);
    game.appendChild(cpu);
    game.appendChild(pScore);
    game.appendChild(player);
    game.appendChild(win);
}
// sums cards (handles blackjack aces)

function sum(cards){
    let sum = 0;
    let aces = 0;
    for(let i = 0; i < cards.length; i++){
        if(cards[i] == 'A'){
            aces += 1;
        }
        sum += bjVals[cards[i]];
    }
    while(sum > 21 && aces > 0){
        sum -= 10;
        aces -= 1;
    }
    return sum;
}

function handleClick(evt){ 

    evt.preventDefault();
    game.style.display = "block";

    const selector = '[type = "submit"]';
    const btn = document.querySelector(selector);
    document.getElementById('startform').style.display = 'none';
    const input = document.getElementById('startValues');

    // setup deck
    let firstVals = [];
    const cards = ['A', 'K', 'Q', 'J', '10', '9', '8', '7', '6', '5', '4', '3', '2'];

    if(input.value != ''){
        firstVals = input.value.split(',');
    }
    for(let i = 0; i < firstVals.length; i++){
        deck.push(firstVals[i].trim());
    }
    while(deck.length<52){
        deck.push(cards[Math.floor(Math.random() * cards.length)])
    }

    //Initial Deal
    makeCard(deck[0],"cpu",true);
    deck.shift();
    makeCard(deck[0],"player");
    deck.shift();
    makeCard(deck[0],"cpu");
    deck.shift();
    makeCard(deck[0],"player");
    deck.shift();

    hit();
    stand();
}

function makeCard(val,playerType,hidden=false){
    const card = document.createElement("h1");
    let text;
    let color = "black";

    if(hidden){
        card.id = "hidden";
        text = document.createTextNode("?");
        hiddenValue = val;
    }else{
        // when making cards, we use random suits, as they don't matter in blackjack logically
        const suitList = ['♣', '♠', '♥', '⬥']; 
        const rand = Math.floor(Math.random() * suitList.length);
        if(rand > 1){
            color = "red";
        } 
        suit = suitList[rand];

        text = document.createTextNode(val+suit); 
    }
    card.style.color = color;
    card.appendChild(text);

    // add card object as child to player or cpu
    if(playerType == "player"){
        player.appendChild(card);
        pCards.push(val);
    } else{
        cpu.appendChild(card);
        cCards.push(val);
    }
    const x = sum(pCards);
    document.getElementById('pscore').innerHTML = "Player Hand - Total: "+x;
}function hit(){
    const hit = document.createElement("BUTTON");
    hit.className = "hit";
    hit.innerHTML = "Hit";
    game.appendChild(hit);
    hit.addEventListener('click', doHit);
}

function doHit(){
    if(document.getElementById('winner').innerHTML != "CPU Wins" && document.getElementById('winner').innerHTML != "Player Wins!"){
        cardVal = deck[0];
        deck.shift();

        makeCard(cardVal,"player");

        const x = sum(pCards);
        if(x>21){ // busted
            document.getElementById('pscore').innerHTML = "Player Hand - Total: "+x+ " Busted";
            document.getElementById('winner').innerHTML = "CPU Wins";
            document.getElementsByClassName('stand')[0].style.display = "none";
            document.getElementsByClassName('hit')[0].style.display = "none";

            const reset = document.createElement("BUTTON");
            reset.className = "reset";
            reset.innerHTML = "Reset";
            game.appendChild(reset);
            reset.addEventListener('click', function(){
            window.location.reload()
    });
        }
    }
}

function stand(){
    const stand = document.createElement("BUTTON");
    stand.className = "stand";
    stand.innerHTML = "Stand";
    game.appendChild(stand);
    const x = sum(cCards);
    stand.addEventListener('click', doStand);
}
function doStand(){
    if(document.getElementById('winner').innerHTML != "CPU Wins" && document.getElementById('winner').innerHTML != "Player Wins!"){
        document.getElementById("hidden").innerHTML = hiddenValue+ '♠';
        let x = sum(cCards);
        while(x<17){
            makeCard(deck[0],"cpu");
            deck.shift();
            x = sum(cCards);
        }
        document.getElementById('cscore').innerHTML = "CPU Hand - Total: "+x;
        let y = sum(pCards);
        if(x>21){
            document.getElementById('cscore').innerHTML = "CPU Hand - Total: "+x+ " Busted";
            document.getElementById('winner').innerHTML = "Player Wins!";
        } else if(x>y){
            document.getElementById('winner').innerHTML = "CPU Wins";
        } else{
            document.getElementById('winner').innerHTML = "Player Wins!";
        }
    }
    document.getElementsByClassName('stand')[0].style.display = "none";
    document.getElementsByClassName('hit')[0].style.display = "none";

    const reset = document.createElement("BUTTON");
    reset.className = "reset";
    reset.innerHTML = "Reset";
    game.appendChild(reset);
    reset.addEventListener('click', function(){
        window.location.reload()
    });

}