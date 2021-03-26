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

export function updateAddress(driverAddress, data){
    return fetch("/updateAddress?driverAddress="+encodeURIComponent(driverAddress), {method: 'POST', body: data})
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