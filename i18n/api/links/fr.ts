import { LinkIcon } from '../../../utils/api/definitions/enums'
import { LinkDefinitions } from './index'

export const links: LinkDefinitions = {
  faq: {
    text: 'Foire aux questions',
    url: '#faqLink',
    order: 1,
  },
  contactSC: {
    text: 'Communiquer avec Service Canada',
    url: 'https://www.canada.ca/fr/emploi-developpement-social/ministere/coordonnees/sv.html',
    order: 2,
  },
  overview: {
    oas: {
      text: 'En savoir plus sur la pension de la Sécurité de la vieillesse',
      url: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse.html',
      order: 3,
      icon: LinkIcon.info,
      action: 'Learn about OAS',
    },
    gis: {
      text: 'En savoir plus sur le Supplément de revenu garanti',
      url: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse/supplement-revenu-garanti.html',
      order: 4,
      icon: LinkIcon.info,
      action: 'Learn about GIS',
    },
    alw: {
      text: "En savoir plus sur l'Allocation",
      url: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse/supplement-revenu-garanti/allocation.html',
      order: 5,
      icon: LinkIcon.info,
      action: 'Learn about ALW',
    },
    alws: {
      text: "En savoir plus sur l'Allocation au survivant",
      url: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse/supplement-revenu-garanti/allocation-survivant.html',
      order: 6,
      icon: LinkIcon.info,
      action: 'Learn about ALWS',
    },
  },
  oasMaxIncome: {
    text: 'Pension de la Sécurité de vieillesse: Revenu Maximum',
    url: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse/montant-prestation.html',
    order: 7,
  },
  cpp: {
    text: 'Pension de retraite du RPC: Aperçu',
    url: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc.html',
    order: 8,
  },
  cric: {
    text: 'Calculatrice du revenu de retraite canadienne',
    url: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/calculatrice-revenu-retraite.html',
    order: 9,
  },
  paymentOverview: {
    text: 'Comment les paiements sont-ils calculés',
    url: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse/paiements.html',
    order: 10,
  },
  gisEntitlement: {
    text: 'Supplément de revenu garanti: Aperçu des paiements',
    url: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse/supplement-revenu-garanti/montant-prestation.html',
    order: 11,
  },
  alwEntitlement: {
    text: 'Allocation: Aperçu des paiements',
    url: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse/supplement-revenu-garanti/allocation/montant-prestation.html',
    order: 12,
  },
  alwsEntitlement: {
    text: 'Allocation au survivant: Aperçu des paiements',
    url: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse/supplement-revenu-garanti/allocation-survivant/montant-prestation.html',
    order: 13,
  },
  outsideCanada: {
    text: 'Personnes vivant à l’étranger: Aperçu',
    url: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/rpc-internationales.html',
    order: 14,
  },
  outsideCanadaOas: {
    text: 'Personnes vivant à l’étranger: Pension de la Sécurité de vieillesse',
    url: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse/admissibilite.html',
    order: 15,
  },
  oasPartial: {
    text: 'Pension de la Sécurité de vieillesse: Moins de 40 ans au Canada',
    url: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse/montant-prestation.html#h2.3-3.1',
    order: 16,
  },
  oasRecoveryTax: {
    text: 'Pension de la Sécurité de vieillesse: Impôt de récupération',
    url: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse/impot-recuperation.html',
    order: 17,
  },
  oasDefer: {
    text: 'Pension de la Sécurité de la vieillesse: Reporter votre premier paiement',
    url: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse/montant-prestation.html#h2.2',
    order: 18,
  },
  oasRetroactive: {
    text: 'Pension de la Sécurité de vieillesse: Paiements rétroactifs',
    url: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse/montant-prestation.html#:~:text=Paiements%20r%C3%A9troactifs',
    order: 19,
  },
  apply: {
    oas: {
      text: 'Faire une demande pour la pension de la Sécurité de la vieillesse',
      url: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse/demande.html',
      order: 20,
      icon: LinkIcon.link,
      action: 'Apply for OAS',
    },
    gis: {
      text: 'Faire une demande pour le Supplément de revenu garanti',
      url: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse/supplement-revenu-garanti/demande.html',
      order: 21,
      icon: LinkIcon.link,
      action: 'Apply for GIS',
    },
    alw: {
      text: "Faire une demande d'Allocation",
      url: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse/supplement-revenu-garanti/allocation/demande.html',
      order: 22,
      icon: LinkIcon.link,
      action: 'Apply for ALW',
    },
    alws: {
      text: "Faire une demande d'Allocation au survivant",
      url: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse/supplement-revenu-garanti/allocation-survivant/demande.html',
      order: 23,
      icon: LinkIcon.link,
      action: 'Apply for ALWS',
    },
  },
  SignInSC: {
    text: 'Se connecter à Mon dossier Service Canada',
    url: 'https://www.canada.ca/fr/emploi-developpement-social/services/mon-dossier.html',
    order: 24,
    icon: LinkIcon.link,
    action: 'Se connecter à Mon dossier Service Canada',
  },
  SC: {
    text: 'communiquez avec nous',
    url: 'https://www.canada.ca/fr/emploi-developpement-social/ministere/coordonnees/sv.html',
    order: -1,
  },
  SCAccount: {
    text: 'Mon dossier Service Canada',
    url: 'https://www.canada.ca/fr/emploi-developpement-social/services/mon-dossier.html',
    order: -1,
  },
  oasDeferClickHere: {
    text: 'possibilité de reporter votre premier paiement de la pension de la Sécurité de la vieillesse',
    url: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse/montant-prestation.html#h2.2',
    order: -1,
  },
  oasDeferInline: {
    text: 'En savoir plus sur le report de la pension de la SV',
    url: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse/montant-prestation.html#h2.2',
    order: -1,
  },
  socialAgreement: {
    text: 'accord de sécurité sociale',
    url: 'https://www.canada.ca/fr/agence-revenu/services/impot/decisions-concernant-regime-pensions-canada-rpc-assurance-emploi-ae/accords-internationaux-securite-sociale-regime-pensions-canada/quels-sont-objectifs-accords-internationaux-securite-sociale.html#tbl',
    order: -1,
  },
  reasons: {
    oas: {
      text: "Voir tous les critères d'admissibilité pour la pension de la Sécurité de la vieillesse",
      url: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse/admissibilite.html',
      order: -1,
      icon: LinkIcon.note,
    },
    gis: {
      text: "Voir tous les critères d'admissibilité pour le Supplément de revenu garanti",
      url: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse/supplement-revenu-garanti/admissibilite.html',
      order: -1,
      icon: LinkIcon.note,
    },
    alw: {
      text: "Voir tous les critères d'admissibilité pour l'Allocation",
      url: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse/supplement-revenu-garanti/allocation/admissibilite.html',
      order: -1,
      icon: LinkIcon.note,
    },
    alws: {
      text: "Voir tous les critères d'admissibilité pour l'Allocation au survivant",
      url: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse/supplement-revenu-garanti/allocation-survivant/admissibilite.html',
      order: -1,
      icon: LinkIcon.note,
    },
  },
  oasRecoveryTaxInline: {
    text: 'impôt de récupération',
    url: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse/impot-recuperation.html',
    order: -1,
  },
  oasLearnAboutRecoveryTax: {
    text: "En apprendre davantage sur l'impôt de récupération",
    url: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse/impot-recuperation.html',
    order: -1,
  },
  oasNonResidentTax: {
    text: 'impôt des non-résidents',
    url: 'https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/rpc-internationales/avant-demande.html',
    order: -1,
  },
}
