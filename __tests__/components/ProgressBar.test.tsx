/**
 * @jest-environment jsdom
 */
import '@testing-library/jest-dom'
import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { LanguageProvider, StoreProvider } from '../../components/Contexts'
import ProgressBar from '../../components/ProgressBar'
import { RootStore } from '../../client-state/store'

describe('ProgressBar component', () => {
  it('renders progress correctly based on questions answered', () => {
    const root = RootStore.create({
      form: {
        fields: [
          {
            key: 'income',
            type: 'currency',
            label:
              'What is your current annual net income in Canadian Dollars?',
            category: { key: 'incomeDetails', text: 'Income Details' },
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

    root.form.fields[0].setValue('10000') // set income to complete

    const ui = (
      <StoreProvider>
        <LanguageProvider>
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
        </LanguageProvider>
      </StoreProvider>
    )
    render(ui)

    const progress = screen.getAllByTestId('progress')
    expect(progress[0].classList).toContain('complete-progress-section')
    expect(progress[1].classList).toContain('incomplete-progress-section')
    expect(progress[2].classList).toContain('incomplete-progress-section')
  })
})
