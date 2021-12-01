# This python code is used to controll the URE3 robot arm
import socket
import time
import threading, queue

import paho.mqtt.client as paho
import json
import operator

# Ip adress and port of the robot arm
HOST = "192.168.137.162"
ROBOT_PORT = 30002

# create a socket connection to the robot arm
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((HOST, ROBOT_PORT))


def move_backwards():
    """
    Move the robot arm backward
    """
    s.send((" movej(pose_trans(get_forward_kin(), p[0, -0.05, 0, 0, 0, 0]), a=1.2, v=1.05, t=0, r=0)"+"\n").encode("utf8"))
    time.sleep(2)

def move_forwards():
    """
    Move the robot arm forward
    """
    s.send((" movej(pose_trans(get_forward_kin(), p[0, 0.05, 0, 0, 0, 0]), a=1.2, v=1.05, t=0, r=0)"+"\n").encode("utf8"))
    time.sleep(2)

def move_left():
    """
    Move the robot arm left
    """
    s.send((" movej(pose_trans(get_forward_kin(), p[0.05, 0, 0, 0, 0, 0]), a=1.2, v=1.05, t=0, r=0)"+"\n").encode("utf8"))
    time.sleep(2)

def move_right():
    """
    Move the robot arm right
    """
    s.send((" movej(pose_trans(get_forward_kin(), p[-0.05, 0, 0, 0, 0, 0]), a=1.2, v=1.05, t=0, r=0)"+"\n").encode("utf8"))
    time.sleep(2)

def move_up():
    """
    Move the robot arm up
    """
    print("moving up")
    s.send((" movej(pose_trans(get_forward_kin(), p[0, 0, -0.05, 0, 0, 0]), a=1.2, v=1.05, t=0, r=0)"+"\n").encode("utf8"))
    time.sleep(2)

def move_down():
    """
    Move the robot arm down
    """
    s.send((" movej(pose_trans(get_forward_kin(), p[0, 0, 0.05, 0, 0, 0]), a=1.2, v=1.05, t=0, r=0)"+"\n").encode("utf8"))
    time.sleep(2)


def move_open():
    """
    Open the robot arm gripper
    """
    f = open("Gripper.script", "rb")  # Robotiq Gripper
    l = f.read()
    while (l):
        s.send(l)
        l = f.read(1024)
    s.send(" rq_open()\nend\n".encode("utf8"))
    time.sleep(5)


def move_close():
    """
    Close the robot arm gripper
    """
    f = open("Gripper.script", "rb")  # Robotiq Gripper
    l = f.read()
    while (l):
        s.send(l)
        l = f.read(1024)
    s.send(" rq_close()\nend\n".encode("utf8"))
    time.sleep(5)


# ###############################################################################################################################################################



# broker server:
broker = "broker.emqx.io"
port = 1883
client1 = paho.Client("ROBOT_Controller")  # create client object
running = True
moving = False

# a queue for the movement commands
movement_queue = queue.Queue()


def on_connect(client, userdata, flags, rc):
    """
    when connected to the server, subscribe to the topics
    :param client: the client object (client1 in our case)
    :param userdata: the detailed information about the user
    :param flags: gives more detailed information about message
    :param rc: return code (0 is accepted, 1 is rejected)
    """
    client1.subscribe("hbo_ict_robot_arm_controll")

def on_message(client, userdata, msg):
    """
    when a message is received, if its a movement command and we are currently not moving, send it to the movement thread
    :param client: the client object (client1 in our case)
    :param userdata: the detailed information about the user
    :param msg: message itself
    """

    if msg.topic == "hbo_ict_robot_arm_controll":
        print("msg recieved")
        print(msg.payload)
        if not moving:
            payload = json.loads(msg.payload)
            movement_queue.put( payload['command'])
            moving = True

def movement_thread():
    """
    A thread to process the movement commands recieved by the mqtt client
    """
    print("started thread")
    while True:
        move = movement_queue.get()
        print(move)
        if move == "move_up":
            move_up()
        elif move == "move_down":
            move_down()
        elif move == "move_left":
            move_left()
        elif move == "move_right":
            move_right()
        elif move == "move_forward":
            move_forwards()
        elif move == "move_backward":
            move_backwards()
        elif move == "move_open":
            move_open()
        elif move == "move_close":
            move_close()
        elif move == "shutdown":
            running = False
            break
        else:
            pass
        moving = False



if __name__ == "__main__":
    # code to connect to the server and which message is connect to which function

    client1.on_connect = on_connect
    client1.on_message = on_message
    client1.connect(broker, port)  # establish connection

    # start the thread to process the movement commands
    x = threading.Thread(target=movement_thread, args=(), daemon=True)
    x.start()

    print("running main")
    while running:
        client1.loop()

    x.join()