// noinspection SpellCheckingInspection

import {
  FieldCategory,
  Language,
  LegalStatus,
  Locale,
  MaritalStatus,
  PartnerBenefitStatus,
} from '../../utils/api/definitions/enums'
import { livingCountry } from './countries/fr'
import { Translations } from './index'
import { links } from './links/fr'

const fr: Translations = {
  _language: Language.FR,
  _locale: Locale.FR,
  benefit: {
    oas: 'Sécurité de la vieillesse (SV)',
    gis: 'Supplément de revenu garanti (SRG)',
    alw: 'Allocation',
    afs: 'Allocation au survivant',
  },
  category: {
    [FieldCategory.AGE]: 'Âge',
    [FieldCategory.INCOME]: 'Revenu',
    [FieldCategory.LEGAL]: 'Statut légal',
    [FieldCategory.RESIDENCE]: 'Historique des résidences',
    [FieldCategory.MARITAL]: 'État civil',
  },
  result: {
    eligible: 'Admissible',
    ineligible: 'Non admissible',
    unavailable: 'Non disponible',
    moreInfo: "Besoin de plus d'information...",
    invalid: "Votre demande n'est pas valide!",
  },
  question: {
    income:
      'Quel est votre revenu annuel net (revenu après impôts) en dollars canadiens?',
    age: 'Quel âge avez-vous?',
    oasDefer: 'Quand souhaitez-vous commencer à recevoir la SV?',
    oasAge: "Entrez l'âge auquel vous souhaitez commencer à recevoir la SV.",
    maritalStatus: 'Quel est votre état civil actuel?',
    livingCountry: 'Dans quel pays résidez-vous?',
    legalStatus: 'Quel est votre statut légal au Canada?',
    livedOutsideCanada:
      "Depuis l'âge de 18 ans, avez-vous vécu à l'extérieur du Canada pendant plus de 6 mois?",
    yearsInCanadaSince18:
      "Depuis l'âge de 18 ans, combien d'années avez-vous vécu au Canada?",
    everLivedSocialCountry:
      'Avez-vous déjà vécu dans un pays ayant un {LINK_SOCIAL_AGREEMENT} avec le Canada?',
    partnerBenefitStatus:
      "Laquelle des options suivantes s'applique à votre conjoint?",
    partnerIncome:
      'Quel est le revenu annuel net de votre conjoint en dollars canadiens?',
    partnerAge: "Quel est l'âge actuel de votre conjoint?",
    partnerLivingCountry: 'Dans quel pays habite actuellement votre conjoint?',
    partnerLegalStatus: 'Quel est le statut légal actuel de votre conjoint?',
    partnerLivedOutsideCanada:
      "Depuis l'âge de 18 ans, votre conjoint a-t-il vécu à l'extérieur du Canada pendant plus de 6 mois?",
    partnerYearsInCanadaSince18:
      "Depuis l'âge de 18 ans, combien d'années votre conjoint a-t-il habité au Canada?",
    partnerEverLivedSocialCountry:
      'FRENCH: Has your partner ever lived in a country with an established {LINK_SOCIAL_AGREEMENT}?',
  },
  questionHelp: {
    age: 'Vous pouvez entrer votre âge actuel, ou un âge futur à des fins de planification.',
    oasDefer:
      'Si vous recevez déjà la SV, indiquez quand vous avez commencé à la recevoir.</br>En savoir plus sur {LINK_OAS_DEFER_INLINE}.',
    oasAge: 'Celui-ci doit être compris entre 65 et 70.',
    income:
      'Vous trouverez votre revenu net à la ligne 23600 de votre déclaration de revenus.',
    yearsInCanadaSince18:
      "Si vous n'êtes pas certain du nombre exact, vous pouvez entrer une estimation. Vous pourrez quand même voir le montant que vous pourriez recevoir.",
  },
  questionOptions: {
    oasDefer: [
      {
        key: false,
        text: "Je voudrais commencer à recevoir la SV quand j'aurai 65 ans (le plus courant)",
      },
      {
        key: true,
        text: 'Je voudrais retarder le moment où je commencerai à recevoir la SV (paiements mensuels plus élevés)',
      },
    ],
    legalStatus: [
      { key: LegalStatus.CANADIAN_CITIZEN, text: 'Citoyen canadien' },
      {
        key: LegalStatus.PERMANENT_RESIDENT,
        text: 'Résident permanent ou immigrant reçu (non parrainé)',
      },
      {
        key: LegalStatus.SPONSORED,
        text: 'Résident permanent ou immigrant reçu (parrainé)',
      },
      {
        key: LegalStatus.INDIAN_STATUS,
        text: "Statut d'Indien ou carte de statut",
      },
      {
        key: LegalStatus.OTHER,
        text: 'Autre (par exemple, résident temporaire, étudiant, travailleur temporaire)',
      },
    ],
    livedOutsideCanada: [
      {
        key: false,
        text: "Non, je n'ai pas vécu à l'extérieur du Canada pendant plus de 6 mois.",
      },
      {
        key: true,
        text: "Oui, j'ai vécu à l'extérieur du Canada pendant plus de 6 mois.",
      },
    ],
    partnerLivedOutsideCanada: [
      {
        key: false,
        text: "Non, mon conjoint n'a pas vécu à l'extérieur du Canada pendant plus de 6 mois.",
      },
      {
        key: true,
        text: "Oui, mon conjoint a vécu à l'extérieur du Canada pendant plus de 6 mois.",
      },
    ],
    maritalStatus: [
      {
        key: MaritalStatus.SINGLE,
        text: 'Célibataire, divorcé(e), ou séparé(e)',
      },
      {
        key: MaritalStatus.PARTNERED,
        text: 'Marié(e) ou conjoint(e) de fait',
      },
      {
        key: MaritalStatus.WIDOWED,
        text: 'Partenaire survivant(e) ou veuf(ve)',
      },
      {
        key: MaritalStatus.INV_SEPARATED,
        text: 'Involontairement séparé(e)',
      },
    ],
    partnerBenefitStatus: [
      {
        key: PartnerBenefitStatus.OAS,
        text: 'Mon conjoint reçoit la pension de la Sécurité de la vieillesse',
      },
      {
        key: PartnerBenefitStatus.OAS_GIS,
        text: 'Mon conjoint reçoit la pension de la Sécurité de la vieillesse et le Supplément de revenu garanti',
      },
      {
        key: PartnerBenefitStatus.ALW,
        text: "Mon conjoint reçoit l'Allocation",
      },
      { key: PartnerBenefitStatus.NONE, text: 'Aucune des réponses' },
      { key: PartnerBenefitStatus.HELP_ME, text: 'Aidez-moi à trouver' },
    ],
    livingCountry,
  },
  detail: {
    eligible:
      "D'après les informations fournies, vous êtes probablement admissible à cette prestation.",
    eligibleOas65to69:
      'Vous êtes probablement admissible à cette prestation. Pour en savoir plus sur la possibilité de reporter votre premier paiement, {LINK_OAS_DEFER_CLICK_HERE}.',
    eligibleEntitlementUnavailable:
      "Vous êtes probablement admissible à cette prestation, mais une estimation du droit à cette prestation n'est pas disponible. Vous devriez communiquer avec {LINK_SERVICE_CANADA} pour obtenir plus de renseignements sur le montant de vos paiements.",
    eligiblePartialOas:
      'Vous êtes probablement admissible à une pension partielle de la Sécurité de la vieillesse.',
    eligiblePartialOas65to69:
      'Vous êtes probablement admissible à une pension partielle de la Sécurité de la vieillesse. Pour en savoir plus sur la possibilité de reporter votre premier paiement, {LINK_OAS_DEFER_CLICK_HERE}.',
    eligibleWhen60ApplyNow:
      'Vous serez probablement admissible à votre 60e anniversaire. Par contre, vous pourriez être en mesure de présenter une demande dès maintenant. Veuillez communiquer avec {LINK_SERVICE_CANADA} pour en savoir plus.',
    eligibleWhen65ApplyNowOas:
      'Vous serez probablement admissible à votre 65e anniversaire. Par contre, vous pourriez être en mesure de présenter une demande dès maintenant. Veuillez communiquer avec {LINK_SERVICE_CANADA} pour en savoir plus. Pour en savoir plus sur la possibilité de reporter votre premier paiement, {LINK_OAS_DEFER_CLICK_HERE}.',
    eligibleWhen60:
      'Vous serez probablement admissible à votre 60e anniversaire.',
    eligibleWhen65:
      'Vous serez probablement admissible à votre 65e anniversaire.',
    mustBe60to64:
      'Vous devez avoir entre 60 et 64 ans pour être admissible à cette prestation.',
    mustBeInCanada:
      'Vous devez vivre au Canada pour être admissible à cette prestation.',
    mustBeOasEligible:
      'Vous devez être admissible à la Sécurité de la vieillesse pour être admissible à cette prestation.',
    mustCompleteOasCheck:
      "Vous devez d'abord compléter l'évaluation d'admissibilité à la Sécurité de la vieillesse.",
    mustBeWidowed:
      'Vous devez être un partenaire survivant ou un veuf pour être admissible à cette prestation.',
    mustBePartnered:
      'Vous devez être conjoint de fait ou marié pour être admissible à cette prestation.',
    mustHavePartnerWithGis:
      'Votre partenaire doit recevoir le supplément de revenu garanti pour être admissible à cette prestation.',
    mustMeetIncomeReq:
      'Votre revenu est trop élevé pour que vous soyez admissible à cette prestation.',
    mustMeetYearReq:
      "Vous n'avez pas vécu au Canada pendant le nombre d'années requis pour être admissible à cette prestation.",
    conditional:
      'Vous pourriez être admissible à cette prestation. Nous vous invitons à communiquer avec Service Canada pour obtenir une meilleure évaluation.',
    dependingOnAgreement:
      "Vous pourriez être admissible à cette prestation, selon l'accord que le Canada a avec ce pays. Nous vous invitons à communiquer avec Service Canada pour obtenir une meilleure évaluation.",
    dependingOnAgreementWhen60:
      "Vous pourriez avoir droit à cette prestation à votre 60e anniversaire, selon l'entente entre le Canada et ce pays. Nous vous invitons à communiquer avec Service Canada  pour obtenir une meilleure évaluation.",
    dependingOnAgreementWhen65:
      "Vous pourriez être admissible à cette prestation à votre 65e anniversaire, selon l'entente entre le Canada et ce pays. Nous vous invitons à communiquer avec Service Canada pour obtenir une meilleure évaluation.",
    dependingOnLegal:
      'Vous pourriez être admissible à cette prestation, selon votre statut légal au Canada. Nous vous invitons à communiquer avec Service Canada pour obtenir une meilleure évaluation.',
    dependingOnLegalSponsored:
      'Vous pourriez être admissible à cette prestation. Nous vous invitons à communiquer avec Service Canada pour obtenir une meilleure évaluation.',
    dependingOnLegalWhen60:
      'Vous pourriez être admissible à cette prestation à votre 60e anniversaire, selon votre statut légal au Canada. Nous vous invitons à communiquer avec Service Canada pour obtenir une meilleure évaluation.',
    dependingOnLegalWhen65:
      'Vous pourriez être admissible à cette prestation à votre 65e anniversaire, selon votre statut légal au Canada. Nous vous invitons à communiquer avec Service Canada pour obtenir une meilleure évaluation.',
    additionalReasons:
      "{LINK_MORE_REASONS} pour les raisons additionnelles possibles d'inéligibilité.",
    oasClawback:
      'Vous devrez peut-être rembourser {OAS_CLAWBACK} {LINK_RECOVERY_TAX} car vous revenus sont supérieurs à {OAS_RECOVERY_TAX_CUTOFF}.',
    oasIncreaseAt75:
      "Une fois que vous atteignez l'âge de 75 ans, cela augmentera de 10%, à {OAS_75_AMOUNT}",
    oasIncreaseAt75Applied:
      'Comme vous avez plus de 75 ans, votre droit à la SV a été augmenté de 10 %.',
    oasDeferralIncrease:
      'En différant de {OAS_DEFERRAL_YEARS} ans, votre pension de la SV est augmentée de {OAS_DEFERRAL_INCREASE}.',
  },
  summaryTitle: {
    moreInfo: 'Plus de renseignements sont nécessaires',
    unavailable: 'Impossible de fournir une estimation',
    availableEligible: 'Probablement admissible aux prestations',
    availableIneligible: 'Probablement non admissible aux prestations',
  },
  summaryDetails: {
    moreInfo:
      "Veuillez remplir le formulaire. Selon les renseignements que vous fournirez aujourd'hui, l'application estimera votre admissibilité. Si vous êtes admissible, l'application fournira également une estimation de votre paiement mensuel.",
    unavailable:
      "Selon les renseignements que vous avez fournis aujourd'hui, nous sommes incapables de déterminer votre admissibilité. Nous vous invitons à communiquer avec {LINK_SERVICE_CANADA}.",
    availableEligible:
      "Selon les renseignements que vous avez fournis aujourd'hui, vous êtes probablement admissible à un montant mensuel total estimé à {ENTITLEMENT_AMOUNT}. Notez que les montants ne sont qu'une estimation de votre paiement mensuel. Des changements dans votre situation peuvent affecter vos résultats.",
    availableIneligible:
      "Selon les renseignements que vous avez fournis aujourd'hui, vous n'avez probablement pas droit à des prestations. Voir les détails ci-dessous pour en savoir plus.",
  },
  links,
  csv: {
    appName: 'Estimateur Canadien des Prestations de Vieillesse',
    formResponses: 'RÉPONSES DU FORMULAIRE',
    question: 'Question',
    answer: 'Réponse',
    estimationResults: "RÉSULTATS DE L'ESTIMATION",
    benefit: 'Prestation',
    eligibility: 'Admissibilité',
    details: 'Détails',
    entitlement: 'Montant mensuel estimé',
    links: 'LIENS',
    description: 'Description',
    url: 'URL',
  },
  yes: 'Oui',
  no: 'Non',
}
export default fr
