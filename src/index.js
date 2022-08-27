import './css/styles.css';
import { fetchCountries } from './fetchCountries';

import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const DEBOUNCE_DELAY = 300;

const refs = {
  input: document.querySelector('#search-box'),
  list: document.querySelector('.country-list'),
  info: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInputValue, DEBOUNCE_DELAY));
// refs.input.addEventListener('input', onInputValue);

// console.log(debounce);

function onInputValue(e) {
  const name = e.target.value.trim();
  //   console.log(name);

  refs.list.innerHTML = '';
  refs.info.innerHTML = '';

  fetchCountries(name)
    .then(countries => {
      // console.log(res);
      if (countries.length === 1) {
        refs.list.insertAdjacentHTML(
          'beforeend',
          renderCountriesList(countries)
        );
        refs.info.insertAdjacentHTML('beforeend', renderCountryInfo(countries));
      } else if (countries.length >= 10) {
        refs.info.innerHTNL = '';
        alertTooManyMatches();
      } else {
        refs.info.innerHTNL = '';
        refs.list.insertAdjacentHTML(
          'beforeend',
          renderCountriesList(countries)
        );
      }
    })
    .catch(noSuchCountry);
}

function renderCountriesList(countries) {
  const markup = countries
    .map(({ name, flags }) => {
      return `
          <li class="country-list__item">
              <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 50px height = 30px>
              <h2 class="country-list__name">${name.official}</h2>
          </li>
          `;
    })
    .join('');
  return markup;
}

function renderCountryInfo(countries) {
  const markup = countries
    .map(({ capital, population, languages }) => {
      return `
        <ul class="country-info__list">
            <li class="country-info__item"><p><b>Capital: </b>${capital}</p></li>
            <li class="country-info__item"><p><b>Population: </b>${population}</p></li>
            <li class="country-info__item"><p><b>Languages: </b>${Object.values(
              languages
            ).join(', ')}</p></li>
        </ul>
        `;
    })
    .join('');
  return markup;
}

function alertTooManyMatches() {
  Notify.info('Too many matches found. Please enter a more specific name.');
}

function noSuchCountry() {
  Notify.failure('Oops, there is no country with that name');
}