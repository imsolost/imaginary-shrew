import React, { Component } from 'react'
import './App.css';
import Card from './card'
import _ from 'lodash'
import set from './comparison'
import cards from './Deck'


//cards that are in play, full deck of cards, and selected card, minus cards used

export default class Board extends Component {
  constructor(props) {
    super(props)
    let shuffledCards = _.shuffle(cards)
    this.state = {
      selectedCards: [],
      cardsInPlay: [null, null, null, null, null, null, null, null, null, null, null, null], // shuffledCards.slice(0, 6),
      deck: shuffledCards,
      score: 0 // .slice(6)
    }
  }

  deal() {
    console.log('entered deal()')
    let tempCardsInPlay = this.state.cardsInPlay
    for ( var i = 0; i < this.state.cardsInPlay.length; i++) {
        if (this.state.cardsInPlay[i] === null) {
          // deal new card
          let dealtCard = this.state.deck.pop()
          tempCardsInPlay[i] = dealtCard

        }
    }
    console.log('dealt cards are ::', tempCardsInPlay)
    this.setState({cardsInPlay: tempCardsInPlay})
  }

  boardHandleClick( card ) {
      let newSelectedCards = this.state.selectedCards
      for (var i=0; i<this.state.selectedCards.length; i++) {
        if ( _.isEqual(this.state.selectedCards[i], card) ) {
          newSelectedCards[i] = card
        }
      }
      this.setState({selectedCards: newSelectedCards})
      if ( this.state.selectedCards.includes(card) ) {
         _.pull(this.state.selectedCards, card)
      }
      else if ( !this.state.selectedCards.includes(card) ) {
      // _.pull(this.state.selectedCards, card)
      this.state.selectedCards.push(card)
      //_.pull(this.state.selectedCards, card)
      console.log( this.state.selectedCards )
      if (this.state.selectedCards.length === 3) {
        // if set is true, change selcted cards to null in cardsInPlay and run deal
        if ( set(this.state.selectedCards) ) {
          this.setState( {score: this.state.score + 1} )
          let newCardsInPlay = this.state.cardsInPlay

          for (var i = 0; i < newCardsInPlay.length; i++) {
            for (var j = 0; j < 3; j++) {
              if ( _.isEqual( newCardsInPlay[i], this.state.selectedCards[j] ) ) {
                  newCardsInPlay[i] = null;
              }
            }
          }
          this.setState( {cardsInPlay: newCardsInPlay} )
        }
        this.setState({selectedCards:[]})
        const selectedCardDivs = Array.from(document.getElementsByClassName('selected'))
        selectedCardDivs.forEach(div => div.classList.remove('selected'))
        this.deal()
      }
    }
  }

   // clears board, starts with original deck, shuffles, assigned to new game button
    reset() {

      // this.setState({
      //   cardsInPlay: [null, null, null, null, null, null, null, null, null, null, null, null],
      //   deck: _.shuffle(cards),
      //   selectedCards: [],
      //   score: 0
      // })

      this.state.cardsInPlay = [null, null, null, null, null, null, null, null, null, null, null, null]
      this.state.deck = _.shuffle(cards)
      this.state.selectedCards = []
      this.state.score = 0
      this.deal()
    }

  play() {
     var audio = document.getElementById("audio")
     audio.play()
   }

   resetButtonClick () {
     this.play()
     this.reset ()
   }

  render() {
    const  cards  = this.state.cardsInPlay

    let resetButton = <button className="resetButton" onClick={this.resetButtonClick.bind(this)}> New Game</button>

    let scoreDiv = <div className="score"> {this.state.score} </div>


    return (
      <div className="board">
        {
          cards.map( ( card, index ) =>
            <Card {...card} key={`card-${index}`} boardHandleClick={this.boardHandleClick.bind( this )} />
          )
        }

        {resetButton}
        <audio id="audio"  src="http://www.moviesoundscentral.com/sounds/playgames.wav" ></audio>
        {scoreDiv}
      </div>
    )
  }
}
