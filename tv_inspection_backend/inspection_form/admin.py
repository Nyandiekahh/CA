# inspection_form/admin.py

from django.contrib import admin
from .models import (
    InspectionForm, AdministrativeInfo, TowerInfo, TransmitterInfo,
    FilterInfo, AntennaSystem, StudioToTransmitterLink, OtherInformation,
    CAInspectionPersonnel
)

class AdministrativeInfoInline(admin.StackedInline):
    model = AdministrativeInfo
    can_delete = False
    verbose_name = "Administrative Information"
    verbose_name_plural = "Administrative Information"
    fields = [
        ('name_of_broadcaster', 'phone_number'),
        ('po_box', 'postal_code', 'town'),
        ('location', 'street'),
        ('station_type', 'transmitting_site'),
        ('longitude', 'latitude'),
        ('physical_location', 'physical_street', 'physical_area'),
        'altitude',
        'land_owner',
        ('other_telecoms_operator', 'other_telecoms_details'),
    ]

class TowerInfoInline(admin.StackedInline):
    model = TowerInfo
    can_delete = False
    verbose_name = "Tower Information"
    verbose_name_plural = "Tower Information"
    fields = [
        'tower_owner',
        ('tower_height', 'tower_above_building', 'building_height'),
        ('tower_type', 'tower_type_other'),
        'rust_protection',
        ('installation_year', 'manufacturer', 'model_number'),
        ('max_wind_load', 'max_load_charge'),
        ('is_insured', 'insurer_name'),
        ('concrete_base', 'lightning_protection'),
        ('electrically_grounded', 'aviation_warning_light'),
        ('other_antennas', 'other_antennas_details'),
    ]

class TransmitterInfoInline(admin.StackedInline):
    model = TransmitterInfo
    can_delete = False
    verbose_name = "Transmitter Information"
    verbose_name_plural = "Transmitter Information"
    fieldsets = (
        ('Exciter', {
            'fields': (
                ('exciter_manufacturer', 'exciter_model_number', 'exciter_serial_number'),
                ('exciter_nominal_power', 'exciter_actual_reading'),
            )
        }),
        ('Amplifier', {
            'fields': (
                ('amplifier_manufacturer', 'amplifier_model_number', 'amplifier_serial_number'),
                ('amplifier_nominal_power', 'amplifier_actual_reading'),
                'rf_output_type',
                ('frequency_range', 'transmit_frequency', 'frequency_stability'),
                ('harmonics_suppression_level', 'spurious_emission_level'),
                ('internal_audio_limiter', 'internal_stereo_coder'),
                'transmitter_catalog',
                'transmit_bandwidth',
            )
        }),
    )

class FilterInfoInline(admin.StackedInline):
    model = FilterInfo
    can_delete = False
    verbose_name = "Filter Information"
    verbose_name_plural = "Filter Information"
    fields = [
        'filter_type',
        ('manufacturer', 'model_number', 'serial_number'),
        'frequency',
    ]

class AntennaSystemInline(admin.StackedInline):
    model = AntennaSystem
    can_delete = False
    verbose_name = "Antenna System"
    verbose_name_plural = "Antenna System"
    fieldsets = (
        (None, {
            'fields': (
                ('height', 'antenna_type'),
                ('manufacturer', 'model_number'),
                'polarization',
            )
        }),
        ('Horizontal Pattern', {
            'fields': (
                'horizontal_pattern',
                'beam_width_3db',
                'degrees_azimuth',
                'table_azimuth_horizontal',
            )
        }),
        ('Vertical Pattern', {
            'fields': (
                ('mechanical_tilt', 'mechanical_tilt_degree'),
                ('electrical_tilt', 'electrical_tilt_degree'),
                ('null_fill', 'null_fill_percentage'),
                'table_azimuth_vertical',
            )
        }),
        ('Performance', {
            'fields': (
                'antenna_system_gain',
                'estimated_antenna_losses',
                'estimated_feeder_losses',
                'estimated_multiplexer_losses',
                'effective_radiated_power',
                'antenna_catalog',
            )
        }),
    )

