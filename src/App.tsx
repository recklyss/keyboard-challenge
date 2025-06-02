// App.tsx - Keyboard-Only Challenge Main App (React + TypeScript)
import { useState, useEffect, useRef } from 'react'
import './App.css'
// Placeholder imports for new components
import { Modal } from './Modal.tsx'
import { KeyboardChallengeForm } from './KeyboardChallengeForm.tsx'
import { Confetti } from './Confetti.tsx'
import { Guide } from './Guide.tsx'

function App() {
  const [modalOpen, setModalOpen] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const startButtonRef = useRef<HTMLButtonElement>(null)

  // Return focus to start button after modal closes
  useEffect(() => {
    if (!modalOpen && startButtonRef.current) {
      startButtonRef.current.focus()
    }
  }, [modalOpen])

  // Automatically close the modal when confetti finishes (after 2s)
  useEffect(() => {
    if (showConfetti) {
      const timeout = setTimeout(() => {
        setModalOpen(false)
        setShowConfetti(false)
        setSubmitted(false)
      }, 2000)
      return () => clearTimeout(timeout)
    }
  }, [showConfetti])

  function handleOpenModal() {
    setModalOpen(true)
    setShowConfetti(false)
    setSubmitted(false)
  }

  function handleCloseModal() {
    setModalOpen(false)
    setShowConfetti(false)
    setSubmitted(false)
  }

  function handleFormSubmit() {
    setSubmitted(true)
    setShowConfetti(true)
  }

  return (
    <div className="app-container">
      <button
        ref={startButtonRef}
        onClick={handleOpenModal}
        aria-haspopup="dialog"
        aria-controls="keyboard-challenge-modal"
      >
        Start Keyboard Challenge
      </button>
      <nav aria-label="Keyboard Challenge Guide">
        <Guide />
      </nav>
      {modalOpen && (
        <Modal onClose={handleCloseModal} labelledBy="modal-title" id="keyboard-challenge-modal">
          <div className="modal-header">
            <h2 id="modal-title" className="modal-title">Keyboard-Only Challenge</h2>
            <button
              onClick={handleCloseModal}
              aria-label="Close dialog"
              className="modal-close-btn"
            >
              ×
            </button>
          </div>
          <div className="modal-body">
            <KeyboardChallengeForm
              onSubmit={handleFormSubmit}
              submitted={submitted}
            />
            {submitted && <Confetti show={showConfetti} />}
          </div>
          <div className="form-footer">
            <button
              type="submit"
              form="keyboard-challenge-form"
              className="form-submit"
            >
              Submit
            </button>
          </div>
        </Modal>
      )}
    </div>
  )
}

export default App
