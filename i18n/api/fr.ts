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
    [BenefitKey.alws]: 'Allocation au survivant',
  },
  category: {
    [FieldCategory.AGE]: 'Âge',
    [FieldCategory.INCOME]: 'Revenu',
    [FieldCategory.LEGAL]: 'Statut légal',
    [FieldCategory.RESIDENCE]: 'Résidence',
    [FieldCategory.MARITAL]: 'État matrimonial',
  },
  result: {
    [ResultKey.ELIGIBLE]: 'Admissible',
    [ResultKey.INELIGIBLE]: 'Non\xA0admissible',
    [ResultKey.WILL_BE_ELIGIBLE]: 'Serez\xA0admissible',
    [ResultKey.UNAVAILABLE]: 'Non disponible',
    [ResultKey.MORE_INFO]: "Besoin de plus d'information...",
    [ResultKey.INVALID]: "Votre demande n'est pas valide!",
    [ResultKey.INCOME_DEPENDENT]: 'Revenu manquant',
    [ResultKey.ALMOST_ELIGIBLE]: 'Presque admissible',
  },
  question: {
    [FieldKey.PSD_AGE]: 'When do you want to start receiving your pension?',
    [FieldKey.ELI_OBJ]: 'N/A',
    [FieldKey.PARTNER_ELI_OBJ]: 'N/A',
    [FieldKey.INCOME_AVAILABLE]:
      'Êtes-vous en mesure de nous fournir votre revenu net annuel?',
    [FieldKey.INCOME]:
      'Quel sera votre revenu annuel net lorsque vous commencerez à recevoir vos prestations?',
    [FieldKey.INCOME_WORK]:
      'Combien de ce montant provient de revenus d’emploi ou de travail indépendant?',
    [FieldKey.AGE]: 'Quel est votre mois de naissance?',
    [FieldKey.ALREADY_RECEIVE_OAS]:
      'Recevez-vous la pension de la Sécurité de la vieillesse?',
    [FieldKey.OAS_DEFER_DURATION]:
      'Pendant combien de temps avez-vous reporté votre pension de la Sécurité de la vieillesse?',
    [FieldKey.OAS_DEFER]:
      'Quand souhaitez-vous commencer à recevoir la pension de la Sécurité de la vieillesse (SV)?',
    [FieldKey.OAS_AGE]:
      'À quel âge aimeriez-vous commencer à recevoir la pension de la SV?',
    [FieldKey.MARITAL_STATUS]: 'Quel est votre état matrimonial?',
    [FieldKey.INV_SEPARATED]:
      'Vivez-vous séparément de votre conjoint pour des raisons hors de votre contrôle?',
    [FieldKey.LIVING_COUNTRY]: 'Où vivez-vous?',
    [FieldKey.LEGAL_STATUS]: 'Avez-vous un statut légal au Canada?',
    [FieldKey.LIVED_ONLY_IN_CANADA]:
      "Depuis l'âge de 18 ans, avez-vous seulement vécu au Canada?",
    [FieldKey.YEARS_IN_CANADA_SINCE_18]:
      "Depuis l'âge de 18 ans, combien d'années avez-vous vécu au Canada?",
    [FieldKey.YEARS_IN_CANADA_SINCE_OAS]:
      "Combien d'années aviez-vous vécu au Canada lorsque vous avez commencé à recevoir votre pension de la Sécurité de la vieillesse?",
    [FieldKey.EVER_LIVED_SOCIAL_COUNTRY]:
      'Avez-vous déjà vécu dans un pays ayant un {LINK_SOCIAL_AGREEMENT} avec le Canada?',
    [FieldKey.PARTNER_BENEFIT_STATUS]:
      'Votre conjoint reçoit-il la pension de la Sécurité de la vieillesse?',
    [FieldKey.PARTNER_INCOME_AVAILABLE]:
      'Êtes-vous en mesure de nous fournir le revenu net annuel de votre conjoint?',
    [FieldKey.PARTNER_INCOME]:
      'Quel est le revenu annuel net de votre conjoint?',
    [FieldKey.PARTNER_INCOME_WORK]:
      'Combien de ce montant provient de revenus d’emploi ou de travail indépendant?',
    [FieldKey.PARTNER_AGE]: 'Quel est le mois de naissance de votre conjoint?',
    [FieldKey.PARTNER_LIVING_COUNTRY]: 'Où vit votre conjoint?',
    [FieldKey.PARTNER_LEGAL_STATUS]:
      'Votre conjoint a-t-il un statut légal au Canada?',
    [FieldKey.PARTNER_LIVED_ONLY_IN_CANADA]:
      "Depuis l'âge de 18 ans, votre conjoint a-t-il seulement vécu au Canada?",
    [FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18]:
      "Depuis l'âge de 18 ans, combien d'années votre conjoint a-t-il vécu au Canada?",
    [FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_OAS]:
      'Votre conjoint avait vécu combien d’années au Canada lorsqu’il a commencé à recevoir sa pension de la Sécurité de la vieillesse?',
  },
  questionShortText: {
    [FieldKey.AGE]: 'Âge',
    [FieldKey.ALREADY_RECEIVE_OAS]: 'Reçoit la pension de la SV',
    [FieldKey.OAS_DEFER]: 'Report de la pension de la SV',
    [FieldKey.OAS_DEFER_DURATION]: 'Report de la pension de la SV',
    [FieldKey.OAS_AGE]: 'Report de la pension de la\xA0SV',
    [FieldKey.INCOME_AVAILABLE]: 'Revenu net',
    [FieldKey.INCOME]: 'Revenu net',
    [FieldKey.INCOME_WORK]: 'Exemption du salaire',
    [FieldKey.LEGAL_STATUS]: 'Statut légal',
    [FieldKey.LIVING_COUNTRY]: 'Pays de résidence',
    [FieldKey.LIVED_ONLY_IN_CANADA]: 'Seulement vécu au Canada',
    [FieldKey.YEARS_IN_CANADA_SINCE_18]: 'Années vécues au Canada',
    [FieldKey.YEARS_IN_CANADA_SINCE_OAS]: 'Années vécues au Canada',
    [FieldKey.EVER_LIVED_SOCIAL_COUNTRY]:
      'A vécu dans un pays avec un accord de sécurité sociale',
    [FieldKey.MARITAL_STATUS]: 'État matrimonial',
    [FieldKey.INV_SEPARATED]: 'Séparation involontaire',
    [FieldKey.PARTNER_INCOME_AVAILABLE]: 'Revenu du conjoint fourni',
    [FieldKey.PARTNER_INCOME]: 'Revenu net du conjoint',
    [FieldKey.PARTNER_INCOME_WORK]: 'Exemption du salaire du conjoint',
    [FieldKey.PARTNER_BENEFIT_STATUS]: 'Conjoint reçoit la pension de la SV',
    [FieldKey.PARTNER_AGE]: 'Âge du conjoint',
    [FieldKey.PARTNER_LEGAL_STATUS]: 'Conjoint a statut légal',
    [FieldKey.PARTNER_LIVING_COUNTRY]: 'Pays de résidence du conjoint',
    [FieldKey.PARTNER_LIVED_ONLY_IN_CANADA]:
      'Conjoint a seulement vécu au Canada',
    [FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18]:
      'Années où le conjoint a vécu au Canada',
    [FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_OAS]:
      'Années où le conjoint a vécu au Canada',
  },
  questionAriaLabel: {
    [FieldKey.AGE]: 'Modifier votre âge',
    [FieldKey.OAS_AGE]: 'Commencer à',
    [FieldKey.ALREADY_RECEIVE_OAS]:
      'Modifier si vous recevez la pension de la SV',
    [FieldKey.OAS_DEFER]: 'Modifier votre décision de report',
    [FieldKey.OAS_DEFER_DURATION]:
      'Modifier le report de votre pension de la SV',
    [FieldKey.INCOME_AVAILABLE]: 'Modifier si vous fournissez votre revenu',
    [FieldKey.INCOME]: 'Modifier votre revenu net',
    [FieldKey.INCOME_WORK]: 'Modifier votre salaire',
    [FieldKey.LEGAL_STATUS]: 'Modifier votre statut légal',
    [FieldKey.LIVING_COUNTRY]: 'Modifier votre pays de résidence',
    [FieldKey.LIVED_ONLY_IN_CANADA]:
      'Modifier si vous avez seulement vécu au Canada',
    [FieldKey.YEARS_IN_CANADA_SINCE_18]:
      'Modifier le nombre d’années vécues au Canada',
    [FieldKey.YEARS_IN_CANADA_SINCE_OAS]:
      'Modifier le nombre d’années vécues au Canada',
    [FieldKey.MARITAL_STATUS]: 'Modifier votre état matrimonial',
    [FieldKey.INV_SEPARATED]:
      'Modifier votre statut de séparation involontaire',
    [FieldKey.PARTNER_INCOME_AVAILABLE]:
      'Modifier si vous fournissez le revenu de votre conjoint',
    [FieldKey.PARTNER_INCOME]: 'Modifier le revenu net de votre conjoint',
    [FieldKey.PARTNER_INCOME_WORK]: 'Modifier le salaire de votre conjoint',
    [FieldKey.PARTNER_BENEFIT_STATUS]:
      'Modifier si votre conjoint reçoit la pension de la SV',
    [FieldKey.PARTNER_AGE]: "Modifier l'âge de votre conjoint",
    [FieldKey.PARTNER_LEGAL_STATUS]:
      'Modifier si votre conjoint a un statut légal',
    [FieldKey.PARTNER_LIVING_COUNTRY]:
      'Modifier le pays de résidence de votre conjoint',
    [FieldKey.PARTNER_LIVED_ONLY_IN_CANADA]:
      'Modifier si votre conjoint a seulement vécu au Canada',
    [FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18]:
      'Modifier le nombre d’années vécues au Canada de votre conjoint',
    [FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_OAS]:
      'Modifier le nombre d’années vécues au Canada de votre conjoint',
  },
  questionHelp: {
    [FieldKey.INCOME_AVAILABLE]:
      'Fournir votre revenu vous donnera des résultats plus précis.',
    [FieldKey.INCOME]:
      "<p>Votre déclaration de revenus sera utilisée lors de votre demande. Pour l'instant, estimez ce que vous pourriez recevoir par année.</p>", //overwritten in Stepper/index
    [FieldKey.INCOME_WORK]:
      "<p>Incluez tout salaire net provenant d'un emploi ou de travail indépendant que vous avez inclus dans votre revenu annuel. N'incluez pas le revenu de pension.</p>",
    [FieldKey.INV_SEPARATED]:
      "Par exemple, parce que votre conjoint vit dans un foyer de soins ou dans un logement séparé pour être proche de son travail ou d'assistance médicale.",
    [FieldKey.PARTNER_INCOME]:
      "<p>Leur déclaration de revenus sera évaluée lors de votre demande. Pour l'instant, estimez ce que votre conjoint pourrait recevoir par année.</p>", //overwritten in Stepper/index
    [FieldKey.PARTNER_INCOME_WORK]:
      "<p>Incluez tout salaire net provenant d'un emploi ou de travail indépendant que vous avez inclus dans son revenu annuel. N'incluez pas le revenu de pension.</p>",
    [FieldKey.OAS_DEFER]:
      '<div>Si vous recevez déjà la pension de la SV, indiquez quand vous avez commencé à la recevoir. {LINK_OAS_DEFER_INLINE}</div>',
    [FieldKey.OAS_AGE]: 'Ce nombre doit être entre 65 et 70.',
    [FieldKey.YEARS_IN_CANADA_SINCE_18]:
      "Ne comptez pas les périodes où vous étiez à l'extérieur du Canada pendant au moins 6 mois consécutifs. Certaines exceptions s'appliquent, comme travailler pour un employeur canadien à l'étranger.",
    [FieldKey.YEARS_IN_CANADA_SINCE_OAS]:
      "Comptez seulement le nombre d'années depuis l'âge de 18 ans.",
    [FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18]:
      "Ne comptez pas les périodes où votre conjoint était à l'extérieur du Canada pendant au moins 6 mois consécutifs. Certaines exceptions s'appliquent, comme travailler pour un employeur canadien à l'étranger.",
    [FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18]:
      "Ne comptez pas les périodes où votre conjoint était à l'extérieur du Canada pendant au moins 6 mois consécutifs. Certaines exceptions s'appliquent, comme travailler pour un employeur canadien à l'étranger.",
    [FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_OAS]:
      "Comptez seulement le nombre d'années depuis l'âge de 18 ans.",
  },
  questionOptions: {
    [FieldKey.INCOME_AVAILABLE]: [
      {
        key: true,
        text: 'Oui, je fournirai mon revenu',
        shortText: 'Oui',
      },
      {
        key: false,
        text: 'Non, je ne fournirai pas mon revenu pour le moment',
        shortText: 'Non fourni',
      },
    ],
    [FieldKey.PARTNER_INCOME_AVAILABLE]: [
      {
        key: true,
        text: 'Oui, je fournirai le revenu de mon conjoint',
        shortText: 'Oui',
      },
      {
        key: false,
        text: 'Non, je ne fournirai pas le revenu de mon conjoint pour le moment',
        shortText: 'Non fourni',
      },
    ],
    [FieldKey.ALREADY_RECEIVE_OAS]: [
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
    [FieldKey.OAS_DEFER]: [
      {
        key: false,
        text: 'Je voudrais commencer à 65 ans (le plus commun)',
        shortText: 'Commencer à 65 ans',
      },
      {
        key: true,
        text: 'Je voudrais retarder mon premier paiement (montants plus élevés)',
        shortText: 'Retard',
      },
    ],
    [FieldKey.LEGAL_STATUS]: [
      {
        key: LegalStatus.YES,
        text: 'Oui',
        shortText: 'Oui',
      },
      {
        key: LegalStatus.NO,
        text: 'Non',
        shortText: 'Non',
      },
    ],
    [FieldKey.LIVED_ONLY_IN_CANADA]: [
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
    [FieldKey.PARTNER_LIVED_ONLY_IN_CANADA]: [
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
    [FieldKey.MARITAL_STATUS]: [
      {
        key: MaritalStatus.SINGLE,
        text: 'Célibataire, divorcé ou séparé',
        shortText: 'Célibataire, divorcé ou séparé',
      },
      {
        key: MaritalStatus.PARTNERED,
        text: 'Marié ou conjoint de fait',
        shortText: 'Marié ou conjoint de fait',
      },
      {
        key: MaritalStatus.WIDOWED,
        text: 'Veuf',
        shortText: 'Veuf',
      },
    ],
    [FieldKey.INV_SEPARATED]: [
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
    [FieldKey.PARTNER_BENEFIT_STATUS]: [
      // {
      //   key: PartnerBenefitStatus.OAS,
      //   text: 'Mon conjoint reçoit la pension de la Sécurité de la vieillesse',
      //   shortText: 'Oui',
      // },
      {
        key: PartnerBenefitStatus.OAS_GIS,
        text: 'Oui',
        shortText: 'Oui',
      },
      // {
      //   key: PartnerBenefitStatus.ALW,
      //   text: "Mon conjoint reçoit l'Allocation",
      //   shortText: 'Oui',
      // },
      {
        key: PartnerBenefitStatus.NONE,
        text: 'Non',
        shortText: 'Non',
      },
      {
        key: PartnerBenefitStatus.HELP_ME,
        text: 'Je ne sais pas',
        shortText: 'Je ne sais pas',
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
    eligible: 'Vous êtes probablement admissible à cette prestation.',
    futureEligible60:
      'Vous serez probablement admissible lorsque vous aurez {EARLIEST_ELIGIBLE_AGE}.',
    futureEligible:
      'Vous serez probablement admissible lorsque vous aurez {EARLIEST_ELIGIBLE_AGE}.',
    eligibleIncomeTooHigh:
      'Vous êtes probablement admissible à cette prestation, mais votre revenu est trop élevé pour recevoir un paiement mensuel pour le moment.',
    futureEligibleIncomeTooHigh:
      'Vous pourriez être admissible lorsque vous aurez {EARLIEST_ELIGIBLE_AGE}. Puisque votre revenu est trop élevé, vous ne recevrez peut-être pas de paiement mensuel.',
    futureEligibleIncomeTooHigh2:
      'Vous serez probablement admissible lorsque vous aurez {EARLIEST_ELIGIBLE_AGE}. Si votre revenu reste le même, vous ne recevrez peut-être pas de paiement mensuel.',
    eligibleDependingOnIncome:
      'Vous êtes probablement éligible à cette prestation si {INCOME_SINGLE_OR_COMBINED} est inférieur à {INCOME_LESS_THAN}. En fonction de {YOUR_OR_COMPLETE}, vous devriez vous attendre à recevoir environ {ENTITLEMENT_AMOUNT_FOR_BENEFIT} par mois.',
    eligibleDependingOnIncomeNoEntitlement:
      'Vous pourriez probablement recevoir cette prestation si {INCOME_SINGLE_OR_COMBINED} est moins que {INCOME_LESS_THAN}. Fournissez {YOUR_OR_COMPLETE} pour obtenir une estimation de paiement mensuel.',
    eligibleEntitlementUnavailable:
      "Vous êtes probablement admissible à cette prestation, mais une estimation du droit à cette prestation n'est pas disponible. Vous devriez communiquer avec {LINK_SERVICE_CANADA} pour obtenir plus de renseignements sur le montant de vos paiements.",
    eligiblePartialOas:
      'Vous êtes probablement admissible à une pension partielle de la Sécurité de la vieillesse.',
    yourDeferralOptions: 'Vos options de report',
    deferralEligible:
      'Puisque vous avez {CURRENT_AGE} ans, vous pouvez commencer à recevoir vos paiements de la pension de la Sécurité de la vieillesse immédiatement ou attendre encore {WAIT_MONTHS}&nbspmois.',
    deferralNoGis:
      'Vous ne pourrez pas recevoir le Supplément de revenu garanti si vous ne recevez pas la pension.',
    deferralWillBeEligible:
      "Vous pouvez commencer à recevoir vos paiements de la pension de la Sécurité de la vieillesse à 65 ans ou attendre d'avoir 70 ans.",
    deferralYearsInCanada:
      "Vous pouvez choisir de reporter votre pension ou augmenter vos années de résidence au Canada. Pour savoir quelle option serait la meilleure pour vous, <a class='addOpenNew text-default-text link-no-deco' style='text-decoration: underline' target='_blank' aria-label='ouvre dans un nouvel onglet' href='https://www.canada.ca/fr/emploi-developpement-social/ministere/coordonnees/sv.html'>communiquez avec nous</a>",
    retroactivePay: 'Paiement rétroactif',
    sinceYouAreSixty:
      'Puisque vous avez {CURRENT_AGE} ans, vous pouvez commencer à recevoir vos paiements immédiatement ou attendre encore {WAIT_MONTHS} mois.',
    futureDeferralOptions:
      'Si vous êtes inscrit automatiquement, vous commencerez à recevoir des paiements le mois après vos 65 ans, sauf si vous demandez un report.',
    youCanAply:
      'Si vous n’êtes pas inscrit, vous pouvez présenter une demande dès 11 mois avant la date à laquelle vous souhaitez recevoir votre premier paiement.',
    onceEnrolled:
      'Quand vous serez inscrit, le montant de votre paiement sera révisé chaque année en fonction de votre déclaration de revenus. Vous recevrez automatiquement des paiements si votre revenu est admissible.',
    delayMonths:
      'Vous pouvez reporter votre pension pour encore {DELAY_MONTHS} mois.',
    eligibleWhen60ApplyNow:
      'Vous pourriez être admissible à votre 60e anniversaire. Par contre, vous pourriez être en mesure de présenter une demande dès maintenant. Veuillez communiquer avec {LINK_SERVICE_CANADA} pour en savoir plus.',
    eligibleWhen65ApplyNow:
      'Vous pourriez être admissible à votre 65e anniversaire. Par contre, vous pourriez être en mesure de présenter une demande dès maintenant. Veuillez communiquer avec {LINK_SERVICE_CANADA} pour en savoir plus.',
    eligibleWhen60:
      "Vous pourriez être admissible lorsque vous aurez 60 ans. Vous pouvez <a class='text-default-text' style='text-decoration: underline' href='/fr/questions#age'>modifier vos réponses</a> pour voir ce que vous pourriez recevoir à un âge futur. <p class='mt-6'>Vous pouvez présenter une demande pour cette prestation 1 mois après votre 59e anniversaire.</p>",
    eligibleWhen65: 'Vous pourriez être admissible à votre 65e anniversaire.',
    mustBeInCanada:
      "Vous devez habiter au Canada pour recevoir cette prestation. Vous pouvez <a class='text-default-text visited:text-blue-500 link-no-deco' style='text-decoration: underline' href='/fr/questions?step=residence'>modifier vos réponses</a> pour voir ce que vous pourriez recevoir si vous habitiez au Canada.",
    partnerMustBeEligible:
      "Pour être admissible, votre conjoint doit recevoir la pension de la Sécurité de la vieillesse et le Supplément de revenu garanti. Vous pouvez <a class='text-default-text visited:text-blue-500 link-no-deco' style='text-decoration: underline' href='/fr/questions?step=age#partnerBenefitStatus'>modifier vos réponses</a> pour voir ce que vous pourriez recevoir si votre conjoint recevait ces prestations.",
    mustBeOasEligible:
      'Vous devez être admissible à la pension de la Sécurité de la vieillesse pour être admissible à cette prestation.',
    mustCompleteOasCheck:
      "Vous devez d'abord compléter l'évaluation d'admissibilité à la Sécurité de la vieillesse.",
    mustMeetIncomeReq:
      '{INCOME_SINGLE_OR_COMBINED} est trop élevé pour que vous soyez admissible à cette prestation.',
    mustMeetYearReq:
      "Vous n'avez pas vécu au Canada pendant le nombre d'années requis pour être admissible à cette prestation.",
    conditional:
      'Vous pourriez être admissible à cette prestation. Nous vous invitons à communiquer avec Service Canada pour obtenir une meilleure évaluation.',
    partnerContinues: 'Si votre conjoint continue de recevoir à',
    continueReceiving: 'continuez de recevoir à',
    dependingOnAgreement:
      "Vous pourriez être admissible à cette prestation, selon l'accord que le Canada a avec ce pays. Nous vous invitons à communiquer avec Service Canada pour obtenir une meilleure évaluation.",
    dependingOnAgreementWhen60:
      "Vous pourriez avoir droit à cette prestation à votre 60e anniversaire, selon l'entente entre le Canada et ce pays. Nous vous invitons à communiquer avec Service Canada  pour obtenir une meilleure évaluation.",
    dependingOnAgreementWhen65:
      "Vous pourriez être admissible à cette prestation à votre 65e anniversaire, selon l'entente entre le Canada et ce pays. Nous vous invitons à communiquer avec Service Canada pour obtenir une meilleure évaluation.",
    dependingOnLegal:
      'Vous pourriez être admissible à cette prestation, selon votre statut légal au Canada. Nous vous invitons à communiquer avec Service Canada pour obtenir une meilleure évaluation.',
    dependingOnLegalWhen60:
      'Vous pourriez être admissible à cette prestation à votre 60e anniversaire, selon votre statut légal au Canada. Nous vous invitons à communiquer avec Service Canada pour obtenir une meilleure évaluation.',
    dependingOnLegalWhen65:
      'Vous pourriez être admissible à cette prestation à votre 65e anniversaire, selon votre statut légal au Canada. Nous vous invitons à communiquer avec Service Canada pour obtenir une meilleure évaluation.',
    youCantGetThisBenefit:
      'Vous ne pouvez pas recevoir cette prestation si vous ne recevez pas la pension de la Sécurité de la vieillesse. Vos paiements du Supplément de revenu garanti n’augmenteront pas si vous reportez votre pension.',
    thisEstimate:
      'Cette estimation est basée sur les informations fournies. Votre montant réel pourrait être différent. Pour confirmer que vos renseignements sont à jour, consultez votre compte Mon dossier Service Canada.',
    thisEstimateWhenZero:
      'Cette estimation est basée sur les informations fournies. Pour confirmer que vos renseignements sont à jour, consultez votre compte Mon dossier Service Canada.',
    alwNotEligible:
      "L'Allocation est une prestation pour les personnes âgées de 60 à 64 ans dont le conjoint reçoit le Supplément de revenu garanti.",
    alwEligibleButPartnerAlreadyIs:
      "Pour être admissible à cette prestation, votre partenaire doit recevoir la pension de la Sécurité de la vieillesse et le Supplément de revenu garanti. Vous pouvez <a class='text-default-text' style='text-decoration: underline' href='/fr/questions#partnerBenefitStatus'>modifier vos réponses</a> pour voir ce que vous pourriez recevoir si votre partenaire recevait ces prestations.",
    alwEligibleIncomeTooHigh:
      'Vous êtes probablement admissible à cette prestation, mais le revenu combiné de vous et votre conjoint est trop élevé pour recevoir un paiement mensuel pour le moment.',
    alwIfYouApply:
      'Si vous présentez une demande, Service Canada révisera votre déclaration de revenus chaque année. Vous recevrez automatiquement des paiements si votre revenu combiné est moins de&nbsp;',
    alwsIfYouApply:
      'Si vous présentez une demande, Service Canada révisera votre déclaration de revenus chaque année. Vous recevrez automatiquement des paiements si votre revenu est moins de&nbsp;',
    afsNotEligible:
      "L'Allocation au survivant est une prestation pour les personnes veuves âgées de 60 à 64 ans qui ne se sont pas remariées ou engagées dans une nouvelle union de fait.",
    alwsApply:
      'Vous pouvez faire une demande de 6 à 11 mois avant d’être admissible.',
    alwPartnerEligible:
      'Votre conjoint peut faire une demande de 6 à 11 mois avant d’être admissible.',
    autoEnrollTrue:
      "D'après ce que vous nous avez dit, vous <strong>n'avez pas besoin de faire une demande</strong> pour obtenir cette prestation. Vous recevrez une lettre par la poste vous informant de votre <strong>inscription automatique</strong> le mois suivant vos 64 ans.",
    autoEnrollFalse:
      "Selon ce que vous nous avez dit, <strong>vous devrez peut-être demander cette prestation</strong>. Nous ne disposons peut-être pas de suffisamment d'informations pour vous inscrire automatiquement.",
    expectToReceive:
      'Vous pouvez vous attendre à recevoir environ {ENTITLEMENT_AMOUNT_FOR_BENEFIT} par mois.',
    futureExpectToReceive:
      'Si votre revenu reste le même, vous pourriez recevoir environ {ENTITLEMENT_AMOUNT_FOR_BENEFIT} par mois.',
    futureExpectToReceivePartial1: 'Si votre revenu reste le même,',
    futureExpectToReceivePartial2:
      ' et vous vivez au Canada pendant {CALCULATED_YEARS_IN_CANADA} ans,',
    futureExpectToReceivePartial3:
      ' vous pourriez recevoir environ {ENTITLEMENT_AMOUNT_FOR_BENEFIT} par mois.',
    oasClawbackInCanada:
      "Puisque votre revenu est plus grand que {OAS_RECOVERY_TAX_CUTOFF}, vous devrez rembourser une partie ou la totalité de votre pension de la Sécurité de la vieillesse en raison de l'{LINK_RECOVERY_TAX}.",
    futureOasClawbackInCanada:
      "Puisque votre revenu est plus grand que {OAS_RECOVERY_TAX_CUTOFF}, vous ne recevrez pas une partie ou la totalité de votre pension de la Sécurité de la vieillesse en raison de l'{LINK_RECOVERY_TAX}.",
    oasClawbackNotInCanada:
      "Puisque votre revenu est plus grand que {OAS_RECOVERY_TAX_CUTOFF} et que vous vivez à l'extérieur du Canada, vous ne recevrez pas une partie ou la totalité de votre pension de la Sécurité de la vieillesse en raison de : <ul class='list-disc' style='padding-left: 24px;'><li style='padding-left: 2px;'>l'{LINK_RECOVERY_TAX};</li><li style='padding-left: 2px;'>l'{LINK_NON_RESIDENT_TAX}.</li></ul></div>",
    firstYearEligible: '{FIRST_ELIGIBLE_YEAR}',
    lastYearEligible: 'À partir de ',
    currentEligible: 'Présentement',
    you: 'vous pourriez',
    yourPartner: 'votre conjoint pourrait',
    youCouldReceivePerMonth: 'par mois',
    youCouldReceiveTo: 'à',
    youCouldReceive: 'recevoir',
    youCouldReceiveUntil: 'Jusqu’à',
    youCouldReceiveFrom: 'De',
    youCouldStartReceivingAt: 'À',
    youCouldContinueReceiving: 'continuer de recevoir',
    youCouldStartReceiving: 'commencer à recevoir',
    yourEstimateIsStill: 'Votre estimation est encore',
    yourEstimateIsStillPartner: `L'estimation de votre conjoint est encore`,
    theSame: 'la même',
    thisEstimateIsBased:
      'Cette estimation est basée sur {ENTITLEMENT_AMOUNT_FOR_BENEFIT} années de résidence au Canada.',
    oas: {
      eligibleIfIncomeIsLessThan:
        "Vous êtes probablement admissible à cette prestation si votre revenu est moins que {INCOME_LESS_THAN}. Si votre revenu dépasse {OAS_RECOVERY_TAX_CUTOFF}, vous devrez peut-être payer de l'{LINK_RECOVERY_TAX}.",
      dependOnYourIncome:
        'Selon votre revenu, vous pourriez vous attendre à recevoir environ {ENTITLEMENT_AMOUNT_FOR_BENEFIT} par mois. Fournissez votre revenu pour obtenir une estimation précise.',
      eligibleIncomeTooHigh:
        'Vous êtes probablement admissible à cette prestation, mais votre revenu est trop élevé pour recevoir un paiement mensuel pour le moment.',
      futureEligibleIncomeTooHigh:
        'Vous pourriez être admissible lorsque vous aurez {EARLIEST_ELIGIBLE_AGE}. Puisque votre revenu est trop élevé, vous ne recevrez peut-être pas de paiement mensuel.',
      serviceCanadaReviewYourPayment:
        'Si vous présentez une demande, Service Canada révisera le montant de votre paiement chaque année en fonction de votre déclaration de revenus.',
      automaticallyBePaid:
        'Vous recevrez automatiquement des paiements si votre revenu est admissible.',
      youWillReceiveLetter:
        "Votre statut d'inscription devrait être confirmé par la poste le mois après votre 64e anniversaire.",
      shouldReceive65to69:
        "Votre statut d'inscription aurait dû être confirmé par la poste le mois après votre 64e anniversaire. Si vous n'avez pas reçu de lettre, <a id='oasLink2' class='text-default-text' style='text-decoration: underline' target='_blank' aria-label='ouvre dans un nouvel onglet' href='https://www.canada.ca/fr/emploi-developpement-social/ministere/coordonnees/sv.html'>communiquez avec nous</a> pour savoir si vous devez présenter une demande.",
      youShouldReceiveLetter:
        "Vous devriez recevoir une lettre au sujet de votre statut d'inscription le mois après votre 64e anniversaire.",
      youShouldHaveReceivedLetter:
        "Vous devriez avoir reçu une lettre au sujet de votre statut d'inscription le mois après votre 64e anniversaire.",
      ifYouDidnt:
        "Si vous ne l'avez pas reçue, <a id='oasLink2' class='text-default-text' style='text-decoration: underline' target='_blank' aria-label='ouvre dans un nouvel onglet' href='https://www.canada.ca/fr/emploi-developpement-social/ministere/coordonnees/sv.html'>communiquez avec nous</a> pour savoir si vous devez présenter une demande.",
      applyOnline:
        "Si vous ne l'avez pas reçue, vous pouvez présenter une demande en ligne.",
      over70:
        'Si vous avez plus de 70 ans et ne recevez pas la pension la Sécurité de la vieillesse, présentez votre demande dès que possible.',
      eligibleWhenTurn65:
        "Vous pourriez être admissible lorsque vous aurez 65 ans. Vous pouvez <a class='text-default-text' style='text-decoration: underline' href='/fr/questions#age'>modifier vos réponses</a> pour voir ce que vous pourriez recevoir à un âge futur.",
      ifNotReceiveLetter64:
        "Si vous ne l'avez pas reçue, <a class='addOpenNew text-default-text' style='text-decoration: underline' target='_blank' aria-label='ouvre dans un nouvel onglet' href='https://www.canada.ca/fr/emploi-developpement-social/ministere/coordonnees/sv.html'>communiquez avec nous</a> pour savoir si vous devez présenter une demande.",
      chooseToDefer:
        "Vous pouvez choisir de reporter votre pension ou augmenter vos années de résidence au Canada. Pour savoir quelle option serait la meilleure pour vous, <a class='addOpenNew text-default-text link-no-deco' style='text-decoration: underline' target='_blank' aria-label='ouvre dans un nouvel onglet' href='https://www.canada.ca/fr/emploi-developpement-social/ministere/coordonnees/sv.html'>communiquez avec nous</a>.",
      receivePayment:
        'Vous pourriez recevoir un paiement pour un maximum des 11 derniers mois.',
    },
    gis: {
      youCanApplyGis:
        'Vous pouvez faire une demande pour le Supplément de revenu garanti lorsque vous présentez votre demande pour la pension de la Sécurité de la vieillesse.',
      eligibleDependingOnIncomeNoEntitlement:
        'Vous pourriez probablement recevoir cette prestation si {INCOME_SINGLE_OR_COMBINED} est moins que {INCOME_LESS_THAN}. Fournissez {YOUR_OR_COMPLETE} pour obtenir une estimation de paiement mensuel.',
      incomeTooHigh:
        'Vous êtes probablement admissible à cette prestation, mais votre revenu est trop élevé pour recevoir un paiement mensuel pour le moment.',
      futureEligibleIncomeTooHigh:
        'Vous pourriez être admissible lorsque vous aurez {EARLIEST_ELIGIBLE_AGE}. Si votre revenu reste le même, vous ne recevrez peut-être pas de paiement mensuel.',
      ifYouApply:
        'Si vous présentez une demande, Service Canada révisera votre déclaration de revenus chaque année. Vous recevrez automatiquement des paiements si votre revenu  est admissible.',
      canApplyOnline: 'Vous pouvez faire une demande pour cette prestation.',
      ifYouAlreadyApplied:
        "Si vous avez déjà demandé le Supplément de revenu garanti, vous pouvez <a id='oasLink2' class='text-default-text' style='text-decoration: underline' target='_blank' aria-label='opens a new tab' href='https://www.canada.ca/fr/emploi-developpement-social/services/mon-dossier.html'>vous connecter à Mon dossier Service Canada<a/> pour confirmer que vos renseignements sont à jour.",
      ifYouAlreadyReceive:
        'Si vous recevez déjà le Supplément de revenu garanti, vous pouvez confirmer que vos renseignements sont à jour dans votre compte {MY_SERVICE_CANADA}.',
    },
    alw: {
      forIndividuals: 'Cette prestation est pour les personnes :',
      age60to64: 'âgées de 60 à 64 ans;',
      livingInCanada: 'qui vivent au Canada;',
      spouseReceives:
        'dont le conjoint reçoit le Supplément de revenu garanti.',
      yourPartnerCanApply:
        'Votre conjoint peut faire une demande de 6 à 11 mois avant d’être admissible à 65 ans.',
    },
    alws: {
      forWidowedIndividuals:
        'Cette prestation est pour les personnes veuves&nbsp;:',
      haveNotRemarried:
        'qui ne se sont pas remariées ou engagées dans une nouvelle union de fait.',
    },
  },
  detailWithHeading: {
    ifYouDeferYourPension: {
      heading: 'Si vous reportez votre pension',
      text: 'Vous ne pouvez pas recevoir cette prestation si vous ne recevez pas la pension de la Sécurité de la vieillesse. Vos paiements du Supplément de revenu garanti n’augmenteront pas si vous reportez votre pension.',
    },
    oasDeferralApplied: {
      heading: 'Comment le report affecte vos paiements',
      text: 'Vous avez reporté vos prestations de la SV de {OAS_DEFERRAL_YEARS}. Cela signifie que vos paiements de la SV commenceront une fois que vous aurez {OAS_DEFERRAL_AGE} ans et que vous recevrez {OAS_DEFERRAL_INCREASE} supplémentaires par mois.',
    },
    oasDeferralAvailable: {
      heading: 'Vous pouvez peut-être différer vos paiements',
      text: 'Renseignez-vous sur la {LINK_OAS_DEFER_CLICK_HERE}.',
    },
    oasClawback: {
      heading: 'Vous devrez peut-être rembourser une partie de votre pension',
      text: 'Parce que {INCOME_SINGLE_OR_COMBINED} dépasse {OAS_RECOVERY_TAX_CUTOFF}, vous devrez peut-être rembourser {OAS_CLAWBACK} en {LINK_RECOVERY_TAX}.',
    },
    oasIncreaseAt75: {
      heading: 'Vos paiements augmenteront lorsque vous aurez 75 ans',
      text: 'Lorsque vous aurez 75 ans, vos paiements de la pension de la Sécurité de la vieillesse augmenteront de 10 %.',
    },
    oasIncreaseAt75Applied: {
      heading: 'Vos paiements ont augmenté car vous avez plus de 75 ans',
      text: 'Parce que vous avez plus de 75 ans, vos paiements de la pension de la Sécurité de la vieillesse ont augmenté de 10 %.',
    },
    calculatedBasedOnIndividualIncome: {
      heading:
        'Certains montants ont été calculés à partir du revenu individuel',
      text: 'Parce que vous ne vivez pas avec votre conjoint pour des raisons hors de votre contrôle, vous pouvez recevoir des paiements mensuels plus élevés.',
    },
    partnerEligible: {
      heading: 'Votre conjoint pourrait être admissible',
      text: "Selon vos renseignements, votre conjoint pourrait recevoir {PARTNER_BENEFIT_AMOUNT} par mois. Votre conjoint peut utiliser l'estimateur pour obtenir des résultats détaillés.",
    },
    partnerDependOnYourIncome: {
      heading: 'Votre conjoint pourrait être admissible',
      text: 'Selon votre revenu, vous pourriez vous attendre à recevoir environ {PARTNER_BENEFIT_AMOUNT} par mois. Fournissez votre revenu pour obtenir une estimation précise.',
    },
    partnerEligibleButAnsweredNo: {
      heading: 'Votre conjoint pourrait être admissible',
      text: 'Vous pouvez <a class="link-no-deco" href="/fr/questions?step=age" class="text-default-text" style="text-decoration: underline">modifier vos réponses</a> pour voir ce que vous et votre partenaire pourriez recevoir si votre partenaire recevait la pension de la Sécurité de la vieillesse.',
    },
    recoveryTax: {
      heading: 'L’impôt de récupération s’appliquera à votre pension',
      text: "Puisque votre revenu est plus grand que {OAS_RECOVERY_TAX_CUTOFF}, vous ne recevrez pas une partie ou la totalité de votre pension de la Sécurité de la vieillesse en raison de l'{LINK_RECOVERY_TAX}.",
    },
    recoveryTaxPartner: {
      heading:
        'L’impôt de récupération s’appliquera à la pension de votre conjoint',
      text: "Puisque le revenu de votre conjoint est plus grand que {OAS_RECOVERY_TAX_CUTOFF}, il ne recevra pas une partie ou la totalité de sa pension de la Sécurité de la vieillesse en raison de l'{LINK_RECOVERY_TAX}.",
    },
    recoveryTaxBoth: {
      heading: 'L’impôt de récupération s’appliquera à vos pensions',
      text: "Puisque vos revenus et ceux de votre conjoint sont plus grand que {OAS_RECOVERY_TAX_CUTOFF}, vous ne recevrez pas une partie ou la totalité de vos pensions de la Sécurité de la vieillesse en raison de l'{LINK_RECOVERY_TAX}.",
    },
    nonResidentTax: {
      heading: 'Des impôts s’appliqueront à votre pension',
      text: "Puisque votre revenu est plus grand que {OAS_RECOVERY_TAX_CUTOFF} et que vous vivez à l'extérieur du Canada, vous ne recevrez pas une partie ou la totalité de votre pension de la Sécurité de la vieillesse en raison de : <ul class='list-disc' style='padding-left: 24px;'><li style='padding-left: 2px;'>l'{LINK_RECOVERY_TAX};</li><li style='padding-left: 2px;'>l'{LINK_NON_RESIDENT_TAX}.</li></ul></div>",
    },
    nonResidentTaxPartner: {
      heading: 'Des impôts s’appliqueront à la pension de votre conjoint',
      text: "Puisque le revenu de votre conjoint est plus grand que {OAS_RECOVERY_TAX_CUTOFF} et qu’il vit à l’extérieur du Canada, il ne recevra pas une partie ou la totalité de sa pension de la Sécurité de la vieillesse en raison de : <ul class='list-disc' style='padding-left: 24px;'><li style='padding-left: 2px;'>l'{LINK_RECOVERY_TAX};</li><li style='padding-left: 2px;'>l'{LINK_NON_RESIDENT_TAX}.</li></ul></div>",
    },
    nonResidentTaxBoth: {
      heading: 'Des impôts s’appliqueront à vos pensions',
      text: "Puisque vos revenus et ceux de votre conjoint sont plus grand que {OAS_RECOVERY_TAX_CUTOFF} et que vous vivez à l'extérieur du Canada, vous ne recevrez pas une partie ou la totalité de vos pensions de la Sécurité de la vieillesse en raison de : <ul class='list-disc' style='padding-left: 24px;'><li style='padding-left: 2px;'>l'{LINK_RECOVERY_TAX};</li><li style='padding-left: 2px;'>l'{LINK_NON_RESIDENT_TAX}.</li></ul></div>",
    },
    yourDeferralOptions: {
      heading: 'Vos options de report',
      text: "Vous pouvez commencer à recevoir vos paiements de la pension de la Sécurité de la vieillesse à 65 ans ou attendre d'avoir 70 ans.",
    },
    deferralDelay: {
      heading: 'Vos options de report',
      text: 'Vous pouvez reporter votre pension pour encore {DELAY_MONTHS} mois.',
    },
    retroactivePayment: {
      heading: 'Paiement rétroactif',
      text: 'Vous pourriez recevoir un paiement pour un maximum des 11 derniers mois.',
    },
    mayBecomeEligible: {
      heading: 'Paiement rétroactif',
      text: 'Vous pourriez recevoir un paiement pour un maximum des 11 derniers mois.',
    },
    socialSecurityEligible: {
      heading: 'Vous pourriez devenir admissible plus tôt',
      text: "Vous pourriez devenir admissible plus tôt parce que vous avez vécu dans un pays avec un accord de sécurité sociale avec le Canada. Ceci pourrait affecter votre estimation. <a class='addOpenNew text-default-text link-no-deco' style='text-decoration: underline' target='_blank' aria-label='ouvre dans un nouvel onglet' href='https://www.canada.ca/fr/emploi-developpement-social/ministere/coordonnees/sv.html'>Communiquez avec nous</a> pour plus de détails.",
    },
    socialSecurityEligiblePartner: {
      heading: 'Votre conjoint pourrait devenir admissible plus tôt',
      text: "Votre conjoint pourrait devenir admissible plus tôt parce qu’il a vécu dans un pays avec un accord de sécurité sociale avec le Canada. Ceci pourrait affecter son estimation. <a class='addOpenNew text-default-text link-no-deco' style='text-decoration: underline' target='_blank' aria-label='ouvre dans un nouvel onglet' href='https://www.canada.ca/fr/emploi-developpement-social/ministere/coordonnees/sv.html'>Communiquez avec nous</a> pour plus de détails.",
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
      "Selon les renseignements que vous avez fournis aujourd'hui, vous êtes probablement admissible à un montant mensuel total estimé à {ENTITLEMENT_AMOUNT_SUM}. Notez que les montants ne sont qu'une estimation de votre paiement mensuel. Des changements dans votre situation peuvent affecter vos résultats.",
    [SummaryState.AVAILABLE_INELIGIBLE]:
      "Selon les renseignements que vous avez fournis aujourd'hui, vous n'avez probablement pas droit à des prestations. Voir les détails ci-dessous pour en savoir plus.",
    [SummaryState.AVAILABLE_DEPENDING]:
      "En fonction de vos revenus, vous pouvez être éligible aux prestations de vieillesse. Voir les détails ci-dessous pour plus d'informations.",
  },
  oasDeferralTable: {
    title: 'Montants de report estimés',
    headingAge: "Si vous attendez d'avoir...",
    futureHeadingAge: 'Si vous commencez votre pension à...',
    headingAmount: 'Vous pourriez recevoir chaque mois...',
    psdAnchor: 'Changez votre date de début de pension',
  },
  modal: {
    userHeading: 'Est-ce que vous pouvez recevoir cette prestation?',
    partnerHeading: 'Est-ce que votre conjoint peut recevoir cette prestation?',
    userIncomeTooHigh:
      'Vous pouvez faire une demande pour cette prestation, mais votre revenu est trop élevé pour recevoir un paiement mensuel pour le moment.',
    partnerIncomeTooHigh:
      'Votre conjoint peut faire une demande pour cette prestation, mais son revenu est trop élevé pour recevoir un paiement mensuel pour le moment.',
    userCoupleIncomeTooHigh:
      'Vous pouvez faire une demande pour cette prestation, mais votre revenu de couple est trop élevé pour recevoir un paiement mensuel pour le moment.',
    partnerCoupleIncomeTooHigh:
      'Votre conjoint peut faire une demande pour cette prestation, mais votre revenu de couple est trop élevé pour recevoir un paiement mensuel pour le moment.',
    close: 'Fermer',
  },
  links,
  incomeSingle: 'votre revenu',
  incomeCombined: 'le revenu combiné de vous et votre conjoint',
  opensNewWindow: 'ouvre une nouvelle fenêtre',
  nextStepTitle: 'Prochaines étapes',
  yes: 'Oui',
  no: 'Non',
  year: 'an',
  month: 'mois',
  months: 'mois',
  your: 'votre revenu',
  complete: 'vos revenus',
  at: 'À',
  atAge: ' ans,',
}
export default fr
