export function getNumUsers(){
    return fetch("/numUsers")
        .then(res => res.json())
        .then(data => {return data.numUsers})
        .catch(error => console.error(error));
}