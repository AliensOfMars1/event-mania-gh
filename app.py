import os
from flask import Flask, render_template, request, redirect, url_for, flash, Response

app = Flask(__name__)
app.secret_key = os.environ.get("SECRET_KEY", "change-me-in-production")

# Contact info used across templates
CONTACT = {
    "phone": "+233 557 372 348 or +233 573 756100",
    "whatsapp": "233557372348",  # digits only for wa.me link
    "email": "weddingsbyeventmania@gmail.com",
    "instagram": "https://instagram.com/eventmaniagh",
    "tiktok": "https://tiktok.com/@event_mania_gh",
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
        {"title": "Traditional Ceremony",  "category": "Traditional",    "img": "traditional-1.jpg"},
        {"title": "White Wedding",         "category": "Weddings",       "img": "whitewedding2.jpg"},        
        {"title": "Traditional Ceremony",  "category": "Traditional",    "img": "traditional2.jpg"},
        {"title": "Prewedding photoshoot",  "category": "Traditional",    "img": "traditional3.jpg"},
        {"title": "Muslim Wedding",        "category": "Muslim Wedding", "img": "muslimwedding4.jpeg"},        
        {"title": "Garden Wedding",        "category": "Weddings",       "img": "wedding-1.jpg"},
        {"title": "Golden Birthday",       "category": "Birthdays",      "img": "birthday-1.jpg"},
        {"title": "Corporate Gala",        "category": "Corporate",      "img": "corporate-1.jpg"},         
        {"title": "Traditional Ceremony",  "category": "Traditional",    "img": "traditional4.jpg"},          
        {"title": "Beach Wedding",         "category": "Weddings",       "img": "wedding-2.jpg"},
        {"title": "White Wedding",         "category": "Weddings",       "img": "whitewedding1.jpg"},
        {"title": "White Wedding",         "category": "Weddings",       "img": "whitewedding3.jpg"},         
        {"title": "Bridal Shower",         "category": "Bridal Shower",  "img": "bridalshower1.jpg"},
        {"title": "Bridal Shower",         "category": "Bridal Shower",  "img": "bridalshower2.jpg"},        
        {"title": "Milestone Birthday",    "category": "Birthdays",      "img": "birthday1.jpg"},
        {"title": "Milestone Birthday",    "category": "Birthdays",      "img": "birthday2.jpg"},
        {"title": "Product Launch",        "category": "Corporate",      "img": "corporate-2.jpg"},
        {"title": "Promotional Event",     "category": "Corporate",      "img": "corporate3.jpg"}, 
        {"title": "Promotional Event",     "category": "Corporate",      "img": "corporate4.jpg"},               
        {"title": "Baby Christening",      "category": "Christening",    "img": "christening1.jpg"},
        {"title": "Muslim Wedding",        "category": "Muslim Wedding", "img": "muslimwedding1.jpeg"},
        {"title": "Muslim Wedding",        "category": "Muslim Wedding", "img": "muslimwedding2.jpeg"},
        {"title": "Muslim Wedding",        "category": "Muslim Wedding", "img": "muslimwedding3.jpeg"},                
        {"title": "Celebration of Life",   "category": "Funeral",        "img": "funeral2.jpg"},
    ]
    return render_template("portfolio.html", items=items)


@app.route("/contact")
def contact():
    # Formspree handles the POST — this route just renders the page.
    return render_template("contact.html")


@app.errorhandler(404)
def not_found(e):
    return render_template("404.html"), 404

@app.route("/sitemap.xml")
def sitemap():
    # List all the pages you want search engines to crawl
    pages = [
        "index",
        "portfolio",
        "services",
        "about",
        "contact"
    ]
    
    # Start the XML string
    xml = '<?xml version="1.0" encoding="UTF-8"?>\n'
    xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
    
    # Loop through pages and build the URLs dynamically
    for page in pages:
        # _external=True generates the full domain automatically (e.g., https://eventmaniagh.com/)
        # _scheme="https" forces secure URLs
        url = url_for(page, _external=True, _scheme="https")
        
        # Set priorities based on the page
        priority = "1.0" if page == "index" else "0.8"
        
        xml += '  <url>\n'
        xml += f'    <loc>{url}</loc>\n'
        xml += f'    <changefreq>weekly</changefreq>\n'
        xml += f'    <priority>{priority}</priority>\n'
        xml += '  </url>\n'
        
    xml += '</urlset>'
    
    # Return the response with the correct XML header
    return Response(xml, mimetype='application/xml')    


if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=int(os.environ.get("PORT", 5000)))