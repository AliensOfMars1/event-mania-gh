import os
from flask import Flask, render_template, request, redirect, url_for, flash

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "change-me-in-production")

# Contact info used across templates
CONTACT = {
    "phone": "+233 54 418 1268",
    "whatsapp": "233544181268",  # digits only for wa.me link
    "email": "hello@eventmaniagh.com",
    "instagram": "https://instagram.com/eventmaniagh",
    "location": "Accra, Ghana",
}


@app.context_processor
def inject_globals():
    return {"contact": CONTACT}


@app.route("/")
def index():
    return render_template("index.html")


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/services")
def services():
    return render_template("services.html")


@app.route("/portfolio")
def portfolio():
    items = [
        {"title": "Garden Wedding", "category": "Weddings", "img": "wedding-1.jpg"},
        {"title": "Golden Birthday", "category": "Birthdays", "img": "birthday-1.jpg"},
        {"title": "Corporate Gala", "category": "Corporate", "img": "corporate-1.jpg"},
        {"title": "Traditional Ceremony", "category": "Traditional", "img": "traditional-1.jpg"},
        {"title": "Beach Wedding", "category": "Weddings", "img": "wedding-2.jpg"},
        {"title": "Bridal Shower", "category": "Weddings", "img": "wedding-3.jpg"},
        {"title": "Milestone Birthday", "category": "Birthdays", "img": "birthday-2.jpg"},
        {"title": "Product Launch", "category": "Corporate", "img": "corporate-2.jpg"},
    ]
    return render_template("portfolio.html", items=items)


@app.route("/contact")
def contact():
    # Formspree handles the POST — this route just renders the page.
    return render_template("contact.html")


@app.errorhandler(404)
def not_found(e):
    return render_template("404.html"), 404


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))