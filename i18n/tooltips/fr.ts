import { TooltipTranslations } from './index'

const fr: TooltipTranslations = {
  income: {
    heading: 'Revenu annuel net',
    text: "<p>Votre revenu annuel net est votre revenu après impôt. Vous pouvez trouver votre revenu annuel net total à la ligne 236 de votre déclaration de revenus. <br  /> Les paiements de la Sécurité de la vieillesse, du Supplément de revenu garanti, de l'Allocation ou de l'Allocation au survivant ne sont pas inclus dans votre revenu.<br  />déclaration de revenus, vous pouvez utiliser une estimation de votre revenu. Si vous avez plus d'une source de revenu (par exemple, salaire, revenu de placement, revenu de pension), vous devez additionner toutes les estimations de revenu net avant d'inscrire le montant total. N'incluez pas les revenus de votre conjoint ou d'une personne à charge.</p>",
  },
  age: {
    heading: 'Âge',
    text: 'Veuillez indiquer votre âge actuel.',
  },
  maritalStatus: {
    heading: 'État civil actuel',
    text: "<p style='padding-bottom: 12px;'><span style='font-weight: bold;'>Conjoint(e) de fait</span>: Vous vivez avec une autre personne dans une relation conjugale depuis au moins un an. </p> <p style='padding-bottom: 12px;'><span style='font-weight: bold;'>Divorcé(e)</span>: Vous êtes officiellement séparé et avez légalement mis fin à votre mariage. </p> <p style='padding-bottom: 12px;'><span style='font-weight: bold;'>Marié(e)</span>: Vous êtes unies officiellement au cours d’une cérémonie. Ce mariage doit être reconnu en vertu des lois du pays où il a été célébré et en vertu du droit canadien. </p> <p style='padding-bottom: 12px;'><span style='font-weight: bold;'>Célibataire </span>: Vous n'avez jamais été marié et ne vivez pas en union de fait. </p> <p style='padding-bottom: 12px;'><span style='font-weight: bold;'>Conjoint survivant/veuf</span>: Votre conjoint est décédé et vous ne vous êtes pas remarié ou engagé dans une union de fait.</p><p style='padding-bottom: 12px;'><span style='font-weight: bold;'>Séparé(e):</span> Vous vivez séparé de votre époux ou de votre conjoint à cause de la rupture de votre relation depuis au moins 90 jours et vous ne vous êtes pas réconcilié.</p>",
  },
  partnerBenefitStatus: {
    heading: 'Eligibilité de votre conjoint aux prestations',
    text: 'Une personne a droit à la pleine pension de la Sécurité de la vieillesse seulement si elle a habité au Canada pendant au moins 40 ans après l’âge de 18 ans.',
  },
  partnerIncome: {
    heading: 'Revenu annuel net de votre conjoint',
    text: "<p style='padding-bottom: 12px;'>Votre revenu annuel net est votre revenu après impôt. Vous pouvez trouver votre revenu annuel net total à la ligne 236 de votre déclaration de revenus. Les paiements de la Sécurité de la vieillesse, du Supplément de revenu garanti, de l'Allocation ou de l'Allocation au survivant ne sont pas inclus dans votre revenu. Si vous n'avez pas de renseignements sur votre revenu dans votre déclaration de revenus, vous pouvez utiliser une estimation de votre revenu. Si vous avez plus d'une source de revenu (par exemple, salaire, revenu de placement, revenu de pension), vous devez additionner toutes les estimations de revenu net avant d'inscrire le montant total. N'incluez pas les revenus de votre conjoint ou d'une personne à charge.</p>",
  },
  livingCountry: {
    heading: 'Lieu de résidence actuel',
    text: 'Le nom du pays ou du territoire où vous résidez, si vous avez été légalement admis dans ce pays ou ce territoire.',
  },
  legalStatus: {
    heading: 'Statut légal',
    text: "<p style='padding-bottom: 12px;'><span style='font-weight: bold;'>Citoyen canadien:</span> Vous êtes Canadien de naissance (née au Canada ou née à l’extérieur du Canada d’un parent citoyen canadien qui est lui-même né au Canada ou qui a obtenu la citoyenneté) ou vous avez  demandé et obtenu la citoyenneté canadienne.</p><p style='padding-bottom: 12px;'><span style='font-weight: bold;'>Résident permanent ou un immigrant reçu (non parrainé):</span> Vous avez obtenu le statut de résident permanent en immigrant au Canada, mais qui n’êtes pas encore citoyen canadien.</p><p style='padding-bottom: 12px;'><span style='font-weight: bold;'>Résident permanent ou un immigrant reçu (parrainé):</span>Vous êtes un étranger qui a présenté une demande de résidence permanente au titre de la catégorie du regroupement familial, qui est parrainé par un répondant canadien approuvé et qui satisfait aux exigences de la catégorie du regroupement familial.</p><p style='padding-bottom: 12px;'><span style='font-weight: bold;'>Statut d'Indien ou carte de statut:</span>  Vous êtes inscrits en tant qu'Indien selon la définition qu'en donne la Loi sur les Indiens.</p>",
  },
  legalStatusOther: {
    heading: 'Other Legal Status',
    text: '<p>Example: Temporary resident, student, temporary worker, etc</p>',
  },
  canadaWholeLife: {
    heading: 'Lieu de résidence au Canadaa',
    text: 'Notez que les périodes où vous avez résidé dans un pays étranger pendant moins de 6 mois ne comptent pas.',
  },
  yearsInCanadaSince18: {
    heading: 'Années vécues au Canada',
    text: "Ceci inclut les périodes pendant lesquelles vous avez vécu au Canada. Si vous n'avez pas habité au Canada toute votre vie, toute absence du Canada de plus de 6 mois n'est pas incluse. ",
  },
  everLivedSocialCountry: {
    heading: 'Pays ayant un accord de sécurité sociale',
    text: 'Vous pourriez être admissible si vous avez vécu dans l’un des pays ayant un accord de sécurité sociale avec le Canada.',
  },
  partnerAge: {
    useDataFromKey: 'age',
  },
  partnerLivingCountry: {
    useDataFromKey: 'livingCountry',
  },
  partnerLegalStatus: {
    useDataFromKey: 'legalStatus',
  },
  partnerCanadaWholeLife: {
    useDataFromKey: 'canadaWholeLife',
  },
  partnerYearsInCanadaSince18: {
    useDataFromKey: 'yearsInCanadaSince18',
  },
  partnerEverLivedSocialCountry: {
    useDataFromKey: 'everLivedSocialCountry',
  },
}

export default fr
