// noinspection SpellCheckingInspection
import { WebTranslations } from '.'
import { Language, ValidationErrors } from '../../utils/api/definitions/enums'
import {
  generateLink,
  getMaxYear,
} from '../../utils/api/definitions/textReplacementRules'
import apiFr from '../api/fr'

const fr: WebTranslations = {
  _language: Language.FR,

  oas: 'Pension de la Sécurité de la vieillesse',
  gis: 'Supplément de revenu garanti',
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
  title: 'Estimateur de prestations de vieillesse canadiennes',
  introPageTitle:
    'Estimateur des prestations canadiennes de la Sécurité de la vieillesse',
  questionPageTitle:
    'Estimateur des prestations canadiennes de la Sécurité de la vieillesse : Questions',
  resultPageTitle:
    'Estimateur des prestations canadiennes de la Sécurité de la vieillesse : Résultats',
  menuTitle: 'Service Canada',
  clear: 'Effacer',
  back: 'Précédent',
  faq: 'Foire Aux Questions',
  nextStep: 'Prochaine étape',
  getEstimate: 'Estimer mes prestations',
  required: '(obligatoire)',
  homePageP1:
    "Utilisez cet outil pour déterminer le montant que vous pourriez recevoir des prestations de la Sécurité de la vieillesse. Veuillez noter qu'il s'agit d'un estimateur et non d'une demande de prestations.",
  homePageHeader1: 'Qui peut recevoir ces prestations',
  youMayBeEligible:
    'Vous pourriez être admissible aux prestations de vieillesse si : ',
  atLeast60: 'vous avez au moins 60 ans',
  headerWhatToKnow: 'Ce dont vous aurez besoin',
  haveNetIncomeLess: 'votre revenu net est moins de 133 141 $',
  pleaseNodeText:
    "Veuillez noter qu'il s'agit d'un estimateur et non d'une demande de prestations.",
  estimatorIncludeQuestionText:
    "L'estimateur vous posera des questions au sujet de votre : ",
  ageText: '<b>âge</b>',
  netIncomeText: '<b>revenu net</b>',
  legalStatusText:
    "<b>statut légal</b> (par exemple, citoyen canadien, statut d'Indien, réfugié ou résident permanent)",
  residenceHistoryText:
    "<b>historique de résidence</b> (nombre d'années vécues au Canada)",
  maritalStatusText: '<b>état matrimonial</b>',
  partnerText:
    '<b>partenaire</b> (revenu, statut légal et historique de résidence), le cas échéant',
  youNeedEndingText: `Vous pouvez fournir vos renseignements actuels, ou des renseignements futurs si vous désirez utiliser l'outil à des fins de planification.`,
  timeToCompleteText: 'Temps requis pour obtenir une estimation',
  startBenefitsEstimator: "Démarrer l'estimateur de prestations",
  estimatorTimeEstimate:
    'Il vous faudra environ 5 à 10 minutes pour répondre aux questions et obtenir une estimation.',
  whatBenefitsIncluded: "Prestations incluses dans l'estimateur",
  benefitAvailable:
    'Une prestation imposable disponible aux personnes de 65 ans et plus',
  learnMoreAboutOldAgeSecurity: `<a className="underline text-default-text" href="${apiFr.links.overview.oas.url}" target="_blank">En savoir plus sur la pension de la Sécurité de la vieillesse</a>`,
  gisDefinitionText:
    'Une prestation non imposable disponible aux personnes qui reçoivent la pension de la Sécurité de la vieillesse, ont 65 ans et plus, ont un faible revenu, et habitent au Canada',
  learnMoreAboutGis: `<a className="underline text-default-text" href="${apiFr.links.overview.gis.url}" target="_blank">En savoir plus sur le Supplément de revenu garanti </a>`,
  alwDefinitionText:
    'Une prestation non imposable disponible aux personnes âgées entre 60 et 64 ans ayant un faible revenu, qui habitent au Canada et dont le conjoint reçoit le Supplément de revenu garanti',
  learnMoreAboutAlw: `<a className="underline text-default-text" href="${apiFr.links.overview.alw.url}" target="_blank">En savoir plus sur l'Allocation</a>`,
  afsDefinitionText:
    'Une prestation non imposable disponible aux personnes âgées entre 60 et 64 ans ayant un faible revenu, qui habitent au Canada et dont le conjoint est décédé',
  learnMoreAboutAfs: `<a className="underline text-default-text" href="${apiFr.links.overview.afs.url}" target="_blank">En savoir plus sur l'Allocation au survivant</a>`,
  notIncludeCPP: `Cet estimateur n'inclut pas le Régime de pensions du Canada.`,
  learnMoreAboutCpp: `<a className="underline text-default-text" href="${apiFr.links.cpp.url}" target="_blank">En savoir plus sur le Régime de pensions du Canada</a>`,
  aboutResultText: 'À propos des résultats',
  resultDefinition: `Les résultats ne sont pas des conseils financiers et peuvent changer. Pour une évaluation plus précise de votre admissibilité, veuillez <a className='text-default-text underline' target='_blank' href='https://www.canada.ca/fr/emploi-developpement-social/ministere/coordonnees/sv.html'>communiquer avec Service Canada</a>.`,
  privacyHeading: 'Confidentialité',
  privacyDefinition: `Nous protégeons vos renseignements en vertu de la <em><a className="underline italic text-default-text" href="https://laws-lois.justice.gc.ca/fra/lois/p-21/index.html" target="_blank">Loi sur la protection des renseignements personnels</a></em>. L'estimateur ne recueille aucun renseignement pouvant vous identifier. Vos résultats anonymes peuvent être utilisés à des fins de recherche.`,
  homePageP3:
    "La pension de la Sécurité de la vieillesse est un paiement mensuel que vous pouvez recevoir si vous avez 65 ans et plus. Dans la plupart des cas, Service Canada sera en mesure de vous inscrire automatiquement. Dans d'autres cas, vous devrez présenter une demande. Service Canada vous informera si vous avez été inscrit automatiquement.",
  homePageP4:
    'Le Supplément de revenu garanti est une prestation mensuelle non imposable destinée aux bénéficiaires de la pension de la Sécurité de la vieillesse âgées de 65 et plus qui ont un faible revenu et qui vivent au Canada.',
  homePageP5:
    "L'Allocation est une prestation mensuelle offerte aux personnes à faible revenu âgées de 60 à 64 ans dont l'époux ou le conjoint de fait reçoit le Supplément de revenu garanti.",
  homePageP6:
    "L'Allocation au survivant est une prestation mensuelle offerte aux personnes âgées de 60 à 64 ans qui ont un faible revenu, qui vivent au Canada et dont l'époux ou le conjoint de fait est décédé.",
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
  pageNotFound: 'Page non trouvée',
  warningText: 'avertissement',
  category: apiFr.category,
  errorBoxTitle: "Le formulaire n'a pas pu être soumis car ",

  resultsPage: {
    header: "Tableau des résultats d'estimation",
    onThisPage: 'Sur cette page',
    tableHeader1: 'Prestations',
    tableHeader2: 'Montant mensuel estimé (CAD)',
    tableTotalAmount: 'Total',
    whatYouToldUs: 'Vos renseignements',
    youMayBeEligible: 'Vous pourriez être admissible',
    youAreNotEligible: "Vous n'êtes probablement pas admissible pour le moment",
    basedOnYourInfoEligible:
      'Selon vos renseignements, vous pourriez être admissible aux prestations suivantes :',
    basedOnYourInfoAndIncomeEligible:
      'En fonction de vos revenus et en fonction de vos informations, vous pourriez être éligible à :',
    basedOnYourInfoNotEligible: `Sur la base de vos informations, vous n'êtes peut-être pas éligible aux prestations de vieillesse. Voir ci-dessous, ou contactez ${generateLink(
      apiFr.links.SC
    )} pour plus d'informations.`,
    yourEstimatedTotal: 'Votre total mensuel estimé est de ',
    basedOnYourInfoTotal:
      "D'après les informations que vous avez fournies, vous devriez vous attendre à recevoir environ <b>{AMOUNT}</b> par mois.",
    basedOnYourInfoAndIncomeTotal:
      "D'après les informations que vous avez fournies, vous devriez vous attendre à recevoir environ <b>{AMOUNT}</b> par mois. Cependant, ce montant peut être inférieur ou supérieur en fonction de vos revenus.",
    nextSteps:
      'Prochaines étapes pour les prestations auxquelles vous pourriez être admissible',
    youMayNotBeEligible:
      'Prestations auxquelles vous pourriez ne pas être admissible',
    noAnswersFound: 'Aucune réponse trouvée',
    noBenefitsFound: 'Aucune prestations trouvée',
    edit: 'Réviser',
    info: 'info',
    note: 'remarque',
    link: 'lien',
  },
  resultsQuestions: apiFr.questionShortText,
  resultsEditAriaLabels: apiFr.questionAriaLabel,
  modifyAnswers: 'Modifier vos réponses',
  errors: {
    empty: 'Ce renseignement est requis',
  },
  validationErrors: {
    [ValidationErrors.invalidAge]: `Veuillez entrer une année entre 1900 et ${getMaxYear()}.`,
    [ValidationErrors.partnerIncomeEmpty]:
      'Veuillez entrer le revenu de votre conjoint.',
    [ValidationErrors.partnerYearsSince18Empty]:
      'Veuillez entrer un nombre qui ne dépasse pas l’âge de votre conjoint moins 18 ans.',
    [ValidationErrors.maritalStatusEmpty]:
      'Veuillez sélectionner un état matrimonial.',
    [ValidationErrors.yearsSince18Empty]:
      'Veuillez entrer un nombre qui ne dépasse pas votre âge moins 18 ans.',
    [ValidationErrors.legalStatusNotSelected]:
      'Veuillez sélectionner un statut légal.',
    [ValidationErrors.incomeEmpty]: 'Veuillez entrer votre revenu.',
    [ValidationErrors.optionNotSelected]: 'Veuillez sélectionner une option.',
    [ValidationErrors.incomeBelowZero]:
      'Vos revenus doivent être supérieurs à zéro.',
    [ValidationErrors.partnerIncomeBelowZero]:
      'Les revenus de votre partenaire doivent être supérieurs à zéro.',
    [ValidationErrors.incomeTooHigh]:
      "Votre revenu annuel doit être inférieur à {OAS_MAX_INCOME} pour recevoir l'une des prestations couvertes par cet outil.",
    [ValidationErrors.partnerIncomeTooHigh]:
      "La somme de votre revenu annuel et de celui de votre partenaire doit être inférieure à {OAS_MAX_INCOME} pour bénéficier de l'une des prestations couvertes par cet outil.",
    [ValidationErrors.ageUnder18]:
      'Vous devez avoir au moins 60 ans pour recevoir des des prestations de vieillesse canadiennes.',
    [ValidationErrors.partnerAgeUnder18]:
      "L'âge de votre partenaire doit être supérieur à 18 ans pour pouvoir utiliser cet outil.",
    [ValidationErrors.ageOver150]: 'Votre âge doit être inférieur à 150 ans.',
    [ValidationErrors.partnerAgeOver150]:
      "L'âge de votre partenaire doit être inférieur à 150 ans.",
    [ValidationErrors.oasAge65to70]:
      'Veuillez entrer un âge entre 65 et 70 ans.',
    [ValidationErrors.yearsInCanadaNotEnough10]:
      "Votre devez avoir vécu au Canada pendant au moins 10&nbsp;ans pour recevoir l'une des prestations incluses dans cet outil.",
    [ValidationErrors.yearsInCanadaNotEnough20]:
      "Votre devez avoir vécu au Canada pendant au moins 20&nbsp;ans pour recevoir l'une des prestations incluses dans cet outil.",
    [ValidationErrors.yearsInCanadaMinusAge]:
      "Le nombre d'années pendant lesquelles vous avez vécu au Canada ne doit pas dépasser votre âge moins 18 ans.",
    [ValidationErrors.partnerYearsInCanadaMinusAge]:
      "Le nombre d'années de votre partenaire au Canada ne doit pas dépasser son âge moins 18 ans.",
    [ValidationErrors.maritalUnavailable]:
      "Vous avez indiqué un état matrimonial qui n'est pas couvert par cet outil. Pour obtenir de l'aide, {LINK_SERVICE_CANADA}.",
    [ValidationErrors.legalUnavailable]:
      "Vous avez sélectionné un statut légal qui n'est pas admissible aux prestations incluses dans cet outil. Pour obtenir de l'aide, {LINK_SERVICE_CANADA}.",
    [ValidationErrors.socialCountryUnavailable10]:
      'Cet outil ne peut pas estimer vos prestations parce que vous avez vécu au Canada pendant moins de 10&nbsp;ans. Pour savoir si vous êtes admissible aux prestations de vieillesse, {LINK_SERVICE_CANADA}.',
    [ValidationErrors.socialCountryUnavailable20]:
      'Cet outil ne peut pas estimer vos prestations parce que vous avez vécu au Canada pendant moins de 20&nbsp;ans. Pour savoir si vous êtes admissible aux prestations de vieillesse, {LINK_SERVICE_CANADA}.',
  },
  unableToProceed: 'Impossible de continuer',
  yes: 'Oui',
  no: 'Non',
  unavailable: 'indisponible',

  selectText: {
    maritalStatus: 'Sélectionner un état matrimonial',
    livingCountry: 'Sélectionner un pays',
    partnerLivingCountry: 'Sélectionner un pays',
    default: 'Sélectionnez parmi',
  },

  tooltip: {
    moreInformation: "Plus d'information",
  },
  partnerIsNotEligible: "Votre conjoint n'est pas admissible",
  partnerLegalStatusNotEligible:
    "Le statut légal de votre conjoint indique qu'il ne reçoit pas la pension de la Sécurité de la vieillesse.",
  partnerYearsLivingCanadaNotEligible:
    "Votre conjoint n'a pas vécu au Canada assez longtemps pour recevoir la pension de la Sécurité de la vieillesse.",
  partnerInformation: 'Renseignements sur votre conjoint',
  partnerInformationDescription:
    'Les personnes mariées ou vivant en union de fait doivent fournir \
  des renseignements sur leur conjoint pour évaluer leur propre admissibilité.',
}

export default fr
