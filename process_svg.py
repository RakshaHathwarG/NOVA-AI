
import xml.etree.ElementTree as ET

# Register namespace for SVG
ET.register_namespace('', 'http://www.w3.org/2000/svg')

# Parse the SVG file
tree = ET.parse('src/assets/avatars/aria.svg')
root = tree.getroot()

# Find the character group (id starts with "freepik--Character")
character_group = None
for child in root:
    if 'id' in child.attrib and child.attrib['id'].startswith('freepik--Character'):
        character_group = child
        break

# Remove all children except the character group
for child in list(root):
    if child is not character_group:
        root.remove(child)

# Save the new SVG
tree.write('src/assets/avatars/Aria.svg', xml_declaration=True)

print("Successfully created Aria.svg with just the character!")
