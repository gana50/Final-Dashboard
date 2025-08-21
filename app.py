from flask import Flask, render_template, request, jsonify
import requests

app = Flask(__name__)

TMDB_API_KEY = "7a348f5cb4840f2302c8071ff7b47582"  # Replace with your TMDB API key

# --- Home route ---
@app.route("/")
def index():
    return render_template("index.html")

# --- Movie search API route ---
@app.route("/search_movie", methods=["GET"])
def search_movie():
    query = request.args.get("query")
    url = f"https://api.themoviedb.org/3/search/movie?api_key={TMDB_API_KEY}&query={query}"
    response = requests.get(url)
    data = response.json()
    results = []
    if data.get("results"):
        for movie in data["results"][:5]:  # Top 5 results
            results.append({
                "id": movie["id"],
                "title": movie["title"],
                "overview": movie["overview"],
                "poster": f"https://image.tmdb.org/t/p/w200{movie['poster_path']}" if movie["poster_path"] else ""
            })

    return jsonify(results)

# --- Crypto data API route ---
@app.route("/crypto", methods=["GET"])
def crypto():
    url = "https://api.coingecko.com/api/v3/coins/markets"
    params = {"vs_currency": "usd", "order": "market_cap_desc", "per_page": 5, "page": 1, "sparkline": False}
    response = requests.get(url, params=params)
    data = response.json()
    coins = []
    for coin in data:
        coins.append({
            "name": coin["name"],
            "symbol": coin["symbol"].upper(),
            "price": coin["current_price"],
            "change": coin["price_change_percentage_24h"]
        })
    return jsonify(coins)

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))
