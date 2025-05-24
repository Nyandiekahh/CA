# inspection_form/serializers.py

from rest_framework import serializers
from django.contrib.auth.models import User
from django.contrib.auth.password_validation import validate_password
from .models import (
    InspectionForm, AdministrativeInfo, TowerInfo, TransmitterInfo,
    FilterInfo, AntennaSystem, StudioToTransmitterLink, OtherInformation,
    CAInspectionPersonnel
)


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'first_name', 'last_name']


class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)
    
    class Meta:
        model = User
        fields = ['username', 'password', 'password2', 'email', 'first_name', 'last_name']
    
    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs
    
    def create(self, validated_data):
        validated_data.pop('password2')
        user = User.objects.create(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', '')
        )
        user.set_password(validated_data['password'])
        user.save()
        return user


class AdministrativeInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdministrativeInfo
        exclude = ['form']


class TowerInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TowerInfo
        exclude = ['form']


class TransmitterInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = TransmitterInfo
        exclude = ['form']


class FilterInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = FilterInfo
        exclude = ['form']


class AntennaSystemSerializer(serializers.ModelSerializer):
    class Meta:
        model = AntennaSystem
        exclude = ['form']


class StudioToTransmitterLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudioToTransmitterLink
        exclude = ['form']


class CAInspectionPersonnelSerializer(serializers.ModelSerializer):
    class Meta:
        model = CAInspectionPersonnel
        exclude = ['form']


class OtherInformationSerializer(serializers.ModelSerializer):
    class Meta:
        model = OtherInformation
        exclude = ['form']


class InspectionFormSerializer(serializers.ModelSerializer):
    administrative_info = AdministrativeInfoSerializer(required=False)
    tower_info = TowerInfoSerializer(required=False)
    transmitter_info = TransmitterInfoSerializer(required=False)
    filter_info = FilterInfoSerializer(required=False)
    antenna_system = AntennaSystemSerializer(required=False)
    stl = StudioToTransmitterLinkSerializer(required=False)
    other_information = OtherInformationSerializer(required=False)
    ca_personnel = CAInspectionPersonnelSerializer(many=True, required=False)
    
    class Meta:
        model = InspectionForm
        fields = [
            'id', 'form_id', 'version', 'created_at', 'updated_at', 'created_by',
            'administrative_info', 'tower_info', 'transmitter_info',
            'filter_info', 'antenna_system', 'stl',
            'other_information', 'ca_personnel'
        ]
        read_only_fields = ['form_id', 'version', 'created_at', 'updated_at', 'created_by']
    
    def create(self, validated_data):
        # Extract nested serializer data
        administrative_info_data = validated_data.pop('administrative_info', None)
        tower_info_data = validated_data.pop('tower_info', None)
        transmitter_info_data = validated_data.pop('transmitter_info', None)
        filter_info_data = validated_data.pop('filter_info', None)
        antenna_system_data = validated_data.pop('antenna_system', None)
        stl_data = validated_data.pop('stl', None)
        other_information_data = validated_data.pop('other_information', None)
        ca_personnel_data = validated_data.pop('ca_personnel', [])
        
        # Create the main form
        form = InspectionForm.objects.create(**validated_data)
        
        # Create related objects
        if administrative_info_data:
            AdministrativeInfo.objects.create(form=form, **administrative_info_data)
        
        if tower_info_data:
            TowerInfo.objects.create(form=form, **tower_info_data)
        
        if transmitter_info_data:
            TransmitterInfo.objects.create(form=form, **transmitter_info_data)
        
        if filter_info_data:
            FilterInfo.objects.create(form=form, **filter_info_data)
        
        if antenna_system_data:
            AntennaSystem.objects.create(form=form, **antenna_system_data)
        
        if stl_data:
            StudioToTransmitterLink.objects.create(form=form, **stl_data)
        
        if other_information_data:
            OtherInformation.objects.create(form=form, **other_information_data)
        
        for personnel_data in ca_personnel_data:
            CAInspectionPersonnel.objects.create(form=form, **personnel_data)
        
        return form
    
    def update(self, instance, validated_data):
        # Extract nested serializer data
        administrative_info_data = validated_data.pop('administrative_info', None)
        tower_info_data = validated_data.pop('tower_info', None)
        transmitter_info_data = validated_data.pop('transmitter_info', None)
        filter_info_data = validated_data.pop('filter_info', None)
        antenna_system_data = validated_data.pop('antenna_system', None)
        stl_data = validated_data.pop('stl', None)
        other_information_data = validated_data.pop('other_information', None)
        ca_personnel_data = validated_data.pop('ca_personnel', None)
        
        # Update main form instance
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        
        # Update or create related objects
        if administrative_info_data:
            admin_info, created = AdministrativeInfo.objects.get_or_create(form=instance)
            for attr, value in administrative_info_data.items():
                setattr(admin_info, attr, value)
            admin_info.save()
        
        if tower_info_data:
            tower_info, created = TowerInfo.objects.get_or_create(form=instance)
            for attr, value in tower_info_data.items():
                setattr(tower_info, attr, value)
            tower_info.save()
        
        if transmitter_info_data:
            transmitter_info, created = TransmitterInfo.objects.get_or_create(form=instance)
            for attr, value in transmitter_info_data.items():
                setattr(transmitter_info, attr, value)
            transmitter_info.save()
        
        if filter_info_data:
            filter_info, created = FilterInfo.objects.get_or_create(form=instance)
            for attr, value in filter_info_data.items():
                setattr(filter_info, attr, value)
            filter_info.save()
        
        if antenna_system_data:
            antenna_system, created = AntennaSystem.objects.get_or_create(form=instance)
            for attr, value in antenna_system_data.items():
                setattr(antenna_system, attr, value)
            antenna_system.save()
        
        if stl_data:
            stl, created = StudioToTransmitterLink.objects.get_or_create(form=instance)
            for attr, value in stl_data.items():
                setattr(stl, attr, value)
            stl.save()
        
        if other_information_data:
            other_info, created = OtherInformation.objects.get_or_create(form=instance)
            for attr, value in other_information_data.items():
                setattr(other_info, attr, value)
            other_info.save()
        
        # Handle CA personnel (this is a bit more complex as it's a many relationship)
        if ca_personnel_data:
            # Clear existing personnel and create new ones
            instance.ca_personnel.all().delete()
            for personnel_data in ca_personnel_data:
                CAInspectionPersonnel.objects.create(form=instance, **personnel_data)
        
        return instance