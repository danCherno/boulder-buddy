import cv2
import numpy as np
from sklearn.cluster import KMeans


def detect_holds(img):
    """
    Detect climbing holds assuming they share a dominant color.
    Returns list of coords + size.
    hue(h): color | saturation(s), brightness(v): intesnsity
    """
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    lower = np.array([20, 100, 100])
    upper = np.array([30, 255, 255])
    mask =  cv2.inRange(hsv, lower, upper)

    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    positions = []

    for contour in contours:
        area = cv2.contourArea(contour)
        if area < 50:
            continue

        M = cv2.moments(contour)
        if M['m00'] == 0:
            continue

        cx = int(M['m10'] / M['m00'])
        cy = int(M['m01'] / M['m00'])

        positions.append((cx, cy))

    return positions