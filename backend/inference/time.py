import time
import os
import argparse

ap = argparse.ArgumentParser()
ap.add_argument("-p", "--port", required=True, help="sayi giriniz")
args = vars(ap.parse_args())
print(args["port"])

print(os.getpid())

time.sleep(30)
