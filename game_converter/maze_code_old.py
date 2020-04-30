from tkinter import *
import numpy as np
import cv2

img = None
cap = cv2.VideoCapture(0)

# PART 1: Capturing an image + preprocessing (edge detection)
while True:
    ret, frame = cap.read()
    cv2.imshow('frame', frame)

    k = cv2.waitKey(1)
    if k == ord('a'):
        img = frame
        cap.release()
        break

gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
edges = cv2.Canny(gray, 50, 150)
# sharpen image
kernel = np.array([[-1,-1,-1], [-1,9,-1], [-1,-1,-1]])
edges = cv2.filter2D(edges, -1, kernel)

# PART 2: Select 4 corners of play area
edges2 = edges.copy()
src = []
n = 0
def cb(event, x, y, flags, param):
    global edges2, src, n
    if event == cv2.EVENT_LBUTTONUP:
        n += 1
        src.append((x,y))
        cv2.circle(edges2, (x,y), 5, (255,255,255), -1)

cv2.namedWindow('Select corners')
cv2.setMouseCallback('Select corners', cb)
while True:
    cv2.imshow('Select corners', edges2)
    cv2.waitKey(1)  # introduce some delay
    if n >= 4:
        break

# PART 3: Perspective transform
h, w, *_ = edges.shape
src = np.float32(src)
dest = np.float32([(0,0), (w,0), (0,h), (w,h)])
M = cv2.getPerspectiveTransform(src, dest)
warped = cv2.warpPerspective(edges, M, (w,h))

# Resize to square
wh = max(min(w, h), 750)
warped = cv2.resize(warped, (wh,wh))

# PART 4: Select start and end point
warped2 = warped.copy()
start = None
end = None
n = 0
def cb2(event, x, y, flags, param):
    global warped2, start, end, n
    if event == cv2.EVENT_LBUTTONUP:
        if n == 0:
            start = (x,y)
            cv2.circle(warped2, start, 5, (255,0,0), -1)
        elif n >= 1:
            end = (x,y)
            cv2.circle(warped2, end, 5, (0,255,0), -1)
        n += 1

cv2.namedWindow('Select start/end point')
cv2.setMouseCallback('Select start/end point', cb2)
while True:
    cv2.imshow('Select start/end point', warped2)
    cv2.waitKey(1)  # introduce some delay
    if n >= 2:
        warped = cv2.bitwise_not(warped)  # invert colors
        cv2.imwrite('maze.png', warped)
        cv2.destroyAllWindows()
        break

# PART 5: Initialize game
root = Tk()
canvas = Canvas(width=wh, height=wh)
canvas.pack(expand=YES, fill=BOTH)
img = PhotoImage(file='maze.png')
canvas.create_image(0, 0, image=img, anchor=NW)

size = 20
sx, sy = start
x, y = sx, sy
r = None

def draw_player():
    global r, x, y, size, canvas
    return canvas.create_rectangle(x-size//2, y-size//2, x+size//2, y+size//2, fill='black')

def touching_wall():
    global x, y, img
    x = int(x)
    y = int(y)
    for _y in (y-size//2, y+size//2):
        for _x in range(x-size//2, x+size//2):
            if img.get(_x,_y) != (255,255,255): # not white -> edge -> cannot move
                return True
    for _x in (x-size//2, x+size//2):
        for _y in range(y-size//2, y+size//2):
            if img.get(_x,_y) != (255,255,255): 
                return True
    return False

def move(dx,dy):
    def _(*args):
        global x, y, r
        nonlocal dx, dy
        canvas.delete(r)
        px, py = x, y
        x += dx
        y += dy
        if touching_wall():
            x, y = px, py
        r = draw_player()
    return _

ex, ey = end
canvas.create_oval(ex-size//2, ey-size//2, ex+size//2, ey+size//2, fill='red')

r = draw_player()
canvas.bind('q', exit)
canvas.bind('<Left>', move(-7,0))
canvas.bind('<Right>', move(7,0))
canvas.bind('<Up>', move(0,-7))
canvas.bind('<Down>', move(0,7))
canvas.focus_set()

while True:
    if (x-ex)**2 + (y-ey)**2 < (size//2)**2:
        root.destroy()
        print('You win!')
        break
    canvas.update()
