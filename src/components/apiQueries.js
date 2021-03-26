export function getNumUsers(){
    return fetch("/numUsers")
        .then(res => res.json())
        .then(data => {return data.numUsers})
        .catch(error => console.error(error));
}

export function getDrivers(){
    return fetch("/drivers")
        .then(res => res.json())
        .then(data => {return data})
        .catch(error => console.error(error));
}

export function getVehicles(driverAddress){
    return fetch("/vehicles?driverAddress="+driverAddress)
        .then(res => res.json())
        .then(data => {return data})
        .catch(error => console.error(error));
}