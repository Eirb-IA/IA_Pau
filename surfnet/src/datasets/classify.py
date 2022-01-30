import cv2

trash_to_color={"unclear":(0,0,0),
				"namable":(0,0,255),
				"packaging":(0,0,255),
				"insulating materials":(0,0,255),
				"tire":(0,0,255),
				"drun":(0,0,255),
				"can":(0,0,255),
				"bottel":(0,0,255),
				"cord":(0,0,255),
				"platsic":(0,0,255),
				}

def color_trash(trash):
	return trash_to_color[trash]

def classify(image, bbx):
	return "unclear"
