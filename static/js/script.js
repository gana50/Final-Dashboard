let cryptoChart;

// --- Load top cryptocurrencies ---
async function loadCrypto() {
    try {
        const res = await fetch("/crypto");
        const coins = await res.json();

        // --- Update chart ---
        const labels = coins.map(c => c.symbol);
        const prices = coins.map(c => c.price);

        const ctx = document.getElementById('cryptoChart').getContext('2d');

        if (cryptoChart) {
            cryptoChart.data.labels = labels;
            cryptoChart.data.datasets[0].data = prices;
            cryptoChart.update();
        } else {
            cryptoChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Price in USD',
                        data: prices,
                        backgroundColor: 'rgba(54, 162, 235, 0.7)'
                    }]
                },
                options: {
                    responsive: true,
                    plugins: { legend: { display: false } }
                }
            });
        }

        // --- Update table ---
        const tbody = document.querySelector("#cryptoTable tbody");
        tbody.innerHTML = "";
        coins.forEach(c => {
            const tr = document.createElement("tr");
            tr.innerHTML = `
                <td>${c.name}</td>
                <td>${c.symbol}</td>
                <td>${c.price.toFixed(2)}</td>
                <td style="color: ${c.change >= 0 ? 'green' : 'red'}">${c.change.toFixed(2)}</td>
            `;
            tbody.appendChild(tr);
        });

    } catch (err) {
        console.error("Error fetching crypto data:", err);
    }
}

// Initial load and refresh every 10 seconds
loadCrypto();
setInterval(loadCrypto, 10000);


// --- Movie search ---
async function searchMovie() {
    const query = document.getElementById("movieQuery").value;
    const resultsDiv = document.getElementById("movieResults");
    resultsDiv.innerHTML = "";

    if (!query) return;

    try {
        const res = await fetch(`/search_movie?query=${encodeURIComponent(query)}`);
        const data = await res.json();

        if (!data.length) {
            resultsDiv.innerHTML = "<p>No movies found.</p>";
            return;
        }

        data.forEach(movie => {
            const movieEl = document.createElement("div");
            movieEl.innerHTML = `
                <h3><a href="https://www.themoviedb.org/movie/${movie.id}" target="_blank">${movie.title}</a></h3>
                <p>${movie.overview}</p>
                ${movie.poster ? `<img src="${movie.poster}" alt="${movie.title}">` : ""}
                <hr>
            `;
            resultsDiv.appendChild(movieEl);
        });

    } catch (err) {
        console.error("Error fetching movies:", err);
        resultsDiv.innerHTML = "<p>Error fetching movies.</p>";
    }
}

// Attach search button
document.getElementById("searchBtn").addEventListener("click", searchMovie);
