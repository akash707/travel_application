const getLocalStorageItem = (itemName) => {
    const existingData = localStorage.getItem(itemName);
    if(existingData){
        return JSON.parse(existingData);
    }
}

const setLocalStorageItem = (itemName, value) => {
    localStorage.setItem(itemName, JSON.stringify(value))
}

export {getLocalStorageItem, setLocalStorageItem}