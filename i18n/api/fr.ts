// noinspection SpellCheckingInspection

import {
  BenefitKey,
  FieldCategory,
  Language,
  LegalStatus,
  MaritalStatus,
  PartnerBenefitStatus,
  ResultKey,
  SummaryState,
} from '../../utils/api/definitions/enums'
import { FieldKey } from '../../utils/api/definitions/fields'
import { livingCountry } from './countries/fr'
import { Translations } from './index'
import { links } from './links/fr'

const fr: Translations = {
  _language: Language.FR,
  benefit: {
    [BenefitKey.oas]: 'Pension de la Sécurité de la vieillesse',
    [BenefitKey.gis]: 'Supplément de revenu garanti',
    [BenefitKey.alw]: 'Allocation',
    [BenefitKey.afs]: 'Allocation au survivant',
  },
  category: {
    [FieldCategory.AGE]: 'Âge',
    [FieldCategory.INCOME]: 'Revenu',
    [FieldCategory.LEGAL]: 'Statut légal',
    [FieldCategory.RESIDENCE]: 'Historique de résidence',
    [FieldCategory.MARITAL]: 'État civil',
  },
  result: {
    [ResultKey.ELIGIBLE]: 'Admissible',
    [ResultKey.INELIGIBLE]: 'Non admissible',
    [ResultKey.UNAVAILABLE]: 'Non disponible',
    [ResultKey.MORE_INFO]: "Besoin de plus d'information...",
    [ResultKey.INVALID]: "Votre demande n'est pas valide!",
    [ResultKey.INCOME_DEPENDENT]: 'Revenu manquant',
  },
  question: {
    [FieldKey.INCOME_AVAILABLE]:
      'Êtes-vous en mesure de nous fournir votre revenu net annuel?',
    [FieldKey.INCOME]:
      'Quel est votre revenu annuel net (revenu après impôts) en dollars canadiens?',
    [FieldKey.AGE]: 'En quel mois et quelle année êtes-vous né?',
    [FieldKey.OAS_DEFER]:
      'Quand souhaitez-vous commencer à recevoir la pension de la Sécurité de la vieillesse (SV)?',
    [FieldKey.OAS_AGE]:
      'À quel âge aimeriez-vous commencer à recevoir la pension de la SV?',
    [FieldKey.MARITAL_STATUS]: 'Quel est votre état civil actuel?',
    [FieldKey.LIVING_COUNTRY]: 'Dans quel pays résidez-vous?',
    [FieldKey.LEGAL_STATUS]: 'Quel est votre statut légal au Canada?',
    [FieldKey.LIVED_OUTSIDE_CANADA]:
      "Depuis l'âge de 18 ans, avez-vous vécu à l'extérieur du Canada pendant plus de 6 mois?",
    [FieldKey.YEARS_IN_CANADA_SINCE_18]:
      "Depuis l'âge de 18 ans, combien d'années avez-vous vécu au Canada?",
    [FieldKey.EVER_LIVED_SOCIAL_COUNTRY]:
      'Avez-vous déjà vécu dans un pays ayant un {LINK_SOCIAL_AGREEMENT} avec le Canada?',
    [FieldKey.PARTNER_BENEFIT_STATUS]:
      "Laquelle des options suivantes s'applique à votre conjoint?",
    [FieldKey.PARTNER_INCOME_AVAILABLE]:
      'Êtes-vous en mesure de nous fournir le revenu net annuel de votre partenaire?',
    [FieldKey.PARTNER_INCOME]:
      'Quel est le revenu annuel net de votre conjoint en dollars canadiens?',
    [FieldKey.PARTNER_AGE]:
      'Quel mois et quelle année votre partenaire est-il né?',
    [FieldKey.PARTNER_LIVING_COUNTRY]:
      'Dans quel pays habite actuellement votre conjoint?',
    [FieldKey.PARTNER_LEGAL_STATUS]:
      'Quel est le statut légal actuel de votre conjoint?',
    [FieldKey.PARTNER_LIVED_OUTSIDE_CANADA]:
      "Depuis l'âge de 18 ans, votre conjoint a-t-il vécu à l'extérieur du Canada pendant plus de 6 mois?",
    [FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18]:
      "Depuis l'âge de 18 ans, combien d'années votre conjoint a-t-il habité au Canada?",
    [FieldKey.PARTNER_EVER_LIVED_SOCIAL_COUNTRY]:
      'Votre conjoint-a-til déjà vécu dans un pays ayant un {LINK_SOCIAL_AGREEMENT} avec le Canada?',
  },
  questionShortText: {
    [FieldKey.INCOME_AVAILABLE]: 'Revenu fourni',
    [FieldKey.INCOME]: 'Revenu net',
    [FieldKey.AGE]: 'Âge',
    [FieldKey.OAS_DEFER]: 'Report de la SV',
    [FieldKey.OAS_AGE]: 'Âge de report de la SV',
    [FieldKey.MARITAL_STATUS]: 'État civil',
    [FieldKey.LIVING_COUNTRY]: 'Pays de résidence',
    [FieldKey.LEGAL_STATUS]: 'Statut légal',
    [FieldKey.LIVED_OUTSIDE_CANADA]:
      "A vécu à l'extérieur du Canada pendant plus de 6 mois",
    [FieldKey.YEARS_IN_CANADA_SINCE_18]:
      "Années vécues à l'extérieur du Canada",
    [FieldKey.EVER_LIVED_SOCIAL_COUNTRY]:
      'A vécu dans un pays avec un accord social',
    [FieldKey.PARTNER_BENEFIT_STATUS]:
      'Prestations de vieillesse du partenaire',
    [FieldKey.PARTNER_INCOME_AVAILABLE]: 'Revenu du partenaire fourni',
    [FieldKey.PARTNER_INCOME]: 'Revenu net du partenaire',
    [FieldKey.PARTNER_AGE]: 'Âge du partenaire',
    [FieldKey.PARTNER_LIVING_COUNTRY]: 'Pays de résidence du partenaire',
    [FieldKey.PARTNER_LEGAL_STATUS]: 'Statut juridique du partenaire',
    [FieldKey.PARTNER_LIVED_OUTSIDE_CANADA]:
      "Le partenaire a vécu à l'extérieur du Canada pendant plus de 6 mois",
    [FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18]:
      "Années du partenaire vécues à l'extérieur du Canada",
    [FieldKey.PARTNER_EVER_LIVED_SOCIAL_COUNTRY]:
      'Le partenaire vivait dans un pays avec un accord social',
  },
  questionAriaLabel: {
    [FieldKey.AGE]: 'Modifier votre âge',
    [FieldKey.OAS_DEFER]:
      'Modifier quand vous souhaitez commencer à recevoir la Sécurité de la vieillesse',
    [FieldKey.INCOME_AVAILABLE]: 'Modifier si vous fournissez votre revenu',
    [FieldKey.INCOME]: 'Modifier votre revenu net',
    [FieldKey.LEGAL_STATUS]: 'Modifier votre statut légal',
    [FieldKey.LIVING_COUNTRY]: 'Modifier votre pays de résidence',
    [FieldKey.LIVED_OUTSIDE_CANADA]:
      'Modifier si vous avez vécu à l’extérieur du Canada pendant plus de 6 mois',
    [FieldKey.YEARS_IN_CANADA_SINCE_18]:
      'Modifiez les années où vous avez vécu au Canada depuis le 18',
    [FieldKey.MARITAL_STATUS]: 'Modifier votre état civil',
    [FieldKey.PARTNER_INCOME_AVAILABLE]:
      'Modifier si vous fournissez le revenu de votre conjoint',
    [FieldKey.PARTNER_INCOME]: 'Modifier le revenu net de votre conjoint',
    [FieldKey.PARTNER_BENEFIT_STATUS]:
      'Modifier les prestations de vieillesse de votre conjoint',
    [FieldKey.PARTNER_AGE]: "Modifier l'âge de votre conjoint",
    [FieldKey.PARTNER_LEGAL_STATUS]:
      'Modifier le statut légal de votre conjoint',
    [FieldKey.PARTNER_LIVING_COUNTRY]:
      'Modifier le pays de résidence de votre conjoint',
    [FieldKey.PARTNER_LIVED_OUTSIDE_CANADA]:
      'Modifier si votre conjoint a vécu à l’extérieur du Canada pendant plus de 6 mois',
    [FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18]:
      'Modifier les années pendant lesquelles votre partenaire a vécu au Canada depuis le 18',
  },
  questionHelp: {
    [FieldKey.INCOME_AVAILABLE]:
      'Fournir votre revenu vous donnera des résultats plus utiles et plus précis.',
    [FieldKey.PARTNER_INCOME_AVAILABLE]:
      'Fournir le revenu de votre partenaire vous donnera des résultats plus utiles et plus précis.',
    [FieldKey.OAS_DEFER]:
      '<div>Si vous recevez déjà la pension de la SV, indiquez quand vous avez commencé à la recevoir. {LINK_OAS_DEFER_INLINE}.</div>',
    [FieldKey.OAS_AGE]: 'Ce nombre doit être entre 65 et 70.',
    [FieldKey.INCOME]:
      'Vous trouverez votre revenu net à la ligne 23600 de votre déclaration de revenus.',
    [FieldKey.YEARS_IN_CANADA_SINCE_18]:
      "Si vous n'êtes pas certain du nombre exact, vous pouvez entrer une estimation.",
  },
  questionOptions: {
    [FieldKey.INCOME_AVAILABLE]: [
      {
        key: true,
        text: 'Oui, je fournirai mes revenus',
        shortText: 'Oui',
      },
      {
        key: false,
        text: 'Non, je ne fournirai pas mes revenus pour le moment',
        shortText: 'Non',
      },
    ],
    [FieldKey.PARTNER_INCOME_AVAILABLE]: [
      {
        key: true,
        text: 'Oui, je fournirai les revenus de mon partenaire',
        shortText: 'Oui',
      },
      {
        key: false,
        text: 'Non, je ne fournirai pas les revenus de mon partenaire pour le moment',
        shortText: 'Non',
      },
    ],
    [FieldKey.OAS_DEFER]: [
      {
        key: false,
        text: 'Je voudrais commencer à 65 ans (le plus commun)',
        shortText: 'Commencer à 65 ans',
      },
      {
        key: true,
        text: 'Je voudrais retarder mon premier paiement (montants plus élevés)',
        shortText: 'Retard',
      },
    ],
    [FieldKey.LEGAL_STATUS]: [
      {
        key: LegalStatus.CANADIAN_CITIZEN,
        text: 'Citoyen canadien',
        shortText: 'Citoyen canadien',
      },
      {
        key: LegalStatus.INDIAN_STATUS,
        text: "Statut d'Indien",
        shortText: "Statut d'Indien",
      },
      {
        key: LegalStatus.PERMANENT_RESIDENT,
        text: 'Résident permanent ou immigrant reçu',
        shortText: 'Résident permanent',
      },
      {
        key: LegalStatus.REFUGEE,
        text: 'Réfugié',
        shortText: 'Réfugié',
      },
      {
        key: LegalStatus.OTHER,
        text: 'Autre (par exemple, résident temporaire, étudiant ou travailleur temporaire)',
        shortText: 'Other',
      },
    ],
    [FieldKey.LIVED_OUTSIDE_CANADA]: [
      {
        key: false,
        text: "Non, je n'ai pas vécu à l'extérieur du Canada pendant plus de 6 mois.",
        shortText: 'Non',
      },
      {
        key: true,
        text: "Oui, j'ai vécu à l'extérieur du Canada pendant plus de 6 mois.",
        shortText: 'Oui',
      },
    ],
    [FieldKey.PARTNER_LIVED_OUTSIDE_CANADA]: [
      {
        key: false,
        text: "Non, mon conjoint n'a pas vécu à l'extérieur du Canada pendant plus de 6 mois.",
        shortText: 'Non',
      },
      {
        key: true,
        text: "Oui, mon conjoint a vécu à l'extérieur du Canada pendant plus de 6 mois.",
        shortText: 'Oui',
      },
    ],
    [FieldKey.MARITAL_STATUS]: [
      {
        key: MaritalStatus.SINGLE,
        text: 'Célibataire, divorcé(e), ou séparé(e)',
        shortText: 'Célibataire',
      },
      {
        key: MaritalStatus.PARTNERED,
        text: 'Marié(e) ou conjoint(e) de fait',
        shortText: 'Marié(e) ou conjoint(e) de fait',
      },
      {
        key: MaritalStatus.WIDOWED,
        text: 'Partenaire veuf(ve)',
        shortText: 'Partenaire veuf(ve)',
      },
      {
        key: MaritalStatus.INV_SEPARATED,
        text: 'Conjoints vivants séparément pour des raisons indépendantes de leur volonté',
        shortText: 'Conjoints vivants séparément',
      },
    ],
    [FieldKey.PARTNER_BENEFIT_STATUS]: [
      {
        key: PartnerBenefitStatus.OAS,
        text: 'Mon conjoint reçoit la pension de la Sécurité de la vieillesse',
        shortText: 'Oui',
      },
      {
        key: PartnerBenefitStatus.OAS_GIS,
        text: 'Mon conjoint reçoit la pension de la Sécurité de la vieillesse et le Supplément de revenu garanti',
        shortText: 'Oui',
      },
      {
        key: PartnerBenefitStatus.ALW,
        text: "Mon conjoint reçoit l'Allocation",
        shortText: 'Oui',
      },
      {
        key: PartnerBenefitStatus.NONE,
        text: 'Aucune des réponses',
        shortText: 'No prestations',
      },
      {
        key: PartnerBenefitStatus.HELP_ME,
        text: 'Aidez-moi à trouver',
        shortText: 'Aidez-moi à trouver',
      },
    ],
    [FieldKey.LIVING_COUNTRY]: livingCountry,
    [FieldKey.EVER_LIVED_SOCIAL_COUNTRY]: [
      {
        key: true,
        text: 'Oui',
        shortText: 'Oui',
      },
      {
        key: false,
        text: 'Non',
        shortText: 'Non',
      },
    ],
  },
  detail: {
    eligible:
      "D'après les informations fournies, vous êtes probablement admissible à cette prestation.",
    eligibleDependingOnIncome:
      'Vous êtes probablement éligible à cette prestation si {INCOME_SINGLE_OR_COMBINED} est inférieur à {INCOME_LESS_THAN}. En fonction de vos revenus, vous devriez vous attendre à recevoir environ {ENTITLEMENT_AMOUNT_FOR_BENEFIT} par mois.',
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
      'Vous devez être admissible à la pension de la Sécurité de la vieillesse pour être admissible à cette prestation.',
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
    dependingOnLegalWhen60:
      'Vous pourriez être admissible à cette prestation à votre 60e anniversaire, selon votre statut légal au Canada. Nous vous invitons à communiquer avec Service Canada pour obtenir une meilleure évaluation.',
    dependingOnLegalWhen65:
      'Vous pourriez être admissible à cette prestation à votre 65e anniversaire, selon votre statut légal au Canada. Nous vous invitons à communiquer avec Service Canada pour obtenir une meilleure évaluation.',
    alwNotEligible:
      "L'Allocation est une prestation pour les personnes âgées entre&nbsp;60 et&nbsp;64 ans dont le conjoint reçoit le Supplément de revenu garanti.",
    afsNotEligible:
      "L'Allocation au survivant est une prestation pour les personnes âgées entre&nbsp;60 et&nbsp;64 ans dont le conjoint est décédé.",
    autoEnrollTrue:
      "D'après ce que vous nous avez dit, vous <strong>n'avez pas besoin de faire une demande</strong> pour obtenir cette prestation. Vous recevrez une lettre par la poste vous informant de votre <strong>inscription automatique</strong> le mois suivant vos 64 ans.",
    autoEnrollFalse:
      "Selon ce que vous nous avez dit, <strong>vous devrez peut-être demander cette prestation</strong>. Nous ne disposons peut-être pas de suffisamment d'informations pour vous inscrire automatiquement.",
    expectToReceive:
      'Vous devriez vous attendre à recevoir environ {ENTITLEMENT_AMOUNT_FOR_BENEFIT} par mois.',
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
    [SummaryState.MORE_INFO]: 'Plus de renseignements sont nécessaires',
    [SummaryState.UNAVAILABLE]: 'Impossible de fournir une estimation',
    [SummaryState.AVAILABLE_ELIGIBLE]:
      'Probablement admissible aux prestations',
    [SummaryState.AVAILABLE_INELIGIBLE]:
      'Probablement non admissible aux prestations',
    [SummaryState.AVAILABLE_DEPENDING]:
      'Vous pourriez être admissible à des prestations',
  },
  summaryDetails: {
    [SummaryState.MORE_INFO]:
      "Veuillez remplir le formulaire. Selon les renseignements que vous fournirez aujourd'hui, l'application estimera votre admissibilité. Si vous êtes admissible, l'application fournira également une estimation de votre paiement mensuel.",
    [SummaryState.UNAVAILABLE]:
      "Selon les renseignements que vous avez fournis aujourd'hui, nous sommes incapables de déterminer votre admissibilité. Nous vous invitons à {LINK_SERVICE_CANADA}.",
    [SummaryState.AVAILABLE_ELIGIBLE]:
      "Selon les renseignements que vous avez fournis aujourd'hui, vous êtes probablement admissible à un montant mensuel total estimé à {ENTITLEMENT_AMOUNT_SUM}. Notez que les montants ne sont qu'une estimation de votre paiement mensuel. Des changements dans votre situation peuvent affecter vos résultats.",
    [SummaryState.AVAILABLE_INELIGIBLE]:
      "Selon les renseignements que vous avez fournis aujourd'hui, vous n'avez probablement pas droit à des prestations. Voir les détails ci-dessous pour en savoir plus.",
    [SummaryState.AVAILABLE_DEPENDING]:
      "En fonction de vos revenus, vous pouvez être éligible aux prestations de vieillesse. Voir les détails ci-dessous pour plus d'informations.",
  },
  links,
  incomeSingle: 'votre revenu',
  incomeCombined: 'le revenu combiné de vous et de votre partenaire',
  opensNewWindow: 'ouvre une nouvelle fenêtre',
  yes: 'Oui',
  no: 'Non',
  year: 'an',
}
export default fr
