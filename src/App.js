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
  function handleClick(click) {
  if (gameOver || revealed[click]) return; // Prevent clicks if game over or already revealed

  // Reveal the clicked tile
  const updateRevealed = [...revealed];
  updateRevealed[click] = true;
  setRevealed(updateRevealed);

  // Check if clicked tile matches player's type
  if (imges[click].type === player) {
    // Check if this was the last tile of player's type
    if (
      (player === 'chicken' && chickenLeft === 1) ||
      (player === 'banana' && bananaLeft === 1)
    ) {
      setGameOver(true);
      setWinner(player.charAt(0).toUpperCase() + player.slice(1) + ' Player');
      setScore(prev => ({
        ...prev,
        [player]: prev[player] + 1,
      }));
    }
    // No switch turn here anymore - player keeps playing
  } else {
    // Wrong tile clicked — game over, other player wins
    setGameOver(true);
    const winPlayer = player === 'chicken' ? 'Banana Player' : 'Chicken Player';
    setWinner(winPlayer);
    setScore(prev => 
      player === 'chicken' 
        ? { ...prev, banana: prev.banana + 1 } 
        : { ...prev, chicken: prev.chicken + 1 }
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
          <button className='change-side' onClick={() => {
            setPlayerChosen(false);
            setGameOver(false);
            setWinner('');
            setRevealed(Array(36).fill(false));
            setImages(randomizedBoard());
          }}>
            Change Side
          </button>
        </>
      )}
    </div>
  );
}

export default App;