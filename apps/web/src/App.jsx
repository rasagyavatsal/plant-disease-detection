import { useState, useRef } from 'react'
import { Upload, Loader2, AlertCircle, CheckCircle2, Leaf, Scan, RotateCcw, ChevronDown, Microscope } from 'lucide-react'
import { predict } from '@cropintel/shared'

function App() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [imagePreview, setImagePreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [isDragActive, setIsDragActive] = useState(false)
  const fileInputRef = useRef(null)

  const handleImageSelect = (e) => {
    const file = e.target.files[0]
    if (file) {
      setSelectedImage(file)
      setImagePreview(URL.createObjectURL(file))
      setResult(null)
      setError(null)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragActive(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file)
      setImagePreview(URL.createObjectURL(file))
      setResult(null)
      setError(null)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragActive(true)
  }

  const handleDragLeave = () => {
    setIsDragActive(false)
  }

  const handleAnalyze = async () => {
    if (!selectedImage) return

    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const data = await predict(selectedImage)

      if (data.success) {
        setResult(data)
      } else {
        setError('Analysis failed. Please try again with a different image.')
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to connect to server. Make sure the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setResult(null)
    setError(null)
  }

  const getConfidenceColor = (score) => {
    if (score >= 0.7) return 'bg-accent'
    if (score >= 0.4) return 'bg-yellow-500'
    return 'bg-text-tertiary'
  }

  const getConfidenceLabel = (score) => {
    if (score >= 0.8) return 'High confidence'
    if (score >= 0.5) return 'Moderate confidence'
    return 'Low confidence'
  }

  return (
    <div className="min-h-screen bg-bg font-sans">
      {/* Navigation */}
      <nav className="border-b border-border-subtle">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-accent/10 flex items-center justify-center">
                <Leaf className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-text-primary tracking-tight leading-none">
                  CropIntel
                </h1>
                <p className="text-xs text-text-tertiary leading-none mt-0.5">
                  Disease Detection
                </p>
              </div>
            </div>
            <a
              href="https://github.com/rasagyavatsal/plant-disease-detection"
              target="_blank"
              rel="noopener noreferrer"
              className="text-text-tertiary hover:text-text-secondary transition-colors text-sm"
            >
              GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        {/* Hero */}
        <div className="mb-10 animate-fade-in-up">
          <h2 className="text-3xl md:text-4xl font-extrabold text-text-primary tracking-tight">
            Identify Plant Diseases
          </h2>
          <p className="text-text-secondary mt-2 text-base md:text-lg max-w-xl">
            Upload a leaf image and let our AI model analyze it for diseases with detailed confidence scores.
          </p>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Upload Section — 3 cols */}
          <div className="lg:col-span-3 space-y-5 animate-fade-in-up-delay-1">
            <div className="bg-surface rounded-xl border border-border-subtle p-6">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
                  Plant Image
                </h3>
                {imagePreview && (
                  <button
                    onClick={handleReset}
                    disabled={loading}
                    className="flex items-center gap-1.5 text-xs text-text-tertiary hover:text-text-secondary transition-colors disabled:opacity-40"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    Reset
                  </button>
                )}
              </div>

              {!imagePreview ? (
                <div
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onClick={() => fileInputRef.current?.click()}
                  className={`
                    border-2 border-dashed rounded-lg p-10 md:p-14 text-center cursor-pointer
                    transition-all duration-200
                    ${isDragActive
                      ? 'border-accent bg-accent/5'
                      : 'border-border hover:border-text-tertiary'
                    }
                  `}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                    id="file-upload"
                  />
                  <div className="w-12 h-12 rounded-full bg-surface-elevated flex items-center justify-center mx-auto mb-4">
                    <Upload className="w-5 h-5 text-text-tertiary" />
                  </div>
                  <p className="text-sm font-medium text-text-secondary mb-1">
                    Drop an image here or click to browse
                  </p>
                  <p className="text-xs text-text-tertiary">
                    JPG, PNG, or WEBP — max 10MB
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="rounded-lg overflow-hidden bg-surface-elevated border border-border-subtle">
                    <img
                      src={imagePreview}
                      alt="Plant leaf preview"
                      className="w-full h-auto max-h-[360px] object-contain"
                    />
                  </div>

                  <button
                    onClick={handleAnalyze}
                    disabled={loading}
                    className={`
                      w-full flex items-center justify-center gap-2.5 font-semibold py-3 px-6 rounded-lg
                      transition-all duration-200 text-sm
                      ${loading
                        ? 'bg-surface-elevated text-text-tertiary cursor-not-allowed'
                        : 'bg-accent text-bg hover:brightness-110'
                      }
                    `}
                  >
                    {loading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Analyzing…
                      </>
                    ) : (
                      <>
                        <Scan className="w-4 h-4" />
                        Analyze Disease
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>

            {/* Error */}
            {error && (
              <div className="bg-[var(--color-error-bg)] border border-error/20 rounded-lg p-4 flex items-start gap-3 animate-fade-in-up">
                <AlertCircle className="w-5 h-5 text-error flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-error mb-0.5">Analysis Failed</p>
                  <p className="text-sm text-error/80">{error}</p>
                </div>
              </div>
            )}
          </div>

          {/* Results Section — 2 cols */}
          <div className="lg:col-span-2 animate-fade-in-up-delay-2">
            <div className="bg-surface rounded-xl border border-border-subtle p-6 min-h-[280px] flex flex-col">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-5">
                Results
              </h3>

              {!result && !error && !loading && (
                <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
                  <div className="w-14 h-14 rounded-full bg-surface-elevated flex items-center justify-center mb-4">
                    <Microscope className="w-6 h-6 text-text-tertiary" />
                  </div>
                  <p className="text-sm text-text-tertiary">
                    Upload an image and run the analysis to see results here
                  </p>
                </div>
              )}

              {loading && (
                <div className="flex-1 flex flex-col items-center justify-center py-8">
                  <div className="w-12 h-12 rounded-full border-2 border-border border-t-accent animate-spin mb-4" />
                  <p className="text-sm text-text-secondary font-medium">Analyzing your plant…</p>
                  <p className="text-xs text-text-tertiary mt-1">This may take a few seconds</p>
                </div>
              )}

              {result && result.success && (
                <div className="space-y-5 animate-fade-in-up">
                  {/* Top prediction */}
                  <div className="bg-accent/8 border border-accent/15 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle2 className="w-4 h-4 text-accent" />
                      <span className="text-xs font-semibold text-accent uppercase tracking-wide">
                        Detected
                      </span>
                    </div>
                    <p className="text-lg font-bold text-text-primary mb-3">
                      {result.top_prediction.label}
                    </p>
                    <div className="flex items-center gap-3">
                      <div className="flex-1 bg-surface-elevated rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full animate-bar-fill ${getConfidenceColor(result.top_prediction.score)}`}
                          style={{ width: `${(result.top_prediction.score * 100).toFixed(1)}%` }}
                        />
                      </div>
                      <span className="text-sm font-semibold text-text-primary tabular-nums">
                        {(result.top_prediction.score * 100).toFixed(1)}%
                      </span>
                    </div>
                    <p className="text-xs text-text-tertiary mt-1.5">
                      {getConfidenceLabel(result.top_prediction.score)}
                    </p>
                  </div>

                  {/* Other predictions */}
                  <div>
                    <p className="text-xs font-semibold text-text-tertiary uppercase tracking-wide mb-3">
                      Other possibilities
                    </p>
                    <div className="space-y-2.5">
                      {result.predictions.slice(1, 5).map((pred, index) => (
                        <div key={index} className="flex items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-baseline mb-1.5">
                              <p className="text-sm text-text-secondary truncate mr-2">{pred.label}</p>
                              <span className="text-xs font-medium text-text-tertiary tabular-nums flex-shrink-0">
                                {(pred.score * 100).toFixed(1)}%
                              </span>
                            </div>
                            <div className="bg-surface-elevated rounded-full h-1 overflow-hidden">
                              <div
                                className={`h-1 rounded-full animate-bar-fill ${getConfidenceColor(pred.score)}`}
                                style={{
                                  width: `${(pred.score * 100).toFixed(1)}%`,
                                  animationDelay: `${0.1 * (index + 1)}s`
                                }}
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="mt-14 animate-fade-in-up-delay-3">
          <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-6">
            How it works
          </h3>
          <div className="grid md:grid-cols-3 gap-4">
            {[
              {
                icon: Upload,
                title: 'Upload',
                desc: 'Take or upload a clear photo of the affected plant leaf.',
              },
              {
                icon: Scan,
                title: 'Analyze',
                desc: 'Our deep learning model processes the image in seconds.',
              },
              {
                icon: CheckCircle2,
                title: 'Results',
                desc: 'Get disease identification with detailed confidence scores.',
              },
            ].map((step, i) => (
              <div
                key={i}
                className="bg-surface border border-border-subtle rounded-lg p-5 flex items-start gap-4"
              >
                <div className="w-9 h-9 rounded-lg bg-surface-elevated flex items-center justify-center flex-shrink-0">
                  <step.icon className="w-4 h-4 text-text-tertiary" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-text-primary mb-1">{step.title}</p>
                  <p className="text-xs text-text-tertiary leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-border-subtle mt-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Leaf className="w-4 h-4 text-text-tertiary" />
            <span className="text-sm text-text-tertiary">CropIntel</span>
          </div>
          <p className="text-xs text-text-tertiary">
            Powered by MobileNetV2 · Plant Disease Identification
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App
