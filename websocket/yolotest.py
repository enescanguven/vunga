import torch

# Model
model = torch.hub.load('ultralytics/yolov5', 'yolov5n')  # or yolov5n - yolov5x6, custom

# Images
img = 'https://ultralytics.com/images/zidane.jpg'  # or file, Path, PIL, OpenCV, numpy, list

# Inference
result= model(img)

print('asdas')
  #
print(result)
print(result.pandas().xyxy[0].to_json())  # print img1 predictions (tensor)