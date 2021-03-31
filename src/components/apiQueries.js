export function renewReg(driverAddress, data){
    return fetch("/renewReg?driverAddress="+encodeURIComponent(driverAddress), {method: 'POST', body: data})
        .then(res => res.json())
        .then(data => {return data})
        .catch(error => console.error(error));
}

export function renewDL(driverAddress, data){
    return fetch("/renewDL?driverAddress="+encodeURIComponent(driverAddress), {method: 'POST', body: data})
        .then(res => res.json())
        .then(data => {return data})
        .catch(error => console.error(error));
}

export function vehicleSoldOrTraded(driverAddress, data){
    return fetch("/vehicleSoldOrTraded?driverAddress="+encodeURIComponent(driverAddress), {method: 'POST', body: data})
        .then(res => res.json())
        .then(data => {return data})
        .catch(error => console.error(error));
}

export function createRealID(driverAddress){
    return fetch("/realID?driverAddress="+encodeURIComponent(driverAddress))
        .then(res => res.json())
        .then(data => {return data})
        .catch(error => console.error(error));
}

export function updatePracticeExamScore(driverAddress, data){
    return fetch("/updatePracticeExamScore?driverAddress="+encodeURIComponent(driverAddress), {method: 'POST', body: data})
        .then(res => res.json())
        .then(data => {return data})
        .catch(error => console.error(error));
}

export function updateAddress(driverAddress, data){
    return fetch("/updateAddress?driverAddress="+encodeURIComponent(driverAddress), {method: 'POST', body: data})
        .then(res => res.json())
        .then(data => {return data})
        .catch(error => console.error(error));
}

export function updateVehicleOwner(driverAddress, newOwner, data){
    return fetch("/updateVehicleOwner?driverAddress="+encodeURIComponent(driverAddress)+"&newOwner="+encodeURIComponent(newOwner), {method: 'POST', body: data})
        .then(res => res.json())
        .then(data => {return data})
        .catch(error => console.error(error));
}

export function VATitle(driverAddress, vin){
    return fetch("/vaTitle?driverAddress="+encodeURIComponent(driverAddress)+"&vin="+vin)
        .then(res => res.json())
        .then(data => {return data})
        .catch(error => console.error(error));
}

export function getDrivers(){
    return fetch("/drivers")
        .then(res => res.json())
        .then(data => {return data})
        .catch(error => console.error(error));
}

export function getVehicles(driverAddress){
    return fetch("/vehicles?driverAddress="+encodeURIComponent(driverAddress))
        .then(res => res.json())
        .then(data => {return data})
        .catch(error => console.error(error));
}

export function checkChainValidity(){
    return fetch("/checkChainValidity")
        .then(res => res.json())
        .then(data => {return data})
        .catch(error => console.error(error));
}