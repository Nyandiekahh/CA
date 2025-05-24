# inspection_form/pdf_generator.py

from io import BytesIO
from django.http import HttpResponse
from reportlab.lib.pagesizes import letter, A4
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT


def generate_inspection_form_pdf(inspection_form):
    """Generate PDF version of the inspection form using ReportLab"""
    buffer = BytesIO()
    
    # Create the PDF document
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        rightMargin=72,
        leftMargin=72,
        topMargin=72,
        bottomMargin=18
    )
    
    # Build the PDF content
    story = []
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=16,
        spaceAfter=30,
        alignment=TA_CENTER,
        textColor=colors.black
    )
    
    header_style = ParagraphStyle(
        'CustomHeader',
        parent=styles['Heading2'],
        fontSize=14,
        spaceAfter=12,
        spaceBefore=20,
        textColor=colors.black,
        backColor=colors.lightgrey
    )
    
    subheader_style = ParagraphStyle(
        'CustomSubHeader',
        parent=styles['Heading3'],
        fontSize=12,
        spaceAfter=6,
        spaceBefore=12,
        textColor=colors.black
    )
    
    normal_style = styles['Normal']
    
    # Title
    story.append(Paragraph("FM & TV INSPECTION FORM", title_style))
    story.append(Paragraph("Communications Authority of Kenya", styles['Heading3']))
    story.append(Spacer(1, 12))
    
    # Basic Information Table
    basic_data = [
        ['Form ID:', inspection_form.form_id],
        ['Version:', inspection_form.version],
        ['Created At:', inspection_form.created_at.strftime('%Y-%m-%d %H:%M:%S')],
        ['Created By:', inspection_form.created_by.username]
    ]
    
    basic_table = Table(basic_data, colWidths=[2*inch, 3*inch])
    basic_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
        ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
        ('FONTSIZE', (0, 0), (-1, -1), 10),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 12),
        ('GRID', (0, 0), (-1, -1), 1, colors.black)
    ]))
    
    story.append(basic_table)
    story.append(Spacer(1, 20))
    
    # Administrative Information
    if hasattr(inspection_form, 'administrative_info'):
        admin_info = inspection_form.administrative_info
        story.append(Paragraph("ADMINISTRATIVE INFORMATION", header_style))
        
        admin_data = [
            ['Name of Broadcaster:', admin_info.name_of_broadcaster or 'N/A'],
            ['P.O. Box:', admin_info.po_box or 'N/A'],
            ['Postal Code:', admin_info.postal_code or 'N/A'],
            ['Town:', admin_info.town or 'N/A'],
            ['Location:', admin_info.location or 'N/A'],
            ['Street:', admin_info.street or 'N/A'],
            ['Phone Number:', admin_info.phone_number or 'N/A'],
        ]
        
        admin_table = Table(admin_data, colWidths=[2.5*inch, 3*inch])
        admin_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(admin_table)
        story.append(Spacer(1, 12))
        
        # General Data subsection
        story.append(Paragraph("GENERAL DATA", subheader_style))
        
        general_data = [
            ['Type of Station:', admin_info.get_station_type_display() if admin_info.station_type else 'N/A'],
            ['Transmitting Site:', admin_info.transmitting_site or 'N/A'],
            ['Longitude:', admin_info.longitude or 'N/A'],
            ['Latitude:', admin_info.latitude or 'N/A'],
            ['Physical Location:', admin_info.physical_location or 'N/A'],
            ['Physical Street:', admin_info.physical_street or 'N/A'],
            ['Physical Area:', admin_info.physical_area or 'N/A'],
            ['Altitude:', f"{admin_info.altitude or 'N/A'} m above sea level"],
            ['Land Owner:', admin_info.land_owner or 'N/A'],
            ['Other Telecoms Operator:', 'Yes' if admin_info.other_telecoms_operator else 'No'],
        ]
        
        if admin_info.other_telecoms_operator and admin_info.other_telecoms_details:
            general_data.append(['Details:', admin_info.other_telecoms_details])
        
        general_table = Table(general_data, colWidths=[2.5*inch, 3*inch])
        general_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(general_table)
        story.append(Spacer(1, 20))
    
    # Tower Information
    if hasattr(inspection_form, 'tower_info'):
        tower_info = inspection_form.tower_info
        story.append(Paragraph("TOWER INFORMATION", header_style))
        
        tower_data = [
            ['Tower Owner:', tower_info.tower_owner or 'N/A'],
            ['Tower Height:', f"{tower_info.tower_height or 'N/A'} m"],
            ['Tower above Building:', 'Yes' if tower_info.tower_above_building else 'No'],
        ]
        
        if tower_info.tower_above_building and tower_info.building_height:
            tower_data.append(['Building Height:', f"{tower_info.building_height} m"])
        
        tower_type = 'N/A'
        if tower_info.tower_type:
            if tower_info.tower_type == 'OTHER' and tower_info.tower_type_other:
                tower_type = f'Other: {tower_info.tower_type_other}'
            else:
                tower_type = tower_info.get_tower_type_display()
        
        tower_data.extend([
            ['Tower Type:', tower_type],
            ['Rust Protection:', tower_info.get_rust_protection_display() if tower_info.rust_protection else 'N/A'],
            ['Installation Year:', str(tower_info.installation_year) if tower_info.installation_year else 'N/A'],
            ['Manufacturer:', tower_info.manufacturer or 'N/A'],
            ['Model Number:', tower_info.model_number or 'N/A'],
            ['Max Wind Load:', f"{tower_info.max_wind_load or 'N/A'} km/h"],
            ['Max Load Charge:', f"{tower_info.max_load_charge or 'N/A'} kg"],
            ['Is Insured:', 'Yes' if tower_info.is_insured else 'No'],
        ])
        
        if tower_info.is_insured and tower_info.insurer_name:
            tower_data.append(['Insurer Name:', tower_info.insurer_name])
        
        tower_data.extend([
            ['Concrete Base:', 'Yes' if tower_info.concrete_base else 'No'],
            ['Lightning Protection:', 'Yes' if tower_info.lightning_protection else 'No'],
            ['Electrically Grounded:', 'Yes' if tower_info.electrically_grounded else 'No'],
            ['Aviation Warning Light:', 'Yes' if tower_info.aviation_warning_light else 'No'],
            ['Other Antennas:', 'Yes' if tower_info.other_antennas else 'No'],
        ])
        
        if tower_info.other_antennas and tower_info.other_antennas_details:
            tower_data.append(['Other Antennas Details:', tower_info.other_antennas_details])
        
        tower_table = Table(tower_data, colWidths=[2.5*inch, 3*inch])
        tower_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(tower_table)
        story.append(Spacer(1, 20))
    
    # Transmitter Information
    if hasattr(inspection_form, 'transmitter_info'):
        transmitter_info = inspection_form.transmitter_info
        story.append(Paragraph("TRANSMITTER INFORMATION", header_style))
        
        # Exciter Section
        story.append(Paragraph("A. EXCITER", subheader_style))
        exciter_data = [
            ['Manufacturer:', transmitter_info.exciter_manufacturer or 'N/A'],
            ['Model Number:', transmitter_info.exciter_model_number or 'N/A'],
            ['Serial Number:', transmitter_info.exciter_serial_number or 'N/A'],
            ['Nominal Power (W):', str(transmitter_info.exciter_nominal_power) if transmitter_info.exciter_nominal_power is not None else 'N/A'],
            ['Actual Reading:', str(transmitter_info.exciter_actual_reading) if transmitter_info.exciter_actual_reading is not None else 'N/A'],
        ]
        
        exciter_table = Table(exciter_data, colWidths=[2.5*inch, 3*inch])
        exciter_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(exciter_table)
        story.append(Spacer(1, 12))
        
        # Amplifier Section
        story.append(Paragraph("B. AMPLIFIER", subheader_style))
        amplifier_data = [
            ['Manufacturer:', transmitter_info.amplifier_manufacturer or 'N/A'],
            ['Model Number:', transmitter_info.amplifier_model_number or 'N/A'],
            ['Serial Number:', transmitter_info.amplifier_serial_number or 'N/A'],
            ['Nominal Power (W):', str(transmitter_info.amplifier_nominal_power) if transmitter_info.amplifier_nominal_power is not None else 'N/A'],
            ['Actual Reading:', str(transmitter_info.amplifier_actual_reading) if transmitter_info.amplifier_actual_reading is not None else 'N/A'],
            ['RF Output Connector Type:', transmitter_info.rf_output_type or 'N/A'],
            ['Frequency Range:', transmitter_info.frequency_range or 'N/A'],
            ['Transmit Frequency:', transmitter_info.transmit_frequency or 'N/A'],
            ['Frequency Stability (ppm):', transmitter_info.frequency_stability or 'N/A'],
            ['Harmonics Suppression Level (dB):', str(transmitter_info.harmonics_suppression_level) if transmitter_info.harmonics_suppression_level is not None else 'N/A'],
            ['Spurious Emission Level (dB):', str(transmitter_info.spurious_emission_level) if transmitter_info.spurious_emission_level is not None else 'N/A'],
            ['Internal Audio Limiter:', 'Yes' if transmitter_info.internal_audio_limiter else 'No'],
            ['Internal Stereo Coder:', 'Yes' if transmitter_info.internal_stereo_coder else 'No'],
            ['Transmit Bandwidth (-26dB):', transmitter_info.transmit_bandwidth or 'N/A'],
        ]
        
        amplifier_table = Table(amplifier_data, colWidths=[2.5*inch, 3*inch])
        amplifier_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(amplifier_table)
        story.append(Spacer(1, 20))
    
    # Filter Information
    if hasattr(inspection_form, 'filter_info'):
        filter_info = inspection_form.filter_info
        story.append(Paragraph("FILTER", header_style))
        
        filter_data = [
            ['Type:', filter_info.get_filter_type_display() if filter_info.filter_type else 'N/A'],
            ['Manufacturer:', filter_info.manufacturer or 'N/A'],
            ['Model Number:', filter_info.model_number or 'N/A'],
            ['Serial Number:', filter_info.serial_number or 'N/A'],
            ['Frequency:', filter_info.frequency or 'N/A'],
        ]
        
        filter_table = Table(filter_data, colWidths=[2.5*inch, 3*inch])
        filter_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(filter_table)
        story.append(Spacer(1, 20))
    
    # Antenna System
    if hasattr(inspection_form, 'antenna_system'):
        antenna_system = inspection_form.antenna_system
        story.append(Paragraph("ANTENNA SYSTEM", header_style))
        
        antenna_data = [
            ['Height on Tower/Mast (m):', str(antenna_system.height) if antenna_system.height is not None else 'N/A'],
            ['Type of Antenna:', antenna_system.antenna_type or 'N/A'],
            ['Antenna Manufacturer:', antenna_system.manufacturer or 'N/A'],
            ['Antenna Model Number:', antenna_system.model_number or 'N/A'],
            ['Polarization:', antenna_system.get_polarization_display() if antenna_system.polarization else 'N/A'],
        ]
        
        antenna_table = Table(antenna_data, colWidths=[2.5*inch, 3*inch])
        antenna_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(antenna_table)
        story.append(Spacer(1, 12))
        
        # Horizontal Pattern
        story.append(Paragraph("HORIZONTAL PATTERN", subheader_style))
        horizontal_data = [
            ['Pattern Type:', antenna_system.get_horizontal_pattern_display() if antenna_system.horizontal_pattern else 'N/A'],
            ['Beam width at -3 dB Level:', antenna_system.beam_width_3db or 'N/A'],
            ['Degrees azimuth for max gain:', antenna_system.degrees_azimuth or 'N/A'],
        ]
        
        horizontal_table = Table(horizontal_data, colWidths=[2.5*inch, 3*inch])
        horizontal_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(horizontal_table)
        story.append(Spacer(1, 12))
        
        # Vertical Pattern
        story.append(Paragraph("VERTICAL PATTERN", subheader_style))
        vertical_data = [
            ['Mechanical tilt?:', 'Yes' if antenna_system.mechanical_tilt else 'No'],
        ]
        
        if antenna_system.mechanical_tilt and antenna_system.mechanical_tilt_degree:
            vertical_data.append(['Degree of Mechanical Tilt:', antenna_system.mechanical_tilt_degree])
        
        vertical_data.append(['Electrical tilt?:', 'Yes' if antenna_system.electrical_tilt else 'No'])
        
        if antenna_system.electrical_tilt and antenna_system.electrical_tilt_degree:
            vertical_data.append(['Degree of Electrical Tilt:', antenna_system.electrical_tilt_degree])
        
        vertical_data.append(['Null fill?:', 'Yes' if antenna_system.null_fill else 'No'])
        
        if antenna_system.null_fill and antenna_system.null_fill_percentage:
            vertical_data.append(['Percentage of filling:', antenna_system.null_fill_percentage])
        
        vertical_table = Table(vertical_data, colWidths=[2.5*inch, 3*inch])
        vertical_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(vertical_table)
        story.append(Spacer(1, 12))
        
        # Additional Antenna Information
        additional_data = [
            ['Gain of Antenna System:', antenna_system.antenna_system_gain or 'N/A'],
            ['Estimated antenna losses (dB):', str(antenna_system.estimated_antenna_losses) if antenna_system.estimated_antenna_losses is not None else 'N/A'],
            ['Estimated feeder losses (dB):', str(antenna_system.estimated_feeder_losses) if antenna_system.estimated_feeder_losses is not None else 'N/A'],
            ['Estimated multiplexer losses (dB):', str(antenna_system.estimated_multiplexer_losses) if antenna_system.estimated_multiplexer_losses is not None else 'N/A'],
            ['Effective Radiated Power (kW):', str(antenna_system.effective_radiated_power) if antenna_system.effective_radiated_power is not None else 'N/A'],
        ]
        
        additional_table = Table(additional_data, colWidths=[2.5*inch, 3*inch])
        additional_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(additional_table)
        story.append(Spacer(1, 20))
    
    # Studio to Transmitter Link
    if hasattr(inspection_form, 'stl'):
        stl = inspection_form.stl
        story.append(Paragraph("STUDIO TO TRANSMITTER LINK", header_style))
        
        stl_data = [
            ['Manufacturer:', stl.manufacturer or 'N/A'],
            ['Model Number:', stl.model_number or 'N/A'],
            ['Serial Number:', stl.serial_number or 'N/A'],
            ['Frequency (MHz):', str(stl.frequency) if stl.frequency is not None else 'N/A'],
            ['Polarization:', stl.polarization or 'N/A'],
            ['Description of Signal Reception:', stl.signal_description or 'N/A'],
        ]
        
        stl_table = Table(stl_data, colWidths=[2.5*inch, 3*inch])
        stl_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(stl_table)
        story.append(Spacer(1, 20))
    
    # Other Information
    if hasattr(inspection_form, 'other_information'):
        other_info = inspection_form.other_information
        story.append(Paragraph("OTHER INFORMATION", header_style))
        
        other_data = [
            ['Observations:', other_info.observations or 'N/A'],
            ['Technical Personnel Name:', other_info.technical_personnel_name or 'N/A'],
            ['Contact Person Name:', other_info.contact_name or 'N/A'],
            ['Contact Email:', other_info.contact_email or 'N/A'],
            ['Contact Phone:', other_info.contact_tel or 'N/A'],
            ['Contact Date:', other_info.contact_date.strftime('%Y-%m-%d') if other_info.contact_date else 'N/A'],
        ]
        
        other_table = Table(other_data, colWidths=[2.5*inch, 3*inch])
        other_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(other_table)
        story.append(Spacer(1, 20))
    
    # CA Personnel
    story.append(Paragraph("CA INSPECTION PERSONNEL", header_style))
    
    ca_personnel = inspection_form.ca_personnel.all() if hasattr(inspection_form, 'ca_personnel') else []
    
    if ca_personnel:
        personnel_data = []
        for i, personnel in enumerate(ca_personnel):
            personnel_data.extend([
                [f'Inspector {i+1} Name:', personnel.name if personnel.name else 'N/A'],
                [f'Inspector {i+1} Date:', personnel.date.strftime('%Y-%m-%d') if personnel.date else 'N/A'],
            ])
        
        personnel_table = Table(personnel_data, colWidths=[2.5*inch, 3*inch])
        personnel_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (0, -1), colors.lightgrey),
            ('TEXTCOLOR', (0, 0), (-1, -1), colors.black),
            ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
            ('FONTNAME', (0, 0), (-1, -1), 'Helvetica'),
            ('FONTSIZE', (0, 0), (-1, -1), 9),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 8),
            ('GRID', (0, 0), (-1, -1), 1, colors.black)
        ]))
        
        story.append(personnel_table)
    else:
        story.append(Paragraph("No CA Personnel data available", normal_style))
    
    # Build the PDF
    doc.build(story)
    
    # Get the value of the BytesIO buffer and return it
    pdf_data = buffer.getvalue()
    buffer.close()
    
    return pdf_data


def generate_inspection_form_response(inspection_form):
    """Generate HTTP response with PDF version of the inspection form"""
    pdf_data = generate_inspection_form_pdf(inspection_form)
    
    # Create an HTTP response with the PDF file
    filename = f"inspection_form_{inspection_form.id}.pdf"
    response = HttpResponse(pdf_data, content_type='application/pdf')
    response['Content-Disposition'] = f'attachment; filename="{filename}"'
    
    return response