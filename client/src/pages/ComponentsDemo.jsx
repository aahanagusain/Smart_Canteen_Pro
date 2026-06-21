import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button, Input, Modal, Toast, Loader } from '../components/ui'

export default function ComponentsDemo() {
  const [demoInput, setDemoInput] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [toastVisible, setToastVisible] = useState(false)
  const [toastType, setToastType] = useState('info')
  const [showLoader, setShowLoader] = useState(false)

  const showToast = (type) => {
    setToastType(type)
    setToastVisible(true)
  }

  const runLoaderDemo = () => {
    setShowLoader(true)
    setTimeout(() => setShowLoader(false), 2000)
  }

  return (
    <main className="page ui-demo-page">
      <header className="ui-demo-header">
        <div>
          <h1 className="home-title">UI Component Library</h1>
          <p className="home-subtitle">
            Demo showcase for Button, Input, Modal, Toast, and Loader.
          </p>
        </div>
        <Link to="/">
          <Button variant="secondary">Back to Home</Button>
        </Link>
      </header>

      <section className="ui-demo-section">
        <h2>Button</h2>
        <div className="ui-demo-row">
          <Button variant="primary" onClick={() => showToast('success')}>
            Primary
          </Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="gradient">Gradient</Button>
          <Button variant="danger">Danger</Button>
          <Button variant="primary" disabled>
            Disabled
          </Button>
        </div>
      </section>

      <section className="ui-demo-section">
        <h2>Input</h2>
        <div className="ui-demo-input-wrap">
          <Input
            id="demo-input"
            label="Your name"
            placeholder="Type something..."
            value={demoInput}
            onChange={(e) => setDemoInput(e.target.value)}
          />
          {demoInput ? <p className="ui-demo-hint">You typed: {demoInput}</p> : null}
        </div>
      </section>

      <section className="ui-demo-section">
        <h2>Modal</h2>
        <Button variant="primary" onClick={() => setModalOpen(true)}>
          Open Modal
        </Button>
        <Modal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          title="Sample Modal"
        >
          <p>This is a reusable modal component. Press Escape or click outside to close.</p>
          <div className="ui-demo-row" style={{ marginTop: 16 }}>
            <Button variant="secondary" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" onClick={() => setModalOpen(false)}>
              Confirm
            </Button>
          </div>
        </Modal>
      </section>

      <section className="ui-demo-section">
        <h2>Toast</h2>
        <div className="ui-demo-row">
          <Button variant="primary" onClick={() => showToast('success')}>
            Success Toast
          </Button>
          <Button variant="danger" onClick={() => showToast('error')}>
            Error Toast
          </Button>
          <Button variant="secondary" onClick={() => showToast('info')}>
            Info Toast
          </Button>
        </div>
        <Toast
          isVisible={toastVisible}
          message={
            toastType === 'success'
              ? 'Action completed successfully!'
              : toastType === 'error'
                ? 'Something went wrong.'
                : 'Here is an info message.'
          }
          type={toastType}
          onClose={() => setToastVisible(false)}
        />
      </section>

      <section className="ui-demo-section">
        <h2>Loader</h2>
        <Button variant="primary" onClick={runLoaderDemo}>
          Show Loader (2s)
        </Button>
        {showLoader ? (
          <div className="ui-demo-loader-box">
            <Loader text="Fetching data..." size="lg" />
          </div>
        ) : (
          <p className="ui-demo-hint">Click the button above to preview the loader.</p>
        )}
      </section>
    </main>
  )
}
