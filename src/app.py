from flask import Flask
from dotenv import load_dotenv
import os

load_dotenv()
API_KEY = "123456"
app = Flask(__name__)

app.config["SECRET_KEY"] = os.getenv("SECRET_KEY")

@app.route("/")
def home():
    return "FUNCIONANDO"

if __name__ == "__main__":
    app.run(port=3000)