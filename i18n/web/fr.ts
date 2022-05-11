// noinspection SpellCheckingInspection
import { WebTranslations } from '.'
import { Language, Locale } from '../../utils/api/definitions/enums'

const fr: WebTranslations = {
  _language: Language.FR,
  _locale: Locale.FR,

  oas: 'Pension de la Sécurité de la vieillesse (SV)',
  gis: 'Supplément de revenu garanti (SRG)',
  alw: 'Allocation',
  afs: 'Allocation au survivant',
  testSiteTitle: "SITE D'ESSAI",
  testSiteHeader:
    'Vous ne pouvez pas demander de services ou de prestations par l’intermédiaire de ce site d’essai. Certaines parties du site pourraient ne pas fonctionner et seront modifiées.',
  otherLang: 'English',
  otherLangCode: 'EN',
  langLong: 'fra',
  creator: 'Emploi et Développement social Canada',
  search: 'Rechercher dans Canada.ca',
  breadcrumb1Title: 'Canada.ca',
  breadcrumb1URL: 'https://www.canada.ca/fr.html',
  breadcrumb2Title: 'Service Canada',
  breadcrumb2URL:
    'https://www.canada.ca/en/employment-social-development/corporate/portfolio/service-canada.html',
  title: 'Estimateur Canadien des Prestations de Vieillesse',
  menuTitle: 'Service Canada',
  clear: 'Effacer',
  back: 'Précédent',
  next: 'Suivant',
  questions: 'Questions',
  results: 'Résultats',
  needHelp: "Besoin d'aide?",
  faq: 'Foire Aux Questions',
  saveToCsv: 'Télécharger',
  getResults: 'Obtenir les résultats',
  applyHeader: 'Faire une demande de prestations',
  applyText:
    'Maintenant que vous avez estimé vos prestations, veuillez utiliser le(s) bouton(s) ci-dessous pour faire votre demande.',
  applyForLabel: 'Demander',
  required: 'obligatoire',
  homePageP1:
    "Utilisez cet outil afin de déterminer le montant que vous pourriez recevoir des programmes de prestations de vieillesse. Vous pouvez fournir vos renseignements actuels, ou des renseignements futurs si vous désirez utiliser l'outil à des fins de planification.",
  homePageHeader1: 'Qui peut recevoir ces prestations',
  youMayBeEligible:
    'Vous pourriez être admisible aux prestations de vieillesse si : ',
  atleast60: 'vous avez au moins 60 ans',
  haveNetIncomeLess: 'votre revenu net est moins de 133 141 $ CAD',
  headerWhatToKnow: 'Ce que vous devez savoir avant de commencer',
  pleaseNodeText:
    "Veuillez noter qu'il s'agit d'un estimateur et non d'une demande de prestations.",
  estimatorIncludeQuestionText: 'The estimator includes questions about your:',
  ageText: 'age',
  netIncomeText: 'net income',
  legalStatusText: 'legal status',
  residenceHistoryText: 'residence history',
  maritalStatusText: 'marital status',
  partnerText: `(if applicable) your partner's income, legal status, and residence history`,
  timeToCompleteText: 'Time to complete',
  startBenefitsEstimator: 'Start benefits estimator',
  estimatorTake5mins:
    'This estimator will take about 5 to 10 minutes to complete.',
  whatBenefitsTheEstimatorIsFor: 'What benefits the estimator is for',
  benefitAvailable: 'A benefit available to those 65 and older',
  learnMoreAboutOldAgeSecurity:
    '<a className="underline text-default-text" href="#" target="_blank">Learn more about old age security</a>',
  gisDefinationText:
    'A benefit available to those who receive Old Age Security benefits, and who are aged 65 and older, have a low income, and are living in Canada.',
  learnMoreAboutGIS:
    '<a className="underline text-default-text" href="#" target="_blank">Learn more about the Guaranteed Income Supplement</a>',
  alwDefinationText:
    'A benefit available to low-income individuals aged 60 to 64, whose spouse or common-law partner receives the Guaranteed Income Supplement.',
  learnMoreAboutAlw:
    '<a className="underline text-default-text" href="#" target="_blank">Learn more about the Allowance</a>',
  afsDefinationText:
    'A benefit available to low-income individuals aged 60 to 64, who are living in Canada, and whose spouse or common-law partner has passed away.',
  learnMoreAboutAfs:
    '<a className="underline text-default-text" href="#" target="_blank">Learn more about the Allowance for the Survivor</a>',
  notIncludeCPP:
    'This estimator tool does not include the Canada Pension Plan (CPP) retirement pension.',
  learnMoreAboutCpp:
    '<a className="underline text-default-text" href="#" target="_blank">Learn more about the Canada Pension Plan</a>',
  aboutResultText: 'About the results',
  resultDefination: `The results are estimates and not a final decision. For a more accurate assessment of your estimated benefits amount, please contact <a className='text-default-text underline' target='_blank' href='https://www.canada.ca/en/employment-social-development/corporate/contact/oas.html'>Service Canada</a>. The results are not financial advice.`,
  privacyDefination:
    'Your information is private. The personal information provided is governed in accordance with the <a className="underline text-default-text" href="https://laws-lois.justice.gc.ca/eng/acts/P-21/index.html" target="_blank">Privacy Act</a>.The estimator does not collect information that would enable personal identification. Your anonymous results may be collected for research purposes.',
  homePageP3:
    "La pension de la Sécurité de la vieillesse est un paiement mensuel que vous pouvez recevoir si vous avez 65 ans et plus. Dans la plupart des cas, Service Canada sera en mesure de vous inscrire automatiquement. Dans d'autres cas, vous devrez présenter une demande. Service Canada vous informera si vous avez été inscrit automatiquement.",
  homePageP4:
    'Le Supplément de revenu garanti est une prestation mensuelle non imposable destinée aux bénéficiaires de la pension de la Sécurité de la vieillesse âgées de 65 et plus qui ont un faible revenu et qui vivent au Canada.',
  homePageP5:
    "L'Allocation est une prestation mensuelle offerte aux personnes à faible revenu âgées de 60 à 64 ans dont l'époux ou le conjoint de fait reçoit le Supplément de revenu garanti.",
  homePageP6:
    "L'Allocation au survivant est une prestation mensuelle offerte aux personnes âgées de 60 à 64 ans qui ont un faible revenu, qui vivent au Canada et dont l'époux ou le conjoint de fait est décédé.",
  disclaimerTitle: "Confidentialité et conditions d'utilisation",
  disclaimer: `L'Estimateur canadien de prestations de vieillesse ne recueille ni ne transmet aucun renseignement personnel. Les données d'utilisation anonymes peuvent être recueillies à des fins de recherche. Les renseignements fournis sont régis conformément à la <a className='underline text-default-text' href='https://laws-lois.justice.gc.ca/fra/lois/p-21/index.html' target='_blank'>Loi sur la protection des renseignements personnels</a>.</br></br>Veuillez noter que toutes les informations fournies par cet outil ne sont qu'une estimation et ne doivent pas être considérées comme des conseils financiers. Pour une évaluation officielle, nous vous encourageons à communiquer avec <a className='text-default-text underline' target='_blank' href='https://www.canada.ca/fr/emploi-developpement-social/ministere/coordonnees/sv.html'>Service Canada</a>.`,
  footerlink1: 'Contactez-nous',
  footerlink2: 'Premier ministre',
  footerlink3: 'Traités, lois et règlements',
  footerlink4: 'Fonction publique et force militaire',
  footerlink5: 'Gouvernement ouvert',
  footerlink6: 'Nouvelles',
  footerlink7: 'Ministères et organismes',
  footerlink8: 'À propos du gouvernement',
  footerlink9: "Rapports à l'échelle du gouvernement",
  socialLink1: 'Médias sociaux',
  socialLink2: 'Applications mobiles',
  socialLink3: 'À propos de Canada.ca',
  socialLink4: 'Avis',
  socialLink5: 'Confidentialité',

  category: {
    incomeDetails: 'Revenu',
    personalInformation: 'Renseignements personnels',
    legalStatus: 'Statut légal',
  },

  contactCTA:
    'Nous vous encourageons à contacter <a className="text-default-text underline" target="_blank" href="https://www.canada.ca/fr/emploi-developpement-social/ministere/coordonnees/sv.html">Service Canada</a> pour une évaluation officielle de votre demande.',
  resultsPage: {
    header: "Tableau des résultats d'estimation",
    tableHeader1: 'Exemples de prestations',
    tableHeader2: 'Admissibilité',
    tableHeader3: 'Montant mensuel estimé (CAD)',
    tableHeader4: 'Details',
    tableTotalAmount: 'Montant total des prestations mensuelles',
  },
  moreInfoHeader: "Besoin de plus d'information",
  modifyAnswers: 'Modifier vos réponses',
  modifyAnswersText:
    'Si vous avez fait une erreur en remplissant le formulaire, ou si vous souhaitez modifier vos réponses pour voir ce qui se passerait dans un scénario différent, veuillez utiliser le bouton ci-dessous pour modifier vos réponses.',
  errors: {
    empty: 'Ce renseignement est requis',
  },
  validationErrors: {
    incomeBelowZero: 'Vos revenus doivent être supérieurs à zéro.',
    incomeTooHigh:
      "Votre revenu annuel doit être inférieur à {MAX_OAS_INCOME} pour recevoir l'une des prestations couvertes par cet outil.",
    partnerIncomeBelowZero:
      'Les revenus de votre partenaire doivent être supérieurs à zéro.',
    partnerIncomeTooHigh:
      "La somme de votre revenu annuel et de celui de votre partenaire doit être inférieure à {MAX_OAS_INCOME} pour bénéficier de l'une des prestations couvertes par cet outil.",
    ageUnder18:
      'Vous devez avoir plus de 18 ans pour pouvoir utiliser cet outil.',
    ageOver150: 'Votre âge doit être inférieur à 150 ans.',
    partnerAgeUnder18:
      "L'âge de votre partenaire doit être supérieur à 18 ans pour pouvoir utiliser cet outil.",
    partnerAgeOver150:
      "L'âge de votre partenaire doit être inférieur à 150 ans.",
    yearsInCanadaMinusAge:
      "Le nombre d'années pendant lesquelles vous avez vécu au Canada ne doit pas dépasser votre âge moins 18 ans.",
    partnerYearsInCanadaMinusAge:
      "Le nombre d'années de votre partenaire au Canada ne doit pas dépasser son âge moins 18 ans.",
  },
  unavailableImageAltText: 'Gens Heureux',
  govt: 'Gouvernement du Canada',
  yes: 'Oui',
  no: 'Non',

  selectText: {
    maritalStatus: 'Sélectionner un état civil',
    livingCountry: 'Sélectionner un pays',
    partnerLivingCountry: 'Sélectionner un pays',
    default: 'Sélectionnez parmi',
  },
}

export default fr
