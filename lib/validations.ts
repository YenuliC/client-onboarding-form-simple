import { z } from 'zod'

export const onboardingFormSchema = z.object({
  fullName: z
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .max(80, 'Full name must be no more than 80 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Full name can only contain letters, spaces, hyphens, and apostrophes'),
  email: z
    .string()
    .email('Please enter a valid email address'),
  companyName: z
    .string()
    .min(2, 'Company name must be at least 2 characters')
    .max(100, 'Company name must be no more than 100 characters'),
  services: z
    .array(z.string())
    .min(1, 'Please select at least one service'),
  budgetUsd: z
    .number()
    .int('Budget must be a whole number')
    .min(100, 'Budget must be at least $100')
    .max(1000000, 'Budget cannot exceed $1,000,000')
    .optional(),
  projectStartDate: z
    .string()
    .refine((date) => {
      const selectedDate = new Date(date)
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      return selectedDate >= today
    }, 'Project start date must be today or later'),
  acceptTerms: z
    .boolean()
    .refine((val) => val === true, 'You must accept the terms and conditions'),
})

export type OnboardingFormData = z.infer<typeof onboardingFormSchema>
