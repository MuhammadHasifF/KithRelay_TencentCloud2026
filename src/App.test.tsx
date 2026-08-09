import { fireEvent, render, screen } from '@testing-library/react'
import { beforeEach, describe, expect, it } from 'vitest'
import App from './App'

describe('KithRelay application', () => {
  beforeEach(() => {
    sessionStorage.setItem('kithrelay.session.v1', JSON.stringify({
      id: 'test-caregiver',
      name: 'Test Caregiver',
      email: 'test@example.com',
      demo: true,
    }))
  })

  it('requires account access before opening the care workspace', () => {
    sessionStorage.clear()
    render(<App />)

    expect(screen.getByRole('heading', { name: 'Welcome back' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Explore the demo instantly' })).toBeInTheDocument()
  })

  it('shows the reconciled demo story on first load', () => {
    render(<App />)

    expect(screen.getByRole('heading', { name: /care handoff for Mdm Tan/i })).toBeInTheDocument()
    expect(screen.getByText('Appointment rescheduled')).toBeInTheDocument()
    expect(screen.getByText('Amlodipine increased')).toBeInTheDocument()
    expect(screen.getByText('Synthetic demo data')).toBeInTheDocument()
  })

  it('opens review findings and preserves human approval control', () => {
    render(<App />)
    fireEvent.click(screen.getAllByRole('button', { name: /review 5 findings/i })[0])

    expect(screen.getByRole('heading', { name: 'Review findings' })).toBeInTheDocument()
    const approveButton = screen.getByRole('button', { name: 'Approve administrative plan' })
    expect(approveButton).toBeDisabled()

    const reviewButtons = screen.getAllByRole('button', { name: 'Mark reviewed' })
    fireEvent.click(reviewButtons[0])
    fireEvent.click(reviewButtons[1])
    fireEvent.click(reviewButtons[2])

    expect(approveButton).toBeEnabled()
  })

  it('opens the evidence drawer from a source badge', () => {
    render(<App />)
    fireEvent.click(screen.getAllByRole('button', { name: '1_appointment_letter.txt' })[0])

    expect(screen.getByRole('dialog', { name: '1_appointment_letter.txt' })).toBeInTheDocument()
    expect(screen.getByText(/CAR-2026-08152034/)).toBeInTheDocument()
  })
})
