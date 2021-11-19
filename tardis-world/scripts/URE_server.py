import socket
import time

HOST = '192.168.137.1'  # Standard loopback interface address (localhost)
PORT = 8087    # Port to listen on (non-privileged ports are > 1023)

print("starting server")
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as s:
    s.bind((HOST, PORT))
    print("waiting for connection")
    s.listen()
    print("there was a conn thing")
    conn, addr = s.accept()
    print("we tried to accept")
    with conn:
        print('Connected by', addr)
        conn.send(("(0)\n").encode("utf8"))

        time.sleep(5)

        conn.send(("(1)\n").encode("utf8"))

        time.sleep(5)

        conn.send(("(-1)\n").encode("utf8"))

print("program ended")

