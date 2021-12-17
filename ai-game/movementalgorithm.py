import paho.mqtt.client as paho
import json
import operator

# broker server:
broker = "broker.emqx.io"
port = 1883


def on_publish(client, userdata, result):  # create function for callback
    """
    when data is published, this function will be ran and print data published string
    :param client: the client object (client1 in our case)
    :param userdata: the detailed information about the user
    :param result: the message results
    """
    print("data published \n")
    pass


client2 = paho.Client("gamemodespub")  # create client object


def on_connect(client, userdata, flags, rc):
    """
    when connected to the server, subscribe to the topics
    :param client: the client object (client1 in our case)
    :param userdata: the detailed information about the user
    :param flags: gives more detailed information about message
    :param rc: return code (0 is accepted, 1 is rejected)
    """
    client2.subscribe("hbo_ict_vr_game_player_stats")
    client2.subscribe("request_simple_move_data")


def updatedataboard(new_data="5"):
    print(new_data)
    # new_scorenumber = new_score.split(":")[1]
    # new_name=new_score.split(":")[0]
    # if len(new_scorenumber) == 1:
    #     new_scorenumber = "0" + new_scorenumber
    # print(new_name + ":" + new_scorenumber)
    # highscore_file = open("leaderboard.txt", "r")
    # readable_highscores = json.loads(highscore_file.readline())
    # if new_name in readable_highscores.keys():
    #     if readable_highscores[new_name] < new_scorenumber:
    #         readable_highscores[new_name] = new_scorenumber
    #         readable_highscores = dict(sorted(readable_highscores.items(), key=operator.itemgetter(1), reverse=True))
    # else:
    #     readable_highscores[new_name] = new_scorenumber
    #     readable_highscores = dict(sorted(readable_highscores.items(), key=operator.itemgetter(1), reverse=True))
    #     readable_highscores.popitem()
    #
    # fout = open("leaderboard.txt", "w")
    # fout.write(json.dumps(readable_highscores))
    # fout.close()
    # print(readable_highscores)


def getdataboard():
    """
    receive the highscore from the leaderboard.txt and return it
    :rtype: returns the highscores from the leaderboard.txt

    """
    highscore_file = open("databoard.txt", "r")
    highscorestring = ""
    for score in highscore_file:
        highscorestring = highscorestring + score
    print("data:" + highscorestring)
    return highscorestring


def on_message(client, userdata, msg):
    """
    when a message is received, checkout it's topic to run the correct functions
    :param client: the client object (client1 in our case)
    :param userdata: the detailed information about the user
    :param msg: message itself
    """
    if msg.topic == "hbo_ict_vr_game_player_stats":
        updatedataboard(msg.payload.decode("utf-8"))
        # client2.publish('hbo_ict_vr_game_score', getdataboard())  # publish

    if msg.topic == "request_simple_move_data":
        client2.publish('hbo_ict_vr_game_score', getdataboard())


# code to connect to the server and which message is connect to which function
client2.on_publish = on_publish  # assign function to callback
client2.on_connect = on_connect
client2.on_message = on_message
client2.connect(broker, port)  # establish connection

# let is run until manual interruption
running = True
while running:
    client2.loop()
