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
    client2.subscribe("hbo_ict_vr_request_data")
    client2.subscribe("hbo_ict_vr_data_last_movement")
    client2.subscribe("request_simple_move_data")


def updatelastmovement(new_data="5"):
    file_object = open('datafiles/lastmovement.txt', 'w+')
    file = open("datafiles/lastmovement.txt")
    print(new_data)
    if not (new_data in file.read()):
        file_object.write(new_data)

    # Close the file
    file_object.close()
    # print("new data:", new_data)

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


def getlastmovement():
    """
    receive the highscore from the leaderboard.txt and return it
    :rtype: returns the highscores from the leaderboard.txt

    """
    global lastmovement_simplified_string
    lastmovementfile = open("datafiles/lastmovement.txt", "r")
    for lastmovementline in lastmovementfile:
        lastmovement = json.loads(lastmovementline)
        lastmovement_simplified_string = "L(" + \
                                         str(round(float(lastmovement[1]["x"]),1)) + "," + \
                                         str(round(float(lastmovement[1]["y"]),1))  + "," + \
                                         str(round(float(lastmovement[1]["z"]),1))  + ")" + \
                                         " R(" + \
                                         str(round(float(lastmovement[2]["x"]),1)) + "," + \
                                         str(round(float(lastmovement[2]["y"]),1))  + "," + \
                                         str(round(float(lastmovement[2]["z"]),1))  + ")"
        # print(lastmovement_simplified_string)
    return lastmovement_simplified_string


def on_message(client, userdata, msg):
    """
    when a message is received, checkout it's topic to run the correct functions
    :param client: the client object (client1 in our case)
    :param userdata: the detailed information about the user
    :param msg: message itself
    """
    if msg.topic == "hbo_ict_vr_data_last_movement":
        updatelastmovement(msg.payload.decode("utf-8"))
        # client2.publish('hbo_ict_vr_game_score', getdataboard())  # publish

    if msg.topic == "hbo_ict_vr_request_data":
        pass
        # getlastmovement()
        print('send simply data')
        client2.publish('hbo_ict_vr_request_simplified_lastmovement', getlastmovement())


# code to connect to the server and which message is connect to which function
client2.on_publish = on_publish  # assign function to callback
client2.on_connect = on_connect
client2.on_message = on_message
client2.connect(broker, port)  # establish connection

# let is run until manual interruption
running = True
while running:
    client2.loop()
