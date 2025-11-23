from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status
from django.core.files.uploadedfile import SimpleUploadedFile
from unittest.mock import patch
from boulder.models import Boulder


class BoulderProcessViewTests(APITestCase):

    def setUp(self):
        self.url = reverse('boulder-process')

    @patch('boulder.views.detect_holds')
    def test_process_image_success(self, mock_detect):
        mock_detect.return_value = {
            "positions": [
                {"x": 100, "y": 200}
            ]
        }

        image = SimpleUploadedFile(
            name='test.jpg',
            content=b'\x47\x49\x46',
            content_type='image/jpeg'
        )

        response = self.client.post(
            self.url, {'image': image}, format='multipart'
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertIn('boulder', response.data)
        self.assertIn('positions', response.data['boulder'])

        self.assertEqual(Boulder.objects.count(), 1)
        boulder = Boulder.objects.first()
        self.assertEqual(boulder.positions["positions"][0]["x"], 100)

    def test_process_image_missing(self):
        response = self.client.post(self.url, {}, format='multipart')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn("error", response.data)
