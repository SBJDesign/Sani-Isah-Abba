import type { Photo, Post, Profile, Project, Publication } from './types'

const img = (name: string) => `${import.meta.env.BASE_URL}gallery/${name}.jpg`

// Starter content, taken from Dr. Abba's 2026 CV. Everything here is editable from /admin.

export const seedProfile: Profile = {
  name: 'Sani Isah Abba',
  honorific: 'Dr.',
  title: 'Assistant Professor of Civil Engineering',
  affiliation: 'Department of Civil Engineering, Prince Mohammad Bin Fahd University, Saudi Arabia',
  location: 'Al Khobar, Saudi Arabia, and Kano, Nigeria',
  headline:
    'I combine artificial intelligence, fieldwork and numerical simulation to protect scarce water: tracking groundwater and pollution, and making treatment and desalination cleaner and more efficient.',
  bio: `Sani Isah Abba is an Assistant Professor in the Department of Civil Engineering at Prince Mohammad Bin Fahd University, Saudi Arabia. His work explores new methods in water resources and environmental engineering, combining artificial intelligence, optimisation algorithms, fieldwork and numerical simulation to support sustainable development and healthier, more resilient environments.

Before joining PMU in 2024, he held an Assistant Professor-rank postdoctoral fellowship at the Interdisciplinary Research Center for Membranes and Water Security, King Fahd University of Petroleum and Minerals (2021–2024), and was a Senior Lecturer at Baze University, Abuja (2020–2024), where he led artificial intelligence research in the Faculty of Engineering. Earlier, he spent seven years as a Senior Civil Engineer at Northwest University, Kano.

He holds a Ph.D. in Water Resources and Environmental Engineering from Near East University, Cyprus, a Master of Engineering in Water and Environmental Engineering from Sharda University, India, and a Bachelor of Engineering in Civil Engineering from Bayero University Kano.

Elsevier and Stanford University have listed him among the world's top 2% of scientists every year since 2022, and Nigeria's Federal Ministry of Communications, Innovation and Digital Economy named him among the country's top 100 AI researchers. He serves as an editor for Scientific Reports, as Editor-in-Chief of the Techno-computing Journal, and as a reviewer for more than 50 international journals.`,
  email: 'sabba@pmu.edu.sa',
  photo_url: img('profile'),
  interests: [
    'AI, machine learning and optimisation algorithms',
    'Water quality and hydrology',
    'Groundwater modelling and simulation',
    'Water and wastewater treatment plant modelling',
    'Water–energy nexus and sustainable development',
    'Environmental sustainability and pollution control',
  ],
  stats: [
    { label: "World's top 2% scientists, Stanford–Elsevier", value: '2022–2025' },
    { label: 'Nigerian AI researchers, Federal Ministry of Communications', value: 'Top 100' },
    { label: 'International journals served as reviewer', value: '50+' },
  ],
  education: [
    { degree: 'Ph.D., Water Resources and Environmental Engineering', institution: 'Near East University, Cyprus', year: '2019' },
    { degree: 'M.Eng., Water and Environmental Engineering', institution: 'Sharda University, India', year: '2016' },
    { degree: 'B.Eng., Civil Engineering', institution: 'Bayero University Kano, Nigeria', year: '2011' },
  ],
  appointments: [
    { role: 'Assistant Professor, Civil Engineering', institution: 'Prince Mohammad Bin Fahd University, Saudi Arabia', period: '2024–present' },
    { role: 'Postdoctoral Fellow (Assistant Professor rank)', institution: 'IRC for Membranes and Water Security, KFUPM, Saudi Arabia', period: '2021–2024' },
    { role: 'Senior Lecturer', institution: 'Baze University, Abuja, Nigeria', period: '2020–2024' },
    { role: 'Senior Civil Engineer', institution: 'Northwest University, Kano, Nigeria', period: '2013–2020' },
    { role: 'Part-time Lecturer, Civil Engineering', institution: 'School of Technology, Kano', period: '2012–2013' },
  ],
  links: [
    { label: 'ORCID', url: 'https://orcid.org/0000-0001-9356-2798' },
    { label: 'Scopus', url: 'https://www.scopus.com/authid/detail.uri?authorId=57208942739' },
    { label: 'PMU faculty page', url: 'https://faculty.pmu.edu.sa/PMUFaculties/Details/sabba' },
  ],
  sections: [
    {
      title: 'Honours and awards',
      items: [
        "World's top 2% scientists, Elsevier and Stanford University (2022, 2023, 2024 and 2025)",
        'Among the top 100 Nigerian AI researchers, Federal Ministry of Communications, Innovation and Digital Economy',
        'Best paper award, 2nd International Conference on Science, Technology and Management, University of Delhi (2015)',
        'Kano State Government scholarships for postgraduate study (2013–2014 and 2016–2020)',
        'Near East University scholarship (2016–2020)',
      ],
    },
    {
      title: 'Patents',
      items: [
        'Sustainable brine treatment system and process. U.S. Patent No. 12,275,654 (15 April 2025)',
        'Desalination and crystallization system operating without brine. U.S. Patent Application 19/075,076, filed 12 February 2026',
        'One-Click Geo-AI Automatic for LMS (submitted)',
      ],
    },
    {
      title: 'Editorial roles',
      items: [
        'Editor, Scientific Reports (Springer Nature)',
        'Editor-in-Chief, Techno-computing Journal (TECOJ)',
        'Guest editor: Water (MDPI), Processes (MDPI), Discover Applied Sciences, Journal of the Brazilian Society of Mechanical Sciences and Engineering, and RIMNI',
        'Editor, Springer book "Application of Machine Learning in Chemical and Process Industries"',
        'Editorial board member: Knowledge-Based Engineering and Sciences, Journal of Statistical Sciences and Computational Intelligence, Journal of Data Science and Intelligent Systems, and others',
        'Reviewer for more than 50 international journals (Elsevier, Springer, Wiley, Taylor & Francis, MDPI, IEEE and others)',
      ],
    },
    {
      title: 'Grant review and committees',
      items: [
        'Research grant reviewer, Qatar University Research Support Grant Scheme (2023–present)',
        "Committee member and reviewer, Nigeria's Artificial Intelligence Research Grant Scheme (2023–present)",
        'Committee member, National Artificial Intelligence Strategy, Nigeria (2024)',
        'Grant reviewer, KFUPM IRC-MWS internal projects (2024–present)',
        'Committee member and grant reviewer, PMU Research Grants for Humanitarian Development',
        'Scientific committee, 10th International Conference on Computational Mathematics and Engineering Sciences, Istanbul (2026)',
      ],
    },
    {
      title: 'Teaching and supervision',
      items: [
        'Undergraduate: Engineering Hydrology, Hydraulics, Groundwater Resources and Management, Environmental Engineering, Computational Methods, Soft Computing in Civil Engineering, Environmental Modelling and Simulation',
        'Postgraduate: Water Treatment and Supply; Contaminant Transport and Water Quality',
        'Supervised 15 undergraduate, 2 master\'s and 1 doctoral student',
      ],
    },
    {
      title: 'Professional memberships',
      items: [
        'Council for the Regulation of Engineering in Nigeria (COREN)',
        'Nigerian Society of Engineers (NSE)',
        'American Society of Civil Engineers (ASCE)',
        'International Association of Engineers (IAENG)',
        'Society of Environmental Toxicology and Chemistry (SETAC)',
      ],
    },
  ],
}

