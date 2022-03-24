const Resume = () : JSX.Element => {
  return (
    <div className='fill resume'>
      <div className='resume-container'>
        <p style={{fontSize: '.8rem'}}>
          hugo.dussertsarthe@gmail.com<br/>
          <a target='_blank' rel="noreferrer" href='https://github.com/hdussert'>Github</a> - <a target='_blank' rel="noreferrer" href='https://www.linkedin.com/in/hugo-dussertsarthe/'>LinkedIn</a>
        </p>
        <div className='resume-section resume-skills'>
          <h2>Compétences</h2>
          <p>
            Front : React, TypeScript, Javascript, HTML, CSS (SCSS/SASS)<br />
            Back  : Go, PostgreSQL, AWS, Node.js<br />
            Autre : GitHub, Postman, Unity (C#)
          </p>
        </div>
        <div className='resume-section'>
          <h2>Expériences</h2>
          <Experience 
            organisation='WeProov'
            title='Développeur Backend (Stage)'
            startDate='déc. 2020'
            endDate='juin 2021'
            bullets={[
              'Développement d\'APIs Rest en Go',
              'Paramétrage AWS (Lambdas, API Gateway, SQS)',
              'Amélioration du code existant, séparation en librairies',
              'Création de collections Postman',
              'Équipe agile, 100% Télétravail',
            ]}
          />

          <Experience 
            organisation='Placeloop'
            title='Développeur Frontend (Stage)'
            startDate='juin 2020'
            endDate='nov. 2020'
            bullets={[
              'Migration technique vers un framework interne',
              'Refonte graphique (création d\'un kit UI basé sur des maquettes)',
              'Développement de nouvelles fonctionnalités',
              'Analyse de parcours utilisateurs, conception de solutions UX',
              'Gestion des Sprints et tickets de l\'équipe front',
              'Équipe agile',
            ]}
          />
        </div>

        <div className='resume-section'>
          <h2>Formations</h2>
          <Experience 
            organisation='Unity'
            title='Junior Programmer'
            startDate='juin 2021'
            endDate='août 2021'
          />
          <Experience 
            organisation='42'
            title='Architecte du numérique'
            startDate='nov. 2018'
            endDate='déc. 2020'
          />
          <Experience 
            organisation='Faculté des Sciences'
            title='L1, L2 Informatique'
            startDate='sept. 2015'
            endDate='mai 2018'
          />
          <Experience 
            organisation='SUPINFO'
            title='1ère année, "Bachelor of Engineering"'
            startDate='nov. 2014'
            endDate='juill. 2015'
          />
        </div>
      </div>
    </div>
  )
}

const Experience = ({organisation, title, startDate, endDate, bullets}: any) : JSX.Element => {
  return (
    <div className='experience'>
      <div className='experience-dates'>{startDate} - {endDate}</div>
      <div>
        <h3>{organisation}</h3>
        <h4>{title}</h4>
        { bullets ? 
          <div className='experience-description'>
            {bullets.map((b: any, i: number) => <li key={i}>{b}</li>)}
          </div> 
        : null }
      </div>
    </div>
  )
}

export default Resume;