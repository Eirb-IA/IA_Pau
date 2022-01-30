from pycocotools.coco import COCO
import numpy as np
import pylab
pylab.rcParams['figure.figsize'] = (8.0, 10.0)
from PIL import Image, ExifTags
import os 
import cv2
from classify import *

def draw_bbox(image, anns, ratio):
    """
    Display the specified annotations.
    :param anns (array of object): annotations to display
    :return: None
    # """

    images=[]
    for ann in anns:

        [bbox_x, bbox_y, bbox_w, bbox_h] = (ratio*np.array(ann['bbox'])).astype(int)
        
        #type=classify(image, [bbox_x, bbox_y, bbox_w, bbox_h])
        
        #cv2.rectangle(image, (bbox_x,bbox_y),(bbox_x+bbox_w,bbox_y+bbox_h), color=color_trash(type),thickness=3)
        images.append((image[bbox_y:(bbox_y+bbox_h), bbox_x:(bbox_x+bbox_w)], ann['category_id']))

    return images

dir = '../data/data/images'

ann_dir = os.path.join(dir,'annotations')
data_dir = os.path.join(dir,'images')
ann_file = os.path.join(ann_dir, 'instances_train.json')
coco = COCO(ann_file)

imgIds = np.array(coco.getImgIds())
print('{} images loaded'.format(len(imgIds)))

#2541
n=2541
ntot=n
for imgId in imgIds[n::]:
    image = coco.loadImgs(ids=[imgId])[0]
    try:
        image = Image.open(os.path.join(data_dir,image['file_name']))
        for orientation in ExifTags.TAGS.keys():
            if ExifTags.TAGS[orientation]=='Orientation':
                break
        
        exif = image._getexif()
        if exif is not None:
            if exif[orientation] == 3:
                image=image.rotate(180, expand=True)
            elif exif[orientation] == 6:
                image=image.rotate(270, expand=True)
            elif exif[orientation] == 8:
                image=image.rotate(90, expand=True)

    except (AttributeError, KeyError, IndexError):
        # cases: image don't have getexif
        pass
    image = cv2.cvtColor(np.array(image.convert('RGB')),  cv2.COLOR_RGB2BGR)
    annIds = coco.getAnnIds(imgIds=[imgId])
    anns = coco.loadAnns(ids=annIds)
    h,w = image.shape[:-1]
    target_h = 1080
    ratio = target_h/h
    target_w = int(ratio*w) 
    image = cv2.resize(image,(target_w,target_h))
    images = draw_bbox(image,anns,ratio)

    for i in range(0,len(images)):
        print(f'Image numero: {n} trashes:{i} (total: {ntot})')
        try :
            cv2.imwrite(f'./images/image_{imgId}_n{i}_category_id{images[i][1]}.png',images[i][0])
        except Exception as e: 
            print(e) 
            pass
        ntot+=1
    # cv2.waitKey(0)
    n+=1




