

import time


class TrainContext():
    def __init__(self, train_conf, celery):
        self.config = train_conf
        print(celery)

        if(train_conf.model=="yolov3"):
            self.train_yolov3()


    def train_yolov3(self):
        cmd="python modelStrategy/train.py --model_type=yolo3_mobilenet_lite --weights_path=models/yolov3/yolov3-tiny.weights --anchors_path=modelStrategy/configs/yolo3_anchors.txt --annotation_file=../VOCdevkit/VOC2007/ImageSets/Layout/trainval.txt --classes_path=configs/voc_classes.txt --eval_online --save_eval_checkpoint"

    def train_test(self):

        print(self.config)