class StudioToTransmitterLinkInline(admin.StackedInline):
    model = StudioToTransmitterLink
    can_delete = False
    verbose_name = "Studio to Transmitter Link"
    verbose_name_plural = "Studio to Transmitter Link"
    fields = [
        ('manufacturer', 'model_number', 'serial_number'),
        ('frequency', 'polarization'),
        'signal_description',
    ]

class OtherInformationInline(admin.StackedInline):
    model = OtherInformation
    can_delete = False
    verbose_name = "Other Information"
    verbose_name_plural = "Other Information"
    fields = [
        'observations',
        'technical_personnel_name',
        ('contact_name', 'contact_address'),
        ('contact_tel', 'contact_email'),
        ('contact_signature', 'contact_date'),
    ]

class CAInspectionPersonnelInline(admin.TabularInline):
    model = CAInspectionPersonnel
    extra = 1
    verbose_name = "CA Inspection Personnel"
    verbose_name_plural = "CA Inspection Personnel"
    fields = ['name', 'signature', 'date']

@admin.register(InspectionForm)
class InspectionFormAdmin(admin.ModelAdmin):
    list_display = ('id', 'form_id', 'created_by', 'created_at')
    list_display_links = ('id', 'form_id')  # Make these fields clickable
    list_filter = ('created_at', 'created_by')
    search_fields = ('id', 'form_id', 'created_by__username')
    readonly_fields = ('form_id', 'version', 'created_at', 'updated_at')
    date_hierarchy = 'created_at'
    
    fieldsets = (
        ('Form Information', {
            'fields': (('form_id', 'version'), ('created_at', 'updated_at'), 'created_by')
        }),
    )
    
    inlines = [
        AdministrativeInfoInline,
        TowerInfoInline,
        TransmitterInfoInline,
        FilterInfoInline,
        AntennaSystemInline,
        StudioToTransmitterLinkInline,
        OtherInformationInline,
        CAInspectionPersonnelInline,
    ]

    def has_delete_permission(self, request, obj=None):
        # Only superusers can delete forms
        return request.user.is_superuser

# These models are already accessible through the InspectionForm admin
# so we don't need to register them separately unless you want to
# access them directly in the admin

# Uncomment if you want these models to appear separately in the admin
"""
@admin.register(AdministrativeInfo)
class AdministrativeInfoAdmin(admin.ModelAdmin):
    list_display = ('id', 'form', 'name_of_broadcaster')
    list_filter = ('form__created_at',)
    search_fields = ('name_of_broadcaster', 'form__id')

@admin.register(TowerInfo)
class TowerInfoAdmin(admin.ModelAdmin):
    list_display = ('id', 'form', 'tower_owner')
    list_filter = ('form__created_at',)
    search_fields = ('tower_owner', 'form__id')

@admin.register(TransmitterInfo)
class TransmitterInfoAdmin(admin.ModelAdmin):
    list_display = ('id', 'form', 'exciter_manufacturer')
    list_filter = ('form__created_at',)
    search_fields = ('exciter_manufacturer', 'form__id')

@admin.register(FilterInfo)
class FilterInfoAdmin(admin.ModelAdmin):
    list_display = ('id', 'form', 'filter_type')
    list_filter = ('form__created_at',)
    search_fields = ('filter_type', 'form__id')

@admin.register(AntennaSystem)
class AntennaSystemAdmin(admin.ModelAdmin):
    list_display = ('id', 'form', 'antenna_type')
    list_filter = ('form__created_at',)
    search_fields = ('antenna_type', 'form__id')

@admin.register(StudioToTransmitterLink)
class StudioToTransmitterLinkAdmin(admin.ModelAdmin):
    list_display = ('id', 'form', 'manufacturer')
    list_filter = ('form__created_at',)
    search_fields = ('manufacturer', 'form__id')

@admin.register(OtherInformation)
class OtherInformationAdmin(admin.ModelAdmin):
    list_display = ('id', 'form', 'technical_personnel_name')
    list_filter = ('form__created_at',)
    search_fields = ('technical_personnel_name', 'form__id')

@admin.register(CAInspectionPersonnel)
class CAInspectionPersonnelAdmin(admin.ModelAdmin):
    list_display = ('id', 'form', 'name')
    list_filter = ('form__created_at',)
    search_fields = ('name', 'form__id')
"""