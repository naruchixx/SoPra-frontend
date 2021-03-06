import {Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren, Input, ComponentFactoryResolver} from '@angular/core';
import {StandardComponent} from '../standard/standard.component';
import {PlayerComponent} from '../player/player.component';
import {HexComponent} from '../hex/hex.component';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HttpParams} from '@angular/common/http';
import {WinScreenComponent} from '../win-screen/win-screen.component';
import {RoomService} from '../shared/services/room.service';
import 'rxjs/add/operator/takeWhile';
import {TimerObservable} from 'rxjs/observable/TimerObservable';
import {el} from '@angular/platform-browser/testing/src/browser_util';
import {SerpentineComponent} from '../serpentine/serpentine.component';
import {HillsofgoldComponent} from '../hillsofgold/hillsofgold.component';
import {HomestretchComponent} from '../homestretch/homestretch.component';
import {AppDirective} from '../app.directive';
import {SwamplandsComponent} from '../swamplands/swamplands.component';
import {WitchscauldronComponent} from '../witchscauldron/witchscauldron.component';
import {WindingpathsComponent} from '../windingpaths/windingpaths.component';

@Component({
  selector: 'app-in-game-screen',
  templateUrl: './in-game-screen.component.html',
  styleUrls: ['./in-game-screen.component.css']
})

export class InGameScreenComponent implements OnInit, OnDestroy {
  @ViewChild(StandardComponent) StandardPath: StandardComponent;
  @ViewChild(HillsofgoldComponent) HillsOfGold: HillsofgoldComponent;
  @ViewChild(SerpentineComponent) Serpentine: SerpentineComponent;
  @ViewChild (HomestretchComponent) HomeStretchFields: HomestretchComponent;
  @ViewChild(SwamplandsComponent) Swamplands: SwamplandsComponent;
  @ViewChild(WitchscauldronComponent) WitchsCauldron: WitchscauldronComponent;
  @ViewChild(WindingpathsComponent)   WindingPath: WindingpathsComponent;
  player: PlayerComponent;
  currentselection: string;
  current = 'Player1';
  room_name: string;

  playerObject: object;
  handCardObject: object;
  current_player: string;
  isItMyTurn: boolean;
  isItMyTurnCopy: boolean;
  trashButtonClickable: boolean;
  temp: boolean;
  currentHandCardObject: object;
  playedDrawCard: string;
  playingPieceOnCamp = false;
  cardsToBeTrashed: number;
  cardsToBeDiscarded: number;
  numbX: string;
  numbY: string;


