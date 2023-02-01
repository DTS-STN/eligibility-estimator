import { FieldKey } from '../../utils/api/definitions/fields'
import apiFr from '../api/fr'
import { TooltipTranslations } from './index'

const fr: TooltipTranslations = {
  [FieldKey.MARITAL_STATUS]: {
    heading: apiFr.category.marital,
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
    text: "<p style='padding-bottom: 12px;'> \
            Avoir un statut légal signifie que vous êtes autorisé à entrer et à rester au Canada à titre de : \
          </p> \
          <ul style='list-style-type: disc; padding-bottom: 12px; padding-left: 20px;'> \
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
    text: "<p style='padding-bottom: 12px;'> \
            Avoir un statut légal signifie que votre conjoint est autorisé à entrer et à rester au Canada à titre de : \
          </p> \
          <ul style='list-style-type: disc; padding-bottom: 12px; padding-left: 20px;'> \
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
    text: '<div style="padding-bottom:16px;"><div style="padding-top:8px;">Vous trouverez votre revenu net à la ligne&nbsp;23600 de votre déclaration de revenus (T1).</div><div style="padding-top:8px;">Pour une estimation plus précise, retirez de ce montant :</div> <ul class="list-disc" style="padding-left: 12px;"><li style="padding-top: 10px;">vos prestations de la Sécurité de la vieillesse;</li><li style="padding-top: 10px;">les premiers&nbsp;5&nbsp;000&nbsp;$ de revenu tiré d&apos;un emploi ou d&apos;un travail indépendant, et&nbsp;50&nbsp;% des prochains&nbsp;10&nbsp;000&nbsp;$.</li></ul></div>',
  },
}

export default fr
