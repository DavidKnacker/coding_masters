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
    sock.sendto(bytes(MESSAGE, "utf-8"), (UDP_IP, UDP_PORT))
    sock.connect((UDP_IP, UDP_PORT))
    currentTime = time.time()
    data, addr = sock.recvfrom(1024)  # buffer size is 1024 bytes
    print(data)
    #while currentTime-time.time() < 10:
     #   data, addr = sock.recvfrom(1024) # buffer size is 1024 bytes
      #  cursor.execute("""INSERT INTO FCC_DATA.CULTIVATION ( FID, ELEVATION, DISTANCE, HEADING, GPS_QUALITY, ENGINE_LOAD,
       #                   ENGINE_POWER, FUEL_USED, SPEED, FIELD_ID, DATETIME, POINT_X, POINT_Y, HASH_CODE )
        #                  VALUES """ +str(data))

connection.close()