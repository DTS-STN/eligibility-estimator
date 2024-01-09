// noinspection SpellCheckingInspection
import { WebTranslations } from '.'
import {
  ISOLanguage,
  Language,
  ValidationErrors,
} from '../../utils/api/definitions/enums'
import {
  generateLink,
  getMaxYear,
  getMaximumIncomeThreshold,
} from '../../utils/api/definitions/textReplacementRules'
import apiFr from '../api/fr'

const fr: WebTranslations = {
  _language: Language.FR,
  ISOlang: ISOLanguage.FR,

  skipToMain: 'Passer au contenu principal',
  skipToAbout: 'Passer à « Au sujet du gouvernement »',
  switchToBasic: 'Passer à la version HTML simplifiée',
  globalHeader: 'En-tête général',
  testSiteNotice: "Avis de site d'essai",
  officialSiteNavigation: 'Site officiel de Canada.ca',
  languageSelection: 'Sélection de la langue',
  logoAltText: 'Gouvernement du Canada',
  oas: 'Pension de la Sécurité de la vieillesse',
  gis: 'Supplément de revenu garanti',
  alw: 'Allocation',
  alws: 'Allocation au survivant',
  testSiteTitle: "SITE D'ESSAI",
  testSiteHeader:
    'Vous ne pouvez pas demander de services ou de prestations par l’intermédiaire de ce site d’essai. Certaines parties du site pourraient ne pas fonctionner et seront modifiées.',
  otherLang: 'English',
  otherLangCode: 'EN',
  creator: 'Emploi et Développement social Canada',
  search: 'Rechercher dans Canada.ca',
  aboutGovernment: 'Au sujet du gouvernement',
  footerTitle: 'Gouvernement du Canada',
  aboutSite: 'À propos de ce site',
  // Main footer links
  landscapeLinks: {
    contacts: {
      text: 'Toutes les coordonnées',
      link: 'https://www.canada.ca/fr/contact.html',
    },
    departments: {
      text: 'Ministères et organismes',
      link: 'https://www.canada.ca/fr/gouvernement/min.html',
    },
    about: {
      text: 'À propos du gouvernement',
      link: 'https://www.canada.ca/fr/gouvernement/systeme.html',
    },
    jobs: {
      text: 'Emplois',
      link: 'https://www.canada.ca/fr/services/emplois.html',
    },
    taxes: {
      text: 'Impôts',
      link: 'https://www.canada.ca/fr/services/impots.html',
    },
    canadaAndWorld: {
      text: 'Le Canada et le monde',
      link: 'https://www.international.gc.ca/world-monde/index.aspx?lang=fra',
    },
    immigration: {
      text: 'Immigration et citoyenneté',
      link: 'https://www.canada.ca/fr/services/immigration-citoyennete.html',
    },
    environment: {
      text: 'Environnement et ressources naturelles',
      link: 'https://www.canada.ca/fr/services/environnement.html',
    },
    finance: {
      text: 'Argent et finance',
      link: 'https://www.canada.ca/fr/services/finance.html',
    },
    travel: { text: 'Voyage et tourisme', link: 'https://voyage.gc.ca/' },
    nationalSecurity: {
      text: 'Sécurité nationale et défense',
      link: 'https://www.canada.ca/fr/services/defense.html',
    },
    innovation: {
      text: 'Science et innovation',
      link: 'https://www.canada.ca/fr/services/science.html',
    },
    business: {
      text: 'Entreprises',
      link: 'https://www.canada.ca/fr/services/entreprises.html',
    },
    culture: {
      text: 'Culture, histoire et sport',
      link: 'https://www.canada.ca/fr/services/culture.html',
    },
    indigenous: {
      text: 'Autochtones',
      link: 'https://www.canada.ca/fr/services/autochtones.html',
    },
    benefit: {
      text: 'Prestations',
      link: 'https://www.canada.ca/fr/services/prestations.html',
    },
    policing: {
      text: 'Services de police, justice et urgences',
      link: 'https://www.canada.ca/fr/services/police.html',
    },
    veterans: {
      text: 'Vétérans et militaires',
      link: 'https://www.canada.ca/fr/services/veterans-militaire.html',
    },
    health: {
      text: 'Santé',
      link: 'https://www.canada.ca/fr/services/sante.html',
    },
    transport: {
      text: 'Transport et infrastructure',
      link: 'https://www.canada.ca/fr/services/transport.html',
    },
    youth: {
      text: 'Jeunesse',
      link: 'https://www.canada.ca/fr/services/jeunesse.html',
    },
  },
  brandLinks: {
    socialMedia: {
      text: 'Médias sociaux',
      link: 'https://www.canada.ca/fr/sociaux.html',
    },
    mobile: {
      text: 'Applications mobiles',
      link: 'https://www.canada.ca/fr/mobile.html',
    },
    about: {
      text: 'À propos de Canada.ca',
      link: 'https://www.canada.ca/fr/gouvernement/a-propos.html',
    },
    terms: {
      text: 'Avis',
      link: 'https://www.canada.ca/fr/transparence/avis.html',
    },
    privacy: {
      text: 'Confidentialité',
      link: 'https://www.canada.ca/fr/transparence/confidentialite.html',
    },
  },
  // Error page
  errorPageHeadingTitle404: 'Nous ne pouvons trouver cette page Web',
  errorPageHeadingTitle500: 'Nous éprouvons des difficultés avec cette page',
  errorPageHeadingTitle503: 'Le service est actuellement indisponible',
  errorPageErrorText404:
    "Nous sommes désolés que vous ayez abouti ici. Il arrive parfois qu'une page ait été déplacée ou supprimée. Heureusement, nous pouvons vous aider à trouver ce que vous cherchez.",
  errorPageErrorText500:
    'Nous espérons résoudre le problème sous peu. Il ne s’agit pas d’un problème avec votre ordinateur ou Internet, mais plutôt avec le serveur de notre site Web. Nous nous excusons de cet inconvénient.',
  errorPageErrorText503:
    'Le serveur Web auquel vous tentez d’accéder est actuellement surchargé ou pourrait être temporairement hors service à des fins d’entretien. Nous nous excusons de cet inconvénient. ',
  errorPageNextText: 'Que faire?',
  errorTextLinkCommon: '• Accéder à la ',
  errorTextLinkCommon_2: "page d'accueil de Service Canada",
  errorTextLinkCommonLink:
    'https://www.canada.ca/fr/emploi-developpement-social/ministere/portefeuille/service-canada.html',
  errorAuthTextLinkCommon: '• Accéder au ',
  errorAuthTextLinkCommon_2:
    'tableau de bord de mon compte Mon dossier Service Canada',
  errorAuthTextLinkCommonLink:
    'https://www.canada.ca/fr/emploi-developpement-social/services/mon-dossier.html',
  error500TextLink: '• Actualisez la page ou réessayez plus tard',
  error503TextLink: '• Réessayez plus tard',
  errorPageType: 'Erreur',
  // alpha service canada labs breadcrumbs
  breadcrumb1aTitle: 'Canada.ca',
  breadcrumb1aURL: 'https://www.canada.ca',
  breadcrumb2aTitle: 'Laboratoires de Service Canada',
  breadcrumb2aURL:
    'https://alpha.service.canada.ca/fr/projets/estimateur-prestations-sv',
  // Production Canada.ca breadcrumbs
  breadcrumb1Title: 'Canada.ca',
  breadcrumb1URL: 'https://www.canada.ca',
  breadcrumb2Title: 'Prestations',
  breadcrumb2URL: 'https://www.canada.ca/fr/services/prestations.html',
  breadcrumb3Title: 'Pensions publiques',
  breadcrumb3URL:
    'https://www.canada.ca/fr/services/prestations/pensionspubliques.html',
  breadcrumb4Title: 'Sécurité de la vieillesse',
  breadcrumb4URL:
    'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse.html',
  breadcrumb5Title: 'Montant des paiements de la Sécurité de la vieillesse',
  breadcrumb5URL:
    'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse/paiements.html',
  breadcrumb6Title:
    'Estimateur des prestations de la Sécurité de la vieillesse',
  breadcrumb6URL: '/fr',
  breadcrumb7Title: 'Questions',
  breadcrumb7URL: '/fr/questions',
  title: 'Estimateur de prestations de vieillesse canadiennes',
  introPageTitle: 'Estimateur des prestations de la Sécurité de la vieillesse',
  introPageOASHeading: 'Prestations de la Sécurité de la vieillesse',
  questionPageTitle:
    'Estimateur des prestations de la Sécurité de la vieillesse : Questions',
  resultPageTitle:
    'Estimateur des prestations de la Sécurité de la vieillesse : Résultats',
  menuTitle: 'Service Canada',
  clear: 'Effacer',
  back: 'Précédent',
  faq: 'Foire Aux Questions',
  nextStep: 'Prochaine étape',
  getEstimate: 'Estimer mes prestations',
  required: '(obligatoire)',
  workInProgress: 'Cet estimateur est un travail en cours',
  workInProgressBody:
    'Vous pouvez aider à l’améliorer en donnant votre <a class="underline text-default-text generatedLink" href="https://srv217.services.gc.ca/ihst4/Intro.aspx?cid=74938e05-8e91-42a9-8e9d-29daf79f6fe0&lc=fra" target="_blank">rétroaction</a>.',
  homePageP1:
    "Utilisez cet outil pour déterminer le montant que vous pourriez recevoir des prestations de la Sécurité de la vieillesse. Veuillez noter qu'il s'agit d'un estimateur et non d'une demande de prestations.",
  homePageHeader1: 'Qui peut recevoir ces prestations',
  youMayBeEligible:
    'Vous pourriez recevoir des prestations de la Sécurité de la vieillesse si\xa0:',
  atLeast60: 'vous avez au moins 60 ans',
  headerWhatToKnow: 'Ce dont vous aurez besoin',
  haveNetIncomeLess: `votre revenu net est moins de ${getMaximumIncomeThreshold(
    Language.FR
  )}`,
  pleaseNodeText:
    "Veuillez noter qu'il s'agit d'un estimateur et non d'une demande de prestations.",
  estimatorIncludeQuestionText:
    "L'estimateur vous posera des questions au sujet de votre : ",
  ageText: '<strong>âge</strong>',
  netIncomeText: '<strong>revenu net</strong>',
  legalStatusText: '<strong>statut légal</strong>',
  residenceHistoryText: '<strong>historique de résidence</strong>',
  maritalStatusText: '<strong>état matrimonial</strong>',
  partnerText: '<strong>conjoint</strong>, le cas échéant',
  youNeedBeginningText: `Vous pouvez fournir vos renseignements actuels, ou des <strong>renseignements futurs pour utiliser l'outil à des fins de planification</strong>. Vos réponses doivent refléter ce que sera votre situation au moment où vous commencerez à recevoir votre prestation.`,
  timeToCompleteText: 'Temps requis pour obtenir une estimation',
  startBenefitsEstimator: "Démarrer l'estimateur de prestations",
  estimatorTimeEstimate:
    'Il vous faudra environ 5 à 10 minutes pour répondre aux questions et obtenir une estimation.',
  whatBenefitsIncluded: "Prestations incluses dans l'estimateur",
  benefitAvailable:
    'Une prestation imposable disponible aux personnes de 65 ans et plus',
  learnMoreAboutOldAgeSecurity: `<a className="underline text-default-text" href="${apiFr.links.overview.oas.url}" target="_blank">En savoir plus sur la pension de la Sécurité de la vieillesse</a>`,
  gisDefinitionText:
    'Une prestation non imposable disponible aux personnes qui reçoivent la pension de la Sécurité de la vieillesse, ont 65 ans et plus, ont un faible revenu, et habitent au Canada',
  learnMoreAboutGis: `<a className="underline text-default-text" href="${apiFr.links.overview.gis.url}" target="_blank">En savoir plus sur le Supplément de revenu garanti </a>`,
  alwDefinitionText:
    'Une prestation non imposable disponible aux personnes âgées de 60 à 64 ans ayant un faible revenu, qui habitent au Canada et dont le conjoint reçoit le Supplément de revenu garanti',
  learnMoreAboutAlw: `<a className="underline text-default-text" href="${apiFr.links.overview.alw.url}" target="_blank">En savoir plus sur l'Allocation</a>`,
  inflationInfo: `Les montants des prestations de la Sécurité de la vieillesse sont mis à jour tous les trimestres pour refléter les changements au coût de la vie. Si vous planifiez pour l'avenir, les montants pourraient être plus élevés en raison de l'inflation.`,
  afsDefinitionText:
    'Une prestation non imposable disponible aux personnes âgées de 60 à 64 ans ayant un faible revenu, qui habitent au Canada et dont le conjoint est décédé',
  learnMoreAboutAlws: `<a className="underline text-default-text" href="${apiFr.links.overview.alws.url}" target="_blank">En savoir plus sur l'Allocation au survivant</a>`,
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
  dateModified: 'Date de modification :',
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
  errorBoxTitle: "L'information n'a pas pu être soumise car ",
  useEstimatorIf:
    'Utilisez l’estimateur pour savoir si vous répondez à tous les critères d’admissibilité.',
  datePicker: {
    month: 'Mois',
    year: 'Année',
    day: 'Jour',
    months: {
      1: 'janvier',
      2: 'février',
      3: 'mars',
      4: 'avril',
      5: 'mai',
      6: 'juin',
      7: 'juillet',
      8: 'août',
      9: 'septembre',
      10: 'octobre',
      11: 'novembre',
      12: 'décembre',
    },
  },
  meta: {
    homeDescription: `Déterminez combien vous pourriez recevoir de la pension de la Sécurité de la vieillesse, du Supplément de revenu garanti, de l’Allocation et de l’Allocation au survivant.`,
    homeShortDescription: `Déterminez combien vous pourriez recevoir des prestations canadiennes de la Sécurité de la vieillesse.`,
    homeKeywords:
      'pension de vieillesse, sécurité de la vieillesse, calculer supplément, montant de pension, paiements sv, estimer sécurité vieillesse, prestations, finances personnelles, pension du survivant, planification de retraite',
    author: 'Service Canada',
    homeSubject: `EC Économie et industrie;Allocation;Avantages sociaux;Prestation au survivant;Finances;Finances personnelles;Revenu;Pension;Pension publique,PE Personnes;Adulte;Aîné,SO Société et culture;Vieillesse`,
  },
  resultsPage: {
    header: "Tableau des résultats d'estimation",
    general: `Les résultats suivants ne sont qu'une estimation de votre admissibilité et de vos paiements mensuels <span style="font-weight: bold;">basée sur les montants actuels</span>. Ceux-ci peuvent augmenter avec le coût de la vie. Des changements dans votre situation pourraient aussi modifier vos résultats`,
    onThisPage: 'Sur cette page',
    tableHeader1: 'Prestations',
    tableHeader2: 'Montant mensuel estimé (CAD)',
    tableTotalAmount: 'Total',
    whatYouToldUs: 'Vos renseignements',
    youMayBeEligible: 'Vous pourriez être admissible',
    youAreNotEligible: "Vous n'êtes probablement pas admissible pour le moment",
    partnerNotEligible:
      "Votre conjoint n'est probablement pas admissible pour le moment",
    basedOnYourInfoEligible:
      'Selon vos renseignements, vous pourriez être admissible aux prestations suivantes :',
    basedOnYourInfoAndIncomeEligible:
      'En fonction de vos revenus et en fonction de vos informations, vous pourriez être éligible à :',
    basedOnYourInfoNotEligible: `Selon vos informations, vous n'êtes peut-être pas admissible aux prestations de la Sécurité de la vieillesse. Voir ci-dessous, ou ${generateLink(
      apiFr.links.SC
    )} pour plus de détails.`,
    basedOnPartnerInfoNotEligible: `Selon vos informations, votre conjoint n'est peut-être pas admissible aux prestations de la Sécurité de la vieillesse. Voir ci-dessous, ou ${generateLink(
      apiFr.links.SC
    )} pour plus de détails.`,
    yourEstimatedTotal: ' Votre estimation',
    partnerEstimatedTotal: " L'estimation de votre conjoint",
    yourEstimatedNoIncome: ' Vous êtes probablement admissible',
    basedOnYourInfoTotal: 'Votre pourriez être admissible à recevoir :',
    basedOnYourInfoAndIncomeTotal:
      'Votre pourriez être admissible à recevoir :',
    basedOnPartnerInfoTotal:
      'Votre conjoint pourrait être admissible à recevoir :',
    basedOnPartnerInfoAndIncomeTotal:
      'Votre conjoint pourrait être admissible à recevoir :',
    total: 'Votre montant total par mois est ',
    futureTotal: 'Votre montant total par mois sera ',
    partnerTotal: 'Son montant total par mois est ',
    futurePartnerTotal: 'Son montant total par mois sera ',
    ifIncomeNotProvided:
      'Cependant, ce montant pourrait être inférieur ou supérieur selon votre revenu.',
    nextSteps:
      'Prochaines étapes pour les prestations auxquelles vous pourriez être admissible',
    youMayNotBeEligible:
      'Prestations auxquelles vous pourriez ne pas être admissible',
    noAnswersFound: 'Aucune réponse trouvée',
    noBenefitsFound: 'Aucune prestations trouvée',
    edit: 'Modifier',
    info: 'info',
    note: 'remarque',
    link: 'lien',
    nextStepTitle: 'Prochaines étapes',
    nextStepGis:
      'Vous pouvez faire une demande pour le Supplément de revenu garanti lorsque vous présentez votre demande pour la pension de la Sécurité de la vieillesse.',
    CTATitle: 'Informez-vous sur vos options de retraite',
    CTABody:
      'Renseignez-vous sur les pensions publiques, le meilleur moment pour commencer à les recevoir et les conseils pour maximiser votre revenu de retraite.',
    CTAButton: 'Visiter le Carrefour retraite',
    month: 'mois',
    futureEligible: ' Vous serez probablement admissible',
    partnerFutureEligible: ' Votre conjoint sera probablement admissible',
    toReceive: 'vous pourriez être admissible à recevoir :',
    partnerToReceive: 'votre conjoint pourrait être admissible à recevoir :',
    theyToReceive: 'il pourrait être admissible à recevoir :',
  },
  resultsQuestions: apiFr.questionShortText,
  resultsEditAriaLabels: apiFr.questionAriaLabel,
  modifyAnswers: 'Modifier vos réponses',
  errors: {
    empty: 'Ce renseignement est requis',
  },
  validationErrors: {
    [ValidationErrors.invalidAge]: `Veuillez entrer une année entre 1900 et ${getMaxYear()}.`,
    [ValidationErrors.receiveOASEmpty]:
      //'Veuillez indiquer si vous recevez la pension de la SV.',
      'Veuillez indiquer si vous recevez la pension de la Sécurité de la vieillesse',
    [ValidationErrors.providePartnerIncomeEmpty]:
      'Veuillez indiquer si vous êtes en mesure de fournir le revenu de votre conjoint.',
    [ValidationErrors.incomeWorkEmpty]:
      'Veuillez entrer vos revenus d’emploi ou de travail indépendant.',
    [ValidationErrors.incomeWorkGreaterThanNetIncome]:
      'Ce montant ne peut pas être plus élevé que votre revenu annuel net.',
    [ValidationErrors.partnerIncomeWorkEmpty]:
      'Veuillez entrer les revenus d’emploi ou de travail indépendant de votre conjoint.',
    [ValidationErrors.partnerIncomeWorkGreaterThanNetIncome]:
      'Ce montant ne peut pas être plus élevé que le revenu annuel net de votre conjoint.',
    [ValidationErrors.partnerIncomeEmpty]:
      'Veuillez entrer le revenu net prévu de votre conjoint.',
    [ValidationErrors.partnerIncomeEmptyReceiveOAS]:
      'Veuillez entrer le revenu net de votre conjoint.',
    [ValidationErrors.partnerYearsSince18Empty]:
      'Veuillez entrer un nombre qui ne dépasse pas l’âge de votre conjoint moins 18 ans.',
    [ValidationErrors.maritalStatusEmpty]:
      'Veuillez sélectionner un état matrimonial.',
    [ValidationErrors.yearsInCanadaMinusAge]:
      'Veuillez entrer un nombre qui ne dépasse pas votre âge moins 18 ans.',
    [ValidationErrors.legalStatusNotSelected]:
      'Veuillez indiquer si vous avez un statut légal au Canada.',
    [ValidationErrors.partnerLegalStatusNotSelected]:
      'Veuillez indiquer si votre conjoint a un statut légal au Canada.',
    [ValidationErrors.partnerBenefitStatusEmpty]:
      'Veuillez indiquer si votre conjoint reçoit la pension de la Sécurité de la vieillesse.',
    [ValidationErrors.onlyInCanadaEmpty]:
      'Veuillez indiquer si vous seulement vécu àu Canada.',
    [ValidationErrors.partnerOnlyInCanadaEmpty]:
      'Veuillez indiquer si votre conjoint a seulement vécu au Canada.',
    [ValidationErrors.invSeparatedEmpty]:
      'Veuillez indiquer si vous êtes involontairement séparé.',
    [ValidationErrors.socialCountryEmpty]:
      'Veuillez indiquer si vous avez déjà vécu dans un pays ayant un accord de sécurité sociale avec le Canada.',
    [ValidationErrors.partnerSocialCountryEmpty]:
      'Veuillez indiquer si votre conjoint a déjà vécu dans un pays ayant un accord de sécurité sociale avec le Canada.',
    [ValidationErrors.provideIncomeEmpty]:
      'Veuillez indiquer si vous êtes en mesure de fournir votre revenu.',
    [ValidationErrors.incomeEmpty]: 'Veuillez entrer votre revenu net prévu.',
    [ValidationErrors.incomeEmptyReceiveOAS]:
      'Veuillez entrer votre revenu net.',
    [ValidationErrors.oasDeferEmpty]:
      'Veuillez sélectionner quand vous souhaitez commencer à recevoir la pension de la SV.',
    [ValidationErrors.incomeBelowZero]:
      'Vos revenus doivent être supérieurs à zéro.',
    [ValidationErrors.partnerIncomeBelowZero]:
      'Les revenus de votre partenaire doivent être supérieurs à zéro.',
    [ValidationErrors.incomeTooHigh]:
      "Votre revenu annuel doit être inférieur à {OAS_MAX_INCOME} pour recevoir l'une des prestations couvertes par cet outil.",
    [ValidationErrors.partnerIncomeTooHigh]:
      "La somme de votre revenu annuel et de celui de votre partenaire doit être inférieure à {OAS_MAX_INCOME} pour bénéficier de l'une des prestations couvertes par cet outil.",
    [ValidationErrors.ageUnder18]: 'Vous devez avoir au moins 18 ans.',
    [ValidationErrors.partnerAgeUnder18]:
      'Votre conjoint doit avoir au moins 18 ans.',
    [ValidationErrors.ageOver150]: 'Votre âge doit être inférieur à 150 ans.',
    [ValidationErrors.partnerAgeOver150]:
      "L'âge de votre partenaire doit être inférieur à 150 ans.",
    [ValidationErrors.oasAge65to70]:
      'Veuillez entrer un âge entre 65 et 70 ans.',
    [ValidationErrors.yearsInCanadaNotEnough10]:
      "Votre devez avoir vécu au Canada pendant au moins 10 ans pour recevoir l'une des prestations incluses dans cet outil.",
    [ValidationErrors.yearsInCanadaNotEnough20]:
      "Votre devez avoir vécu au Canada pendant au moins 20 ans pour recevoir l'une des prestations incluses dans cet outil.",
    [ValidationErrors.partnerYearsInCanadaMinusAge]:
      "Le nombre d'années de votre partenaire au Canada ne doit pas dépasser son âge moins 18 ans.",
    [ValidationErrors.maritalUnavailable]:
      "Vous avez indiqué un état matrimonial qui n'est pas couvert par cet outil. Pour obtenir de l'aide, {LINK_SERVICE_CANADA}.",
    [ValidationErrors.legalUnavailable]:
      "Vous devez avoir un statut légal au Canada pour recevoir les prestations incluses dans cet outil. Pour obtenir de l'aide, {LINK_SERVICE_CANADA}.",
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

  duration: {
    months: 'Mois',
    years: 'Années',
  },
  incomeLabel:
    'Quel sera votre revenu annuel net lorsque vous commencerez à recevoir vos prestations?',
  incomeLabelReceiveOAS: 'Quel est votre revenu annuel net?',
  partnerIncomeLabel:
    'Quel sera le revenu annuel net de votre conjoint lorsque vous commencerez à recevoir vos prestations?',
  partnerIncomeLabelReceiveOAS:
    'Quel est le revenu annuel net de votre conjoint?',
  incomeHintTitle: 'Ce revenu sera-t-il utilisé dans votre demande?',
  incomeHintTitleReceiveOAS: 'Votre revenu va bientôt changer?',
  incomeHintText:
    "<div style='margin-bottom: 16px;'> \
  <p style='padding-bottom: 8px; color: rgba(92, 92, 92, 1);'> \
  Non, il s’agit d’une estimation. Vos <a style='text-decoration: underline; color: rgba(40, 65, 98, 1);' href='https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse/supplement-revenu-garanti/demande.html#h2.2-3.1' target='_blank'>revenus et exemptions<img style='padding: 0px 0px 3px 4px; display: inline-block;' src='/openNewTab.svg'/></a> réels seront évalués lors de votre demande. \
  </p> \
</div> \
",
  incomeHintTextReceiveOAS:
    "<div style='margin-bottom: 16px;'> \
  <p style='padding-bottom: 8px; color: rgba(92, 92, 92, 1);'> \
  Si vous prévoyez une baisse de revenu, vous pouvez entrer votre revenu prévu. <a style='text-decoration: underline; color: rgba(40, 65, 98, 1);' href='https://www.canada.ca/fr/emploi-developpement-social/ministere/coordonnees/sv.html' target='_blank'>Communiquez avec nous<img style='padding: 0px 0px 3px 4px; display: inline-block;' src='/openNewTab.svg'/></a> pour signaler cet événement. \
  </p> \
</div> \
",
  partnerIncomeHintTitleReceiveOAS: 'Son revenu va bientôt changer?',
  partnerIncomeHintText:
    "<div style='margin-bottom: 16px;'> \
  <p style='padding-bottom: 8px; color: rgba(92, 92, 92, 1);'> \
  Non, il s’agit d’une estimation. Ses <a style='text-decoration: underline; color: rgba(40, 65, 98, 1);' href='https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse/supplement-revenu-garanti/demande.html#h2.2-3.1' target='_blank'>revenus et exemptions<img style='padding: 0px 0px 3px 4px; display: inline-block;' src='/openNewTab.svg'/></a> réels seront évalués lors de votre demande. \
  </p> \
</div> \
",
  partnerIncomeHintTextReceiveOAS:
    "<div style='margin-bottom: 16px;'> \
  <p style='padding-bottom: 8px; color: rgba(92, 92, 92, 1);'> \
  Si votre conjoint prévoit une baisse de revenu, vous pouvez entrer son revenu prévu. <a style='text-decoration: underline; color: rgba(40, 65, 98, 1);' href='https://www.canada.ca/fr/emploi-developpement-social/ministere/coordonnees/sv.html' target='_blank'>Communiquez avec nous<img style='padding: 0px 0px 3px 4px; display: inline-block;' src='/openNewTab.svg'/></a> pour signaler cet événement. \
  </p> \
</div> \
",
}

export default fr
