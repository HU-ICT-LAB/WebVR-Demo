# This python code is used to controll the URE3 robot arm
import socket
import time
import threading, queue

import paho.mqtt.client as paho
import json
import operator
import ast
import math

# Ip adress and port of the robot arm
HOST = "192.168.1.127"
ROBOT_PORT = 30002

# create a socket connection to the robot arm
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((HOST, ROBOT_PORT))


Socket_HOST = '192.168.1.128'  # Standard loopback interface address (localhost)
Socket_PORT = 8080        # Port to listen on (non-privileged ports are > 1023)
host_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
host_socket.bind((Socket_HOST, Socket_PORT))
host_socket.listen()

moving_mutext = threading.Lock()

def receive_thread():
    print("we are waiting for a connection")
    conn, addr = host_socket.accept()
    with conn:
        print("got a connection")
        data = conn.recv(1024)
        data = data.decode()
        x = ast.literal_eval(data)
        x = [math.degrees(float(n)) for n in x]
        print(x)
        message = {}
        message["base"] = x[0]
        message["shoulder"] = (x[1]+90) %360
        message["elbow"] = x[2]
        message["wrist1"] = (x[3]+90) %360
        message["wrist2"] = x[4]
        message["wrist3"] = x[5]%360
        print(json.dumps(message))
        client1.publish("robot_arm_positions", json.dumps(message))
        conn.close()

def receive_gripper_thread():
    print("we are waiting for a connection")
    conn, addr = host_socket.accept()
    receiving = True
    message = {}
    message["gripper_dist"] = 0
    with conn:
        print("got a connection")
        while receiving:
            data = conn.recv(16)
            data = data.decode()
            print(data)
            if data == "done":
                receiving = False
            else:
                message["gripper_dist"] = float(data)
                client1.publish("robot_gripper_positions", json.dumps(message))
        conn.close()



def send_positions(desired_path=""):
    """
    Let the robot arm send its positions
    """
    z = threading.Thread(target=receive_thread, args=(), daemon=True)
    z.start()
    s.send(("def getPos():\n"
			+ "\twhile True:\n"
			+ "\t\tif socket_open(\"192.168.1.128\", 8080, \"socket_2\") == True:\n"
            + "\t\t\ttextmsg(\"Connection successful?\")\n"
            + "\t\t\t" + desired_path + "\n"
            + "\t\t\tsocket_send_string(to_str(get_target_joint_positions()), \"socket_2\")\n"
			+ "\t\t\tbreak\n"
            + "\t\telse:\n"
            + "\t\t\ttextmsg(\"Connection unsuccessful\")\n"
            + "\t\tend\n"
			+ "\tend\n"
			+ "end\n").encode("utf8"))
    z.join()


def move_backwards():
    """
    Move the robot arm backward
    """
    send_positions("movej(pose_trans(get_forward_kin(), p[0, 0.05, 0, 0, 0, 0]), a=1.2, v=1.05, t=0, r=0)")
    time.sleep(0.5)

def move_forwards():
    """
    Move the robot arm forward
    """
    send_positions("movej(pose_trans(get_forward_kin(), p[0, -0.05, 0, 0, 0, 0]), a=1.2, v=1.05, t=0, r=0)")
    time.sleep(0.5)

def move_left():
    """
    Move the robot arm left
    """
    send_positions("movej(pose_trans(get_forward_kin(), p[0.05, 0, 0, 0, 0, 0]), a=1.2, v=1.05, t=0, r=0)")
    time.sleep(0.5)


def move_right():
    """
    Move the robot arm right
    """
    send_positions("movej(pose_trans(get_forward_kin(), p[-0.05, 0, 0, 0, 0, 0]), a=1.2, v=1.05, t=0, r=0)")
    time.sleep(0.5)


def move_up():
    """
    Move the robot arm up
    """
    print("moving up")
    send_positions("movej(pose_trans(get_forward_kin(), p[0, 0, -0.05, 0, 0, 0]), a=1.2, v=1.05, t=0, r=0)")
    time.sleep(0.5)
    

