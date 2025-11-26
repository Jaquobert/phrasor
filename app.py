from flask import Flask, render_template, request, session, jsonify
import random
import requests
import csv

app = Flask(__name__)
app.secret_key = "un_secret_ultra_random_à_changer"

GOOGLE_SHEET_URL = "https://docs.google.com/spreadsheets/d/e/2PACX-1vRWgq55k8FyTT11Hu4yPyRM-AMQBqLW0BKmdEW1JRyj5e1RVTndtPgnuYkosoxUpReqdzpNigV-4OdB/pub?output=csv"


# ------------------------------
#   CHARGEMENT GOOGLE SHEETS
# ------------------------------

def load_words_from_google_sheet():
    try:
        response = requests.get(GOOGLE_SHEET_URL)
        response.raise_for_status()
        response.encoding = "utf-8"

        lines = response.text.splitlines()
        reader = csv.reader(lines)

        words = [row[0].strip() for row in reader if row and row[0].strip()]
        return words
    except Exception as e:
        print("Erreur chargement Google Sheet:", e)
        return []


words = load_words_from_google_sheet()


# ------------------------------
#   API WORDS (MODE MINIMAL)
# ------------------------------

@app.route("/api/words")
def api_words():
    """Renvoie tous les mots disponibles pour le phrasor minimal."""
    return jsonify({"words": words})


# ------------------------------
#   (ANCIEN CLOUD – OK DE LE LAISSER)
#   utilisable si un jour tu veux remettre un nuage
# ------------------------------

def approx_syllables(mot: str) -> int:
    voyelles = "aeiouyàâäéèêëîïôöùûüAEIOUY"
    count = sum(c in voyelles for c in mot)
    return max(1, count)


def generate_cloud(word_list, n, w1, w2, w3, w4):
    weighted_pool = []
    for mot in word_list:
        syl = approx_syllables(mot)
        if syl == 1:
            weight = w1
        elif syl == 2:
            weight = w2
        elif syl == 3:
            weight = w3
        else:
            weight = w4

        rep = int(weight * 100)
        if rep <= 0:
            rep = 1

        weighted_pool.extend([mot] * rep)

    if not weighted_pool:
        return []

    n = min(n, len(weighted_pool))
    return random.sample(weighted_pool, n)


@app.route("/api/cloud")
def api_cloud():
    """Toujours là si tu veux un jour réactiver un nuage."""
    try:
        n = int(request.args.get("n", 10))
        x = float(request.args.get("x", 0.5))
        y = float(request.args.get("y", 0.5))
    except ValueError:
        return jsonify({"error": "params invalid"}), 400

    w1 = (1 - x) * (1 - y)  # 1 syllabe
    w2 = x * (1 - y)        # 2 syllabes
    w3 = x * y              # 3 syllabes
    w4 = (1 - x) * y        # 4+ syllabes

    cloud = generate_cloud(words, n, w1, w2, w3, w4)
    return jsonify({"cloud": cloud})


# ------------------------------
#   RECHARGER LES MOTS
# ------------------------------

@app.route("/reload", methods=["POST"])
def reload_words_route():
    global words
    words = load_words_from_google_sheet()
    return jsonify({"status": "ok"})


# ------------------------------
#   INDEX (NOUVEAU MODE MINIMAL)
# ------------------------------

@app.route("/")
def index():
    # plus besoin de parchment ici, on affiche juste l’éditeur
    return render_template("index.html")


if __name__ == "__main__":
    app.run(debug=True)
