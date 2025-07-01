import React, { useState } from 'react';
import './App.css';
import Chicken from "./assets/chicken.jpg"
import Banana from "./assets/banana.jpg"

function randomizedBoard(){
  //To make 50/50 randomized images (18 chicken and 18 banana)
  const images = Array(18).fill({type: 'chicken', img: Chicken}).concat(Array(18).fill({type: 'banana', img: Banana}));

  //Fisher-Yates shuffle algorithm from chatgtp :(
  for(let i = images.length - 1; i > 0; i--){
    const j = Math.floor(Math.random() * (i + 1));
    [images[i], images[j]] = [images[j], images[i]];
  }
  return images;
}


function App() {
  //State for shuffled board
  const [imges, setImages] = useState(randomizedBoard());
  //If player has already chosenm c or b
  const [playerChosen, setPlayerChosen] = useState(false);
  //To reveal the imgs
  const [revealed, setRevealed] = useState(Array(36).fill(false));
  //Current player's type: 'chicken' or 'banana'
  const [player, setPlayer] = useState('');
  //Game is over
  const [gameOver, setGameOver] = useState(false);
  //State for the winner
  const [winner, setWinner] = useState('');
  //Score tracker
  const [scores, setScore] = useState({chicken: 0, banana:0})

  //Count the remainninng unrevealed chickens
  const chickenLeft = imges.filter((tile, i) => tile.type === 'chicken' && !revealed[i]).length;
  //Count the remainninng unrevealed banana
  const bananaLeft = imges.filter((tile, i) => tile.type === 'banana' && !revealed[i]).length;

  //PLayer has already chosen side
  function choosePlayer(choice){
    setPlayer(choice);
    setPlayerChosen(true);
  }

  //clicking tiles
  function handleClick(click){
    if (gameOver || revealed[click]) return; //Will noit be able to click if the game is over

    //Will reveal the tiles
    const updateRevealed = [...revealed];
    updateRevealed[click] = true;
    setRevealed(updateRevealed);

    //Check if the tile matches the current player type
    if (imges[click].type === player){
      //then reveal it again
      const updateRevealed = [...revealed];
      updateRevealed[click] = true;
      setRevealed(updateRevealed);
      
      //Check if thgis was the last tile of player type
      if (player === 'chicken' && chickenLeft === 1){
        setGameOver(true);
        setWinner('Chicken Player')
        setScore(prev => ({...prev, chicken: prev.chicken + 1}));
      }
      else if(player === 'banana' && bananaLeft === 1){
        setGameOver(true);
        setWinner('Banana Player')
        setScore(prev => ({...prev, banana: prev.banana + 1}));
      } 
      //otherwise swithc to hte next player
      else{
        setPlayer(player === "chicken" ? "banana" : "chicken");
      }
    }else{
      //If wrong tile is clicked, other player instanly wins
      setGameOver(true);
      const winPlayer = player === 'chicken' ? 'Banana Player' : 'Chicken Player';
      setWinner(winPlayer);
      setScore(prev => player === 'chicken' 
        ? {...prev, banana: prev.banana + 1} 
        : {...prev, chicken: prev.chicken + 1}
      );   
    }
  }

  //Restart
  function restart(){
    setImages(randomizedBoard());
    setRevealed(Array(36).fill(false));
    setGameOver(false);
    setWinner('');
  }


  return (
  <div className='Container'>
    {!playerChosen ? (
      <div className='choose-player'>
        <h2>Choose Your Player</h2>
        <button onClick={() => choosePlayer('chicken')}>🐔 Chicken</button>
        <button onClick={() => choosePlayer('banana')}>🍌 Banana</button>
      </div>
      ) : (
        <>
          <h1>
            <span className="chicken-header"> Chicken</span>
            <span className='banana-header'>Banana</span>
          </h1>
          <div>
            <b>Score:</b>
            <span> Chicken: {scores.chicken}</span>
            <span> | </span>
            <span> Banana: {scores.banana}</span>
          </div>
          <p>
            You are <b>{player.charAt(0).toUpperCase() + player.slice(1)} Player</b>.<br />
            {gameOver
              ? <span className='winner'>{winner} wins!</span>
              : <>Current turn: <b>{player.charAt(0).toUpperCase() + player.slice(1)} Player</b></>
            }
          </p>
           {/* The game board */}
          <div className='grid'>
            {imges.map((tile, idx) => (
              <button
                key={idx}
                className={`square ${revealed[idx] ? 'revealed' : 'hidden'}`}
                onClick={() => handleClick(idx)}
                disabled={gameOver || revealed[idx]}
              >
                {revealed[idx] ? (
                  <img className='gridImg' src={tile.img} alt={tile.type} />
                ) : (
                  <span style={{ fontSize: 18 }}>{idx + 1}</span>
                )}
              </button>
            ))}
          </div>
          {/* Restart and Change Side buttons */}
          <button className='restart' onClick={restart}>Restart Game</button>
          <button className='change-side' onClick={() => setPlayer(player === 'chicken' ? 'banana' : 'chicken')}>Change Side</button>
        </>
      )}
    </div>
  );
}

export default App;