

import time


class TrainContext():
    def __init__(self, train_conf, celery):
        self.config = train_conf
        print(celery)

        if(train_conf.model=="yolov3"):
            self.train_yolov3()


    def train_yolov3(self):
        print(self.config)

    def train_test(self):

        print(self.config)
