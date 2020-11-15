const apiKey = "YqM01XhgZtkxd2R2HIyPm89gVjhhdcGbbUfagWIX"
const baseUrl = "https://developer.nps.gov/api/v1/parks"

function formatQuery(params) {
    const query = Object.keys(params)
        .map(key => `${encodeURIComponent(key)}=${params[key]}`);
    return query.join('&');
}

function displayResults(responseJson) {
    console.log(responseJson)
    $('#results-list').empty();
    $('#js-error-message').empty();
    $('.results').removeClass('hidden');

    for (let i = 0; i < responseJson.data.length; i++) {
        let address = {};
        for (let j = 0; j < responseJson.data[i].addresses.length; j++) {
            if (responseJson.data[i].addresses[j].type === "Physical") {
                address = responseJson.data[i].addresses[j];
            };
        };
        $('#results-list').append(`<li><h3>${responseJson.data[i].fullName}</h3>
            <p>${responseJson.data[i].description}</p>
            <a href="${responseJson.data[i].url}" target="_blank">${responseJson.data[i].url}</a>
            <section class="address">
            <h4>Address</h4>
            <p>${address.line1}</p>
            <p>${address.line2}</p>
            <p>${address.line3}</p>
            <p>${address.city}, ${address.stateCode} ${address.postalCode}</p>
            </section>
            </li>`
        );
    };
}

function getParks(query, numResults) {
    const params = {
        stateCode: query,
        limit: numResults,
        api_key: apiKey
    };

    const queryString = formatQuery(params);
    const url = baseUrl + '?' + queryString;
    console.log(url);

    fetch(url)
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            throw new Error(response.statusText);
        })
        .then(responseJson => displayResults(responseJson))
        .catch(err => {
            $('#js-error-message').text(`Something went wrong: ${err.message}`);
        });
}

function handleSubmit(){
    $('form').submit(event => {
        event.preventDefault();
        const query = $('#states').val().split(" ").join("");
        const numResults = $('#num-results').val();
        getParks(query, numResults);
    });
}

$(handleSubmit());