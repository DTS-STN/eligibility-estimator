// noinspection SpellCheckingInspection

import {
  FieldCategory,
  Language,
  LegalStatus,
  MaritalStatus,
  PartnerBenefitStatus,
} from '../../utils/api/definitions/enums'
import { livingCountry } from './countries/fr'
import { Translations } from './index'
import { links } from './links/fr'

const fr: Translations = {
  _language: Language.FR,
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
    incomeDependent: 'Revenu manquant',
  },
  question: {
    incomeAvailable:
      'Êtes-vous en mesure de nous fournir votre revenu net annuel?',
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
    partnerIncomeAvailable:
      'Êtes-vous en mesure de nous fournir le revenu net annuel de votre partenaire?',
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
      'Votre conjoint-a-til déjà vécu dans un pays ayant un {LINK_SOCIAL_AGREEMENT} avec le Canada?',
  },
  questionShortText: {
    age: 'Âge',
    oasDefer: 'Report de la SV',
    oasAge: 'Âge de report de la SV',
    incomeAvailable: 'Revenu fourni',
    income: 'Revenu net',
    legalStatus: 'Statut légal',
    livingCountry: 'Pays de résidence',
    livedOutsideCanada: "A vécu à l'extérieur du Canada pendant plus de 6 mois",
    yearsInCanadaSince18: "Années vécues à l'extérieur du Canada",
    everLivedSocialCountry: 'A vécu dans un pays avec un accord social',
    maritalStatus: 'État civil',
    partnerIncomeAvailable: 'Revenu du partenaire fourni',
    partnerIncome: 'Revenu net du partenaire',
    partnerBenefitStatus: 'Prestations de vieillesse du partenaire',
    partnerAge: 'Âge du partenaire',
    partnerLegalStatus: 'Statut juridique du partenaire',
    partnerLivingCountry: 'Pays de résidence du partenaire',
    partnerLivedOutsideCanada:
      "Le partenaire a vécu à l'extérieur du Canada pendant plus de 6 mois",
    partnerYearsInCanadaSince18:
      "Années du partenaire vécues à l'extérieur du Canada",
    partnerEverLivedSocialCountry:
      'Le partenaire vivait dans un pays avec un accord social',
  },
  questionHelp: {
    incomeAvailable:
      'Fournir votre revenu vous donnera des résultats plus utiles et plus précis.',
    partnerIncomeAvailable:
      'Fournir le revenu de votre partenaire vous donnera des résultats plus utiles et plus précis.',
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
    incomeAvailable: [
      {
        key: true,
        text: 'Oui, je fournirai mes revenus',
      },
      {
        key: false,
        text: 'Non, je ne fournirai pas mes revenus pour le moment',
      },
    ],
    partnerIncomeAvailable: [
      {
        key: true,
        text: 'Oui, je fournirai les revenus de mon partenaire',
      },
      {
        key: false,
        text: 'Non, je ne fournirai pas les revenus de mon partenaire pour le moment',
      },
    ],
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
    eligibleDependingOnIncome:
      'Vous êtes probablement éligible à cette prestation si {INCOME_SINGLE_OR_COMBINED} est inférieur à {INCOME_LESS_THAN}.',
    eligibleDependingOnIncomeNoEntitlement:
      "Vous êtes probablement éligible à cette prestation si {INCOME_SINGLE_OR_COMBINED} est inférieur à {INCOME_LESS_THAN}. Une estimation des droits n'est pas disponible à moins que vous ne fournissiez votre revenu.",
    eligibleEntitlementUnavailable:
      "Vous êtes probablement admissible à cette prestation, mais une estimation du droit à cette prestation n'est pas disponible. Vous devriez communiquer avec {LINK_SERVICE_CANADA} pour obtenir plus de renseignements sur le montant de vos paiements.",
    eligiblePartialOas:
      'Vous êtes probablement admissible à une pension partielle de la Sécurité de la vieillesse.',
    eligibleWhen60ApplyNow:
      'Vous serez probablement admissible à votre 60e anniversaire. Par contre, vous pourriez être en mesure de présenter une demande dès maintenant. Veuillez communiquer avec {LINK_SERVICE_CANADA} pour en savoir plus.',
    eligibleWhen65ApplyNow:
      'Vous serez probablement admissible à votre 65e anniversaire. Par contre, vous pourriez être en mesure de présenter une demande dès maintenant. Veuillez communiquer avec {LINK_SERVICE_CANADA} pour en savoir plus.',
    eligibleWhen60:
      'Vous serez probablement admissible à votre 60e anniversaire.',
    eligibleWhen65:
      'Vous serez probablement admissible à votre 65e anniversaire.',
    mustBeInCanada:
      'Vous devez vivre au Canada pour être admissible à cette prestation.',
    mustBeOasEligible:
      'Vous devez être admissible à la Sécurité de la vieillesse pour être admissible à cette prestation.',
    mustCompleteOasCheck:
      "Vous devez d'abord compléter l'évaluation d'admissibilité à la Sécurité de la vieillesse.",
    mustMeetIncomeReq:
      '{INCOME_SINGLE_OR_COMBINED} est trop élevé pour que vous soyez admissible à cette prestation.',
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
    alwNotEligible:
      "L'allocation s'adresse aux personnes âgées de 60 à 64 ans dont le partenaire (époux ou conjoint de fait) reçoit le Supplément de revenu garanti.",
    afsNotEligible:
      "L'Allocation au survivant s'adresse aux personnes âgées de 60 à 64 ans dont le partenaire (époux ou conjoint de fait) est décédé.",
    autoEnrollTrue:
      "D'après ce que vous nous avez dit, vous <strong>n'avez pas besoin de faire une demande</strong> pour obtenir cette prestation. Vous recevrez une lettre par la poste vous informant de votre <strong>inscription automatique</strong> le mois suivant vos 64 ans.",
    autoEnrollFalse:
      "Selon ce que vous nous avez dit, <strong>vous devrez peut-être demander cette prestation</strong>. Nous ne disposons peut-être pas de suffisamment d'informations pour vous inscrire automatiquement.",
    expectToReceive:
      'Vous devriez vous attendre à recevoir environ {ENTITLEMENT_AMOUNT} par mois.',
  },
  detailWithHeading: {
    oasDeferralApplied: {
      heading: 'Comment le report affecte vos paiements',
      text: 'Vous avez reporté vos prestations de la SV de {OAS_DEFERRAL_YEARS}. Cela signifie que vos paiements de la SV commenceront une fois que vous aurez {OAS_DEFERRAL_AGE} ans et que vous recevrez {OAS_DEFERRAL_INCREASE} supplémentaires par mois.',
    },
    oasDeferralAvailable: {
      heading: 'Vous pouvez peut-être différer vos paiements',
      text: 'Pour en savoir plus sur la possibilité de reporter votre premier paiement, {LINK_OAS_DEFER_CLICK_HERE}.',
    },
    oasClawback: {
      heading: 'Vous devrez peut-être rembourser une partie de votre pension',
      text: 'Étant donné que {INCOME_SINGLE_OR_COMBINED} dépasse {OAS_RECOVERY_TAX_CUTOFF}, vous devrez peut-être rembourser {OAS_CLAWBACK} en {LINK_RECOVERY_TAX}.',
    },
    oasIncreaseAt75: {
      heading: 'Vos paiements augmenteront lorsque vous atteindrez 75 ans',
      text: "Une fois que vous aurez atteint l'âge de 75 ans, vos paiements de la SV augmenteront de 10 %, ce qui signifie que vous recevrez {OAS_75_AMOUNT} par mois.",
    },
    oasIncreaseAt75Applied: {
      heading: 'Vos versements ont augmenté car vous avez plus de 75 ans',
      text: 'Puisque vous avez plus de 75 ans, vos versements de la SV ont été augmentés de 10 %.',
    },
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
  incomeSingle: 'votre revenu',
  incomeCombined: 'le revenu combiné de vous et de votre partenaire',
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
  year: 'an',
}
export default fr
