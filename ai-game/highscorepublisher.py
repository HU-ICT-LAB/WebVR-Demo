import paho.mqtt.client as paho
import json
import operator

broker = "broker.emqx.io"
port = 1883


def on_publish(client, userdata, result):  # create function for callback
    print("data published \n")
    pass

client1 = paho.Client("gamemodespub")  # create client object

def on_connect(client, userdata, flags, rc):
    client1.subscribe("request_scoretopic")
    client1.subscribe("request_updatescore")


def updateleaderboard(new_score="5", new_name="anonymous"):
    print(new_name + ":" + new_score)
    highscore_file = open("leaderboard.txt", "r")
    readable_highscores = json.loads(highscore_file.readline())
    if new_name in readable_highscores.keys():
        if readable_highscores[new_name] < new_score:
            readable_highscores[new_name] = new_score
            readable_highscores = dict(sorted(readable_highscores.items(), key=operator.itemgetter(1), reverse=True))
    else:
        readable_highscores[new_name] = new_score
        readable_highscores = dict(sorted(readable_highscores.items(), key=operator.itemgetter(1), reverse=True))
        readable_highscores.popitem()

    fout = open("leaderboard.txt", "w")
    fout.write(json.dumps(readable_highscores))
    fout.close()
    print(readable_highscores)

def getleaderboard():
    highscore_file = open("leaderboard.txt", "r")
    highscorestring = ""
    for score in highscore_file:
        highscorestring = highscorestring + score
    print("data:" + highscorestring)
    return highscorestring

def on_message(client, userdata, msg):
    if msg.topic == "request_scoretopic":
        client1.publish('hbo_ict_vr_game_score', getleaderboard())  # publish
    if msg.topic == "request_updatescore":
        updateleaderboard(msg.payload.decode("utf-8"))
        client1.publish('hbo_ict_vr_game_score', getleaderboard())


client1.on_publish = on_publish  # assign function to callback
client1.on_connect = on_connect
client1.on_message = on_message
client1.connect(broker, port)  # establish connection
running = True
while running:
    client1.loop()


