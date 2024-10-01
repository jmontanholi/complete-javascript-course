'use strict';

// Data needed for a later exercise
const flights =
  '_Delayed_Departure;fao93766109;txl2133758440;11:25+_Arrival;bru0943384722;fao93766109;11:45+_Delayed_Arrival;hel7439299980;fao93766109;12:05+_Departure;fao93766109;lis2323639855;12:30';

// Data needed for first part of the section
const restaurant = {
  name: 'Classico Italiano',
  location: 'Via Angelo Tavanti 23, Firenze, Italy',
  categories: ['Italian', 'Pizzeria', 'Vegetarian', 'Organic'],
  starterMenu: ['Focaccia', 'Bruschetta', 'Garlic Bread', 'Caprese Salad'],
  mainMenu: ['Pizza', 'Pasta', 'Risotto'],

  openingHours: {
    thu: {
      open: 12,
      close: 22,
    },
    fri: {
      open: 11,
      close: 23,
    },
    sat: {
      open: 0, // Open 24 hours
      close: 24,
    },
  },
};

// const game = {
//   team1: 'Bayern Munich',
//   team2: 'Borrussia Dortmund',
//   players: [
//     [
//       'Neuer',
//       'Pavard',
//       'Martinez',
//       'Alaba',
//       'Davies',
//       'Kimmich',
//       'Goretzka',
//       'Coman',
//       'Muller',
//       'Gnarby',
//       'Lewandowski',
//     ],
//     [
//       'Burki',
//       'Schulz',
//       'Hummels',
//       'Akanji',
//       'Hakimi',
//       'Weigl',
//       'Witsel',
//       'Hazard',
//       'Brandt',
//       'Sancho',
//       'Gotze',
//     ],
//   ],
//   score: '4:0',
//   scored: ['Lewandowski', 'Gnarby', 'Lewandowski', 'Hummels'],
//   date: 'Nov 9th, 2037',
//   odds: {
//     team1: 1.33,
//     x: 3.25,
//     team2: 6.5,
//   },
// };

// 1. Create one player array for each team (variables 'players1' and 'players2')
// const {
//   players: [players1, players2],
// } = game;
// console.log(players1, players2);

// 2. The first player in any player array is the goalkeeper and the others are field players. For Bayern Munich (team 1) create one variable ('gk') with the goalkeeper's name, and one array ('fieldPlayers') with all the remaining 10 field players
// const [gk, ...fieldPlayers] = players1;
// console.log(gk, fieldPlayers);

// 3. Create an array 'allPlayers' containing all players of both teams (22 players)
// const allPlayers = [...players1, ...players2];
// console.log(allPlayers);

// 4. During the game, Bayern Munich (team 1) used 3 substitute players. So create a new array ('players1Final') containing all the original team1 players plus 'Thiago', 'Coutinho' and 'Perisic'
// const players1Final = [...players1, 'Thiago', 'Coutinho', 'Perisic'];
// console.log(players1Final);

// 5. Based on the game.odds object, create one variable for each odd (called 'team1', 'draw' and 'team2')
// const {
//   odds: { team1, x: draw, team2 },
// } = game;
// console.log(team1, draw, team2);

// 6. Write a function ('printGoals') that receives an arbitrary number of player names (NOT an array) and prints each of them to the console, along with the number of goals that were scored in total (number of player names passed in)
// TEST DATA FOR 6: Use players 'Davies', 'Muller', 'Lewandowski' and 'Kimmich'. Then, call the function again with players from game.scored
// const printGoals = function (...playerNames) {
//   console.log(playerNames);
//   console.log(`${playerNames.length} goals were scored`);
// };

// printGoals('Davies', 'Muller', 'Lewandowski', 'Kimmich');
// printGoals(...game.scored);

// 7. The team with the lower odd is more likely to win. Print to the console which team is more likely to win, WITHOUT using an if/else statement or the ternary operator.
// team1 < team2 && console.log('Team 1 wins');
// team1 > team2 && console.log('Team 2 wins');

/* 
Let's continue with our football betting app!
GOOD LUCK 😀
*/