  marketCardsObject: object;
  random: number;
  public idx: number;
  playersInRoom: string[];
  possibleTiles: string[];
  currentPositions: string[];
  oldPositions: string[];
  opponents: string[];
  myColor: string;
  opponentBlockadePoints = [0, 0, 0];
  myBlockadePoints = 0;
  Board = localStorage.getItem('currentPath').replace(/['"]+/g, '');

  mustTrash = false;
  mustDiscard = false;
  trashNumber = 0;
  discardNumber = 0;

  display: boolean;
  alive: boolean;
  interval: number;
  testArray: any[];



  playerColors = ['red', 'white', 'blue', 'yellow'];
  playerIsRed = false;
  playerIsWhite = false;
  playerIsBlue = false;
  playerIsYellow = false;

  apiUrl = 'https://sopra-fs18-group13-server.herokuapp.com/Games/';
  currentRoom = JSON.parse(localStorage.getItem('currentRoom'));

  playerName = JSON.parse(localStorage.getItem('currentUser')).name;
  // wenn lower market 6 karten hat ist isfree = false
  isFree = false;
  antiIsFree = true;
  // wenn der user noch keinen kauf gemacht hat ist firstpurchase = false
  firstPurchase = false;

  // für show market button
  showMarket = false;
  // wird bei buy card mitgegeben
  chosenMarketCard = '';

  // für button unten links, kontrolliert clickable status
  i = 0;
  useActionCard = true;
  useExpeditionCard = true;
  // trash = true;
  buyAvailable = true;
  discard = true;

  // selected: string[];

  // to set up all

  // für useActionCard und useExpeditionCard verwendet
  actionCards = [
    'Cartographer',
    'Compass',
    'Natives',
    'Scientist',
    'Transmitter',
    'TravelDiary'
  ];

  moveActionCards = [
    'Natives'
  ];


  drawActionCards = [
    'Cartographer',
    'Compass',
    'Scientist',
    'TravelDiary'
  ];

  /*
  drawActionCardsDict = [
    {cardID: 'Scientist', maxCardsToBeTrashed : 1},
    {cardID: 'TravelDiary', maxCardsToBeTrashed: 2},
    {cardID: 'Compass', maxCardsToBeTrashed: 0},
    {cardID: 'Cartographer', maxCardsToBeTrashed: 0},
  ]; */

  marketActionCards = [
    'Transmitter'
  ];

  selectedCardIsActionCard = false;

  // hier werden die upper market cards eingelesen
  upperCards = [
    {cardID: 'Cartographer', left: '3'},
    {cardID: 'Compass', left: '3'},
    {cardID: 'Natives', left: '3'},
    {cardID: 'Scientist', left: '3'},
    {cardID: 'Transmitter', left: '3'},
    {cardID: 'TravelDiary', left: '3'},
    {cardID: 'Sailor', left: '3'},
    {cardID: 'Captain', left: '3'},
    {cardID: 'Explorer', left: '3'},
    {cardID: 'Scout', left: '3'},
    {cardID: 'Trailblazer', left: '3'},
    {cardID: 'Pioneer', left: '3'}
  ];

  // hier werden die lower market cards eingelesen
  lowerCards = [
    {cardID: 'GiantMachete', left: '3'},
    {cardID: 'Allrounder', left: '3'},
    {cardID: 'Adventurer', left: '3'},
    {cardID: 'Plane', left: '3'},
    {cardID: 'Traveler', left: '3'},
    {cardID: 'Photographer', left: '3'}
  ];

  // hier werden die handcards des spielers eingelesen
 handCards = [
    {cardClass: 'Sailor', checked: false },
    {cardClass: 'Explorer', checked: false},
    {cardClass: 'Traveler', checked: false},
    {cardClass: 'Traveler', checked: false}
  ];

 httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })};


  // liste der angekreuzten handcards
  selected = [];
 // component: StandardComponent;


  constructor(private roomService: RoomService, private http: HttpClient) {
    this.possibleTiles = new Array<string>();
    this.currentPositions = new Array<string>();
    this.oldPositions = new Array<string>();
    this.opponents = new Array<string>();
    this.playersInRoom = new Array<string>();
    this.display = false;
    this.alive = true;
    this.interval = 1000;
    this.isItMyTurn = false;
    this.isItMyTurnCopy = false;
    this.trashButtonClickable = true;

  }



  // überprüft wie viele karten im lower market sind
  checkIsFree() {
    this.http.get(this.apiUrl + this.currentRoom + '/CurrentBottom')
      .subscribe(result => {
        console.log(result);
        if (result !== 6) {
          this.isFree = false; this.antiIsFree = true;} else {this.isFree = true; this.antiIsFree = false;}
        if (this.firstPurchase === true) {
          this.isFree = true; }
      });
  }

  // updated clickable status der buttons unten links
  updateSelectedCardIsActionCard() {
    for (this.i = 0; this.i < 6; this.i++) {
      if (this.selected[0] === this.actionCards[this.i]) {
        this.selectedCardIsActionCard = true;
        if (this.selected[0] === 'Transmitter') {
          this.temp = this.isFree;
          this.isFree = false;
          this.antiIsFree = true;
        }
        return;
      }
    }
    this.selectedCardIsActionCard = false;

  }
  updateUseActionCard() {
    if (this.isItMyTurn === true) {
      if (this.selected.length === 1 && this.selectedCardIsActionCard === true) {
        this.useActionCard = false;
        return;
      } else {
        this.useActionCard = true;
        return;
      }
    }
    this.useActionCard = true;
  }
  updateUseExpeditionCard() {
    if (this.isItMyTurn === true) {
      if (this.selected.length === 1 && this.selectedCardIsActionCard === false || this.selected.length === 1 && this.selected[0] === 'Natives') {
        this.useExpeditionCard = false;
        return;
      } else {
        this.useExpeditionCard = true;
        return;
      }
    }
    this.useExpeditionCard = true;
  }
  updateBuyAvailable() {
    if (this.isItMyTurn === true) {
      if (this.selected.length >= 1 && this.chosenMarketCard !== '' && this.firstPurchase === false) {
        this.buyAvailable = false;
        return;
      } else {
        this.buyAvailable = true;
        return;
      }
    }
    this.buyAvailable = true;
  }
  updateDiscard() {
    if (this.isItMyTurn === true) {
      if (this.selected.length >= 1) {
        this.discard = false;
        return;
      } else {
        this.discard = true;
        return;
      }
    }
    this.discard = true;
  }

  unavailable() { // damit der upper market korrekt ausgewählt wird
    if (this.firstPurchase === false) {
      this.isFree = true;
      this.antiIsFree = false;
    }
  }
  // aktionen die ausgeführt werden wenn eine handcard aus- / abgewählt wird
  toggleHandSelection(card, i) { // = toggleSelection(user) ist noch fehlerhaft
    const newCard = card;
    console.log('new', newCard)
    if (this.handCards[i].checked === true) {
      // this.BoardList[localStorage.getItem('currentPath')].removeTiles(this.possibleTiles)
      if (this.selected[0] !== 'Natives') {
        if (this.Board === 'StandardPath') {
          this.StandardPath.removeTiles(this.possibleTiles);
        }
        if (this.Board === 'HillsOfGold') {
          this.HillsOfGold.removeTiles(this.possibleTiles);
        }
        if (this.Board === 'HomeStretchFields') {
          this.HomeStretchFields.removeTiles(this.possibleTiles);
        }
        if (this.Board === 'Serpentine') {
          this.Serpentine.removeTiles(this.possibleTiles);
        }
        if (this.Board === 'Swamplands') {
          this.Swamplands.removeTiles(this.possibleTiles);
        }
        if (this.Board === 'WitchsCauldron') {
          this.WitchsCauldron.removeTiles(this.possibleTiles);
        }
        if (this.Board === 'WindingPath') {
          this.WindingPath.removeTiles(this.possibleTiles);
        }
        // }
        this.possibleTiles = [];
        localStorage.removeItem('possibleTiles');
      }

      /*console.log('on if condition', this.possibleTiles)*/
      this.handCards[i].checked = false;
      const position = this.selected.indexOf(newCard);
      this.selected.splice(position, 1);
      this.updateSelectedCardIsActionCard();
      this.updateUseActionCard();
      this.updateUseExpeditionCard();
      this.updateBuyAvailable();
      this.updateDiscard();
      console.log('this.selected: ' + this.selected);

    } else {
      this.possibleTiles = [];
      localStorage.removeItem('possibleTiles');
      /* WORKS # local storage gets deleted console.log('shouldnotwork', localStorage.getItem('possibleTiles'));*/
      this.handCards[i].checked = true;
      this.selected.push(newCard);
      /**/
      console.log('selected', this.selected);
      /*problem where is the notion of currenttile???????*/
      this.updateSelectedCardIsActionCard();
      this.updateUseActionCard();
      this.updateUseExpeditionCard();
      this.updateBuyAvailable();
      this.updateDiscard();
      if (this.selected[0] !== 'Natives') {
        console.log('get call', this.apiUrl + this.currentRoom + '/' + this.playerName + '/' + this.selected + '/move');
        if (localStorage.getItem('mode') === 'true'){
          console.log(localStorage.getItem('currentTwoPlayer'))
          if (localStorage.getItem('currentTwoPlayer') === 'player10' || localStorage.getItem('currentTwoPlayer') === 'player20'){
            this.numbX = '/one';
          }
          else{ this.numbX = '/two';}
          console.log('numbX', this.numbX)
          this.http.get(this.apiUrl + this.currentRoom + '/' + this.playerName + '/' + this.selected + '/move' + this.numbX)
            .subscribe(result => {
              for (const xl in result) {
                console.log('log result', result);
                this.possibleTiles.push(result[xl].name);
              }
              if (this.Board === 'StandardPath') {
                console.log('in show');
                this.StandardPath.showTiles(this.possibleTiles);
              }
              if (this.Board === 'HillsOfGold') {
                this.HillsOfGold.showTiles(this.possibleTiles);
              }
              if (this.Board === 'HomeStretchFields') {
                this.HomeStretchFields.showTiles(this.possibleTiles);
              }
              if (this.Board === 'Serpentine') {
                this.Serpentine.showTiles(this.possibleTiles);
              }
              if (this.Board === 'Swamplands') {
                this.Swamplands.showTiles(this.possibleTiles);
              }
              if (this.Board === 'WitchsCauldron') {
                console.log('in show');
                this.WitchsCauldron.showTiles(this.possibleTiles);
              }
              if (this.Board === 'WindingPath') {
                console.log('in show');
                this.WindingPath.showTiles(this.possibleTiles);
              }
              console.log('possible tiles in else', this.possibleTiles);
              localStorage.setItem('possibleTiles', JSON.stringify(this.possibleTiles));
              console.log('current local storage with JSON', JSON.parse(localStorage.getItem('possibleTiles')));


            });
        } else {
          this.http.get(this.apiUrl + this.currentRoom + '/' + this.playerName + '/' + this.selected + '/move')
            .subscribe(result => {
              for (const il in result) {
                console.log('log result', result);
                this.possibleTiles.push(result[il].name);
              }
              if (this.Board === 'StandardPath') {
                console.log('in show');
                this.StandardPath.showTiles(this.possibleTiles);
              }
              if (this.Board === 'HillsOfGold') {
                this.HillsOfGold.showTiles(this.possibleTiles);
              }
              if (this.Board === 'HomeStretchFields') {
                this.HomeStretchFields.showTiles(this.possibleTiles);
              }
              if (this.Board === 'Serpentine') {
                this.Serpentine.showTiles(this.possibleTiles);
              }
              if (this.Board === 'Swamplands') {
                this.Swamplands.showTiles(this.possibleTiles);
              }
              if (this.Board === 'WitchsCauldron') {
                console.log('in show');
                this.WitchsCauldron.showTiles(this.possibleTiles);
              }
              if (this.Board === 'WindingPath') {
                console.log('in show');
                this.WindingPath.showTiles(this.possibleTiles);
              }
              console.log('possible tiles in else', this.possibleTiles);
              localStorage.setItem('possibleTiles', JSON.stringify(this.possibleTiles));
              console.log('current local storage with JSON', JSON.parse(localStorage.getItem('possibleTiles')));


            });
        }
      }
      if (this.selected[0] === 'Natives') {
        this.playMoveActionCard();
      }
    }


    /**/

    /**/
  }
    // toggelt die marktbuttons
  showMarketFunc() {
    if (this.showMarket === true) {
      this.showMarket = false;
    } else {
      this.checkIsFree();
      this.showMarket = true; }
  }
  selection(selectedTile: string) {
    this.currentselection = selectedTile;
  }

  // füllt das upperCards Array
  getUpperCards(upperCardsJson) {
    this.upperCards = [];
    for (const key in upperCardsJson) {
      const upCard = {cardID: key, left: upperCardsJson[key]};
      this.upperCards.push(upCard);
      }
  }

  // füllt das lowerCards Array
  getLowerCards(lowerCardsJson) {
    this.lowerCards = [];
    for (const key in lowerCardsJson) {
      const upCard = {cardID: key, left: lowerCardsJson[key]};
      this.lowerCards.push(upCard);
    }
  }

  showSelected() {
    console.log(this.chosenMarketCard);
    for (const key in this.lowerCards) {
        console.log(this.lowerCards[key].cardID);
        console.log(this.lowerCards[key].cardID === this.chosenMarketCard);
    }
  }


  discardCards() {
    const bodyString = JSON.stringify({cards: this.selected});
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })};
    console.log(this.apiUrl + this.currentRoom + '/' + this.playerName + '/discard');
    this.http.post(this.apiUrl + this.currentRoom + '/' + this.playerName + '/discard', bodyString, httpOptions)
      .subscribe(result => console.log(result));
    this.updateHandcards();
    this.updateHandcards();
    this.updateHandcards();
    this.updateHandcards();
    this.selected = [];
    this.mustDiscard = false;
  }


  endturnFunction() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })};
    this.isItMyTurn = false;
    this.firstPurchase = false;
    this.http.put(this.apiUrl + this.currentRoom + '/' + this.playerName + '/endturn', httpOptions).
      subscribe(result => console.log(result));
    this.updateHandcards();
    this.updateHandcards();
    this.updateHandcards();
    this.trashButtonClickable = true;
  }


  // kaufinteraktionen, mit buy button verbunden
  buy() {
    this.firstPurchase = true;
    this.checkIsFree();

    const bodyString = JSON.stringify({cards: this.selected});
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })};
    this.http.post(this.apiUrl + this.currentRoom + '/' + this.playerName + '/' + this.chosenMarketCard, bodyString, httpOptions)
      .subscribe(result => {
        if (result) {
          alert('you bought ' + this.chosenMarketCard);
        } else {
          alert('you dont have enough money to buy ' + this.chosenMarketCard);
          this.firstPurchase = false;
        }
      });
    console.log('you selected: ' + this.selected);
    this.updateHandcards();
    this.updateHandcards();
    this.updateHandcards();
    this.updateHandcards();
    this.updateHandcards();
    this.updateHandcards();
    this.updateHandcards();
    this.updateHandcards();
    this.selected = [];
    for (const key in this.lowerCards) {
      // decrease number of cards of specific type left
      if (this.lowerCards[key].cardID === this.chosenMarketCard) {
        let temp = Number(this.lowerCards[key].left);
        if (temp > 0) {
          temp--;
          this.lowerCards[key].left = temp.toString();
          break;
        }
      }
    }
  }


  // updatet chosenMarketCard
  chooseMarketCard(event) { // chosenMarketCard erhält ID vom zuletzt ausgewählten Button
    const target = event.target || event.srcElement || event.currentTarget;
    const idAttr = target.attributes.id;
    this.chosenMarketCard = idAttr.nodeValue;
    this.updateBuyAvailable();
  }



  updateHandcards() {
    this.selected = [];
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })};
    this.http.get(this.apiUrl + this.currentRoom + '/' + this.playerName + '/handcards', httpOptions)
      .subscribe(result => {
        this.currentHandCardObject = result;
        this.handCards = [];
        for (let i = 0; i < Object.keys(result).length; i++) {
          this.handCards.push({cardClass: (this.currentHandCardObject[i]).name, checked: false });
        }
      });
    if (localStorage.getItem('tileColor') === 'Camp') {
      // TODO http.get to know how many should be trashed
      this.playingPieceOnCamp = true;
      this.trashButtonClickable = false;
    }
  }



  movePlayer() {
    console.log('entered mov');
    console.log('possible tiles in movePlayer', this.possibleTiles);
    // TODO addPlayers() doesn't work yet
    // console.log(this.standard.addPlayers());
    console.log('selected in move: ', this.selected);
    // NOT sexy way of doing it :S
      console.log(this.selected)
    if (this.Board === 'StandardPath') {
      this.StandardPath.removeTiles(this.possibleTiles);
      this.StandardPath.addPlayers(this.selected, this.possibleTiles);

    }
    if (this.Board === 'HillsOfGold') {
      this.HillsOfGold.removeTiles(this.possibleTiles);
      this.HillsOfGold.addPlayers(this.selected, this.possibleTiles);
    }
    if (this.Board === 'Serpentine') {
      this.Serpentine.removeTiles(this.possibleTiles);
      this.Serpentine.addPlayers(this.selected, this.possibleTiles);
    }
    if (this.Board === 'HomeStretchFields') {
      this.HomeStretchFields.removeTiles(this.possibleTiles);
      this.HomeStretchFields.addPlayers(this.selected, this.possibleTiles);
    }
    if (this.Board === 'Swamplands') {
      this.Swamplands.removeTiles(this.possibleTiles);

      this.Swamplands.addPlayers(this.selected, this.possibleTiles);
    }
    if (this.Board === 'WitchsCauldron') {
      this.WitchsCauldron.removeTiles(this.possibleTiles);
      this.WitchsCauldron.addPlayers(this.selected, this.possibleTiles);

    }
    if (this.Board === 'WindingPath') {
      this.WindingPath.removeTiles(this.possibleTiles);
      this.WindingPath.addPlayers(this.selected, this.possibleTiles);

    }

    this.updateHandcards();
    this.updateHandcards();
    this.updateHandcards();
    this.updateHandcards();
    this.updateHandcards();
    this.updateHandcards();
    this.updateHandcards();
    this.updateHandcards();
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })};
    this.selected = [];
  }

