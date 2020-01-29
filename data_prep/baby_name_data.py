"""
Get baby names data from NISRA website and tidy it up
"""

import os
import requests

import pandas as pd
import numpy as np

URL = "https://www.nisra.gov.uk/sites/nisra.gov.uk/files/publications/Full_Name_List_9718.xlsx"
RAWFILENAME = "../data/raw/Full_Name_List_9718.xlsx"


def get_xlsx():
    """Download baby names and save if not already there"""
    if os.path.exists(RAWFILENAME):
        return
    resp = requests.get(URL)
    with open(RAWFILENAME, 'wb') as output:
        output.write(resp.content)


def fix_year(year, gender):
    """Clean up a single year"""
    clean_year = year.dropna(how='all').copy()
    clean_year.columns = clean_year.iloc[1]
    clean_year.loc[:, 'year'] = clean_year.iloc[0, 0]
    clean_year.loc[:, 'gender'] = gender
    clean_year = clean_year.iloc[2:].copy()
    clean_year = clean_year.replace('..', np.nan)
    return clean_year


def clean_sheet(sheet, gender):
    """Converts a sheet to tidy data"""
    splits = [x * 3 for x in range(sheet.shape[1] // 3)]
    years = [sheet.iloc[:, i:i+3].copy() for i in splits]
    clean_years = pd.concat([fix_year(y, gender) for y in years], ignore_index=True)
    clean_years = clean_years[clean_years['Rank'] <= 100.0].pivot_table(values='Rank', index='year', columns='Name')
    return clean_years


def clean_data():
    """Clean baby names data"""
    boys = pd.read_excel(RAWFILENAME, sheet_name=1, skiprows=1)
    girls = pd.read_excel(RAWFILENAME, sheet_name=2, skiprows=1)
    boys = clean_sheet(boys, 'm')
    girls = clean_sheet(girls, 'f')

    if not os.path.exists('../data/boy_names.json'):
        boys.to_json('../data/boy_names.json', orient='columns')
    if not os.path.exists('../data/girl_names.json'):
        girls.to_json('../data/girl_names.json', orient='columns')


def main():
    """Download baby names"""
    get_xlsx()
    clean_data()


if __name__ == "__main__":
    main()
