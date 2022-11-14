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
            Vous vivez avec une autre personne dans une relation conjugale depuis au moins 1 an. \
          </p> \
          <p style='padding-bottom: 12px;'> \
            <span style='font-weight: bold;'>Conjoint survivant </span>: \
            Votre conjoint est décédé et vous ne vous êtes pas remarié ou engagé dans une union de fait. \
          </p>",
  },
  [FieldKey.LEGAL_STATUS]: {
    heading: apiFr.category.legal,
    text: "<p style='padding-bottom: 12px;'><span style='font-weight: bold;'>Citoyen canadien :</span> Vous êtes Canadien de naissance (né au Canada ou né à l’extérieur du Canada d’un parent citoyen canadien) ou avez obtenu la citoyenneté canadienne.</p><p style='padding-bottom: 12px;'><span style='font-weight: bold;'>Statut d'Indien :</span> Vous êtes inscrit en tant qu'Indien selon la définition qu'en donne la <em>Loi sur les Indiens</em>.</p><p style='padding-bottom: 12px;'><span style='font-weight: bold;'>Résident permanent ou immigrant reçu :</span> Vous avez obtenu le statut de résident permanent ou avez présenté une demande de résidence permanente au titre de la catégorie du regroupement familial.</p><p style='padding-bottom: 12px;'><span style='font-weight: bold;'>Réfugié :</span> Vous êtes hors de votre pays d’origine ou de résidence habituelle et ne pouvez y retourner, parce que vous craignez avec raison d’être persécuté pour des motifs liés à votre race, votre religion, votre nationalité, votre appartenance à un groupe social particulier ou vos opinions politiques.</p>",
  },
  [FieldKey.PARTNER_LEGAL_STATUS]: {
    useDataFromKey: 'legalStatus',
  },
}

export default fr
