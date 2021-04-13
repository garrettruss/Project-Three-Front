const BASE_URL = `https://project3back.herokuapp.com/api/mountains`;


function fetchMountains(userId) {
     return fetch(BASE_URL + '?uid=' + userId).then(res => res.json());
}

function deleteMountain(mountainId) {
    return fetch (Base_URL + '/' + mountainId,
    {method: 'DELETE'   
    }).then(res => res.json());
}

export {
    fetchMountains,
    deleteMountain,
}