reload()  {
    if( window.localStorage )
    {
      if( !localStorage.getItem( 'firstLoad' ) )
      {
        localStorage[ 'firstLoad' ] = true;
        window.location.reload();
      }

      else
        localStorage.removeItem( 'firstLoad' );
    }
  }

  ngOnInit() {
    localStorage.removeItem('mode');
    console.log('BOARD', this.Board)
    localStorage.removeItem('possibleTiles');
    localStorage.removeItem('selectedHex');
    setTimeout(function(){}, 2000);
    this.reload();

    // Here we determine whether it's the player's turn
    TimerObservable.create(0, this.interval)  // This executes the http request at the specified interval
      .takeWhile(() => this.alive)
      .subscribe(() => {
        this.http.get(this.apiUrl + this.currentRoom + '/currentPlayer')
          .subscribe(result => {
            for (const key in result) {
              if (key === 'name') {
                this.current_player = result[key];
                // console.log('the current_player = ' + this.current_player);
                // console.log('is it my turn?: ' + this.isItMyTurn);
                // here we check whether it's actually the player's turn
                if (this.playerName === this.current_player) {
                  this.isItMyTurn = true;
                  this.isItMyTurnCopy = false;
                } else {
                  this.isItMyTurn = false;
                  this.isItMyTurnCopy = true;
                }
              }
            }
          });
      });

    console.log('got current User: ', localStorage.getItem('currentUser'));
    // here we get the current player from heroku in realtime
    TimerObservable.create(0, this.interval)  // This executes the http request at the specified interval
      .takeWhile(() => this.alive)
      .subscribe(() => {
        this.http.get(this.apiUrl + this.currentRoom + '/currentPlayer')
          .subscribe(result => {
            for (const key in result) {
              if (key === 'name') {
                this.current_player = result[key];
                // console.log('dieser spieler ist an der reihe: ' + this.current_player);
              }
            }});
      });



    // get opponent0 blockade points
    TimerObservable.create(0, this.interval)
      .takeWhile(() => this.alive)
      .subscribe(() => {
        for (let idx = 0; idx < this.opponents.length; idx++) {
          this.http.get(this.apiUrl + this.currentRoom + '/' + this.opponents[idx] + '/blockadePoints')
            .subscribe(result => {
              // console.log('this.opponentBlockadePoints[idx]: ' + this.opponentBlockadePoints[idx] + ' Number(JSON.stringify(result))' + Number(JSON.stringify(result)))
              this.opponentBlockadePoints[idx] = Number(JSON.stringify(result));
            });
        }
      });


    // get own blockade points
    TimerObservable.create(0, this.interval)
      .takeWhile(() => this.alive)
      .subscribe(() => {
        this.http.get(this.apiUrl + this.currentRoom + '/' + this.playerName + '/blockadePoints')
          .subscribe(result => {
            this.myBlockadePoints = Number(JSON.stringify(result));
          });
      });

    /*
      TimerObservable.create(0, this.interval)
        .takeWhile(() => this.alive)
        .subscribe(() => {
          this.http.get(this.apiUrl + this.currentRoom + '/' + this.playerName + '/trash')
            .subscribe(result => {
            console.log(result);
            if (Number(JSON.stringify(result)) > 0) {
              this.mustDiscard = false;
              this.cardsToBeDiscarded = Number(JSON.stringify(result));
              this.trashButtonClickable = false;
              this.mustTrash = true;
              this.cardsToBeTrashed = Number(JSON.stringify(result));
            }
          })
        });

      TimerObservable.create(0, this.interval)
        .takeWhile(() => this.alive)
        .subscribe(() => {
          this.http.get(this.apiUrl + this.currentRoom + '/' + this.playerName + '/discard')
            .subscribe(result => {
              console.log(result);
              if (Number(JSON.stringify(result)) > 0) {
                this.mustDiscard = true;
                this.cardsToBeDiscarded = Number(JSON.stringify(result));
              }
            })
        });
  */

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })};


    // here we get all players of the current room from heroku
    this.roomService.getRooms(this.currentRoom).subscribe(data => {
      this.playerObject = data.players;
      for (const idx in this.playerObject) {
        this.playersInRoom.push((this.playerObject[idx]).name);
        if (this.playerName === (this.playerObject[idx]).name) {
          this.myColor = this.playerColors[idx];

          if (this.myColor === 'red')
            this.playerIsRed = true;
          else if (this.myColor === 'white')
            this.playerIsWhite = true;
          else if (this.myColor === 'blue')
            this.playerIsBlue = true;
          else
            this.playerIsYellow = true;


          console.log('you are the player at position: ' + idx);
          localStorage.setItem('currentPlayer', idx);
          console.log('you have color: ' + this.myColor);
        }
        // here we push the usernames of all opponents in the room into the list of opponents
        if (this.playerName !== (this.playerObject[idx]).name) {
          this.opponents.push((this.playerObject[idx]).name);
        }
      }
      localStorage.setItem('playersInRoom', JSON.stringify(this.playersInRoom));
    });



    // here we get the handcards from heroku upon init
    this.http.put(this.apiUrl + this.currentRoom + '/' + this.playerName + '/turn', null, httpOptions).subscribe(result => {
      this.handCardObject = result;
      for (let i = 0; i < 4; i++) {
        this.handCards[i].cardClass = (this.handCardObject[i]).name;
      }
    });

    // update playing piece positions:
    TimerObservable.create(0, this.interval)  // This executes the http request at the specified interval
      .takeWhile(() => this.alive)
      .subscribe(() => {
        this.http.get(this.apiUrl + this.currentRoom + '/users', httpOptions)
          .subscribe(result => {
            console.log('result: ', result)
            /*first assign all positions before update to the array old positions*/
            this.oldPositions = [];
            for (let x of this.currentPositions){
              this.oldPositions.push(x);
            }
            this.currentPositions = [];
            /*push the positions from the backend to the array currentPositions*/
            if (localStorage.getItem('mode') === 'true') {
              for (const key in result) {
                this.currentPositions.push(result[key].myFigures[0].currentPosition.name);
                this.currentPositions.push(result[key].myFigures[1].currentPosition.name);
              }
              console.log(this.currentPositions)

            } else {
              for (const key in result) {
                this.currentPositions.push(result[key].myFigure.currentPosition.name);
              }
            }

            if (this.Board === 'StandardPath') {
              this.StandardPath.updatePosition(this.oldPositions, this.currentPositions);
            }

            if (this.Board === 'HillsOfGold') {
              this.HillsOfGold.updatePosition(this.oldPositions, this.currentPositions);
            }
            if (this.Board === 'Serpentine') {
              this.Serpentine.updatePosition(this.oldPositions, this.currentPositions);
            }
            if (this.Board === 'HomeStretchFields') {
              this.HomeStretchFields.updatePosition(this.oldPositions, this.currentPositions);
            }
            if (this.Board === 'Swamplands') {
              this.Swamplands.updatePosition(this.oldPositions, this.currentPositions);
            }
            if (this.Board === 'WitchsCauldron') {
              this.WitchsCauldron.updatePosition(this.oldPositions, this.currentPositions);
            }
            if (this.Board === 'WindingPath') {
              this.WindingPath.updatePosition(this.oldPositions, this.currentPositions);
            }

          });
        /* WORKS: console.log('current positons:', this.currentPositions);*/
          /*make an update call only if there has been a change between the old and the new positions*/
        // Not sexy way of doing it;


        }
            );



  }



  // here we get the current market upon clicking marketplace buttoon
  getCurrentMarket() {
    this.idx = -1;
    this.http.get(this.apiUrl + this.currentRoom + '/market').subscribe(result => {
      for (const key in result) { // This is how we assign the information about cards from heroku to our upperCards and lowerCards
        for (const key2 in result[key]) {
          if (this.idx === 11) {
            this.idx = 0;
          }else {
            this.idx += 1;
          }
          if (key === 'upperdict') {
            this.upperCards[this.idx].left = result[key][key2];
            if (result[key][key2] === 0) {
              this.upperCards[this.idx].cardID = 'Backside';  // this would display the backside of a card
            } else {
              this.upperCards[this.idx].cardID = key2;
            }
          } else {
            this.lowerCards[this.idx].left = result[key][key2];
            if (result[key][key2] === 0) {
              this.lowerCards[this.idx].cardID = 'Backside';
            } else {
              this.lowerCards[this.idx].cardID = key2;
            }
          }
        }
      }
      this.marketCardsObject = result;
    });
  }


  contains(a, obj) {
    var i = a.length;
    while (i--) {
      if (a[i] === obj) {
        return true;
      }
    }
    return false;
  }



  playActionCard() {
    console.log('this.selected: '+ this.selected[0]);
    this.playedDrawCard = this.selected[0];
    console.log('playedDrawCard before: ' + this.playedDrawCard);
    if (this.contains(this.drawActionCards, this.selected[0])) {
      this.playDrawActionCard(this.selected[0]);
    } else if (this.contains(this.moveActionCards, this.selected[0])) {
      this.playMoveActionCard();
    } else if (this.contains(this.marketActionCards, this.selected[0])) {
      this.playMarketActionCard();
    }
  }


  playDrawActionCard(drawActionCard: string) {
    // draw a new card from draw pile
    console.log('playActionCard');
    this.http.put(this.apiUrl + this.currentRoom + '/' + this.playerName + '/' + drawActionCard + '/drawAction', this.httpOptions)
      .subscribe(result => {
        console.log(result);
          if (drawActionCard === 'Scientist') {
            alert('you may now trash 1 card');
            this.trashButtonClickable = false;
          } else if (drawActionCard === 'TravelDiary') {
            alert('you may now trash up to 2 cards');
            this.trashButtonClickable = false;
          }
          else {
            this.trashButtonClickable = true;
          }
          console.log('trashButtonClickable: ' + this.trashButtonClickable);
        },
        (error) => {
        alert('you don\'t have enough cards on your draw pile');
        console.log(error);
        });

    this.selected = [];
    this.updateHandcards();
    this.updateHandcards();
    this.updateHandcards();
    this.updateHandcards();
    this.updateHandcards();
    this.updateHandcards();
  }

  playMoveActionCard() {
    localStorage.removeItem('possibleTiles');
    if (localStorage.getItem('mode') === 'true'){
      if (localStorage.getItem('currentTwoPlayer') === 'player10' || localStorage.getItem('currentTwoPlayer') === 'player20'){
        this.numbY = '/one';
      }
      else{ this.numbY = '/two';}
      console.log('numbY', this.numbY)

      this.http.get(this.apiUrl + this.currentRoom + '/' + this.playerName + '/moveAction' + this.numbY, this.httpOptions)
        .subscribe(result => {
          for (const et in result) {
            this.possibleTiles.push(result[et].name);
          }
          if (this.Board === 'StandardPath') {
            this.StandardPath.showTiles(this.possibleTiles);
          }
          if (this.Board === 'HillsOfGold') {
            this.HillsOfGold.showTiles(this.possibleTiles);
          }
          if (this.Board === 'HomeStretchFields') {
            this.HomeStretchFields.showTiles(this.possibleTiles);
          }
          if (this.Board === 'Serpentine') {
            this.Serpentine.showTiles(this.possibleTiles);
          }
          if (this.Board === 'Swamplands') {
            this.Swamplands.showTiles(this.possibleTiles);
          }
          if (this.Board === 'WitchsCauldron') {
            this.WitchsCauldron.showTiles(this.possibleTiles);
          }
          if (this.Board === 'WindingPath') {
            this.WindingPath.showTiles(this.possibleTiles);
          }
          console.log('possible tiles in else', this.possibleTiles);
          localStorage.setItem('possibleTiles', JSON.stringify(this.possibleTiles));
          console.log('current local storage with JSON', JSON.parse(localStorage.getItem('possibleTiles')));

        })
    } else {

      this.http.get(this.apiUrl + this.currentRoom + '/' + this.playerName + '/moveAction', this.httpOptions)
        .subscribe(result => {
          for (const et in result) {
            this.possibleTiles.push(result[et].name);
          }
          if (this.Board === 'StandardPath') {
            this.StandardPath.showTiles(this.possibleTiles);
          }
          if (this.Board === 'HillsOfGold') {
            this.HillsOfGold.showTiles(this.possibleTiles);
          }
          if (this.Board === 'HomeStretchFields') {
            this.HomeStretchFields.showTiles(this.possibleTiles);
          }
          if (this.Board === 'Serpentine') {
            this.Serpentine.showTiles(this.possibleTiles);
          }
          if (this.Board === 'Swamplands') {
            this.Swamplands.showTiles(this.possibleTiles);
          }
          if (this.Board === 'WitchsCauldron') {
            this.WitchsCauldron.showTiles(this.possibleTiles);
          }
          if (this.Board === 'WindingPath') {
            this.WindingPath.showTiles(this.possibleTiles);
          }
          console.log('possible tiles in else', this.possibleTiles);
          localStorage.setItem('possibleTiles', JSON.stringify(this.possibleTiles));
          console.log('current local storage with JSON', JSON.parse(localStorage.getItem('possibleTiles')));

        }); // list of neighboring tiles
    }
  }

  playMarketActionCard() {
    console.log('call to heroku: ' + this.apiUrl + this.currentRoom + '/' + this.playerName + '/Transmitter/' + this.chosenMarketCard + '/marketAction');
    this.http.put(this.apiUrl + this.currentRoom + '/' + this.playerName + '/Transmitter/' + this.chosenMarketCard + '/marketAction', this.httpOptions)
      .subscribe(result => console.log(result));
    this.updateHandcards();
    this.updateHandcards();
    this.updateHandcards();
    this.updateHandcards();
    this.updateHandcards();
    this.updateHandcards();
    this.isFree = this.temp; // reset isFree to the value it had before we played the action card
    this.selected = [];
  }

  trashCard() {
    console.log('playedDrawCard : ' + this.playedDrawCard);
    const bodyString = JSON.stringify({cards: this.selected});
    if (this.playedDrawCard === 'Scientist' && this.selected.length === 1) {
      this.http.post(this.apiUrl + this.currentRoom + '/' + this.playerName + '/trash', bodyString, this.httpOptions)
        .subscribe(result => console.log(result));
    } else if (this.playedDrawCard === 'TravelDiary' && this.selected.length <= 2) {
      this.http.post(this.apiUrl + this.currentRoom + '/' + this.playerName + '/trash', bodyString, this.httpOptions)
        .subscribe(result => console.log(result));
    } else if (this.cardsToBeTrashed === this.selected.length) {
      this.http.post(this.apiUrl + this.currentRoom + '/' + this.playerName + '/trash', bodyString, this.httpOptions)
        .subscribe(result => console.log(result));
    }
    // TODO show notification to user that he selected wrong number of cards to trash
    this.updateHandcards();
    this.updateHandcards();
    this.updateHandcards();
    this.updateHandcards();
    this.updateHandcards();
    this.cardsToBeTrashed = 0;
    this.selected = [];
    this.playedDrawCard = '';
    this.trashButtonClickable = true;
    this.mustTrash = false;
  }

  ngOnDestroy() {
    this.alive = false; // switches your TimerObservable off
  }


}
