'use strict';

// prettier-ignore

class Workout {
  date = new Date();
  clicks = 0;

  constructor(coords, distance, duration) {
    this.coords = coords; // [lat, lng]
    this.distance = distance; // in km
    this.duration = duration; // in min
    this.id = `${coords[0]}${coords[1]}${distance}${duration}${this.date.getTime()}`
  }

  _setDescription() {
    const months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December',
    ];

    this.description = `${this.type[0].toUpperCase()}${this.type.slice(1)} on ${months[this.date.getMonth()]} ${this.date.getDate()}`
  }

  click() {
    this.clicks++
  }

  setMarker(marker) {
    this.marker = marker
  }
}

class Running extends Workout {
  type = 'running';

  constructor(coords, distance, duration, cadence) {
    super(coords, distance, duration);
    this.cadence = cadence;
    this.calcPace();
    this._setDescription();
  }

  calcPace() {
    // min/km
    this.pace = this.duration / this.distance;
    return this.pace;
  }

  updateValues(distance, duration, cadence) {
    this.distance = distance;
    this.duration = duration;
    this.cadence = cadence;
  }
}

class Cycling extends Workout {
  type = 'cycling';

  constructor(coords, distance, duration, elevation) {
    super(coords, distance, duration);
    this.elevation = elevation;

    this.calcSpeed();
    this._setDescription();
  }

  calcSpeed() {
    this.speed = this.distance / (this.duration / 60);

    return this.speed;
  }

  updateValues(distance, duration, elevation) {
    this.distance = distance;
    this.duration = duration;
    this.elevation = elevation;
  }
}

const form = document.querySelector('.form');
const containerWorkouts = document.querySelector('.workouts');
const inputType = document.querySelector('.form__input--type');
const inputDistance = document.querySelector('.form__input--distance');
const inputDuration = document.querySelector('.form__input--duration');
const inputCadence = document.querySelector('.form__input--cadence');
const inputElevation = document.querySelector('.form__input--elevation');
const deleteAllBtn = document.querySelector('.btn--delete-all');

class App {
  #map;
  #mapEvent;
  #zoomLevel = 13;
  #workouts = [];
  #markers = [];

  constructor() {
    this._getPosition();

    this._getLocalStorage();

    form.addEventListener('submit', this._newWorkout.bind(this));
    inputType.addEventListener('change', this._toggleElevationField.bind(this));
    containerWorkouts.addEventListener('click', this._moveToPopup.bind(this));
    deleteAllBtn.addEventListener('click', this._deleteAllWorkouts.bind(this));
  }

  _getPosition() {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    function error(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    navigator.geolocation?.getCurrentPosition(
      this._loadMap.bind(this),
      error,
      options
    );
  }

  _loadMap(pos) {
    const { latitude, longitude } = pos.coords;

    const coords = [latitude, longitude];

    this.#map = L.map('map').setView(coords, this.#zoomLevel);

    L.tileLayer('https://tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }).addTo(this.#map);

    this.#map.on('click', this._showForm.bind(this));

    this.#workouts.forEach(work => {
      this._renderWorkoutMarker(work);
    });
  }

  _showForm(mapE) {
    this.#mapEvent = mapE;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _hideForm() {
    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';

    form.style.display = 'none';
    form.classList.add('hidden');
    setTimeout(() => {
      form.style.display = 'grid';
    }, 1000);
  }

  _loadEditForm(e) {
    const workoutEl = e.target.closest('.workout');

    const workout = this.#workouts.find(
      workout => workout.id === workoutEl.dataset.id
    );

    inputType.value = workout.type;
    inputDistance.value = workout.distance;
    inputDuration.value = workout.duration;

    if (workout.type === 'running') {
      this._hideElevationField();
      inputCadence.value = workout.cadence;
    }

    if (workout.type === 'cycling') {
      this._showElevationField();
      inputElevation.value = workout.elevation;
    }

