# Seismogram Data Management Platform

Seismologists often struggle to access analog seismic data, especially when such records aren’t already available within their own research communities.  Many of these records are stored on microfilm or paper, making them difficult to digitize and integrate into modern research workflows.
As part of the Metropolitan Chicago Data-science Corps (MCDC), our team is addressing this challenge by developing a centralized digital database that streamlines the process of converting and managing historical seismic data.
This effort will be further enhanced through integration with SKATE, a tool capable of extracting metadata from images, with the goal of improving the accuracy and efficiency of converting analog records into standardized digital formats.

Our initial data collection efforts will focus on archives housed at Northwestern University and University of California, Davis, with plans to subsequently incorporate materials from other institutions and other relevant repositories.

---
## Background

Our database schema adheres to FOLDS (Federation of Online Legacy Data in Seismology), a standardized framework designed to acquire, manage, and distribute metadata and digital versions of legacy seismic data.  
Following the 2021 meeting of the International Association of Seismology and Physics of the Earth’s Interior (IASPEI), held under the International Union of Geodesy and Geophysics (IUGG), a Proposal Review Team was formed. 
This team included representatives from the Institute of Geophysical Research, University of Colorado Boulder, and Institut Cartogràfic i Geològic de Catalunya, and identified 18 required, 21 recommended, and 12 optional metadata elements.
The FOLDS framework was introduced to our team through a presentation by Tim Ahern (EarthScope Emeritus) and Lorraine Hwang (UC Davis). With FOLDS as our guiding standard, we have iteratively designed our database schema over the past four weeks, incorporating feedback from Professor Susan van der Lee and Lucas Schribel, as well as external input from Ahern and Hwang.
These efforts ensure our metadata structure is fully aligned with FOLDS and compatible with worldwide standardized frameworks.

---
## Current Implementation

Our system consists of:
- **Backend:** Implemented using [Supabase.io](https://supabase.com), providing:
  - A PostgreSQL relational database
- **Frontend:** Hosted on GitHub Pages and developed with:
  - HTML for structure
  - CSS for styling
  - JavaScript to connect the interface with the Supabase backend via API calls

---
## Features
- Metadata input form for submitting seismogram records following FOLDS standards
- Table viewer from database
- Interactive data viewer for managing existing records  
- Searchable database for locating records by metadata fields  

---
## Form
Site:
[https://elisaduan2005.github.io/supabase-form/](https://elisaduan2005.github.io/supabase-form/)

