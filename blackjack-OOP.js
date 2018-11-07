let deck, player, dealer;
let htmlPlayerScores = document.getElementById('players-scores');
let htmlDealerScores = document.getElementById('dealers-scores');
let result = document.getElementById('result');
htmlPlayerScores.innerHTML =' 0 ';
htmlDealerScores.innerHTML=' 0 ';

function Player(){
    this.cards = [];
    this.scores =0;
}

function Dealer(){
    this.cards = [];
    this.scores =0;
}

function Deck(){
    this.cards=[];
    this.values = ['Ace', 'King', 'Queen', 'Jack', '10', '9', '8', '7', '6', '5', '4', '3', '2'];
    this.suits = ['Hearts', 'Diamonds', 'Clubs', 'Spades'];
    for (let i=0; i<this.suits.length; i++){
        for (let j=0; j<this.values.length; j++){
            this.cards.push(this.values[j]+' of '+ this.suits[i]);
        }
    }
}

Deck.prototype.getCard = function(){
    /*Get random card*/
    let cardIndex = Math.floor(Math.random()*(this.cards.length-1));
    let card = this.cards[cardIndex];
    /*Delete card from array*/
    this.cards.splice(cardIndex, 1);
    return card;
};

function addCard(){
    /*Add card to the player*/
    this.cards.push(deck.getCard());
 }

function countScores(){
    let scores = [];
    let counterAce=0;
    for (let i=0; i<this.cards.length; i++){
        let cardValue = this.cards[i].split(' ')[0];
        if (cardValue ==='Ace'){
            counterAce++;
            scores.push(11);
        } else if (cardValue === 'King' || cardValue === 'Queen' || cardValue === 'Jack'){
            scores.push(10);
        } else{
            scores.push(parseInt(cardValue));
        }
    }
    while ((counterAce > 0) && (scores.reduce(((a, b)=> a+b), 0))>21){
        let str = scores.join(',').replace("11", "1");
        console.log(str);
        scores = str.split(',').map(item=>parseInt(item));
        console.log(scores);
        counterAce--;
    }
    this.scores = scores.reduce(((a, b)=> a+b), 0);
}

Player.prototype.addCard = addCard;
Dealer.prototype.addCard = addCard;
Player.prototype.countScores = countScores;
Dealer.prototype.countScores = countScores;

document.querySelector('.btn-start').addEventListener('click', function(){
    result.style.display='none';
    deck = new Deck();
    player  = new Player();
    dealer = new Dealer();

    addCardToPerson(player, 2);
    addCardToPerson(dealer, 2);
    player.countScores();
    updateTable();
});

function addCardToPerson(person, amount){
    for (let i = 0; i < amount; i++) {
        person.addCard();
    }
}

function updateTable(){
    document.getElementById('players-cards').innerHTML='';
    document.getElementById('dealers-cards').innerHTML='';
    /*Display cards on the board*/
    for (let i=0; i<player.cards.length; i++){
        let newDiv = document.createElement("div");
        newDiv.innerHTML = player.cards[i];
        document.getElementById('players-cards').appendChild(newDiv)
    }
    for (let i=0; i<dealer.cards.length; i++){
        let newDiv = document.createElement("div");
        if (i === 0){
            newDiv.id = "closed-card";
        }
        newDiv.innerHTML = dealer.cards[i];
        document.getElementById('dealers-cards').appendChild(newDiv)
    }
    htmlPlayerScores.innerHTML = ''+player.scores;
    htmlDealerScores.innerHTML = ''+dealer.scores;
}

document.querySelector('.btn-get-card').addEventListener('click', function(){
    addCardToPerson(player, 1);
    player.countScores();
    updateTable();
});

document.querySelector('.btn-end').addEventListener('click', function() {
    while (dealer.scores <= 16) {
        addCardToPerson(dealer, 1);
        dealer.countScores();
    }
    updateTable();
    document.getElementById('closed-card').style.color = 'black';
    document.getElementById('closed-card').style.background = 'none';
    if (((dealer.scores > 21) && (player.scores > 21)) || (dealer.scores===player.scores)){
        result.innerHTML = 'DRAW';
    } else if ((dealer.scores <= 21) && (dealer.scores > player.scores)) {
        result.innerHTML = 'DEALER IS A WINNER';
    } else if ((dealer.scores <= 21) && (player.scores > 21)){
        result.innerHTML = 'DEALER IS A WINNER';
    } else {
        result.innerHTML = 'PLAYER IS A WINNER';
    }
    result.style.display='inline-block';
});


