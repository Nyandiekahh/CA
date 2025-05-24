# inspection_form/models.py

from django.db import models
from django.contrib.auth.models import User


class InspectionForm(models.Model):
    """Main form model to track overall inspection details"""
    form_id = models.CharField(max_length=20, default='CA/F/FSM/17', editable=False)
    version = models.CharField(max_length=10, default='B', editable=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='inspection_forms')
    
    def __str__(self):
        return f"Inspection Form {self.id} - {self.created_at.strftime('%Y-%m-%d')}"


class AdministrativeInfo(models.Model):
    """Administrative information section (Page 1)"""
    form = models.OneToOneField(InspectionForm, on_delete=models.CASCADE, related_name='administrative_info')
    name_of_broadcaster = models.CharField(max_length=255)
    po_box = models.CharField(max_length=50, blank=True, null=True)
    postal_code = models.CharField(max_length=20, blank=True, null=True)
    town = models.CharField(max_length=100, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    street = models.CharField(max_length=255, blank=True, null=True)
    phone_number = models.CharField(max_length=50, blank=True, null=True)
    
    # General Data
    STATION_TYPES = [
        ('RADIO_AM', 'Radio AM'),
        ('RADIO_FM', 'Radio FM'),
        ('TV', 'TV'),
    ]
    station_type = models.CharField(max_length=20, choices=STATION_TYPES, blank=True, null=True)
    transmitting_site = models.CharField(max_length=255, blank=True, null=True)
    longitude = models.CharField(max_length=50, blank=True, null=True)  # dd mm ss E
    latitude = models.CharField(max_length=50, blank=True, null=True)   # dd mm ss N/S
    physical_location = models.CharField(max_length=255, blank=True, null=True)
    physical_street = models.CharField(max_length=255, blank=True, null=True)
    physical_area = models.CharField(max_length=255, blank=True, null=True)
    altitude = models.FloatField(blank=True, null=True)  # m above sea level
    land_owner = models.CharField(max_length=255, blank=True, null=True)
    other_telecoms_operator = models.BooleanField(default=False)
    other_telecoms_details = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"Administrative Info for {self.form}"


class TowerInfo(models.Model):
    """Tower information section (Page 1 - Tower section)"""
    form = models.OneToOneField(InspectionForm, on_delete=models.CASCADE, related_name='tower_info')
    tower_owner = models.CharField(max_length=255, blank=True, null=True)
    tower_height = models.FloatField(blank=True, null=True)  # meters
    tower_above_building = models.BooleanField(default=False)
    building_height = models.FloatField(blank=True, null=True)  # meters
    
    TOWER_TYPES = [
        ('GUYED', 'Guyed'),
        ('SELF_SUPPORTING', 'Self-Supporting'),
        ('OTHER', 'Other'),
    ]
    tower_type = models.CharField(max_length=20, choices=TOWER_TYPES, blank=True, null=True)
    tower_type_other = models.CharField(max_length=100, blank=True, null=True)
    
    RUST_PROTECTION_TYPES = [
        ('GALVANIZED', 'Galvanized'),
        ('PAINTED', 'Painted'),
        ('ALUMINUM', 'Aluminum'),
        ('NONE', 'No Rust Protection'),
    ]
    rust_protection = models.CharField(max_length=20, choices=RUST_PROTECTION_TYPES, blank=True, null=True)
    installation_year = models.IntegerField(blank=True, null=True)
    manufacturer = models.CharField(max_length=255, blank=True, null=True)
    model_number = models.CharField(max_length=100, blank=True, null=True)
    max_wind_load = models.FloatField(blank=True, null=True)  # km/h
    max_load_charge = models.FloatField(blank=True, null=True)  # kg
    is_insured = models.BooleanField(default=False)
    insurer_name = models.CharField(max_length=255, blank=True, null=True)
    concrete_base = models.BooleanField(default=False)
    lightning_protection = models.BooleanField(default=False)
    electrically_grounded = models.BooleanField(default=False)
    aviation_warning_light = models.BooleanField(default=False)
    other_antennas = models.BooleanField(default=False)
    other_antennas_details = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"Tower Info for {self.form}"


class TransmitterInfo(models.Model):
    """Transmitter information section (Page 2)"""
    form = models.OneToOneField(InspectionForm, on_delete=models.CASCADE, related_name='transmitter_info')
    
    # Exciter
    exciter_manufacturer = models.CharField(max_length=255, blank=True, null=True)
    exciter_model_number = models.CharField(max_length=100, blank=True, null=True)
    exciter_serial_number = models.CharField(max_length=100, blank=True, null=True)
    exciter_nominal_power = models.FloatField(blank=True, null=True)  # W
    exciter_actual_reading = models.FloatField(blank=True, null=True)
    
    # Amplifier
    amplifier_manufacturer = models.CharField(max_length=255, blank=True, null=True)
    amplifier_model_number = models.CharField(max_length=100, blank=True, null=True)
    amplifier_serial_number = models.CharField(max_length=100, blank=True, null=True)
    amplifier_nominal_power = models.FloatField(blank=True, null=True)  # W
    amplifier_actual_reading = models.FloatField(blank=True, null=True)
    rf_output_type = models.CharField(max_length=100, blank=True, null=True)
    frequency_range = models.CharField(max_length=100, blank=True, null=True)
    transmit_frequency = models.CharField(max_length=100, blank=True, null=True)  # MHz or TV Channel Number
    frequency_stability = models.CharField(max_length=50, blank=True, null=True)  # ppm
    harmonics_suppression_level = models.FloatField(blank=True, null=True)  # dB
    spurious_emission_level = models.FloatField(blank=True, null=True)  # dB
    internal_audio_limiter = models.BooleanField(default=False)
    internal_stereo_coder = models.BooleanField(default=False)
    # Changed from FileField to TextField
    transmitter_catalog = models.TextField(blank=True, null=True)
    transmit_bandwidth = models.CharField(max_length=50, blank=True, null=True)  # -26dB
    
    def __str__(self):
        return f"Transmitter Info for {self.form}"


class FilterInfo(models.Model):
    """Filter information section (Page 2 - Filter section)"""
    form = models.OneToOneField(InspectionForm, on_delete=models.CASCADE, related_name='filter_info')
    
    FILTER_TYPES = [
        ('BAND_PASS', 'Band Pass Filter'),
        ('NOTCH', 'Notch Filter'),
        ('OTHER', 'Other'),
    ]
    filter_type = models.CharField(max_length=20, choices=FILTER_TYPES, blank=True, null=True)
    manufacturer = models.CharField(max_length=255, blank=True, null=True)
    model_number = models.CharField(max_length=100, blank=True, null=True)
    serial_number = models.CharField(max_length=100, blank=True, null=True)
    frequency = models.CharField(max_length=100, blank=True, null=True)  # MHz or TV Channel Number
    
    def __str__(self):
        return f"Filter Info for {self.form}"


class AntennaSystem(models.Model):
    """Antenna system information (Page 3)"""
    form = models.OneToOneField(InspectionForm, on_delete=models.CASCADE, related_name='antenna_system')
    height = models.FloatField(blank=True, null=True)  # m
    antenna_type = models.CharField(max_length=100, blank=True, null=True)
    manufacturer = models.CharField(max_length=255, blank=True, null=True)
    model_number = models.CharField(max_length=100, blank=True, null=True)
    
    POLARIZATION_TYPES = [
        ('VERTICAL', 'Vertical'),
        ('HORIZONTAL', 'Horizontal'),
        ('CIRCULAR', 'Circular'),
        ('ELLIPTICAL', 'Elliptical'),
    ]
    polarization = models.CharField(max_length=20, choices=POLARIZATION_TYPES, blank=True, null=True)
    
    PATTERN_TYPES = [
        ('OMNI', 'Omni directional'),
        ('DIRECTIONAL', 'Directional'),
    ]
    horizontal_pattern = models.CharField(max_length=20, choices=PATTERN_TYPES, blank=True, null=True)
    beam_width_3db = models.CharField(max_length=50, blank=True, null=True)
    degrees_azimuth = models.CharField(max_length=50, blank=True, null=True)
    # Changed from FileField to TextField
    table_azimuth_horizontal = models.TextField(blank=True, null=True)
    
    # Vertical Pattern
    mechanical_tilt = models.BooleanField(default=False)
    electrical_tilt = models.BooleanField(default=False)
    null_fill = models.BooleanField(default=False)
    mechanical_tilt_degree = models.CharField(max_length=50, blank=True, null=True)
    electrical_tilt_degree = models.CharField(max_length=50, blank=True, null=True)
    null_fill_percentage = models.CharField(max_length=50, blank=True, null=True)
    # Changed from FileField to TextField
    table_azimuth_vertical = models.TextField(blank=True, null=True)
    
    antenna_system_gain = models.CharField(max_length=50, blank=True, null=True)
    estimated_antenna_losses = models.FloatField(blank=True, null=True)  # dB
    estimated_feeder_losses = models.FloatField(blank=True, null=True)  # dB
    estimated_multiplexer_losses = models.FloatField(blank=True, null=True)  # dB
    effective_radiated_power = models.FloatField(blank=True, null=True)  # kW
    # Changed from FileField to TextField
    antenna_catalog = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"Antenna System for {self.form}"


class StudioToTransmitterLink(models.Model):
    """Studio to Transmitter Link section (Page 3 - Studio to Transmitter Link)"""
    form = models.OneToOneField(InspectionForm, on_delete=models.CASCADE, related_name='stl')
    manufacturer = models.CharField(max_length=255, blank=True, null=True)
    model_number = models.CharField(max_length=100, blank=True, null=True)
    serial_number = models.CharField(max_length=100, blank=True, null=True)
    frequency = models.FloatField(blank=True, null=True)  # MHz
    polarization = models.CharField(max_length=50, blank=True, null=True)
    signal_description = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"STL for {self.form}"


class OtherInformation(models.Model):
    """Other information section (Page 4)"""
    form = models.OneToOneField(InspectionForm, on_delete=models.CASCADE, related_name='other_information')
    observations = models.TextField(blank=True, null=True)
    technical_personnel_name = models.CharField(max_length=255, blank=True, null=True)
    
    # Contact Personnel
    contact_name = models.CharField(max_length=255, blank=True, null=True)
    contact_address = models.CharField(max_length=255, blank=True, null=True)
    contact_tel = models.CharField(max_length=50, blank=True, null=True)
    contact_email = models.EmailField(blank=True, null=True)
    # Changed from ImageField to TextField
    contact_signature = models.TextField(blank=True, null=True)
    contact_date = models.DateField(blank=True, null=True)
    
    def __str__(self):
        return f"Other Information for {self.form}"


class CAInspectionPersonnel(models.Model):
    """CA Inspection Personnel (Page 4 - field 73)"""
    form = models.ForeignKey(InspectionForm, on_delete=models.CASCADE, related_name='ca_personnel')
    name = models.CharField(max_length=255, blank=True, null=True)
    # Changed from ImageField to TextField
    signature = models.TextField(blank=True, null=True)
    date = models.DateField(blank=True, null=True)
    
    def __str__(self):
        return f"CA Personnel {self.name} for {self.form}"