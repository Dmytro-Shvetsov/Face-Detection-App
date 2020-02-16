import os
import glob
import pandas as pd
import xml.etree.ElementTree as ET


def xml_to_csv(path):
    xml_list = []
    for xml_file in glob.glob(path + '/*.xml'):
        tree = ET.parse(xml_file)
        root = tree.getroot()
        for member in root.findall('object'):
            width, height = root.find('size')[0], root.find('size')[1]
            label = member[0].text
            prefix = [root.find('filename').text,
                     float(width.text),
                     float(height.text),
                     label
                     ]
            for bndbox in member[4:]:
                box_coords = [
                    float(bndbox[0].text),
                    float(bndbox[1].text),
                    float(bndbox[2].text),
                    float(bndbox[3].text)
                    ]
                xml_list.append(prefix + box_coords)

            
    column_name = ['filename', 'width', 'height', 'class', 'xmin', 'ymin', 'xmax', 'ymax']
    xml_df = pd.DataFrame(xml_list, columns=column_name)
    return xml_df


if __name__ == '__main__':
    for directory in ['train', 'test']:
      image_path = './images/{}'.format(directory)
      xml_df = xml_to_csv(image_path)
      xml_df.to_csv('./label_map/{}_labels.csv'.format(directory), index=None)

    print('Successfully converted xml to csv.')