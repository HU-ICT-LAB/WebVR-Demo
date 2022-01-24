import ast
import csv
from datetime import datetime
import paho.mqtt.client as paho
import pandas as pd
import numpy as np

#------------------------CSV PART---------------------:
fieldnames = ['name', 'time', 'pos1', 'pos2']

def csv_add_move_data(name, position1, position2):
    """
    add (a+) the data received from mqqt to the database
    :param name: the current name of the user name (E.G.: WHite-Pidgeon)
    :param position1: the position from the former tick
    :param position2: the position from the current tick
    """
    currenttime = datetime.now().strftime("%H:%M:%S")
    rows = {'name': name,
            'time': currenttime,
            'pos1': position1,
            'pos2': position2},
    with open('datafiles/movement_database.csv', 'a+', encoding='UTF8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writerows(rows)

def csv_header():
    """
    clears(w) the database and sets the headers
    """
    with open('datafiles/movement_database.csv', 'w', encoding='UTF8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()

def csv_test_data():
    """
    adds (a+) test data to the database
    """
    currenttime = datetime.now().strftime("%H:%M:%S")
    rows = {'name': 'White-pidgeon',
            'time': currenttime,
            'pos1': [{"x": 1.344570203841623, "y": 0, "z": 0.9665576516090038},
                     {"x": 1.344570203841623, "y": 0, "z": 0.9665576516090038}],
            'pos2': [{"x": 2.344570203841623, "y": 0, "z": 0.9665576516090038},
                     {"x": 2.344570203841623, "y": 0, "z": 0.9665576516090038}]},
    with open('datafiles/movement_database.csv', 'a+', encoding='UTF8', newline='') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writerows(rows)

# csv_header() #only run this once (it will clear out the database)
# csv_test_data() #only run when testing database

def txt_updatelastmovement(new_data="5"):
    """
    adds the lastmovement data to lastmovement.txt and checks if not the same data
    :param new_data: the lastmovement data
    """
    file_object = open('datafiles/lastmovement.txt', 'w+')
    file = open("datafiles/lastmovement.txt")
    new_data =  str(new_data)
    if new_data not in file.read():
        file_object.write(new_data)
    # Close the file
    file_object.close()

def getlastmovement(databoard=True):
    """
    receive the highscore from the lastmovement.txt, checks if it's needed for the databoard, if so round it, and return it
    :rtype: returns the last movement from the lastmovement.txt
    """
    global lastmovement_simplified_string
    lastmovementfile = open("datafiles/lastmovement.txt", "r")
    if databoard:
        for lastmovement in lastmovementfile:
            lastmovement = ast.literal_eval(lastmovement)
            lastmovement_simplified_string = "L({0},{1},{2}) R({3},{4},{5})".format(
                str(round(float(lastmovement[0]["x"]), 1)), str(round(float(lastmovement[1]["y"]), 1)),
                str(round(float(lastmovement[0]["z"]), 1)), str(round(float(lastmovement[1]["x"]), 1)),
                str(round(float(lastmovement[0]["y"]), 1)), str(round(float(lastmovement[1]["z"]), 1)))
        return lastmovement_simplified_string
    else:
        for lastmovementline in lastmovementfile:
            return lastmovementline

def csv_getsorted_data():
    data = pd.read_csv("datafiles/movement_database.csv")
    data['time'] = pd.to_datetime(data['time']) #turn date column into time
    data = data.sort_values(by='time', ascending=False)
    lastgame_data = data.loc[data['name'] == data.iloc[0]['name']]
    def get_total_controllers_distance(data):
        totaldist = 0
        total_time = 0
        for index, row in data.iterrows():
            # left
            x1_coords = round(float(ast.literal_eval(row['pos1'])[0]["x"]), 1)
            y1_coords = round(float(ast.literal_eval(row['pos1'])[0]["y"]), 1)
            z1_coords = round(float(ast.literal_eval(row['pos1'])[0]["z"]), 1)
            x2_coords = round(float(ast.literal_eval(row['pos2'])[0]["x"]), 1)
            y2_coords = round(float(ast.literal_eval(row['pos2'])[0]["y"]), 1)
            z2_coords = round(float(ast.literal_eval(row['pos2'])[0]["z"]), 1)
            p1 = np.array([x1_coords, y1_coords, z1_coords])
            p2 = np.array([x2_coords, y2_coords, z2_coords])
            squared_dist = np.sum((p1 - p2) ** 2, axis=0)
            dist = np.sqrt(squared_dist)
            totaldist += dist
            # right
            x1_coords = round(float(ast.literal_eval(row['pos1'])[1]["x"]), 1)
            y1_coords = round(float(ast.literal_eval(row['pos1'])[1]["y"]), 1)
            z1_coords = round(float(ast.literal_eval(row['pos1'])[1]["z"]), 1)
            x2_coords = round(float(ast.literal_eval(row['pos2'])[1]["x"]), 1)
            y2_coords = round(float(ast.literal_eval(row['pos2'])[1]["y"]), 1)
            z2_coords = round(float(ast.literal_eval(row['pos2'])[1]["z"]), 1)
            p1 = np.array([x1_coords, y1_coords, z1_coords])
            p2 = np.array([x2_coords, y2_coords, z2_coords])
            squared_dist = np.sum((p1 - p2) ** 2, axis=0)
            dist = np.sqrt(squared_dist)
            if dist > 0.6:
                current_time = row['time']
                try:
                    total_time = total_time + int((formertime - current_time).total_seconds())
                except UnboundLocalError:
                    pass
            formertime = row['time']
            totaldist += dist
        return totaldist, total_time

    # get all values of the last game:
    lastgame_total_controller_distance, lastgame_movingtime = get_total_controllers_distance(lastgame_data)
    # lastgame_movingtime =  (lastgame_data.iloc[0]['time'] - lastgame_data.iloc[-1]['time']).total_seconds()
    lastgame_calories_burned = int(lastgame_movingtime) * (5.5 * 80 * 3.5 / 200)#https://captaincalculator.com/health/calorie/calories-burned-boxing-calculator/
    allgames_total_controller_distance, _ = get_total_controllers_distance(data)
    return lastgame_total_controller_distance, lastgame_movingtime, lastgame_calories_burned, allgames_total_controller_distance

#------------------------MQTT PART--------------------:
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
    # print("data published \n")
    pass

client3 = paho.Client("databaseinteracter")  # create client object

def on_connect(client, userdata, flags, rc):
    """
    when connected to the server, subscribe to the topics
    :param client: the client object (client1 in our case)
    :param userdata: the detailed information about the user
    :param flags: gives more detailed information about message
    :param rc: return code (0 is accepted, 1 is rejected)
    """
    client3.subscribe("hbo_ict_vr_request_database")
    client3.subscribe("hbo_ict_vr_data_last_movement")
    client3.subscribe("hbo_ict_vr_request_database_aftergame")

def on_message(client, userdata, msg):
    """
    when a message is received, checkout it's topic to run the correct functions
    :param client: the client object (client1 in our case)
    :param userdata: the detailed information about the user
    :param msg: message itself
    """
    if msg.topic == "hbo_ict_vr_data_last_movement":
        """If this topic, turn the string list into a normal python list with ast and get the data from the list and update lastmovement"""
        received_data = ast.literal_eval(msg.payload.decode("utf-8"))
        name = received_data[0]
        last_position = received_data[1][1:] #only get the positions [1] from the hands [1:]
        gamestarted = received_data[2]
        if getlastmovement(False) != str(last_position) and gamestarted == "true": #prevents saving stationary movements
            csv_add_move_data(name, getlastmovement(False), last_position) #compare current and former position

        txt_updatelastmovement(last_position) #update the lastmovement file with the current position

    if msg.topic == "hbo_ict_vr_request_database":
        '''pushes movement data'''
        client3.publish('hbo_ict_vr_request_simplified_lastmovement', getlastmovement(databoard=True))

    if msg.topic == "hbo_ict_vr_request_database_aftergame":
        '''pushes all aftergame data'''
        lastgame_total_controller_distance, lastgame_movingtime, lastgame_calories_burned, allgames_total_controller_distance = csv_getsorted_data()
        client3.publish('hbo_ict_vr_request_simplified_lastgame_total_controller_distance', lastgame_total_controller_distance)
        client3.publish('hbo_ict_vr_request_simplified_lastgame_movingtime', lastgame_movingtime)
        client3.publish('hbo_ict_vr_request_simplified_lastgame_calories_burned', lastgame_calories_burned)
        client3.publish('hbo_ict_vr_request_simplified_allgames_total_controller_distance', allgames_total_controller_distance)
        # TODO: publish fast movements from the database with a subscribed topic and set it to it's databoard attribute
        # TODO: publish slow movements from the database with a subscribed topic and set it to it's databoard attribute

# code to connect to the server and which message is connect to which function
client3.on_publish = on_publish  # assign function to callback
client3.on_connect = on_connect
client3.on_message = on_message
client3.connect(broker, port)  # establish connection

# let is run until manual interruption
running = True
while running:
    client3.loop()









