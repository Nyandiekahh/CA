# inspection_form/excel_generator.py

import xlsxwriter
from io import BytesIO
from django.http import HttpResponse

def generate_inspection_form_excel(inspection_form):
    """Generate Excel version of the inspection form"""
    # Create an in-memory output file for the new workbook
    output = BytesIO()
    
    # Create a workbook and add worksheets
    workbook = xlsxwriter.Workbook(output)
    
    # Add worksheets for each section
    admin_ws = workbook.add_worksheet('Administrative Info')
    tower_ws = workbook.add_worksheet('Tower Info')
    transmitter_ws = workbook.add_worksheet('Transmitter')
    antenna_ws = workbook.add_worksheet('Antenna System')
    summary_ws = workbook.add_worksheet('Summary')
    
    # Define formats
    header_format = workbook.add_format({
        'bold': True,
        'align': 'center',
        'valign': 'vcenter',
        'fg_color': '#D7E4BC',
        'border': 1
    })
    
    subheader_format = workbook.add_format({
        'bold': True,
        'align': 'left',
        'valign': 'vcenter',
        'fg_color': '#E6E6E6',
        'border': 1
    })
    
    cell_format = workbook.add_format({
        'align': 'left',
        'valign': 'vcenter',
        'border': 1
    })
    
    yes_no_format = workbook.add_format({
        'align': 'center',
        'valign': 'vcenter',
        'border': 1
    })
    
    # --- Summary Worksheet ---
    summary_ws.merge_range('A1:F1', 'FM & TV Inspection Form', header_format)
    summary_ws.merge_range('A2:F2', 'Communications Authority of Kenya', subheader_format)
    summary_ws.merge_range('A3:F3', f'Form ID: {inspection_form.form_id}', cell_format)
    
    # Basic form info
    summary_ws.write('A5', 'Form ID:', subheader_format)
    summary_ws.write('B5', inspection_form.form_id, cell_format)
    summary_ws.write('A6', 'Version:', subheader_format)
    summary_ws.write('B6', inspection_form.version, cell_format)
    summary_ws.write('A7', 'Created At:', subheader_format)
    summary_ws.write('B7', inspection_form.created_at.strftime('%Y-%m-%d %H:%M:%S'), cell_format)
    summary_ws.write('A8', 'Created By:', subheader_format)
    summary_ws.write('B8', inspection_form.created_by.username, cell_format)
    
    # Add a section with links to other worksheets
    summary_ws.merge_range('A10:F10', 'Form Sections', header_format)
    
    summary_ws.write('A11', 'Administrative Information', subheader_format)
    summary_ws.write_url('B11', "internal:'Administrative Info'!A1", cell_format, string='Go to section')
    
    summary_ws.write('A12', 'Tower Information', subheader_format)
    summary_ws.write_url('B12', "internal:'Tower Info'!A1", cell_format, string='Go to section')
    
    summary_ws.write('A13', 'Transmitter Information', subheader_format)
    summary_ws.write_url('B13', "internal:'Transmitter'!A1", cell_format, string='Go to section')
    
    summary_ws.write('A14', 'Antenna System', subheader_format)
    summary_ws.write_url('B14', "internal:'Antenna System'!A1", cell_format, string='Go to section')
    
    # Auto-fit columns
    summary_ws.set_column('A:A', 25)
    summary_ws.set_column('B:B', 40)
    summary_ws.set_column('C:F', 15)
    
    # --- Administrative Information Worksheet ---
    admin_ws.merge_range('A1:D1', 'ADMINISTRATIVE INFORMATION', header_format)
    
    admin_info = getattr(inspection_form, 'administrative_info', None)
    
    # Write fields
    row = 2
    admin_ws.write(row, 0, 'Name of Broadcaster', subheader_format)
    admin_ws.write(row, 1, admin_info.name_of_broadcaster if admin_info else '', cell_format)
    row += 1
    
    admin_ws.write(row, 0, 'P.O. Box', subheader_format)
    admin_ws.write(row, 1, admin_info.po_box if admin_info else '', cell_format)
    row += 1
    
    admin_ws.write(row, 0, 'Postal Code', subheader_format)
    admin_ws.write(row, 1, admin_info.postal_code if admin_info else '', cell_format)
    row += 1
    
    admin_ws.write(row, 0, 'Town', subheader_format)
    admin_ws.write(row, 1, admin_info.town if admin_info else '', cell_format)
    row += 1
    
    admin_ws.write(row, 0, 'Location', subheader_format)
    admin_ws.write(row, 1, admin_info.location if admin_info else '', cell_format)
    row += 1
    
    admin_ws.write(row, 0, 'Street', subheader_format)
    admin_ws.write(row, 1, admin_info.street if admin_info else '', cell_format)
    row += 1
    
    admin_ws.write(row, 0, 'Phone Number', subheader_format)
    admin_ws.write(row, 1, admin_info.phone_number if admin_info else '', cell_format)
    row += 1
    
    # General Data
    admin_ws.merge_range(f'A{row+1}:D{row+1}', 'GENERAL DATA', header_format)
    row += 2
    
    admin_ws.write(row, 0, 'Type of Station', subheader_format)
    admin_ws.write(row, 1, admin_info.get_station_type_display() if admin_info and admin_info.station_type else '', cell_format)
    row += 1
    
    admin_ws.write(row, 0, 'Name of the Transmitting Site', subheader_format)
    admin_ws.write(row, 1, admin_info.transmitting_site if admin_info else '', cell_format)
    row += 1
    
    admin_ws.write(row, 0, 'Longitude (dd mm ss E)', subheader_format)
    admin_ws.write(row, 1, admin_info.longitude if admin_info else '', cell_format)
    row += 1
    
    admin_ws.write(row, 0, 'Latitude (dd mm ss N/S)', subheader_format)
    admin_ws.write(row, 1, admin_info.latitude if admin_info else '', cell_format)
    row += 1
    
    admin_ws.write(row, 0, 'Physical Location', subheader_format)
    admin_ws.write(row, 1, admin_info.physical_location if admin_info else '', cell_format)
    row += 1
    
    admin_ws.write(row, 0, 'Physical Street', subheader_format)
    admin_ws.write(row, 1, admin_info.physical_street if admin_info else '', cell_format)
    row += 1
    
    admin_ws.write(row, 0, 'Physical Area', subheader_format)
    admin_ws.write(row, 1, admin_info.physical_area if admin_info else '', cell_format)
    row += 1
    
    admin_ws.write(row, 0, 'Altitude (m above sea level)', subheader_format)
    admin_ws.write(row, 1, str(admin_info.altitude) if admin_info and admin_info.altitude is not None else '', cell_format)
    row += 1
    
    admin_ws.write(row, 0, 'Name of the Land Owner', subheader_format)
    admin_ws.write(row, 1, admin_info.land_owner if admin_info else '', cell_format)
    row += 1
    
    admin_ws.write(row, 0, 'Others Telecoms Operator on site?', subheader_format)
    admin_ws.write(row, 1, 'Yes' if admin_info and admin_info.other_telecoms_operator else 'No', yes_no_format)
    row += 1
    
    if admin_info and admin_info.other_telecoms_operator:
        admin_ws.write(row, 0, 'If yes, elaborate', subheader_format)
        admin_ws.write(row, 1, admin_info.other_telecoms_details if admin_info.other_telecoms_details else '', cell_format)
        row += 1
    
    # Auto-fit columns
    admin_ws.set_column('A:A', 30)
    admin_ws.set_column('B:B', 50)
    admin_ws.set_column('C:D', 15)
    
    # --- Tower Information Worksheet ---
    tower_ws.merge_range('A1:D1', 'TOWER INFORMATION', header_format)
    
    tower_info = getattr(inspection_form, 'tower_info', None)
    
    # Write fields
    row = 2
    tower_ws.write(row, 0, 'Name of the Tower Owner', subheader_format)
    tower_ws.write(row, 1, tower_info.tower_owner if tower_info else '', cell_format)
    row += 1
    
    tower_ws.write(row, 0, 'Height of the Tower above Ground', subheader_format)
    tower_ws.write(row, 1, str(tower_info.tower_height) if tower_info and tower_info.tower_height is not None else '', cell_format)
    row += 1
    
    tower_ws.write(row, 0, 'Is the tower above a Building Roof?', subheader_format)
    tower_ws.write(row, 1, 'Yes' if tower_info and tower_info.tower_above_building else 'No', yes_no_format)
    row += 1
    
    if tower_info and tower_info.tower_above_building:
        tower_ws.write(row, 0, 'Height of the building above ground', subheader_format)
        tower_ws.write(row, 1, str(tower_info.building_height) if tower_info.building_height is not None else '', cell_format)
        row += 1
    
    tower_ws.write(row, 0, 'Type of Tower', subheader_format)
    tower_type = ''
    if tower_info and tower_info.tower_type:
        if tower_info.tower_type == 'OTHER' and tower_info.tower_type_other:
            tower_type = f'Other: {tower_info.tower_type_other}'
        else:
            tower_type = tower_info.get_tower_type_display()
    tower_ws.write(row, 1, tower_type, cell_format)
    row += 1
    
    tower_ws.write(row, 0, 'Rust Protection', subheader_format)
    tower_ws.write(row, 1, tower_info.get_rust_protection_display() if tower_info and tower_info.rust_protection else '', cell_format)
    row += 1
    
    tower_ws.write(row, 0, 'Year of Tower installation', subheader_format)
    tower_ws.write(row, 1, str(tower_info.installation_year) if tower_info and tower_info.installation_year is not None else '', cell_format)
    row += 1
    
    tower_ws.write(row, 0, 'Name of the Tower Manufacturer', subheader_format)
    tower_ws.write(row, 1, tower_info.manufacturer if tower_info else '', cell_format)
    row += 1
    
    tower_ws.write(row, 0, 'Model Number', subheader_format)
    tower_ws.write(row, 1, tower_info.model_number if tower_info else '', cell_format)
    row += 1
    
    tower_ws.write(row, 0, 'Maximum Wind Load (km/h)', subheader_format)
    tower_ws.write(row, 1, str(tower_info.max_wind_load) if tower_info and tower_info.max_wind_load is not None else '', cell_format)
    row += 1
    
    tower_ws.write(row, 0, 'Maximum Load Charge (kg)', subheader_format)
    tower_ws.write(row, 1, str(tower_info.max_load_charge) if tower_info and tower_info.max_load_charge is not None else '', cell_format)
    row += 1
    
    tower_ws.write(row, 0, 'Has Tower got an Insurance Policy?', subheader_format)
    tower_ws.write(row, 1, 'Yes' if tower_info and tower_info.is_insured else 'No', yes_no_format)
    row += 1
    
    if tower_info and tower_info.is_insured:
        tower_ws.write(row, 0, 'Name of insurer', subheader_format)
        tower_ws.write(row, 1, tower_info.insurer_name if tower_info.insurer_name else '', cell_format)
        row += 1
    
    tower_ws.write(row, 0, 'Concrete Base?', subheader_format)
    tower_ws.write(row, 1, 'Yes' if tower_info and tower_info.concrete_base else 'No', yes_no_format)
    row += 1
    
    tower_ws.write(row, 0, 'Lightning Protection provided?', subheader_format)
    tower_ws.write(row, 1, 'Yes' if tower_info and tower_info.lightning_protection else 'No', yes_no_format)
    row += 1
    
    tower_ws.write(row, 0, 'Is the Tower electrically grounded?', subheader_format)
    tower_ws.write(row, 1, 'Yes' if tower_info and tower_info.electrically_grounded else 'No', yes_no_format)
    row += 1
    
    tower_ws.write(row, 0, 'Aviation warning light provided?', subheader_format)
    tower_ws.write(row, 1, 'Yes' if tower_info and tower_info.aviation_warning_light else 'No', yes_no_format)
    row += 1
    
    tower_ws.write(row, 0, 'Others Antennas on the Tower?', subheader_format)
    tower_ws.write(row, 1, 'Yes' if tower_info and tower_info.other_antennas else 'No', yes_no_format)
    row += 1
    
    if tower_info and tower_info.other_antennas:
        tower_ws.write(row, 0, 'If yes, elaborate', subheader_format)
        tower_ws.write(row, 1, tower_info.other_antennas_details if tower_info.other_antennas_details else '', cell_format)
        row += 1
    
    # Auto-fit columns
    tower_ws.set_column('A:A', 30)
    tower_ws.set_column('B:B', 50)
    tower_ws.set_column('C:D', 15)
    
    # --- Transmitter Worksheet ---
    transmitter_ws.merge_range('A1:D1', 'TRANSMITTER INFORMATION', header_format)
    
    transmitter_info = getattr(inspection_form, 'transmitter_info', None)
    
    # Write Exciter section
    row = 2
    transmitter_ws.merge_range(f'A{row}:D{row}', 'A. EXCITER', subheader_format)
    row += 1
    
    transmitter_ws.write(row, 0, 'Manufacturer', subheader_format)
    transmitter_ws.write(row, 1, transmitter_info.exciter_manufacturer if transmitter_info else '', cell_format)
    row += 1
    
    transmitter_ws.write(row, 0, 'Model Number', subheader_format)
    transmitter_ws.write(row, 1, transmitter_info.exciter_model_number if transmitter_info else '', cell_format)
    row += 1
    
    transmitter_ws.write(row, 0, 'Serial Number', subheader_format)
    transmitter_ws.write(row, 1, transmitter_info.exciter_serial_number if transmitter_info else '', cell_format)
    row += 1
    
    transmitter_ws.write(row, 0, 'Nominal Power (W)', subheader_format)
    transmitter_ws.write(row, 1, str(transmitter_info.exciter_nominal_power) if transmitter_info and transmitter_info.exciter_nominal_power is not None else '', cell_format)
    row += 1
    
    transmitter_ws.write(row, 0, 'Actual Reading', subheader_format)
    transmitter_ws.write(row, 1, str(transmitter_info.exciter_actual_reading) if transmitter_info and transmitter_info.exciter_actual_reading is not None else '', cell_format)
    row += 1
    
    # Write Amplifier section
    transmitter_ws.merge_range(f'A{row}:D{row}', 'B. AMPLIFIER', subheader_format)
    row += 1
    
    transmitter_ws.write(row, 0, 'Manufacturer', subheader_format)
    transmitter_ws.write(row, 1, transmitter_info.amplifier_manufacturer if transmitter_info else '', cell_format)
    row += 1
    
    transmitter_ws.write(row, 0, 'Model Number', subheader_format)
    transmitter_ws.write(row, 1, transmitter_info.amplifier_model_number if transmitter_info else '', cell_format)
    row += 1
    
    transmitter_ws.write(row, 0, 'Serial Number', subheader_format)
    transmitter_ws.write(row, 1, transmitter_info.amplifier_serial_number if transmitter_info else '', cell_format)
    row += 1
    
    transmitter_ws.write(row, 0, 'Nominal Power (W)', subheader_format)
    transmitter_ws.write(row, 1, str(transmitter_info.amplifier_nominal_power) if transmitter_info and transmitter_info.amplifier_nominal_power is not None else '', cell_format)
    row += 1
    
    transmitter_ws.write(row, 0, 'Actual Reading', subheader_format)
    transmitter_ws.write(row, 1, str(transmitter_info.amplifier_actual_reading) if transmitter_info and transmitter_info.amplifier_actual_reading is not None else '', cell_format)
    row += 1
    
    transmitter_ws.write(row, 0, 'RF output connector type', subheader_format)
    transmitter_ws.write(row, 1, transmitter_info.rf_output_type if transmitter_info else '', cell_format)
    row += 1
    
    transmitter_ws.write(row, 0, 'Frequency Range', subheader_format)
    transmitter_ws.write(row, 1, transmitter_info.frequency_range if transmitter_info else '', cell_format)
    row += 1
    
    transmitter_ws.write(row, 0, 'Transmit Frequency', subheader_format)
    transmitter_ws.write(row, 1, transmitter_info.transmit_frequency if transmitter_info else '', cell_format)
    row += 1
    
    transmitter_ws.write(row, 0, 'Frequency Stability (ppm)', subheader_format)
    transmitter_ws.write(row, 1, transmitter_info.frequency_stability if transmitter_info else '', cell_format)
    row += 1
    
    transmitter_ws.write(row, 0, 'Harmonics Suppression Level (dB)', subheader_format)
    transmitter_ws.write(row, 1, str(transmitter_info.harmonics_suppression_level) if transmitter_info and transmitter_info.harmonics_suppression_level is not None else '', cell_format)
    row += 1
    
    transmitter_ws.write(row, 0, 'Spurious Emission Level (dB)', subheader_format)
    transmitter_ws.write(row, 1, str(transmitter_info.spurious_emission_level) if transmitter_info and transmitter_info.spurious_emission_level is not None else '', cell_format)
    row += 1
    
    transmitter_ws.write(row, 0, 'Internal Audio Limiter', subheader_format)
    transmitter_ws.write(row, 1, 'Yes' if transmitter_info and transmitter_info.internal_audio_limiter else 'No', yes_no_format)
    row += 1
    
    transmitter_ws.write(row, 0, 'Internal Stereo Coder', subheader_format)
    transmitter_ws.write(row, 1, 'Yes' if transmitter_info and transmitter_info.internal_stereo_coder else 'No', yes_no_format)
    row += 1
    
    transmitter_ws.write(row, 0, 'Transmit Bandwidth (-26dB)', subheader_format)
    transmitter_ws.write(row, 1, transmitter_info.transmit_bandwidth if transmitter_info else '', cell_format)
    row += 1
    
    # Write Filter section
    transmitter_ws.merge_range(f'A{row}:D{row}', 'FILTER', header_format)
    row += 1
    
    filter_info = getattr(inspection_form, 'filter_info', None)
    
    transmitter_ws.write(row, 0, 'Type', subheader_format)
    transmitter_ws.write(row, 1, filter_info.get_filter_type_display() if filter_info and filter_info.filter_type else '', cell_format)
    row += 1
    
    transmitter_ws.write(row, 0, 'Manufacturer', subheader_format)
    transmitter_ws.write(row, 1, filter_info.manufacturer if filter_info else '', cell_format)
    row += 1
    
    transmitter_ws.write(row, 0, 'Model Number', subheader_format)
    transmitter_ws.write(row, 1, filter_info.model_number if filter_info else '', cell_format)
    row += 1
    
    transmitter_ws.write(row, 0, 'Serial Number', subheader_format)
    transmitter_ws.write(row, 1, filter_info.serial_number if filter_info else '', cell_format)
    row += 1
    
    transmitter_ws.write(row, 0, 'Frequency', subheader_format)
    transmitter_ws.write(row, 1, filter_info.frequency if filter_info else '', cell_format)
    row += 1
    
    # Auto-fit columns
    transmitter_ws.set_column('A:A', 30)
    transmitter_ws.set_column('B:B', 50)
    transmitter_ws.set_column('C:D', 15)
    
    # --- Antenna System Worksheet ---
    antenna_ws.merge_range('A1:D1', 'ANTENNA SYSTEM', header_format)
    
    antenna_system = getattr(inspection_form, 'antenna_system', None)
    
    # Write fields
    row = 2
    antenna_ws.write(row, 0, 'Height the Antenna on the Tower/Mast (m)', subheader_format)
    antenna_ws.write(row, 1, str(antenna_system.height) if antenna_system and antenna_system.height is not None else '', cell_format)
    row += 1
    
    antenna_ws.write(row, 0, 'Type of Antenna', subheader_format)
    antenna_ws.write(row, 1, antenna_system.antenna_type if antenna_system else '', cell_format)
    row += 1
    
    antenna_ws.write(row, 0, 'Antenna Manufacturer', subheader_format)
    antenna_ws.write(row, 1, antenna_system.manufacturer if antenna_system else '', cell_format)
    row += 1
    
    antenna_ws.write(row, 0, 'Antenna Model Number', subheader_format)
    antenna_ws.write(row, 1, antenna_system.model_number if antenna_system else '', cell_format)
    row += 1
    
    antenna_ws.write(row, 0, 'Polarization', subheader_format)
    antenna_ws.write(row, 1, antenna_system.get_polarization_display() if antenna_system and antenna_system.polarization else '', cell_format)
    row += 1
    
    # Write Horizontal Pattern section
    antenna_ws.merge_range(f'A{row}:D{row}', 'HORIZONTAL PATTERN', subheader_format)
    row += 1
    
    antenna_ws.write(row, 0, 'Pattern Type', subheader_format)
    antenna_ws.write(row, 1, antenna_system.get_horizontal_pattern_display() if antenna_system and antenna_system.horizontal_pattern else '', cell_format)
    row += 1
    
    antenna_ws.write(row, 0, 'Beam width measured at - 3 dB Level', subheader_format)
    antenna_ws.write(row, 1, antenna_system.beam_width_3db if antenna_system else '', cell_format)
    row += 1
    
    antenna_ws.write(row, 0, 'Degrees azimuth for the max gain related to N', subheader_format)
    antenna_ws.write(row, 1, antenna_system.degrees_azimuth if antenna_system else '', cell_format)
    row += 1
    
    # Write Vertical Pattern section
    antenna_ws.merge_range(f'A{row}:D{row}', 'VERTICAL PATTERN', subheader_format)
    row += 1
    
    antenna_ws.write(row, 0, 'Mechanical tilt?', subheader_format)
    antenna_ws.write(row, 1, 'Yes' if antenna_system and antenna_system.mechanical_tilt else 'No', yes_no_format)
    row += 1
    
    if antenna_system and antenna_system.mechanical_tilt:
        antenna_ws.write(row, 0, 'Degree of Mechanical Tilt', subheader_format)
        antenna_ws.write(row, 1, antenna_system.mechanical_tilt_degree if antenna_system.mechanical_tilt_degree else '', cell_format)
        row += 1
    
    antenna_ws.write(row, 0, 'Electrical tilt?', subheader_format)
    antenna_ws.write(row, 1, 'Yes' if antenna_system and antenna_system.electrical_tilt else 'No', yes_no_format)
    row += 1
    
    if antenna_system and antenna_system.electrical_tilt:
        antenna_ws.write(row, 0, 'Degree of Electrical Tilt', subheader_format)
        antenna_ws.write(row, 1, antenna_system.electrical_tilt_degree if antenna_system.electrical_tilt_degree else '', cell_format)
        row += 1
    
    antenna_ws.write(row, 0, 'Null fill?', subheader_format)
    antenna_ws.write(row, 1, 'Yes' if antenna_system and antenna_system.null_fill else 'No', yes_no_format)
    row += 1
    
    if antenna_system and antenna_system.null_fill:
        antenna_ws.write(row, 0, 'Percentage of filling', subheader_format)
        antenna_ws.write(row, 1, antenna_system.null_fill_percentage if antenna_system.null_fill_percentage else '', cell_format)
        row += 1
    
    # Write additional antenna information
    antenna_ws.write(row, 0, 'Gain of the Antenna System', subheader_format)
    antenna_ws.write(row, 1, antenna_system.antenna_system_gain if antenna_system else '', cell_format)
    row += 1
    
    antenna_ws.write(row, 0, 'Estimated antenna losses (dB)', subheader_format)
    antenna_ws.write(row, 1, str(antenna_system.estimated_antenna_losses) if antenna_system and antenna_system.estimated_antenna_losses is not None else '', cell_format)
    row += 1
    
    antenna_ws.write(row, 0, 'Estimated losses in the feeder (dB)', subheader_format)
    antenna_ws.write(row, 1, str(antenna_system.estimated_feeder_losses) if antenna_system and antenna_system.estimated_feeder_losses is not None else '', cell_format)
    row += 1
    
    antenna_ws.write(row, 0, 'Estimated losses in multiplexer (dB)', subheader_format)
    antenna_ws.write(row, 1, str(antenna_system.estimated_multiplexer_losses) if antenna_system and antenna_system.estimated_multiplexer_losses is not None else '', cell_format)
    row += 1
    
    antenna_ws.write(row, 0, 'Effective Radiated Power (kW)', subheader_format)
    antenna_ws.write(row, 1, str(antenna_system.effective_radiated_power) if antenna_system and antenna_system.effective_radiated_power is not None else '', cell_format)
    row += 1
    
    # Write Studio to Transmitter Link section
    antenna_ws.merge_range(f'A{row}:D{row}', 'STUDIO TO TRANSMITTER LINK', header_format)
    row += 1
    
    stl = getattr(inspection_form, 'stl', None)
    
    antenna_ws.write(row, 0, 'Manufacturer', subheader_format)
    antenna_ws.write(row, 1, stl.manufacturer if stl else '', cell_format)
    row += 1
    
    antenna_ws.write(row, 0, 'Model Number', subheader_format)
    antenna_ws.write(row, 1, stl.model_number if stl else '', cell_format)
    row += 1
    
    antenna_ws.write(row, 0, 'Serial Number', subheader_format)
    antenna_ws.write(row, 1, stl.serial_number if stl else '', cell_format)
    row += 1
    
    antenna_ws.write(row, 0, 'Frequency (MHz)', subheader_format)
    antenna_ws.write(row, 1, str(stl.frequency) if stl and stl.frequency is not None else '', cell_format)
    row += 1
    
    antenna_ws.write(row, 0, 'Polarization', subheader_format)
    antenna_ws.write(row, 1, stl.polarization if stl else '', cell_format)
    row += 1
    
    antenna_ws.write(row, 0, 'Description of Signal Reception', subheader_format)
    antenna_ws.write(row, 1, stl.signal_description if stl else '', cell_format)
    row += 1
    
    # Auto-fit columns
    antenna_ws.set_column('A:A', 40)
    antenna_ws.set_column('B:B', 50)
    antenna_ws.set_column('C:D', 15)
    
    # Add Other Information to Summary Worksheet
    summary_ws.merge_range('A16:F16', 'OTHER INFORMATION', header_format)
    
    other_info = getattr(inspection_form, 'other_information', None)
    
    row = 17
    summary_ws.write(row, 0, 'Observations', subheader_format)
    summary_ws.merge_range(f'B{row}:F{row}', other_info.observations if other_info and other_info.observations else '', cell_format)
    row += 1
    
    summary_ws.write(row, 0, 'Technical Personnel Name', subheader_format)
    summary_ws.write(row, 1, other_info.technical_personnel_name if other_info else '', cell_format)
    row += 1
    
    summary_ws.write(row, 0, 'Contact Person Name', subheader_format)
    summary_ws.write(row, 1, other_info.contact_name if other_info else '', cell_format)
    row += 1
    
    summary_ws.write(row, 0, 'Contact Email', subheader_format)
    summary_ws.write(row, 1, other_info.contact_email if other_info else '', cell_format)
    row += 1
    
    summary_ws.write(row, 0, 'Contact Phone', subheader_format)
    summary_ws.write(row, 1, other_info.contact_tel if other_info else '', cell_format)
    row += 1
    
    summary_ws.write(row, 0, 'Contact Date', subheader_format)
    summary_ws.write(row, 1, other_info.contact_date.strftime('%Y-%m-%d') if other_info and other_info.contact_date else '', cell_format)
    row += 2
    
    # Add CA Personnel to Summary Worksheet
    summary_ws.merge_range(f'A{row}:F{row}', 'CA INSPECTION PERSONNEL', header_format)
    row += 1
    
    ca_personnel = inspection_form.ca_personnel.all() if hasattr(inspection_form, 'ca_personnel') else []
    
    if ca_personnel:
        for i, personnel in enumerate(ca_personnel):
            summary_ws.write(row, 0, f'Inspector {i+1} Name', subheader_format)
            summary_ws.write(row, 1, personnel.name if personnel.name else '', cell_format)
            row += 1
            
            summary_ws.write(row, 0, f'Inspector {i+1} Date', subheader_format)
            summary_ws.write(row, 1, personnel.date.strftime('%Y-%m-%d') if personnel.date else '', cell_format)
            row += 1
    else:
        summary_ws.write(row, 0, 'No CA Personnel data', cell_format)
        row += 1
    
    # Close the workbook before returning the output
    workbook.close()
    
    # Seek to the beginning of the output stream
    output.seek(0)
    
    return output


def generate_inspection_form_excel_response(inspection_form):
    """Generate HTTP response with Excel version of the inspection form"""
    output = generate_inspection_form_excel(inspection_form)
    
    # Create an HTTP response with the Excel file
    filename = f"inspection_form_{inspection_form.id}.xlsx"
    response = HttpResponse(
        output.read(),
        content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    )
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    
    return response