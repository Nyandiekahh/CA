# inspection_form/tests.py

from django.test import TestCase
from django.urls import reverse
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

from .models import (
    InspectionForm, AdministrativeInfo, TowerInfo, TransmitterInfo,
    FilterInfo, AntennaSystem, StudioToTransmitterLink, OtherInformation,
    CAInspectionPersonnel
)


class InspectionFormAPITestCase(TestCase):
    """Test case for the Inspection Form API"""
    
    def setUp(self):
        """Set up test data"""
        # Create test users
        self.admin_user = User.objects.create_superuser(
            username='admin',
            email='admin@example.com',
            password='adminpassword'
        )
        
        self.regular_user = User.objects.create_user(
            username='regular',
            email='regular@example.com',
            password='regularpassword'
        )
        
        # Set up API client
        self.client = APIClient()
        
        # Create a test form for testing
        self.form = InspectionForm.objects.create(created_by=self.regular_user)
        
        # Create test data for each form section
        self.admin_info = AdministrativeInfo.objects.create(
            form=self.form,
            name_of_broadcaster='Test FM Station',
            phone_number='123456789'
        )
        
        self.tower_info = TowerInfo.objects.create(
            form=self.form,
            tower_owner='Test Tower Company',
            tower_height=50.0
        )
        
        # URL for list view
        self.list_url = reverse('inspectionform-list')
        
        # URL for detail view
        self.detail_url = reverse('inspectionform-detail', kwargs={'pk': self.form.id})
        
        # URL for form submission
        self.submit_url = reverse('submit-form')
        
        # URL for form update
        self.update_url = reverse('update-form', kwargs={'pk': self.form.id})
        
        # URL for PDF download
        self.pdf_url = reverse('download-form-pdf', kwargs={'pk': self.form.id})
        
        # URL for Excel download
        self.excel_url = reverse('download-form-excel', kwargs={'pk': self.form.id})
    
    def test_list_forms_authenticated(self):
        """Test that authenticated users can list their forms"""
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # User should see their one form
    
    def test_list_forms_admin(self):
        """Test that admin users can list all forms"""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  # Admin should see all forms (1 in this case)
    
    # In tests.py, modify the test_list_forms_unauthenticated method:

    def test_list_forms_unauthenticated(self):
        """Test that unauthenticated users cannot list forms"""
        response = self.client.get(self.list_url)
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)  # Changed from 401 to 403
    
    def test_get_form_detail_owner(self):
        """Test that form owners can view their form details"""
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.form.id)
    
    def test_get_form_detail_admin(self):
        """Test that admin users can view any form details"""
        self.client.force_authenticate(user=self.admin_user)
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['id'], self.form.id)
    
    def test_get_form_detail_unauthorized(self):
        """Test that users cannot view forms they don't own"""
        # Create another user
        other_user = User.objects.create_user(
            username='other',
            email='other@example.com',
            password='otherpassword'
        )
        self.client.force_authenticate(user=other_user)
        response = self.client.get(self.detail_url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_submit_form(self):
        """Test form submission"""
        self.client.force_authenticate(user=self.regular_user)
        
        # Prepare test data
        data = {
            'administrative_info': {
                'name_of_broadcaster': 'New FM Station',
                'phone_number': '987654321'
            },
            'tower_info': {
                'tower_owner': 'New Tower Company',
                'tower_height': 60.0
            }
        }
        
        response = self.client.post(self.submit_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        
        # Verify the form was created
        self.assertEqual(InspectionForm.objects.count(), 2)
        new_form = InspectionForm.objects.latest('id')
        self.assertEqual(new_form.administrative_info.name_of_broadcaster, 'New FM Station')
    
    def test_update_form(self):
        """Test form update"""
        self.client.force_authenticate(user=self.regular_user)
        
        # Prepare update data
        data = {
            'administrative_info': {
                'name_of_broadcaster': 'Updated FM Station'
            }
        }
        
        response = self.client.put(self.update_url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Verify the form was updated
        self.admin_info.refresh_from_db()
        self.assertEqual(self.admin_info.name_of_broadcaster, 'Updated FM Station')
    
    def test_download_pdf(self):
        """Test PDF download"""
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get(self.pdf_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/pdf')
    
    def test_download_excel(self):
        """Test Excel download"""
        self.client.force_authenticate(user=self.regular_user)
        response = self.client.get(self.excel_url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response['Content-Type'], 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
    
    def test_user_registration(self):
        """Test user registration"""
        url = reverse('register')
        data = {
            'username': 'newuser',
            'password': 'newuserpassword',
            'password2': 'newuserpassword',
            'email': 'newuser@example.com'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertTrue(User.objects.filter(username='newuser').exists())
    
    def test_user_login(self):
        """Test user login"""
        url = reverse('login')
        data = {
            'username': 'regular',
            'password': 'regularpassword'
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['user']['username'], 'regular')