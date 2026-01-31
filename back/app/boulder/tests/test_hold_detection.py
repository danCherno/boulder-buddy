import cv2
import numpy as np
from django.test import TestCase
from boulder.process_route import detect_holds


class DetectHoldsTests(TestCase):
    def create_test_image(self, color_bgr):
        img = np.zeros((400, 400, 3), dtype=np.uint8)
        cv2.circle(img, (200, 200), 50, color_bgr, -1)
        return img

    def test_detect_holds_success(self):
        img = self.create_test_image((0, 0, 255))
        holds = detect_holds(img)

        self.assertGreater(len(holds), 0)
        hold = holds[0]
        self.assertAlmostEqual(hold["x"], 200, delta=20)
        self.assertAlmostEqual(hold["y"], 200, delta=20)
        self.assertGreater(hold["area"], 1000)

    def test_invalid_image(self):
        with self.assertRaises(ValueError):
            detect_holds(None)
