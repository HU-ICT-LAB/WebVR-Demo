# This python code is used to controll the URE3 robot arm
import socket
import time

# Ip adress and port of the robot arm
HOST = "192.168.1.106"
PORT = 30002

# create a socket connection to the robot arm
s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((HOST, PORT))


def gripper_open():
    f = open("Gripper.script", "rb")  # Robotiq Gripper
    l = f.read()
    while (l):
        s.send(l)
        l = f.read(1024)
    s.send(" rq_open()\nend\n".encode("utf8"))
    print("sending is done")


def gripper_close():
    f = open("Gripper.script", "rb")  # Robotiq Gripper
    l = f.read()
    while (l):
        s.send(l)
        l = f.read(1024)
    s.send(" rq_close()\nend\n".encode("utf8"))



# wait two seconds for connection to be finished
time.sleep(2)

# send a command to move the robot joins to orientation [0, 0, 0, 0, 0, -180] degrees
s.send((" movej([0 ,0, 0 ,0  ,0 ,-3.14], a=1.4, v=1.05, t=0, r=0)"+"\n").encode("utf8"))

# Wait 5 seconds for move to be completed
time.sleep(5)

# send a command to move the robot joins to orientation [0, -90, 90, -90, -90, -180] degrees
s.send((" movej([0 ,-1.57, 1.57 ,-1.57 ,-1.57 ,-3.14], a=1.4, v=1.05, t=0, r=0)"+"\n").encode("utf8"))

# Wait 5 seconds for move to be completed
time.sleep(5)

# Send a command to move the robot arm relative to the current position, we move it 20cm on the x and -20 on the z axis
s.send((" movej(pose_trans(get_forward_kin(), p[0.2, -0.2, 0, 0, 0, 0]), a=1.2, v=1.05, t=0, r=0)"+"\n").encode("utf8"))

time.sleep(5)

gripper_open()

time.sleep(5)

s.send((" movej(pose_trans(get_forward_kin(), p[0, 0, 0.08, 0, 0, 0]), a=1.2, v=1.05, t=0, r=0)"+"\n").encode("utf8"))

time.sleep(5)

gripper_close()

time.sleep(5)

s.send((" movej(pose_trans(get_forward_kin(), p[0, 0, -0.08, 0, 0, 0]), a=1.2, v=1.05, t=0, r=0)"+"\n").encode("utf8"))

time.sleep(5)

# Send a command to move the robot arm relative to the current position, we move it -20cm on the x and 20 on the z axis
s.send((" movej(pose_trans(get_forward_kin(), p[-0.2, 0.2, 0, 0, 0, 0]), a=1.2, v=1.05, t=0, r=0)"+"\n").encode("utf8"))






# Close the socket connection
s.close()