    form.dataset.workoutId = workout.id;
    inputType.disabled = true;
    form.classList.remove('hidden');
    inputDistance.focus();
  }

  _showElevationField() {
    inputCadence.closest('.form__row').classList.add('form__row--hidden');
    inputElevation.closest('.form__row').classList.remove('form__row--hidden');
  }

  _hideElevationField() {
    inputCadence.closest('.form__row').classList.remove('form__row--hidden');
    inputElevation.closest('.form__row').classList.add('form__row--hidden');
  }

  _toggleElevationField(e) {
    if (e.target.value === 'running') {
      this._hideElevationField();
    }

    if (e.target.value === 'cycling') {
      this._showElevationField();
    }
  }

  _newWorkout(e) {
    e.preventDefault();

    if (form.dataset.workoutId) {
      this._handleEdit();
      return;
    }

    const type = inputType.value;
    const distance =
      inputDistance.value !== '' ? Number(inputDistance.value) : NaN;
    const duration =
      inputDuration.value !== '' ? Number(inputDuration.value) : NaN;

    const { lat, lng } = this.#mapEvent.latlng;

    let workout;

    if (type === 'running') {
      const cadence =
        inputCadence.value !== '' ? Number(inputCadence.value) : NaN;

      if (
        !this._allAreNumbers(distance, duration, cadence) ||
        !this._allArePositive(distance, duration, cadence)
      ) {
        return alert('Inputs need to be positive numbers!');
      }

      workout = new Running([lat, lng], distance, duration, cadence);
    }

    if (type === 'cycling') {
      const elevation =
        inputElevation.value !== '' ? Number(inputElevation.value) : NaN;

      if (
        !this._allAreNumbers(distance, duration, elevation) ||
        !this._allArePositive(distance, duration)
      ) {
        return alert('Inputs need to be positive numbers!');
      }

      workout = new Cycling([lat, lng], distance, duration, elevation);
    }

    inputDistance.value =
      inputDuration.value =
      inputCadence.value =
      inputElevation.value =
        '';

    workout && this.#workouts.push(workout);

    this._renderWorkoutMarker(workout);

    this._renderWorkout(workout);

    this._hideForm();

    this._setLocalStorage();
  }

  _handleEdit() {
    const workout = this.#workouts.find(
      work => work.id === form.dataset.workoutId
    );

    form.removeAttribute('data-workoutId');

    const distance =
      inputDistance.value !== '' ? Number(inputDistance.value) : NaN;
    const duration =
      inputDuration.value !== '' ? Number(inputDuration.value) : NaN;

    if (workout.type === 'running') {
      const cadence =
        inputCadence.value !== '' ? Number(inputCadence.value) : NaN;

      if (
        !this._allAreNumbers(distance, duration, cadence) ||
        !this._allArePositive(distance, duration, cadence)
      ) {
        return alert('Inputs need to be positive numbers!');
      }

      workout.uptadeValues(distance, duration, cadence);
    }

    if (workout.type === 'cycling') {
      const elevation =
        inputElevation.value !== '' ? Number(inputElevation.value) : NaN;

      if (
        !this._allAreNumbers(distance, duration, elevation) ||
        !this._allArePositive(distance, duration)
      ) {
        return alert('Inputs need to be positive numbers!');
      }

      workout.updateValues(distance, duration, elevation);
    }

    const workoutEl = document.querySelector(`[data-id="${workout.id}"]`);

    this._renderWorkout(workout, workoutEl);

    this._setLocalStorage();

    inputType.disabled = false;
  }

  _renderWorkoutMarker(workout) {
    const marker = L.marker(workout.coords)
      .addTo(this.#map)
      .bindPopup(
        L.popup({
          maxWidth: 250,
          minWidth: 100,
          autoClose: false,
          closeOnClick: false,
          className: `${workout.type}-popup`,
        })
      )
      .setPopupContent(
        `${workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'} ${workout.description}`
      )
      .openPopup();

    this.#markers.push({ marker, workoutId: workout.id });
  }

  _renderWorkout(workout, toReplace = null) {
    let html = `
      <li class="workout workout--${workout.type}" data-id="${workout.id}">
        <div class="workout__header">
          <h2 class="workout__title">${workout.description}</h2>
          <button class="workout__edit">Edit</button>
          <button class="workout__delete">Delete</button>
        </div>
        <div class="workout__details">
          <span class="workout__icon">${
            workout.type === 'running' ? '🏃‍♂️' : '🚴‍♀️'
          }</span>
          <span class="workout__value" data-input-type="distance">${
            workout.distance
          }</span>
          <span class="workout__unit">km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⏱</span>
          <span class="workout__value" data-input-type="duration">${
            workout.duration
          }</span>
          <span class="workout__unit">min</span>
        </div>
    `;

    if (workout.type === 'running')
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value" data-input-type="pace">${workout.pace.toFixed(
            1
          )}</span>
          <span class="workout__unit">min/km</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">🦶🏼</span>
          <span class="workout__value" data-input-type="cadence">${
            workout.cadence
          }</span>
          <span class="workout__unit">spm</span>
        </div>
      </li>
      `;

    if (workout.type === 'cycling')
      html += `
        <div class="workout__details">
          <span class="workout__icon">⚡️</span>
          <span class="workout__value">${workout.speed.toFixed(1)}</span>
          <span class="workout__unit">km/h</span>
        </div>
        <div class="workout__details">
          <span class="workout__icon">⛰</span>
          <span class="workout__value">${workout.elevation}</span>
          <span class="workout__unit">m</span>
        </div>
      </li>
      `;

    if (toReplace) {
      toReplace.insertAdjacentHTML('afterend', html);
      toReplace.remove();
    } else {
      form.insertAdjacentHTML('afterend', html);
    }

    document
      .querySelector('.workout__delete')
      .addEventListener('click', this._deleteWorkout.bind(this));

    document
      .querySelector('.workout__edit')
      .addEventListener('click', this._loadEditForm.bind(this));

    deleteAllBtn.classList.remove('hidden');
  }

  _allAreNumbers(...inputs) {
    return inputs.every(value => Number.isFinite(value));
  }

  _allArePositive(...inputs) {
    return inputs.every(value => value > 0);
  }

  _moveToPopup(e) {
    const workoutEl = e.target.closest('.workout');

    if (
      !workoutEl ||
      e.target.classList.contains('workout__delete') ||
      e.target.classList.contains('workout__edit')
    )
      return;

    const workout = this.#workouts.find(
      workout => workout.id === workoutEl.dataset.id
    );

    this.#map.setView(workout.coords, this.#zoomLevel, {
      animate: true,
      pan: {
        duration: 1,
      },
    });
  }

  _setLocalStorage() {
    localStorage.setItem('workouts', JSON.stringify(this.#workouts));
  }

  _getLocalStorage() {
    const data = JSON.parse(localStorage.getItem('workouts'));

    if (!data) return;

    this.#workouts = data.map(work => {
      if (work.type === 'running') {
        return new Running(
          work.coords,
          work.distance,
          work.duration,
          work.cadence
        );
      }

      if (work.type === 'cycling') {
        return new Cycling(
          work.coords,
          work.distance,
          work.duration,
          work.elevation
        );
      }
    });

    this.#workouts.forEach(work => {
      this._renderWorkout(work);
    });
  }

  reset() {
    localStorage.removeItem('workouts');
    location.reload();
  }

  _deleteWorkout(e) {
    const workoutEl = e.target.closest('.workout');

    this._deleteLogic(workoutEl);
  }

  _deleteAllWorkouts(e) {
    const response = confirm('This action is irreversible. Are you sure?');

    if (response) {
      document.querySelectorAll('.workout').forEach(work => {
        this._deleteLogic(work);
      });
    }
  }

  _deleteLogic(workoutEl) {
    const workoutIndex = this.#workouts.findIndex(
      workout => workout.id === workoutEl.dataset.id
    );

    workoutEl.remove();

    const { marker } = this.#markers.find(
      el => el.workoutId === workoutEl.dataset.id
    );

    this.#map.removeLayer(marker);

    this.#workouts.splice(workoutIndex, 1);

    this._setLocalStorage();

    if (this.#workouts.length === 0) {
      deleteAllBtn.classList.add('hidden');
    }
  }
}

const app = new App();
