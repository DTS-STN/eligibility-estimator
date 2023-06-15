import { FieldKey } from '../../utils/api/definitions/fields'
import apiFr from '../api/fr'
import { TooltipTranslations } from './index'

const fr: TooltipTranslations = {
  [FieldKey.MARITAL_STATUS]: {
    heading: apiFr.category.marital,
    moreinfo: 'Lequel s’applique à moi?',
    text: "<p style='padding-bottom: 12px;'> \
            <span style='font-weight: bold;'>Célibataire </span>: \
            Vous n'avez jamais été marié et ne vivez pas en union de fait. \
          </p> \
          <p style='padding-bottom: 12px;'> \
            <span style='font-weight: bold;'>Divorcé </span>: \
            Vous êtes officiellement séparé et avez légalement mis fin à votre mariage. \
          </p> \
          <p style='padding-bottom: 12px;'> \
            <span style='font-weight: bold;'>Séparé </span>: \
            Vous vivez séparé de votre conjoint à cause de la rupture de votre relation \
            depuis au moins 90 jours et vous ne vous êtes pas réconcilié. \
          </p> \
          <p style='padding-bottom: 12px;'> \
            <span style='font-weight: bold;'>Marié </span>: \
            Vous et votre conjoint avez été unis officiellement au cours d’une cérémonie. \
            Ce mariage doit être reconnu en vertu des lois du pays où il a été célébré et en vertu du droit canadien. \
          </p> \
          <p style='padding-bottom: 12px;'> \
            <span style='font-weight: bold;'>Conjoint de fait </span>: \
            Vous vivez avec une autre personne dans une relation conjugale depuis au moins 1&nbsp;an. \
          </p> \
          <p style='padding-bottom: 12px;'> \
            <span style='font-weight: bold;'>Conjoint survivant </span>: \
            Votre conjoint est décédé et vous ne vous êtes pas remarié ou engagé dans une union de fait. \
          </p>",
  },
  [FieldKey.LEGAL_STATUS]: {
    heading: apiFr.category.legal,
    moreinfo: 'Que signifie avoir un statut légal?',
    text: "<p style='padding-bottom: 8px;'> \
            Avoir un statut légal signifie que vous êtes autorisé à entrer et à rester au Canada à titre de : \
          </p> \
          <ul style='list-style-type: disc; padding-bottom: 8px; padding-left: 20px;'> \
            <li>citoyen canadien;</li> \
            <li>résident temporaire;</li> \
            <li>résident permanent (immigrant reçu);</li> \
            <li>réfugié;</li> \
            <li>personne autochtone inscrite en vertu de la <em>Loi sur les Indiens</em>.</li> \
          </ul> \
          ",
  },
  [FieldKey.PARTNER_LEGAL_STATUS]: {
    heading: apiFr.category.legal,
    moreinfo: 'Que signifie avoir un statut légal?',
    text: "<p style='padding-bottom: 8px;'> \
            Avoir un statut légal signifie que votre conjoint est autorisé à entrer et à rester au Canada à titre de : \
          </p> \
          <ul style='list-style-type: disc; padding-bottom: 8px; padding-left: 20px;'> \
            <li>citoyen canadien;</li> \
            <li>résident temporaire;</li> \
            <li>résident permanent (immigrant reçu);</li> \
            <li>réfugié;</li> \
            <li>personne autochtone inscrite en vertu de la <em>Loi sur les Indiens</em>.</li> \
          </ul> \
          ",
  },
  [FieldKey.INCOME]: {
    heading: apiFr.category.income,
    moreinfo: 'Quelle année de revenus sera utilisée pour ma demande?',
    text: "<div style='margin-bottom: 16px;'> \
            <p style='padding-bottom: 8px;'> \
            Par défaut, votre dernière déclaration de revenus sera utilisée lors de votre demande. \
            </p> \
          </div> \
          ",
  },
  [FieldKey.PARTNER_INCOME]: {
    heading: apiFr.category.income,
    moreinfo: 'Quelle année de revenus sera utilisée pour ma demande?',
    text: "<div style='margin-bottom: 16px;'> \
            <p style='padding-bottom: 8px;'> \
            Par défaut, la dernière déclaration de revenus de votre conjoint sera utilisée lors de votre demande. \
            </p> \
          </div> \
          ",
  },
}

export default fr
