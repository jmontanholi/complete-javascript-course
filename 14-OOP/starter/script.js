'use strict';
// Coding Challenge #1

/* 
1. Use a constructor function to implement a Car. A car has a make and a speed property. The speed property is the current speed of the car in km/h;
2. Implement an 'accelerate' method that will increase the car's speed by 10, and log the new speed to the console;
3. Implement a 'brake' method that will decrease the car's speed by 5, and log the new speed to the console;
4. Create 2 car objects and experiment with calling 'accelerate' and 'brake' multiple times on each of them.

DATA CAR 1: 'BMW' going at 120 km/h
DATA CAR 2: 'Mercedes' going at 95 km/h

GOOD LUCK 😀
*/

// const Car = function (maker, speed) {
//   this.maker = maker;
//   this.speed = speed;
// };

// Car.prototype.accelerate = function () {
//   this.speed += 10;
//   console.log(this.speed);
// };

// Car.prototype.brake = function () {
//   this.speed -= 5;
//   console.log(this.speed);
// };

// Car.prototype.stop = function () {
//   while (this.speed > 0) {
//     this.speed -= 1;
//     console.log(this.speed);
//   }
// };

// const bmw = new Car('BMW', 120);
// const mercedes = new Car('Mercedes', 95);

// bmw.accelerate();
// bmw.accelerate();
// bmw.brake();
// bmw.stop();

// Coding Challenge #2

/* 
1. Re-create challenge 1, but this time using an ES6 class;
2. Add a getter called 'speedUS' which returns the current speed in mi/h (divide by 1.6);
3. Add a setter called 'speedUS' which sets the current speed in mi/h (but converts it to km/h before storing the value, by multiplying the input by 1.6);
4. Create a new car and experiment with the accelerate and brake methods, and with the getter and setter.

DATA CAR 1: 'Ford' going at 120 km/h

GOOD LUCK 😀
*/
// class Car {
//   constructor(maker, speed) {
//     this.maker = maker;
//     this.speed = speed;
//   }

//   accelerate() {
//     this.speed += 10;
//     console.log(this.speed);
//   }

//   brake() {
//     this.speed -= 5;
//     console.log(this.speed);
//   }

//   stop() {
//     while (this.speed > 0) {
//       this.speed -= 1;
//       console.log(this.speed);
//     }
//   }

//   get speedUS() {
//     console.log(this.speed / 1.6);
//   }

//   set speedUS(speed) {
//     this.speed = speed * 1.6;
//   }
// }

// const bmw = new Car('BMW', 120);
// const mercedes = new Car('Mercedes', 95);

// bmw.accelerate();
// bmw.accelerate();
// bmw.brake();
// // bmw.stop();
// bmw.speedUS;
// bmw.speedUS = 75;
// bmw.speedUS;

///////////////////////////////////////
// Coding Challenge #3

/* 
1. Use a constructor function to implement an Electric Car (called EV) as a CHILD "class" of Car. Besides a make and current speed, the EV also has the current battery charge in % ('charge' property);
2. Implement a 'chargeBattery' method which takes an argument 'chargeTo' and sets the battery charge to 'chargeTo';
3. Implement an 'accelerate' method that will increase the car's speed by 20, and decrease the charge by 1%. Then log a message like this: 'Tesla going at 140 km/h, with a charge of 22%';
4. Create an electric car object and experiment with calling 'accelerate', 'brake' and 'chargeBattery' (charge to 90%). Notice what happens when you 'accelerate'! HINT: Review the definiton of polymorphism 😉

DATA CAR 1: 'Tesla' going at 120 km/h, with a charge of 23%

GOOD LUCK 😀
*/

// const Car = function (maker, speed) {
//   this.maker = maker;
//   this.speed = speed;
// };

// Car.prototype.accelerate = function () {
//   this.speed += 10;
//   console.log(this.speed);
// };

// Car.prototype.brake = function () {
//   this.speed -= 5;
//   console.log(this.speed);
// };

// Car.prototype.stop = function () {
//   while (this.speed > 0) {
//     this.speed -= 1;
//     console.log(this.speed);
//   }
// };

// const EV = function (maker, speed, charge) {
//   Car.call(this, maker, speed);
//   this.charge = charge;
// };

// EV.prototype = Object.create(Car.prototype);
// EV.constructor = EV;

// EV.prototype.accelerate = function () {
//   this.speed += 20;
//   this.charge--;

//   console.log(this.speed, this.charge);
// };

// EV.prototype.chargeBattery = function (chargeTo) {
//   this.charge = chargeTo;
//   console.log(this.charge);
// };

// const tesla = new EV('tesla', 120, 95);

// tesla.brake();
// tesla.accelerate();
// tesla.chargeBattery(100);

// Coding Challenge #4

/* 
1. Re-create challenge #3, but this time using ES6 classes: create an 'EVCl' child class of the 'CarCl' class
2. Make the 'charge' property private;
3. Implement the ability to chain the 'accelerate' and 'chargeBattery' methods of this class, and also update the 'brake' method in the 'CarCl' class. Then experiment with chaining!

DATA CAR 1: 'Rivian' going at 120 km/h, with a charge of 23%

GOOD LUCK 😀
*/

class CarCL {
  constructor(maker, speed) {
    this.maker = maker;
    this.speed = speed;
  }

  accelerate() {
    this.speed += 10;
    console.log(this.speed);

    return this;
  }

  brake() {
    this.speed -= 5;
    console.log(this.speed);

    return this;
  }
}

class EVCl extends CarCL {
  #charge;

  constructor(maker, speed, charge) {
    super(maker, speed);

    this.#charge = charge;
  }

  accelerate() {
    this.speed += 10;
    this.#charge--;
    console.log(`Speed: ${this.speed}, charge: ${this.#charge}`);

    return this;
  }

  chargeBattery(chargeto) {
    this.speed = 0;
    this.#charge = chargeto;
    console.log(`Battery charged to: ${this.#charge}`);

    return this;
  }
}

const rivian = new EVCl('rivian', 120, 23);

rivian.accelerate();
rivian.accelerate();
rivian.chargeBattery(100);
rivian.accelerate();
rivian.accelerate();
rivian.accelerate();
rivian.accelerate();
