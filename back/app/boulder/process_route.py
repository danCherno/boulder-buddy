import cv2
import numpy as np


def detect_holds(
    img,
    hsv=(25, 170, 170),
    min_area=5
    ):
    """
    Detect climbing holds assuming they share a dominant color.
    Returns list of coords + size.
    hue(h): color | saturation(s), brightness(v): intesnsity
    """
    hsv_lower, hsv_upper = hsv_range_from_sample(hsv)
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    mask = cv2.inRange(hsv, hsv_lower, hsv_upper)

    contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE) # noqa: 501
    holds = []

    for contour in contours:
        area = cv2.contourArea(contour)
        if area < min_area:
            continue
        M = cv2.moments(contour)
        if M['m00'] == 0:
            continue
        cx = int(M['m10'] / M['m00'])
        cy = int(M['m01'] / M['m00'])
        holds.append((cx, cy))

    return holds

def hsv_range_from_sample(hsv, dh=10, ds=60, dv=60):
    h, s, v = map(int, hsv)
    if not (0 <= h <= 179 and 0 <= s <= 255 and 0 <= v <= 255):
        raise ValueError(f"HSV out of range: {(h,s,v)}")

    s0, s1 = max(s - ds, 0), min(s + ds, 255)
    v0, v1 = max(v - dv, 0), min(v + dv, 255)

    h0, h1 = h - dh, h + dh

    if h0 < 0:
        return ((0, s0, v0), (h1, s1, v1)), ((180 + h0, s0, v0), (179, s1, v1))
    if h1 > 179:
        return ((h0, s0, v0), (179, s1, v1)), ((0, s0, v0), (h1 - 180, s1, v1))
    return ((h0, s0, v0), (h1, s1, v1))



def hsv_from_position(img, x, y):
    """
    Extract HSV color at a pixel position (x, y) in the given image.

    Args:
        img: Input image (assumed BGR, as from cv2.imread).
        x: X coordinate (column index).
        y: Y coordinate (row index).

    Returns:
        Tuple of (h, s, v) values at the specified pixel.
        Returns None if the position is out of bounds.
    """
    height, width = img.shape[:2]
    if x < 0 or x >= width or y < 0 or y >= height:
        return None

    bgr_pixel = img[y, x]
    hsv_pixel = cv2.cvtColor(np.uint8([[bgr_pixel]]), cv2.COLOR_BGR2HSV)[0][0]
    h, s, v = int(hsv_pixel[0]), int(hsv_pixel[1]), int(hsv_pixel[2])
    return (h, s, v)
