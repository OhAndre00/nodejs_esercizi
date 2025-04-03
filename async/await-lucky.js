function luckyDraw(player) {
  return new Promise((resolve, reject) => {
    const win = Boolean(Math.round(Math.random()));

    process.nextTick(() => {
      if (win) {
        resolve(`${player} won a prize in the draw!`);
      } else {
        reject(new Error(`${player} lost the draw.`));
      }
    });
  });
}

async function getResults() {
  try {
    const player1 = await luckyDraw("Tina");
    console.log(player1);

    const player2 = await luckyDraw("Jorge");
    console.log(player2);

    const player3 = await luckyDraw("Julien");
    console.log(player3);
  } catch (error) {
    console.error(error.message);
  }
}

getResults();
