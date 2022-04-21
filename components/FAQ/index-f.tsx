import Link from 'next/link'

export const FAQF = () => (
  <div>
    <details>
      <summary className="border-none text-details-link">
        <h2 className="text-details-link border-b-[3px] inline h3 mt-10 pb-1">
          Sécurité de la vieillesse
        </h2>
      </summary>
      <details className="mt-4">
        <summary>
          Dois-je faire une demande pour commencer à recevoir ma pension de la
          Sécurité de la vieillesse?
        </summary>
        <div className="p-4">
          <p>
            Pour de nombreux pensionnés, votre pension de la Sécurité de la
            vieillesse ne commence pas automatiquement. En avril 2013, Service
            Canada a mis en œuvre un processus visant à inscrire automatiquement
            les personnes âgées qui sont admissibles à la pension de la Sécurité
            de la vieillesse. Si vous n&apos;avez reçu aucune lettre au sujet de
            votre pension le mois suivant votre 64e anniversaire, vous devez
            faire une demande de prestations.
          </p>
        </div>
      </details>

      <details>
        <summary>
          Puis-je reporter le montant de ma pension de la Sécurité de la
          vieillesse (SV)?
        </summary>
        <div className="p-4">
          <p>
            Vous avez droit à la pension de la Sécurité de la vieillesse à 65
            ans. Contrairement au Régime de pensions du Canada (RPC), il
            n&apos;est pas possible de prendre la Sécurité de la vieillesse plus
            tôt, par exemple à 60 ans. Cependant, vous pouvez la différer
            jusqu&apos;à cinq ans pour bénéficier d&apos;une prestation
            améliorée. Vous recevrez 7,2 % de plus chaque année (0,6 % de plus
            chaque mois) si vous retardez le versement de la Sécurité de la
            vieillesse. Après 70 ans, il n&apos;y a aucun avantage à retarder
            votre premier versement. En fait, vous risquez de perdre des
            prestations. Si vous avez plus de 70 ans et que vous ne recevez pas
            de pension de la Sécurité de la vieillesse, faites une demande.
          </p>
        </div>
      </details>

      <details>
        <summary>
          Puis-je bénéficier d&apos;un paiement rétroactif si j&apos;ai plus de
          65 ans?
        </summary>
        <div className="p-4">
          <p>
            Si vous avez déjà plus de 65 ans, vous êtes peut-être admissible
            pour recevoir un paiement rétroactif jusqu&apos;à concurrence de 11
            mois à partir de la date à laquelle nous recevons votre demande. Si
            vous avez reporté la réception de votre pension de la Sécurité de la
            vieillesse, vous ne pourrez pas recevoir de paiement rétroactif
            pendant cette période. Vous pourriez également être admissible à
            recevoir des paiements supplémentaires en fonction de votre revenu,
            comme le Supplément de revenu garanti, l&apos;Allocation et
            l&apos;Allocation pour le survivant.
          </p>
        </div>
      </details>

      <details>
        <summary>Comment puis-je avoir droit à une pension complète?</summary>
        <div className="p-4">
          <p>
            Vous pouvez avoir droit à une pension complète de la Sécurité de la
            vieillesse si vous avez vécu au Canada pendant au moins 40 ans après
            l&apos;âge de 18 ans. Sinon, vous recevrez une pension partielle.
          </p>
        </div>
      </details>

      <details>
        <summary>Qu&apos;est-ce qu&apos;une pension partielle?</summary>
        <div className="p-4">
          <p>
            La pension partielle est calculée à un taux de 1/40e de la pleine
            pension pour chaque année complète de résidence au Canada après
            l&apos;âge de 18 ans. La période minimale de résidence nécessaire
            pour avoir droit à une pension partielle est de 10 ans.
          </p>
        </div>
      </details>

      <details>
        <summary>
          Ma pension de la Sécurité de la vieillesse est-elle imposable?
        </summary>
        <div className="p-4">
          <p>
            Oui. La pension de base de la Sécurité de la vieillesse est
            imposable et doit être déclarée comme un revenu dans votre
            déclaration de revenus. Le Supplément de revenu garanti et
            l&apos;Allocation ne sont pas imposables. Ils doivent également être
            déclarés dans votre déclaration de revenus. Si votre revenu mondial
            net dépasse le seuil de 79 845 $ CAD pour 2021, vous devez
            rembourser une partie ou la totalité de votre pension de la Sécurité
            de la vieillesse. Veuillez consulter le site de Service Canada pour
            plus de détails.
          </p>
        </div>
      </details>

      <details>
        <summary>
          La pension de la Sécurité de la vieillesse est-elle indexée à la
          hausse des prix?
        </summary>
        <div className="p-4">
          <p>
            Oui, les montants des paiements de la Sécurité de la vieillesse, du
            Supplément de revenu garanti, de l&apos;Allocation et de
            l&apos;Allocation au survivant sont révisés tous les trois mois (en
            janvier, avril, juillet et octobre) pour refléter les augmentations
            du coût de la vie mesurées par l&apos;indice des prix à la
            consommation.
          </p>
        </div>
      </details>
    </details>

    <details>
      <summary className="border-none text-details-link">
        <h2 className="text-details-link border-b-[3px] inline h3 mt-10 pb-1">
          Supplément de revenu garanti
        </h2>
      </summary>

      <details>
        <summary className="mt-4">
          Vais-je continuer à recevoir le Supplément de revenu garanti si je
          quitte le Canada?
        </summary>
        <div className="p-4 space-y-4">
          <p>
            Vous ne pouvez pas percevoir le Supplément de revenu garanti si vous
            êtes à l&apos;extérieur du Canada pendant plus de 6 mois. Service
            Canada compare l&apos;information avec l&apos;Agence des services
            frontaliers du Canada. Si vous quittez le Canada pendant plus de 6
            mois alors que vous recevez le Supplément de revenu garanti, nous
            déterminerons si vous êtes admissible à ces paiements. Si ce
            n&apos;est pas le cas, nous calculerons combien nous vous avons payé
            en trop, et vous devrez alors rembourser ce montant.
          </p>
          <p>
            Remarque: Vous pourriez être condamné à une amende pour avoir donné
            des renseignements faux, trompeurs ou si vous omettez délibérément
            des renseignements.
          </p>
        </div>
      </details>

      <details>
        <summary>
          Mon paiement du Supplément de revenu garanti a été arrêté, pourquoi?
        </summary>
        <div className="p-4">
          <ul className="list-disc">
            Votre paiement du Supplément de revenu garanti peut s&apos;arrêter
            pour l&apos;une ou l&apos;autre des raisons suivantes:
            <li className="ml-12">
              vous n&apos;avez pas complété de déclaration d&apos;impôt sur le
              revenu avant le 30 avril;
            </li>
            <li className="ml-12">
              à la fin du mois de juin, vous ne nous avez pas donné les
              renseignements sur votre revenu (ou dans le cas d&apos;un couple,
              votre revenu plus le revenu de votre conjoint/conjoint de fait)
              pour l&apos;année précédente;
            </li>
            <li className="ml-12">
              vous quittez le Canada pendant plus de 6 mois consécutifs;
            </li>
            <li className="ml-12">
              votre revenu (ou dans le cas d&apos;un couple, votre revenu plus
              le revenu de votre conjoint/conjoint de fait) est plus élevé que
              ce qui est autorisé pour recevoir la prestation;
            </li>
            <li className="ml-12">
              vous êtes dans une prison fédérale pour une peine de 2 ans ou
              plus;
            </li>
            <li className="ml-12">
              vous décédez (il est important que quelqu&apos;un nous informe de
              votre mort pour éviter le trop-payé).
            </li>
          </ul>
        </div>
      </details>
    </details>

    <details>
      <summary className="border-none text-details-link">
        <h2 className="text-details-link border-b-[3px] inline h3 mt-10 pb-1">
          Application
        </h2>
      </summary>

      <details>
        <summary className="mt-4">
          Quels sont les documents requis pour ma demande?
        </summary>
        <div className="p-4 space-y-4">
          <p>
            <span className="font-bold">Preuve de naissance:</span> Si vous êtes
            né au Canada, vous n&apos;avez pas à fournir de preuve de votre date
            de naissance, mais Service Canada peut toutefois vous la demander
            plus tard.
          </p>
          <p>
            <span className="font-bold">Preuve du statut légal:</span> Si vous
            êtes né à l&apos;extérieur du Canada, un certificat de citoyenneté
            canadienne, un certificat de naturalisation, un passeport canadien
            ou des documents d&apos;immigration canadiens (par exemple, une
            fiche relative au droit d&apos;établissement, une carte de résident
            permanent ou un permis de séjour temporaire) sont exigés.
          </p>
          <p>
            <span className="font-bold">
              La preuve de mariage peut inclure:
            </span>
            Si vous êtes marié, vous devez fournir l&apos;original ou une copie
            certifiée conforme de votre certificat de mariage. Si vous vivez en
            union de fait, veuillez fournir la déclaration solennelle
            d&apos;union de fait et une autre preuve de la relation.
          </p>
          <ul className="list-disc">
            <p className="font-bold mb-4">La preuve de mariage peut inclure:</p>
            <li className="ml-12">un certificat de mariage;</li>
            <li className="ml-12">
              une copie officielle ou un extrait officiel des registres de
              l&apos;église, de la synagogue, de la mosquée, du temple, etc.;
            </li>
            <li className="ml-12">
              un acte de mariage civil délivré par une autorité compétente
            </li>
            <li className="ml-12">
              une attestation de mariage (copie ou extrait officiel du registre
              du bureau de l&apos;état civil avec le numéro
              d&apos;enregistrement);
            </li>
            <li className="ml-12">
              la Déclaration solennelle de mariage légal (ISP1809B) dûment
              remplie.
            </li>
          </ul>
          <ul className="list-disc">
            <p className="font-bold mb-4">
              La preuve de l&apos;union de fait peut inclure:
            </p>
            <li className="ml-12">
              la Déclaration solennelle d&apos;union de fait (ISP3004) signée
              par un commissaire à l&apos;assermentation (offert gratuitement
              dans les bureaux de Service Canada);
            </li>
            <li className="ml-12">
              un certificat d&apos;union civile du Québec;
            </li>
            <li className="ml-12">
              un certificat de vie commune de la Nouvelle-Écosse ou de la
              Saskatchewan, un certificat d&apos;union de fait du Manitoba, ou
              un accord d&apos;interdépendance entre partenaires adultes de
              l&apos;Alberta;
            </li>
            <li className="ml-12">
              un état civil déclaré dans une demande active de prestations de
              sécurité du revenu;
            </li>
            <li className="ml-12">
              une déclaration de revenu et de prestations;
            </li>
            <li className="ml-12">
              un formulaire provincial d&apos;enregistrement;
            </li>
            <li className="ml-12">
              un contrat de cohabitation ou prénuptial, un testament commun ou
              des relevés de comptes bancaires conjoints.
            </li>
          </ul>
        </div>
      </details>

      <details>
        <summary>Que dois-je inclure dans mon revenu annuel net?</summary>
        <div className="p-4">
          <p>
            Vous pouvez trouver votre revenu annuel net total à la ligne 236 de
            votre déclaration de revenus. Les paiements de la Sécurité de la
            vieillesse, du Supplément de revenu garanti, de l&apos;Allocation ou
            de l&apos;Allocation au survivant ne sont pas inclus dans votre
            revenu. Si vous n&apos;avez pas de renseignements sur votre revenu
            dans votre déclaration de revenus, vous pouvez utiliser une
            estimation de votre revenu. Si vous avez plus d&apos;une source de
            revenu (par exemple, salaire, revenu de placement, revenu de
            pension), vous devez additionner toutes les estimations de revenu
            net avant d&apos;inscrire le montant total. N&apos;incluez pas les
            revenus de votre conjoint ou d&apos;une personne à charge.
          </p>
          <ul className="list-disc">
            Les sources de revenus peuvent inclure une ou plusieurs des éléments
            suivants:
            <li className="ml-12">
              les revenus de pension tels que les prestations de retraite de
              l&apos;employeur, les paiements de rente, les pensions
              alimentaires et les paiements d&apos;entretien, les prestations
              d&apos;assurance-emploi, les prestations d&apos;invalidité
              découlant d&apos;un régime d&apos;assurance privé, toute
              prestation en vertu du Régime de pensions du Canada ou du Régime
              de rentes du Québec, les pensions de retraite ou les paiements de
              pension ou l&apos;indemnisation d&apos;un employé ou d&apos;un
              travailleur pour une blessure, une invalidité ou un décès;
            </li>
            <li className="ml-12">
              l&apos;assurance-emploi, la prestation d&apos;intervention
              d&apos;urgence du Canada et les prestations des commissions
              provinciales et territoriales des accidents du travail;
            </li>
            <li className="ml-12">
              les intérêts nets et autres revenus de placement, y compris les
              dividendes étrangers;
            </li>
            <li className="ml-12">
              les dividendes et gains en capital canadiens;
            </li>
            <li className="ml-12">le revenu net de location;</li>
            <li className="ml-12">le revenu net d&apos;emploi;</li>
            <li className="ml-12">le revenu net du travail indépendant;</li>
            <li className="ml-12">
              les revenus étrangers comprennent les revenus provenant de
              salaires, de pensions d&apos;employeur, de prestations de sécurité
              sociale, de dividendes, d&apos;investissements et de revenus
              locatifs reçus d&apos;un autre pays.
            </li>
          </ul>
        </div>
      </details>

      <details>
        <summary>Qu&apos;est-ce qui est exempté comme revenu?</summary>
        <div className="p-4">
          <ul className="list-disc">
            <li className="ml-12">
              La Sécurité de la vieillesse, le Supplément de revenu garanti,
              l&apos;Allocation ou l&apos;Allocation au survivant.
            </li>
            <li className="ml-12">
              Les cotisations au Régime de pensions du Canada ou au Régime de
              rentes du Québec et vos cotisations à l&apos;assurance-emploi
            </li>
            <li className="ml-12">
              Les Cotisations au Régime de pensions du Canada ou au Régime de
              rentes du Québec et vos cotisations d&apos;assurance-emploi du
              revenu net d&apos;un travail indépendant.
            </li>
            <li className="ml-12">
              Des déductions, telles que les cotisations syndicales, les
              déductions pour les REER, les frais de déménagement et les autres
              dépenses d&apos;emploi
            </li>
          </ul>
        </div>
      </details>

      <details>
        <summary>
          Quelles sont les catégories de statut légal admissible aux pensions au
          Canada?
        </summary>
        <div className="p-4 space-y-4">
          <p>
            <span className="font-bold">Citoyen Canadien:</span> Une personne
            canadienne de naissance (né au Canada ou né à l&apos;extérieur du
            Canada d&apos;un parent citoyen canadien qui est lui-même né au
            Canada ou qui a obtenu la citoyenneté) ou ayant demandé et obtenu la
            citoyenneté canadienne.
          </p>
          <p>
            <span className="font-bold">
              Résident permanent ou un immigrant reçu (non parrainé)
            </span>
            Une personne ayant obtenu le statut de résident permanent en
            immigrant au Canada, mais qui n&apos;a pas encore la citoyenneté
            canadienne.
          </p>
          <p>
            <span className="font-bold">
              Résident permanent ou un immigrant reçu (parrainé):
            </span>
            Un étranger qui a présenté une demande de résidence permanente au
            titre de la catégorie du regroupement familial, qui est parrainé par
            un répondant canadien approuvé et qui satisfait aux exigences de la
            catégorie du regroupement familial.
          </p>
          <p>
            <span className="font-bold">
              Permis de séjour temporaire (anciennement connu sous le nom de
              permis ministériel avant juin 2002)
            </span>
            Un permis qui peut être accordé dans des circonstances
            exceptionnelles à une personne qui ne satisfait pas aux exigences de
            la loi sur l&apos;immigration du Canada pour entrer au Canada ou y
            demeurer temporairement.
          </p>
          <p>
            <span className="font-bold">
              Visa de résident temporaire (VRT):
            </span>
            Une personne peut obtenir la permission de venir au Canada à des
            fins temporaires en tant que visiteur, étudiant ou travailleur pour
            une période déterminée qui peut être renouvelée. Par exemple, un
            permis de travail peut être délivré pour qu&apos;une personne puisse
            travailler temporairement au Canada ou un permis d&apos;études peut
            être délivré pour qu&apos;une personne puisse étudier temporairement
            dans les cégeps, collèges et universités canadiens.
          </p>
          <p>
            <span className="font-bold">Réfugié au sens de la Convention</span>
            Personne qui se trouve hors de son pays d&apos;origine ou de
            résidence habituelle et qui ne peut y retourner, parce qu&apos;elle
            craint avec raison d&apos;être persécutée pour des motifs liés à sa
            race, sa religion, sa nationalité, son appartenance à un groupe
            social particulier ou ses opinions politiques.
          </p>
          <p>
            <span className="font-bold">Décrêt</span> Délivrée par le gouverneur
            en conseil aux personnes qui sont déjà au Canada mais qui n&apos;ont
            pas de statut légal.
          </p>
          <p>
            <span className="font-bold">
              Résident permanent revenant au pays
            </span>
            Avant l&apos;introduction de la carte de résident permanent, ce
            statut est accordé aux personnes qui se trouvaient à
            l&apos;extérieur du Canada pendant plus de 183 jours, mais qui
            n&apos;avaient pas l&apos;intention de s&apos;établir de façon
            permanente ailleurs.
          </p>
          <p>
            <span className="font-bold">
              Statut d&apos;Indien ou carte de statut
            </span>
            Ceux qui sont inscrits en tant qu&apos;Indien selon la définition
            qu&apos;en donne la Loi sur les Indiens, qu&apos;ils soient citoyens
            canadiens ou non. Cela ne s&apos;applique qu&apos;à ceux qui sont
            inscrits et qui sont membres d&apos;une bande indienne canadienne ou
            membres d&apos;une réserve canadienne. À ce titre, ils auront
            exactement les mêmes droits que tous les citoyens canadiens. Cela ne
            peut servir qu&apos;à confirmer le statut juridique. Les conditions
            de résidence prévues par la Loi sur la sécurité de la vieillesse
            doivent encore être remplies.
          </p>
        </div>
      </details>

      <details>
        <summary>
          Y a-t-il une différence entre les années de résidence et la présence
          au Canada?
        </summary>
        <div className="p-4">
          <p>
            Seule la résidence véritable et non les périodes de présence au
            Canada est comptabilisée pour déterminer votre résidence.
            <br />
            <span className="font-bold">Résidence</span>: La résidence signifie
            qu&apos;une personne fait son foyer ici et vit normalement au
            Canada.
            <br />
            <span className="font-bold">Présence</span>: La présence signifie
            qu&apos;une personne est physiquement présente dans une partie du
            Canada.
          </p>
        </div>
      </details>

      <details>
        <summary>
          Quels pays ont conclu un accord de sécurité sociale avec le Canada?
        </summary>
        <div className="p-4">
          <p>
            Le Canada a des accords avec plus de 50 pays. Pour savoir les pays
            en question, vous pouvez contacter{' '}
            <Link
              href={
                'https://www.canada.ca/en/revenue-agency/services/tax/businesses/topics/payroll/payroll-deductions-contributions/canada-pension-plan-cpp/foreign-employees-employers/canada-s-social-agreements-other-countries.html'
              }
            >
              <a className="text-default-text underline" target="_blank">
                Service Canada
              </a>
            </Link>{' '}
            ou consulter le site Web du gouvernement du Canada.
          </p>
        </div>
      </details>

      <details>
        <summary>
          Que se passe-t-il si j&apos;ai vécu ou travaillé à l&apos;extérieur du
          Canada?
        </summary>
        <div className="p-4">
          <p>
            Les Canadiens qui travaillent à l&apos;extérieur du Canada pour des
            employeurs canadiens peuvent avoir leur temps à l&apos;étranger
            compté comme résidence au Canada. Pour faire compter cette période
            de travail à l&apos;étranger, vous devez être retourné au Canada
            dans les 6 mois suivant la fin de l&apos;emploi ou avoir eu 65 ans
            alors que vous occupiez encore un emploi et avoir maintenu votre
            résidence au Canada pendant votre séjour à l&apos;extérieur du
            Canada. Sous certaines conditions, les conjoints, les conjoints de
            fait, les personnes à charge et les Canadiens qui travaillent à
            l&apos;étranger pour des organisations internationales peuvent
            également compter le temps passé à l&apos;étranger comme résidence
            au Canada.
          </p>
        </div>
      </details>

      <details>
        <summary>
          Que puis-je faire si je suis en désaccord avec une décision prise au
          sujet de ma demande?
        </summary>
        <div className="p-4">
          <p>
            Si vous vous opposez à la décision rendue, vous pouvez demander un
            réexamen de votre demande. Vous devez présenter une telle demande
            par écrit dans les 90 jours suivant la réception de la lettre de
            décision.Votre demande sera examinée par des employés de Service
            Canada qui n&apos;ont pas participé au processus décisionnel initial
            concernant votre demande.
          </p>
        </div>
      </details>

      <details>
        <summary>
          Les prestations sont-elles annulées après le décès d&apos;un
          bénéficiaire?
        </summary>
        <div className="p-4 space-y-4">
          <p>
            Si vous lisez ceci suite à la perte d&apos;un être cher, veuillez
            accepter nos condoléances.
          </p>
          <ul className="list-disc">
            Lorsqu&apos;un bénéficiaire de la Sécurité de la vieillesse décède,
            ses prestations doivent être annulées. Les prestations sont payables
            pour le mois au cours duquel le décès survient. Les prestations
            reçues après ce mois devront être remboursées. Cela comprend les
            prestations suivantes:
            <li className="ml-12">
              la pension de la Sécurité de la vieillesse
            </li>
            <li className="ml-12">Supplément de revenu garanti;</li>
            <li className="ml-12">Allocation</li>
            <li className="ml-12">Allocation au survivant.</li>
          </ul>
          <ul className="list-disc">
            Veuillez communique avec{' '}
            <Link
              href="https://www.canada.ca/en/employment-social-development/corporate/contact.html"
              passHref
            >
              <a className="text-default-text underline" target="_blank">
                Service Canada
              </a>
            </Link>{' '}
            le plus tôt possible pour nous informer de la date du décès du
            bénéficiaire. Veuillez inclure les renseignements suivants sur la
            personne décédée:
            <li className="ml-12">nom complet;</li>
            <li className="ml-12">date de naissance;</li>
            <li className="ml-12">date du décès;</li>
            <li className="ml-12">
              numéro d&apos;assurance sociale (si vous le connaissez);
            </li>
            <li className="ml-12">adresse précédente;</li>
            <li className="ml-12">
              nom et adresse de la succession ou de la personne responsable des
              affaires de la personne décédée (si vous les connaissez).
            </li>
          </ul>
        </div>
      </details>
    </details>

    <details>
      <summary className="border-none text-details-link">
        <h2 className="text-details-link border-b-[3px] inline h3 mt-10 pb-1">
          Régime de pensions du Canada (RPC)
        </h2>
      </summary>

      <details>
        <summary className="mt-4">
          Qu&apos;est ce que la pension de retraite du Régime de pensions du
          Canada (RPC)?
        </summary>
        <div className="p-4">
          <p>
            La pension de retraite du Régime de pensions du Canada est une
            prestation mensuelle imposable qui assure un remplacement partiel du
            revenu au moment de la retraite. Si vous êtes admissible, vous
            recevrez cette pension pour le reste de votre vie. Pour être
            admissible, vous devez avoir au moins 60 ans et y avoir versé au
            moins une cotisation valide.
          </p>
        </div>
      </details>

      <details>
        <summary>
          En quoi le programme de la Sécurité de la vieillesse (SV) diffère-t-il
          du Régime de pensions du Canada (RPC) ou du Régime de rentes du Québec
          (RRQ)?
        </summary>
        <div className="p-4">
          <p>
            Le Régime de pensions du Canada et le Régime de rentes du Québec ne
            sont pas financés par le gouvernement, mais par les cotisations des
            employés et des employeurs. Pour recevoir des prestations du Régime
            de pensions du Canada ou du Régime de rentes du Québec, vous devez
            avoir travaillé et cotisé à l&apos;un ou l&apos;autre de ces
            régimes.
          </p>
        </div>
      </details>

      <details>
        <summary>
          Combien d&apos;années faut-il travailler pour toucher les prestations
          du Régime de pensions du Canada (RPC)?
        </summary>
        <div className="p-4">
          <p>
            Tout le monde a droit au RPC, peu importe le nombre d&apos;années
            travaillées. Le montant que vous recevez dépend de vos revenus et de
            vos cotisations.
          </p>
        </div>
      </details>

      <details>
        <summary>
          Devrais-je toucher ma pension du Régime de pensions du Canada à 60 ans
          ou à 65 ans?
        </summary>
        <div className="p-4">
          <p>
            La décision de commencer à toucher des prestations du Régime de
            pensions du Canada dépend de vos finances, de votre santé, de votre
            espérance de vie et de vos impôts. La principale raison de retarder
            vos paiements est de recevoir des prestations plus élevées.
          </p>
        </div>
      </details>
    </details>
  </div>
)
