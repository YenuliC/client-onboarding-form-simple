'use client'

import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { onboardingFormSchema, type OnboardingFormData } from '@/lib/validations'

const services = [
  { id: 'UI/UX', label: 'UI/UX Design' },
  { id: 'Branding', label: 'Branding' },
  { id: 'Web Dev', label: 'Web Development' },
  { id: 'Mobile App', label: 'Mobile App Development' },
]

export default function OnboardingForm() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null
    message: string
    data?: OnboardingFormData
  }>({ type: null, message: '' })

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    watch,
    setValue,
    reset,
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingFormSchema),
    defaultValues: {
      fullName: '',
      email: '',
      companyName: '',
      services: [],
      budgetUsd: undefined,
      projectStartDate: '',
      acceptTerms: false,
    },
    mode: 'onSubmit',
  })

  const watchedServices = watch('services')

  const handleServiceChange = (serviceId: string, checked: boolean) => {
    const current = watchedServices || []
    if (checked) {
      if (!current.includes(serviceId as any)) {
        setValue('services', [...current, serviceId as any], { shouldDirty: true })
      }
    } else {
      setValue('services', current.filter(id => id !== serviceId), { shouldDirty: true })
    }
  }

  const onSubmit = async (data: OnboardingFormData) => {
    setIsSubmitting(true)
    setSubmitStatus({ type: null, message: '' })
  
    try {
      const endpoint = process.env.NEXT_PUBLIC_ONBOARD_URL
      if (!endpoint) {
        throw new Error('Missing NEXT_PUBLIC_ONBOARD_URL. Please set it in your environment.')
      }
  
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
  
      if (response.ok) {
        const resData = await response.json() // get API's "OK" + data
        setSubmitStatus({
          type: 'success',
          message: resData?.message || 'Form submitted successfully!',
          data,
        })
        reset()
      } else {
        let message = `Error: ${response.status} ${response.statusText}`
        try {
          const errorData = await response.json()
          if (errorData?.message) message = errorData.message
        } catch {}
        setSubmitStatus({ type: 'error', message })
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message: error instanceof Error ? error.message : 'Network error occurred',
      })
    } finally {
      setIsSubmitting(false)
    }
  }
  

  const getTodayString = () => {
    const today = new Date()
    const yyyy = today.getFullYear()
    const mm = String(today.getMonth() + 1).padStart(2, '0')
    const dd = String(today.getDate()).padStart(2, '0')
    return `${yyyy}-${mm}-${dd}`
  }

  const handleResetForm = () => {
    setSubmitStatus({ type: null, message: '' })
    reset()
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-indigo-600 px-6 py-8">
            <h1 className="text-3xl font-bold text-white text-center">
              Client Onboarding Form
            </h1>
            <p className="mt-2 text-indigo-100 text-center">
              {isSubmitting ? 'Submitting your information...' : "Tell us about your project and we'll get back to you within 24 hours"}
            </p>
          </div>

          {/* Form */}
          <div className="px-6 py-8">
            {submitStatus.type === 'success' ? (
              <div className="text-center animate-in fade-in duration-500">
                <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6 animate-in zoom-in duration-300">
                  <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Form Submitted Successfully! 🎉</h3>
                <p className="text-gray-600 mb-6">Thank you for your submission. We'll be in touch within 24 hours!</p>
                {submitStatus.data && (
                  <div className="bg-gray-50 rounded-lg p-4 text-left mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Submitted Information:</h4>
                    <dl className="space-y-1 text-sm text-gray-600">
                      <div><dt className="inline font-medium">Name:</dt> {submitStatus.data.fullName}</div>
                      <div><dt className="inline font-medium">Email:</dt> {submitStatus.data.email}</div>
                      <div><dt className="inline font-medium">Company:</dt> {submitStatus.data.companyName}</div>
                      <div><dt className="inline font-medium">Services:</dt> {submitStatus.data.services.join(', ')}</div>
                      {'budgetUsd' in submitStatus.data && submitStatus.data.budgetUsd !== undefined && (
                        <div><dt className="inline font-medium">Budget:</dt> ${submitStatus.data.budgetUsd.toLocaleString()}</div>
                      )}
                      <div><dt className="inline font-medium">Start Date:</dt> {submitStatus.data.projectStartDate}</div>
                    </dl>
                  </div>
                )}
                <button
                  onClick={handleResetForm}
                  className="btn-primary max-w-xs"
                >
                  Submit Another Form
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit)}
                className={`space-y-6 transition-opacity duration-200 ${isSubmitting ? 'opacity-75' : 'opacity-100'}`}
                aria-live="polite"
              >
                {/* Global error (non-2xx/network) */}
                {submitStatus.type === 'error' && (
                  <div className="bg-red-50 border border-red-200 rounded-md p-4 animate-in slide-in-from-top duration-300" role="alert">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <h4 className="text-sm font-medium text-red-800">Submission Error</h4>
                        <p className="text-sm text-red-700 mt-1">
                          {submitStatus.message}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label htmlFor="fullName" className="form-label">
                    Full Name *
                  </label>
                  <input
                    id="fullName"
                    type="text"
                    {...register('fullName')}
                    className={`form-input ${errors.fullName ? 'error' : ''}`}
                    placeholder="Enter your full name"
                    aria-describedby={errors.fullName ? 'fullName-error' : undefined}
                    disabled={isSubmitting}
                    autoComplete="name"
                  />
                  {errors.fullName && (
                    <p id="fullName-error" className="form-error">
                      {errors.fullName.message}
                    </p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="form-label">
                    Email Address *
                  </label>
                  <input
                    id="email"
                    type="email"
                    {...register('email')}
                    className={`form-input ${errors.email ? 'error' : ''}`}
                    placeholder="Enter your email address"
                    aria-describedby={errors.email ? 'email-error' : undefined}
                    disabled={isSubmitting}
                    autoComplete="email"
                  />
                  {errors.email && (
                    <p id="email-error" className="form-error">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                {/* Company Name */}
                <div>
                  <label htmlFor="companyName" className="form-label">
                    Company Name *
                  </label>
                  <input
                    id="companyName"
                    type="text"
                    {...register('companyName')}
                    className={`form-input ${errors.companyName ? 'error' : ''}`}
                    placeholder="Enter your company name"
                    aria-describedby={errors.companyName ? 'companyName-error' : undefined}
                    disabled={isSubmitting}
                    autoComplete="organization"
                  />
                  {errors.companyName && (
                    <p id="companyName-error" className="form-error">
                      {errors.companyName.message}
                    </p>
                  )}
                </div>

                {/* Services Interested In */}
                <div>
                  <span className="form-label">Services Interested In *</span>
                  <div className="checkbox-group">
                    {services.map((service) => (
                      <div key={service.id} className="checkbox-item">
                        <input
                          id={service.id}
                          type="checkbox"
                          className="checkbox-input"
                          checked={watchedServices.includes(service.id as any)}
                          onChange={(e) => handleServiceChange(service.id, e.target.checked)}
                          aria-describedby={errors.services ? 'services-error' : undefined}
                          disabled={isSubmitting}
                        />
                        <label htmlFor={service.id} className="checkbox-label">
                          {service.label}
                        </label>
                      </div>
                    ))}
                  </div>
                  {errors.services && (
                    <p id="services-error" className="form-error">
                      {errors.services.message}
                    </p>
                  )}
                </div>

                {/* Budget */}
                <div>
                  <label htmlFor="budgetUsd" className="form-label">
                    Budget (USD) — Optional
                  </label>
                  <input
                    id="budgetUsd"
                    type="number"
                    {...register('budgetUsd', { valueAsNumber: true })}
                    className={`form-input ${errors.budgetUsd ? 'error' : ''}`}
                    placeholder="Enter your budget (100 - 1,000,000)"
                    min="100"
                    max="1000000"
                    step="1"
                    aria-describedby={errors.budgetUsd ? 'budgetUsd-error' : undefined}
                    disabled={isSubmitting}
                    inputMode="numeric"
                  />
                  {errors.budgetUsd && (
                    <p id="budgetUsd-error" className="form-error">
                      {errors.budgetUsd.message}
                    </p>
                  )}
                  <p className="text-xs text-gray-500 mt-1">
                    Enter amount between $100 and $1,000,000 (whole numbers only)
                  </p>
                </div>

                {/* Project Start Date */}
                <div>
                  <label htmlFor="projectStartDate" className="form-label">
                    Project Start Date *
                  </label>
                  <input
                    id="projectStartDate"
                    type="date"
                    {...register('projectStartDate')}
                    className={`form-input ${errors.projectStartDate ? 'error' : ''}`}
                    min={getTodayString()}
                    aria-describedby={errors.projectStartDate ? 'projectStartDate-error' : undefined}
                    disabled={isSubmitting}
                  />
                  {errors.projectStartDate && (
                    <p id="projectStartDate-error" className="form-error">
                      {errors.projectStartDate.message}
                    </p>
                  )}
                </div>

                {/* Accept Terms */}
                <div>
                  <div className="checkbox-item">
                    <input
                      id="acceptTerms"
                      type="checkbox"
                      {...register('acceptTerms')}
                      className="checkbox-input"
                      aria-describedby={errors.acceptTerms ? 'acceptTerms-error' : undefined}
                      disabled={isSubmitting}
                    />
                    <label htmlFor="acceptTerms" className="checkbox-label">
                      I accept the terms and conditions *
                    </label>
                  </div>
                  {errors.acceptTerms && (
                    <p id="acceptTerms-error" className="form-error">
                      {errors.acceptTerms.message}
                    </p>
                  )}
                </div>

                {/* Submit Button */}
                {isSubmitting && (
                  <div className="text-center text-sm text-gray-500 mb-4">
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin h-4 w-4 mr-2 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing your submission...
                    </div>
                  </div>
                )}
                <button
                  type="submit"
                  disabled={isSubmitting || !isDirty}
                  className={`btn-primary transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${!isDirty ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isSubmitting ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Submitting...
                    </div>
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg className="mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Submit Form
                    </div>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
