#!/bin/bash

# TV Inspection Form Data Population Script
BASE_URL="http://localhost:8000"
USERNAME="nyandieka"
PASSWORD="Sayona"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}TV Inspection Form Data Population Script${NC}"
echo "============================================="

# Get JWT token
echo -e "${YELLOW}Getting authentication token...${NC}"
TOKEN_RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"$USERNAME\",\"password\":\"$PASSWORD\"}" \
  "${BASE_URL}/api/auth/token/")

ACCESS_TOKEN=$(echo "$TOKEN_RESPONSE" | python3 -c "import sys, json; print(json.load(sys.stdin)['access'])" 2>/dev/null)

if [ -z "$ACCESS_TOKEN" ]; then
    echo -e "${RED}Failed to get token${NC}"
    echo "Response: $TOKEN_RESPONSE"
    exit 1
fi

echo -e "${GREEN}✓ Authentication successful${NC}"

# Form data
CURRENT_DATE=$(date +"%Y-%m-%d")
FORM_DATA='{
  "administrative_info": {
    "name_of_broadcaster": "Nairobi Broadcasting Network",
    "po_box": "12345",
    "postal_code": "00100",
    "town": "Nairobi",
    "location": "Westlands",
    "street": "Waiyaki Way",
    "phone_number": "+254-20-1234567",
    "station_type": "TV",
    "transmitting_site": "Ngong Hills Transmitter Site",
    "longitude": "36° 45'\'' 30'\'' E",
    "latitude": "1° 17'\'' 30'\'' S",
    "physical_location": "Ngong Hills",
    "physical_street": "Transmitter Road",
    "physical_area": "Kajiado County",
    "altitude": 2460.5,
    "land_owner": "Kenya Broadcasting Corporation",
    "other_telecoms_operator": true,
    "other_telecoms_details": "Safaricom tower sharing agreement"
  },
  "tower_info": {
    "tower_owner": "Kenya Broadcasting Corporation",
    "tower_height": 120.0,
    "tower_above_building": false,
    "building_height": 0.0,
    "tower_type": "GUYED",
    "rust_protection": "GALVANIZED",
    "installation_year": 2018,
    "manufacturer": "Rohn Products LLC",
    "model_number": "ROHN-45G",
    "max_wind_load": 150.0,
    "max_load_charge": 2500.0,
    "is_insured": true,
    "insurer_name": "East Africa Insurance Company",
    "concrete_base": true,
    "lightning_protection": true,
    "electrically_grounded": true,
    "aviation_warning_light": true,
    "other_antennas": true,
    "other_antennas_details": "FM radio antenna at 80m height"
  },
  "transmitter_info": {
    "exciter_manufacturer": "Rohde & Schwarz",
    "exciter_model_number": "THU9-EX",
    "exciter_serial_number": "RS-2024-001",
    "exciter_nominal_power": 50.0,
    "exciter_actual_reading": 48.5,
    "amplifier_manufacturer": "Rohde & Schwarz",
    "amplifier_model_number": "THU9-AMP",
    "amplifier_serial_number": "RS-2024-002",
    "amplifier_nominal_power": 1000.0,
    "amplifier_actual_reading": 985.0,
    "rf_output_type": "50 Ohm N-Type",
    "frequency_range": "470-790 MHz",
    "transmit_frequency": "Channel 25 (518 MHz)",
    "frequency_stability": "±0.1 ppm",
    "harmonics_suppression_level": 60.0,
    "spurious_emission_level": 70.0,
    "internal_audio_limiter": true,
    "internal_stereo_coder": true,
    "transmitter_catalog": "DVB-T/DVB-T2 compliant transmitter",
    "transmit_bandwidth": "8 MHz (-26dB)"
  },
  "filter_info": {
    "filter_type": "BAND_PASS",
    "manufacturer": "Kathrein",
    "model_number": "BPF-UHF-8M",
    "serial_number": "KAT-2024-001",
    "frequency": "Channel 25 (518 MHz)"
  },
  "antenna_system": {
    "height": 115.0,
    "antenna_type": "Panel Array",
    "manufacturer": "Kathrein",
    "model_number": "K739273",
    "polarization": "HORIZONTAL",
    "horizontal_pattern": "OMNI",
    "beam_width_3db": "360°",
    "degrees_azimuth": "0°",
    "table_azimuth_horizontal": "Horizontal pattern data",
    "mechanical_tilt": true,
    "electrical_tilt": false,
    "null_fill": false,
    "mechanical_tilt_degree": "-2°",
    "table_azimuth_vertical": "Vertical pattern data",
    "antenna_system_gain": "12 dBi",
    "estimated_antenna_losses": 0.5,
    "estimated_feeder_losses": 1.2,
    "estimated_multiplexer_losses": 0.8,
    "effective_radiated_power": 8.5,
    "antenna_catalog": "Kathrein K739273 specifications"
  },
  "stl": {
    "manufacturer": "Motorola",
    "model_number": "PTP820S",
    "serial_number": "MOT-STL-2024-001",
    "frequency": 7125.0,
    "polarization": "Vertical",
    "signal_description": "Digital microwave link"
  },
  "other_information": {
    "observations": "All equipment functioning normally",
    "technical_personnel_name": "John Kamau",
    "contact_name": "Mary Wanjiku",
    "contact_address": "P.O. Box 12345, Nairobi",
    "contact_tel": "+254-722-123456",
    "contact_email": "mary.wanjiku@nbn.co.ke",
    "contact_signature": "Mary Wanjiku - Technical Manager",
    "contact_date": "'${CURRENT_DATE}'"
  },
  "ca_personnel": [
    {
      "name": "Peter Ochieng",
      "signature": "P. Ochieng - CA Inspector",
      "date": "'${CURRENT_DATE}'"
    }
  ]
}'

echo -e "${YELLOW}Submitting form data...${NC}"

# Submit with token
RESPONSE=$(curl -s -X POST \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -d "$FORM_DATA" \
  "${BASE_URL}/api/submit-form/")

echo -e "${GREEN}Response:${NC}"
echo "$RESPONSE" | python3 -m json.tool 2>/dev/null || echo "$RESPONSE"

echo -e "${GREEN}Done!${NC}"