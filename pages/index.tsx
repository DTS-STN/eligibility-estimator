import type { NextPage } from 'next'
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <main>
      <div className="container mx-auto flex flex-col mt-8 font-gc space-y-4 mb-16">
        <h1 className="h1">
          Implementing a slice of the{' '}
          <a
            href="https://wet-boew.github.io/wet-boew-styleguide/index-en.html"
            className="text-default-text hover:underline"
            target="_blank"
            rel="noreferrer"
          >
            WET
          </a>{' '}
          design system
        </h1>
        <p className="">
          This page is just a place to put components that we need for
          developing a first cut of the eligibility estimator. The elements
          shown in mockups are prioritized, with more coming later for
          completeness. Eventually this will be moved to Storybook for easy
          documentation and integration with othewr solutions.
        </p>
        <p>
          Once we&apos;ve coordinated with the client, we can finish up
          accessibility and merge any other solutions for components.
        </p>
        <div className="grid tablet:grid-cols-1 mobile:grid-cols-2 gap-4">
          <div className="rounded border-[1px] border-solid border-default-text px-6 py-4 space-y-4">
            <p className="h5">Inputs</p>
            <input type="text" placeholder="name" className="form-control" />
            <input type="number" placeholder="5" className="form-control" />
            <input
              type="email"
              placeholder="my@email.com"
              className="form-control"
            />
            <input
              type="password"
              placeholder="****"
              className="form-control"
            />
            <div className="radio">
              <label htmlFor="radio2">
                <input
                  type="radio"
                  id="radio1"
                  name="liveCan"
                  className="mr-2"
                />
                Option 1
              </label>
            </div>
            <div className="radio">
              <label htmlFor="radio2">
                <input
                  type="radio"
                  id="radio2"
                  name="liveCan"
                  className="mr-2"
                />
                Option 2
              </label>
            </div>
            <div className="checkbox">
              <label htmlFor="checkbox1">
                <span>Do you live in Canada?</span>
                <input type="checkbox" id="checkbox1" className="ml-2" />
              </label>
            </div>
            <select className="form-control" placeholder="Select from ...">
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="2">3</option>
              <option value="2">4</option>
              <option value="2">5</option>
            </select>
            <textarea
              name=""
              id=""
              rows="4"
              className="form-control"
            ></textarea>
            <p className="italic">
              Searchable Select? Will develop once mockup is created.
            </p>
          </div>
          <div className="rounded border-[1px] border-solid border-default-text px-6 py-4">
            <p className="h5">Typography</p>
            <p className="h1">Size H1</p>
            <p className="h2">Size H2</p>
            <p className="lead">Size Lead</p>
            <p className="h3">Size H3</p>
            <p className="h4">Size H4</p>
            <p className="h5">Size H5</p>
            <p className="">(Default Size)</p>
            <p className="h6">Size H6</p>
            <p className="small">Size small</p>
          </div>
        </div>
        <div className="rounded border-[1px] border-solid border-default-text px-6 py-4 space-x-4">
          <p className="h5">Buttons</p>
          <button className="btn btn-default">Default</button>
          <button className="btn btn-primary">Primary</button>
          <button className="btn btn-success">Success</button>
          <button className="btn btn-info">Info</button>
          <button className="btn btn-warning">Warning</button>
          <button className="btn btn-danger">Danger</button>
          <button className="btn btn-link">Link</button>
        </div>
        <div className="rounded border-[1px] border-solid border-default-text px-6 py-4">
          <p className="h5">Alerts</p>
          <p>
            Below is an example of conflicting alerts in the WET design system,
            and the GC&apos;s website. Implementation is blocked until we can
            chat with the client. The personalizer has the GC&apos;s
            Implementation.
          </p>
          <p className="h6">GC</p>
          <Image
            src="/alert-example.png"
            alt="an example of whatthe Canada.ca alert looks like."
            width="905px"
            height="149px"
          />
          <p className="h6">WET</p>
          <Image
            src="/alert-example-wet.png"
            alt="an example of whatthe Canada.ca alert looks like."
            width="642px"
            height="113px"
          />
        </div>
      </div>
    </main>
  )
}

export default Home
