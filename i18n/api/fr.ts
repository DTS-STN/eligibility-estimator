import { Translations } from './index'

const fr: Translations = {
  benefit: {
    oas: 'FRENCH: Old Age Security',
    gis: 'FRENCH: Guaranteed Income Supplement',
    allowance: 'FRENCH: Allowance',
    afs: 'FRENCH: Allowance for Survivor',
  },
  question: {
    income:
      'FRENCH: What is your current annual net income in Canadian Dollars?',
    age: 'FRENCH: What is your current age?',
    livingCountry: 'FRENCH: What country are you currently living in?',
    legalStatus: 'FRENCH: What is your current legal status?',
    legalStatusOther: 'FRENCH: Please specify your current legal status:',
    yearsInCanadaSince18:
      'FRENCH: How many years have you lived in Canada since the age of 18?',
    maritalStatus: 'FRENCH: What is current marital status?',
    partnerIncome:
      "FRENCH: What is your partner's annual net income in Canadian dollars?",
    partnerReceivingOas:
      'FRENCH: Does your partner receive a full OAS pension?',
    everLivedSocialCountry:
      'FRENCH: Have you ever lived in a country with an established social security agreement?',
  },
  questionOptions: {
    legalStatus: [
      { key: 'canadianCitizen', text: 'FRENCH: Canadian citizen' },
      {
        key: 'permanentResident',
        text: 'FRENCH: Permanent resident or landed immigrant (non-sponsored)',
      },
      {
        key: 'sponsored',
        text: 'FRENCH: Permanent resident or landed immigrant (sponsored)',
      },
      { key: 'indianStatus', text: 'FRENCH: Indian status or status card' },
      {
        key: 'other',
        text: 'FRENCH: Other (Example: Temporary resident, student, temporary worker, etc.)',
      },
    ],
    maritalStatus: [
      { key: 'single', text: 'FRENCH: Single' },
      { key: 'married', text: 'FRENCH: Married' },
      { key: 'commonLaw', text: 'FRENCH: Common-law' },
      { key: 'widowed', text: 'FRENCH: Widowed' },
      { key: 'divorced', text: 'FRENCH: Divorced' },
      { key: 'separated', text: 'FRENCH: Separated' },
    ],
    livingCountry: [
      { key: 'AFG', text: 'Afghanistan' },
      { key: 'ALB', text: 'Albanie' },
      { key: 'DZA', text: 'Algérie' },
      { key: 'AND', text: 'Andorre' },
      { key: 'AGO', text: 'Angola' },
      { key: 'ATG', text: 'Antigua et Barbuda' },
      { key: 'ARG', text: 'Argentine' },
      { key: 'ARM', text: 'Arménie' },
      { key: 'AUS', text: 'Australie' },
      { key: 'AUT', text: 'Autriche' },
      { key: 'AZE', text: 'Azerbaïdjan' },
      { key: 'BHS', text: 'Bahamas' },
      { key: 'BHR', text: 'Bahreïn' },
      { key: 'BGD', text: 'Bangladesh' },
      { key: 'BRB', text: 'Barbade' },
      { key: 'BLR', text: 'Bélarus' },
      { key: 'BEL', text: 'Belgique' },
      { key: 'BLZ', text: 'Belize' },
      { key: 'BEN', text: 'Bénin' },
      { key: 'BTN', text: 'Bhoutan' },

      { key: 'BIH', text: 'Bosnie-Herzégovine' },
      { key: 'BWA', text: 'Botswana' },
      { key: 'BRA', text: 'Brésil' },

      { key: 'BGR', text: 'Bulgarie' },
      { key: 'BFA', text: 'Burkina Faso' },
      { key: 'BDI', text: 'Burundi' },
      { key: 'CPV', text: 'Cabo Verde' },
      { key: 'KHM', text: 'Cambodge' },
      { key: 'CMR', text: 'Cameroun' },
      { key: 'CAN', text: 'Canada' },
      { key: 'CAF', text: 'République Centrafricaine' },
      { key: 'TCD', text: 'Tchad' },
      { key: 'CHL', text: 'Chili' },
      { key: 'CHN', text: 'Chine' },
      { key: 'COL', text: 'Colombie' },
      { key: 'COM', text: 'Comores' },

      { key: 'CRI', text: 'Costa Rica' },
      { key: 'CIV', text: "Côte d'Ivoire" },
      { key: 'HRV', text: 'Croatie' },
      { key: 'CUB', text: 'Cuba' },
      { key: 'CYP', text: 'Chypre (Cyprus)' },

      { key: 'DNK', text: 'Danemark' },
      { key: 'DJI', text: 'Djibouti' },
      { key: 'DMA', text: 'Dominique' },
      { key: 'DOM', text: 'République Dominicaine' },
      { key: 'ECU', text: 'Équateur' },
      { key: 'EGY', text: 'Égypte' },
      { key: 'SLV', text: 'El Salvador' },
      { key: 'GNQ', text: 'Guinée équatoriale' },
      { key: 'ERI', text: 'Erythrée' },
      { key: 'EST', text: 'Estonie' },

      { key: 'ETH', text: 'Éthiopie' },
      { key: 'FJI', text: 'Fidji' },
      { key: 'FIN', text: 'Finlande' },
      { key: 'FRA', text: 'France' },
      { key: 'GAB', text: 'Gabon' },
      { key: 'GMB', text: 'Gambie' },
      { key: 'GEO', text: 'Géorgie' },
      { key: 'DEU', text: 'Allemagne' },
      { key: 'GHA', text: 'Ghana' },
      { key: 'GRC', text: 'Grèce' },
      { key: 'GRD', text: 'Grenade' },
      { key: 'GTM', text: 'Guatemala' },
      { key: 'GIN', text: 'Guinée' },
      { key: 'GNB', text: 'Guinée-Bissau' },
      { key: 'GUY', text: 'Guyana' },
      { key: 'HTI', text: 'Haïti' },
      { key: 'VAT', text: 'Saint-Siège' },
      { key: 'HND', text: 'Honduras' },
      { key: 'HUN', text: 'Hongrie' },
      { key: 'ISL', text: 'Islande' },
      { key: 'IND', text: 'Inde' },
      { key: 'IDN', text: 'Indonésie' },

      { key: 'IRQ', text: 'Irak' },
      { key: 'IRL', text: 'Irlande' },
      { key: 'ISR', text: 'Israël' },
      { key: 'ITA', text: 'Italie' },
      { key: 'JAM', text: 'Jamaïque' },
      { key: 'JPN', text: 'Japon' },
      { key: 'JOR', text: 'Jordanie' },
      { key: 'KAZ', text: 'Kazakhstan' },
      { key: 'KEN', text: 'Kenya' },
      { key: 'KIR', text: 'Kiribati' },
      { key: 'KWT', text: 'Koweït' },
      { key: 'KGZ', text: 'Kirghizistan' },

      { key: 'LVA', text: 'Lettonie' },
      { key: 'LBN', text: 'Liban' },
      { key: 'LSO', text: 'Lesotho' },
      { key: 'LBR', text: 'Liberia' },
      { key: 'LBY', text: 'Libye' },
      { key: 'LIE', text: 'Liechtenstein' },
      { key: 'LTU', text: 'Lituanie' },
      { key: 'LUX', text: 'Luxembourg' },
      { key: 'MDG', text: 'Madagascar' },
      { key: 'MWI', text: 'Malawi' },
      { key: 'MYS', text: 'Malaisie' },
      { key: 'MDV', text: 'Maldives' },
      { key: 'MLI', text: 'Mali' },
      { key: 'MLT', text: 'Malte' },
      { key: 'MHL', text: 'Marshall (Îles)' },
      { key: 'MRT', text: 'Mauritanie' },
      { key: 'MUS', text: 'Maurice' },
      { key: 'MEX', text: 'Mexique' },

      { key: 'MCO', text: 'Monaco' },
      { key: 'MNG', text: 'Mongolie' },
      { key: 'MNE', text: 'Monténégro' },
      { key: 'MAR', text: 'Maroc' },
      { key: 'MOZ', text: 'Mozambique' },

      { key: 'NAM', text: 'Namibie' },
      { key: 'NRU', text: 'Nauru' },
      { key: 'NPL', text: 'Népal' },
      { key: 'NLD', text: 'Pays-Bas' },
      { key: 'NZL', text: 'Nouvelle-Zélande' },
      { key: 'NIC', text: 'Nicaragua' },
      { key: 'NER', text: 'Niger' },
      { key: 'NGA', text: 'Nigeria' },

      { key: 'MKD', text: 'Macédoine du Nord' },
      { key: 'NOR', text: 'Norvège' },
      { key: 'OMN', text: 'Oman' },
      { key: 'PAK', text: 'Pakistan' },
      { key: 'PLW', text: 'Palau' },

      { key: 'PAN', text: 'Panama' },
      { key: 'PNG', text: 'Papouasie-Nouvelle-Guinée' },
      { key: 'PRY', text: 'Paraguay' },
      { key: 'PER', text: 'Pérou' },
      { key: 'PHL', text: 'Philippines' },
      { key: 'POL', text: 'Pologne' },
      { key: 'PRT', text: 'Portugal' },
      { key: 'QAT', text: 'Qatar' },
      { key: 'ROU', text: 'Roumanie' },

      { key: 'RWA', text: 'Rwanda' },
      { key: 'KNA', text: 'Saint-Kitts-et-Nevis' },
      { key: 'LCA', text: 'Sainte-Lucie' },
      { key: 'VCT', text: 'Saint Vincent et les Grenadines' },
      { key: 'WSM', text: 'Samoa' },
      { key: 'SMR', text: 'Saint-Marin' },
      { key: 'STP', text: 'Sao Tomé et Principe' },
      { key: 'SAU', text: 'Arabie Saoudite' },
      { key: 'SEN', text: 'Sénégal' },
      { key: 'SRB', text: 'Serbie' },
      { key: 'SYC', text: 'Seychelles' },
      { key: 'SLE', text: 'Sierra Leone' },
      { key: 'SGP', text: 'Singapour' },
      { key: 'SVK', text: 'Slovaquie' },
      { key: 'SVN', text: 'Slovénie' },
      { key: 'SLB', text: 'Salomon (Îles)' },
      { key: 'SOM', text: 'Somalie' },
      { key: 'ZAF', text: 'Afrique du Sud' },

      { key: 'SSD', text: 'Soudan du Sud' },
      { key: 'ESP', text: 'Espagne' },
      { key: 'LKA', text: 'Sri Lanka' },
      { key: 'SDN', text: 'Soudan' },
      { key: 'SUR', text: 'Suriname' },
      { key: 'SWE', text: 'Suède' },
      { key: 'CHE', text: 'Suisse' },

      { key: 'TJK', text: 'Tadjikistan' },

      { key: 'THA', text: 'Thaïlande' },
      { key: 'TLS', text: 'Timor-Leste' },
      { key: 'TGO', text: 'Togo' },
      { key: 'TON', text: 'Tonga' },
      { key: 'TTO', text: 'Trinité-et-Tobago' },
      { key: 'TUN', text: 'Tunisie' },
      { key: 'TUR', text: 'Turquie' },
      { key: 'TKM', text: 'Turkménistan' },
      { key: 'TUV', text: 'Tuvalu' },
      { key: 'UGA', text: 'Ouganda' },
      { key: 'UKR', text: 'Ukraine' },
      { key: 'ARE', text: 'Emirats Arabes Unis' },

      { key: 'USA', text: "Etats-Unis d'Amérique" },
      { key: 'URY', text: 'Uruguay' },
      { key: 'UZB', text: 'Ouzbékistan' },
      { key: 'VUT', text: 'Vanuatu' },

      { key: 'YEM', text: 'Yémen' },
      { key: 'ZMB', text: 'Zambie' },
      { key: 'ZWE', text: 'Zimbabwe' },
    ],
  },
  detail: {
    eligible:
      'FRENCH: Based on the information provided, you are likely eligible for this benefit.',
    eligibleWhen60ApplyNow:
      'FRENCH: You will likely be eligible when you turn 60, however you may be able to apply now. Please contact Service Canada for more information.',
    eligibleWhen65ApplyNow:
      'FRENCH: You will likely be eligible when you turn 65, however you may be able to apply now. Please contact Service Canada for more information.',
    eligibleWhen60: 'FRENCH: You will likely be eligible when you turn 60.',
    eligibleWhen65: 'FRENCH: You will likely be eligible when you turn 65.',
    mustBe60to64:
      'FRENCH: You must be between the ages of 60 and 64 to be eligible for this benefit.',
    mustBeInCanada:
      'FRENCH: You need to live in Canada to be eligible for this benefit.',
    mustBeOasEligible:
      'FRENCH: You need to be eligible for OAS to be eligible for this benefit.',
    mustCompleteOasCheck:
      'FRENCH: You need to complete the OAS eligibility check first.',
    mustBeWidowed:
      'FRENCH: You must be a surviving partner or widowed to be eligible for this benefit.',
    mustBePartnered:
      'FRENCH: You must be common-law or married to be eligible for this benefit.',
    mustHavePartnerWithOas:
      'FRENCH: Your partner must be receiving OAS to be eligible for this benefit.',
    mustMeetIncomeReq:
      'FRENCH: Your income is too high to be eligible for this benefit.',
    mustMeetYearReq:
      'FRENCH: You have not lived in Canada for the required number of years to be eligible for this benefit.',
    ineligibleYearsOrCountry:
      'FRENCH: You currently do not appear to be eligible for this benefit as you have indicated that you have not lived in Canada for the minimum period of time or lived in a country that Canada has a social security agreement with. However, you may be in the future if you reside in Canada for the minimum required number of years.',
    conditional:
      'FRENCH: You may be eligible for this benefit, you are encouraged to contact Service Canada to confirm.',
    dependingOnAgreement:
      "FRENCH: You may be eligible to receive this benefit, depending Canada's agreement with this country. You are encouraged to contact Service Canada.",
    dependingOnAgreementWhen60:
      "FRENCH: You may be eligible to receive this benefit when you turn 60, depending Canada's agreement with this country. You are encouraged to contact Service Canada.",
    dependingOnAgreementWhen65:
      "FRENCH: You may be eligible to receive this benefit when you turn 65, depending Canada's agreement with this country. You are encouraged to contact Service Canada.",
    dependingOnLegal:
      'FRENCH: You may be eligible to receive this benefit, depending on your legal status in Canada. You are encouraged to contact Service Canada.',
    dependingOnLegalSponsored:
      'FRENCH: You may be eligible for this benefit, you are encouraged to contact Service Canada to confirm.',
    dependingOnLegalWhen60:
      'FRENCH: You may be eligible to receive this benefit when you turn 60, depending on your legal status in Canada. You are encouraged to contact Service Canada.',
    dependingOnLegalWhen65:
      'FRENCH: You may be eligible to receive this benefit when you turn 65, depending on your legal status in Canada. You are encouraged to contact Service Canada.',
  },
}
export default fr
