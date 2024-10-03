'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (acc, sort = 0) {
  const { movements } = acc;

  containerMovements.innerHTML = '';

  let movs;

  if (sort === 0) {
    movs = movements;
  } else if (sort === 1) {
    movs = movements.slice().sort((a, b) => a - b);
  } else if (sort === -1) {
    movs = movements.slice().sort((a, b) => b - a);
  }

  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
        <div class="movements__row">
          <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
          <div class="movements__date">3 days ago</div>
          <div class="movements__value">${mov}€</div>
        </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplayBalance = function (acc) {
  const { movements } = acc;

  acc.balance = movements.reduce((accumulator, current) => {
    return accumulator + current;
  }, 0);

  labelBalance.textContent = `${acc.balance}€`;
};

const calcDisplaySummary = function (acc) {
  const { movements, interestRate } = acc;
  const incomes = movements
    .filter(el => el > 0)
    .reduce((accumulator, current) => accumulator + current, 0);

  const out = movements
    .filter(el => el < 0)
    .reduce((accumulator, current) => accumulator + current, 0);

  const interest = movements
    .filter(el => el > 0)
    .reduce((accumulator, current) => {
      if ((current * 1.2) / 100 >= 1) {
        return accumulator + (current * interestRate) / 100;
      } else {
        return accumulator;
      }
    }, 0);

  labelSumIn.textContent = `${incomes}€`;
  labelSumOut.textContent = `${Math.abs(out)}€`;
  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};

const refreshPage = function (acc) {
  displayMovements(acc);
  calcDisplayBalance(acc);
  calcDisplaySummary(acc);
};

createUsernames(accounts);

let currentAccount;

btnLogin.addEventListener('click', function (e) {
  e.preventDefault();

  currentAccount = accounts.find(
    acc => acc.username === inputLoginUsername.value
  );

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    labelWelcome.textContent = `Welcome back ${
      currentAccount.owner.split(' ')[0]
    }`;

    containerApp.style.opacity = 100;

    inputLoginUsername.value = inputLoginPin.value = '';

    inputLoginUsername.blur();
    inputLoginPin.blur();

    refreshPage(currentAccount);
  }
});

btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();

  const receiverAcc = accounts.find(
    el => el.username === inputTransferTo.value
  );
  const amount = Number(inputTransferAmount.value);

  if (
    amount > 0 &&
    amount <= currentAccount.balance &&
    receiverAcc &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    refreshPage(currentAccount);

    inputTransferTo.blur();
    inputTransferAmount.blur();
  }

  inputTransferTo.value = inputTransferAmount.value = '';
});

btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (amount > 0 && currentAccount.movements.some(mov => mov >= amount * 0.1)) {
    currentAccount.movements.push(amount);

    refreshPage(currentAccount);
  }

  inputLoanAmount.value = '';
  inputLoanAmount.blur();
});

btnClose.addEventListener('click', function (e) {
  e.preventDefault();

  if (
    currentAccount.username === inputCloseUsername.value &&
    currentAccount.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(
      acc => acc.username === currentAccount.username
    );

    accounts.splice(index, 1);

    containerApp.style.opacity = 0;
  }

  inputCloseUsername.value = inputClosePin.value = '';

  inputCloseUsername.blur();
  inputClosePin.blur();
});

let sorted = 0;