// 1. Loop over the game.scored array and print each player name to the console, along with the goal number (Example: "Goal 1: Lewandowski")
// for (let [index, name] of game.scored.entries()) {
//   console.log(`Goal ${index + 1}: ${name}`);
// }

// 2. Use a loop to calculate the average odd and log it to the console (We already studied how to calculate averages, you can go check if you don't remember)
// const odds = Object.values(game.odds);
// const average =
//   odds.reduce((accumulator, current) => {
//     return accumulator + current;
//   }, 0) / odds.length;

/* 3. Print the 3 odds to the console, but in a nice formatted way, exactly like this:
      Odd of victory Bayern Munich: 1.33
      Odd of draw: 3.25
      Odd of victory Borrussia Dortmund: 6.5
Get the team names directly from the game object, don't hardcode them (except for "draw"). HINT: Note how the odds and the game objects have the same property names 😉
*/
// const oddsKeys = Object.keys(game.odds);
// for (let key of oddsKeys) {
//   key === 'x'
//     ? console.log(`Odd of draw: ${game.odds[key]}`)
//     : console.log(`Odd of victory ${game[key]}: ${game.odds[key]}`);
// }

/* BONUS: Create an object called 'scorers' which contains the names of the players who scored as properties, and the number of goals as the value. In this game, it will look like this:
      {
        Gnarby: 1,
        Hummels: 1,
        Lewandowski: 2
      }
*/
// const scorers = game.scored.reduce((accumulator, current) => {
//   accumulator[current]
//     ? (accumulator[current] += 1)
//     : (accumulator[current] = 1);

//   return accumulator;
// }, {});

// console.log(scorers);

// Coding Challenge #3

/* 
Let's continue with our football betting app! This time, we have a map with a log of the events that happened during the game. The values are the events themselves, and the keys are the minutes in which each event happened (a football game has 90 minutes plus some extra time).



GOOD LUCK 😀
*/

// const gameEvents = new Map([
//   [17, '⚽️ GOAL'],
//   [36, '🔁 Substitution'],
//   [47, '⚽️ GOAL'],
//   [61, '🔁 Substitution'],
//   [64, '🔶 Yellow card'],
//   [69, '🔴 Red card'],
//   [70, '🔁 Substitution'],
//   [72, '🔁 Substitution'],
//   [76, '⚽️ GOAL'],
//   [80, '⚽️ GOAL'],
//   [92, '🔶 Yellow card'],
// ]);

// 1. Create an array 'events' of the different game events that happened (no duplicates)
// const events = [...new Set(gameEvents.values())];
// console.log(events);

// 2. After the game has finished, is was found that the yellow card from minute 64 was unfair. So remove this event from the game events log.
// gameEvents.delete(64);
// console.log(gameEvents);

// 3. Print the following string to the console: "An event happened, on average, every 9 minutes" (keep in mind that a game has 90 minutes)
// console.log(
//   `An event happened, on average, every ${Math.trunc(
//     [...gameEvents.keys()][gameEvents.size - 1] / gameEvents.size
//   )} minutes`
// );

// 4. Loop over the events and log them to the console, marking whether it's in the first half or second half (after 45 min) of the game, like this:
//       [FIRST HALF] 17: ⚽️ GOAL
// for (let [key, value] of gameEvents) {
//   console.log(`[${key > 45 ? 'SECOND HALF' : 'FIRST HALF'}] ${key}: ${value}`);
// }

document.body.append(document.createElement('textarea'));
document.body.append(document.createElement('button'));

document.querySelector('button').addEventListener('click', function () {
  const text = document.querySelector('textarea').value;
  const variables = text.split('\n');
  const fixedVariables = [];

  for (let [index, variable] of variables.entries()) {
    //
    fixedVariables.push(
      variable
        .split('_')
        .map((el, innerIndex) => {
          const trimmedLoweredElement = el.trim().toLowerCase();

          return innerIndex === 0
            ? trimmedLoweredElement
            : trimmedLoweredElement.replace(
                trimmedLoweredElement[0],
                trimmedLoweredElement[0].toUpperCase()
              );
        })
        .join('')
        .padEnd(20) + '✅'.repeat(index + 1)
    );
  }

  console.log(fixedVariables);
});
