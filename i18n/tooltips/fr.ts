import { FieldKey } from '../../utils/api/definitions/fields'
import apiFr from '../api/fr'
import { TooltipTranslations } from './index'

const fr: TooltipTranslations = {
  [FieldKey.MARITAL_STATUS]: {
    heading: apiFr.category.marital,
    moreinfo: 'Lequel s’applique à vous?',
    text: "<ul> \
            <li style='padding-bottom: 12px;'> \
              <span style='font-weight: bold;'>Célibataire </span>: \
              Vous n'avez jamais été marié et ne vivez pas en union de fait. \
            </li> \
            <li style='padding-bottom: 12px;'> \
              <span style='font-weight: bold;'>Divorcé </span>: \
              Vous êtes officiellement séparé et avez légalement mis fin à votre mariage. \
            </li> \
            <li style='padding-bottom: 12px;'> \
              <span style='font-weight: bold;'>Séparé </span>: \
              Vous vivez séparé de votre conjoint à cause de la rupture de votre relation \
              depuis au moins 90 jours et vous ne vous êtes pas réconcilié. \
            </li> \
            <li style='padding-bottom: 12px;'> \
              <span style='font-weight: bold;'>Marié </span>: \
              Vous et votre conjoint avez été unis officiellement au cours d’une cérémonie. \
              Ce mariage doit être reconnu en vertu des lois du pays où il a été célébré et en vertu du droit canadien. \
            </li> \
            <li style='padding-bottom: 12px;'> \
              <span style='font-weight: bold;'>Conjoint de fait </span>: \
              Vous vivez avec une autre personne dans une relation conjugale depuis au moins 1&nbsp;an. \
            </li> \
            <li style='padding-bottom: 12px;'> \
              <span style='font-weight: bold;'>Veuf </span>: \
              Votre conjoint est décédé et vous ne vous êtes pas remarié ou engagé dans une union de fait. \
            </li> \
          </ul>",
  },
  [FieldKey.LEGAL_STATUS]: {
    heading: apiFr.category.legal,
    moreinfo: 'Que signifie avoir un statut légal?',
    text: "<p style='padding-bottom: 8px;'> \
            Avoir un statut légal signifie que vous êtes autorisé à entrer et à rester au Canada à titre de : \
          </p> \
          <ul style='list-style-type: disc; padding-bottom: 8px; padding-left: 20px;'> \
            <li>citoyen canadien;</li> \
            <li>personne autochtone inscrite en vertu de la <em>Loi sur les Indiens</em>;</li> \
            <li>résident temporaire;</li> \
            <li>résident permanent (immigrant reçu);</li> \
            <li>réfugié.</li> \
          </ul> \
          ",
  },
  [FieldKey.PARTNER_LEGAL_STATUS]: {
    heading: apiFr.category.legal,
    moreinfo: 'Que signifie avoir un statut légal?',
    text: "<p style='padding-bottom: 8px;'> \
            Avoir un statut légal signifie que votre conjoint est autorisé à entrer et à rester au Canada à titre de : \
          </p> \
          <ul style='list-style-type: disc; padding-bottom: 8px; padding-left: 20px;'> \
            <li>citoyen canadien;</li> \
            <li>personne autochtone inscrite en vertu de la <em>Loi sur les Indiens</em>;</li> \
            <li>résident temporaire;</li> \
            <li>résident permanent (immigrant reçu);</li> \
            <li>réfugié.</li> \
          </ul> \
          ",
  },
  [FieldKey.INCOME]: {
    heading: apiFr.category.income,
    moreinfo: 'Ce revenu sera-t-il utilisé dans votre demande?',
    text: "<div style='margin-bottom: 16px;'> \
            <p style='padding-bottom: 8px; color: rgba(92, 92, 92, 1);'> \
            Non, il s’agit d’une estimation. Vos <a style='text-decoration: underline; color: rgba(40, 65, 98, 1);' href='https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse/supplement-revenu-garanti/demande.html#h2.2-3.1' target='_blank'>revenus et exemptions<img style='padding: 0px 0px 3px 4px; display: inline-block;' src='/openNewTab.svg'/></a> réels seront évalués lors de votre demande. \
            </p> \
          </div> \
          ",
  },
  [FieldKey.INCOME_WORK]: {
    heading: apiFr.category.income,
    moreinfo: '	Pourquoi demandons-nous vos revenus d’emploi?',
    text: "<div style='margin-bottom: 16px;'> \
            <p style='padding-bottom: 8px; color: rgba(92, 92, 92, 1);'> \
            Vos premiers 15&nbsp;000&nbsp;$ de revenu lié au travail sont sujets à des exemptions. Nous allons les calculer pour vous. \
            </p> \
           </div> \
    ",
  },
  [FieldKey.PARTNER_INCOME]: {
    heading: apiFr.category.income,
    moreinfo: 'Ce revenu sera-t-il utilisé dans votre demande?',
    text: "<div style='margin-bottom: 16px;'> \
            <p style='padding-bottom: 8px; color: rgba(92, 92, 92, 1);'> \
            Non, il s’agit d’une estimation. Ses <a style='text-decoration: underline; color: rgba(40, 65, 98, 1); display: flex;' href='https://www.canada.ca/fr/services/prestations/pensionspubliques/rpc/securite-vieillesse/supplement-revenu-garanti/demande.html#h2.2-3.1' target='_blank'>revenus et exemptions<img style='padding: 0px 0px 3px 4px;' src='/openNewTab.svg'/></a> réels seront évalués lors de votre demande. \
            </p> \
          </div> \
          ",
  },
  [FieldKey.PARTNER_INCOME_WORK]: {
    heading: apiFr.category.marital,
    moreinfo: 'Pourquoi demandons-nous ses revenus d’emploi?',
    text: "<div style='margin-bottom: 16px;'> \
            <p style='padding-bottom: 8px; color: rgba(92, 92, 92, 1);'> \
            Ses premiers 15&nbsp;000&nbsp;$ de revenu lié au travail sont sujets à des exemptions. Nous allons les calculer pour vous. \
            </p> \
           </div> \
    ",
  },
  [FieldKey.LIVED_ONLY_IN_CANADA]: {
    heading: apiFr.category.residence,
    moreinfo: 'Quand la résidence commence-t-elle à compter?',
    text: "<div style='margin-bottom: 16px;'> \
            <p style='padding-bottom: 8px; color: rgba(92, 92, 92, 1);'> \
              La résidence commence lorsque vous établissez votre demeure et vivez au Canada. \
            </p> \
          </div> \
    ",
  },
  [FieldKey.PARTNER_LIVED_ONLY_IN_CANADA]: {
    heading: apiFr.category.marital,
    moreinfo: 'Quand la résidence commence-t-elle à compter?',
    text: "<div style='margin-bottom: 16px;'> \
            <p style='padding-bottom: 8px; color: rgba(92, 92, 92, 1);'> \
              La résidence commence lorsque votre conjoint établit sa demeure et vit au Canada. \
            </p> \
          </div> \
    ",
  },
}

export default fr
