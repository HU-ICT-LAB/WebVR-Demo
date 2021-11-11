import paho.mqtt.client as paho
import json
import operator

"broker server:"
broker = "broker.emqx.io"
port = 1883

def on_publish(client, userdata, result):  # create function for callback
    '''
    when data is published, this function will be ran and print data published string
    :param client: the client object (client1 in our case)
    :param userdata: the detailed information about the user
    :param result: the message results
    '''
    print("data published \n")
    pass

client1 = paho.Client("gamemodespub")  # create client object

def on_connect(client, userdata, flags, rc):
    '''
    when connected to the server, subscribe to the topics
    :param client: the client object (client1 in our case)
    :param userdata: the detailed information about the user
    :param flags: gives more detailed information about message
    :param rc: return code (0 is accepted, 1 is rejected)
    '''
    client1.subscribe("request_scoretopic")
    client1.subscribe("request_updatescore")


def updateleaderboard(new_score="5", new_name="anonymous"):
    '''
    adds the new score and it's name to the leaderboard.txt and delete the lowest value and then overwrites it
    :param new_score: the score that needs to be put in leaderboard
    :param new_name: the new_name that goes with the score as key of the dictionary
    '''
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
    '''
    receive the highscore from the leaderboard.txt and return it
    :rtype: returns the highscores from the leaderboard.txt

    '''
    highscore_file = open("leaderboard.txt", "r")
    highscorestring = ""
    for score in highscore_file:
        highscorestring = highscorestring + score
    print("data:" + highscorestring)
    return highscorestring

def on_message(client, userdata, msg):
    '''
    when a message is received, checkout it's topic to run the correct functions
    :param client: the client object (client1 in our case)
    :param userdata: the detailed information about the user
    :param msg: message itself
    '''
    if msg.topic == "request_scoretopic":
        client1.publish('hbo_ict_vr_game_score', getleaderboard())  # publish
    if msg.topic == "request_updatescore":
        updateleaderboard(msg.payload.decode("utf-8"))
        client1.publish('hbo_ict_vr_game_score', getleaderboard())


"code to connect to the server and which message is connect to which function"
client1.on_publish = on_publish  # assign function to callback
client1.on_connect = on_connect
client1.on_message = on_message
client1.connect(broker, port)  # establish connection

"let is run until manual interruption"
running = True
while running:
    client1.loop()