btnSort.addEventListener('click', function (e) {
  e.preventDefault();

  if (sorted === 0) {
    sorted = 1;
  } else if (sorted === 1) {
    sorted = -1;
  } else if (sorted === -1) {
    sorted = 0;
  }

  displayMovements(currentAccount, sorted);
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
/* 
Julia and Kate are doing a study on dogs. So each of them asked 5 dog owners about their dog's age, and stored the data into an array (one array for each). For now, they are just interested in knowing whether a dog is an adult or a puppy. A dog is an adult if it is at least 3 years old, and it's a puppy if it's less than 3 years old.

Create a function 'checkDogs', which accepts 2 arrays of dog's ages ('dogsJulia' and 'dogsKate'), and does the following things:

1. Julia found out that the owners of the FIRST and the LAST TWO dogs actually have cats, not dogs! So create a shallow copy of Julia's array, and remove the cat ages from that copied array (because it's a bad practice to mutate function parameters)
2. Create an array with both Julia's (corrected) and Kate's data
3. For each remaining dog, log to the console whether it's an adult ("Dog number 1 is an adult, and is 5 years old") or a puppy ("Dog number 2 is still a puppy 🐶")
4. Run the function for both test datasets

HINT: Use tools from all lectures in this section so far 😉

TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
// const checkDogs = function (dogsJulia, dogsKate) {
//   const juliaCorrected = [...dogsJulia].slice(1, -2);
//   const allData = juliaCorrected.concat(dogsKate);

//   allData.forEach((el, index) =>
//     console.log(
//       `Dog number ${index + 1} is ${
//         el >= 3 ? `an adult, and is ${el} years old` : 'still a puppy'
//       }`
//     )
//   );
// };
// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);

// Coding Challenge #2

/* 
Let's go back to Julia and Kate's study about dogs. This time, they want to convert dog ages to human ages and calculate the average age of the dogs in their study.

Create a function 'calcAverageHumanAge', which accepts an arrays of dog's ages ('ages'), and does the following things in order:

1. Calculate the dog age in human years using the following formula: if the dog is <= 2 years old, humanAge = 2 * dogAge. If the dog is > 2 years old, humanAge = 16 + dogAge * 4.
2. Exclude all dogs that are less than 18 human years old (which is the same as keeping dogs that are at least 18 years old)
3. Calculate the average human age of all adult dogs (you should already know from other challenges how we calculate averages 😉)
4. Run the function for both test datasets

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/

// const calcAverageHumanAge = function (ages) {
//   return (
//     ages
//       .map(age => {
//         return age > 2 ? 16 + age * 4 : age * 2;
//       })
//       .filter(age => {
//         return age >= 18;
//       })
//       .reduce((accumulator, age) => {
//         return accumulator + age;
//       }, 0) / ages.length
//   );
// };

// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

// Coding Challenge #3

/* 
Rewrite the 'calcAverageHumanAge' function from the previous challenge, but this time as an arrow function, and using chaining!

TEST DATA 1: [5, 2, 4, 1, 15, 8, 3]
TEST DATA 2: [16, 6, 10, 5, 6, 1, 4]

GOOD LUCK 😀
*/
// const calcAverageHumanAge = function (ages) {
//   return (
//     ages
//       .map(age => (age > 2 ? 16 + age * 4 : age * 2))
//       .filter(age => age >= 18)
//       .reduce((accumulator, age) => accumulator + age, 0) / ages.length
//   );
// };

// const bankdepositsum1 = accounts.reduce((accumulator, current) => {
//   current.movements.forEach(mov => {
//     mov > 0 && (accumulator += mov);
//   });

//   return accumulator;
// }, 0);

// const bankdepositsum2 = accounts
//   .flatMap(acc => {
//     console.log('first', acc.movements);
//     return acc.movements;
//   })
//   .filter(mov => {
//     return mov > 0;
//   })
//   .reduce((accumulator, current) => {
//     return accumulator + current;
//   }, 0);

// console.log(bankdepositsum1, bankdepositsum2);

// const numdeposit1000 = accounts.reduce((accumulator, current) => {
//   current.movements.forEach(mov => {
//     mov > 1000 && accumulator++;
//   });

//   return accumulator;
// }, 0);

// console.log(numdeposit1000);

///////////////////////////////////////
// Coding Challenge #4

/* 
Julia and Kate are still studying dogs, and this time they are studying if dogs are eating too much or too little.
Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
Eating an okay amount means the dog's current food portion is within a range 10% above and 10% below the recommended portion (see hint).

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.

TEST DATA:

GOOD LUCK 😀
*/
// const dogs = [
//   { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//   { weight: 8, curFood: 200, owners: ['Matilda'] },
//   { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//   { weight: 32, curFood: 340, owners: ['Michael'] },
// ];

// // 1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion and add it to the object as a new property. Do NOT create a new array, simply loop over the array. Forumla: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)

// dogs.forEach(dog => {
//   dog.recommended = Math.trunc(dog.weight ** 0.75 * 28);
// });
// console.log(dogs);

// // 2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple owners, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
// const [sarahsDog] = dogs.filter(dog => dog.owners.includes('Sarah'));
// // const sarahsDog = dogs.find(dog => dog.owners.includes('Sarah'));
// if (sarahsDog.curFood > sarahsDog.recommended * 1.1) {
//   console.log("Sarah's dog is eating too much");
// } else if (sarahsDog.curFood < sarahsDog.recommended * 0.9) {
//   console.log("Sarah's dog is eating too little");
// }

// // 3. Create an array containing all owners of dogs who eat too much ('ownersEatTooMuch') and an array with all owners of dogs who eat too little ('ownersEatTooLittle').

// const { ownersEatTooMuch, ownersEatTooLittle } = dogs.reduce(
//   (accumulator, current) => {
//     if (current.curFood > current.recommended * 1.1) {
//       accumulator.ownersEatTooMuch = accumulator.ownersEatTooMuch.concat(
//         current.owners
//       );
//     } else if (current.curFood < current.recommended * 0.9) {
//       accumulator.ownersEatTooLittle = accumulator.ownersEatTooLittle.concat(
//         current.owners
//       );
//     }

//     return accumulator;
//   },
//   { ownersEatTooLittle: [], ownersEatTooMuch: [] }
// );

// // 4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
// console.log(
//   `${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`,
//   `${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`
// );

// // 5. Log to the console whether there is any dog eating EXACTLY the amount of food that is recommended (just true or false)
// console.log(dogs.some(dog => dog.curFood === dog.recommended));

// // 6. Log to the console whether there is any dog eating an OKAY amount of food (just true or false)
// console.log(
//   '6',
//   dogs.some(
//     dog =>
//       dog.curFood < dog.recommended * 1.1 && dog.curFood > dog.recommended * 0.9
//   )
// );

// // 7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
// console.log(
//   '7',
//   dogs.filter(
//     dog =>
//       dog.curFood < dog.recommended * 1.1 && dog.curFood > dog.recommended * 0.9
//   )
// );
// // 8. Create a shallow copy of the dogs array and sort it by recommended food portion in an ascending order (keep in mind that the portions are inside the array's objects)
// console.log(dogs.slice().sort((a, b) => a.recommended - b.recommended));