def move_down():
    """
    Move the robot arm down
    """
    send_positions("movej(pose_trans(get_forward_kin(), p[0, 0, 0.05, 0, 0, 0]), a=1.2, v=1.05, t=0, r=0)")
    time.sleep(0.5)


def move_open():
    """
    Open the robot arm gripper
    """
    
    z = threading.Thread(target=receive_gripper_thread, args=(), daemon=True)
    z.start()

    f = open("Gripper.script", "rb")  # Robotiq Gripper
    l = f.read()
    while (l):
        s.send(l)
        l = f.read(1024)

    s.send((""
    + " rq_open()\n"
    + " while True:\n"
    + " \tif socket_open(\"192.168.1.128\", 8080, \"socket_2\") == True:\n"
    + " \t\ttextmsg(\"Connection successful\")\n"
    + " \t\twhile rq_current_pos_norm() > 1:\n"
    + " \t\t\tsocket_send_string(to_str(rq_current_pos_norm()), \"socket_2\")\n"
    + " \t\tend\n"
    + " \t\tsocket_send_string(to_str(rq_current_pos_norm()), \"socket_2\")\n"
    + " \t\tsocket_send_string(\"done\", \"socket_2\")\n"
    + " \t\tbreak\n"
    + " \telse:\n"
    + " \t\ttextmsg(\"Connection unsuccessful\")\n"
    + " \tend\n"
    + " end\n"
    + "end\n").encode("utf8"))
    time.sleep(5)
    z.join()


def move_close():
    """
    Close the robot arm gripper
    """
    z = threading.Thread(target=receive_gripper_thread, args=(), daemon=True)
    z.start()

    f = open("Gripper.script", "rb")  # Robotiq Gripper
    l = f.read()
    while (l):
        s.send(l)
        l = f.read(1024)

    s.send((""
    + " rq_close()\n"
    + " while True:\n"
    + " \tif socket_open(\"192.168.1.128\", 8080, \"socket_2\") == True:\n"
    + " \t\ttextmsg(\"Connection successful\")\n"
    + " \t\twhile not rq_is_object_detected() and rq_current_pos_norm() < 89:\n"
    + " \t\t\tsocket_send_string(to_str(rq_current_pos_norm()), \"socket_2\")\n"
    + " \t\tend\n"
    + " \t\tsocket_send_string(to_str(rq_current_pos_norm()), \"socket_2\")\n"
    + " \t\tsocket_send_string(\"done\", \"socket_2\")\n"
    + " \t\tbreak\n"
    + " \telse:\n"
    + " \t\ttextmsg(\"Connection unsuccessful\")\n"
    + " \tend\n"
    + " end\n"
    + "end\n").encode("utf8"))
    time.sleep(5)
    z.join()


# ###############################################################################################################################################################



# broker server:
broker = "broker.emqx.io"
port = 1883
client1 = paho.Client("ROBOT__ARM_Controller")  # create client object
running = True
moving_robot = False

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
        if not moving_mutext.locked():
            payload = json.loads(msg.payload)
            movement_queue.put( payload['command']) 
            time.sleep(0.05)

def movement_thread():
    """
    A thread to process the movement commands recieved by the mqtt client
    """
    print("started thread")
    while True:
        move = movement_queue.get()
        print(move)
        if move == "move_up":
            moving_mutext.acquire()
            move_up()
        elif move == "move_down":
            moving_mutext.acquire()
            move_down()
        elif move == "move_left":
            moving_mutext.acquire()
            move_left()
        elif move == "move_right":
            moving_mutext.acquire()
            move_right()
        elif move == "move_forward":
            moving_mutext.acquire()
            move_forwards()
        elif move == "move_backward":
            moving_mutext.acquire()
            move_backwards()
        elif move == "move_open":
            moving_mutext.acquire()
            move_open()
        elif move == "move_close":
            moving_mutext.acquire()
            move_close()
        elif move == "get_positions":
            moving_mutext.acquire()
            send_positions()
        elif move == "shutdown":
            moving_mutext.release()
            running = False
            break
        else:
            pass
        moving_mutext.release()



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