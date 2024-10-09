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
    [FieldCategory.RESIDENCE]: 'Historique de résidence',
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
  },
  question: {
    [FieldKey.INCOME_AVAILABLE]:
      'Êtes-vous en mesure de nous fournir votre revenu net annuel?',
    [FieldKey.INCOME]:
      'Quel sera votre revenu annuel net lorsque vous commencerez à recevoir vos prestations?',
    [FieldKey.INCOME_WORK]:
      'Combien de ce montant provient de revenus d’emploi ou de travail indépendant?',
    [FieldKey.AGE]: 'Quel est votre mois de naissance?',
    [FieldKey.ALREADY_RECEIVE_OAS]:
      'Recevez-vous la pension de la Sécurité de la vieillesse?',
    [FieldKey.WHEN_TO_START]:
      'Quand voulez-vous commencer à recevoir votre pension de la Sécurité de la vieillesse?',
    [FieldKey.START_DATE_FOR_OAS]: 'Entrez une date de début',
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
  },
  questionShortText: {
    [FieldKey.AGE]: 'Âge',
    [FieldKey.ALREADY_RECEIVE_OAS]: 'Reçoit la pension de la SV',
    [FieldKey.WHEN_TO_START]: 'Date de début de la pension SV',
    [FieldKey.START_DATE_FOR_OAS]: 'date de début',
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
  },
  questionAriaLabel: {
    [FieldKey.AGE]: 'Modifier votre âge',
    [FieldKey.OAS_AGE]: 'Commencer à',
    [FieldKey.ALREADY_RECEIVE_OAS]:
      'Modifier si vous recevez la pension de la SV',
    [FieldKey.WHEN_TO_START]:
      'Modifier quand voulez-vous commencer à recevoir votre pension de la Sécurité de la vieillesse?',
    [FieldKey.START_DATE_FOR_OAS]: 'Modifier votre date de début',
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
  },
  questionHelp: {
    [FieldKey.INCOME_AVAILABLE]:
      'Fournir votre revenu vous donnera des résultats plus précis.',
    [FieldKey.INCOME]:
      "Incluez tous les types de revenus après déductions, y compris : <ul><li>les pensions (y compris le <dfn><abbr title='Régime de pensions du Canada'>RPC</abbr></dfn> et le <dfn><abbr title='Régime de rentes du Québec'>RRQ</abbr></dfn>);</li><li>les prestations;</li><li>les salaires;</li><li>les retraits d'un fonds de retraite (y compris d’un <dfn><abbr title='Régime enregistré d’épargne-retraite'>REER</abbr></dfn>).</li></ul> N'incluez pas les paiements : <ul><li>de la pension de la Sécurité de la vieillesse;</li><li>du Supplément de revenu garanti;</li><li>de l’Allocation;</li><li>de l’Allocation au survivant.</li></ul>",
    [FieldKey.INCOME_WORK]:
      "Incluez tout salaire provenant d'un emploi ou de travail indépendant que vous avez inclus dans votre revenu annuel net.",
    [FieldKey.INV_SEPARATED]:
      "Par exemple, parce que votre conjoint vit dans un foyer de soins ou dans un logement séparé pour être proche de son travail ou d'assistance médicale.",
    [FieldKey.PARTNER_INCOME]:
      "Incluez tous les types de revenus après déductions, y compris : <ul><li>les pensions (y compris le <dfn><abbr title='Régime de pensions du Canada'>RPC</abbr></dfn> et le <dfn><abbr title='Régime de rentes du Québec'>RRQ</abbr></dfn>);</li><li>les prestations;</li><li>les salaires;</li><li>les retraits d'un fonds de retraite (y compris d’un <dfn><abbr title='Régime enregistré d’épargne-retraite'>REER</abbr></dfn>).</li></ul> N'incluez pas les paiements : <ul><li>de la pension de la Sécurité de la vieillesse;</li><li>du Supplément de revenu garanti;</li><li>de l’Allocation;</li><li>de l’Allocation au survivant.</li></ul>",
    [FieldKey.PARTNER_INCOME_WORK]:
      "Incluez tout salaire provenant d'un emploi ou de travail indépendant que vous avez inclus dans son revenu annuel net.",
    [FieldKey.OAS_DEFER]:
      '<div>Si vous recevez déjà la pension de la SV, indiquez quand vous avez commencé à la recevoir. {LINK_OAS_DEFER_INLINE}</div>',
    [FieldKey.OAS_DEFER_DURATION]:
      "Si vous n'avez pas reporté votre pension, passez à l'étape suivante.",
    [FieldKey.WHEN_TO_START]:
      'Si vous êtes admissible, vous pouvez commencer dès le mois après votre 65e anniversaire.',
    [FieldKey.OAS_AGE]: 'Ce nombre doit être entre 65 et 70.',
    [FieldKey.YEARS_IN_CANADA_SINCE_18]:
      "Ne comptez pas les périodes où vous étiez à l'extérieur du Canada pendant au moins 6 mois consécutifs. Certaines exceptions s'appliquent, comme travailler pour un employeur canadien à l'étranger.",
    [FieldKey.YEARS_IN_CANADA_SINCE_OAS]:
      "Comptez seulement le nombre d'années depuis l'âge de 18 ans.",
    [FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18]:
      "Ne comptez pas les périodes où votre conjoint était à l'extérieur du Canada pendant au moins 6 mois consécutifs. Certaines exceptions s'appliquent, comme travailler pour un employeur canadien à l'étranger.",
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
    [FieldKey.WHEN_TO_START]: [
      {
        key: true,
        text: 'As soon as possible',
        shortText: 'As soon as possible',
      },
      {
        key: false,
        text: 'As of a specific month',
        shortText: 'As of a specific month',
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
        text: 'Oui, mon conjoint reçoit la pension de la Sécurité de la vieillesse',
        shortText: 'Oui',
      },
      // {
      //   key: PartnerBenefitStatus.ALW,
      //   text: "Mon conjoint reçoit l'Allocation",
      //   shortText: 'Oui',
      // },
      {
        key: PartnerBenefitStatus.NONE,
        text: 'Non, mon conjoint ne reçoit pas la pension de la Sécurité de la vieillesse',
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
    retroactivePay: 'Paiement rétroactif',
    sinceYouAreSixty:
      'Puisque vous avez {CURRENT_AGE} ans, vous pouvez commencer à recevoir vos paiements immédiatement ou attendre encore {WAIT_MONTHS} mois.',
    futureDeferralOptions:
      "Vous pouvez commencer à recevoir vos paiements à {EARLIEST_ELIGIBLE_AGE} ans ou attendre d'avoir 70 ans.",
    youCanAply:
      'Vous pouvez présenter votre demande 11 mois avant la date à laquelle vous aimeriez recevoir votre premier paiement.',
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
      "Vous devez habiter au Canada pour recevoir cette prestation. Vous pouvez <a class='text-default-text' style='text-decoration: underline' href='/fr/questions#livingCountry'>modifier vos réponses</a> pour voir ce que vous pourriez recevoir si vous habitiez au Canada.",
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
    continueReceiving: 'Si vous continuez de recevoir à',
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
      'Cette estimation est basée sur les informations fournies. Votre montant réel pourrait être différent. Pour confirmer que vos renseignements sont à jour, consultez votre compte {MY_SERVICE_CANADA}.',
    thisEstimateWhenZero:
      'Cette estimation est basée sur les informations fournies. Pour confirmer que vos renseignements sont à jour, consultez votre compte {MY_SERVICE_CANADA}.',
    alwNotEligible:
      "L'Allocation est une prestation pour les personnes âgées de 60 à 64 ans dont le conjoint reçoit le Supplément de revenu garanti.",
    alwEligibleButPartnerAlreadyIs:
      "Pour être admissible à cette prestation, votre partenaire doit recevoir la pension de la Sécurité de la vieillesse et le Supplément de revenu garanti. Vous pouvez <a class='text-default-text' style='text-decoration: underline' href='/fr/questions#partnerBenefitStatus'>modifier vos réponses</a> pour voir ce que vous pourriez recevoir si votre partenaire recevait ces prestations.",
    alwEligibleIncomeTooHigh:
      'Vous êtes probablement admissible à cette prestation, mais le revenu combiné de vous et votre conjoint est trop élevé pour recevoir un paiement mensuel pour le moment.',
    alwIfYouApply:
      'Si vous présentez une demande, Service Canada révisera votre déclaration de revenus chaque année. Vous recevrez automatiquement des paiements si votre revenu combiné est moins que ',
    alwsIfYouApply:
      'Si vous présentez une demande, Service Canada révisera votre déclaration de revenus chaque année. Vous recevrez automatiquement des paiements si votre revenu est moins que ',
    afsNotEligible:
      "L'Allocation au survivant est une prestation pour les personnes veuves âgées de 60 à 64 ans qui ne se sont pas remariées ou engagées dans une nouvelle union de fait.",
    alwsApply:
      'Vous pouvez présenter une demande pour cette prestation 1 mois après votre 59e anniversaire. ',
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
        "Vous devriez recevoir une lettre au sujet de votre statut d'inscription le mois après votre 64e anniversaire.",
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
        "Vous pouvez choisir de reporter votre pension ou augmenter vos années de résidence au Canada. Pour savoir quelle option serait la meilleure pour vous, <a class='addOpenNew text-default-text' style='text-decoration: underline' target='_blank' aria-label='ouvre dans un nouvel onglet' href='https://www.canada.ca/fr/emploi-developpement-social/ministere/coordonnees/sv.html'>communiquez avec nous</a>.",
      receivePayment:
        'Vous pourriez recevoir un paiement pour un maximum des 11 derniers mois.',
    },
    gis: {
      eligibleDependingOnIncomeNoEntitlement:
        'Vous pourriez probablement recevoir cette prestation si {INCOME_SINGLE_OR_COMBINED} est moins que {INCOME_LESS_THAN}. Fournissez {YOUR_OR_COMPLETE} pour obtenir une estimation de paiement mensuel.',
      incomeTooHigh:
        'Vous êtes probablement admissible à cette prestation, mais votre revenu est trop élevé pour recevoir un paiement mensuel pour le moment.',
      futureEligibleIncomeTooHigh:
        'Vous pourriez être admissible lorsque vous aurez {EARLIEST_ELIGIBLE_AGE}. Si votre revenu reste le même, vous ne recevrez peut-être pas de paiement mensuel.',
      ifYouApply:
        'Si vous présentez une demande, Service Canada révisera votre déclaration de revenus chaque année. Vous recevrez automatiquement des paiements si votre revenu  est admissible.',
      canApplyOnline:
        'Vous pouvez faire une demande pour cette prestation en ligne.',
      ifYouAlreadyApplied:
        'Si vous avez déjà fait une demande pour le Supplément de revenu garanti, vous pouvez confirmer que vos renseignements sont à jour dans votre compte {MY_SERVICE_CANADA}.',
      ifYouAlreadyReceive:
        'Si vous recevez déjà le Supplément de revenu garanti, vous pouvez confirmer que vos renseignements sont à jour dans votre compte {MY_SERVICE_CANADA}.',
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
      text: 'Lorsque vous aurez 75 ans, vos paiements augmenteront de 10 %.',
    },
    oasIncreaseAt75Applied: {
      heading: 'Vos paiements ont augmenté car vous avez plus de 75 ans',
      text: 'Parce que vous avez plus de 75 ans, vos paiements ont augmenté de 10 %.',
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
      text: 'Vous pouvez <a href="/fr/questions#partnerBenefitStatus" class="text-default-text" style="text-decoration: underline">modifier vos réponses</a> pour voir ce que vous et votre partenaire pourriez recevoir si votre partenaire recevait la pension de la Sécurité de la vieillesse.',
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
