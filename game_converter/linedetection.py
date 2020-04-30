import json
import numpy as np
import cv2
from json_tricks import dumps
from scipy.spatial import distance as dist

# Load an color image in grayscale

def imgtojson(filepath,save_status = False,output_filename = False, game_id_given=False,display = False, imagewidth=800,imageheight=570):

	img = cv2.imread(filepath)

	#display = False
	#imagewidth = 800
	#imageheight = 570

	img = cv2.resize(img, (imagewidth,imageheight) , interpolation = cv2.INTER_AREA)
	hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

	countourdata = {}
	countourdata["Teleport_BBs"] = []
	countourdata["Coin_BBs"] = []

	colours = [
		([88, 50, 50], [108, 255, 255],"blue"),
		([114,50,50],[180,255,255],"purple"),
		([112,50,50],[132,255,255],"purple"),
		([167,60,60],[187,255,255],"red"),
		([50,30,30],[80,255,255],"green"),
		([20,100,50],[35,255,255],"yellow"),
		#([10,0,0],[35,70,110],"black"),
		([0,0,30],[35,70,110],"black"),
	]


	print(hsv[205][242])

	# loop over the colours
	for (lower, upper,mycolour) in colours:

		# create NumPy arrays from the boundaries
		lower = np.array(lower, dtype = "uint8")
		upper = np.array(upper, dtype = "uint8")
		smallimage = img.copy()

		# find the colors within the specified boundaries and apply
		# the mask
		mask = cv2.inRange(hsv, lower, upper)


		kernel = np.ones((5,5),np.uint8)
		opening = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel)

		#opening2 = cv2.GaussianBlur(opening,(5, 5),0)
		output = cv2.bitwise_and(img, img, mask = opening)

		# show the images
		if display == True:
			cv2.imshow("mask- opening",opening)
			cv2.imshow("images", np.hstack([img, output]))

		contours, hierarchy = cv2.findContours(opening, cv2.RETR_TREE, cv2.CHAIN_APPROX_NONE)

		newcontours = []
		index = 0

		#filter out the anomaly contours
		for c in contours:
			x, y, w, h = cv2.boundingRect(c)
			parent_status = hierarchy[0][index][3]

			if ( w * h <= 0.95 * imageheight * imagewidth and w * h > 5) and parent_status == -1:
				newcontours.append(c)
			index += 1

		#show the contours
		if display == True:
			#for i in range(len(newcontours)):
				#cv2.drawContours(smallimage, newcontours, i, (0,255,0), 1)
			cv2.drawContours(smallimage, newcontours, -1, (0,255,0), 2)
			#cv2.waitKey(0)
			#for item in portals:
				#cv2.drawContours(smallimage, item[1], -1, (255,0,0), 2)

			cv2.imshow("display",smallimage)
			cv2.waitKey(0)

		temp_index = 0
		if mycolour == "yellow" or mycolour == "purple":
			portals = []

			for c in newcontours:
				smallx, smally, smallw, smallh = cv2.boundingRect(c)
				small_centroid = (smallx + smallw//2, smally + smallh//2)
				temp_status = False

				#cv2.drawContours(smallimage, newcontours, temp_index, (0,255,0), 1)

				if len(portals) == 0:
					portals.append([[small_centroid], c])
				else:
					for item in portals:
						for pt in item[0]:
							if dist.euclidean(small_centroid, pt) < 30:
								temp_status = True
								
						if temp_status == True:
							item[0].append(small_centroid)
							#print(len(portals))
							#print(item)
							#print("\n\n")
							#print("item1",item[1])
							#print("c",c)
							#print("\n\n")
							#item[1].concatenate(c, axis=None)
							item[1] = np.concatenate([item[1],c])
							break

					if temp_status == False:
						portals.append([[small_centroid], c])

				#temp_index += 1
				#cv2.imshow("display",smallimage)
				#cv2.waitKey(0)


			for item in portals:
				stuff = cv2.boundingRect(item[1]) #starts from top right of box
				if mycolour == "purple":
					countourdata["Teleport_BBs"].append(stuff)
				elif mycolour == "yellow":
					countourdata["Coin_BBs"].append(stuff)

		

		countourdata[mycolour] = newcontours

	blankmap = np.zeros((imageheight,imagewidth), dtype=int)

	for c in countourdata['blue']:
		for pt in c:
			blankmap[pt[0][1]][pt[0][0]] = 1

	for c in countourdata['green']:
		for pt in c:
			blankmap[pt[0][1]][pt[0][0]] = 2

	for c in countourdata['red']:
		for pt in c:
			blankmap[pt[0][1]][pt[0][0]] = 3

	for c in countourdata['purple']:
		for pt in c:
			blankmap[pt[0][1]][pt[0][0]] = 4

	for c in countourdata['yellow']:
		for pt in c:
			blankmap[pt[0][1]][pt[0][0]] = 5

	for c in countourdata['black']:
		for pt in c:
			blankmap[pt[0][1]][pt[0][0]] = 6

	#print(blankmap)
	#np.savetxt("result.txt", blankmap,delimiter=',')

	finaljson = dumps({'mapdata':blankmap,"Coin_BBs":countourdata["Coin_BBs"],"Teleport_BBs":countourdata["Teleport_BBs"],"link_to_file":"http://127.0.0.1:5000/game/" + game_id_given}, primitives=True)

	if save_status == True:
		with open(output_filename, 'w') as outfile:
			json.dump(finaljson, outfile)

	return finaljson

if __name__ == "__main__":
	imgtojson("drawing2.jpeg",True,"result.txt","result",True)