export const seedPublications: Publication[] = [
  {"id": "cv-01", "title": "Experimental and nature-inspired modeling of lipid accumulation in microalgal biomass for biofuel production", "authors": "Abba, S. I., Chowdhury, S. R., Usman, A. G., & Razzak, S. A.", "venue": "Biomass and Bioenergy, 212, 109255", "year": 2026, "type": "journal", "keywords": ["bioenergy", "metaheuristics"], "featured": true},
  {"id": "cv-02", "title": "Reliability insights and optimization strategies for groundwater resource management in coastal aquifers of Saudi Arabia", "authors": "Aldrees, A., Jibrin, A. M., Dan’azumi, S., & Abba, S. I.", "venue": "Alexandria Engineering Journal, 141, 138–149", "year": 2026, "type": "journal", "keywords": ["groundwater"]},
  {"id": "cv-03", "title": "Synthetic data-driven explainable machine learning for groundwater salinity prediction in the Al-Qatif coastal aquifer of Saudi Arabia", "authors": "Aldrees, A., Jibrin, A. M., Dan’azumi, S., Al-Suwaiyan, M., Abba, S. I., & Yaseen, Z. M.", "venue": "Journal of Hydrology: Regional Studies, 64, 103258", "year": 2026, "type": "journal", "keywords": ["explainable AI", "groundwater", "machine learning", "salinity"]},
  {"id": "cv-04", "title": "Metal–Polyphenol-Complexed Titania Nanosheet Interlayered Nanofiltration Membranes for Efficient Desalination", "authors": "Yogarathinam, L. T., Baig, N., Abba, S. I., Usman, J., Younas, H., & Aljundi, I. H.", "venue": "ACS ES&T Water", "year": 2026, "type": "journal", "keywords": ["desalination", "membranes", "salinity"]},
  {"id": "cv-05", "title": "Deep learning modeling of kaolin-activated carbon (derived from cigarette waste) hybrid ceramic membrane performance for wastewater treatment applications", "authors": "Salhi, B., Usman, J., Abdulazeez, I., Al-Ahmed, A., Jibrin, A. M., Ashraf, M. W., & Abba, S. I.", "venue": "Chemical Engineering Journal: Green and Sustainable, 100024", "year": 2026, "type": "journal", "keywords": ["deep learning", "membranes", "wastewater"]},
  {"id": "cv-06", "title": "Optimizing biomedical waste generation modeling using quantum machine learning and economic development indicators", "authors": "Aliyu, U. U., Mahmoud, I. A., Mati, S., Chaki, S., Sulaiman, T. A., Usman, A. G., & Abba, S. I.", "venue": "Biomass and Bioenergy, 204, 108312", "year": 2026, "type": "journal", "keywords": ["machine learning"]},
  {"id": "cv-07", "title": "Global overview of uncommon microplastics in treated and bottled waters: comparative analysis of their abundance, characteristics, emerging challenges, and future direction", "authors": "Egbueri, J. C., Usman, A. G., Abba, S. I., Arunachalam, K. P., & Agbasi, J. C.", "venue": "Journal of Environmental Chemical Engineering, 121431", "year": 2026, "type": "journal", "keywords": ["microplastics"]},
  {"id": "cv-08", "title": "Optimizing sustainable desalination plants with advanced ML-based uncertainty analysis", "authors": "Abba, S. I., Usman, J., Bafaqeer, A., Salami, B. A., Lawal, Z. K., Lawal, A., ... & Aljundi, I. H.", "venue": "Applied Soft Computing, 169, 112624", "year": 2025, "type": "journal", "keywords": ["desalination", "salinity"], "featured": true},
  {"id": "cv-09", "title": "Optimization of extreme learning machine with metaheuristic algorithms for modelling water quality parameters of Tamburawa water treatment plant in Nigeria", "authors": "Abba, S. I., Pham, Q. B., Malik, A., Costache, R., Gaya, M. S., Abdullahi, J., ... & Saini, G.", "venue": "Water Resources Management, 39(3), 1377–1401", "year": 2025, "type": "journal", "keywords": ["metaheuristics", "water quality"], "featured": true},
  {"id": "cv-10", "title": "New perspective on density-based spatial clustering of applications with noise for groundwater assessment", "authors": "Jibrin, A. M., Al-Suwaiyan, M., Yaseen, Z. M., & Abba, S. I.", "venue": "Journal of Hydrology, 133566", "year": 2025, "type": "journal", "keywords": ["groundwater"]},
  {"id": "cv-11", "title": "Trace element pollution tracking in the complex multi-aquifer groundwater system of Al-Hassa oasis (Saudi Arabia) using spatial, chemometric and index-based techniques", "authors": "Abba, S. I., Mohamed A. Yassin, Syed Muzzamil Hussain Shah, Johnbosco C. Egbueri, Hussam Eldin Elzain, Johnson C. Agbasi, Gaurav Saini, Jamilu Usman, Nadeem A. Khan, and Isam H. Aljundi", "venue": "Environmental Research, 118320", "year": 2024, "type": "journal", "keywords": ["groundwater", "pollution"]},
  {"id": "cv-12", "title": "Nitrate concentrations tracking from multi-aquifer groundwater vulnerability zones: Insight from machine learning and spatial mapping", "authors": "Abba, S. I., Mohamed A. Yassin, Mahmud M. Jibril, Bassam Tawabini, Pantelis Soupios, Abid Khogali, Syed Muzzamil Hussain Shah, Jamilu Usman, and Isam H. Aljundi", "venue": "Process Safety and Environmental Protection", "year": 2024, "type": "journal", "keywords": ["groundwater", "machine learning", "water quality"]},
  {"id": "cv-13", "title": "Flood subsidence susceptibility mapping using persistent scatterer SAR interferometry technique coupled with novel metaheuristic approaches from Jeddah, Saudi Arabia", "authors": "Abba, Sani I., Ahmed M. Al-Areeq, Mustafa Ghaleb, Atef Q. Kawara, and Seyed Vahid Razavi-Termeh", "venue": "Neural Computing and Applications, 1–20", "year": 2024, "type": "journal", "keywords": ["flood", "metaheuristics"]},
  {"id": "cv-14", "title": "Groundwater modelling and GIS-based vulnerability mapping coupled with evolutionary heuristic optimization in the eastern coast of Saudi Arabia", "authors": "Abba, S. I., Benaafi, M., Usman, A. G., Ozsahin, D. U., Tawabini, B., & Aljundi, I. H.", "venue": "Earth Science Informatics", "year": 2024, "type": "journal", "keywords": ["GIS", "groundwater"]},
  {"id": "cv-15", "title": "Enhancing Li+ recovery in brine mining: integrating next-gen emotional AI and explainable ML to predict adsorption energy in crown ether-based hierarchical nanomaterials", "authors": "Abba, Sani I., Jamilu Usman, Ismail Abdulazeez, Lukka Thuyavan Yogarathinam, A. G. Usman, Dahiru Lawal, Billel Salhi, Nadeem Baig, and Isam H. Aljundi", "venue": "RSC Advances, 14(21), 15129–15142", "year": 2024, "type": "journal", "keywords": ["brine", "explainable AI", "lithium recovery"]},
  {"id": "cv-16", "title": "Fluoride and nitrate enrichment in coastal aquifers of the Eastern Province, Saudi Arabia: The influencing factors, toxicity, and human health risks", "authors": "Abba, S. I., Johnbosco C. Egbueri, Mohammed Benaafi, Jamilu Usman, A. G. Usman, and Isam H. Aljundi", "venue": "Chemosphere, 139083", "year": 2023, "type": "journal", "keywords": ["water quality"]},
  {"id": "cv-17", "title": "Intelligent process optimisation based on cutting-edge emotional learning for performance evaluation of NF/RO of seawater desalination plant", "authors": "Abba, S. I., Benaafi, M., & Aljundi, I. H.", "venue": "Desalination, 550, 116376", "year": 2023, "type": "journal", "keywords": ["desalination", "salinity"]},
  {"id": "cv-18", "title": "Mapping of groundwater salinization and modelling using meta-heuristic algorithms for the coastal aquifer of eastern Saudi Arabia", "authors": "Abba, S. I., Benaafi, M., Usman, A. G., Ozsahin, D. U., Tawabini, B., & Aljundi, I. H.", "venue": "Science of The Total Environment, 858, 159697", "year": 2023, "type": "journal", "keywords": ["groundwater", "salinity"], "featured": true},
  {"id": "cv-19", "title": "Sandstone groundwater salinization modelling using physicochemical variables in Southern Saudi Arabia: Application of novel data intelligent algorithms", "authors": "Abba, S. I., Mohammed Benaafi, A. G. Usman, and Isam H. Aljundi", "venue": "Ain Shams Engineering Journal, 101894", "year": 2022, "type": "journal", "keywords": ["groundwater", "salinity"]},
  {"id": "cv-20", "title": "Integrated Modeling of Hybrid Nanofiltration/Reverse Osmosis Desalination Plant Using Deep Learning-Based Crow Search Optimization Algorithm", "authors": "Abba, Sani I., Jamilu Usman, Ismail Abdulazeez, Dahiru U. Lawal, Nadeem Baig, A. G. Usman, and Isam H. Aljundi", "venue": "Water, 15(19), 3515", "year": 2023, "type": "journal", "keywords": ["deep learning", "desalination", "membranes", "salinity"]},
  {"id": "cv-21", "title": "Drinking Water Resources Suitability Assessment Based on Pollution Index of Groundwater Using Improved Explainable Artificial Intelligence", "authors": "Abba, Sani I., Mohamed A. Yassin, Auwalu Saleh Mubarak, Syed Muzzamil Hussain Shah, Jamilu Usman, Atheer Y. Oudah, Sujay Raghavendra Naganna, and Isam H. Aljundi", "venue": "Sustainability, 15(21), 15655", "year": 2023, "type": "journal", "keywords": ["explainable AI", "groundwater"]},
  {"id": "cv-22", "title": "Inverse groundwater salinization modeling in a sandstone’s aquifer using stand-alone models with an improved non-linear ensemble machine learning technique", "authors": "Abba, S. I., Mohammed Benaafi, A. G. Usman, and Isam H. Aljundi", "venue": "Journal of King Saud University-Computer and Information Sciences", "year": 2022, "type": "journal", "keywords": ["groundwater", "machine learning", "salinity"]},
  {"id": "cv-23", "title": "Integrating feature extraction approaches with hybrid emotional neural networks for water quality index modeling", "authors": "S.I. Abba, Rabiu Aliyu Abdulkadir, Saad Sh Sammen, Quoc Bao Pham, Abdulmalik Ahmad Lawan, Parvaneh Esmaili, Anurag Malik, and Nadhir Al-Ansari", "venue": "Applied Soft Computing, 114, 108036", "year": 2022, "type": "journal", "keywords": ["neural networks", "water quality"]},
  {"id": "cv-24", "title": "Effluents quality prediction by using nonlinear dynamic block-oriented models: A system identification approach", "authors": "Abba, S. I., Abdulkadir, R. A., Gaya, M. S., Sammen, S. S., Ghali, U., Nawaila, M. B., ... & Al-Ansari, N.", "venue": "Desalination and Water Treatment, 218, 52–62", "year": 2021, "type": "journal", "keywords": []},
  {"id": "cv-25", "title": "Improving novel extreme learning machine using PCA algorithms for multi-parametric modeling of the municipal wastewater treatment plant", "authors": "Abba, S. I., Elkiran, G., & Nourani, V.", "venue": "Desalination and Water Treatment, 215, 414–426", "year": 2021, "type": "journal", "keywords": ["wastewater"]},
  {"id": "cv-26", "title": "Hydrothermal and solvothermal methods", "authors": "J. Usman, M. I. M. Esham, L. T. Yogarathinam, S. I. Abba, et al.", "venue": "Advanced Ceramics for Photocatalytic Membranes (pp. 180–190). Elsevier", "year": 2024, "type": "chapter", "keywords": [], "url": "https://shop.elsevier.com/books/advanced-ceramics-for-photocatalytic-membranes/othman/978-0-323-95418-1"},
  {"id": "cv-27", "title": "Radionuclides as Environmental Contaminants of Concern: Threats to Public Health Through Soil and Groundwater", "authors": "Egbueri, J. C., Agbasi, J. C., Aralu, C. C., Abu, M., Uwajingba, H. C., & Abba, S. I.", "venue": "Sustainable Groundwater and Environment: Challenges and Solutions (pp. 333–364). Cham: Springer Nature Switzerland", "year": 2025, "type": "chapter", "keywords": ["groundwater"]},
  {"id": "cv-28", "title": "Groundwater salinization in coastal regions and the control mechanisms: Insights for sustainable groundwater development and management", "authors": "Agbasi, J. C., Abu, M., Pande, C. B., Uwajingba, H. C., Abba, S. I., & Egbueri, J. C.", "venue": "Sustainable Groundwater and Environment: Challenges and Solutions (pp. 165–191). Cham: Springer Nature Switzerland", "year": 2025, "type": "chapter", "keywords": ["groundwater", "salinity"]},
  {"id": "cv-29", "title": "Lead, Nickel, Arsenic, and Chromium Contamination in Nigerian Groundwater: Sources, Potential Impacts, and Removal Techniques", "authors": "Egbueri, J. C., Agbasi, J. C., Ighalo, J. O., Uwajingba, H. C., & Abba, S. I.", "venue": "Groundwater in Developing Countries: Case Studies from MENA, Asia and West Africa (pp. 327–355). Cham: Springer Nature Switzerland", "year": 2025, "type": "chapter", "keywords": ["groundwater"]},
  {"id": "cv-30", "title": "Groundwater Development Within the Nigerian Crystalline and Sedimentary Aquifers: Challenges and Opportunities", "authors": "Nweke, N. D., Uwajingba, H. C., & Abba, S. I.", "venue": "Groundwater in Developing Countries: Case Studies from MENA, Asia and West Africa (p. 297). Cham: Springer Nature Switzerland", "year": 2025, "type": "chapter", "keywords": ["groundwater"]},
]

