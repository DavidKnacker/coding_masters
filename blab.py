import socket
import pyhdb
import time

UDP_IP = "10.178.202.130"
UDP_PORT = 5001
MESSAGE = "hallo"

sock = socket.socket(socket.AF_INET, # Internet
                     socket.SOCK_DGRAM) # UDP
sock.sendto(bytes(MESSAGE, "utf-8"), (UDP_IP,UDP_PORT))
connection = pyhdb.connect(
    host="10.178.202.133",
    port=30015,
    user="SYSTEM",
    password="8U2i0a16"
)
cursor = connection.cursor()

while True:
    # allData = []
    sock.sendto(bytes(MESSAGE, "utf-8"), (UDP_IP, UDP_PORT))
    # currentTime = time.time()
    # while time.time() - currentTime < 10:
    sock.connect((UDP_IP, UDP_PORT))
    data, addr = sock.recvfrom(1024)  # buffer size is 1024 bytes
    data = data.decode('utf-8').replace("\"","'")
    # allData.append(data)
    query = """INSERT INTO FCC_DATA.FURROWING VALUES ({data})""".format(data=data)
    print(query)
    cursor.execute(query)
    print(cursor.rowcount)
    #query = """INSERT INTO FCC_DATA.CULTIVATION VALUES {data}""".format(data=tuple(allData),)
    #print(query)
    #cursor.execute(query)
    #print(cursor.rowcount)
connection.close()