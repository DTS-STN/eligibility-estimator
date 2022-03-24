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
    "L'Estimateur Canadien des Prestations de Vieillesse est un prototype en construction. À partir des renseignements que vous fournissez, cet outil estime votre admissibilité à la Sécurité de la vieillesse (SV), au Supplément de revenu garanti (SRG), l'Allocation, et L'Allocation au survivant. Si vous êtes admissible à la prestation, il estime également votre paiement mensuel.",
  homePageHeader1: 'Types de programmes de prestations',
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
    tableTotalAmount: 'Montant total des prestations mensuelles',
  },
  moreInfoHeader: "Besoin de plus d'information",
  modifyAnswers: 'Modifier vos réponses',
  modifyAnswersText:
    'Si vous avez fait une erreur en remplissant le formulaire, ou si vous souhaitez modifier vos réponses pour voir ce qui se passerait dans un scénario différent, veuillez utiliser le bouton ci-dessous pour modifier vos réponses.',
  errors: {
    empty: 'Ce renseignement est requis',
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