export const seedProjects: Project[] = [
  {
    id: 'prj-1',
    title: 'Monitoring heavy-metal pollution and public health hazards in Dammam',
    summary: "A cutting-edge framework for tracking heavy-metal pollution and evaluating health risks across Dammam's residential and industrial zones.",
    status: 'ongoing',
    funder: 'PMU Research Grants for Humanitarian Development (Principal Investigator)',
    start_year: 2025,
    tags: ['heavy metals', 'public health'],
    sort_order: 1,
  },
  {
    id: 'prj-2',
    title: 'Health risks of microplastics in treated wastewater',
    summary: 'A data-driven health-risk assessment of microplastics in treated wastewater from bi-communal cities in Saudi Arabia.',
    status: 'ongoing',
    funder: 'PMU Research Grants for Humanitarian Development (Principal Investigator)',
    start_year: 2025,
    tags: ['microplastics', 'wastewater'],
    sort_order: 2,
  },
  {
    id: 'prj-3',
    title: 'Solar-driven dual-mode membrane distillation unit',
    summary: 'An innovative solar-powered membrane distillation unit with internal gap circulation for desalination.',
    status: 'ongoing',
    funder: 'Research, Development and Innovation Authority (RDIA), Saudi Arabia, with KFUPM IRC-MWS',
    start_year: 2025,
    tags: ['desalination', 'solar energy'],
    sort_order: 3,
  },
  {
    id: 'prj-4',
    title: 'Seawater intrusion in the eastern coastal aquifers of Saudi Arabia',
    summary: 'Hydrochemical, isotopic and hydro-geophysical investigation of groundwater to delineate seawater intrusion (project INMW2202).',
    status: 'completed',
    funder: 'KFUPM (Co-Investigator)',
    end_year: 2024,
    tags: ['groundwater', 'seawater intrusion'],
    sort_order: 4,
  },
  {
    id: 'prj-5',
    title: 'Groundwater in Al-Hassa: monitoring and modelling',
    summary: 'A hydrogeological assessment of groundwater in Al-Hassa, Eastern Province, combining field monitoring with modelling (project INMW2290).',
    status: 'completed',
    funder: 'KFUPM (Co-Investigator)',
    end_year: 2024,
    tags: ['groundwater', 'modelling'],
    sort_order: 5,
  },
  {
    id: 'prj-6',
    title: 'Groundwater salinisation on Tarout Island under climate change',
    summary: 'Causes and impacts of seawater intrusion and salinisation of fresh groundwater on Tarout Island, eastern Saudi Arabia (project INMW2308).',
    status: 'completed',
    funder: 'KFUPM (Co-Investigator)',
    end_year: 2024,
    tags: ['salinity', 'climate change'],
    sort_order: 6,
  },
  {
    id: 'prj-7',
    title: 'Next-generation 2D-material membranes for oily wastewater',
    summary: 'Functionalised and intercalated 2D-material membranes for treating oily wastewater (project INMW2312).',
    status: 'completed',
    funder: 'KFUPM (Co-Investigator)',
    end_year: 2024,
    tags: ['membranes', 'wastewater'],
    sort_order: 7,
  },
  {
    id: 'prj-8',
    title: 'Groundwater contamination and in-situ remediation',
    summary: 'Laboratory experiments and numerical simulations of groundwater contamination and in-situ remediation (project INMW2314).',
    status: 'completed',
    funder: 'KFUPM (Co-Investigator)',
    end_year: 2024,
    tags: ['contamination', 'remediation'],
    sort_order: 8,
  },
  {
    id: 'prj-9',
    title: 'Treated wastewater reuse and groundwater sustainability',
    summary: 'Assessing how irrigation with treated wastewater affects groundwater sustainability in eastern Saudi Arabia (DSR project EC221014).',
    status: 'completed',
    funder: 'KFUPM Deanship of Scientific Research (Co-Investigator)',
    end_year: 2024,
    tags: ['wastewater reuse', 'irrigation'],
    sort_order: 9,
  },
  {
    id: 'prj-10',
    title: 'Water quality for Blue Flag beaches in Al-Khobar and Ras Tanura',
    summary: 'Water-quality assessment to support Blue Flag beach certification (project CMWS2571).',
    status: 'completed',
    funder: 'Sharqia Development Authority, Saudi Arabia',
    tags: ['coastal water quality'],
    sort_order: 10,
  },
]

