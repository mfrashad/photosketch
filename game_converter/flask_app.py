from flask import Flask, render_template, request, session, redirect, url_for, jsonify
from werkzeug.utils import secure_filename
from werkzeug.utils import secure_filename
from base64 import b64encode
import os
import json
import linedetection
import sqlite3 as sql
from passlib.hash import sha256_crypt
from datetime import datetime


currentfilepath = os.path.dirname(os.path.abspath(__file__))

## DB part -> 2 tables
# first table for user data
# second table to map username to gamefile + game's metadata
with sql.connect(os.path.join(currentfilepath,'ProtoSketch.db')) as conn:
	conn.execute('CREATE TABLE IF NOT EXISTS users(username text UNIQUE, password text);')
	conn.execute('CREATE TABLE IF NOT EXISTS games(user_creator text, filename text, about text, start_date text, thumbnail_link text);')

app = Flask(__name__)

UPLOAD_FOLDER = os.path.join(currentfilepath,"static")
OUTPUT_FOLDER = os.path.join(currentfilepath,"saved_games")
ALLOWED_EXTENSIONS = set(["jpg", "jpeg", "png", "gif"])
app.config["UPLOAD_FOLDER"] = UPLOAD_FOLDER


def allowed_file(filename):
	return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS


@app.route("/login")
def login():
	pass

@app.route("/signup")
def signup():
	pass

@app.route("/")
def index():
	return render_template('index.html')

@app.route("/upload_image", methods = ['POST'])
def submit_image():
	target=os.path.join(UPLOAD_FOLDER,'uploads')
	if not os.path.isdir(target):
		os.mkdir(target)

	file = request.files['file']

	print(file)

	filename = secure_filename(file.filename)

	destination="/".join([target, filename])

	file.save(destination)

	fileslist = os.listdir(OUTPUT_FOLDER)
	fileslist.remove(".DS_Store")

	new_file_num = str(len(fileslist) + 1)
	generated_jsons_filename = new_file_num + ".txt"

	json_output = linedetection.imgtojson(destination,True, "/".join([OUTPUT_FOLDER, generated_jsons_filename]), new_file_num)

	startdate = str(datetime.now().strftime('%Y-%m-%d-%H:%M'))

	with sql.connect(os.path.join(currentfilepath,'ProtoSketch.db')) as conn:
		cur = conn.cursor()
		cur.execute('INSERT INTO games VALUES (?,?,NULL,?,?);', ("Nuode_admin", "/".join([OUTPUT_FOLDER,generated_jsons_filename]), startdate, destination))
		conn.commit()

	#print("Json file created and stored")
	#response= "Thanks for the file upload"
	return json_output

@app.route("/game/<game_id>", methods = ['GET'])
def get_game(game_id):
	try:
		with open(OUTPUT_FOLDER + "/" + game_id + ".txt") as json_file:
			data = json.load(json_file)
	except:
		data = "Error, file not found"
	return data


@app.route("/test_games", methods = ['GET'])
def see_games():
	with sql.connect(os.path.join(currentfilepath,'ProtoSketch.db')) as conn:
		cur = conn.cursor()
		results = cur.execute("SELECT * FROM games").fetchall()
	return str(results)

@app.route("/test_users", methods = ['GET'])
def see_users():
	with sql.connect(os.path.join(currentfilepath,'ProtoSketch.db')) as conn:
		cur = conn.cursor()
		results = cur.execute("SELECT * FROM users").fetchall()
	return str(results)

@app.route("/user_games/<user_id>", methods = ['GET'])
def user_games(user_id):
	#data = GamesTable.query.filter_by(user_creator = user_id).all()

	with sql.connect(os.path.join(currentfilepath,'ProtoSketch.db')) as conn:
		cur = conn.cursor()
		data = cur.execute("SELECT * FROM games;").fetchall()

	displaylist = []
	for game in data:
		mystr = game[4].replace('/Users/nuode/Desktop/KurtisTech/',"")
		mystr = "http://127.0.0.1:5000/" + mystr
		
		displaylist.append([game[0],"https://photosketch.pythonanywhere.com/game/" + str(game.id),game.about,str(game.start_date),mystr])

	print(data)

	"""
	for game in data:
		mystr = game.thumbnail_link.replace('/home/PhotoSketch/mysite/',"")
		mystr = "https://photosketch.pythonanywhere.com/" + mystr

		displaylist.append([game.id,game.user_creator,"https://photosketch.pythonanywhere.com/game/" + str(game.id),game.about,str(game.start_date),mystr])
	"""
	return json.dumps(displaylist)


if __name__ == "__main__":
	app.secret_key = os.urandom(24)
	app.run(debug=True)
