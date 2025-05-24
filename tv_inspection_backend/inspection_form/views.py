# inspection_form/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, action
from django.contrib.auth import authenticate
from django.db import transaction
from django.http import HttpResponse
from django.shortcuts import get_object_or_404

from .models import (
    InspectionForm, AdministrativeInfo, TowerInfo, TransmitterInfo,
    FilterInfo, AntennaSystem, StudioToTransmitterLink, OtherInformation,
    CAInspectionPersonnel
)
from .serializers import (
    InspectionFormSerializer, AdministrativeInfoSerializer, TowerInfoSerializer,
    TransmitterInfoSerializer, FilterInfoSerializer, AntennaSystemSerializer,
    StudioToTransmitterLinkSerializer, OtherInformationSerializer,
    CAInspectionPersonnelSerializer, UserSerializer, UserRegistrationSerializer
)
from .pdf_generator import generate_inspection_form_response
from .excel_generator import generate_inspection_form_excel_response


class InspectionFormViewSet(viewsets.ModelViewSet):
    """ViewSet for inspection form operations"""
    queryset = InspectionForm.objects.all()
    serializer_class = InspectionFormSerializer
    permission_classes = [permissions.IsAuthenticated]
    
    def get_queryset(self):
        """Filter forms to only show those created by the current user"""
        user = self.request.user
        # Superusers can see all forms
        if user.is_superuser:
            return InspectionForm.objects.all()
        # Regular users can only see their own forms
        return InspectionForm.objects.filter(created_by=user)
    
    def perform_create(self, serializer):
        """Set the current user as the creator of the form"""
        serializer.save(created_by=self.request.user)
    
    @action(detail=True, methods=['get'])
    def download_pdf(self, request, pk=None):
        """Generate and download the form as a PDF"""
        form = self.get_object()
        return generate_inspection_form_response(form)
    
    @action(detail=True, methods=['get'])
    def download_excel(self, request, pk=None):
        """Generate and download the form as an Excel file"""
        form = self.get_object()
        return generate_inspection_form_excel_response(form)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def register_user(request):
    """Register a new user"""
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        return Response({
            'user': UserSerializer(user).data,
            'message': 'User registered successfully',
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.AllowAny])
def login_user(request):
    """Login user and return user data with JWT tokens"""
    username = request.data.get('username')
    password = request.data.get('password')
    
    if not username or not password:
        return Response(
            {'error': 'Please provide both username and password'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    user = authenticate(username=username, password=password)
    if not user:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    # Generate JWT tokens using Simple JWT
    from rest_framework_simplejwt.tokens import RefreshToken
    refresh = RefreshToken.for_user(user)
    
    return Response({
        'access': str(refresh.access_token),  # ADDED JWT ACCESS TOKEN
        'refresh': str(refresh),              # ADDED JWT REFRESH TOKEN
        'user': UserSerializer(user).data,
        'message': 'Login successful',
    })


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def get_user_profile(request):
    """Get current user profile"""
    return Response(UserSerializer(request.user).data)


@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
def update_user_profile(request):
    """Update current user profile"""
    user = request.user
    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
@transaction.atomic
def submit_form(request):
    """
    Submit a complete inspection form with all related sections
    """
    # Get the data from request
    data = request.data
    
    # Create a new form instance
    form_serializer = InspectionFormSerializer(data={})
    if form_serializer.is_valid():
        # Save the form with the current user
        form = form_serializer.save(created_by=request.user)
        
        # Process each section
        sections = {
            'administrative_info': AdministrativeInfoSerializer,
            'tower_info': TowerInfoSerializer,
            'transmitter_info': TransmitterInfoSerializer,
            'filter_info': FilterInfoSerializer,
            'antenna_system': AntennaSystemSerializer,
            'stl': StudioToTransmitterLinkSerializer,
            'other_information': OtherInformationSerializer,
        }
        
        for section_name, serializer_class in sections.items():
            if section_name in data:
                section_data = data[section_name]
                section_serializer = serializer_class(data=section_data)
                if section_serializer.is_valid():
                    section_serializer.save(form=form)
                else:
                    # If any section validation fails, roll back the transaction
                    return Response(
                        {
                            'error': f'Validation error in {section_name}',
                            'details': section_serializer.errors
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
        
        # Process CA personnel (multiple entries)
        if 'ca_personnel' in data:
            for personnel_data in data['ca_personnel']:
                personnel_serializer = CAInspectionPersonnelSerializer(data=personnel_data)
                if personnel_serializer.is_valid():
                    personnel_serializer.save(form=form)
                else:
                    return Response(
                        {
                            'error': 'Validation error in CA personnel',
                            'details': personnel_serializer.errors
                        },
                        status=status.HTTP_400_BAD_REQUEST
                    )
        
        # Return the complete form data
        return Response(
            InspectionFormSerializer(form).data,
            status=status.HTTP_201_CREATED
        )
    else:
        return Response(
            form_serializer.errors,
            status=status.HTTP_400_BAD_REQUEST
        )


@api_view(['PUT'])
@permission_classes([permissions.IsAuthenticated])
@transaction.atomic
def update_form(request, pk):
    """
    Update an existing inspection form with all related sections
    """
    try:
        form = InspectionForm.objects.get(pk=pk)
    except InspectionForm.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    # Check if the user has permission to update this form
    if form.created_by != request.user and not request.user.is_superuser:
        return Response(
            {"error": "You don't have permission to update this form"},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Get the data from request
    data = request.data
    
    # Process each section
    sections = {
        'administrative_info': (AdministrativeInfo, AdministrativeInfoSerializer),
        'tower_info': (TowerInfo, TowerInfoSerializer),
        'transmitter_info': (TransmitterInfo, TransmitterInfoSerializer),
        'filter_info': (FilterInfo, FilterInfoSerializer),
        'antenna_system': (AntennaSystem, AntennaSystemSerializer),
        'stl': (StudioToTransmitterLink, StudioToTransmitterLinkSerializer),
        'other_information': (OtherInformation, OtherInformationSerializer),
    }
    
    for section_name, (model_class, serializer_class) in sections.items():
        if section_name in data:
            section_data = data[section_name]
            try:
                section_instance = model_class.objects.get(form=form)
                section_serializer = serializer_class(section_instance, data=section_data, partial=True)
            except model_class.DoesNotExist:
                section_serializer = serializer_class(data=section_data)
            
            if section_serializer.is_valid():
                section_serializer.save(form=form)
            else:
                # If any section validation fails, roll back the transaction
                return Response(
                    {
                        'error': f'Validation error in {section_name}',
                        'details': section_serializer.errors
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
    
    # Process CA personnel (multiple entries)
    if 'ca_personnel' in data:
        # Remove existing personnel
        CAInspectionPersonnel.objects.filter(form=form).delete()
        
        # Add new personnel
        for personnel_data in data['ca_personnel']:
            personnel_serializer = CAInspectionPersonnelSerializer(data=personnel_data)
            if personnel_serializer.is_valid():
                personnel_serializer.save(form=form)
            else:
                return Response(
                    {
                        'error': 'Validation error in CA personnel',
                        'details': personnel_serializer.errors
                    },
                    status=status.HTTP_400_BAD_REQUEST
                )
    
    # Return the updated form data
    return Response(
        InspectionFormSerializer(form).data,
        status=status.HTTP_200_OK
    )


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def download_form_pdf(request, pk):
    """
    Generate and download the form as a PDF
    """
    try:
        form = InspectionForm.objects.get(pk=pk)
    except InspectionForm.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    # Check if the user has permission to view this form
    if form.created_by != request.user and not request.user.is_superuser:
        return Response(
            {"error": "You don't have permission to view this form"},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Generate and return PDF
    return generate_inspection_form_response(form)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def download_form_excel(request, pk):
    """
    Generate and download the form as an Excel spreadsheet
    """
    try:
        form = InspectionForm.objects.get(pk=pk)
    except InspectionForm.DoesNotExist:
        return Response(status=status.HTTP_404_NOT_FOUND)
    
    # Check if the user has permission to view this form
    if form.created_by != request.user and not request.user.is_superuser:
        return Response(
            {"error": "You don't have permission to view this form"},
            status=status.HTTP_403_FORBIDDEN
        )
    
    # Generate and return Excel
    return generate_inspection_form_excel_response(form)