export const seedPosts: Post[] = [
  {
    id: 'post-1',
    title: 'U.S. patent application filed for a brine-free desalination and crystallization system',
    date: '2026-02-12',
    category: 'news',
    body: 'A U.S. patent application (No. 19/075,076) has been filed for a desalination and crystallization system that operates without producing brine. It follows U.S. Patent No. 12,275,654 for a sustainable brine treatment system and process.',
    published: true,
  },
  {
    id: 'post-2',
    title: "Named among the world's top 2% of scientists for the fourth year running",
    date: '2025',
    category: 'award',
    body: "Dr. Abba is again included in the Elsevier and Stanford University list of the world's top 2% of scientists, having appeared every year since 2022.",
    published: true,
  },
  {
    id: 'post-3',
    title: 'RDIA grant awarded for a solar-driven membrane distillation unit',
    date: '2025',
    category: 'grant',
    body: "Saudi Arabia's Research, Development and Innovation Authority (RDIA) accepted the proposal \"Innovative Solar Driven Dual Mode Membrane Distillation Unit with Internal Gap Circulation\", in collaboration with the Interdisciplinary Research Center for Membranes and Water Security at KFUPM.",
    published: true,
  },
  {
    id: 'post-4',
    title: 'Two PMU humanitarian development grants as principal investigator',
    date: '2025',
    category: 'grant',
    body: "Two projects led by Dr. Abba received Prince Mohammad Bin Fahd University Research Grants for Humanitarian Development: a framework for monitoring heavy-metal pollution and public health hazards in Dammam, and a data-driven health-risk assessment of microplastics in treated wastewater.",
    published: true,
  },
  {
    id: 'post-5',
    title: 'Joined Prince Mohammad Bin Fahd University as Assistant Professor',
    date: '2024',
    category: 'news',
    body: 'Dr. Abba joined the Department of Civil Engineering at Prince Mohammad Bin Fahd University, Saudi Arabia, after three years at the Interdisciplinary Research Center for Membranes and Water Security, KFUPM.',
    published: true,
  },
]

export const seedGallery: Photo[] = [
  { id: 'ph-1', image_url: img('award-certificate'), caption: 'Receiving a certificate of recognition from Isam Aljundi, Director of the Interdisciplinary Research Center for Membranes and Water Security, KFUPM', featured: true, sort_order: 2 },
  { id: 'ph-2', image_url: img('elsevier-conference'), caption: 'At an Elsevier water and membrane science conference', featured: true, sort_order: 1 },
  { id: 'ph-3', image_url: img('barcelona'), caption: 'Barcelona, during a conference visit', featured: true, sort_order: 3 },
  { id: 'ph-4', image_url: img('community-gathering'), caption: 'With colleagues at a community gathering', featured: true, sort_order: 4 },
  { id: 'ph-5', image_url: img('faculty-meeting'), caption: 'With faculty members after an academic meeting', sort_order: 5 },
  { id: 'ph-6', image_url: img('civil-environmental-faculty'), caption: 'Outside the Faculty of Civil and Environmental Engineering', sort_order: 6 },
  { id: 'ph-7', image_url: img('portrait'), caption: 'Portrait', sort_order: 7 },
]
