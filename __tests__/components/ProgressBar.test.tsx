/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import { render, screen } from '@testing-library/react'
import { Instance } from 'mobx-state-tree'
import React from 'react'
import { RootStore } from '../../client-state/store'
import { StoreProvider } from '../../components/Contexts'
import ProgressBar from '../../components/ProgressBar'
import { FieldCategory } from '../../utils/api/definitions/enums'

describe('ProgressBar component', () => {
  let root: Instance<typeof RootStore>
  beforeEach(() => {
    root = RootStore.create({
      form: {
        fields: [
          {
            key: 'income',
            type: 'currency',
            label:
              'What is your current annual net income in Canadian Dollars?',
            category: {
              key: FieldCategory.INCOME_DETAILS,
              text: 'Income Details',
            },
            order: 1,
            placeholder: '$20,000',
            default: undefined,
            value: null,
            options: [],
            error: undefined,
          },
          {
            key: 'fakefield',
            type: 'currency',
            label:
              'What is your current annual net income in Canadian Dollars?',
            category: {
              key: FieldCategory.PERSONAL_INFORMATION,
              text: 'Personal Information',
            },
            order: 1,
            placeholder: '$20,000',
            default: undefined,
            value: null,
            options: [],
            error: undefined,
          },
          {
            key: 'fakefieldtwo',
            type: 'currency',
            label:
              'What is your current annual net income in Canadian Dollars?',
            category: {
              key: FieldCategory.LEGAL_STATUS,
              text: 'Legal Status',
            },
            order: 1,
            placeholder: '$20,000',
            default: undefined,
            value: null,
            options: [],
            error: undefined,
          },
        ],
      },
      oas: {},
      gis: {},
      afs: {},
      allowance: {},
      summary: {},
    })
  })
  it('renders progress for an incomplete form', () => {
    root.form.fields[0].setValue('10000') // set income to complete

    const ui = (
      <StoreProvider>
        <ProgressBar
          sections={[
            {
              title: 'Income Details',
              complete: root.form.progress.income,
            },
            {
              title: 'Personal Information',
              complete: root.form.progress.personal,
            },
            {
              title: 'Legal Status',
              complete: root.form.progress.legal,
            },
          ]}
        />
      </StoreProvider>
    )
    render(ui)

    const progress = screen.getAllByTestId('progress')
    expect(progress[0].classList).toContain('complete-progress-section')
    expect(progress[1].classList).toContain('incomplete-progress-section')
    expect(progress[2].classList).toContain('incomplete-progress-section')
  })

  it('renders progress for a complete form', () => {
    root.form.fields[0].setValue('10000')
    root.form.fields[1].setValue('10000')
    root.form.fields[2].setValue('10000')

    const ui = (
      <StoreProvider>
        <ProgressBar
          sections={[
            {
              title: 'Income Details',
              complete: root.form.progress.income,
            },
            {
              title: 'Personal Information',
              complete: root.form.progress.personal,
            },
            {
              title: 'Legal Status',
              complete: root.form.progress.legal,
            },
          ]}
        />
      </StoreProvider>
    )
    render(ui)

    const progress = screen.getAllByTestId('progress')
    expect(progress[0].classList).toContain('complete-progress-section')
    expect(progress[1].classList).toContain('complete-progress-section')
    expect(progress[2].classList).toContain('complete-progress-section')
  })
})
