import socket
import time

HOST = "192.168.137.232"
PORT = 30002

s = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
s.connect((HOST, PORT))

time.sleep(2)

s.send((" movej([0 ,0, 0 ,0  ,0 ,-3.14], a=1.4, v=1.05, t=0, r=0)"+"\n").encode("utf8"))

time.sleep(5)

s.send((" movej([0 ,-1.57, 1.57 ,-1.57 ,-1.57 ,-3.14], a=1.4, v=1.05, t=0, r=0)"+"\n").encode("utf8"))

time.sleep(5)

# s.send((" pos:=get_actual_tcp_pose()"+"\n").encode("utf8"))
# s.send((" socket_send_string(pos)"+"\n").encode("utf8"))


# s.send((" pose1 = "+"\n").encode("utf8"))
# s.send((" pose2 = "+"\n").encode("utf8"))
print("move forward")

s.send((" movej(pose_trans(get_forward_kin(), p[0.2, -0.2, 0, 0, 0, 0]), a=1.2, v=1.05, t=0, r=0)"+"\n").encode("utf8"))

time.sleep(5)

# s.send((" pose1 = "+"\n").encode("utf8"))
# s.send((" pose2 = "+"\n").encode("utf8"))
print("move back")
s.send((" movej(pose_trans(get_forward_kin(), p[-0.2, 0.2, 0, 0, 0, 0]), a=1.2, v=1.05, t=0, r=0)"+"\n").encode("utf8"))

# data = s.recv(2048)
# print(data)


s.close()