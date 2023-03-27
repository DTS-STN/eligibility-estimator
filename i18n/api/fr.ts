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
    [FieldCategory.MARITAL]: 'État matrimonial',
  },
  result: {
    [ResultKey.ELIGIBLE]: 'Admissible',
    [ResultKey.INELIGIBLE]: 'Non\xA0admissible',
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
    [FieldKey.MARITAL_STATUS]: 'Quel est votre état matrimonial?',
    [FieldKey.INV_SEPARATED]:
      'Est-ce que vous et votre conjoint vivez séparément pour des raisons indépendantes de votre volonté?',
    [FieldKey.LIVING_COUNTRY]: 'Dans quel pays résidez-vous?',
    [FieldKey.LEGAL_STATUS]: 'Avez-vous un statut légal au Canada?',
    [FieldKey.LIVED_OUTSIDE_CANADA]:
      "Depuis l'âge de 18 ans, avez-vous vécu à l'extérieur du Canada pendant plus de 6&nbsp;mois?",
    [FieldKey.YEARS_IN_CANADA_SINCE_18]:
      "Depuis l'âge de 18 ans, combien d'années avez-vous vécu au Canada?",
    [FieldKey.EVER_LIVED_SOCIAL_COUNTRY]:
      'Avez-vous déjà vécu dans un pays ayant un {LINK_SOCIAL_AGREEMENT} avec le Canada?',
    [FieldKey.PARTNER_BENEFIT_STATUS]:
      'Votre conjoint reçoit-il la pension de la Sécurité de la vieillesse?',
    [FieldKey.PARTNER_INCOME_AVAILABLE]:
      'Êtes-vous en mesure de nous fournir le revenu net annuel de votre conjoint?',
    [FieldKey.PARTNER_INCOME]:
      'Quel est le revenu annuel net (revenu après impôts) de votre conjoint en dollars canadiens?',
    [FieldKey.PARTNER_AGE]:
      'En quel mois et quelle année votre conjoint est-il né?',
    [FieldKey.PARTNER_LIVING_COUNTRY]: 'Dans quel pays votre conjoint vit-il?',
    [FieldKey.PARTNER_LEGAL_STATUS]:
      'Votre conjoint a-t-il un statut légal au Canada?',
    [FieldKey.PARTNER_LIVED_OUTSIDE_CANADA]:
      "Depuis l'âge de 18 ans, votre conjoint a-t-il vécu à l'extérieur du Canada pendant plus de 6 mois?",
    [FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18]:
      "Depuis l'âge de 18 ans, combien d'années votre conjoint a-t-il habité au Canada?",
  },
  questionShortText: {
    [FieldKey.AGE]: 'Âge',
    [FieldKey.OAS_DEFER]: 'Report de la pension de la SV',
    [FieldKey.OAS_AGE]: 'Report de la pension de la\xA0SV',
    [FieldKey.INCOME_AVAILABLE]: 'Revenu net',
    [FieldKey.INCOME]: 'Revenu net',
    [FieldKey.LEGAL_STATUS]: 'Statut légal',
    [FieldKey.LIVING_COUNTRY]: 'Pays de résidence',
    [FieldKey.LIVED_OUTSIDE_CANADA]: "Vécu à l'extérieur du Canada",
    [FieldKey.YEARS_IN_CANADA_SINCE_18]: 'Années vécues au Canada',
    [FieldKey.EVER_LIVED_SOCIAL_COUNTRY]:
      'A vécu dans un pays avec un accord social',
    [FieldKey.MARITAL_STATUS]: 'État matrimonial',
    [FieldKey.INV_SEPARATED]: 'Séparation involontaire',
    [FieldKey.PARTNER_INCOME_AVAILABLE]: 'Revenu du conjoint fourni',
    [FieldKey.PARTNER_INCOME]: 'Revenu net du conjoint',
    [FieldKey.PARTNER_BENEFIT_STATUS]: 'Conjoint reçoit la pension de la SV',
    [FieldKey.PARTNER_AGE]: 'Âge du conjoint',
    [FieldKey.PARTNER_LEGAL_STATUS]: 'Statut légal du conjoint',
    [FieldKey.PARTNER_LIVING_COUNTRY]: 'Pays de résidence du conjoint',
    [FieldKey.PARTNER_LIVED_OUTSIDE_CANADA]:
      "Conjoint a vécu à l'extérieur du Canada",
    [FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18]:
      'Années où le conjoint a vécu au Canada',
  },
  questionAriaLabel: {
    [FieldKey.AGE]: 'Modifier votre âge',
    [FieldKey.OAS_AGE]: 'Commencer à',
    [FieldKey.OAS_DEFER]: 'Modifier votre décision de report',
    [FieldKey.INCOME_AVAILABLE]: 'Modifier si vous fournissez votre revenu',
    [FieldKey.INCOME]: 'Modifier votre revenu net',
    [FieldKey.LEGAL_STATUS]: 'Modifier votre statut légal',
    [FieldKey.LIVING_COUNTRY]: 'Modifier votre pays de résidence',
    [FieldKey.LIVED_OUTSIDE_CANADA]:
      'Modifier si vous avez vécu à l’extérieur du Canada',
    [FieldKey.YEARS_IN_CANADA_SINCE_18]:
      'Modifier le nombre d’années vécues au Canada',
    [FieldKey.MARITAL_STATUS]: 'Modifier votre état matrimonial',
    [FieldKey.INV_SEPARATED]:
      'Modifier votre statut de séparation involontaire',
    [FieldKey.PARTNER_INCOME_AVAILABLE]:
      'Modifier si vous fournissez le revenu de votre conjoint',
    [FieldKey.PARTNER_INCOME]: 'Modifier le revenu net de votre conjoint',
    [FieldKey.PARTNER_BENEFIT_STATUS]:
      'Modifier si votre conjoint reçoit la pension de la SV',
    [FieldKey.PARTNER_AGE]: "Modifier l'âge de votre conjoint",
    [FieldKey.PARTNER_LEGAL_STATUS]:
      'Modifier le statut légal de votre conjoint',
    [FieldKey.PARTNER_LIVING_COUNTRY]:
      'Modifier le pays de résidence de votre conjoint',
    [FieldKey.PARTNER_LIVED_OUTSIDE_CANADA]:
      'Modifier si votre conjoint a vécu à l’extérieur du Canada',
    [FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18]:
      'Modifier le nombre d’années vécues au Canada de votre conjoint',
  },
  questionHelp: {
    [FieldKey.INCOME_AVAILABLE]:
      'Fournir votre revenu vous donnera des résultats plus précis.',
    [FieldKey.INV_SEPARATED]:
      "Une séparation involontaire peut survenir lorsque l'un des conjoints est absent pour des raisons de travail, d'études ou de santé.",
    [FieldKey.PARTNER_INCOME_AVAILABLE]:
      'Fournir le revenu de votre conjoint vous donnera des résultats plus précis.',
    [FieldKey.OAS_DEFER]:
      '<div>Si vous recevez déjà la pension de la SV, indiquez quand vous avez commencé à la recevoir. {LINK_OAS_DEFER_INLINE}</div>',
    [FieldKey.OAS_AGE]: 'Ce nombre doit être entre 65 et 70.',
    [FieldKey.YEARS_IN_CANADA_SINCE_18]:
      "Si vous n'êtes pas certain du nombre exact, vous pouvez entrer une estimation.",
    [FieldKey.PARTNER_YEARS_IN_CANADA_SINCE_18]:
      "Si vous n'êtes pas certain du nombre exact, vous pouvez entrer une estimation.",
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
    [FieldKey.OAS_DEFER]: [
      {
        key: false,
        text: 'Je voudrais commencer à 65 ans (le plus commun)',
        shortText: 'Commencer à 65&nbsp;ans',
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
    [FieldKey.LIVED_OUTSIDE_CANADA]: [
      {
        key: false,
        text: "Non, je n'ai pas vécu à l'extérieur du Canada pendant plus de 6&nbsp;mois",
        shortText: 'Non',
      },
      {
        key: true,
        text: "Oui, j'ai vécu à l'extérieur du Canada pendant plus de 6&nbsp;mois",
        shortText: 'Oui',
      },
    ],
    [FieldKey.PARTNER_LIVED_OUTSIDE_CANADA]: [
      {
        key: false,
        text: "Non, mon conjoint n'a pas vécu à l'extérieur du Canada pendant plus de 6&nbsp;mois",
        shortText: 'Non',
      },
      {
        key: true,
        text: "Oui, mon conjoint a vécu à l'extérieur du Canada pendant plus de 6&nbsp;mois",
        shortText: 'Oui',
      },
    ],
    [FieldKey.MARITAL_STATUS]: [
      {
        key: MaritalStatus.SINGLE,
        text: 'Célibataire, divorcé ou séparé',
        shortText: 'Célibataire',
      },
      {
        key: MaritalStatus.PARTNERED,
        text: 'Marié ou conjoint de fait',
        shortText: 'Marié ou conjoint de fait',
      },
      {
        key: MaritalStatus.WIDOWED,
        text: 'Conjoint survivant',
        shortText: 'Conjoint survivant',
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
    eligibleIncomeTooHigh:
      'Vous êtes probablement admissible à cette prestation, mais votre revenu est trop élevé pour recevoir un paiement mensuel pour le moment.',
    eligibleDependingOnIncome:
      'Vous êtes probablement éligible à cette prestation si {INCOME_SINGLE_OR_COMBINED} est inférieur à {INCOME_LESS_THAN}. En fonction de {YOUR_OR_COMPLETE}, vous devriez vous attendre à recevoir environ {ENTITLEMENT_AMOUNT_FOR_BENEFIT} par mois.',
    eligibleDependingOnIncomeNoEntitlement:
      'Vous êtes probablement admissible à cette prestation si {INCOME_SINGLE_OR_COMBINED} est moins que {INCOME_LESS_THAN}. Fournissez {YOUR_OR_COMPLETE} pour obtenir une estimation de paiement mensuel.',
    eligibleEntitlementUnavailable:
      "Vous êtes probablement admissible à cette prestation, mais une estimation du droit à cette prestation n'est pas disponible. Vous devriez communiquer avec {LINK_SERVICE_CANADA} pour obtenir plus de renseignements sur le montant de vos paiements.",
    eligiblePartialOas:
      'Vous êtes probablement admissible à une pension partielle de la Sécurité de la vieillesse.',
    eligibleWhen60ApplyNow:
      'Vous serez probablement admissible à votre 60e anniversaire. Par contre, vous pourriez être en mesure de présenter une demande dès maintenant. Veuillez communiquer avec {LINK_SERVICE_CANADA} pour en savoir plus.',
    eligibleWhen65ApplyNow:
      'Vous serez probablement admissible à votre 65e anniversaire. Par contre, vous pourriez être en mesure de présenter une demande dès maintenant. Veuillez communiquer avec {LINK_SERVICE_CANADA} pour en savoir plus.',
    eligibleWhen60:
      "Vous serez probablement admissible lorsque vous aurez 60 ans. Vous pouvez <a class='underline text-default-text' href='/fr/eligibility/#age'>modifier vos réponses</a> pour voir ce que vous pourriez recevoir à un âge futur. <p class='mt-6'>Vous pouvez présenter une demande pour cette prestation 1&nbsp;mois après votre 59e&nbsp;anniversaire.</p>",
    eligibleWhen65:
      'Vous serez probablement admissible à votre 65e anniversaire.',
    mustBeInCanada:
      "Vous devez habiter au Canada pour recevoir cette prestation. Vous pouvez <a class='underline text-default-text' href='/fr/eligibility/#livingCountry'>modifier vos réponses</a> pour voir ce que vous pourriez recevoir si vous habitiez au Canada.",
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
      "L'Allocation est une prestation pour les personnes âgées de&nbsp;60 à&nbsp;64 ans dont le conjoint reçoit le Supplément de revenu garanti.",
    alwEligibleIncomeTooHigh:
      'Vous êtes probablement admissible à cette prestation, mais le revenu combiné de vous et votre conjoint est trop élevé pour recevoir un paiement mensuel pour le moment.',
    alwIfYouApply:
      'Si vous présentez une demande, Service Canada révisera votre déclaration de revenus chaque année. Vous recevrez automatiquement des paiements si votre revenu est moins que&nbsp;',
    afsNotEligible:
      "L'Allocation au survivant est une prestation pour les personnes veuves âgées de&nbsp;60 à&nbsp;64 ans qui ne se sont pas remariées ou engagées dans une nouvelle union de fait.",
    autoEnrollTrue:
      "D'après ce que vous nous avez dit, vous <strong>n'avez pas besoin de faire une demande</strong> pour obtenir cette prestation. Vous recevrez une lettre par la poste vous informant de votre <strong>inscription automatique</strong> le mois suivant vos 64 ans.",
    autoEnrollFalse:
      "Selon ce que vous nous avez dit, <strong>vous devrez peut-être demander cette prestation</strong>. Nous ne disposons peut-être pas de suffisamment d'informations pour vous inscrire automatiquement.",
    expectToReceive:
      'Vous pouvez vous attendre à recevoir environ {ENTITLEMENT_AMOUNT_FOR_BENEFIT} par mois.',
    oasClawbackInCanada:
      'Parce que votre revenu dépasse {OAS_RECOVERY_TAX_CUTOFF}, nous avons enlevé {OAS_CLAWBACK} de votre montant mensuel. {LINK_LEARN_ABOUT_RECOVERY_TAX}',
    oasClawbackNotInCanada:
      'Parce que votre revenu dépasse {OAS_RECOVERY_TAX_CUTOFF}, nous avons enlevé {OAS_CLAWBACK} de votre montant mensuel. {LINK_LEARN_ABOUT_RECOVERY_TAX}',
    oas: {
      eligibleIfIncomeIsLessThan:
        "Vous êtes probablement admissible à cette prestation si votre revenu est moins que {INCOME_LESS_THAN}. Si votre revenu dépasse {OAS_RECOVERY_TAX_CUTOFF}, vous devrez peut-être payer de l'{LINK_RECOVERY_TAX}.",
      dependOnYourIncome:
        'Selon votre revenu, vous pourriez vous attendre à recevoir environ {ENTITLEMENT_AMOUNT_FOR_BENEFIT} par mois. Fournissez votre revenu pour obtenir une estimation précise.',
      eligibleIncomeTooHigh:
        'Vous êtes probablement admissible à cette prestation, mais votre revenu est trop élevé pour recevoir un paiement mensuel pour le moment.',
      serviceCanadaReviewYourPayment:
        'Si vous présentez une demande, Service Canada révisera le montant de votre paiement chaque année en fonction de votre déclaration de revenus.',
      automaticallyBePaid:
        'Vous recevrez automatiquement des paiements si votre revenu vous rend admissible.',
      youShouldReceiveLetter:
        "Vous devriez recevoir une lettre au sujet de votre statut d'inscription le mois après votre 64e anniversaire.",
      youShouldHaveReceivedLetter:
        "Vous devriez avoir reçu une lettre au sujet de votre statut d'inscription le mois après votre 64e anniversaire.",
      applyOnline:
        "Si vous n'avez pas reçu de lettre au sujet de la pension de la Sécurité de la vieillesse le mois après votre 64e anniversaire, vous pouvez présenter une demande en ligne.",
      over70:
        'Si vous avez plus de 70 ans et ne recevez pas la pension la Sécurité de la vieillesse, présentez votre demande dès que possible.',
      eligibleWhenTurn65:
        "Vous serez probablement admissible lorsque vous aurez 65 ans. Vous pouvez <a class='underline text-default-text' href='/fr/eligibility/#age'>modifier vos réponses</a> pour voir ce que vous pourriez recevoir à un âge futur.",
      ifNotReceiveLetter64:
        "Si vous n'avez pas reçu de lettre au sujet de la pension de la Sécurité de la vieillesse le mois après votre 64e anniversaire, <a class='underline text-default-text' href='https://www.canada.ca/fr/emploi-developpement-social/ministere/coordonnees/sv.html'>communiquez avec nous</a> pour savoir si vous devez présenter une demande.",
    },
    gis: {
      eligibleDependingOnIncomeNoEntitlement:
        'Vous êtes probablement admissible à cette prestation si {INCOME_SINGLE_OR_COMBINED} est moins que {INCOME_LESS_THAN}. Fournissez {YOUR_OR_COMPLETE} pour obtenir une estimation de paiement mensuel.',
      incomeTooHigh:
        'Vous êtes probablement admissible à cette prestation, mais votre revenu est trop élevé pour recevoir un paiement mensuel pour le moment.',
      ifYouApply:
        "<p class='mt-6'>Si vous présentez une demande, Service Canada révisera votre déclaration de revenus chaque année. Vous recevrez automatiquement des paiements si votre revenu est admissible.</>",
    },
  },
  detailWithHeading: {
    oasDeferralApplied: {
      heading: 'Comment le report affecte vos paiements',
      text: 'Vous avez reporté vos prestations de la SV de {OAS_DEFERRAL_YEARS}. Cela signifie que vos paiements de la SV commenceront une fois que vous aurez {OAS_DEFERRAL_AGE} ans et que vous recevrez {OAS_DEFERRAL_INCREASE} supplémentaires par mois.',
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
      heading: 'Vos paiements augmenteront lorsque vous aurez 75 ans',
      text: 'Une fois que vous aurez 75&nbsp;ans, vos paiements augmenteront de 10&nbsp;%, ce qui signifie que vous recevrez {OAS_75_AMOUNT} par mois.',
    },
    oasIncreaseAt75Applied: {
      heading: 'Vos paiements ont augmenté car vous avez plus de 75 ans',
      text: 'Parce que vous avez plus de 75&nbsp;ans, vos paiements ont augmenté de 10&nbsp;%.',
    },
    calculatedBasedOnIndividualIncome: {
      heading: 'Les montants ont été calculés à partir du revenu individuel',
      text: 'Parce que vous ne vivez pas avec votre conjoint pour des raisons hors de votre contrôle, vous pouvez recevoir des paiements mensuels plus élevés.',
    },
    partnerEligible: {
      heading: 'Votre conjoint pourrait être admissible',
      text: "Selon vos renseignements, votre conjoint pourrait recevoir&nbsp;{PARTNER_BENEFIT_AMOUNT} par mois. Votre conjoint peut utiliser l'estimateur pour obtenir des résultats détaillés.",
    },
    partnerDependOnYourIncome: {
      heading: 'Votre conjoint pourrait être admissible',
      text: 'Selon votre revenu, vous pourriez vous attendre à recevoir environ&nbsp;{PARTNER_BENEFIT_AMOUNT} par mois. Fournissez votre revenu pour obtenir une estimation précise.',
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
  incomeCombined: 'le revenu combiné de vous et votre conjoint',
  opensNewWindow: 'ouvre une nouvelle fenêtre',
  yes: 'Oui',
  no: 'Non',
  year: 'an',
  your: 'votre revenu',
  complete: 'vos revenus',
}
export default fr
