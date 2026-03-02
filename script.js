
async function searchCountry(countryName) {
    const s = document.getElementById('loading-spinner');
    const errEl = document.getElementById('error-message');
    // clear any previous error as soon as a new search starts
    if (errEl) {
        errEl.textContent = '';
        errEl.classList.add('hidden');
    }

    try {
        // Show loading spinner
        if (s) s.classList.remove('hidden');

        // Fetch country data
        const response = await fetch(`https://restcountries.com/v3.1/name/${countryName}`);
        const data = await response.json();

        // Update DOM
        const country = data[0];
        // ensure error message stays hidden on success
        if (errEl) {
            errEl.textContent = '';
            errEl.classList.add('hidden');
        }
        document.getElementById('country-info').innerHTML = `<h2>${country.name.common}</h2>
        <p><strong>Capital:</strong> ${country.capital[0]}</p>
        <p><strong>Population:</strong> ${country.population.toLocaleString()}</p>
        <p><strong>Region:</strong> ${country.region}</p>
        <img class="main-flag" src="${country.flags.svg}" alt="${country.name.common} flag">`;

        // Fetch bordering countries: name and flag for each neighbor
        const borders = country.borders || [];
        document.getElementById('bordering-countries').innerHTML = '<h2>Bordering Countries:</h2>';
        for (let countryCode of borders) {
            let response_b = await fetch(`https://restcountries.com/v3.1/alpha/${countryCode}`);
            let data_b = await response_b.json();
            let border = data_b[0];
            document.getElementById('bordering-countries').innerHTML += `
                <div class="border-item">
                    <h3>${border.name.common}</h3>
                    <img class="border-flag" src="${border.flags.svg}" alt="${border.name.common} flag">
                </div>`;
        }



    } catch (error) {
        // Show error message
        console.error(error);
        const errEl = document.getElementById('error-message');
        if (errEl) {
            errEl.textContent = 'Invalid country name.';
            errEl.classList.remove('hidden');
        }
        // also clear previous country info and borders since the search failed
        document.getElementById('country-info').innerHTML = '';
        document.getElementById('bordering-countries').innerHTML = '';
    } finally {
        // Always hide loading spinner
        if (s) s.classList.add('hidden');
    }
}

// Event listeners
document.getElementById('search-btn').addEventListener('click', () => {
    const country = document.getElementById('country-input').value;
    searchCountry(country);
});