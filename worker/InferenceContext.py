

import time


class InferenceContext():
    def __init__(self, inference_conf, celery):
        self.config = inference_conf
        print('inference started', inference_conf['port'])
        print(celery)
        time.sleep(20)

    def predict(self):

        print(self.config)
