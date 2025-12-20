<script setup lang="ts">
import { toTypedSchema } from '@vee-validate/zod'
import { useForm } from 'vee-validate'
import * as z from 'zod'
import { AutoForm } from '@/components/ui/auto-form'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/stores/auth.store'
import { ref } from 'vue'

const { forgotPassword, resetPassword } = useAuthStore()
const emit = defineEmits(['back-to-login'])

const step = ref(1) // 1: Email, 2: OTP + New Password
const userEmail = ref('')
const isLoading = ref(false)
const errorMessage = ref('')

// Schema for Step 1
const schemaStep1 = z.object({
    email: z.string().email({ message: 'Invalid email address' }),
})

const formStep1 = useForm({
    validationSchema: toTypedSchema(schemaStep1),
})

async function onSubmitStep1(values: Record<string, any>) {
    isLoading.value = true
    errorMessage.value = ''
    const email = values.email as string
    const success = await forgotPassword({ email })
    isLoading.value = false

    if (success) {
        userEmail.value = email
        step.value = 2
    } else {
        errorMessage.value = 'Failed to send OTP. Please check your email.'
    }
}

// Schema for Step 2
const schemaStep2 = z.object({
    otp: z.string().min(6, { message: 'OTP must be at least 6 characters' }),
    newPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
    confirmPassword: z.string().min(6, { message: 'Password must be at least 6 characters' }),
}).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
});

const formStep2 = useForm({
    validationSchema: toTypedSchema(schemaStep2),
})

async function onSubmitStep2(values: Record<string, any>) {
    isLoading.value = true
    errorMessage.value = ''
    const otp = values.otp as string
    const newPassword = values.newPassword as string

    const success = await resetPassword({
        email: userEmail.value,
        otp,
        newPassword
    })
    isLoading.value = false

    if (success) {
        emit('back-to-login')
    } else {
        errorMessage.value = 'Failed to reset password. Invalid OTP or expired.'
    }
}
</script>

<template>
    <div class="flex flex-col items-center justify-center">
        <h1 class="text-4xl dark:text-gray-200 mb-2">Reset Password</h1>
        <p v-if="step === 2" class="text-sm text-gray-400 mb-6">OTP sent to: {{ userEmail }}</p>

        <!-- Step 1 Form -->
        <AutoForm v-if="step === 1" class="w-2xs space-y-6" :schema="schemaStep1" :form="formStep1"
            @submit="onSubmitStep1" :field-config="{
                email: {
                    hideLabel: true,
                    inputProps: {
                        type: 'text',
                        class: 'dark:border-gray-50 dark:text-gray-50 ',
                        placeholder: 'Enter your email',
                    },
                },
            }">
            <div v-if="errorMessage" class="text-red-500 text-sm text-center">{{ errorMessage }}</div>
            <Button class="w-xs space-y-6 bg-blue-500 hover:bg-blue-600 text-gray-50" type="submit"
                :disabled="isLoading">
                {{ isLoading ? 'Sending...' : 'Send OTP' }}
            </Button>
        </AutoForm>

        <!-- Step 2 Form -->
        <AutoForm v-else class="w-2xs space-y-6" :schema="schemaStep2" :form="formStep2" @submit="onSubmitStep2"
            :field-config="{
                otp: {
                    hideLabel: true,
                    inputProps: {
                        type: 'text',
                        class: 'dark:border-gray-50 dark:text-gray-50',
                        placeholder: 'Enter OTP sent to your email',
                    }
                },
                newPassword: {
                    hideLabel: true,
                    inputProps: {
                        type: 'password',
                        class: 'dark:border-gray-50 dark:text-gray-50',
                        placeholder: 'New Password',
                    },
                },
                confirmPassword: {
                    hideLabel: true,
                    inputProps: {
                        type: 'password',
                        class: 'dark:border-gray-50 dark:text-gray-50',
                        placeholder: 'Confirm New Password',
                    },
                },
            }">
            <div v-if="errorMessage" class="text-red-500 text-sm text-center">{{ errorMessage }}</div>
            <Button class="w-xs space-y-6 bg-blue-500 hover:bg-blue-600 text-gray-50" type="submit"
                :disabled="isLoading">
                {{ isLoading ? 'Resetting...' : 'Reset Password' }}
            </Button>
        </AutoForm>

        <p class="text-center w-80 cursor-pointer dark:text-gray-50 mt-4">
            <a @click="emit('back-to-login')"
                class="top-layout w-90 mx-2 no-underline text-blue-500 hover:text-blue-400">
                Back to Login
            </a>
        </p>
    </div>
</template>
