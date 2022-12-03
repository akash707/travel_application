import {getLocalStorageItem, setLocalStorageItem} from './utilities.js';
const WAB_API_KEY = "b4d8a715ce6c4c95aad1db94b67f81fb";
const GEO_NAME_USERNAME = "akas.shukla";
const PB_API_KEY = "31783673-f3bb6e487ca7e90a006ed1fea";


/**
 * get weather data using lat and long
 * returns promise
 * @param {*} lat  : latitiude
 * @param {*} long : longitude
 */

const getWeatherData = (lat, long) => {
const url = `https://api.weatherbit.io/v2.0/current?lat=${lat}&lon=${long}&key=${WAB_API_KEY}`;
return fetch(url).then(response => response.json());
}

/**
 * get photos by city
 * @param {*} city : name of city
 * returns promise
 */
const getPlacePhotos = (city) => {
    const url = `https://pixabay.com/api/?key=${PB_API_KEY}&q=${city}&per_page={8}`;
    return fetch(url).then(response => response.json());
}

/**
 * function to get lat and long 
 * returns promise
 */
const getCoordinates = (city) => {
    const url = `http://api.geonames.org/searchJSON?q=${city}&maxRows=1&username=${GEO_NAME_USERNAME}`;
    return fetch(url).then(response => response.json());
}

/**
 * function to render travel list data on UI
 * @param {Object} data 
 * @param {*} from 
 * @param {*} to 
 */
const updateUI = (data, from, to) => {
    const travelList = document.getElementById("travel-list");
    if (travelList) {
        travelList.innerHTML = "";
        data.forEach(item => {
            const contentSection = document.createElement('div');
            const imageTag = document.createElement('img');
            imageTag.src = item.image;
            imageTag.className = 'item-image'
            imageTag.setAttribute('width', '300px');
            imageTag.setAttribute('height', '200px');
            contentSection.appendChild(imageTag);
            const titleText = document.createTextNode(`Your Trip From ${from ? from : ''} to ${to ? to : ''} Departure Date: ${item.date} and ${to ? to : ''} is 300 km away, ${item.weatherInfo} throught the day`);
            const paragraphElement = document.createElement('p');
            paragraphElement.appendChild(titleText);
            const buttonSection = document.createElement("div");
            buttonSection.className = "buttonSection";
            const saveItem = document.createElement("button");
            saveItem.onclick = function (event) {
                return saveTravelItem(event, item)
            }
            saveItem.appendChild(document.createTextNode("Save Item"))
            buttonSection.appendChild(saveItem);
            const removeItem = document.createElement("button");
            removeItem.onclick = function (event) {
                return removeTravelItem(event, item)
            }
            removeItem.appendChild(document.createTextNode("Remove Item"))
            const listItem = document.createElement("div");
            listItem.appendChild(paragraphElement);
            listItem.appendChild(saveItem);
            listItem.appendChild(removeItem);
            travelList.append(contentSection);
            travelList.appendChild(listItem);
        })
    }
}


/**
 *  main function of application to fetch all the data required 
 * @param {*} from : Place travelling from
 * @param {*} to : plave travelling to
 * @param {*} date : date of travel
 */
const getTravelData = async (from, to, date) => {
    const travelData = [];
    try {
        const coordinates = await getCoordinates(to);
        console.log("coordinates", coordinates);
        const geoNames = coordinates.geonames;
        if (Array.isArray(geoNames) && geoNames.length > 0) {
            const lat = geoNames[0].lat;
            const long = geoNames[0].lng;
            console.log("latitude longitude", lat, long);
            const weatherInfo = await getWeatherData(lat, long);
            const weatherData = weatherInfo.data;
            if (Array.isArray(weatherData) && weatherData.length > 0) {
                console.log("weather data", weatherData);
                const photos = await getPlacePhotos(to);
                const hits = photos.hits;
                if (Array.isArray(hits) && hits.length > 0) {
                    console.log("hits", hits);
                    const data = hits.map(item => ({
                        image: item.webformatURL,
                        weatherInfo: weatherData[0].weather.description,
                        date: date
                    }));
                    console.log("Data", data);
                    console.log(from, to);
                    updateUI(data, from, to);
                }
            }
        }
    } catch (error) {
        console.log("Error while getting travel data", error);
    }
}

const handleSubmit = () => {
    const errorElement = document.getElementById("error");
    const fromPlace = document.getElementById("from").value;
    const toPlace = document.getElementById("to").value;
    const date = document.getElementById("date").value;
    if (!fromPlace) {
        errorElement.innerText = "Please provide source location";
    } else if (!toPlace) {
        errorElement.innerText = "Please provide destination location"
    } else if (!date) {
        errorElement.innerText = "Please provide date of leaving"
    } else {
        getTravelData(fromPlace, toPlace, date);
    }
}

// function to save travel list item from local storage
const saveTravelItem = (event, item) => {
    const existingTravelList = getLocalStorageItem('travelList');
    if (existingTravelList && Array.isArray(existingTravelList)) {
        setLocalStorageItem('travelList', [...existingTravelList, item]);
    } else {
        setLocalStorageItem('travelList', [item]);
    }
}

// function to remove travel list item from local storage
const removeTravelItem = (event, item) => {
    const existingTraveList = getLocalStorageItem('travelList');
    if(existingTraveList && Array.isArray(existingTraveList)) {
        const remainingTravelListItem = existingTraveList.filter((travelListItem) => travelListItem.image !== item.image);
        setLocalStorageItem('travelList', remainingTravelListItem);
    }
}

/**
 * function to show already selected travel list item from local storage
 */
const showSavedTravelList = () => {
    const existingTravelList = localStorage.getItem('travelList');
    if(existingTravelList) {
        updateUI(JSON.parse(existingTravelList))
    }
}



export { handleSubmit, showSavedTravelList}
