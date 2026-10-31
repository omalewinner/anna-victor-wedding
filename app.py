import os
import uuid
import requests
from flask import Flask, render_template, request, jsonify, url_for
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

FLW_SECRET_KEY = os.getenv("FLW_SECRET_KEY", "FLWSECK_TEST-xxxx")

FLW_BASE_URL = "https://api.flutterwave.com/v3"

# Temporary storage for wishes
wishes = []


@app.route('/')
def home():
    return render_template('index.html', wishes=wishes)


@app.route('/submit-wish', methods=['POST'])
def submit_wish():
    data = request.json
    name = data.get('name')
    message = data.get('message')

    if name and message:
        wishes.append({"name": name, "message": message})
        return jsonify({"status": "success", "message": "Thank you for your blessing!"})

    return jsonify({"status": "error", "message": "Please fill all fields."}), 400


@app.route('/initiate-payment', methods=['POST'])
def initiate_payment():
    data = request.json
    amount = data.get('amount')
    email = data.get('email', 'guest@annavictor.com')
    name = data.get('name', 'Wedding Guest')

    if not amount or float(amount) < 100:
        return jsonify({"status": "error", "message": "Minimum gift amount is 100 NGN"}), 400

    tx_ref = str(uuid.uuid4())

    payload = {
        "tx_ref": tx_ref,
        "amount": float(amount),
        "currency": "NGN",
        "redirect_url": url_for('payment_callback', _external=True),
        "customer": {"email": email, "name": name},
        "customizations": {
            "title": "Anna & Victor Wedding Gift",
            "description": "Thank you for blessing our home!"
        }
    }

    headers = {
        "Authorization": f"Bearer {FLW_SECRET_KEY}",
        "Content-Type": "application/json"
    }

    try:
        response = requests.post(f"{FLW_BASE_URL}/payments", json=payload, headers=headers, timeout=15)
        res = response.json()

        if res.get("status") == "success":
            return jsonify({"status": "success", "link": res["data"]["link"]})

        return jsonify({"status": "error", "message": res.get("message", "Payment init failed")}), 500

    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500


@app.route('/payment-callback')
def payment_callback():
    status = request.args.get('status')
    tx_ref = request.args.get('tx_ref')
    transaction_id = request.args.get('transaction_id')

    if status == 'successful':
        return "<h1>Thank you! Your gift was received.</h1><a href='/'>Return Home</a>"

    return "<h1>Payment Failed or Cancelled.</h1><a href='/'>Try Again</a>"


if __name__ == '__main__':
    app.run(debug=True)